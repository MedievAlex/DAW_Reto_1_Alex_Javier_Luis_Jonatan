<?php

require_once("ConexionDB.php");
require_once("../model/Historico_Ubicacion.php");

class Historico_UbicacionDAO
{
    // ---------------------------------------- VARIABLES
    private mysqli $conexion;

    // ---------------------------------------- CONEXIÓN
    public function __construct()
    {
        $this->conexion = ConexionDB::conexion();
    }

    // ---------------------------------------- CARGAR HISTORICOS
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

    // ---------------------------------------- CARGAR HISTORICOS DE EQUIPAMIENTO
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

    // ---------------------------------------- BUSCAR POR ID
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

    // ---------------------------------------- CREAR HISTORICO
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