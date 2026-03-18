<?php
require_once "../connexion/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id          = $data['id'];
$jour        = $data['jour'];
$mois        = $data['mois'];
$annee       = $data['annee'];
$jour_fin    = $data['jour_fin']    ?? $data['jour'];
$mois_fin    = $data['mois_fin']    ?? $data['mois'];
$annee_fin   = $data['annee_fin']   ?? $data['annee'];
$heure_debut = $data['heure_debut'] ?? null;
$heure_fin   = $data['heure_fin']   ?? null;

$stmt = $conn->prepare("UPDATE evenements SET 
  jour=?, mois=?, annee=?,
  jour_fin=?, mois_fin=?, annee_fin=?,
  heure_debut=?, heure_fin=?
  WHERE id=?");
$stmt->bind_param("iiiiiissi", $jour, $mois, $annee, $jour_fin, $mois_fin, $annee_fin, $heure_debut, $heure_fin, $id);
$stmt->execute();

echo json_encode(["success" => true]);

$stmt->close();
$conn->close();