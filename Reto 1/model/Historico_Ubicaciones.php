<?php
// Definición de la clase
class Historico_Ubicaciones
{
    // Atributos
    private int $his_id;
    private int $his_equipamiento;
    private int $his_ubicacion;
    private DateTime $his_fecha_inicio;
    private DateTime $his_fecha_final; // Gestionar que si es idéntico a la fecha de inicio que no se muestre/registre
    //private String $his_fecha_inicio;
    //private String $his_fecha_final;

    // Constructores
    public function __construct(int $his_id, int $his_equipamiento, int $his_ubicacion)
    {
        $this->his_id = $his_id;
        $this->his_equipamiento = $his_equipamiento;
        $this->his_ubicacion = $his_ubicacion;
        $this->his_fecha_inicio = new DateTime('NOW');
        $this->his_fecha_final = new DateTime('NOW');
        //$this->his_fecha_inicio = date("Y-m-d H:i:s"); // Formato para insertar en la BD SQL
    }

    // Getter
    public function getId(): int // Devuelve un int
    {
        return $this->his_id;
    }

    public function getEquipamiento(): int // Devuelve un int
    {
        return $this->his_equipamiento;
    }
    
    public function getUbicacion(): int // Devuelve un int
    {
        return $this->his_ubicacion;
    }

    public function getFechaInicio(): DateTime // Devuelve una fecha
    {
        return $this->his_fecha_inicio;
    }
    
    public function getFechaFinal(): DateTime // Devuelve una fecha
    {
        return $this->his_fecha_final;
    }

    // Setter
    // self - Cambia el valor y devuelve el objeto actualizado
    // void - Solo cambia el valor deseado
    public function setId(int $his_id): void
    {
        $this->his_id = $his_id;
    }

    public function setEquipamiento(int $his_equipamiento): void
    {
        $this->his_equipamiento = $his_equipamiento;
    }
    
    public function setUbicacion(int $his_ubicacion): void
    {
        $this->his_ubicacion = $his_ubicacion;
    }

    /*
    public function setFechaInicio(String $his_fecha_inicio): void
    {
        $this->his_fecha_inicio = $his_fecha_inicio;
    }
    */
    
    public function setFechaFinal(): self
    {
        $this->his_fecha_final = new DateTime('NOW');

        return $this;
    }

    // Mostrar
    public function mostrarInfo()
    {
        echo ("ID: " . $this->his_id . "<br>");
        echo ("Equipamiento: " . $this->his_equipamiento . "<br>");
        echo ("Ubicacion: " . $this->his_ubicacion . "<br>");
        echo ("Inicio: " . date_format($this->his_fecha_final, "Y/m/d H:i:s") . "<br>");
        echo ("Final: " . date_format($this->his_fecha_final, "Y/m/d H:i:s") . "<br>");
    }
}

?>