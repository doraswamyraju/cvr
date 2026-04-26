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
        echo json_encode(["status" => "error", "message" => "firm_id is required to fetch employees."]);
        exit();
    }

    try {
        // Fetch employees and join with users to get name and email
        $stmt = $conn->prepare("
            SELECT e.id, e.employee_code, e.department, e.designation, e.joining_date, u.name, u.email 
            FROM employees e
            JOIN users u ON e.user_id = u.id
            WHERE e.firm_id = :firm_id 
            ORDER BY e.created_at DESC
        ");
        $stmt->bindParam(":firm_id", $firm_id);
        $stmt->execute();
        
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $employees]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->firm_id)) {
        
        try {
            $conn->beginTransaction();

            // 1. Create User Login
            $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);
            
            $stmtUser = $conn->prepare("INSERT INTO users (firm_id, role, name, email, password_hash) VALUES (:firm_id, 'employee', :name, :email, :password_hash)");
            $stmtUser->bindParam(":firm_id", $data->firm_id);
            $stmtUser->bindParam(":name", $data->name);
            $stmtUser->bindParam(":email", $data->email);
            $stmtUser->bindParam(":password_hash", $hashed_password);
            $stmtUser->execute();
            
            $user_id = $conn->lastInsertId();

            // 2. Create Employee Record
            $stmtEmp = $conn->prepare("INSERT INTO employees (firm_id, user_id, employee_code, department, designation, joining_date, salary) VALUES (:firm_id, :user_id, :employee_code, :department, :designation, :joining_date, :salary)");
            
            $stmtEmp->bindParam(":firm_id", $data->firm_id);
            $stmtEmp->bindParam(":user_id", $user_id);
            
            $code = $data->employee_code ?? null;
            $stmtEmp->bindParam(":employee_code", $code);
            
            $dept = $data->department ?? null;
            $stmtEmp->bindParam(":department", $dept);
            
            $desig = $data->designation ?? null;
            $stmtEmp->bindParam(":designation", $desig);
            
            $join = $data->joining_date ?? null;
            $stmtEmp->bindParam(":joining_date", $join);
            
            $sal = $data->salary ?? null;
            $stmtEmp->bindParam(":salary", $sal);
            
            $stmtEmp->execute();

            $conn->commit();
            
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Employee created successfully"]);
        } catch(PDOException $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Unable to save employee. Email might already exist. " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name, Email, Password, and firm_id are required."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>
