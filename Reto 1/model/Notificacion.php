<?php
class Notificacion
{
    private int $id;
    private string $titulo;
    private string $descripcion;
    private DateTime $fecha;
    private Estado $estado;


    public function __construct(int $id, string $titulo, string $descripcion, DateTime $fecha, Estado $estado)
    {
        $this->id = $id;
        $this->titulo = $titulo;
        $this->descripcion = $descripcion;
        $this->fecha = $fecha;
        $this->estado = $estado;
    }

    

    /**
     * Get the value of id
     *
     * @return int
     */
    public function getId(): int {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @param int $id
     *
     * @return self
     */
    public function setId(int $id): self {
        $this->id = $id;
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
}
?>