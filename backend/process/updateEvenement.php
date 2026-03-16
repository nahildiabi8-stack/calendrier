<?php
require_once "../connexion/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$texte = $data["texte"];

$stmt = $conn->prepare("UPDATE evenements SET texte = ? WHERE id = ?");
$stmt->bind_param("si", $texte, $id);
$stmt->execute();

echo json_encode(["success" => true]);

$stmt->close();
$conn->close();