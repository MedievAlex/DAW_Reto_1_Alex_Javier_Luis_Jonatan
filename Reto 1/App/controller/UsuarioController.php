<?php
    require_once("../dao/UsuarioDAO.php");

class UsuarioController
{
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
}

?>