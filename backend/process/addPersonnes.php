<?php
require_once "../connexion/database.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $nom = $data["nom"];
    $user_id = $data["user_id"];

    $stmt = $conn->prepare("INSERT INTO personnes (nom, user_id) VALUES (?, ?)");
    $stmt->bind_param("si", $nom,  $user_id);
    $stmt->execute();

    echo json_encode(["personne_created" => true]);
}
