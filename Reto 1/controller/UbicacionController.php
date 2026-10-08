<?php
    require_once("../dao/Historico_UbicacionDAO.php");

class UbicacionController
{
    private UbicacionDAO $ubi_dao;

    public function __construct()
    {
        $this->ubi_dao = new UbicacionDAO();
    }

    // ---------------------------------------- FUNCIONES

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
}

?>