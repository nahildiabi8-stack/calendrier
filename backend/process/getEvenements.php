<?php
require_once "../connexion/database.php";

$user_id = $_GET["user_id"];

$stmt = $conn->prepare("SELECT * FROM evenements WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$events = [];

while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);

$stmt->close();
$conn->close();