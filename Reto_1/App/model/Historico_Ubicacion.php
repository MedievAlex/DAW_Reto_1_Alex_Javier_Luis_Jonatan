<?php
// ---------------------------------------- [ Definición de la clase ]
class Historico_Ubicacion
{
    // ---------------------------------------- [ ATRIBUTOS ]
    private int $his_id;
    private int $his_equipamiento;
    private int $his_ubicacion;
    private DateTime $his_fecha_inicio;
    private DateTime $his_fecha_fin; // [Gestionar que si es idéntico a la fecha de inicio que no se muestre/registre]

    // ---------------------------------------- [ CONSTRUCTORES ]
    /**
     * Constructor de la clase Historico_Ubicacion.
     *
     * @param int $his_id ID del Historico Ubicacion
     * @param int $his_equipamiento ID EQUIPAMIENTO del Historico Ubicacion
     * @param int $his_ubicacion ID UBICACION del Historico Ubicacion
     * @param DateTime $his_fecha_inicio FECHA INICIO del Historico Ubicacion
     * 
     * @author Alex
     */
    public function __construct(int $his_id, int $his_equipamiento, int $his_ubicacion, DateTime $his_fecha_inicio)
    {
        $this->his_id = $his_id;
        $this->his_equipamiento = $his_equipamiento;
        $this->his_ubicacion = $his_ubicacion;
        $this->his_fecha_inicio = $his_fecha_inicio;
    }

    // ---------------------------------------- [ GETTERS ]
    /**
     * Funcion Get para obtener el ID.
     *
     * @return int $his_id ID del Objeto
     * 
     * @author Alex
     */
    public function getId(): int // Devuelve un int
    {
        return $this->his_id;
    }

    /**
     * Funcion Get para obtener el ID EQUIPAMIENTO.
     *
     * @return int $his_equipamiento ID EQUIPAMIENTO
     * 
     * @author Alex
     */
    public function getEquipamiento(): int // Devuelve un int
    {
        return $this->his_equipamiento;
    }
    
    /**
     * Funcion Get para obtener el ID UBICACION.
     *
     * @return int $his_ubicacion ID UBICACION
     * 
     * @author Alex
     */
    public function getUbicacion(): int // Devuelve un int
    {
        return $this->his_ubicacion;
    }

    /**
     * Funcion Get para obtener la FECHA INICIO.
     *
     * @return DateTime $his_fecha_inicio FECHA INICIO del objeto
     * 
     * @author Alex
     */
    public function getFechaInicio(): DateTime // Devuelve una fecha
    {
        return $this->his_fecha_inicio;
    }
    
    /**
     * Funcion Get para obtener la FECHA FIN.
     *
     * @return DateTime $his_fecha_fin FECHA FIN del objeto
     * 
     * @author Alex
     */
    public function getFechaFin(): DateTime // Devuelve una fecha
    {
        return $this->his_fecha_fin;
    }

    // ---------------------------------------- [ SETTERS ]
    // self - Cambia el valor y devuelve el objeto actualizado
    // void - Solo cambia el valor deseado
    /**
     * Funcion Set para modificar el ID.
     *
     * @param int $his_id ID nuevo del Objeto
     * @return void 
     * 
     * @author Alex
     */
    public function setId(int $his_id): void
    {
        $this->his_id = $his_id;
    }

    /**
     * Funcion Set para modificar el ID EQUIPAMIENTO.
     *
     * @param int $his_equipamiento ID EQUIPAMIENTO nuevo del Objeto
     * @return void 
     * 
     * @author Alex
     */
    public function setEquipamiento(int $his_equipamiento): void
    {
        $this->his_equipamiento = $his_equipamiento;
    }
    
    /**
     * Funcion Set para modificar el ID UBICACION.
     *
     * @param int $his_ubicacion ID UBICACION nuevo del Objeto
     * @return void 
     * 
     * @author Alex
     */
    public function setUbicacion(int $his_ubicacion): void
    {
        $this->his_ubicacion = $his_ubicacion;
    }

    /**
     * Funcion Set para modificar la FECHA INICIO.
     *
     * @param DateTime $his_fecha_inicio FECHA INICIO nueva del Objeto
     * @return void 
     * 
     * @author Alex
     */
    public function setFechaInicio(DateTime $his_fecha_inicio): void
    {
        $this->his_fecha_inicio = $his_fecha_inicio;
    }
    
    /**
     * Funcion Set para modificar la FECHA FIN.
     *
     * @param DateTime $his_fecha_fin FECHA FIN nueva del Objeto
     * @return void 
     * 
     * @author Alex
     */
    public function setFechaFin(DateTime $his_fecha_fin): void
    {
        $this->his_fecha_fin = $his_fecha_fin;
    }

    // ---------------------------------------- [ FUNCIONES ]
    /**
     * Funcion para mostrar por consola los datos del Objeto.
     * 
     * @author Alex
     */
    public function mostrarInfo()
    {
        echo ("ID: " . $this->his_id . "<br>");
        echo ("Equipamiento: " . $this->his_equipamiento . "<br>");
        echo ("Ubicacion: " . $this->his_ubicacion . "<br>");
        echo ("Inicio: " . date_format($this->his_fecha_inicio, "Y-m-d H:i:s") . "<br>");
        echo ("Fin: " . date_format($this->his_fecha_fin, "Y-m-d H:i:s") . "<br>");
    }
}

?>