<?php
// Definición de la clase
class Ubicaciones
{
    // Atributos
    private int $ubi_id;
    private string $ubi_nombre;
    private string $ubi_descripcion;

    // Constructores
    public function __construct(int $ubi_id, string $ubi_nombre, string $ubi_descripcion)
    {
        $this->ubi_id = $ubi_id;
        $this->ubi_nombre = $ubi_nombre;
        $this->ubi_descripcion = $ubi_descripcion;
    }

    // Getter
    public function getId(): int // Devuelve un int
    {
        return $this->ubi_id;
    }

    public function getNombre(): string // Devuelve un string
    {
        return $this->ubi_nombre;
    }
    
    public function getDescripcion(): string // Devuelve un string
    {
        return $this->ubi_descripcion;
    }

    // Setter
    // self - Cambia el valor y devuelve el objeto actualizado
    // void - Solo cambia el valor deseado
    public function setId(string $ubi_id): void 
    {
        $this->ubi_id = $ubi_id;
    }

    public function setNombre(string $ubi_nombre): void 
    {
        $this->ubi_nombre = $ubi_nombre;
    }

    public function setDescripcion(string $ubi_descripcion): void 
    {
        $this->ubi_descripcion = $ubi_descripcion;
    }

    // Mostrar
    public function mostrarInfo()
    {
        echo ("ID: " . $this->ubi_id . "<br>");
        echo ("Nombre: " . $this->ubi_nombre . "<br>");
        echo ("Descripcion: " . $this->ubi_descripcion . "<br>");
    }
}

?>