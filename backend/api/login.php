<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

// Handle Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check connection
if ($conn === null) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    try {
        $query = "SELECT id, firm_id, role, name, email, password_hash, status FROM users WHERE email = :email LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":email", $data->email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Check if user is active
            if ($user['status'] !== 'active') {
                http_response_code(403);
                echo json_encode(["status" => "error", "message" => "Account is inactive or suspended."]);
                exit();
            }

            // Verify password
            if (password_verify($data->password, $user['password_hash'])) {
                // Generate a simple mock token (In production, use Firebase JWT or similar)
                $token = base64_encode(bin2hex(random_bytes(32)) . ':' . $user['id']);
                
                // Remove password hash from response
                unset($user['password_hash']);
                
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "message" => "Login successful",
                    "token" => $token,
                    "user" => $user
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["status" => "error", "message" => "Invalid credentials."]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid credentials."]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Server Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email and password are required."]);
}
?>
