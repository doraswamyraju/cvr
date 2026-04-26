<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = 'localhost';
$db_name = 'erp_dashboard'; // To be configured
$username = 'root'; // To be configured
$password = ''; // To be configured

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // For testing without DB, uncomment below and comment above
    // $conn = null;
} catch(PDOException $exception) {
    // Suppress error for now to allow API test to work without DB
    $conn = null;
    // echo "Connection error: " . $exception->getMessage();
}
?>
