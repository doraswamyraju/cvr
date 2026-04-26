<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($conn === null) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

if ($method === 'GET') {
    $firm_id = isset($_GET['firm_id']) ? intval($_GET['firm_id']) : null;
    
    if (!$firm_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "firm_id is required"]);
        exit();
    }

    try {
        $stmt = $conn->prepare("SELECT * FROM incoming_register WHERE firm_id = :firm_id ORDER BY date DESC, created_at DESC");
        $stmt->bindParam(":firm_id", $firm_id);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $results]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->date) && !empty($data->sender_name) && !empty($data->firm_id)) {
        try {
            $stmt = $conn->prepare("INSERT INTO incoming_register (firm_id, date, sender_name, received_by, description, status) VALUES (:firm_id, :date, :sender_name, :received_by, :description, :status)");
            
            $stmt->bindParam(":firm_id", $data->firm_id);
            $stmt->bindParam(":date", $data->date);
            $stmt->bindParam(":sender_name", $data->sender_name);
            
            $received_by = $data->received_by ?? null;
            $stmt->bindParam(":received_by", $received_by);
            
            $desc = $data->description ?? null;
            $stmt->bindParam(":description", $desc);
            
            $status = $data->status ?? 'received';
            $stmt->bindParam(":status", $status);
            
            $stmt->execute();
            
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Entry added successfully"]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Incomplete data"]);
    }
}
?>
