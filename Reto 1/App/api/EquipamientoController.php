<?php
/**
 * API de equipamientos.
 *
 * Recibe peticiones HTTP, valida los datos y permisos del usuario,
 * llama a Controller y envía respuestas en formato JSON.
 *
 * El archivo se organiza en cuatro bloques:
 * 1. Configuración y dependencias.
 * 2. Funciones auxiliares: respuestas, validación y permisos.
 * 3. Operaciones de equipamiento.
 * 4. Gestión de la petición HTTP y de los errores.
 *
 * @author Jonatan Tajada Rico
 */


// ============================================================
// CONFIGURACIÓN Y DEPENDENCIAS
// ============================================================

// Respuestas en formato JSON con codificación UTF-8.
header("Content-Type: application/json; charset=utf-8");

// Controlador, enum y modelo necesarios para esta API.
require_once __DIR__ . "/../controller/Controller.php";
require_once __DIR__ . "/../model/Categoria.php";
require_once __DIR__ . "/../model/Equipamiento.php";



// ============================================================
// FUNCIONES AUXILIARES: RESPUESTAS, VALIDACIÓN Y PERMISOS
// ============================================================

/**
 * Envía una respuesta JSON al cliente que realizó la petición y finaliza el script.
 * @param int $codigoEstado Código de estado HTTP de la respuesta.
 * @param bool $exito Indica si la operación ha tenido éxito.
 * @param string $mensaje Explicación del resultado.
 * @param array $datos Datos enviados al frontend; vacío por defecto.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function enviarRespuestaJson(int $codigoEstado, bool $exito, string $mensaje, array $datos = []): void {
    http_response_code($codigoEstado);

    echo json_encode([
        "code" => $codigoEstado,
        "success" => $exito,
        "message" => $mensaje,
        "data" => $datos
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

/**
 * Convierte un único objeto Equipamiento en un array con sus datos.
 * No consulta la base de datos.
 *
 * @param Equipamiento $equipamiento Objeto que queremos convertir.
 * @return array Datos del equipamiento preparados para la respuesta.
 *
 * @author Jonatan Tajada Rico
 */
function convertirEquipamientoAArray(Equipamiento $equipamiento): array
{
    return [
        "id_equipamiento" => $equipamiento->getIdEquipamiento(),
        "nombre" => $equipamiento->getNombre(),
        "descripcion" => $equipamiento->getDescripcion(),
        "marca" => $equipamiento->getMarca(),
        "modelo" => $equipamiento->getModelo(),
        "categoria" => $equipamiento->getCategoria()->value,
        "id_ubicacion_actual" => $equipamiento->getIdUbicacionActual()
    ];
}

/**
 * Comprueba que el ID recibido sea un número entero positivo.
 * Si no es válido, envía una respuesta de error y finaliza el script.
 *
 * @param mixed $idRecibido Identificador recibido en la petición, sin validar.
 * @return int Identificador validado como entero positivo.
 *
 * @author Jonatan Tajada Rico
 */
function validarIdPositivo(mixed $idRecibido): int
{
    if (!is_string($idRecibido) && !is_int($idRecibido)) {
        enviarRespuestaJson(
            400,
            false,
            "El identificador debe ser un número entero positivo."
        );
    }

    $idValidado = filter_var(
        $idRecibido,
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1]]
    );

    if ($idValidado === false) {
        enviarRespuestaJson(
            400,
            false,
            "El identificador debe ser un número entero positivo."
        );
    }

    return $idValidado;
}


/**
 * Lee el cuerpo de la petición y convierte su objeto JSON
 * en un array asociativo PHP.
 *
 * @return array Datos recibidos en la petición.
 *
 * @author Jonatan Tajada Rico
 */
function leerJsonDePeticion(): array
{
    $contenidoJson = file_get_contents("php://input");

    if ($contenidoJson === false) {
        enviarRespuestaJson(
            500,
            false,
            "No se ha podido leer la petición."
        );
    }

    try {
        $objetoRecibido = json_decode(
            $contenidoJson,
            false,
            512,
            JSON_THROW_ON_ERROR
        );
    } catch (JsonException $error) {
        enviarRespuestaJson(
            400,
            false,
            "El cuerpo de la petición debe contener un JSON válido."
        );
    }

    if (!($objetoRecibido instanceof stdClass)) {
        enviarRespuestaJson(
            400,
            false,
            "El JSON debe contener un objeto con los campos del equipamiento."
        );
    }

    return (array) $objetoRecibido;
}

/**
 * Comprueba que la petición incluya los campos obligatorios
 * del equipamiento y que sus valores sean textos.
 *
 * @param array $datosRecibidos Datos obtenidos del JSON de la petición.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function validarCamposEquipamiento(array $datosRecibidos): void
{
    $camposObligatorios = [
        "nombre",
        "descripcion",
        "marca",
        "modelo",
        "categoria"
    ];

    foreach ($camposObligatorios as $campo) {
        if (!array_key_exists($campo, $datosRecibidos)) {
            enviarRespuestaJson(
                400,
                false,
                "Falta el campo obligatorio: " . $campo . "."
            );
        }

        if (!is_string($datosRecibidos[$campo])) {
            enviarRespuestaJson(
                400,
                false,
                "El campo " . $campo . " debe ser un texto."
            );
        }
    }
}

/**
 * Comprueba que la categoría recibida exista en el enum Categoria.
 *
 * @param string $categoriaRecibida Texto de la categoría recibida.
 * @return Categoria Categoría validada y convertida al enum.
 *
 * @author Jonatan Tajada Rico
 */
function validarCategoria(string $categoriaRecibida): Categoria
{
    $categoriaValidada = Categoria::tryFrom($categoriaRecibida);

    if ($categoriaValidada === null) {
        enviarRespuestaJson(
            400,
            false,
            "Categoría no válida. Valores permitidos: PORTATIL, "
            . "SOBREMESA, PERIFERICO, AUDIOVISUAL y OTROS."
        );
    }

    return $categoriaValidada;
}

/**
 * Obtiene el rol del usuario que tiene la sesión iniciada. (quien esta conectado)
 *
 * @return string Rol del usuario autenticado: ADMIN o USER.
 *
 * @author Jonatan Tajada Rico
 */
function obtenerRolUsuarioAutenticado(): string
{
    // Recuperamos la sesión si todavía no está iniciada.
    if (session_status() === PHP_SESSION_NONE) {
        if (!session_start()) {
            enviarRespuestaJson(
                500,
                false,
                "No se ha podido iniciar la sesión."
            );
        }
    }

    // Comprobamos que exista un usuario guardado en la sesión.
    if (!isset($_SESSION["usuario"])) {
        enviarRespuestaJson(
            401,
            false,
            "Debes iniciar sesión."
        );
    }

    $usuarioSesion = $_SESSION["usuario"];

    if (!is_array($usuarioSesion)) {
        enviarRespuestaJson(
            401,
            false,
            "La sesión no es válida. Inicia sesión de nuevo."
        );
    }

    $rolUsuario = $usuarioSesion["rol"] ?? null;

    // Solo aceptamos los roles definidos por el proyecto.
    if ($rolUsuario !== "ADMIN" && $rolUsuario !== "USER") {
        enviarRespuestaJson(
            403,
            false,
            "El usuario no tiene un rol permitido."
        );
    }

    return $rolUsuario;
}

/**
 * Comprueba si el usuario tiene un rol autorizado para la operación.
 * Si no está autorizado, envía un error 403 y finaliza el script.
 *
 * @param string $rolUsuario Rol del usuario obtenido de la sesión.
 * @param array $rolesPermitidos Roles que pueden realizar la operación.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function comprobarPermisoRol(string $rolUsuario, array $rolesPermitidos): void {

    if (!in_array($rolUsuario, $rolesPermitidos, true)) {
        enviarRespuestaJson(
            403,
            false,
            "No tienes permiso para realizar esta operación."
        );
    }
}

// ============================================================
// OPERACIONES DE EQUIPAMIENTO
// ============================================================

/**
 * Consulta y envía el inventario completo en formato JSON.
 * Pueden realizar esta operación los roles ADMIN y USER.
 *
 * @param Controller $controller Controlador que permite consultar los equipos.
 * @param string $rolUsuario Rol del usuario obtenido de la sesión.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function listarTodosEquipamientos(Controller $controller, string $rolUsuario): void{

    comprobarPermisoRol($rolUsuario, ["ADMIN", "USER"]);

    $equipamientos = $controller->listarTodosEquipamientos();
    $datosEquipamientos = [];

    foreach($equipamientos as $equipamiento){
    $datosEquipamientos[] = convertirEquipamientoAArray($equipamiento);
    }

    enviarRespuestaJson(200, true, "Inventario cosultado correctamente.", $datosEquipamientos);
}

/**
 * Busca un equipamiento por su ID y envía sus datos en formato JSON.
 * Pueden realizar esta operación los roles ADMIN y USER.
 *
 * @param Controller $controller Controlador que permite consultar el equipo.
 * @param string $rolUsuario Rol del usuario obtenido de la sesión.
 * @param mixed $idRecibido Identificador recibido en la petición, sin validar.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function buscarEquipamientoPorId(Controller $controller, string $rolUsuario, mixed $idRecibido): void {

    comprobarPermisoRol($rolUsuario, ["ADMIN", "USER"]);

    $idEquipamiento = validarIdPositivo($idRecibido);

    $equipamiento = $controller->buscarEquipamientoPorId($idEquipamiento);

    if ($equipamiento === null) {
        enviarRespuestaJson(
            404,
            false,
            "Equipamiento no encontrado."
        );
    }

    $datosEquipamiento = convertirEquipamientoAArray($equipamiento);

    enviarRespuestaJson(
        200,
        true,
        "Equipamiento consultado correctamente.",
        [$datosEquipamiento]
    );
}


/**
 * Consulta y envía los equipamientos de una categoría en formato JSON.
 * Pueden realizar esta operación los roles ADMIN y USER.
 *
 * @param Controller $controller Controlador que permite consultar los equipos.
 * @param string $rolUsuario Rol del usuario obtenido de la sesión.
 * @param mixed $categoriaRecibida Categoría recibida en la petición, sin validar.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function filtrarEquipamientosPorCategoria(Controller $controller, string $rolUsuario, mixed $categoriaRecibida): void {
    comprobarPermisoRol($rolUsuario, ["ADMIN", "USER"]);

    if (!is_string($categoriaRecibida)) {
        enviarRespuestaJson(
            400,
            false,
            "La categoría debe ser un texto."
        );
    }

    $categoriaValidada = validarCategoria($categoriaRecibida);

    $equipamientos = $controller->filtrarEquipamientosPorCategoria($categoriaValidada);

    $datosEquipamientos = [];

    foreach ($equipamientos as $equipamiento) {
        $datosEquipamientos[] = convertirEquipamientoAArray($equipamiento);
    }

    enviarRespuestaJson(
        200,
        true,
        "Equipamientos de la categoría consultados correctamente.",
        $datosEquipamientos
    );
}

/**
 * Crea un equipamiento con los datos recibidos en el cuerpo JSON.
 * Solo puede realizar esta operación el rol ADMIN.
 *
 * @param Controller $controller Controlador que permite crear el equipo.
 * @param string $rolUsuario Rol del usuario obtenido de la sesión.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function crearEquipamiento(Controller $controller, string $rolUsuario): void {

    comprobarPermisoRol($rolUsuario, ["ADMIN"]);

    $datosRecibidos = leerJsonDePeticion();

    validarCamposEquipamiento($datosRecibidos);

    $categoriaValidada = validarCategoria($datosRecibidos["categoria"]);

    $equipamiento = new Equipamiento(
        null,
        $datosRecibidos["nombre"],
        $datosRecibidos["descripcion"],
        $datosRecibidos["marca"],
        $datosRecibidos["modelo"],
        $categoriaValidada,
        null
    );

    $equipamientoCreado = $controller->crearEquipamiento($equipamiento);

    if (!$equipamientoCreado) {
        enviarRespuestaJson(
            500,
            false,
            "No se ha podido crear el equipamiento."
        );
    }

    enviarRespuestaJson(
        201,
        true,
        "Equipamiento creado correctamente."
    );
}

/**
 * Actualiza los datos generales de un equipamiento existente.
 * Solo puede realizar esta operación el rol ADMIN.
 *
 * @param Controller $controller Controlador que permite editar el equipo.
 * @param string $rolUsuario Rol del usuario obtenido de la sesión.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function editarEquipamiento(Controller $controller,string $rolUsuario): void {

    comprobarPermisoRol($rolUsuario, ["ADMIN"]);

    $datosRecibidos = leerJsonDePeticion();

    $idEquipamiento = validarIdPositivo($datosRecibidos["id_equipamiento"] ?? null);

    validarCamposEquipamiento($datosRecibidos);

    $categoriaValidada = validarCategoria($datosRecibidos["categoria"]);

    $equipamiento = $controller->buscarEquipamientoPorId($idEquipamiento);

    if ($equipamiento === null) {
        enviarRespuestaJson(
            404,
            false,
            "Equipamiento no encontrado."
        );
    }

    // Los setters comprueban las reglas de validación del modelo.
    $equipamiento->setNombre($datosRecibidos["nombre"]);
    $equipamiento->setDescripcion($datosRecibidos["descripcion"]);
    $equipamiento->setMarca($datosRecibidos["marca"]);
    $equipamiento->setModelo($datosRecibidos["modelo"]);
    $equipamiento->setCategoria($categoriaValidada);

    $equipamientoEditado = $controller->editarEquipamiento($equipamiento);

    if (!$equipamientoEditado) {
        enviarRespuestaJson(
            500,
            false,
            "No se ha podido editar el equipamiento."
        );
    }

    enviarRespuestaJson(
        200,
        true,
        "Equipamiento actualizado correctamente.",
        [convertirEquipamientoAArray($equipamiento)]
    );
}

/**
 * Elimina un equipamiento por su ID.
 * Solo puede realizar esta operación el rol ADMIN.
 *
 * @param Controller $controller Controlador que permite eliminar el equipo.
 * @param string $rolUsuario Rol del usuario obtenido de la sesión.
 * @param mixed $idRecibido Identificador recibido en la petición, sin validar.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function eliminarEquipamiento(Controller $controller, string $rolUsuario, mixed $idRecibido): void {

    comprobarPermisoRol($rolUsuario, ["ADMIN"]);

    $idEquipamiento = validarIdPositivo($idRecibido);

    $equipamientoEliminado = $controller->eliminarEquipamiento(
        $idEquipamiento
    );

    if (!$equipamientoEliminado) {
        enviarRespuestaJson(
            404,
            false,
            "Equipamiento no encontrado."
        );
    }

    enviarRespuestaJson(
        200,
        true,
        "Equipamiento eliminado correctamente."
    );
}

/**
 * Cambia la ubicación de un equipamiento.
 * Solo puede realizar esta operación el rol USER.
 * El DAO actualiza la ubicación y el histórico mediante una transacción.
 *
 * @param Controller $controller Controlador que permite realizar el traslado.
 * @param string $rolUsuario Rol del usuario obtenido de la sesión.
 * @return void
 *
 * @author Jonatan Tajada Rico
 */
function cambiarUbicacionEquipamiento(Controller $controller, string $rolUsuario): void {

    comprobarPermisoRol($rolUsuario, ["USER"]);

    $datosRecibidos = leerJsonDePeticion();

    // Validamos los dos identificadores recibidos.
    $idEquipamiento = validarIdPositivo($datosRecibidos["id_equipamiento"] ?? null);

    $idNuevaUbicacion = validarIdPositivo($datosRecibidos["id_nueva_ubicacion"] ?? null);

    // Comprobamos que exista el equipo que queremos trasladar.
    $equipamiento = $controller->buscarEquipamientoPorId($idEquipamiento);

    if ($equipamiento === null) {
        enviarRespuestaJson(
            404,
            false,
            "Equipamiento no encontrado."
        );
    }

    // Comprobamos que exista la ubicación de destino.
    $ubicacionDestino = $controller->buscarUbicacionPorId($idNuevaUbicacion);

    if ($ubicacionDestino === null) {
        enviarRespuestaJson(
            404,
            false,
            "La ubicación de destino no existe."
        );
    }

    // El DAO realiza el traslado y actualiza el histórico.
    // Si alguna operación falla, deshace los cambios de la transacción.
    $trasladoRealizado = $controller->cambiarUbicacionEquipamiento($idEquipamiento,$idNuevaUbicacion);

    if (!$trasladoRealizado) {
        enviarRespuestaJson(
            200,
            true,
            "El equipamiento ya se encuentra en esa ubicación. No se han realizado cambios."
        );
    }

    enviarRespuestaJson(
        200,
        true,
        "Equipamiento trasladado correctamente."
    );
}

// ============================================================
// GESTIÓN DE LA PETICIÓN HTTP Y DE LOS ERRORES
// ============================================================

try {
    // Obtenemos el método HTTP utilizado por el cliente.
    $metodoHttp = $_SERVER["REQUEST_METHOD"] ?? "";

    $metodosPermitidos = ["GET", "POST", "PUT", "PATCH", "DELETE"];

    if (!in_array($metodoHttp, $metodosPermitidos, true)) {
        header("Allow: GET, POST, PUT, PATCH, DELETE");

        enviarRespuestaJson(
            405,
            false,
            "Método HTTP no permitido."
        );
    }

    // Comprobamos la sesión antes de acceder a las operaciones.
    $rolUsuario = obtenerRolUsuarioAutenticado();

    $controller = new Controller();

    switch ($metodoHttp) {
        case "GET":
            // Los parámetros de consulta llegan en la URL.
            $tieneId = isset($_GET["id_equipamiento"]);
            $tieneCategoria = isset($_GET["categoria"]);

            if ($tieneId && $tieneCategoria) {
                enviarRespuestaJson(
                    400,
                    false,
                    "Indica un ID o una categoría, pero no ambos."
                );
            }

            if ($tieneId) {
                buscarEquipamientoPorId(
                    $controller,
                    $rolUsuario,
                    $_GET["id_equipamiento"]
                );
            } elseif ($tieneCategoria) {
                filtrarEquipamientosPorCategoria(
                    $controller,
                    $rolUsuario,
                    $_GET["categoria"]
                );
            } else {
                listarTodosEquipamientos($controller, $rolUsuario);
            }

            break;

        case "POST":
            // La función lee del cuerpo JSON los datos del nuevo equipo.
            crearEquipamiento($controller, $rolUsuario);
            break;

        case "PUT":
            // Actualizamos los campos generales del equipo.
            editarEquipamiento($controller, $rolUsuario);
            break;

        case "PATCH":
            // Modificamos únicamente su ubicación.
            cambiarUbicacionEquipamiento($controller, $rolUsuario);
            break;

        case "DELETE":
            // El identificador del equipo llega en la URL.
            eliminarEquipamiento(
                $controller,
                $rolUsuario,
                $_GET["id_equipamiento"] ?? null
            );
            break;
    }

} catch (InvalidArgumentException $error) {
    // Mostramos los errores de validación del modelo.
    enviarRespuestaJson(
        400,
        false,
        $error->getMessage()
    );

} catch (mysqli_sql_exception $error) {
    // Registramos el detalle técnico sin enviarlo al cliente.
    error_log($error->getMessage());

    enviarRespuestaJson(
        500,
        false,
        "No se ha podido completar la operación en la base de datos."
    );

} catch (Throwable $error) {
    // Recogemos otros errores inesperados.
    error_log($error->getMessage());

    enviarRespuestaJson(
        500,
        false,
        "Se ha producido un error interno."
    );
}