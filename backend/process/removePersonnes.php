<?php
require_once "../connexion/database.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data["id"];

    $stmt = $conn->prepare("DELETE FROM `personnes` WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode(["personne_deleted" => true]);
}
