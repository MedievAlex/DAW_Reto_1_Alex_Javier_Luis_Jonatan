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