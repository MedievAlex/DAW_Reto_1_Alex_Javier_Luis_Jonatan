/* ---------------------------------------------- [Constantes]*/
const UBI_URL = "../../api/UbicacionController.php";

const tbody_ubicaciones = document.querySelector("#ubicaciones tbody");

const modalAula = document.getElementById("modalAula");
const btnCerrarAula = document.getElementsByClassName("cerrar")[3]; // 0, 1 y 2 son del global.js
let nombreAula = document.getElementById("nombreAula");
let descripcionAula = document.getElementById("descripcionAula");

let equipamientos = document.getElementsByClassName("equipamientos");

/* ---------------------------------------------- [MODAL: Aula]*/
// Abrir modal
function abrirModalAula(aulaNum) {
    nombreAula.textContent = "Aula " + aulaNum + ".";
    descripcionAula.textContent = "Habitación " + aulaNum + ".";

    modalAula.style.display = "block";
}

// Cerrar modal
btnCerrarAula.addEventListener("click", function () {
    modalAula.style.display = "none";
});

/* ---------------------------------------- [FUNCIONES]*/
document.addEventListener("DOMContentLoaded", () => {
    cargarUbicaciones();
});

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
                return result.data;
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

// [ Pide el listado de todas las Ubicaciones ]
async function cargarUbicaciones() {
    let url = UBI_URL;
    let method = "GET";
    let data = [];
    let ubicaciones;

    let srcOpen = "../assets/icons/icon_drop_open.png";
    let srcClosed = "../assets/icons/icon_drop_closed.png";

    ubicaciones = petition(url, method, data);

    ubicaciones.then((value) => {
        value.forEach(ubi => {
            console.log(ubi);

            let tr_ubi = document.createElement("tr");// Nueva Ubicacion

            const ubi_nombre = document.createElement("td"); // Nombre
            ubi_nombre.textContent = ubi.ubi_nombre;

            const ubi_descripcion = document.createElement("td"); // Descripcion
            ubi_descripcion.textContent = ubi.ubi_descripcion;

            const ubi_btn = document.createElement("td"); // Botones mostrar y ocultar Equipamientos
            const btn_open = document.createElement("button");
            btn_open.alt = "Mostrar equipaciones de la ubicación " + ubi.ubi_nombre + ".";
            const img_open = document.createElement("img");
            img_open.src = srcClosed;
            btn_open.appendChild(img_open);
            btn_open.classList.add("boton-xs");

            const btn_close = document.createElement("button");
            btn_close.alt = "Ocultar equipaciones de la ubicación " + ubi.ubi_nombre + ".";
            const btn_img = document.createElement("img");
            btn_img.src = srcOpen;
            btn_close.appendChild(btn_img);
            btn_close.classList.add("boton-xs");
            btn_close.classList.add("oculto");

            // [ Muestra los Equipamientos de la ubicacion ]
            btn_open.addEventListener("click", () => {
                btn_open.classList.remove("visible");
                btn_open.classList.add("oculto");

                btn_close.classList.remove("oculto");
                btn_close.classList.add("visible");
            });

            // [ Oculta los Equipamientos de la ubicacion ]
            btn_close.addEventListener("click", () => {
                btn_close.classList.remove("visible");
                btn_close.classList.add("oculto");

                btn_open.classList.remove("oculto");
                btn_open.classList.add("visible");
            });

            ubi_btn.appendChild(btn_open);
            ubi_btn.appendChild(btn_close);

            tr_ubi.appendChild(ubi_nombre);
            tr_ubi.appendChild(ubi_descripcion);
            tr_ubi.appendChild(ubi_btn);

            tr_ubi.classList.add("aula");

            tbody_ubicaciones.appendChild(tr_ubi);
        });
    });
}

// [ Pide una Ubicacion mediante el ID ]
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

// [ Pide una Ubicacion mediante el NOMBRE ]
function buscarUbicacionPorNombre() {
    let url = UBI_URL + "?ubi_nombre=" + "Cafeteria";
    let method = "GET";
    let data = [];
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre);
    });
}

// [ Crea la Ubicacion enviada ]
async function crearUbicacion() {
    let url = UBI_URL;
    let method = "POST";
    let data = {
        ubi_id: 1,
        ubi_nombre: "Cafeteria",
        ubi_descripcion: "Cafeteria cup of café con leche in plaza mayor."
    };
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre + " creada correctamente.");
    });
}

// [ Editar la Ubicacion con los datos nuevos ]
async function editarUbicacion() {
    let url = UBI_URL;
    let method = "PUT";
    let data = {
        ubi_id: 24,
        ubi_nombre: "Cafeteria",
        ubi_descripcion: "There is nothing quite like a relaxing cup of café con leche in Plaza Mayor."
    };
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre + " editada correctamente.");
    });
}

// [ Elimina la Ubicacion ]
async function eliminarUbicacion() {
    let url = UBI_URL + "?ubi_id=" + 21;
    let method = "DELETE";
    let data = {};
    let ubicacion;

    ubicacion = petition(url, method, data);

    ubicacion.then((value) => {
        console.log(value[0].message);
        alert(value[0].message);
    });
}