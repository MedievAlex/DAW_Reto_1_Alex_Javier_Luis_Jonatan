<?php
require_once("../controller/Controller.php");
require_once("../model/Ubicacion.php");

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

try {
    $controller = new Controller();
    //$userData = getUserData();

    switch ($method) {
        // ---------------------------------------- [ OBTENER ]  
        case 'GET': // OBTENER
            if (isset($_GET["ubi_id"]) && !isset($_GET["ubi_nombre"]) && !isset($_GET["equ_ubi_id"])) { // Buscar Ubicacion por ID
                $id = filter_var($_GET["ubi_id"]); // Obtiene el valor de la variable de la peticion

                if (empty($id) || !is_numeric($id) || $id <= 0) {
                    // ERROR
                    response(400, false, "Valor de ID no válida.", []);
                } else {
                    // Buscar Ubicacion por ID
                    $ubicacion = $controller->buscarUbicacionPorId($id);

                    if ($ubicacion) { // Ubicacion existe
                        $datos[] = [
                            "ubi_id" => $ubicacion->getId(),
                            "ubi_nombre" => $ubicacion->getNombre(),
                            "ubi_descripcion" => $ubicacion->getDescripcion()
                        ];

                        response(200, true, "Ubicacion obtenida correctamente.", $datos);
                    } else {
                        // Ubicacion no existe
                        response(404, false, "Ubicacion no encontrada.", []);
                    }
                }
            } elseif (isset($_GET["ubi_nombre"]) && !isset($_GET["ubi_id"]) && !isset($_GET["equ_ubi_id"])) {
                $nombre = filter_var($_GET["ubi_nombre"]); // Obtiene el valor de la variable de la peticion

                if (empty($nombre) || is_numeric($nombre)) {
                    // ERROR
                    response(400, false, "Valor de NOMBRE no válido.", []);
                } else {
                    // Buscar Ubicacion por NOMBRE
                    $ubicacion = $controller->buscarUbicacionPorNombre($nombre);

                    if ($ubicacion) {
                        // Ubicacion existe
                        $datos[] = [
                            "ubi_id" => $ubicacion->getId(),
                            "ubi_nombre" => $ubicacion->getNombre(),
                            "ubi_descripcion" => $ubicacion->getDescripcion()
                        ];

                        response(200, true, "Ubicacion obtenida correctamente.", $datos);
                    } else {
                        // Ubicacion no existe
                        response(404, false, "Ubicacion no encontrada.", []);
                    }
                }
            } elseif (isset($_GET["equ_ubi_id"]) && !isset($_GET["ubi_id"]) && !isset($_GET["ubi_nombre"])) {
                $id = filter_var($_GET["equ_ubi_id"]); // Obtiene el valor de la variable de la peticion

                if (empty($id) || !is_numeric($id) || $id <= 0) {
                    // ERROR
                    response(400, false, "Valor de ID no válida.", []);
                } else {
                    // Buscar Ubicacion por ID para verificar que existe
                    $ubicacion = $controller->buscarUbicacionPorId($id);

                    if ($ubicacion) { // Ubicacion existe
                        $contieneEqu = $controller->verificarEquipamientos($id);

                        $datos[] = [
                            "equ_ubi" => $contieneEqu
                        ];

                        if ($contieneEqu) { // Ubicacion existe
                            response(200, true, "La Ubicacion tiene Equipamientos.", $datos);
                        } else {
                            // Ubicacion no existe
                            response(200, true, "La Ubicacion no tiene Equipamientos.", $datos);
                        }
                    } else {
                        // Ubicacion no existe
                        response(404, false, "Ubicacion no encontrada.", []);
                    }
                }
            } else {
                // Obtener Ubicaciones
                $ubicaciones = $controller->cargarUbicaciones();
                $datos = [];

                foreach ($ubicaciones as $ubicacion) {
                    $datos[] = [
                        "ubi_id" => $ubicacion->getId(),
                        "ubi_nombre" => $ubicacion->getNombre(),
                        "ubi_descripcion" => $ubicacion->getDescripcion()
                    ];
                }

                response(200, true, "Ubicaciones obtenidas correctamente.", $datos);
            }

            break;

        // ---------------------------------------- [ CREAR ]
        case 'POST': // CREAR            
            $contenido = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $body = json_decode($contenido, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($body)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
            } else {
                if (!isset($body["ubi_id"]) || !isset($body["ubi_nombre"]) || !isset($body["ubi_descripcion"])) {
                    // Sin datos
                    response(400, false, "El JSON debe tener valores válidos.", []);
                } else {
                    $ubicacion = new Ubicacion(
                        $body["ubi_id"],
                        $body["ubi_nombre"],
                        $body["ubi_descripcion"]
                    );

                    if ($controller->crearUbicacion($ubicacion)) {
                        // Ubicacion registrada correctamente
                        $ubicaciones = $controller->cargarUbicaciones();

                        $ubicacion = $ubicaciones[count($ubicaciones) - 1];

                        $datos[] = [
                            "ubi_id" => $ubicacion->getId(),
                            "ubi_nombre" => $ubicacion->getNombre(),
                            "ubi_descripcion" => $ubicacion->getDescripcion()
                        ];

                        response(201, true, "Ubicacion registrada correctamente.", $datos);
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
                if (!isset($body["ubi_id"]) || !isset($body["ubi_nombre"]) || !isset($body["ubi_descripcion"])) {
                    // Sin datos
                    response(400, false, "El JSON debe tener valores válidos.", []);
                } else {
                    // Buscar Ubicacion por ID para verificar que existe
                    $ubicacion = $controller->buscarUbicacionPorId($body["ubi_id"]);

                    if ($ubicacion) { // Ubicacion existe
                        $ubicacion = new Ubicacion(
                            $body["ubi_id"],
                            $body["ubi_nombre"],
                            $body["ubi_descripcion"]
                        );

                        if ($controller->editarUbicacion($ubicacion)) {
                            // Ubicacion editada correctamente
                            $ubicacion = $controller->buscarUbicacionPorId($body["ubi_id"]);

                            $datos[] = [
                                "ubi_id" => $ubicacion->getId(),
                                "ubi_nombre" => $ubicacion->getNombre(),
                                "ubi_descripcion" => $ubicacion->getDescripcion()
                            ];

                            response(200, true, "Ubicacion editada correctamente.", $datos);
                        } else {
                            response(500, false, "Error al modificar la Ubicación.", []);
                        }
                    } else {
                        // Ubicacion no existe
                        response(404, false, "Ubicacion no encontrada.", []);
                    }
                }
            }

            break;

        // ---------------------------------------- [ ELIMINAR ]  
        case 'DELETE':
            if (isset($_GET["ubi_id"])) {
                $id = filter_var($_GET["ubi_id"]); // Obtiene el valor de la variable de la peticion

                if (empty($id) || !is_numeric($id) || $id <= 0) {
                    // ERROR
                    response(400, false, "Valor de ID no válida.", []);
                } else {
                    // Buscar Ubicacion por ID para verificar que existe
                    $ubicacion = $controller->buscarUbicacionPorId($id);

                    if ($ubicacion) { // Ubicacion existe
                        // Elimina la Ubicacion
                        if ($controller->eliminarUbicacion($ubicacion->getId())) {
                            // Ubicacion eliminada correctamente
                            response(200, true, "Ubicacion eliminada correctamente.", []);
                        }
                    } else {
                        // Ubicacion no existe
                        response(404, false, "Ubicacion no encontrada.", []);
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
