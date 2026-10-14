<?php
require_once("../dao/UsuarioDAO.php");

class UsuarioController
{
    // la contraseña debe tener entre 8 y 72 caracteres (bcrypt solo usa los primeros 72)
    private const LONGITUD_MINIMA_PASSWORD = 8;
    private const LONGITUD_MAXIMA_PASSWORD = 72;

    private UsuarioDAO $usu_dao;

    public function __construct()
    {
        $this->usu_dao = new UsuarioDAO();
    }

    // ---------------------------------------- FUNCIONES

    public function cargarUsuarios()
    {
        return $this->usu_dao->cargarUsuarios();
    }

    public function buscarUsuarioPorId(int $usu_id)
    {
        return $this->usu_dao->buscarUsuarioPorId($usu_id);
    }

    public function buscarUsuarioPorNombreUsuario(string $usu_nombre_usuario)
    {
        return $this->usu_dao->buscarUsuarioPorNombreUsuario($usu_nombre_usuario);
    }

    public function existeNombreUsuario(string $usu_nombre_usuario, int $usu_excluir_id = 0)
    {
        return $this->usu_dao->existeNombreUsuario($usu_nombre_usuario, $usu_excluir_id);
    }

    public function contarAdministradores()
    {
        return $this->usu_dao->contarAdministradores();
    }

    public function tieneNotificaciones(int $usu_id)
    {
        return $this->usu_dao->tieneNotificaciones($usu_id);
    }

    public function crearUsuario(Usuario $usuario)
    {
        return $this->usu_dao->crearUsuario($usuario);
    }

    public function editarUsuario(Usuario $usuario)
    {
        return $this->usu_dao->editarUsuario($usuario);
    }

    public function eliminarUsuario(int $usu_id)
    {
        return $this->usu_dao->eliminarUsuario($usu_id);
    }

    // ---------------------------------------- HASH DE CONTRASEÑAS

    // ---------------------------------------- REGISTRAR USUARIO
    // genera el hash de la contraseña y crea el usuario
    public function registrarUsuario(Usuario $usuario, string $password): bool
    {
        $this->validarPassword($password);
        $usuario->setPasswordHash(password_hash($password, PASSWORD_DEFAULT));

        return $this->usu_dao->crearUsuario($usuario);
    }

    // ---------------------------------------- CAMBIAR CONTRASEÑA
    // guarda el hash de la nueva contraseña; false si el usuario no existe
    public function cambiarPassword(int $usu_id, string $password): bool
    {
        $this->validarPassword($password);

        $usuario = $this->usu_dao->buscarUsuarioPorId($usu_id);
        if ($usuario === null) {
            return false;
        }

        $usuario->setPasswordHash(password_hash($password, PASSWORD_DEFAULT));

        return $this->usu_dao->editarUsuario($usuario);
    }

    // ---------------------------------------- INICIAR SESIÓN
    // devuelve el usuario si la contraseña coincide con el hash, o null si no
    public function iniciarSesion(string $usu_nombre_usuario, string $password): ?Usuario
    {
        $usuario = $this->usu_dao->buscarUsuarioPorNombreUsuario(trim($usu_nombre_usuario));

        if ($usuario === null || !password_verify($password, $usuario->getPasswordHash())) {
            return null;
        }

        // si el hash guardado usa un algoritmo antiguo, se regenera
        if (password_needs_rehash($usuario->getPasswordHash(), PASSWORD_DEFAULT)) {
            $usuario->setPasswordHash(password_hash($password, PASSWORD_DEFAULT));
            $this->usu_dao->editarUsuario($usuario);
        }

        return $usuario;
    }

    // ---------------------------------------- VALIDAR CONTRASEÑA
    private function validarPassword(string $password): void
    {
        if (strlen($password) < self::LONGITUD_MINIMA_PASSWORD) {
            throw new InvalidArgumentException(
                'La contraseña debe tener al menos ' . self::LONGITUD_MINIMA_PASSWORD . ' caracteres'
            );
        }

        if (strlen($password) > self::LONGITUD_MAXIMA_PASSWORD) {
            throw new InvalidArgumentException(
                'La contraseña no puede superar los ' . self::LONGITUD_MAXIMA_PASSWORD . ' caracteres'
            );
        }
    }
}

?>