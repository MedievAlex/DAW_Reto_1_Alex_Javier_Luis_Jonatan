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

            if (result.success) {
                return result.data;
            } else {
                return [{ "message": result.message }];
            }
        } else {
            const response = await fetch(url, { // Peticion al PHP
                method: method, // Metodo de peticion
                headers: { "Content-type": "aplication/json" },
                body: JSON.stringify(data) // Contenido
            });
            const result = await response.json();

            if (result.success) {
                return result.message;
            } else {
                return [{ "message": result.message }];
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
        alert("Error:", error.message);
        return [];
    }
}

// Pide una Ubicacion mediante el ID
function buscarUbicacionPorId() {
    let url = UBI_URL + "?ubi_id=" + 2;
    let method = "GET";
    let data = [];
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre);
    });
}

// Pide una Ubicacion mediante el NOMBRE
function buscarUbicacionPorNombre() {
    let url = UBI_URL + "?ubi_nombre=" + "Baño";
    let method = "GET";
    let data = [];
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre);
    });
}

// Pide el listado de todas las Ubicaciones
async function cargarUbicaciones() {
    let url = UBI_URL;
    let method = "GET";
    let data = [];
    let ubicaciones;

    ubicaciones = petition(url, method, data);

    ubicaciones.then((value) => {
        value.forEach(ubi => {
            console.log(ubi);
            alert(ubi.ubi_nombre);
        });
    });
}

// Crea la Ubicacion enviada
async function crearUbicacion() {
    let url = UBI_URL;
    let method = "POST";
    let data = {
        ubi_id: 15,
        ubi_nombre: "Baño",
        ubi_descripcion: "Baño viejo a reformar."
    };
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0].message);
        alert(value[0].message);
    });
}

btn_planta1.addEventListener('click', eliminarUbicacion());

async function editarUbicacion() {
    let url = UBI_URL;
    let method = "PUT";
    let data = [];
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0].message);
        alert(value[0].message);
    });
}

async function eliminarUbicacion() {
    let url = UBI_URL + "?ubi_id=" + 18;
    let method = "DELETE";
    let data = [];
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0].message);
        alert(value[0].message);
    });
}