<?php
require_once ("../model/Usuario.php");

/**
 * Permisos centraliza la autorización de las operaciones de la API.
 *
 * Se llama al inicio de cada endpoint, antes de leer el cuerpo de la petición
 * y de acceder a los datos. Si la comprobación falla, envía el error JSON y
 * finaliza la petición
 *
 * Llamadas:
 *   Permisos::exigirOperacion("usuarios", "leer");
 *   Permisos::exigirOperacion("equipamientos", "crear");
 *   Permisos::exigirOperacion("ubicaciones", "leer");
 *   Permisos::exigirOperacion("notificaciones", "cambiar_estado");
 * 
 * Para eliminar una notificación, el endpoint debe cargarla primero y pasar el
 * estado obtenido de la base de datos (nunca el estado enviado por el cliente):
 *   Permisos::exigirOperacion("notificaciones", "eliminar", $notificacion->getEstado()->value);
 */
class Permisos
{
    public const ROL_ADMIN = Usuario::ROL_ADMIN;
    public const ROL_CONSERJE = "CONSERJE";
    private const ROL_CONSERJE_LEGACY = Usuario::ROL_USER;

    /**
     * Comprueba que haya una sesión iniciada y, opcionalmente, restringe el acceso por roles.
     * Se mantiene por compatibilidad con los endpoints que ya la usan.
     *
     * @param array $roles Roles que pueden continuar; vacío para permitir cualquier rol.
     * @param string $mensaje Mensaje del error 403 si el rol no está permitido.
     * @return void Envía un error 401 si no hay sesión o un 403 si el rol no está permitido.
     */
    public static function exigir(array $roles = [], string $mensaje = "No tienes permiso para hacer esto."): void
    {
        self::iniciarSesionSiHaceFalta();
        if (!isset($_SESSION["usuario"]) || !is_array($_SESSION["usuario"])) {
            self::denegar(401, "Debes iniciar sesión.");
        }
        if ($roles !== [] && !in_array($_SESSION["usuario"]["rol"] ?? "", $roles, true)) {
            self::denegar(403, $mensaje);
        }
    }

    /**
     * Exige que el rol del usuario esté autorizado para un recurso y una acción.
     *
     * @param string $recurso Recurso de la API: usuarios, equipamientos, ubicaciones, historico o notificaciones.
     * @return void Envía un error 401 si no hay sesión, o un 403 si el rol no puede hacer la operación
     *              o la operación no está definida.
     */
    public static function exigirOperacion(string $recurso, string $accion, ?string $estado = null): void
    {
        self::exigir();
        $rol = strtoupper((string) ($_SESSION["usuario"]["rol"] ?? ""));
        $esAdmin = $rol === self::ROL_ADMIN;
        $esConserje = in_array($rol, [self::ROL_CONSERJE, self::ROL_CONSERJE_LEGACY], true);
        $recurso = strtolower($recurso);
        $accion = strtolower($accion);

        // Para cada recurso y acción, indica qué roles pueden realizarla.
        $reglas = [
            "usuarios" => ["leer" => [$esAdmin], "crear" => [$esAdmin], "modificar" => [$esAdmin], "eliminar" => [$esAdmin]],
            "equipamientos" => ["leer" => [$esAdmin, $esConserje], "crear" => [$esAdmin], "modificar" => [$esAdmin], "eliminar" => [$esAdmin], "asignar_ubicacion" => [$esConserje]],
            "ubicaciones" => ["leer" => [$esAdmin, $esConserje], "crear" => [$esAdmin], "modificar" => [$esAdmin], "eliminar" => [$esAdmin]],
            "historico" => ["leer" => [$esAdmin, $esConserje], "crear" => [$esAdmin, $esConserje]],
            "notificaciones" => ["leer" => [$esAdmin, $esConserje], "crear" => [$esConserje], "modificar" => [$esConserje], "cambiar_estado" => [$esAdmin], "eliminar" => [$esConserje]],
        ];

        if (!isset($reglas[$recurso][$accion])) {
            self::denegar(403, "La operación solicitada no está definida.");
        }
        if (!in_array(true, $reglas[$recurso][$accion], true)) {
            self::denegar(403, "Tu rol no puede realizar esta operación.");
        }
        // Regla adicional: una notificación realizada no se puede eliminar.
        if ($recurso === "notificaciones" && $accion === "eliminar" && strtoupper((string) $estado) === "REALIZADA") {
            self::denegar(403, "No se pueden eliminar notificaciones realizadas.");
        }
    }

    /**
     * Devuelve los datos del usuario de la sesión, por ejemplo para asociar una
     * notificación a su creador:
     *   $idUsuario = Permisos::usuarioActual()["usu_id"];
     *
     * @return array Datos del usuario guardados en la sesión (usu_id, nombre, apellidos, nombre_usuario y rol).
     */
    public static function usuarioActual(): array
    {
        self::exigir();
        return $_SESSION["usuario"];
    }

    /**
     * Inicia la sesión de PHP si todavía no está iniciada.
     *
     * @return void
     */
    private static function iniciarSesionSiHaceFalta(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Envía el error JSON común de la API y finaliza la petición.
     *
     * @param int $code Código HTTP del error (401, 403...).
     * @param string $mensaje Mensaje que se muestra en la respuesta.
     * @return void
     */
    public static function denegar(int $code, string $mensaje): void
    {
        http_response_code($code);
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode(["code" => $code, "success" => false, "message" => $mensaje, "data" => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}
?>