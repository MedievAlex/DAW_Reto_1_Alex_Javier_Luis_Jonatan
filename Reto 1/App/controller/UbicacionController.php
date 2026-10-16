<?php
require_once("../controller/Controller.php");

class UbicacionController
{
    private Controller $controller;

    public function __construct()
    {
        $this->controller = new Controller();
    }

    // ---------------------------------------- FUNCIONES

    public function cargarUbicaciones()
    {
        $ubicaciones = $this->controller->cargarHistoricos();

        $datos = [];

        foreach ($ubicaciones as $ubicacion) {
            $datos[] = [
                "id" => $ubicacion->getId(),
                "equipamiento" => $ubicacion->getEquipamiento(),
                "ubicacion" => $ubicacion->getUbicacion(),
                "fech_ini" => $ubicacion->getFechaInicio(),
                "fech_fin" => $ubicacion->getFechaFin()
            ];
        }

        return json_encode($datos);
    }

    public function buscarUbicacionPorId(int $ubi_id)
    {
        return $this->controller->buscarUbicacionPorId($ubi_id);
    }

    public function buscarUbicacionPorNombre(string $ubi_nombre)
    {
        return $this->controller->buscarUbicacionPorNombre($ubi_nombre);
    }

    public function crearUbicacion(Ubicacion $ubicacion)
    {
        return $this->controller->crearUbicacion($ubicacion);
    }

    public function editarUbicacion(Ubicacion $ubicacion)
    {
        return $this->controller->editarUbicacion($ubicacion);
    }

    public function eliminarUbicacion(int $ubi_id)
    {
        return $this->controller->eliminarUbicacion($ubi_id);
    }
}

?>