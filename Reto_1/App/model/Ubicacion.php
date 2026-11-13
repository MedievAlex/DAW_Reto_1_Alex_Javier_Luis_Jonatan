<?php
// ---------------------------------------- [ Definición de la clase ]
class Ubicacion
{
    // ---------------------------------------- [ ATRIBUTOS ]
    private int $ubi_id;
    private string $ubi_nombre;
    private string $ubi_descripcion;

    // ---------------------------------------- [ CONSTRUCTORES ]
    /**
     * Constructor de la clase Ubicacion.
     *
     * @param int $ubi_id ID de la Ubicacion
     * @param string $ubi_nombre NOMBRE de la Ubicacion
     * @param string $ubi_descripcion DESCRIPCION de la Ubicacion
     * 
     * @author Alex
     */
    public function __construct(int $ubi_id, string $ubi_nombre, string $ubi_descripcion)
    {
        $this->ubi_id = $ubi_id;
        $this->ubi_nombre = $ubi_nombre;
        $this->ubi_descripcion = $ubi_descripcion;
    }

    // ---------------------------------------- [ GETTERS ]
    /**
     * Funcion Get para obtener el ID.
     *
     * @return int $ubi_id ID del Objeto
     * 
     * @author Alex
     */
    public function getId(): int // Devuelve un int
    {
        return $this->ubi_id;
    }

    /**
     * Funcion Get para obtener el NOMBRE.
     *
     * @return string $ubi_nombre NOMBRE del Objeto
     * 
     * @author Alex
     */
    public function getNombre(): string // Devuelve un string
    {
        return $this->ubi_nombre;
    }

    /**
     * Funcion Get para obtener la DESCRIPCION.
     *
     * @return string $ubi_descripcion DESCRIPCION del Objeto
     * 
     * @author Alex
     */
    public function getDescripcion(): string // Devuelve un string
    {
        return $this->ubi_descripcion;
    }

    // ---------------------------------------- [ SETTERS ]
    // self - Cambia el valor y devuelve el objeto actualizado
    // void - Solo cambia el valor deseado
    /**
     * Funcion Set para modificar el ID.
     *
     * @param int $ubi_id ID nuevo del Objeto
     * @return void 
     * 
     * @author Alex
     */
    public function setId(int $ubi_id): void
    {
        $this->ubi_id = $ubi_id;
    }

    /**
     * Funcion Set para modificar el NOMBRE.
     *
     * @param string $ubi_nombre NOMBRE nuevo del Objeto
     * @return void
     * 
     * @author Alex
     */
    public function setNombre(string $ubi_nombre): void
    {
        $this->ubi_nombre = $ubi_nombre;
    }

    /**
     * Funcion Set para modificar la DESCRIPCION.
     *
     * @param string $ubi_descripcion DESCRIPCION nueva del Objeto
     * @return void
     * 
     * @author Alex
     */
    public function setDescripcion(string $ubi_descripcion): void
    {
        $this->ubi_descripcion = $ubi_descripcion;
    }

    // ---------------------------------------- [ FUNCIONES ]
    /**
     * Funcion para mostrar por consola los datos del Objeto.
     * 
     * @author Alex
     */
    public function mostrarInfo()
    {
        echo ("ID: " . $this->ubi_id . "<br>");
        echo ("Nombre: " . $this->ubi_nombre . "<br>");
        echo ("Descripcion: " . $this->ubi_descripcion . "<br>");
    }
}

?>