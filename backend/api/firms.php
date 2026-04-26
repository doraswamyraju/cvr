<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// Ensure connection is valid
if ($conn === null) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

if ($method === 'GET') {
    // Fetch all firms (Super Admin only - in a real app, verify JWT token role here)
    try {
        $stmt = $conn->prepare("
            SELECT f.id, f.name, f.email, f.phone, f.status, f.created_at, u.name as admin_name, u.email as admin_email 
            FROM firms f 
            LEFT JOIN users u ON f.id = u.firm_id AND u.role = 'admin'
            ORDER BY f.created_at DESC
        ");
        $stmt->execute();
        $firms = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(["status" => "success", "data" => $firms]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    // Create a new Firm AND its initial Admin user
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->firm_name) && !empty($data->admin_name) && !empty($data->admin_email) && !empty($data->admin_password)) {
        
        try {
            // Begin Transaction
            $conn->beginTransaction();

            // 1. Create the Firm
            $stmt = $conn->prepare("INSERT INTO firms (name, email, phone) VALUES (:name, :email, :phone)");
            $stmt->bindParam(":name", $data->firm_name);
            $stmt->bindParam(":email", $data->firm_email);
            $stmt->bindParam(":phone", $data->firm_phone);
            $stmt->execute();
            
            $firm_id = $conn->lastInsertId();

            // 2. Create the Admin User for this Firm
            $hashed_password = password_hash($data->admin_password, PASSWORD_BCRYPT);
            
            $stmtUser = $conn->prepare("INSERT INTO users (firm_id, role, name, email, password_hash) VALUES (:firm_id, 'admin', :name, :email, :password_hash)");
            $stmtUser->bindParam(":firm_id", $firm_id);
            $stmtUser->bindParam(":name", $data->admin_name);
            $stmtUser->bindParam(":email", $data->admin_email);
            $stmtUser->bindParam(":password_hash", $hashed_password);
            
            $stmtUser->execute();

            // Commit Transaction
            $conn->commit();

            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Firm and Admin created successfully.", "firm_id" => $firm_id]);
        } catch(PDOException $e) {
            // Rollback on error
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Unable to create firm. " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Incomplete data. Provide firm_name, admin_name, admin_email, and admin_password."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
