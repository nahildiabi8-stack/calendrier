<?php
require_once "../connexion/database.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data["user_id"];
    $jour = $data["jour"];
    $mois = $data["mois"];
    $annee = $data["annee"];
    $texte = $data["texte"];
    $personne_id = $data["personne_id"];
    $heure_debut = $data["heure_debut"];
    $heure_fin = $data["heure_fin"];

    $stmt = $conn->prepare("INSERT INTO evenements (user_id, personne_id, jour, mois, annee, texte, heure_debut, heure_fin)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiiisss", $user_id, $personne_id, $jour, $mois, $annee, $texte, $heure_debut, $heure_fin);
    $stmt->execute();

   echo json_encode([
    "success" => true,
    "id" => $stmt->insert_id
]);

$stmt->close();
$conn->close();
}
