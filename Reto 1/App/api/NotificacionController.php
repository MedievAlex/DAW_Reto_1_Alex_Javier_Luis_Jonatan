<?php
require_once ("../controller/Controller.php");
require_once ("../model/Notificacion.php");

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

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

    switch ($method) {
        case 'GET':
            if(isset($_GET['id_notificacion'])) {
                $not_id = filter_var($_GET['id_notificacion']);

                $notificacion = $controller->consultarNotificacionesId($not_id);
                if ($notificacion) {
                    $datos[] = [
                        "not_id" => $notificacion->getIdNotificacion(),
                        "titulo" => $notificacion->getTitulo(),
                        "descripcion" => $notificacion->getDescripcion(),
                        "fecha" => $notificacion->getFecha(),
                        "estado" => $notificacion->getEstado()
                    ];

                    response(200, true, "Notificación encontrada", $datos);
                } else {
                    response(404, false, "Notificación no encontrada", []);
                }
            } elseif (isset($_GET['id_usuario'])) {
                $usu_id = filter_var($_GET['id_usuario']);

                $notificacion = $controller->consultarNotificacionesIdUsu($usu_id);
                if ($notificacion) {
                    $datos[] = [
                        "usu_id" => $notificacion->getIdNotificacion(),
                        "titulo" => $notificacion->getTitulo(),
                        "descripcion" => $notificacion->getDescripcion(),
                        "fecha" => $notificacion->getFecha(),
                        "estado" => $notificacion->getEstado()
                    ];

                    response(200, true, "Notificación encontrada", $datos);
                } else {
                    response(404, false, "Notificación no encontrada", []);
                }
            } else {
                $notificaciones = $controller->consultarNotificaciones();
                $datos = [];
                foreach ($notificaciones as $notificacion) {
                    $datos[] = [
                        "not_id" => $notificacion->getIdNotificacion(),
                        "titulo" => $notificacion->getTitulo(),
                        "descripcion" => $notificacion->getDescripcion(),
                        "fecha" => $notificacion->getFecha(),
                        "estado" => $notificacion->getEstado()
                    ];
                }
                response(200, true, "Lista de notificaciones", $datos);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!is_array($data)) {
                response(400, false, "Datos inválidos", []);

            } else {
                if (!isset($data['titulo']) || !isset($data['descripcion']) || !isset($data['fecha'])) {
                    response(400, false, "Datos incompletos", []);
                } else {
                $notificacion = new Notificacion(
                        $data['not_id'],
                        $data['titulo'],
                        $data['descripcion'],
                        new DateTime($data['fecha']['date']),
                        Estado::from($data['estado'])
                    );

                    $resultado = $controller->crearNotificacion($notificacion);
                    if ($resultado) {
                        response(201, true, "Notificación creada exitosamente", []);
                    } else {
                        response(500, false, "Error al crear la notificación", []);
                    }

                }
            }
            break;
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!is_array($data)) {
                response(400, false, "Datos inválidos", []);
                exit;
            } else {
                if (!isset($data['not_id']) || !isset($data['titulo']) || !isset($data['descripcion']) || !isset($data['fecha'])) {
                    response(400, false, "Datos incompletos", []);
                    exit;
                } else {
                    $notificacion = new Notificacion(
                        $data['not_id'],
                        $data['titulo'],
                        $data['descripcion'],
                        new DateTime($data['fecha']['date']),
                        Estado::from($data['estado'])
                    );

                    $resultado = $controller->modificarNotificacion($notificacion);
                    if ($resultado) {
                        response(200, true, "Notificación actualizada exitosamente", $data);
                    } else {
                        response(500, false, "Error al actualizar la notificación", []);
                    }
                }
            }
            break;
        case 'DELETE':
            $data = json_decode(file_get_contents('php://input'), true);
            $not_id = $_GET['not_id'] ?? $_GET['id_notificacion'] ?? (is_array($data) ? ($data['not_id'] ?? null) : null);
            $not_id = filter_var($not_id, FILTER_VALIDATE_INT);

            if ($not_id === false || $not_id === null) {
                response(400, false, "ID de notificación no proporcionado o inválido", []);
            }

            $resultado = $controller->eliminarNotificacion($not_id);
            if ($resultado) {
                response(200, true, "Notificación eliminada exitosamente", []);
            } else {
                response(500, false, "Error al eliminar la notificación", []);
            }
            break;
        default:
            response(405, false, "Método no permitido", []);
            break;
    }
} catch (Exception $e) {
    response(500, false, "Server error: " . $e->getMessage(), []);
}
