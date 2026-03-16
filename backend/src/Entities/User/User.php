<?php

class User
{
    private $id;
    private $pseudo;
    private $email;
    private $age;
    private $password;

    public function __construct(int $id, string $pseudo, string $email, int $age, string $password)
    {
        $this->id = $id;
        $this->pseudo = $pseudo;
        $this->email = $email;
        $this->age = $age;
        $this->password = $password;
    }

    public function getID()
    {
        return $this->id;
    }

    public function setID($id)
    {
        $this->id = $id;
    }


    public function getPseudo()
    {
        return $this->pseudo;
    }

    public function setPseudo($pseudo)
    {
        $this->pseudo = $pseudo;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getAge()
    {
        return $this->age;
    }

    public function setAge($age)
    {
        $this->age = $age;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }
}
