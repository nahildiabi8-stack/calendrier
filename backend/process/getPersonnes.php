<?php
session_start();

require_once "../connexion/database.php";

$user_id = $_GET["user_id"];

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $stmt = $conn->prepare("SELECT * FROM personnes WHERE user_id = ?");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $personnes = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($personnes);
}
