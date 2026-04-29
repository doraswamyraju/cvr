<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
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

// Map of allowed master types to their respective tables
$allowed_masters = [
    'bank' => 'master_banks',
    'area' => 'master_areas',
    'unit' => 'master_units',
    'department' => 'master_departments',
    'designation' => 'master_designations',
    'service_group' => 'master_service_groups',
    'service_category' => 'master_service_categories',
    'education' => 'master_education',
    'occupation' => 'master_occupations',
    'religion' => 'master_religions',
    'relation' => 'master_relations'
];

$type = $_GET['type'] ?? '';
if (!array_key_exists($type, $allowed_masters)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid master type: " . $type]);
    exit();
}

$table = $allowed_masters[$type];

if ($method === 'GET') {
    $firm_id = isset($_GET['firm_id']) ? intval($_GET['firm_id']) : null;
    
    if (!$firm_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "firm_id is required."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("SELECT id, name, status FROM $table WHERE firm_id = :firm_id ORDER BY name ASC");
        $stmt->bindParam(":firm_id", $firm_id);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $items]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->name) && !empty($data->firm_id)) {
        try {
            $stmt = $conn->prepare("INSERT INTO $table (firm_id, name, status) VALUES (:firm_id, :name, :status)");
            $stmt->bindParam(":firm_id", $data->firm_id);
            $stmt->bindParam(":name", $data->name);
            $status = $data->status ?? 'active';
            $stmt->bindParam(":status", $status);
            $stmt->execute();
            
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Item created successfully", "id" => $conn->lastInsertId()]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Unable to save item. " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name and firm_id are required."]);
    }
}
elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->id) && !empty($data->name)) {
        try {
            $stmt = $conn->prepare("UPDATE $table SET name = :name, status = :status WHERE id = :id");
            $stmt->bindParam(":name", $data->name);
            $status = $data->status ?? 'active';
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":id", $data->id);
            $stmt->execute();
            
            echo json_encode(["status" => "success", "message" => "Item updated successfully"]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Unable to update item. " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID and Name are required for update."]);
    }
}
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        try {
            $stmt = $conn->prepare("DELETE FROM $table WHERE id = :id");
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            echo json_encode(["status" => "success", "message" => "Item deleted successfully"]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Unable to delete item. " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID is required for deletion."]);
    }
}
else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
