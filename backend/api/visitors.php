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
        $stmt = $conn->prepare("SELECT * FROM visitor_register WHERE firm_id = :firm_id ORDER BY date DESC, created_at DESC");
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

    if (!empty($data->date) && !empty($data->visitor_name) && !empty($data->firm_id)) {
        try {
            $stmt = $conn->prepare("INSERT INTO visitor_register (firm_id, date, visitor_name, purpose, entry_time, exit_time) VALUES (:firm_id, :date, :visitor_name, :purpose, :entry_time, :exit_time)");
            
            $stmt->bindParam(":firm_id", $data->firm_id);
            $stmt->bindParam(":date", $data->date);
            $stmt->bindParam(":visitor_name", $data->visitor_name);
            
            $purpose = $data->purpose ?? null;
            $stmt->bindParam(":purpose", $purpose);
            
            $entry_time = $data->entry_time ?? null;
            $stmt->bindParam(":entry_time", $entry_time);
            
            $exit_time = $data->exit_time ?? null;
            $stmt->bindParam(":exit_time", $exit_time);
            
            $stmt->execute();
            
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Visitor added successfully"]);
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
