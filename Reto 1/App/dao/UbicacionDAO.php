<?php

require_once("ConexionDB.php");
require_once("../model/Ubicacion.php");

class UbicacionDAO
{
    // ---------------------------------------- [ VARIABLES ]
    private mysqli $conexion;

    // ---------------------------------------- [ CONEXIÓN ]
    /**
     * Constructor de la clase UbicacionDAO donde se crea la conexión.
     * 
     * @author Alex
     */
    public function __construct()
    {
        $this->conexion = ConexionDB::conexion();
    }

    // ---------------------------------------- [ CARGAR UBICACIONES ]
    /**
     * Función que obtiene todas las Ubicacion.
     *
     * @return array $ubicaciones Listado de las Ubicacion obtenidas
     * 
     * @author Alex
     */
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

    // ---------------------------------------- [ BUSCAR POR ID ]
    /**
     * Función que obtiene una Ubicacion buscada por id.
     *
     * @param int $ubi_id ID del historico a buscar
     * @return Ubicacion $ubicacion Objeto encontrado
     * 
     * @author Alex
     */
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

    // ---------------------------------------- [ BUSCAR POR NOMBRE ]
    /**
     * Función que obtiene una Ubicacion buscada por nombre.
     *
     * @param string $ubi_nombre NOMBRE de la Ubicacion a buscar
     * @return Ubicacion $ubicacion Objeto encontrado
     * 
     * @author Alex
     */
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

    // ---------------------------------------- [ CREAR UBICACION ]
    /**
     * Función que crea y registra una Ubicacion nueva.
     *
     * @param Ubicacion $ubicacion Objeto a crear
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
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
    
    // ---------------------------------------- [ EDITAR UBICACION ]
    /**
     * Función que edita una Ubicacion existente.
     *
     * @param Ubicacion $ubicacion Objeto a modificar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
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
    
    // ---------------------------------------- [ ELIMINAR UBICACION ]
    /**
     * Función que elimina una Ubicacion.
     *
     * @param int $ubi_id id de la Ubicacion a eliminar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
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