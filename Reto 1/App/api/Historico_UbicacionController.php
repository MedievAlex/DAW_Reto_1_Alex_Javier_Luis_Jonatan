<?php
require_once("../controller/Controller.php");
require_once("../model/Historico_Ubicacion.php");

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

$method = $_SERVER['REQUEST_METHOD'];

class Historico_UbicacionController
{
    private Controller $controller;

    public function __construct()
    {
        $this->controller = new Controller();
    }

    // ---------------------------------------- FUNCIONES

    public function cargarHistoricos()
    {
        $historicos = $this->controller->cargarHistoricos();

        $datos = [];

        foreach ($historicos as $historico) {
            $datos[] = [
                "id" => $historico->getId(),
                "equipamiento" => $historico->getEquipamiento(),
                "ubicacion" => $historico->getUbicacion(),
                "fech_ini" => $historico->getFechaInicio(),
                "fech_fin" => $historico->getFechaFin()
            ];
        }

        return json_encode($datos);
    }

    public function buscarHistoricoPorId(int $his_id)
    {
        $historico = $this->controller->buscarHistoricoPorId($his_id);

        $datos[] = [
            "id" => $historico->getId(),
            "equipamiento" => $historico->getEquipamiento(),
            "ubicacion" => $historico->getUbicacion(),
            "fech_ini" => $historico->getFechaInicio(),
            "fech_fin" => $historico->getFechaFin()
        ];

        return json_encode($datos);
    }

    public function cargarHistoricosDeEquipamiento(int $his_equipamiento)
    {
        $historicos = $this->controller->cargarHistoricosDeEquipamiento($his_equipamiento);

        $datos = [];

        foreach ($historicos as $historico) {
            $datos[] = [
                "id" => $historico->getId(),
                "equipamiento" => $historico->getEquipamiento(),
                "ubicacion" => $historico->getUbicacion(),
                "fech_ini" => $historico->getFechaInicio(),
                "fech_fin" => $historico->getFechaFin()
            ];
        }

        return json_encode($datos);
    }

    public function crearHistorico(Historico_Ubicacion $historico)
    {
        $contenido = file_get_contents("php://input");
        $datos = json_decode($contenido, true);
        
        if (
            !is_array($datos) ||
            !isset($datos["nombre"], $datos["email"]) ||
            !is_string($datos["nombre"]) ||
            !is_string($datos["email"]) ||
            trim($datos["nombre"]) === "" ||
            !filter_var($datos["email"], FILTER_VALIDATE_EMAIL)
        ) {
            http_response_code(400);
            echo json_encode([
                "error" => "Los datos enviados no son válidos"
            ]);

            exit;
        }

        //$this->controller->crearHistorico();
    }

    public function editarHistorico(Historico_Ubicacion $historico)
    {
        return $this->controller->editarHistorico($historico);
    }

    public function eliminarHistorico(int $his_id)
    {
        return $this->controller->eliminarHistorico($his_id);
    }
}
