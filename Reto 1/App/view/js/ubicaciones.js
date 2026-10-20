/* ---------------------------------------------- [Constantes]*/
const btn_planta1 = document.getElementById("btn_planta1");
const btn_planta2 = document.getElementById("btn_planta2");
const img_planta1 = document.getElementById("img_planta1");
const img_planta2 = document.getElementById("img_planta2");

const modalAula = document.getElementById("modalAula");
const btnCerrarAula = document.getElementsByClassName("cerrar")[3]; // 0, 1 y 2 son del global.js
let nombreAula = document.getElementById("nombreAula");
let descripcionAula = document.getElementById("descripcionAula");

/* ---------------------------------------------- [Mostrar Planta 1]*/
btn_planta1.addEventListener('click', function () {
    img_planta1.classList.remove('oculto');
    img_planta2.classList.remove('visible');

    img_planta1.classList.add('visible');
    img_planta2.classList.add('oculto');
});

/* ---------------------------------------------- [Mostrar Planta 2]*/
btn_planta2.addEventListener('click', function () {
    img_planta1.classList.remove('visible');
    img_planta2.classList.remove('oculto');

    img_planta1.classList.add('oculto');
    img_planta2.classList.add('visible');
});

/* ---------------------------------------------- [MODAL: Aula]*/
// Abrir modal
function abrirModalAula(aulaNum) {
    nombreAula.textContent = "Aula " + aulaNum +".";
    descripcionAula.textContent = "Habitación " + aulaNum +".";

    modalAula.style.display = "block";
}

// Cerrar modal
btnCerrarAula.addEventListener('click', function () {
    modalAula.style.display = "none";
});
