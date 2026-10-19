<?php

require_once("ConexionDB.php");
require_once("../model/Historico_Ubicacion.php");

class Historico_UbicacionDAO
{
    // ---------------------------------------- VARIABLES
    private mysqli $conexion;

    // ---------------------------------------- CONEXIÓN
    /**
     * Constructor de la clase Historico_UbicacionDAO donde se crea la conexión.
     * 
     * @author Alex
     */
    public function __construct()
    {
        $this->conexion = ConexionDB::conexion();
    }

    // ---------------------------------------- CARGAR HISTORICOS
    /**
     * Función que obtiene todos los historicos.
     *
     * @return array $historicos Listado de los historico obtenidos
     * 
     * @author Alex
     */
    public function cargarHistoricos(): array
    {
        $historicos = array();
        $sql = "SELECT id_historico, id_equipamiento, id_ubicacion, fecha_inicio, fecha_fin
                    FROM historico_ubicaciones";
        $resultado = $this->conexion->query($sql);

        while ($fila = $resultado->fetch_assoc()) {
            $historico = new Historico_Ubicacion($fila["id_historico"], $fila["id_equipamiento"], $fila["id_ubicacion"], new DateTime($fila["fecha_inicio"]), new DateTime($fila["fecha_fin"]));
            $historicos[] = $historico;
        }

        return $historicos;
    }

    // ---------------------------------------- BUSCAR POR ID
    /**
     * Función que obtiene un historico buscado por id.
     *
     * @param int $his_id Id del historico a buscar
     * @return Historico_Ubicacion $historico Objeto encontrado
     * 
     * @author Alex
     */
    public function buscarHistoricoPorId(int $his_id): ?Historico_Ubicacion
    {
        $sql = "SELECT id_historico, id_equipamiento, id_ubicacion, fecha_inicio, fecha_fin
                    FROM historico_ubicaciones
                    WHERE id_historico = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $his_id);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($fila = $resultado->fetch_assoc()) {
            $historico = new Historico_Ubicacion($fila["id_historico"], $fila["id_equipamiento"], $fila["id_ubicacion"], new DateTime($fila["fecha_inicio"]), new DateTime($fila["fecha_fin"]));
            return $historico;
        }

        return null;
    }

    // ---------------------------------------- CARGAR HISTORICOS DE EQUIPAMIENTO
    /**
     * Función que obtiene los historicos de un equipamiento.
     *
     * @param int $his_equipamiento Id del equipamiento a revisar sus historicos
     * @return array $historicos Listado de los historico obtenidos
     * 
     * @author Alex
     */
    public function cargarHistoricosDeEquipamiento(int $his_equipamiento): array
    {
        $historicos = array();
        $sql = "SELECT id_historico, id_equipamiento, id_ubicacion, fecha_inicio, fecha_fin
                    FROM historico_ubicaciones
                    WHERE id_equipamiento = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $his_equipamiento);
        $stmt->execute();
        $resultado = $stmt->get_result();

        while ($fila = $resultado->fetch_assoc()) {
            $historico = new Historico_Ubicacion($fila["id_historico"], $fila["id_equipamiento"], $fila["id_ubicacion"], new DateTime($fila["fecha_inicio"]), new DateTime($fila["fecha_fin"]));
            $historicos[] = $historico;
        }

        return $historicos;
    }

    // ---------------------------------------- CREAR HISTORICO
    /**
     * Función que crea y registra un historico nuevo.
     *
     * @param Historico_Ubicacion $historico Objeto a crear
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function crearHistorico(Historico_Ubicacion $historico): bool
    {
        $sql = "INSERT INTO historico_ubicaciones (id_historico, id_equipamiento, id_ubicacion, fecha_inicio, fecha_fin)
                    VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->conexion->prepare($sql);
        $his_id = $historico->getId();
        $his_equipamiento = $historico->getEquipamiento();
        $his_ubicacion = $historico->getUbicacion();
        //$his_fecha_inicio = $historico->getFechaInicio();
        $his_fecha_inicio = date_format($historico->getFechaInicio(), "Y-m-d H:i:s");
        //$his_fecha_fin = $historico->getFechaFin();
        $his_fecha_fin = date_format($historico->getFechaFin(), "Y-m-d H:i:s");
        $stmt->bind_param(
            "iiiss",
            $his_id,
            $his_equipamiento,
            $his_ubicacion,
            $his_fecha_inicio,
            $his_fecha_fin
        );

        return $stmt->execute();
    }

    // ---------------------------------------- EDITAR HISTORICO
    /**
     * Función que edita un historico existente.
     *
     * @param Historico_Ubicacion $historico Objeto a modificar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function editarHistorico(Historico_Ubicacion $historico): bool
    {
        $sql = "UPDATE historico_ubicaciones
                    SET fecha_fin = ?
                    WHERE id_historico = ?";

        $stmt = $this->conexion->prepare($sql);
        //$his_fecha_fin = $historico->getFechaFin();
        $his_fecha_fin = date_format($historico->getFechaFin(), "Y-m-d H:i:s");
        $his_id = $historico->getId();
        $stmt->bind_param(
            "di", // -------------------------------------------[PREGUNTAR RESPECTO AL DATETIME]
            //"si",
            $his_fecha_fin,
            $his_id
        );

        return $stmt->execute();
    }

    // ---------------------------------------- ELIMINAR HISTORICO
    /**
     * Función que elimina un historico.
     *
     * @param int $his_id Id del historico a eliminar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function eliminarHistorico(int $his_id): bool
    {
        $sql = "DELETE FROM historico_ubicaciones
                    WHERE id_historico = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $his_id);

        return $stmt->execute();
    }
}

?>