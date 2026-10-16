<?php
//require_once("EquipamientoDAO.php");
require_once("Historico_UbicacionDAO.php");
require_once("NotificacionDAO.php");
require_once("UbicacionDAO.php");
require_once("UsuarioDAO.php");

class Controller
{
    //private EquipamientoDAO $equ_dao;
    private Historico_UbicacionDAO $his_dao;
    private NotificacionDAO $not_dao;
    private UbicacionDAO $ubi_dao;
    private UsuarioDAO $usu_dao;

    public function __construct()
    {
        //$this->equ_dao = new EquipamientoDAO();
        $this->his_dao = new Historico_UbicacionDAO();
        $this->not_dao = new NotificacionDAO();
        $this->ubi_dao = new UbicacionDAO();
        $this->usu_dao = new UsuarioDAO();
    }

    // ---------------------------------------- EQUIPAMIENTO


    // ---------------------------------------- HISTORICO

    public function cargarHistoricos()
    {
        return $this->his_dao->cargarHistoricos();
    }

    public function buscarHistoricoPorId(int $his_id)
    {
        return $this->his_dao->buscarHistoricoPorId($his_id);
    }

    public function cargarHistoricosDeEquipamiento(int $his_equipamiento)
    {
        return $this->his_dao->cargarHistoricosDeEquipamiento($his_equipamiento);
    }

    public function crearHistorico(Historico_Ubicacion $historico)
    {
        $this->his_dao->crearHistorico($historico);
    }

    public function editarHistorico(Historico_Ubicacion $historico)
    {
        return $this->his_dao->editarHistorico($historico);
    }

    public function eliminarHistorico(int $his_id)
    {
        return $this->his_dao->eliminarHistorico($his_id);
    }

    // ---------------------------------------- NOTIFICACION

    public function consultarNotificaciones()
    {
        return $this->not_dao->consultarNotificaciones();
    }

    public function crearNotificacion(Notificacion $notificacion)
    {
        return $this->not_dao->crearNotificacion($notificacion);
    }

    public function modificarNotificacion(Notificacion $notificacion)
    {
        return $this->not_dao->modificarNotificacion($notificacion);
    }

    public function eliminarNotificacion(int $not_id)
    {
        return $this->not_dao->eliminarNotificacion($not_id);
    }

    public function consultarNotificacionesId(int $id_Usuario)
    {
        return $this->not_dao->consultarNotificacionesId($id_Usuario);
    }


    // ---------------------------------------- UBICACION

    public function cargarUbicaciones()
    {
        return $this->ubi_dao->cargarUbicaciones();
    }

    public function buscarUbicacionPorId(int $ubi_id)
    {
        return $this->ubi_dao->buscarUbicacionPorId($ubi_id);
    }

    public function buscarUbicacionPorNombre(string $ubi_nombre)
    {
        return $this->ubi_dao->buscarUbicacionPorNombre($ubi_nombre);
    }

    public function crearUbicacion(Ubicacion $ubicacion)
    {
        return $this->ubi_dao->crearUbicacion($ubicacion);
    }

    public function editarUbicacion(Ubicacion $ubicacion)
    {
        return $this->ubi_dao->editarUbicacion($ubicacion);
    }

    public function eliminarUbicacion(int $ubi_id)
    {
        return $this->ubi_dao->eliminarUbicacion($ubi_id);
    }

    // ---------------------------------------- USUARIO

    
}

?>