/* ---------------------------------------------- [Constantes]*/
const btnAjustes = document.getElementById("boton-ajustes");
const modalAjustes = document.getElementById("modalAjustes");
const btnCerrarAjustes = document.getElementsByClassName("cerrar")[0];
const btnTemaDefault = document.getElementById("btnTemaDefault");
const temaClaro = "claro";
const temaOscuro = "oscuro";

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
aplicarTema();

function aplicarTema() {
  let temaActual = localStorage.getItem("tema");

  if (temaActual == "oscuro") {
    localStorage.setItem("tema", temaOscuro);
    document.documentElement.classList.add(temaOscuro);
  } else {
    localStorage.setItem("tema", temaClaro);
    document.documentElement.classList.add(temaClaro);
  }
}

btnTemaDefault.addEventListener("click", function () {
  document.documentElement.classList.toggle(temaOscuro);

  const isDark = document.documentElement.classList.contains(temaOscuro);

  if (isDark) {
    localStorage.setItem("tema", temaOscuro);
    document.documentElement.classList.add(temaOscuro);
  } else {
    localStorage.setItem("tema", temaClaro);
    document.documentElement.classList.add(temaClaro);
  }
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