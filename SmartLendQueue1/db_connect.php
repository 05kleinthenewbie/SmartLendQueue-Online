<?php
// Database configuration
$host = 'localhost';
$dbname = 'smartlendqueue';
$username = 'root';
$password = ''; // Default XAMPP MySQL password is empty

// Enable error reporting (log only)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/borrow_system/SmartLendQueue/php_errors.log');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("db_connect.php: Database connection failed: " . $e->getMessage());
    header('Content-Type: text/plain');
    echo "Database connection failed: " . $e->getMessage();
    exit;
}
?>