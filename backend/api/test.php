<?php
include_once '../config/db.php';

header('Content-Type: application/json');

$response = array(
    "status" => "success",
    "message" => "Backend API is running properly.",
    "db_connected" => $conn !== null
);

echo json_encode($response);
?>
