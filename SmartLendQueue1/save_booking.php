<?php
header('Content-Type: text/plain');
require_once 'db_connect.php';

// Sanitize input
function sanitize_string($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

$name = sanitize_string($_POST['name'] ?? '');
$course = sanitize_string($_POST['course'] ?? '');
$phone_number = sanitize_string($_POST['phone_number'] ?? '');
$role = sanitize_string($_POST['role'] ?? '');
$item = sanitize_string($_POST['item'] ?? '');
$start_time = sanitize_string($_POST['start_time'] ?? '');
$end_time = sanitize_string($_POST['end_time'] ?? '');
$purpose = sanitize_string($_POST['purpose'] ?? '');

if (!$name || !$course || !$phone_number || !$role || !$item || !$start_time || !$end_time || !$purpose) {
    error_log("save_booking.php: Missing required fields");
    echo "Missing required fields";
    exit;
}

$start_timestamp = strtotime($start_time);
$end_timestamp = strtotime($end_time);

if ($start_timestamp === false || $end_timestamp === false || $start_timestamp >= $end_timestamp) {
    error_log("save_booking.php: Invalid date/time - start: $start_time, end: $end_time");
    echo "Invalid date/time";
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO bookings (name, course, role, phone_number, item, start_time, end_time, purpose)
        VALUES (:name, :course, :role, :phone_number, :item, :start_time, :end_time, :purpose)
    ");
    $stmt->execute([
        'name' => $name,
        'course' => $course,
        'role' => $role,
        'phone_number' => $phone_number,
        'item' => $item,
        'start_time' => $start_timestamp,
        'end_time' => $end_timestamp,
        'purpose' => $purpose
    ]);
    echo "success";
} catch (PDOException $e) {
    error_log("save_booking.php: Failed to save booking: " . $e->getMessage());
    echo "Failed to save booking: " . $e->getMessage();
}
?>