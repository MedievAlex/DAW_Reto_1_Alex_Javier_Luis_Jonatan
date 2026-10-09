<?php

require_once("ConexionDB.php");
require_once("../model/Ubicacion.php");

class UbicacionDAO
{
    // ---------------------------------------- VARIABLES
    private mysqli $conexion;

    // ---------------------------------------- CONEXIÓN
    public function __construct()
    {
        $this->conexion = ConexionDB::conexion();
    }

    // ---------------------------------------- CARGAR UBICACIONES
    public function cargarUbicaciones(): array
    {
        $ubicaciones = array();
        $sql = "SELECT id_ubicacion, nombre, descripcion
                    FROM ubicaciones";
        $resultado = $this->conexion->query($sql);

        while ($fila = $resultado->fetch_assoc()) {
            $ubicacion = new Ubicacion($fila["id_ubicacion"], $fila["nombre"], $fila["descripcion"]);
            $ubicaciones[] = $ubicacion;
        }

        return $ubicaciones;
    }

    // ---------------------------------------- BUSCAR POR ID
    public function buscarUbicacionPorId(int $ubi_id): ?Ubicacion
    {
        $sql = "SELECT id_ubicacion, nombre, descripcion
                    FROM ubicaciones
                    WHERE id_ubicacion = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $ubi_id);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($fila = $resultado->fetch_assoc()) {
            $ubicacion = new Ubicacion($fila["id_ubicacion"], $fila["nombre"], $fila["descripcion"]);
            return $ubicacion;
        }

        return null;
    }

    // ---------------------------------------- BUSCAR POR NOMBRE
    public function buscarUbicacionPorNombre(string $ubi_nombre): ?Ubicacion
    {
        $sql = "SELECT id_ubicacion, nombre, descripcion
                    FROM ubicaciones
                    WHERE nombre = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("s", $ubi_nombre);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($fila = $resultado->fetch_assoc()) {
            $ubicacion = new Ubicacion($fila["id_ubicacion"], $fila["nombre"], $fila["descripcion"]);
            return $ubicacion;
        }

        return null;
    }

    // ---------------------------------------- CREAR UBICACION
    public function crearUbicacion(Ubicacion $ubicacion): bool
    {
        $sql = "INSERT INTO ubicaciones (nombre, descripcion)
                    VALUES (?, ?)";

        $stmt = $this->conexion->prepare($sql);
        $ubi_nombre = $ubicacion->getNombre();
        $ubi_descripcion = $ubicacion->getDescripcion();
        $stmt->bind_param(
            "ss",
            $ubi_nombre,
            $ubi_descripcion
        );

        return $stmt->execute();
    }
    
    // ---------------------------------------- EDITAR UBICACION
    public function editarUbicacion(Ubicacion $ubicacion): bool
    {
        $sql = "UPDATE ubicaciones
                    SET nombre = ?,
                        descripcion = ?
                    WHERE id_ubicacion = ?";

        $stmt = $this->conexion->prepare($sql);
        $ubi_nombre = $ubicacion->getNombre();
        $ubi_descripcion = $ubicacion->getDescripcion();
        $ubi_id = $ubicacion->getId();
        $stmt->bind_param(
            "ssi",
            $ubi_nombre,
            $ubi_descripcion,
            $ubi_id
        );

        return $stmt->execute();
    }
    
    // ---------------------------------------- ELIMINAR UBICACION
    public function eliminarUbicacion(int $ubi_id): bool
    {
        $sql = "DELETE FROM ubicaciones
                    WHERE id_ubicacion = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $ubi_id);
        
        return $stmt->execute();
    }
}

?>