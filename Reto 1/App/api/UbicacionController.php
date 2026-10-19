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

/*
    public function crearUbicacion(Ubicacion $ubicacion) POST
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
    }*/

$method = $_SERVER['REQUEST_METHOD'];

try {
    $controller = new Controller();
    //$userData = getUserData();

    switch ($method) {
        case 'GET': // OBTENER

            if (isset($_GET["id"]) && !isset($_GET["nombre"])) { // Buscar Ubicacion por ID
                $id = filter_var($_GET["id"]); // Obtiene el valor de la variable de la peticion

                if (empty($id) || !is_numeric($id) || $id <= 0) {
                    // ERROR
                    response(400, false, "Valor de ID no válida.", []);
                } else {
                    // Buscar Ubicacion por ID
                    $ubicacion = $controller->buscarUbicacionPorId($id);

                    if ($ubicacion) { // Ubicacion existe
                        $datos[] = [
                            "id" => $ubicacion->getId(),
                            "nombre" => $ubicacion->getNombre(),
                            "descripcion" => $ubicacion->getDescripcion()
                        ];

                        response(200, true, "Ubicacion obtenida correctamente.", $datos);
                    } else {
                        // Ubicacion no existe
                        response(404, false, "Ubicacion no encontrada.", []);
                    }
                }
            } elseif (isset($_GET["nombre"]) && !isset($_GET["id"])) {
                $nombre = filter_var($_GET["nombre"]); // Obtiene el valor de la variable de la peticion

                if (empty($nombre) || is_numeric($nombre)) {
                    // ERROR
                    response(400, false, "Valor de NOMBRE no válido.", []);
                } else {
                    // Buscar Ubicacion por NOMBRE
                    $ubicacion = $controller->buscarUbicacionPorNombre($nombre);

                    if ($ubicacion) {
                        // Ubicacion existe
                        $datos[] = [
                            "id" => $ubicacion->getId(),
                            "nombre" => $ubicacion->getNombre(),
                            "descripcion" => $ubicacion->getDescripcion()
                        ];

                        response(200, true, "Ubicacion obtenida correctamente.", $datos);
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
                        "id" => $ubicacion->getId(),
                        "nombre" => $ubicacion->getNombre(),
                        "descripcion" => $ubicacion->getDescripcion()
                    ];
                }

                response(200, true, "Ubicaciones obtenidas correctamente.", $datos);
            }

            break;

        case 'POST': // CREAR
            $datos = json_decode(file_get_contents("php://input"), true); // Obtiene los datos del body de la petición

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

            break;

        case 'PUT': // MODIFICAR

            break;

        case 'DELETE': // ELIMINAR

            break;

        default:
            response(405, false, "Metodo no permitido.", []);

            break;
    }
} catch (Exception $e) {
    response(500, false, "Server error: " . $e->getMessage(), []);
}

?>