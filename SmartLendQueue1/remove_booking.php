<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

ob_start();

$response = ["status" => "error", "message" => ""];

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if ($id === null || $id === false || $id <= 0) {
    $response["message"] = "Invalid booking ID";
    echo json_encode($response);
    ob_end_flush();
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = :id");
    $stmt->execute(['id' => $id]);

    if ($stmt->rowCount() > 0) {
        $response["status"] = "success";
        $response["message"] = "Booking removed successfully";
    } else {
        $response["message"] = "Booking not found";
    }
} catch (PDOException $e) {
    error_log("remove_booking.php: Failed to remove booking: " . $e->getMessage());
    $response["message"] = "Failed to remove booking: " . $e->getMessage();
}

echo json_encode($response);
ob_end_flush();
?>