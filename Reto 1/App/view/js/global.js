/* ---------------------------------------------- [Constantes]*/
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

/* ---------------------------------------------- [Rutas]*/
const srcAjustes = "../assets/icons/icon_editar.png";
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

/* ---------------------------------------------- [PETICION]*/
async function petition(url, method, data) {
  try {
    if (method == "GET") {
      const response = await fetch(url, { // Peticion al PHP
        method: method, // Metodo de peticion
        headers: { "Content-type": "aplication/json" }
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        return [{
          "success": result.success,
          "message": result.message
        }];
      }
    } else if (method == "DELETE") {
      const response = await fetch(url, { // Peticion al PHP
        method: method, // Metodo de peticion
        headers: { "Content-type": "aplication/json" },
        body: JSON.stringify(data) // Contenido
      });
      const result = await response.json();

      if (result.success) {
        return result.message;
      } else {
        return [{
          "success": result.success,
          "message": result.message
        }];
      }
    } else {
      const response = await fetch(url, { // Peticion al PHP
        method: method, // Metodo de peticion
        headers: { "Content-type": "aplication/json" },
        body: JSON.stringify(data) // Contenido
      });
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        return [{
          "success": result.success,
          "message": result.message
        }];
      }
    }
  } catch (error) {
    console.error("[ERROR]: ", error.message);
    return [{
      "success": false,
      "message": error.message
    }];
  }
}

/* ---------------------------------------------- [MODAL: Ajustes]*/
// Abrir modal
btnAjustes.addEventListener("click", function () {
  modalAjustes.style.display = "block";
});

// Cerrar modal
btnCerrarAjustes.addEventListener("click", function () {
  modalAjustes.style.display = "none";
});

/* ---------------------------------------------- [Cambiar tema]*/
document.addEventListener("DOMContentLoaded", () => {
  obtenerTema();
});

function obtenerTema() {
  let temaActual = localStorage.getItem("tema");

  if (temaActual == 3) {
    aplicarTema(tema3);
  } else if (temaActual == 2) {
    aplicarTema(tema2);
  } else {
    aplicarTema(tema1);
  }
}

function aplicarTema(tema) {
  localStorage.setItem("tema", tema);
  document.body.setAttribute("data-theme", tema);
}

btnTemaDefault.addEventListener("click", function () {
  aplicarTema(1);
});

btnTemaAlt.addEventListener("click", function () {
  aplicarTema(2);
});

btnTemaGlobal.addEventListener("click", function () {
  aplicarTema(3);
});

/* ---------------------------------------------- [MODAL: Notificaciones]*/
// Abrir modal
btnNotificaciones.addEventListener("click", function () {
  modalNotificaciones.style.display = "block";
});

// Cerrar modal
btnCerrarNotificaciones.addEventListener("click", function () {
  modalNotificaciones.style.display = "none";
});

/* ---------------------------------------------- [MODAL: Perfil]*/
// Abrir modal
btnPerfil.addEventListener("click", function () {
  modalPerfil.style.display = "block";
});

// Cerrar modal
btnCerrarPerfil.addEventListener("click", function () {
  modalPerfil.style.display = "none";
});