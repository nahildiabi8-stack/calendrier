<?php
$conn = new mysqli("localhost", "root", "", "calendrier");

if ($conn->connect_error) {
    die("Connexion échouée: " . $conn->connect_error);
}