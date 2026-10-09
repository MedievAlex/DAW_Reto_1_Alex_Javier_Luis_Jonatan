<?php
require_once  ("ConexionDB.php");
require_once  ("../model/Notificacion.php");

class NotificacionDAO
{
    private mysqli $conexion;

    //Creacion de la conexión con la base de datos
    public function __construct()
    {
        $this->conexion = ConexionDB::conexion();
    }

    //Método para crear una notificacion en la base de datos al recibir un objeto Notificacion. Devuelve true o false según el resultado de la operación.
    public function crearNotificacion(Notificacion $notificacion): bool
    {
        $sql = "INSERT INTO notificaciones (titulo, descripcion, fecha_creacion, estado, id_usuario) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($sql);
        $titulo = $notificacion->getTitulo();
        $descripcion = $notificacion->getDescripcion();
        $fecha = $notificacion->getFecha()->format('Y-m-d H:i:s');
        $estado = $notificacion->getEstado()->value;
        $usuarioId = $notificacion->getIdNotificacion();
        $stmt->bind_param("ssssi", $titulo, $descripcion, $fecha, $estado, $usuarioId);
        $resultado = $stmt->execute();
        $stmt->close();

        return $resultado;
    }

    //Método para modificar una notificación en la base de datos al recibir un objeto Notificacion. Devuelve true o false según el resultado de la operación.
    public function modificarNotificacion(Notificacion $notificacion): bool
    {
        $sql = "UPDATE notificaciones SET titulo = ?, descripcion = ?, fecha_creacion = ?, estado = ? WHERE id_notificacion = ?";
        $stmt = $this->conexion->prepare($sql);
        $titulo = $notificacion->getTitulo();
        $descripcion = $notificacion->getDescripcion();
        $fecha = $notificacion->getFecha()->format('Y-m-d H:i:s');
        $estado = $notificacion->getEstado()->value;
        $id = $notificacion->getIdNotificacion();
        $stmt->bind_param("ssssi", $titulo, $descripcion, $fecha, $estado, $id);
        $resultado = $stmt->execute();
        $stmt->close();

        return $resultado;
    }

    //Método para eliminar una notificación de la base de datos al recibir un id. Devuelve true o false según el resultado de la operación.
    public function eliminarNotificacion(int $id): bool
    {
        $sql = "DELETE FROM notificaciones WHERE id_notificacion = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $id);
        $resultado = $stmt->execute();
        $stmt->close();
        return $resultado;
    }

    //Método para consultar las notificaciones de la base de datos
    public function consultarNotificaciones(int $idUsuario): array
    {
        $sql = "SELECT * FROM notificaciones WHERE id_usuario= ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $result = $stmt->get_result();
        $notificaciones = [];
        while ($row = $result->fetch_assoc()) {
            $notificacion = new Notificacion(
                $row['id_usuario'],
                $row['titulo'],
                $row['descripcion'],
                new DateTime($row['fecha_creacion']),
                Estado::from($row['estado'])
            );
            $notificaciones[] = $notificacion;
        }
        $stmt->close();
        return $notificaciones;
    }
}
