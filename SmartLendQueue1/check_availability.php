<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
require_once 'db_connect.php';

$all_items = isset($_GET['all_items']) && $_GET['all_items'] === 'true';
$unavailable_items = [];

function sanitize_string($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

$start_time_str = sanitize_string($_GET['start_time'] ?? '');
$end_time_str = sanitize_string($_GET['end_time'] ?? '');

if (!$all_items && (!$start_time_str || !$end_time_str)) {
    error_log("check_availability.php: Missing start_time or end_time");
    echo json_encode($unavailable_items);
    exit;
}

$start_time = $all_items ? time() : strtotime($start_time_str);
$end_time = $all_items ? time() : strtotime($end_time_str);

if (!$all_items && ($start_time === false || $end_time === false || $start_time >= $end_time)) {
    error_log("check_availability.php: Invalid date/time - start: $start_time_str, end: $end_time_str");
    echo json_encode($unavailable_items);
    exit;
}

try {
    if ($all_items) {
        // List of all possible items
        $items = [
            'Projector', 'Chair', 'Microphones', 'Extension Wire',
            'Markers', 'Speakers', 'Amplifiers', 'Cords'
        ];
        $availability = array_fill_keys($items, 'available');

        // Check for active or future bookings
        $stmt = $pdo->prepare("
            SELECT item, start_time, end_time
            FROM bookings
            WHERE end_time > :current_time
        ");
        $stmt->execute(['current_time' => time()]);
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Item is unavailable if there's an active or future booking
            $availability[$row['item']] = 'unavailable';
        }
        echo json_encode($availability);
    } else {
        // Check for overlapping bookings for specific time range
        $stmt = $pdo->prepare("
            SELECT item
            FROM bookings
            WHERE NOT (end_time <= :start_time OR start_time >= :end_time)
        ");
        $stmt->execute(['start_time' => $start_time, 'end_time' => $end_time]);
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (!in_array($row['item'], $unavailable_items)) {
                $unavailable_items[] = $row['item'];
            }
        }
        echo json_encode($unavailable_items);
    }
} catch (PDOException $e) {
    error_log("check_availability.php: Failed to check availability: " . $e->getMessage());
    echo json_encode($all_items ? array_fill_keys($items, 'available') : $unavailable_items);
}
?>