<?php

class Usuario
{
    public const ROL_ADMIN = 'ADMIN';
    public const ROL_USER = 'USER';

    private ?int $idUsuario;
    private string $nombre;
    private string $apellidos;
    private string $nombreUsuario;
    private string $passwordHash;
    private string $rol;

    //constructor
    public function __construct(
        ?int $idUsuario = null,
        string $nombre = '',
        string $apellidos = '',
        string $nombreUsuario = '',
        string $passwordHash = '',
        string $rol = self::ROL_USER
    ) {
        $this->idUsuario = $idUsuario;
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->nombreUsuario = $nombreUsuario;
        $this->passwordHash = $passwordHash;
        $this->rol = $rol;
    }

    /**
     * Get the value of idUsuario
     *
     * @return ?int
     */
    public function getIdUsuario(): ?int {
        return $this->idUsuario;
    }

    /**
     * Set the value of idUsuario
     *
     * @param ?int $idUsuario
     *
     * @return self
     */
    public function setIdUsuario(?int $idUsuario): self {
        $this->idUsuario = $idUsuario;
        return $this;
    }

    /**
     * Get the value of nombre
     *
     * @return string
     */
    public function getNombre(): string {
        return $this->nombre;
    }

    /**
     * Set the value of nombre
     *
     * @param string $nombre
     *
     * @return self
     */
    public function setNombre(string $nombre): self {
        $this->nombre = $nombre;
        return $this;
    }

    /**
     * Get the value of apellidos
     *
     * @return string
     */
    public function getApellidos(): string {
        return $this->apellidos;
    }

    /**
     * Set the value of apellidos
     *
     * @param string $apellidos
     *
     * @return self
     */
    public function setApellidos(string $apellidos): self {
        $this->apellidos = $apellidos;
        return $this;
    }

    /**
     * Get the value of nombreUsuario
     *
     * @return string
     */
    public function getNombreUsuario(): string {
        return $this->nombreUsuario;
    }

    /**
     * Set the value of nombreUsuario
     *
     * @param string $nombreUsuario
     *
     * @return self
     */
    public function setNombreUsuario(string $nombreUsuario): self {
        $this->nombreUsuario = $nombreUsuario;
        return $this;
    }

    /**
     * Get the value of passwordHash
     *
     * @return string
     */
    public function getPasswordHash(): string {
        return $this->passwordHash;
    }

    /**
     * Set the value of passwordHash
     *
     * @param string $passwordHash
     *
     * @return self
     */
    public function setPasswordHash(string $passwordHash): self {
        $this->passwordHash = $passwordHash;
        return $this;
    }

    /**
     * Get the value of rol
     *
     * @return string
     */
    public function getRol(): string {
        return $this->rol;
    }

    /**
     * Set the value of rol
     *
     * @param string $rol
     *
     * @return self
     */
    public function setRol(string $rol): self {
        $this->rol = $rol;
        return $this;
    }

    /**
     * Check if the user has the ADMIN role
     *
     * @return bool
     */
    public function esAdmin(): bool {
        return $this->rol === self::ROL_ADMIN; // verifica si el rol del usuario es igual a ROL_ADMIN
    }

    /**
     * Check if the user has the USER role
     *
     * @return bool
     */
    public function esUser(): bool {
        return $this->rol === self::ROL_USER; // verifica si el rol del usuario es igual a ROL_USER
    }
}