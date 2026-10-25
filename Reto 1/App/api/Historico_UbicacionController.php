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
            if (isset($_GET["his_id"]) && !isset($_GET["his_equipamiento"]) && !isset($_GET["his_ubicacion"])) {
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
            } elseif (isset($_GET["his_equipamiento"]) && !isset($_GET["his_id"]) && !isset($_GET["his_ubicacion"])) {
                // Buscar Historico Ubicacion por Equipamiento
                $equ_id = filter_var($_GET["his_equipamiento"]); // Obtiene el valor de la variable de la peticion

                if (empty($equ_id) || !is_numeric($equ_id) || $equ_id <= 0) {
                    // ERROR
                    response(400, false, "Valor de EQUIPAMIENTO (ID) no válido.", []);
                } else {
                    // Buscar Historico Ubicacion por EQUIPAMIENTO
                    $historicos = $controller->buscarHistoricosPorEquipamiento($equ_id);
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
            } elseif (isset($_GET["his_ubicacion"]) && !isset($_GET["his_id"]) && !isset($_GET["his_equipamiento"])) {
                // Buscar Historico Ubicacion por Equipamiento
                $ubi_id = filter_var($_GET["his_ubicacion"]); // Obtiene el valor de la variable de la peticion

                if (empty($ubi_id) || !is_numeric($ubi_id) || $ubi_id <= 0) {
                    // ERROR
                    response(400, false, "Valor de UBICACION (ID) no válido.", []);
                } else {
                    // Buscar Historico Ubicacion por UBICACION
                    $historicos = $controller->buscarHistoricosPorUbicacion($ubi_id);
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

                    response(200, true, "Historicos Ubicaciones de la Ubicacion obtenidos correctamente.", $datos);
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
                if (!isset($datos["his_id"]) || !isset($datos["his_equipamiento"]) || !isset($datos["his_equipamiento"]) || !isset($datos["his_ubicacion"]) || !isset($datos["his_fecha_ini"]) || !isset($datos["his_fecha_fin"])) {
                    // Sin datos
                    response(400, false, "El JSON debe tener valores válidos.", []);
                } else {
                    $historico = new Historico_Ubicacion(
                        $datos["his_id"],
                        $datos["his_equipamiento"],
                        $datos["his_ubicacion"],
                        new DateTime($datos['his_fecha_ini']['date'])
                    );

                    if ($controller->crearHistorico($historico)) {
                        // Historico Ubicacion registrado correctamente
                        $historicos = $controller->cargarHistoricos();

                        $historico = $historicos[count($historicos)-1];

                        $datos[] = [
                            "his_id" => $historico->getId(),
                            "his_equipamiento" => $historico->getEquipamiento(),
                            "his_ubicacion" => $historico->getUbicacion(),
                            "his_fecha_ini" => $historico->getFechaInicio(),
                            "his_fecha_fin" => $historico->getFechaFin()
                        ];

                        response(201, true, "Historico Ubicacion registrado correctamente.", $datos);
                    }
                }
            }

            break;

        // ---------------------------------------- [ MODIFICAR ] 
        case 'PUT':
            $contenido = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $body = json_decode($contenido, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($body)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
            } else {
                if (!isset($body["his_id"]) || !isset($body["his_equipamiento"]) || !isset($body["his_equipamiento"]) || !isset($body["his_ubicacion"]) || !isset($body["his_fecha_ini"]) || !isset($body["his_fecha_fin"])) {
                    // Sin datos
                    response(400, false, "El JSON debe tener valores válidos.", []);
                } else {
                    $historico = new Historico_Ubicacion(
                        $body["his_id"],
                        $body["his_equipamiento"],
                        $body["his_ubicacion"],
                        new DateTime($body['his_fecha_ini']['date'])
                    );

                    $historico->setFechaFin(new DateTime($body['his_fecha_fin']['date']));

                    if ($controller->editarHistorico($historico)) {
                        // Historico Ubicacion editado correctamente
                        $historico = $controller->buscarHistoricoPorId($body["his_id"]);

                        $datos[] = [
                            "his_id" => $historico->getId(),
                            "his_equipamiento" => $historico->getEquipamiento(),
                            "his_ubicacion" => $historico->getUbicacion(),
                            "his_fecha_ini" => $historico->getFechaInicio(),
                            "his_fecha_fin" => $historico->getFechaFin()
                        ];

                        response(200, true, "Historico Ubicacion editado correctamente.", $datos);
                    }
                }
            }

            break;

        // ---------------------------------------- [ ELIMINAR ]  
        case 'DELETE':
            if (isset($_GET["his_id"])) {
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
                        response(404, false, "Historico Ubicacion no encontrado.", []);
                    }
                }
            } else {
                // ERROR
                response(400, false, "Sin parámetros válidos para la consulta.", []);
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