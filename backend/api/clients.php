<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

// Handle Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// Check connection
if ($conn === null) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

if ($method === 'GET') {
    $firm_id = isset($_GET['firm_id']) ? intval($_GET['firm_id']) : null;
    
    if (!$firm_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "firm_id is required to fetch clients."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("SELECT id, company_name, contact_person, email, phone, address, service_details, created_at FROM clients WHERE firm_id = :firm_id ORDER BY created_at DESC");
        $stmt->bindParam(":firm_id", $firm_id);
        $stmt->execute();
        
        $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Add a mock status field since it wasn't in original DB but is requested in UI
        foreach ($clients as &$client) {
            $client['status'] = 'active'; // Defaulting for now
            $client['services'] = $client['service_details'] ? json_decode($client['service_details'], true) : [];
        }
        
        echo json_encode(["status" => "success", "data" => $clients]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->company_name) && !empty($data->firm_id)) {
        try {
            $service_details = isset($data->services) ? json_encode($data->services) : json_encode([]);
            
            $stmt = $conn->prepare("INSERT INTO clients (firm_id, company_name, contact_person, email, phone, address, service_details) VALUES (:firm_id, :company_name, :contact_person, :email, :phone, :address, :service_details)");
            
            $stmt->bindParam(":firm_id", $data->firm_id);
            $stmt->bindParam(":company_name", $data->company_name);
            
            $contact_person = $data->contact_person ?? null;
            $stmt->bindParam(":contact_person", $contact_person);
            
            $email = $data->email ?? null;
            $stmt->bindParam(":email", $email);
            
            $phone = $data->phone ?? null;
            $stmt->bindParam(":phone", $phone);
            
            $address = $data->address ?? null;
            $stmt->bindParam(":address", $address);
            
            $stmt->bindParam(":service_details", $service_details);
            
            $stmt->execute();
            
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Client created successfully", "client_id" => $conn->lastInsertId()]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Unable to save client. " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Company name and firm_id are required."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
