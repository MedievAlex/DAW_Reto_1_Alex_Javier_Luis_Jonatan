<?php
require_once("../dao/Historico_UbicacionDAO.php");

class Historico_UbicacionController
{
    private Historico_UbicacionDAO $his_dao;

    public function __construct()
    {
        $this->his_dao = new Historico_UbicacionDAO();
    }

    // ---------------------------------------- FUNCIONES

    public function cargarHistoricos()
    {
        $historicos = $this->his_dao->cargarHistoricos();

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
        $historico = $this->his_dao->buscarHistoricoPorId($his_id);

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
        $historicos = $this->his_dao->cargarHistoricosDeEquipamiento($his_equipamiento);

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

        $this->his_dao->crearHistorico();
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
