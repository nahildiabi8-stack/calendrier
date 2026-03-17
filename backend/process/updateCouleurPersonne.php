<?php

require_once "../connexion/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$personne_id = $data['personne_id'];
$color = $data['color'];
$user_id = $data['user_id'];

// Met à jour la personne
$stmt1 = $conn->prepare("UPDATE personnes SET color = ? WHERE id = ? AND user_id = ?");
$stmt1->execute([$color, $personne_id, $user_id]);

// Met à jour TOUS les événements de cette personne
$stmt2 = $conn->prepare("UPDATE evenements SET color = ? WHERE personne_id = ?");
$stmt2->execute([$color, $personne_id]);

echo json_encode(["success" => true]);