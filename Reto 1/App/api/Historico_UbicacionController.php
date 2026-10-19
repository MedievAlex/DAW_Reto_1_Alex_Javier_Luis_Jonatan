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
            if (isset($_GET["id"]) && !isset($_GET["equipamiento"])) {
                // Buscar Historico Ubicacion por ID
                $id = filter_var($_GET["id"]); // Obtiene el valor de la variable de la peticion

                if (empty($id) || !is_numeric($id) || $id <= 0) {
                    // ERROR
                    response(400, false, "Valor de ID no válida.", []);
                } else {
                    // Buscar Historico Ubicacion por ID
                    $historico = $controller->buscarHistoricoPorId($id);

                    if ($historico) { // Historico Ubicacion existe
                        $datos[] = [
                            "id" => $historico->getId(),
                            "equipamiento" => $historico->getEquipamiento(),
                            "ubicacion" => $historico->getUbicacion(),
                            "fecha_ini" => $historico->getFechaInicio(),
                            "fecha_fin" => $historico->getFechaFin()
                        ];

                        response(200, true, "Historico Ubicacion obtenido correctamente.", $datos);
                    } else {
                        // Historico Ubicacion no existe
                        response(404, false, "Historico Ubicacion no encontrado.", []);
                    }
                }
            } elseif (isset($_GET["equipamiento"]) && !isset($_GET["id"])) {
                // Buscar Historico Ubicacion por Equipamiento
                $equ_id = filter_var($_GET["equipamiento"]); // Obtiene el valor de la variable de la peticion

                if (empty($equ_id) || !is_numeric($equ_id) || $equ_id <= 0) {
                    // ERROR
                    response(400, false, "Valor de EQUIPAMIENTO (ID) no válido.", []);
                } else {
                    // Buscar Ubicacion por NOMBRE
                    $historicos = $controller->cargarHistoricosDeEquipamiento($equ_id);
                    $datos = [];

                    foreach ($historicos as $historico) {
                        $datos[] = [
                            "id" => $historico->getId(),
                            "equipamiento" => $historico->getEquipamiento(),
                            "ubicacion" => $historico->getUbicacion(),
                            "fecha_ini" => $historico->getFechaInicio(),
                            "fecha_fin" => $historico->getFechaFin()
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
                        "id" => $historico->getId(),
                        "equipamiento" => $historico->getEquipamiento(),
                        "ubicacion" => $historico->getUbicacion(),
                        "fecha_ini" => $historico->getFechaInicio(),
                        "fecha_fin" => $historico->getFechaFin()
                    ];
                }

                response(200, true, "Historicos Ubicaciones obtenidos correctamente.", $datos);
            }

            break;

        // ---------------------------------------- [ CREAR ]
        case 'POST':
            /*      
            $contenido = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $datos = json_decode($contenido, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($datos)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
            } else {
                if (!isset($datos["nombre"]) || !isset($datos["descripcion"])) {
                    // Sin datos
                    response(400, false, "El JSON debe tener valores válidos.", []);
                } else {
                    $ubicacion = new Ubicacion(
                        $datos["id"],
                        $datos["nombre"],
                        $datos["descripcion"]
                    );

                    if ($controller->crearUbicacion($ubicacion)) {
                        // Ubicacion registrada correctamente
                        response(201, true, "Ubicacion registrada correctamente.", []);
                    }
                }
            }
            */

            break;

        // ---------------------------------------- [ MODIFICAR ] 
        case 'PUT':

            /*
            $contenido = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $datos = json_decode($contenido, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($datos)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
            } else {
                if (!isset($datos["nombre"]) || !isset($datos["descripcion"])) {
                    // Sin datos
                    response(400, false, "El JSON debe tener valores válidos.", []);
                } else {
                    $ubicacion = new Ubicacion(
                        $datos["id"],
                        $datos["nombre"],
                        $datos["descripcion"]
                    );

                    if ($controller->editarUbicacion($ubicacion)) {
                        // Ubicacion editada correctamente
                        response(200, true, "Ubicacion editada correctamente.", []);
                    }
                }
            }
            */

            break;

        // ---------------------------------------- [ ELIMINAR ]  
        case 'DELETE':

            /*
            if (isset($_GET["id"])) {
                $id = filter_var($_GET["id"]); // Obtiene el valor de la variable de la peticion

                if (empty($id) || !is_numeric($id) || $id <= 0) {
                    // ERROR
                    response(400, false, "Valor de ID no válida.", []);
                } else {

                    // Buscar Ubicacion por ID para verificar que existe
                    $ubicacion = $controller->buscarUbicacionPorId($id);

                    if ($ubicacion) { // Ubicacion existe
                        // Elimina la ubicacion
                        if ($controller->eliminarUbicacion($ubicacion->getId())) {
                            // Ubicacion eliminada correctamente
                            response(200, true, "Ubicacion eliminada correctamente.", []);
                        }
                    } else {
                        // Ubicacion no existe
                        response(404, false, "Ubicacion no encontrada.", []);
                    }
                }
            }
            */

            break;

        default:
            response(405, false, "Metodo no permitido.", []);

            break;
    }
} catch (Exception $e) {
    response(500, false, "Server error: " . $e->getMessage(), []);
}

?>