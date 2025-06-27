<?php
require_once 'db_connect.php';

echo "<div class='admin-container'>";
echo "<h2>Admin Panel - View All Bookings</h2>";

try {
    $stmt = $pdo->query("SELECT * FROM bookings ORDER BY start_time");
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($bookings) > 0) {
        echo "<table>";
        echo "<tr>
                <th>Name</th>
                <th>Course</th>
                <th>Role</th>
                <th>Phone Number</th>
                <th>Item</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>";

        foreach ($bookings as $booking) {
            $startFormatted = date("Y-m-d H:i", $booking['start_time']);
            $endFormatted = date("Y-m-d H:i", $booking['end_time']);

            echo "<tr>
                    <td>" . htmlspecialchars($booking['name']) . "</td>
                    <td>" . htmlspecialchars($booking['course']) . "</td>
                    <td>" . htmlspecialchars($booking['role']) . "</td>
                    <td>" . htmlspecialchars($booking['phone_number']) . "</td>
                    <td>" . htmlspecialchars($booking['item']) . "</td>
                    <td>" . htmlspecialchars($startFormatted) . "</td>
                    <td>" . htmlspecialchars($endFormatted) . "</td>
                    <td>" . htmlspecialchars($booking['purpose']) . "</td>
                    <td>
                        <button class='remove-btn' data-id='" . $booking['id'] . "'>Return</button>
                    </td>
                  </tr>";
        }

        echo "</table>";
    } else {
        echo "<p>No bookings found.</p>";
    }
} catch (PDOException $e) {
    error_log("view_bookings.php: Failed to fetch bookings: " . $e->getMessage());
    echo "<p>Error loading bookings: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "</div>";
?>