/**
 * Gestión de Categorías
 *
 * Valida la sesión antes de permitir navegar al inventario por categoría.
 * ADMIN y USER disponen de los mismos seis enlaces.
 *
 * ÍNDICE (orden real del archivo)
 * 01. REFERENCIAS Y ESTADO
 *     Referencias al DOM y estado de la validación.
 * 02. DISPONIBILIDAD Y MENSAJES
 *     actualizarDisponibilidad, mostrarEstado.
 * 03. COMPROBACIÓN DE SESIÓN
 *     comprobarSesionCategorias.
 * 04. INICIALIZACIÓN Y NAVEGACIÓN DEL NAVEGADOR
 *     Bloqueo de interacción y eventos pagehide y pageshow.
 */
// El módulo no publica nombres globales que puedan colisionar con otros scripts.
(() => {
    // ============================================================
    // 01. REFERENCIAS Y ESTADO
    // ============================================================
    const categorias = document.getElementById("categorias");
    const mensaje = document.getElementById("estado-sesion-categorias");
    const enlaces = [...categorias.querySelectorAll("a.categoria")];
    let sesionConfirmada = false;
    // Cada validación o salida incrementa el contador para descartar respuestas anteriores.
    let consultaActual = 0;

    // ============================================================
    // 02. DISPONIBILIDAD Y MENSAJES
    // ============================================================
    /**
     * Habilita los enlaces solo tras confirmar el rol con el servidor.
     * El atributo inert impide interactuar con las tarjetas bloqueadas.
     */
    function actualizarDisponibilidad(disponible) {
        sesionConfirmada = disponible;
        categorias.inert = !disponible;
        for (const enlace of enlaces) {
            if (disponible) {
                enlace.removeAttribute("aria-disabled");
                enlace.removeAttribute("tabindex");
            } else {
                enlace.setAttribute("aria-disabled", "true");
                enlace.setAttribute("tabindex", "-1");
            }
        }
    }

    /**
     * Comunica la comprobación o su error sin mostrar detalles internos.
     * Ajusta el anuncio accesible según sea un estado normal o un error.
     */
    function mostrarEstado(texto, error = false) {
        mensaje.setAttribute("role", error ? "alert" : "status");
        mensaje.setAttribute("aria-live", error ? "assertive" : "polite");
        mensaje.textContent = texto;
    }

    // ============================================================
    // 03. COMPROBACIÓN DE SESIÓN
    // ============================================================
    /**
     * Confirma la sesión PHP mediante GET y habilita ADMIN o USER.
     * Una consulta antigua nunca puede desbloquear una página restaurada.
     */
    async function comprobarSesionCategorias() {
        const consulta = ++consultaActual;
        actualizarDisponibilidad(false);
        categorias.setAttribute("aria-busy", "true");
        mostrarEstado("Comprobando la sesión…");
        try {
            // auth.js ya aplica esta redirección cuando no existe usuario local.
            if (!haySesion()) {
                irALogin();
                return;
            }

            // exigirSesion() se ejecuta automáticamente en auth.js, pero no devuelve
            // un resultado verificable. Este GET confirma únicamente nuestras tarjetas;
            // no volvemos a llamar a exigirSesion() ni modificamos sus eventos.
            const respuesta = await fetch(AUTH_URL, {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store",
                headers: { Accept: "application/json" }
            });
            if (consulta !== consultaActual) return;
            if (respuesta.status === 401 || respuesta.status === 403) {
                irALogin();
                return;
            }
            if (!respuesta.ok) throw new Error("Consulta no disponible");

            const resultado = await respuesta.json();
            if (consulta !== consultaActual) return;
            if (resultado?.success !== true || !Array.isArray(resultado.data) ||
                resultado.data.length !== 1 || !resultado.data[0] ||
                typeof resultado.data[0].rol !== "string") {
                throw new Error("Respuesta no válida");
            }
            const usuario = resultado.data[0];
            if (!["ADMIN", "USER"].includes(usuario.rol)) {
                irALogin();
                return;
            }
            // Una salida de sesión durante el GET debe mantener bloqueada la pantalla.
            if (!haySesion()) {
                irALogin();
                return;
            }
            guardarUsuario(usuario);
            actualizarDisponibilidad(true);
            mostrarEstado("Selecciona una categoría o consulta todos los equipamientos.");
        } catch (error) {
            if (consulta !== consultaActual) return;
            actualizarDisponibilidad(false);
            mostrarEstado("No se ha podido comprobar la sesión. Comprueba la conexión y recarga la página para intentarlo de nuevo.", true);
        } finally {
            if (consulta === consultaActual) categorias.setAttribute("aria-busy", "false");
        }
    }

    // ============================================================
    // 04. INICIALIZACIÓN Y NAVEGACIÓN DEL NAVEGADOR
    // ============================================================
    // Refuerzo para navegadores sin soporte de inert; los destinos no se alteran.
    for (const tipo of ["click", "auxclick", "keydown"]) {
        categorias.addEventListener(tipo, evento => {
            if (!sesionConfirmada) evento.preventDefault();
        }, true);
    }

    // Se guarda la página bloqueada en la caché de navegación e invalidamos su GET.
    window.addEventListener("pagehide", () => {
        ++consultaActual;
        actualizarDisponibilidad(false);
        categorias.setAttribute("aria-busy", "true");
        mostrarEstado("Comprobando la sesión…");
    });

    // Único inicio de validación de este módulo: carga inicial, recarga y regreso por historial.
    // auth.js mantiene su comprobación independiente; solo nuestro GET confirmado habilita tarjetas.
    window.addEventListener("pageshow", comprobarSesionCategorias);
})();
