<?php
require_once("../controller/Controller.php");
require_once("../model/Historico_Ubicacion.php");

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

/**
 * Función que genera la respuesta HTTP.
 *
 * @param int $code Codigo HTTP
 * @param bool $sucess Si ha sido un exito o no
 * @param string $message Mensaje a mostrar en la respuesta
 * @param array $data Datos a enviar en el cuerpo
 * 
 * @author Alex
 */
function response(int $code, bool $sucess, string $message, array $data)
{
    http_response_code($code);
    echo json_encode([
        'code' => $code,
        'success' => $sucess,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

$method = $_SERVER['REQUEST_METHOD'];

/*
    public function crearHistorico(Historico_Ubicacion $historico)
    public function editarHistorico(Historico_Ubicacion $historico)
    public function eliminarHistorico(int $his_id)
*/

try {
    $controller = new Controller();
    //$userData = getUserData();

    switch ($method) {
        // ---------------------------------------- [ OBTENER ]  
        case 'GET':
            if (isset($_GET["his_id"]) && !isset($_GET["his_equipamiento"])) {
                // Buscar Historico Ubicacion por ID
                $id = filter_var($_GET["his_id"]); // Obtiene el valor de la variable de la peticion

                if (empty($id) || !is_numeric($id) || $id <= 0) {
                    // ERROR
                    response(400, false, "Valor de ID no válida.", []);
                } else {
                    // Buscar Historico Ubicacion por ID
                    $historico = $controller->buscarHistoricoPorId($id);

                    if ($historico) { // Historico Ubicacion existe
                        $datos[] = [
                            "his_id" => $historico->getId(),
                            "his_equipamiento" => $historico->getEquipamiento(),
                            "his_ubicacion" => $historico->getUbicacion(),
                            "his_fecha_ini" => $historico->getFechaInicio(),
                            "his_fecha_fin" => $historico->getFechaFin()
                        ];

                        response(200, true, "Historico Ubicacion obtenido correctamente.", $datos);
                    } else {
                        // Historico Ubicacion no existe
                        response(404, false, "Historico Ubicacion no encontrado.", []);
                    }
                }
            } elseif (isset($_GET["his_equipamiento"]) && !isset($_GET["his_id"])) {
                // Buscar Historico Ubicacion por Equipamiento
                $equ_id = filter_var($_GET["his_equipamiento"]); // Obtiene el valor de la variable de la peticion

                if (empty($equ_id) || !is_numeric($equ_id) || $equ_id <= 0) {
                    // ERROR
                    response(400, false, "Valor de EQUIPAMIENTO (ID) no válido.", []);
                } else {
                    // Buscar Ubicacion por NOMBRE
                    $historicos = $controller->cargarHistoricosDeEquipamiento($equ_id);
                    $datos = [];

                    foreach ($historicos as $historico) {
                        $datos[] = [
                            "his_id" => $historico->getId(),
                            "his_equipamiento" => $historico->getEquipamiento(),
                            "his_ubicacion" => $historico->getUbicacion(),
                            "his_fecha_ini" => $historico->getFechaInicio(),
                            "his_fecha_fin" => $historico->getFechaFin()
                        ];
                    }

                    response(200, true, "Historicos Ubicaciones del Equipamiento obtenidos correctamente.", $datos);
                }
            } else {
                // Obtener Historicos Ubicaciones
                $historicos = $controller->cargarHistoricos();
                $datos = [];

                foreach ($historicos as $historico) {
                    $datos[] = [
                        "his_id" => $historico->getId(),
                        "his_equipamiento" => $historico->getEquipamiento(),
                        "his_ubicacion" => $historico->getUbicacion(),
                        "his_fecha_ini" => $historico->getFechaInicio(),
                        "his_fecha_fin" => $historico->getFechaFin()
                    ];
                }

                response(200, true, "Historicos Ubicaciones obtenidos correctamente.", $datos);
            }

            break;

        // ---------------------------------------- [ CREAR ]
        case 'POST':
            $contenido = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $datos = json_decode($contenido, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($datos)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
            } else {
                if (!isset($datos["his_equipamiento"]) || !isset($datos["his_ubicacion"]) || !isset($datos["his_fecha_ini"])) {
                    // Sin datos
                    response(400, false, "El JSON debe tener valores válidos.", []);
                } else {
                    $historico = new Historico_Ubicacion(
                        $datos["his_id"],
                        $datos["his_equipamiento"],
                        $datos["his_ubicacion"],
                        $datos["his_fecha_ini"]
                    );

                    $datos[] = [
                        "his_id" => $historico->getId(),
                        "his_equipamiento" => $historico->getEquipamiento(),
                        "his_ubicacion" => $historico->getUbicacion(),
                        "his_fecha_ini" => $historico->getFechaInicio()
                    ];

                    if ($controller->crearHistorico($historico)) {
                        // Historico Ubicacion registrado correctamente
                        response(201, true, "Historico Ubicacion registrado correctamente.", $datos);
                    }
                }
            }
            
            break;

        // ---------------------------------------- [ MODIFICAR ] 
        case 'PUT':
            $contenido = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $datos = json_decode($contenido, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($datos)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
            } else {
                if (!isset($datos["his_nombre"]) || !isset($datos["his_descripcion"])) {
                    // Sin datos
                    response(400, false, "El JSON debe tener valores válidos.", []);
                } else {
                    $historico = new Historico_Ubicacion(
                        $datos["his_id"],
                        $datos["his_equipamiento"],
                        $datos["his_ubicacion"],
                        $datos["his_fecha_ini"]
                    );

                    $historico->setFechaFin($datos["his_fecha_fin"]);

                    $datos[] = [
                        "his_id" => $historico->getId(),
                        "his_equipamiento" => $historico->getEquipamiento(),
                        "his_ubicacion" => $historico->getUbicacion(),
                        "his_fecha_ini" => $historico->getFechaInicio(),
                        "his_fecha_fin" => $historico->getFechaFin()
                    ];

                    if ($controller->editarHistorico($historico)) {
                        // Historico Ubicacion editado correctamente
                        response(200, true, "Historico Ubicacion editado correctamente.", $datos);
                    }
                }
            }

            break;

        // ---------------------------------------- [ ELIMINAR ]  
        case 'DELETE':
            if (isset($_GET["id"])) {
                $id = filter_var($_GET["his_id"]); // Obtiene el valor de la variable de la peticion

                if (empty($id) || !is_numeric($id) || $id <= 0) {
                    // ERROR
                    response(400, false, "Valor de ID no válida.", []);
                } else {

                    // Buscar Historico Ubicacion por ID para verificar que existe
                    $historico = $controller->buscarHistoricoPorId($id);

                    if ($historico) { // Historico Ubicacion existe
                        // Elimina el Historico Ubicacion
                        if ($controller->eliminarHistorico($historico->getId())) {
                            // Historico Ubicacion eliminada correctamente
                            response(200, true, "Historico Ubicacion eliminado correctamente.", []);
                        }
                    } else {
                        // Historico Ubicacion no existe
                        response(404, false, "Ubicacion no encontrada.", []);
                    }
                }
            }

            break;

        default:
            response(405, false, "Metodo no permitido.", []);

            break;
    }
} catch (Exception $e) {
    response(500, false, "Server error: " . $e->getMessage(), []);
}

?>