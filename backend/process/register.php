<?php
require_once "../connexion/database.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $pseudo = $data["pseudo"];
    $email = $data["email"];
    $age = $data["age"];
    $password = password_hash($data["password"], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (pseudo, email, age, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $pseudo, $email, $age, $password);
    $stmt->execute();

   echo json_encode(["user_created" => true]);
}
