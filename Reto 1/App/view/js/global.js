/* ---------------------------------------------- [ CONSTANTES ]*/
const btnAjustes = document.getElementById("boton-ajustes");
const modalAjustes = document.getElementById("modalAjustes");
const btnCerrarAjustes = document.getElementsByClassName("cerrar")[0];

const btnTemaDefault = document.getElementById("btnTemaDefault");
const btnTemaAlt = document.getElementById("btnTemaAlt");
const btnTemaGlobal = document.getElementById("btnTemaGlobal");

const tema1 = "1";
const tema2 = "2";
const tema3 = "3";

const btnNotificaciones = document.getElementById("boton-notificaciones");
const modalNotificaciones = document.getElementById("modalNotificaciones");
const btnCerrarNotificaciones = document.getElementsByClassName("cerrar")[1];

const btnPerfil = document.getElementById("boton-perfil");
const modalPerfil = document.getElementById("modalPerfil");
const btnCerrarPerfil = document.getElementsByClassName("cerrar")[2];

/* ---------------------------------------------- [ RUTAS ]*/
const srcAjustes = "../assets/icons/icon_ajustes.png";
const srcAbrir = "../assets/icons/icon_drop_abrir.png";
const srcCerrar = "../assets/icons/icon_drop_cerrar.png";
const srcEditar = "../assets/icons/icon_editar.png";
const srcEliminar = "../assets/icons/icon_eliminar.png";
const srcPendiente = "../assets/icons/icon_estado_pendiente.png";
const srcProceso = "../assets/icons/icon_estado_proceso.png";
const srcRealizado = "../assets/icons/icon_estado_realizado.png";
const srcGuardar = "../assets/icons/icon_guardar.png";
const srcHome = "../assets/icons/icon_home.png";
const srcNot = "../assets/icons/icon_notificacion.png";
const srcNotNueva = "../assets/icons/icon_notificacion_nueva.png";
const srcPerfil = "../assets/icons/icon_perfil.png";
const srcUsu = "../assets/icons/icon_usuario.png";
const srcUsuNuevo = "../assets/icons/icon_usuario_nuevo.png";
const srcVis = "../assets/icons/icon_visible.png";
const srOcu = "../assets/icons/icon_oculto.png";

/* ---------------------------------------------- [ PETICION ]*/
async function petition(url, method, data) {
  try {
    if (method == "GET") {
      const response = await fetch(url, { // Peticion al PHP
        method: method, // Metodo de peticion
        headers: { "Content-type": "aplication/json" }
      });

      const result = await response.json();
      return result;

    } else {
      const response = await fetch(url, { // Peticion al PHP
        method: method, // Metodo de peticion
        headers: { "Content-type": "aplication/json" },
        body: JSON.stringify(data) // Contenido
      });

      const result = await response.json();
      return result;

    }
  } catch (error) {
    console.error("[ERROR]: ", error.message);
    return [{
      "success": false,
      "message": error.message
    }];
  }
}

/* ---------------------------------------------- [ LISTENERS ]*/
document.addEventListener("DOMContentLoaded", () => {
  crearTitulos();
});

/* ---------------------------------------------- [ FUNCIONES ]*/
// Crea los titulos para mostrar una descripción cuando se pasa el ratón por encima
function crearTitulos() {
  btnAjustes.title = "Ajustes.";
  btnCerrarAjustes.title = "Cerar ajustes.";

  btnTemaDefault.title = "Cambiar al tema por defecto.";
  btnTemaAlt.title = "Cambiar al tema alternativo.";
  btnTemaGlobal.title = "Cambiar al tema global.";

  btnNotificaciones.title = "Notificaciones.";
  btnCerrarNotificaciones.title = "Cerrar notificaciones";

  btnPerfil.title = "Perfil.";
  btnCerrarPerfil.title = "Cerrar perfil.";
}

/* ---------------------------------------------- [ MODAL: Ajustes ]*/
// Abrir modal
btnAjustes.addEventListener("click", function () {
  modalAjustes.style.display = "block";
});

// Cerrar modal
btnCerrarAjustes.addEventListener("click", function () {
  modalAjustes.style.display = "none";
});

/* ---------------------------------------------- [ Cambiar tema ]*/
document.addEventListener("DOMContentLoaded", () => {
  obtenerTema();
});


function claveTema() {
  const sesion = typeof obtenerUsuarioSesion === "function" ? obtenerUsuarioSesion() : null;

  return sesion !== null ? "tema_" + sesion.usu_id : "tema";
}

// Obtiene los datos del tema guardado
function obtenerTema() {
  let temaActual = localStorage.getItem(claveTema());

  if (temaActual == tema3) {
    aplicarTema(tema3);
  } else if (temaActual == tema2) {
    aplicarTema(tema2);
  } else {
    aplicarTema(tema1);
  }
}

// Si existe modifica si no crea y guarda el tema actual
function aplicarTema(tema) {
  let btnsTema = [
    btnTemaDefault,
    btnTemaAlt,
    btnTemaGlobal
  ];
  let desabilitar = false;

  localStorage.setItem(claveTema(), tema);

  document.body.setAttribute("data-theme", tema);

  for (let i = 0; i < btnsTema.length; i++) {
    if (i == tema - 1) {
      desabilitar = true;
    } else {
      desabilitar = false;
    }

    btnsTema[i].disabled = desabilitar;
  }
}

btnTemaDefault.addEventListener("click", function () {
  aplicarTema(tema1);
});

btnTemaAlt.addEventListener("click", function () {
  aplicarTema(tema2);
});

btnTemaGlobal.addEventListener("click", function () {
  aplicarTema(tema3);
});

/* ---------------------------------------------- [ MODAL: Notificaciones]*/
// Abrir modal
btnNotificaciones.addEventListener("click", function () {
  modalNotificaciones.style.display = "block";
});

// Cerrar modal
btnCerrarNotificaciones.addEventListener("click", function () {
  modalNotificaciones.style.display = "none";
});

/* ---------------------------------------------- [ MODAL: Perfil]*/
// Abrir modal
btnPerfil.addEventListener("click", function () {
  modalPerfil.style.display = "block";
});

// Cerrar modal
btnCerrarPerfil.addEventListener("click", function () {
  modalPerfil.style.display = "none";
});