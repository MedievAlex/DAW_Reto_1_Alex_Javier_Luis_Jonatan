<?php

class Equipamiento
{

    //Atributos
    private ?int $idEquipamiento;
    private string $nombre;
    private string $descripcion;
    private string $marca;
    private string $modelo;
    private Categoria $categoria;
    private ?int $idUbicacionActual;
    //Constructor
    public function __construct(
        ?int $idEquipamiento,
        string $nombre,
        string $descripcion,
        string $marca,
        string $modelo,
        Categoria $categoria,
        ?int $idUbicacionActual
    ) {
        if ($idEquipamiento !== null && $idEquipamiento <= 0) {
            throw new InvalidArgumentException(
                "El identificador del equipamiento debe ser positivo."
            );
        }

        $this->idEquipamiento = $idEquipamiento;

        $this->setNombre($nombre);
        $this->setDescripcion($descripcion);
        $this->setMarca($marca);
        $this->setModelo($modelo);
        $this->setCategoria($categoria);
        $this->idUbicacionActual = $idUbicacionActual;
    }

    //Setters y Getters

    public function getIdEquipamiento(): ?int
    {
        return $this->idEquipamiento;
    }


    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): void
    {
        $nombre = trim($nombre);

        if ($nombre === "") {
            throw new InvalidArgumentException("El campo nombre no puede estar vacío.");
        } elseif (mb_strlen($nombre, 'UTF-8') > 120) {
            throw new InvalidArgumentException("El campo nombre no puede tener más de 120 caracteres.");
        } elseif (is_numeric($nombre)) {
            throw new InvalidArgumentException("El campo nombre no puede ser solo numérico.");
        }

        $this->nombre = $nombre;
    }

    public function getDescripcion(): string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): void
    {
        $descripcion = trim($descripcion);

        if ($descripcion === "") {
            throw new InvalidArgumentException("El campo descripción no puede estar vacío.");
        } elseif (mb_strlen($descripcion, 'UTF-8') > 255) {
            throw new InvalidArgumentException('El campo descripción no puede tener más de 255 caracteres.');
        }

        $this->descripcion = $descripcion;
    }

    public function getMarca(): string
    {
        return $this->marca;
    }

    public function setMarca(string $marca): void
    {
        $marca = trim($marca);

        if ($marca === "") {
            throw new InvalidArgumentException("El campo marca no puede estar vacío.");
        } elseif (mb_strlen($marca, 'UTF-8') > 100) {
            throw new InvalidArgumentException("El campo marca no puede tener más de 100 caracteres.");
        } elseif (is_numeric($marca)) {
            throw new InvalidArgumentException("El campo marca no puede ser solo numérico");
        }
        $this->marca = $marca;
    }

    public function getModelo(): string
    {
        return $this->modelo;
    }

    public function setModelo(string $modelo): void
    {
        $modelo = trim($modelo);
        if ($modelo === "") {
            throw new InvalidArgumentException("El campo modelo no puede estar vacío.");
        } elseif (mb_strlen($modelo, 'UTF-8') > 100) {
            throw new InvalidArgumentException('El campo modelo no puede tener más de 100 caracteres');
        }

        $this->modelo = $modelo;
    }

    public function getCategoria(): Categoria
    {
        return $this->categoria;
    }

    public function setCategoria(Categoria $categoria): void
    {
        $this->categoria = $categoria;
    }

    public function getIdUbicacionActual(): ?int
    {
        return $this->idUbicacionActual;
    }

    public function setIdUbicacionActual(?int $idUbicacionActual): void
    {
        if ($idUbicacionActual !== null && $idUbicacionActual <= 0) {
            throw new InvalidArgumentException("El identificador de ubicación debe ser positivo.");
        }

        $this->idUbicacionActual = $idUbicacionActual;
    }
}
