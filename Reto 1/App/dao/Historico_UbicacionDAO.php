<?php

require_once("ConexionDB.php");
require_once("../model/Historico_Ubicacion.php");

class Historico_UbicacionDAO
{
    // ---------------------------------------- [ VARIABLES ]
    private mysqli $conexion;

    // ---------------------------------------- [ CONEXIÓN ]
    /**
     * Constructor de la clase Historico_UbicacionDAO donde se crea la conexión.
     * 
     * @author Alex
     */
    public function __construct()
    {
        $this->conexion = ConexionDB::conexion();
    }

    // ---------------------------------------- [ CARGAR HISTORICOS ]
    /**
     * Función que obtiene todos los Historico Ubicacion.
     *
     * @return array $historicos Listado de los Historico Ubicacion obtenidos
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

    // ---------------------------------------- [ BUSCAR POR ID ]
    /**
     * Función que obtiene un Historico Ubicacion buscado por ID.
     *
     * @param int $his_id ID del Historico Ubicacion a buscar
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

    // ---------------------------------------- [ CARGAR HISTORICOS DE EQUIPAMIENTO ]
    /**
     * Función que obtiene los Historico Ubicacion de un Equipamiento.
     *
     * @param int $his_equipamiento ID del Equipamiento a revisar sus Historico Ubicacion
     * @return array $historicos Listado de los Historico Ubicacion obtenidos
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

    // ---------------------------------------- [ CREAR HISTORICO ]
    /**
     * Función que crea y registra un Historico Ubicacion nuevo.
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
        $his_fecha_inicio = date_format($historico->getFechaInicio(), "Y-m-d H:i:s");
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

    // ---------------------------------------- [ EDITAR HISTORICO ]
    /**
     * Función que edita un Historico Ubicacion existente.
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
        $his_fecha_fin = date_format($historico->getFechaFin(), "Y-m-d H:i:s");
        $his_id = $historico->getId();
        $stmt->bind_param(
            "si",
            $his_fecha_fin,
            $his_id
        );

        return $stmt->execute();
    }

    // ---------------------------------------- [ ELIMINAR HISTORICO ]
    /**
     * Función que elimina un Historico Ubicacion.
     *
     * @param int $his_id ID del Historico Ubicacion a eliminar
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