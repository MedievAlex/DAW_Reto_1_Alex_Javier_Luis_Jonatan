<?php
require_once("../controller/Controller.php");
require_once("../model/Usuario.php");

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST');

// No se guarda en caché: es una respuesta con datos de autenticación
header('Cache-Control: no-store');

// límites coherentes con la tabla usuarios y con el hash (bcrypt solo usa 72 caracteres)
const LOGIN_MAX_NOMBRE_USUARIO = 60;
const LOGIN_MAX_PASSWORD = 72;

/**
 * Función que genera la respuesta HTTP.
 *
 * @param int $code Codigo HTTP
 * @param bool $sucess Si ha sido un exito o no
 * @param string $message Mensaje a mostrar en la respuesta
 * @param array $data Datos a enviar en el cuerpo
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

/**
 * Función que convierte un Usuario en array para la sesión y el JSON. El hash nunca se devuelve.
 *
 * @param Usuario $usuario Objeto a convertir
 * @return array Datos del Usuario
 */
function usuarioAArray(Usuario $usuario): array
{
    return [
        "usu_id" => $usuario->getIdUsuario(),
        "nombre" => $usuario->getNombre(),
        "apellidos" => $usuario->getApellidos(),
        "nombre_usuario" => $usuario->getNombreUsuario(),
        "rol" => $usuario->getRol()
    ];
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        // ---------------------------------------- [ COMPROBAR SESION ]
        case 'GET':
            session_start();

            if (!isset($_SESSION["usuario"])) {
                response(401, false, "No hay sesión iniciada.", []);
                break;
            }

            response(200, true, "Sesión activa.", [$_SESSION["usuario"]]);

            break;

        // ---------------------------------------- [ INICIAR SESION ]
        case 'POST':
            // Los datos deben llegar en JSON
            $contenido = $_SERVER["CONTENT_TYPE"] ?? "";

            if (stripos($contenido, "application/json") === false) {
                response(415, false, "Debes enviar los datos en formato JSON.", []);
                break;
            }

            $cuerpo = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $datos = json_decode($cuerpo, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($datos)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
                break;
            }

            $nombre_usuario = is_string($datos["nombre_usuario"] ?? null) ? trim($datos["nombre_usuario"]) : "";
            $password = is_string($datos["password"] ?? null) ? $datos["password"] : ""; // la contraseña no se recorta

            if ($nombre_usuario === "" || $password === "") {
                response(400, false, "Debes indicar nombre_usuario y password.", []);
                break;
            }

            // Con estas longitudes ninguna cuenta puede ser válida: mismo mensaje, sin consultar la BD ni calcular el hash
            if (strlen($nombre_usuario) > LOGIN_MAX_NOMBRE_USUARIO || strlen($password) > LOGIN_MAX_PASSWORD) {
                response(401, false, "Credenciales incorrectas.", []);
                break;
            }

            $controller = new Controller();

            // iniciarSesion compara la contraseña con el hash guardado
            $usuario = $controller->iniciarSesion($nombre_usuario, $password);

            if ($usuario === null) {
                // Mismo mensaje si el usuario no existe o la contraseña es incorrecta
                response(401, false, "Credenciales incorrectas.", []);
                break;
            }

            session_start();
            session_regenerate_id(true);
            $_SESSION["usuario"] = usuarioAArray($usuario);

            // Sesión iniciada: se devuelven los datos del usuario (nunca el hash), con el mismo formato que UsuarioController
            response(200, true, "Sesión iniciada correctamente.", [usuarioAArray($usuario)]);

            break;

        default:
            header("Allow: GET, POST");
            response(405, false, "Método no permitido.", []);

            break;
    }
} catch (Throwable $e) {
    error_log($e->getMessage());
    response(500, false, "Error del servidor.", []);
}

?>
