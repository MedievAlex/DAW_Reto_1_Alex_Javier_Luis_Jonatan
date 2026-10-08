<?php
    require_once("../dao/Historico_UbicacionDAO.php");

class controller
{
    private Historico_UbicacionDAO $his_dao;

    public function __construct()
    {
        $this->his_dao = new Historico_UbicacionDAO();
    }

    // ---------------------------------------- FUNCIONES

    public function cargarHistoricos()
    {
        return $this->his_dao->cargarHistoricos();
    }

    public function cargarHistoricosDeEquipamiento(int $his_equipamiento)
    {
        return $this->his_dao->cargarHistoricosDeEquipamiento($his_equipamiento);
    }

    public function buscarUbicacionPorId(int $his_id)
    {
        return $this->his_dao->buscarUbicacionPorId($his_id);
    }

    public function crearHistorico(Historico_Ubicacion $historico)
    {
        return $this->his_dao->crearHistorico($historico);
    }

    public function editarHistorico(Historico_Ubicacion $historico)
    {
        return $this->his_dao->editarHistorico($historico);
    }

    public function eliminarHistorico(int $his_id)
    {
        return $this->his_dao->eliminarHistorico($his_id);
    }
}

?>