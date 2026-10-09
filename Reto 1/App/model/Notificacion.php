<?php
    require_once ("Usuario.php");
    require_once ("Estado.php");

class Notificacion extends Usuario
{

    private int $idNotificacion;
    private string $titulo;
    private string $descripcion;
    private DateTime $fecha;
    private Estado $estado;


    public function __construct(int $idNotificacion, string $titulo, string $descripcion, DateTime $fecha, Estado $estado)
    {
        $this->idNotificacion = $idNotificacion;
        $this->titulo = $titulo;
        $this->descripcion = $descripcion;
        $this->fecha = $fecha;
        $this->estado = $estado;
        parent::__construct($idNotificacion);
    }

    

    /**
     * Get the value of id
     *
     * @return int
     */
    public function getIdNotificacion(): int {
        return $this->idNotificacion;
    }

    /**
     * Set the value of id
     *
     * @param int $id
     *
     * @return self
     */
    public function setIdNotificacion(int $idNotificacion): self {
        $this->idNotificacion = $idNotificacion;
        return $this;
    }

    /**
     * Get the value of titulo
     *
     * @return string
     */
    public function getTitulo(): string {
        return $this->titulo;
    }

    /**
     * Set the value of titulo
     *
     * @param string $titulo
     *
     * @return self
     */
    public function setTitulo(string $titulo): self {
        $this->titulo = $titulo;
        return $this;
    }

    /**
     * Get the value of descripcion
     *
     * @return string
     */
    public function getDescripcion(): string {
        return $this->descripcion;
    }

    /**
     * Set the value of descripcion
     *
     * @param string $descripcion
     *
     * @return self
     */
    public function setDescripcion(string $descripcion): self {
        $this->descripcion = $descripcion;
        return $this;
    }

    /**
     * Get the value of fecha
     *
     * @return DateTime
     */
    public function getFecha(): DateTime {
        return $this->fecha;
    }

    /**
     * Set the value of fecha
     *
     * @param DateTime $fecha
     *
     * @return self
     */
    public function setFecha(DateTime $fecha): self {
        $this->fecha = $fecha;
        return $this;
    }


    /**
     * Get the value of estado
     *
     * @return Estado
     */
    public function getEstado(): Estado {
        return $this->estado;
    }

    /**
     * Set the value of estado
     *
     * @param Estado $estado
     *
     * @return self
     */
    public function setEstado(Estado $estado): self {
        $this->estado = $estado;
        return $this;
    }

    // Mostrar
    public function mostrarInfo()
    {
        echo ("ID: " . $this->idNotificacion . "<br>");
        echo ("Nombre: " . $this->titulo . "<br>");
        echo ("Descripcion: " . $this->descripcion . "<br>");
        echo ("Fecha: " . $this->fecha->format('Y-m-d H:i:s') . "<br>");
        echo ("Estado: " . $this->estado->value . "<br>");
    }
}
?>