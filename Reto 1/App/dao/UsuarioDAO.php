<?php

require_once __DIR__ . "/../model/Usuario.php";
require_once __DIR__ . "/ConexionDB.php";


class UsuarioDAO
{
    // ----------- VARIABLES
    private mysqli $conexion;

    // -------------------- CONEXIÓN
    public function __construct()
    {
        $this->conexion = ConexionDB::conexion();
    }

    // --------------------------------- CARGAR USUARIOS
    public function cargarUsuarios(): array
    {
        $usuarios = array();
        $sql = "SELECT id_usuario, nombre, apellidos, nombre_usuario, password_hash, rol
                    FROM usuarios
                    ORDER BY apellidos, nombre";
        $resultado = $this->conexion->query($sql);

        while ($fila = $resultado->fetch_assoc()) {
            $usuario = new Usuario($fila["id_usuario"], $fila["nombre"], $fila["apellidos"], $fila["nombre_usuario"], $fila["password_hash"], $fila["rol"]);
            $usuarios[] = $usuario;
        }

        return $usuarios;
    }

    // ------------------------------------------- BUSCAR POR ID
    public function buscarUsuarioPorId(int $usu_id): ?Usuario
    {
        $sql = "SELECT id_usuario, nombre, apellidos, nombre_usuario, password_hash, rol
                    FROM usuarios
                    WHERE id_usuario = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $usu_id);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($fila = $resultado->fetch_assoc()) {
            $usuario = new Usuario($fila["id_usuario"], $fila["nombre"], $fila["apellidos"], $fila["nombre_usuario"], $fila["password_hash"], $fila["rol"]);
            return $usuario;
        }

        return null;
    }

    // ------------------------------------------------------------- BUSCAR POR NOMBRE DE USUARIO
    public function buscarUsuarioPorNombreUsuario(string $usu_nombre_usuario): ?Usuario
    {
        $sql = "SELECT id_usuario, nombre, apellidos, nombre_usuario, password_hash, rol
                    FROM usuarios
                    WHERE nombre_usuario = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("s", $usu_nombre_usuario);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($fila = $resultado->fetch_assoc()) {
            $usuario = new Usuario($fila["id_usuario"], $fila["nombre"], $fila["apellidos"], $fila["nombre_usuario"], $fila["password_hash"], $fila["rol"]);
            return $usuario;
        }

        return null;
    }

    // ------------------------------------------------------------------------ EXISTE NOMBRE DE USUARIO
    public function existeNombreUsuario(string $usu_nombre_usuario, int $usu_excluir_id = 0): bool
    {
        $sql = "SELECT id_usuario
                    FROM usuarios
                    WHERE nombre_usuario = ? AND id_usuario <> ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("si", $usu_nombre_usuario, $usu_excluir_id);
        $stmt->execute();
        $resultado = $stmt->get_result();

        return $resultado->num_rows > 0;
    }

    // --------------------------------------- CONTAR ADMINISTRADORES
    public function contarAdministradores(): int
    {
        $sql = "SELECT id_usuario
                    FROM usuarios
                    WHERE rol = ?";

        $stmt = $this->conexion->prepare($sql);
        $usu_rol = Usuario::ROL_ADMIN;
        $stmt->bind_param("s", $usu_rol);
        $stmt->execute();
        $resultado = $stmt->get_result();

        return $resultado->num_rows;
    }

    // --------------------------------------------- TIENE NOTIFICACIONES
    public function tieneNotificaciones(int $usu_id): bool
    {
        $sql = "SELECT id_notificacion
                    FROM notificaciones
                    WHERE id_usuario = ?
                    LIMIT 1";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $usu_id);
        $stmt->execute();
        $resultado = $stmt->get_result();

        return $resultado->num_rows > 0;
    }

    // ---------------------------------------- CREAR USUARIO
    public function crearUsuario(Usuario $usuario): bool
    {
        $sql = "INSERT INTO usuarios (nombre, apellidos, nombre_usuario, password_hash, rol)
                    VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->conexion->prepare($sql);
        $usu_nombre = $usuario->getNombre();
        $usu_apellidos = $usuario->getApellidos();
        $usu_nombre_usuario = $usuario->getNombreUsuario();
        $usu_password_hash = $usuario->getPasswordHash();
        $usu_rol = $usuario->getRol();
        $stmt->bind_param(
            "sssss",
            $usu_nombre,
            $usu_apellidos,
            $usu_nombre_usuario,
            $usu_password_hash,
            $usu_rol
        );

        return $stmt->execute();
    }

    // ---------------------------------------- EDITAR USUARIO
    public function editarUsuario(Usuario $usuario): bool
    {
        $sql = "UPDATE usuarios
                    SET nombre = ?, apellidos = ?, nombre_usuario = ?, password_hash = ?, rol = ?
                    WHERE id_usuario = ?";

        $stmt = $this->conexion->prepare($sql);
        $usu_nombre = $usuario->getNombre();
        $usu_apellidos = $usuario->getApellidos();
        $usu_nombre_usuario = $usuario->getNombreUsuario();
        $usu_password_hash = $usuario->getPasswordHash();
        $usu_rol = $usuario->getRol();
        $usu_id = $usuario->getIdUsuario();
        $stmt->bind_param(
            "sssssi",
            $usu_nombre,
            $usu_apellidos,
            $usu_nombre_usuario,
            $usu_password_hash,
            $usu_rol,
            $usu_id
        );

        return $stmt->execute();
    }

    // ---------------------------------------- ELIMINAR USUARIO
    public function eliminarUsuario(int $usu_id): bool
    {
        $sql = "DELETE FROM usuarios
                    WHERE id_usuario = ?";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $usu_id);

        return $stmt->execute();
    }

    // ---------------------------------------- HASH DE CONTRASEÑAS

    // ---------------------------------------- REGISTRAR USUARIO
    // genera el hash de la contraseña y crea el usuario
    public function registrarUsuario(Usuario $usuario, string $usu_password): bool
    {
        $usuario->setPasswordHash(password_hash($usu_password, PASSWORD_DEFAULT));

        return $this->crearUsuario($usuario);
    }

    // ---------------------------------------- CAMBIAR CONTRASEÑA
    // guarda el hash de la nueva contraseña; false si el usuario no existe
    public function cambiarPassword(int $usu_id, string $usu_password): bool
    {
        $sql = "UPDATE usuarios
                    SET password_hash = ?
                    WHERE id_usuario = ?";

        $stmt = $this->conexion->prepare($sql);
        $usu_password_hash = password_hash($usu_password, PASSWORD_DEFAULT);
        $stmt->bind_param("si", $usu_password_hash, $usu_id);

        return $stmt->execute() && $stmt->affected_rows > 0;
    }

    // ---------------------------------------- INICIAR SESIÓN
    // devuelve el usuario si la contraseña coincide con el hash, o null si no
    public function iniciarSesion(string $usu_nombre_usuario, string $usu_password): ?Usuario
    {
        $usuario = $this->buscarUsuarioPorNombreUsuario(trim($usu_nombre_usuario));

        if ($usuario === null || !password_verify($usu_password, $usuario->getPasswordHash())) {
            return null;
        }

        // si el hash guardado usa un algoritmo antiguo, se regenera
        if (password_needs_rehash($usuario->getPasswordHash(), PASSWORD_DEFAULT)) {
            $usuario->setPasswordHash(password_hash($usu_password, PASSWORD_DEFAULT));
            $this->editarUsuario($usuario);
        }

        return $usuario;
    }
}

?>