/* ---------------------------------------------- [Constantes]*/
const UBI_URL = "../../api/UbicacionController.php";

const btn_planta1 = document.getElementById("btn_planta1");
const btn_planta2 = document.getElementById("btn_planta2");
const img_planta1 = document.getElementById("img_planta1");
const img_planta2 = document.getElementById("img_planta2");

const modalAula = document.getElementById("modalAula");
const btnCerrarAula = document.getElementsByClassName("cerrar")[3]; // 0, 1 y 2 son del global.js
let nombreAula = document.getElementById("nombreAula");
let descripcionAula = document.getElementById("descripcionAula");

let equipamientos = document.getElementsByClassName("equipamientos");

/* ---------------------------------------------- [Mostrar Planta 1]*/
btn_planta1.addEventListener('click', function () {
    img_planta1.classList.remove('oculto');
    img_planta2.classList.remove('visible');

    img_planta1.classList.add('visible');
    img_planta2.classList.add('oculto');
});

btn_planta1.addEventListener('click', buscarUbicacionPorId());

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
    nombreAula.textContent = "Aula " + aulaNum + ".";
    descripcionAula.textContent = "Habitación " + aulaNum + ".";

    modalAula.style.display = "block";
}

// Cerrar modal
btnCerrarAula.addEventListener('click', function () {
    modalAula.style.display = "none";
});

/* ---------------------------------------- [FUNCIONES]*/
async function petition(url, method, data) {
    try {
        if (method == "GET") {
            const response = await fetch(url, { // Peticion al PHP
                method: method, // Metodo de peticion
                headers: { "Content-type": "aplication/json" }
            });
            const result = await response.json();

            if (response.ok) {
                return result.data;
            } else {
                alert("Error al obtener las ubicaciones.");
                return [];
            }
        } else {
            const response = await fetch(url, { // Peticion al PHP
                method: method, // Metodo de peticion
                headers: { "Content-type": "aplication/json" },
                body: JSON.stringify(data) // Contenido
            });
            const result = await response.json();

            if (response.succes) {
                return result.data;
            } else {
                alert("Error al obtener las ubicaciones.");
                return [];
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
        alert("Error:", error.message);
        return [];
    }
}

function buscarUbicacionPorId() {
    let url = UBI_URL + "?ubi_id=" + 2;
    let method = "GET";
    let data = [];
    let ubicaciones;

    ubicaciones = petition(url, method, data);

    ubicaciones.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre);
    });
}

async function buscarUbicacionPorNombre() {
    let url = UBI_URL + "?ubi_nombre=" + "ubicacion.ubi_nombre}";
    let method = "GET";
    let data = [];
    let ubicaciones;

    ubicaciones = petition(url, method, data);
    
    ubicaciones.then((value) => {
        console.log(value[0]);
        alert(value[0].nombre);
    });
}

async function cargarUbicaciones() {
    let url = UBI_URL;
    let method = "GET";
    let data = [];
    let ubicaciones;

    ubicaciones = petition(url, method, data);
    console.log(ubicaciones);
}

async function crearUbicacion() {
    let url = UBI_URL;
    let method = "POST";
    let data = new Map([
        ["ubi_id", 9],
        ["ubi_nombre", 8],
        ["ubi_descripcion", 7]
    ]);
    let ubicaciones;

    ubicaciones = petition(url, method, data);
    console.log(ubicaciones.body);
}

async function editarUbicacion() {
    let url = UBI_URL;
    let method = "PUT";
    let data = [];
    let ubicaciones;

    ubicaciones = petition(url, method, data);
    console.log(ubicaciones);
}

async function eliminarUbicacion() {
    let url = UBI_URL + "?ubi_id=" + "${ubicacion.ubi_id}";
    let method = "DELETE";
    let data = [];
    let ubicaciones;

    ubicaciones = petition(url, method, data);
    console.log(ubicaciones);
}