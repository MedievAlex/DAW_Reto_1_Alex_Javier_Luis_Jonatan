const AUTH_APP = new URL("../../", document.currentScript.src);
const API_BASE = new URL("api/", AUTH_APP).href;
const AUTH_URL = API_BASE + "LoginController.php";
const LOGOUT_URL = API_BASE + "LogoutController.php";
const AUTH_USUARIO = "auth_usuario";
const INICIO_URL = new URL("view/html/Inicio.html", AUTH_APP).href;
const LOGIN_URL = new URL("../Public/index.html", AUTH_APP).href;
const AUTH_CARPETA_PROTEGIDA = "/view/html/";

// ---------------------------------------- Mensajes de error

// Muestra el error en el formulario (usa la clase .err de global.css).
function mostrarErrorLogin(mensaje) {
    const error = document.getElementById("login-error");

    if (error === null) {
        alert(mensaje);
        return;
    }

    error.textContent = mensaje; // textContent: nunca se interpreta como HTML
    error.classList.add("err");
    error.setAttribute("role", "alert");
    error.classList.remove("oculto");
}

function ocultarErrorLogin() {
    const error = document.getElementById("login-error");

    if (error !== null) {
        error.textContent = "";
        error.classList.add("oculto");
    }
}

// Elige el mensaje según el código HTTP; el del servidor solo se usa en errores del cliente (4xx).
function mensajeErrorLogin(status, result) {
    if (status >= 500) {
        return "Error del servidor. Inténtalo de nuevo más tarde.";
    }

    return (result && result.message) || "Error al iniciar sesión.";
}

// ---------------------------------------- Usuario en sessionStorage

// Extrae el usuario de la respuesta del servidor ({ data: [ {...} ] }).
// Acepta también el formato antiguo { data: [ { usuario: {...} } ] }.
function extraerUsuario(result) {
    const datos = result ? result.data : null;
    const bruto = Array.isArray(datos) ? datos[0] : datos;
    const usuario = bruto && bruto.usuario ? bruto.usuario : bruto;

    if (!usuario || typeof usuario !== "object" || !usuario.rol) {
        return null;
    }

    return usuario;
}

// Guarda el usuario (sin contraseña) para pintar la interfaz; los permisos reales los valida el servidor.
function guardarUsuario(usuario) {
    sessionStorage.setItem(AUTH_USUARIO, JSON.stringify(usuario));
}

// ---------------------------------------- Login

// Inicia sesion y guarda el usuario; la contrasena no se guarda en el cliente.
async function iniciarSesion(nombre_usuario, password) {
    try {
        const response = await fetch(AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_usuario, password })
        });

        let result = null;

        try {
            result = await response.json();
        } catch (error) {
            result = null; // la respuesta no era JSON (p. ej. error de PHP)
        }

        if (!response.ok) {
            mostrarErrorLogin(mensajeErrorLogin(response.status, result));
            return null;
        }

        const usuario = extraerUsuario(result);

        if (usuario === null) {
            mostrarErrorLogin("No se han recibido los datos del usuario.");
            return null;
        }

        guardarUsuario(usuario);
        return usuario;
    } catch (error) {
        console.error("Error de red en el login:", error);
        mostrarErrorLogin("No se ha podido conectar con el servidor. Inténtalo de nuevo.");
        return null;
    }
}

// Envia el formulario de login, inicia sesion y redirige al inicio.
async function enviarLogin(evento) {
    evento.preventDefault();

    const formulario = evento.target;
    const boton = formulario.querySelector("button");

    if (boton !== null && boton.disabled) {
        return; // ya hay un envío en curso
    }

    const nombre_usuario = formulario.elements["nombre_usuario"].value.trim();
    const password = formulario.elements["password"].value;

    ocultarErrorLogin();

    if (nombre_usuario === "" || password === "") {
        mostrarErrorLogin("Escribe el nombre de usuario y la contraseña.");
        return;
    }

    if (boton !== null) {
        boton.disabled = true; // evita dobles envíos
    }

    const usuario = await iniciarSesion(nombre_usuario, password);
    formulario.elements["password"].value = "";

    if (usuario !== null) {
        // Ambos roles entran por Inicio; la interfaz se adapta al rol guardado.
        window.location.href = INICIO_URL;
        return;
    }

    if (boton !== null) {
        boton.disabled = false;
    }
}

// ---------------------------------------- Logout

// Borra el usuario local y carga el controlador, que destruye la sesion PHP y redirige al login.
function salir() {
    sessionStorage.removeItem(AUTH_USUARIO);
    window.location.href = LOGOUT_URL;
}

// ---------------------------------------- Sesión

// Comprueba si hay sesion iniciada.
function haySesion() {
    return sessionStorage.getItem(AUTH_USUARIO) !== null;
}

// Devuelve el usuario de la sesion, o null si no hay sesion.
function obtenerUsuarioSesion() {
    try {
        return JSON.parse(sessionStorage.getItem(AUTH_USUARIO));
    } catch (error) {
        return null;
    }
}

// Limpia los datos locales y vuelve al login.
function irALogin() {
    sessionStorage.removeItem(AUTH_USUARIO);
    window.location.replace(LOGIN_URL);
}

// Comprueba si hay sesion y, si no la hay, redirige al login.
// Además pregunta al servidor: la sesión PHP puede haber caducado aunque sessionStorage siga lleno.
async function exigirSesion() {
    if (!haySesion()) {
        irALogin();
        return;
    }

    try {
        const response = await fetch(AUTH_URL, {
            method: "GET",
            cache: "no-store"
        });

        if (response.status === 401) {
            irALogin();
            return;
        }

        if (response.ok) {
            // Se guarda lo que dice el servidor, por si el dato local estaba desactualizado
            const usuario = extraerUsuario(await response.json());

            if (usuario !== null) {
                guardarUsuario(usuario);
            }
        }
    } catch (error) {
        // Sin conexión: se mantiene la sesión local; las peticiones mostrarán su propio error
        console.error("No se pudo comprobar la sesión:", error);
    }
}

const ES_PAGINA_PROTEGIDA = window.location.pathname.includes(AUTH_CARPETA_PROTEGIDA);

if (ES_PAGINA_PROTEGIDA) {
    exigirSesion();

    // Al volver con el botón "atrás" tras cerrar sesión, el navegador puede mostrar la página en caché
    window.addEventListener("pageshow", function (evento) {
        if (evento.persisted) {
            exigirSesion();
        }
    });
}

document.getElementById("form-login")?.addEventListener("submit", enviarLogin);
