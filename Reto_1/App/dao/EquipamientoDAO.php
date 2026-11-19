<?php

require_once("ConexionDB.php");
require_once("../model/Categoria.php");
require_once("../model/Equipamiento.php");

/*
// Alternativa: __DIR__ permite resolver las rutas desde la carpeta del DAO,
// independientemente del directorio desde el que se ejecute la aplicación.
require_once __DIR__ . "/ConexionDB.php";
require_once __DIR__ . "/../model/Categoria.php";
require_once __DIR__ . "/../model/Equipamiento.php";
*/

/**
 * Gestiona el acceso a los datos de los equipamientos.
 *
 * Métodos disponibles:
 *
 * Consultas:
 * - buscarEquipamientoPorId()
 * - listarTodosEquipamientos()
 * - filtrarEquipamientosPorCategoria()
 * - filtrarEquipamientosPorUbicacion()
 *
 * Escritura:
 * - crearEquipamiento()
 * - editarEquipamiento()
 * - eliminarEquipamiento()
 *
 * Traslados:
 * - cambiarUbicacionEquipamiento()
 *
 * @author Jonatan Tajada Rico
 */
class EquipamientoDAO
{
    // ---------------------------------------- [ CONEXIÓN ]

    private mysqli $conexion;

    /**
     * Inicializa la conexión con la base de datos.
     *
     * @throws mysqli_sql_exception Si falla la conexión.
     *
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
     *
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
            // Vinculamos el identificador como un entero.
            $stmt->bind_param("i", $idEquipamiento);
            $stmt->execute();

            $resultado = $stmt->get_result();
            $fila = $resultado->fetch_assoc();

            if ($fila === null) {
                return null;
            }

            // Convertimos los datos de la fila en un objeto Equipamiento.
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
            // Cerramos la sentencia aunque se produzca una excepción.
            $stmt->close();
        }
    }

    /**
     * Obtiene todos los equipamientos.
     *
     * @return Equipamiento[] Lista de equipamientos; vacía si no hay ninguno.
     * @throws mysqli_sql_exception Si falla la consulta.
     *
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

            // Convertimos cada fila en un objeto y lo añadimos a la lista.
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
     * Obtiene los equipamientos que pertenecen a una categoría.
     *
     * @param Categoria $categoria Categoría por la que se filtra.
     * @return Equipamiento[] Lista de coincidencias; vacía si no hay ninguna.
     * @throws mysqli_sql_exception Si falla la consulta.
     *
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
            // SQL necesita el valor de texto del enum.
            $valorCategoria = $categoria->value;

            $stmt->bind_param("s", $valorCategoria);
            $stmt->execute();

            $resultado = $stmt->get_result();

            // Convertimos los equipamientos encontrados en objetos del modelo.
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
     * Obtiene los equipamientos que están actualmente en una ubicación.
     *
     * Consulta la ubicación actual del equipamiento, no sus estancias anteriores.
     *
     * @param int $idUbicacion Identificador de la ubicación por la que se filtra.
     * @return Equipamiento[] Lista de coincidencias; vacía si no hay ninguna.
     * @throws InvalidArgumentException Si el ID no es positivo.
     * @throws mysqli_sql_exception Si falla la consulta.
     *
     * @author Jonatan Tajada Rico
     */
    public function filtrarEquipamientosPorUbicacion(int $idUbicacion): array
    {
        if ($idUbicacion <= 0) {
            throw new InvalidArgumentException(
                "El identificador de ubicación debe ser positivo."
            );
        }

        $equipamientos = [];

        $sql = "SELECT id_equipamiento, nombre, descripcion, marca,
                       modelo, categoria, id_ubicacion_actual
                FROM equipamientos
                WHERE id_ubicacion_actual = ?";

        $stmt = $this->conexion->prepare($sql);

        try {
            // Vinculamos el identificador de ubicación como un entero.
            $stmt->bind_param("i", $idUbicacion);
            $stmt->execute();

            $resultado = $stmt->get_result();

            // Convertimos los equipamientos encontrados en objetos del modelo.
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
     * Registra un nuevo equipamiento.
     *
     * MySQL genera su identificador. Los triggers de inserción asignan
     * Almacén como ubicación inicial y crean su primera fila de histórico.
     *
     * @param Equipamiento $equipamiento Datos del equipamiento que se creará.
     * @return bool Resultado de la ejecución de la inserción.
     * @throws mysqli_sql_exception Si falla la inserción.
     *
     * @author Jonatan Tajada Rico
     */
    public function crearEquipamiento(Equipamiento $equipamiento): bool
    {
        $sql = "INSERT INTO equipamientos
                    (nombre, descripcion, marca, modelo, categoria)
                VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->conexion->prepare($sql);

        try {
            // Obtenemos los datos del modelo para vincularlos a la consulta.
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
     * Actualiza los datos generales de un equipamiento.
     *
     * No modifica su ubicación ni su histórico.
     *
     * @param Equipamiento $equipamiento Datos actualizados, incluido su ID.
     * @return bool True si el SQL se ejecuta correctamente, aunque no encuentre
     *              el equipamiento o sus datos no cambien; false si execute falla.
     * @throws InvalidArgumentException Si el equipamiento no tiene ID.
     * @throws mysqli_sql_exception Si falla la actualización.
     *
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
            // Obtenemos los datos actualizados del modelo.
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
     * Elimina un equipamiento por su identificador.
     *
     * La clave foránea con ON DELETE CASCADE elimina también su histórico.
     *
     * @param int $idEquipamiento Identificador del equipamiento que se eliminará.
     * @return bool True si se elimina una fila; false si no existe.
     * @throws mysqli_sql_exception Si falla la eliminación.
     *
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

            // Comprobamos si la consulta ha eliminado realmente una fila.
            $eliminado = $stmt->affected_rows > 0;

            return $eliminado;
        } finally {
            $stmt->close();
        }
    }

    // ---------------------------------------- [ TRASLADOS ]

    /**
     * Cambia la ubicación actual de un equipamiento y registra su traslado.
     *
     * Cierra las estancias abiertas, actualiza la ubicación del equipamiento
     * y crea una nueva estancia en el histórico dentro de una transacción.
     *
     * Requiere que el trigger de traslado esté desactivado para evitar
     * que la base de datos repita las operaciones sobre el histórico.
     *
     * @param int $idEquipamiento Identificador del equipamiento que se trasladará.
     * @param int $idNuevaUbicacion Identificador de la ubicación de destino.
     * @return bool True si se completa el traslado; false si ya está en el destino.
     * @throws InvalidArgumentException Si los IDs no son positivos
     *                                  o el equipamiento no existe.
     * @throws mysqli_sql_exception Si falla alguna operación SQL,
     *                             incluido un destino inexistente.
     *
     * @author Jonatan Tajada Rico
     */
    public function cambiarUbicacionEquipamiento(
        int $idEquipamiento,
        int $idNuevaUbicacion
    ): bool {
        if ($idEquipamiento <= 0 || $idNuevaUbicacion <= 0) {
            throw new InvalidArgumentException(
                "Los identificadores deben ser positivos."
            );
        }

        // Permiten cerrar en finally las sentencias que lleguen a crearse.
        $stmtBuscar = null;
        $stmtCerrar = null;
        $stmtActualizar = null;
        $stmtCrear = null;

        $this->conexion->begin_transaction();

        try {
            // Bloqueamos el equipamiento hasta finalizar la transacción
            // para coordinar los traslados simultáneos sobre el mismo equipo.
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

            // Si el destino coincide con la ubicación actual, no hay traslado.
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

            // 3. Creamos una estancia abierta en la ubicación de destino.
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

            // Confirmamos conjuntamente los cambios del traslado.
            $this->conexion->commit();

            return true;
        } catch (Throwable $error) {
            // Deshacemos los cambios y propagamos el error a la capa superior.
            $this->conexion->rollback();

            throw $error;
        } finally {
            // Cerramos únicamente las sentencias que llegaron a crearse.
            $stmtBuscar?->close();
            $stmtCerrar?->close();
            $stmtActualizar?->close();
            $stmtCrear?->close();
        }
    }
}