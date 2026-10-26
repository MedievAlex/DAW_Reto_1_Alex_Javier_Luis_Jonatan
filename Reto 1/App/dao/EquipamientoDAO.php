<?php

// A diferencia de "../model/Equipamiento.php", __DIR__ toma como base
// la carpeta de este DAO, independientemente de dónde se ejecute la aplicación.
require_once __DIR__ . "/ConexionDB.php";
require_once __DIR__ . "/../model/Categoria.php";
require_once __DIR__ . "/../model/Equipamiento.php";

/**
 * Gestiona las consultas y la persistencia de los equipamientos.
 *
 * @author Jonatan Tajada Rico
 */
class EquipamientoDAO
{
    // ---------------------------------------- [ CONEXIÓN ]

    private mysqli $conexion;

    /**
     * Obtiene la conexión con la base de datos.
     *
     * @throws mysqli_sql_exception Si falla la conexión.
     * @author Jonatan Tajada Rico
     */
    public function __construct()
    {
        $this->conexion = ConexionDB::conexion();
    }

    // ---------------------------------------- [ CONSULTAS ]

    /**
     * Busca un equipamiento por su identificador.
     *
     * @param int $idEquipamiento Identificador del equipamiento.
     * @return Equipamiento|null Equipamiento encontrado o null si no existe.
     * @throws mysqli_sql_exception Si falla la consulta.
     * @author Jonatan Tajada Rico
     */
    public function buscarEquipamientoPorId(int $idEquipamiento): ?Equipamiento
    {
        $sql = "SELECT id_equipamiento, nombre, descripcion, marca,
                       modelo, categoria, id_ubicacion_actual
                FROM equipamientos
                WHERE id_equipamiento = ?";

        $stmt = $this->conexion->prepare($sql);

        try {
            // "i" indica que el parámetro es un entero.
            $stmt->bind_param("i", $idEquipamiento);
            $stmt->execute();

            $resultado = $stmt->get_result();
            $fila = $resultado->fetch_assoc();

            if ($fila === null) {
                return null;
            }

            // Convertimos la fila SQL en un objeto del modelo.
            return new Equipamiento(
                (int) $fila["id_equipamiento"],
                $fila["nombre"],
                $fila["descripcion"],
                $fila["marca"],
                $fila["modelo"],
                Categoria::from($fila["categoria"]),
                (int) $fila["id_ubicacion_actual"]
            );
        } finally {
            $stmt->close();
        }
    }

    /**
     * Obtiene todos los equipamientos.
     *
     * @return Equipamiento[] Lista de equipamientos; vacía si no hay ninguno.
     * @throws mysqli_sql_exception Si falla la consulta.
     * @author Jonatan Tajada Rico
     */
    public function listarTodosEquipamientos(): array
    {
        $equipamientos = [];

        $sql = "SELECT id_equipamiento, nombre, descripcion, marca,
                       modelo, categoria, id_ubicacion_actual
                FROM equipamientos";

        $stmt = $this->conexion->prepare($sql);

        try {
            $stmt->execute();
            $resultado = $stmt->get_result();

            while ($fila = $resultado->fetch_assoc()) {
                $equipamiento = new Equipamiento(
                    (int) $fila["id_equipamiento"],
                    $fila["nombre"],
                    $fila["descripcion"],
                    $fila["marca"],
                    $fila["modelo"],
                    Categoria::from($fila["categoria"]),
                    (int) $fila["id_ubicacion_actual"]
                );

                $equipamientos[] = $equipamiento;
            }

            return $equipamientos;
        } finally {
            $stmt->close();
        }
    }

    /**
     * Obtiene los equipamientos de una categoría.
     *
     * @param Categoria $categoria Categoría por la que se filtra.
     * @return Equipamiento[] Lista de coincidencias; vacía si no hay ninguna.
     * @throws mysqli_sql_exception Si falla la consulta.
     * @author Jonatan Tajada Rico
     */
    public function filtrarEquipamientosPorCategoria(Categoria $categoria): array
    {
        $equipamientos = [];

        $sql = "SELECT id_equipamiento, nombre, descripcion, marca,
                       modelo, categoria, id_ubicacion_actual
                FROM equipamientos
                WHERE categoria = ?";

        $stmt = $this->conexion->prepare($sql);

        try {
            // SQL recibe el texto del enum, no el objeto Categoria.
            $valorCategoria = $categoria->value;

            $stmt->bind_param("s", $valorCategoria);
            $stmt->execute();

            $resultado = $stmt->get_result();

            while ($fila = $resultado->fetch_assoc()) {
                $equipamiento = new Equipamiento(
                    (int) $fila["id_equipamiento"],
                    $fila["nombre"],
                    $fila["descripcion"],
                    $fila["marca"],
                    $fila["modelo"],
                    Categoria::from($fila["categoria"]),
                    (int) $fila["id_ubicacion_actual"]
                );

                $equipamientos[] = $equipamiento;
            }

            return $equipamientos;
        } finally {
            $stmt->close();
        }
    }

    // ---------------------------------------- [ ESCRITURA ]

    /**
     * Registra un equipamiento nuevo.
     *
     * MySQL genera el ID. Los triggers de inserción asignan Almacén
     * como ubicación inicial y crean su primera fila de histórico.
     *
     * @param Equipamiento $equipamiento Datos del nuevo equipamiento.
     * @return bool True si la inserción se ejecuta correctamente.
     * @throws mysqli_sql_exception Si falla la inserción.
     * @author Jonatan Tajada Rico
     */
    public function crearEquipamiento(Equipamiento $equipamiento): bool
    {
        $sql = "INSERT INTO equipamientos
                    (nombre, descripcion, marca, modelo, categoria)
                VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->conexion->prepare($sql);

        try {
            $nombre = $equipamiento->getNombre();
            $descripcion = $equipamiento->getDescripcion();
            $marca = $equipamiento->getMarca();
            $modelo = $equipamiento->getModelo();
            $categoria = $equipamiento->getCategoria()->value;

            $stmt->bind_param(
                "sssss",
                $nombre,
                $descripcion,
                $marca,
                $modelo,
                $categoria
            );

            $resultado = $stmt->execute();

            return $resultado;
        } finally {
            $stmt->close();
        }
    }

    /**
     * Edita los datos generales de un equipamiento, sin cambiar su ubicación.
     *
     * @param Equipamiento $equipamiento Datos que se quieren guardar, con ID.
     * @return bool True si el SQL se ejecuta, aunque no encuentre o cambie filas.
     * @throws InvalidArgumentException Si el equipamiento no tiene ID.
     * @throws mysqli_sql_exception Si falla la actualización.
     * @author Jonatan Tajada Rico
     */
    public function editarEquipamiento(Equipamiento $equipamiento): bool
    {
        $idEquipamiento = $equipamiento->getIdEquipamiento();

        if ($idEquipamiento === null) {
            throw new InvalidArgumentException(
                "El equipamiento debe tener un ID para poder editarlo."
            );
        }

        $sql = "UPDATE equipamientos
                SET nombre = ?, descripcion = ?, marca = ?,
                    modelo = ?, categoria = ?
                WHERE id_equipamiento = ?";

        $stmt = $this->conexion->prepare($sql);

        try {
            $nombre = $equipamiento->getNombre();
            $descripcion = $equipamiento->getDescripcion();
            $marca = $equipamiento->getMarca();
            $modelo = $equipamiento->getModelo();
            $categoria = $equipamiento->getCategoria()->value;

            $stmt->bind_param(
                "sssssi",
                $nombre,
                $descripcion,
                $marca,
                $modelo,
                $categoria,
                $idEquipamiento
            );

            $resultado = $stmt->execute();

            return $resultado;
        } finally {
            $stmt->close();
        }
    }

    /**
     * Elimina un equipamiento.
     *
     * La clave foránea con ON DELETE CASCADE elimina también su histórico.
     *
     * @param int $idEquipamiento Identificador del equipamiento.
     * @return bool True si se elimina una fila; false si no existe.
     * @throws mysqli_sql_exception Si falla la eliminación.
     * @author Jonatan Tajada Rico
     */
    public function eliminarEquipamiento(int $idEquipamiento): bool
    {
        $sql = "DELETE FROM equipamientos
                WHERE id_equipamiento = ?";

        $stmt = $this->conexion->prepare($sql);

        try {
            $stmt->bind_param("i", $idEquipamiento);
            $stmt->execute();

            // Comprobamos si realmente se ha eliminado un equipamiento.
            $eliminado = $stmt->affected_rows > 0;

            return $eliminado;
        } finally {
            $stmt->close();
        }
    }

    // ---------------------------------------- [ TRASLADOS ]

    /**
     * Cambia la ubicación y registra el traslado en el histórico.
     *
     * Todas las operaciones utilizan la misma conexión y transacción.
     * Requiere que el trigger de traslado esté desactivado para evitar
     * que el histórico se actualice también desde la base de datos.
     *
     * @param int $idEquipamiento Identificador del equipamiento que se traslada.
     * @param int $idNuevaUbicacion Identificador de la ubicación de destino.
     * @return bool True si se completa; false si ya está en esa ubicación.
     * @throws InvalidArgumentException Si los IDs no son positivos o no existe el equipo.
     * @throws mysqli_sql_exception Si falla el SQL, incluido un destino inexistente.
     * @author Jonatan Tajada Rico
     */
    public function cambiarUbicacionEquipamiento(int $idEquipamiento, int $idNuevaUbicacion): bool {
        
        if ($idEquipamiento <= 0 || $idNuevaUbicacion <= 0) {
            throw new InvalidArgumentException(
                "Los identificadores deben ser positivos."
            );
        }

        $stmtBuscar = null;
        $stmtCerrar = null;
        $stmtActualizar = null;
        $stmtCrear = null;

        $this->conexion->begin_transaction();

        try {
            // Bloqueamos la fila para coordinar los traslados simultáneos.
            $sql = "SELECT id_ubicacion_actual
                    FROM equipamientos
                    WHERE id_equipamiento = ?
                    FOR UPDATE";

            $stmtBuscar = $this->conexion->prepare($sql);
            $stmtBuscar->bind_param("i", $idEquipamiento);
            $stmtBuscar->execute();

            $resultado = $stmtBuscar->get_result();
            $fila = $resultado->fetch_assoc();

            if ($fila === null) {
                throw new InvalidArgumentException(
                    "El equipamiento no existe."
                );
            }

            // No registramos un traslado si la ubicación no cambia.
            if ((int) $fila["id_ubicacion_actual"] === $idNuevaUbicacion) {
                $this->conexion->rollback();

                return false;
            }

            // 1. Cerramos las estancias que estuvieran abiertas.
            $sql = "UPDATE historico_ubicaciones
                    SET fecha_fin = CURRENT_TIMESTAMP
                    WHERE id_equipamiento = ?
                      AND fecha_fin IS NULL";

            $stmtCerrar = $this->conexion->prepare($sql);
            $stmtCerrar->bind_param("i", $idEquipamiento);
            $stmtCerrar->execute();

            // 2. Actualizamos la ubicación actual del equipamiento.
            $sql = "UPDATE equipamientos
                    SET id_ubicacion_actual = ?
                    WHERE id_equipamiento = ?";

            $stmtActualizar = $this->conexion->prepare($sql);
            $stmtActualizar->bind_param(
                "ii",
                $idNuevaUbicacion,
                $idEquipamiento
            );
            $stmtActualizar->execute();

            // 3. Registramos una nueva estancia abierta.
            $sql = "INSERT INTO historico_ubicaciones
                        (id_equipamiento, id_ubicacion, fecha_inicio, fecha_fin)
                    VALUES (?, ?, CURRENT_TIMESTAMP, NULL)";

            $stmtCrear = $this->conexion->prepare($sql);
            $stmtCrear->bind_param(
                "ii",
                $idEquipamiento,
                $idNuevaUbicacion
            );
            $stmtCrear->execute();

            // Confirmamos todos los cambios del traslado.
            $this->conexion->commit();

            return true;
        } catch (Throwable $error) {
            // Deshacemos los cambios y propagamos el error a quien llamó al DAO.
            $this->conexion->rollback();

            throw $error;
        } finally {
            // ?-> permite cerrar solo las sentencias que se llegaron a crear.
            $stmtBuscar?->close();
            $stmtCerrar?->close();
            $stmtActualizar?->close();
            $stmtCrear?->close();
        }
    }
}