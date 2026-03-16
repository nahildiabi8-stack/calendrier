<?php

require_once "../connexion/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id       = $data['id'];
$jour     = $data['jour'];
$mois     = $data['mois'];
$annee    = $data['annee'];
$jour_fin  = $data['jour_fin']  ?? $data['jour'];
$mois_fin  = $data['mois_fin']  ?? $data['mois'];
$annee_fin = $data['annee_fin'] ?? $data['annee'];

$stmt = $conn->prepare("UPDATE evenements SET 
  jour=?, mois=?, annee=?,
  jour_fin=?, mois_fin=?, annee_fin=?
  WHERE id=?");
$stmt->execute([$jour, $mois, $annee, $jour_fin, $mois_fin, $annee_fin, $id]);