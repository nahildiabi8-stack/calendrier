<?php
session_start();

require_once "../connexion/database.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $pseudo = $data["pseudo"];


    $stmt = $conn->prepare("SELECT * FROM users WHERE pseudo = ?");
    $stmt->bind_param("s", $pseudo);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    $_SESSION["user_id"] = $user["id"];

    if ($user == null) {
        echo json_encode(["user_loggedin" => false, "error" => "Utilisateur non trouvé"]);
    } else if (password_verify($data["password"], $user["password"])) {
        echo json_encode(["user_loggedin" => true, "user_id" => $user["id"]]);
    } else {
        echo json_encode(["user_loggedin" => false, "error" => "Mot de passe incorrect"]);
    }
}
