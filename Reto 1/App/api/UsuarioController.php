<?php

/**
 * @author Javier
 */

require_once("../controller/Controller.php");
require_once("../model/Usuario.php");

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

// longitudes máximas de la tabla usuarios
const MAX_NOMBRE = 80;
const MAX_APELLIDOS = 120;
const MAX_NOMBRE_USUARIO = 60;

// MySQL para una clave UNIQUE duplicada
 const ERROR_DUPLICADO = 1062;

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
 * Función que convierte un Usuario en array para el JSON. El hash nunca se devuelve.
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

/**
 * comprueba tipos, longitudes y rol de los datos recibidos.
 *
 * @param array $datos Datos del JSON
 * @return array Datos limpios (nombre, apellidos, nombre_usuario y rol)
 * @throws InvalidArgumentException Si algún dato no es válido
 */
function validarDatos(array $datos):array 
{
    foreach (["nombre", "apellidos", "nombre_usuario", "rol"] as $campo) {
        if (!isset($datos[$campo]) || !is_string($datos[$campo]) || trim($datos[$campo]) === "") {
            throw new InvalidArgumentException("El campo " . $campo . " es obligatorio.");
        }
    }

    $campos = [
        "nombre" => trim($datos["nombre"]),
        "apellidos" => trim($datos["apellidos"]),
        "nombre_usuario" => trim($datos["nombre_usuario"]),
        "rol" => trim($datos["rol"])
    ];

    if (
        strlen($campos["nombre"]) > MAX_NOMBRE
        || strlen($campos["apellidos"]) > MAX_APELLIDOS
        || strlen($campos["nombre_usuario"]) > MAX_NOMBRE_USUARIO
    ) {
        throw new InvalidArgumentException("Alguno de los campos es demasiado largo.");
    }

    if ($campos["rol"] !== Usuario::ROL_ADMIN && $campos["rol"] !== Usuario::ROL_USER) {
        throw new InvalidArgumentException("El rol debe ser ADMIN o USER.");
    }

    return $campos;
}

/**
 * obtiene la contraseña del JSON. La longitud la valida el Controller al cifrarla.
 *
 * @param array $datos Datos del JSON
 * @param bool $obligatoria Si es obligatoria (crear) u opcional (modificar)
 * @return string|null Contraseña recibida, o null si no se ha enviado
 * @throws InvalidArgumentException Si falta o no es un texto
 */
function leerPassword(array $datos, bool $obligatoria): ?string
{
    if (!isset($datos["password"]) || $datos["password"] === "") {
        if ($obligatoria) {
            throw new InvalidArgumentException("El campo password es obligatorio.");
        }

        return null;
    }

    if (!is_string($datos["password"])) {
        throw new InvalidArgumentException("El campo password no es válido.");
    }

    return $datos["password"];
}

$method = $_SERVER['REQUEST_METHOD'];

// ----------------------------------------PERMISOS 
// Solo el Administrador con la sesión iniciada puede gestionar usuarios
session_start();

if (!isset($_SESSION["usuario"])) {
    response(401, false, "Debes iniciar sesión.", []);
    exit;
}

if ($_SESSION["usuario"]["rol"] !== Usuario::ROL_ADMIN) {
    response(403, false, "Solo el Administrador puede gestionar usuarios.", []);
    exit;
}

try {
    $controller = new Controller();

    switch ($method) {
        // ----------------------------------------OBTENER
        case 'GET':
            if (isset($_GET["usu_id"])) {
                // Buscar Usuario por ID
                $usu_id = filter_var($_GET["usu_id"], FILTER_VALIDATE_INT); // Obtiene el valor de la variable de la peticion

                if ($usu_id === false || $usu_id <= 0) {
                    // ERROR
                    response(400, false, "Valor de USU_ID no válido.", []);
                } else {
                    $usuario = $controller->buscarUsuarioPorId($usu_id);

                    if ($usuario) { // Usuario existe
                        response(200, true, "Usuario obtenido correctamente.", [usuarioAArray($usuario)]);
                    } else {
                        // Usuario no existe
                        response(404, false, "Usuario no encontrado.", []);
                    }
                }
            } else {
                // Obtener Usuarios
                $usuarios = $controller->cargarUsuarios();
                $datos = [];

                foreach ($usuarios as $usuario) {
                    $datos[] = usuarioAArray($usuario);
                }

                response(200, true, "Usuarios obtenidos correctamente.", $datos);
            }

            break;

        // ----------------------------------------CREAR 
        case 'POST':
            $contenido = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $datos = json_decode($contenido, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($datos)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
            } else {
                $campos = validarDatos($datos);
                $password = leerPassword($datos, true);

                if ($controller->existeNombreUsuario($campos["nombre_usuario"])) {
                    // Nombre de usuario repetido
                    response(409, false, "El nombre de usuario ya está en uso.", []);
                } else {
                    $usuario = new Usuario(
                        null,
                        $campos["nombre"],
                        $campos["apellidos"],
                        $campos["nombre_usuario"],
                        "",
                        $campos["rol"]
                    );

                    // registrarUsuario valida la contraseña y la guarda cifrada
                    if ($controller->registrarUsuario($usuario, $password)) {
                        // Usuario registrado correctamente
                        $creado = $controller->buscarUsuarioPorNombreUsuario($campos["nombre_usuario"]);
                        response(201, true, "Usuario registrado correctamente.", [usuarioAArray($creado)]);
                    } else {
                        response(500, false, "No se pudo registrar el Usuario.", []);
                    }
                }
            }

            break;

        // ----------------------------------------MODIFICAR 
        case 'PUT':
            $contenido = file_get_contents("php://input"); // Obtiene los datos del body de la petición
            $datos = json_decode($contenido, true); // Decodifica el JSON a un Array asociativo

            if (!is_array($datos)) {
                // Sin JSON
                response(400, false, "El cuerpo debe de tener un JSON válido.", []);
            } else {
                $usu_id = filter_var($datos["usu_id"] ?? null, FILTER_VALIDATE_INT);

                if ($usu_id === false || $usu_id <= 0) {
                    // ERROR
                    response(400, false, "Valor de USU_ID no válido.", []);
                } else {
                    $campos = validarDatos($datos);
                    $password = leerPassword($datos, false); // opcional: sin password se mantiene la actual

                    // Buscar Usuario por ID para verificar que existe
                    $usuario = $controller->buscarUsuarioPorId($usu_id);

                    if (!$usuario) {
                        // Usuario no existe
                        response(404, false, "Usuario no encontrado.", []);
                    } elseif ($controller->existeNombreUsuario($campos["nombre_usuario"], $usu_id)) {
                        // Nombre de usuario repetido
                        response(409, false, "El nombre de usuario ya está en uso.", []);
                    } elseif ($usuario->esAdmin() && $campos["rol"] !== Usuario::ROL_ADMIN && $controller->contarAdministradores() <= 1) {
                        // No se puede dejar al sistema sin Administradores
                        response(409, false, "Debe existir al menos un Administrador.", []);
                    } else {
                        if ($password !== null) {
                            $controller->cambiarPassword($usu_id, $password);
                            // se vuelve a cargar para no pisar el hash nuevo al editar
                            $usuario = $controller->buscarUsuarioPorId($usu_id);
                        }

                        $usuario->setNombre($campos["nombre"])
                            ->setApellidos($campos["apellidos"])
                            ->setNombreUsuario($campos["nombre_usuario"])
                            ->setRol($campos["rol"]);

                        if ($controller->editarUsuario($usuario)) {
                            // Usuario editado correctamente
                            response(200, true, "Usuario editado correctamente.", [usuarioAArray($usuario)]);
                        } else {
                            response(500, false, "No se pudo editar el Usuario.", []);
                        }
                    }
                }
            }

            break;

        // ----------------------------------------ELIMINAR
        case 'DELETE':
            if (isset($_GET["usu_id"])) {
                $usu_id = filter_var($_GET["usu_id"], FILTER_VALIDATE_INT); // Obtiene el valor de la variable de la peticion

                if ($usu_id === false || $usu_id <= 0) {
                    // ERROR
                    response(400, false, "Valor de USU_ID no válido.", []);
                } else {
                    // Buscar Usuario por ID para verificar que existe
                    $usuario = $controller->buscarUsuarioPorId($usu_id);

                    if (!$usuario) {
                        // Usuario no existe
                        response(404, false, "Usuario no encontrado.", []);
                    } 
                    elseif ($usuario->esAdmin() && $controller->contarAdministradores() <= 1) {
                        // No se puede dejar al sistema sin Administradores
                        response(409, false, "No se puede eliminar al único Administrador.", []);
                    }
                    elseif ($controller->tieneNotificaciones($usu_id)) {
                        // La base de datos no permite borrar un Usuario con Notificaciones
                        response(409, false, "No se puede eliminar un Usuario que tiene Notificaciones.", []);
                    } 
                    elseif ($controller->eliminarUsuario($usu_id)) {
                        // Usuario eliminado correctamente
                        response(200, true, "Usuario eliminado correctamente.", []);
                    } 
                    else {
                        response(500, false, "No se pudo eliminar el Usuario.", []);
                    }
                }
            } else {
                response(400, false, "Falta el USU_ID del Usuario.", []);
            }

            break;

        default:
            response(405, false, "Metodo no permitido.", []);

            break;
    }
} catch (InvalidArgumentException $e) {
    // Datos no válidos
    response(400, false, $e->getMessage(), []);
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() === ERROR_DUPLICADO) {
        // Otro Usuario con el mismo nombre creado justo a la vez
        response(409, false, "El nombre de usuario ya está en uso.", []);
    } else {
        error_log($e->getMessage());
        response(500, false, "Server error.", []);
    }
} catch (Exception $e) {
    error_log($e->getMessage());
    response(500, false, "Server error.", []);
}

?>