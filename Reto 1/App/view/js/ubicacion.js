/* ---------------------------------------------- [Constantes]*/
const UBI_URL = "../../api/UbicacionController.php";
const EQU_URL = "../../api/EquipacionController.php";

const tbody_ubicaciones = document.querySelector("#ubicaciones table tbody");

const modalAula = document.getElementById("modalAula");
const btnCerrarAula = document.getElementsByClassName("cerrar")[3]; // 0, 1 y 2 son del global.js
let nombreAula = document.getElementById("nombreAula");
let descripcionAula = document.getElementById("descripcionAula");

let equipamientos = document.getElementById("equipamientos");

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

    ubicaciones = petition(url, method, data);

    ubicaciones.then((value) => {
        value.forEach(ubi => {
            console.log(ubi);

            let tr_ubi = document.createElement("tr");// Nueva Ubicacion

            const ubi_nombre = document.createElement("td"); // Nombre
            const h3_ubi_nombre = document.createElement("h3");
            h3_ubi_nombre.textContent = ubi.ubi_nombre;
            ubi_nombre.appendChild(h3_ubi_nombre);

            const ubi_descripcion = document.createElement("td"); // Descripcion
            ubi_descripcion.textContent = ubi.ubi_descripcion;

            const ubi_btn = document.createElement("td"); // Botones

            const btn_edit = document.createElement("button"); // Editar
            btn_edit.alt = "Editar ubicación " + ubi.ubi_nombre + ".";
            const img_edit = document.createElement("img");
            img_edit.src = srcEditar;
            btn_edit.appendChild(img_edit);
            btn_edit.classList.add("btn-xs");
            btn_edit.classList.add("btn-edit");

            const btn_del = document.createElement("button"); // Eliminar
            btn_del.alt = "Editar ubicación " + ubi.ubi_nombre + ".";
            const img_del = document.createElement("img");
            img_del.src = srcEliminar;
            btn_del.appendChild(img_del);
            btn_del.classList.add("btn-xs");
            btn_del.classList.add("btn-delete");

            const btn_open = document.createElement("button"); // Abrir
            btn_open.alt = "Mostrar equipaciones de la ubicación " + ubi.ubi_nombre + ".";
            const img_open = document.createElement("img");
            img_open.src = srcCerrar;
            btn_open.appendChild(img_open);
            btn_open.classList.add("btn-xs");

            const btn_close = document.createElement("button"); // Cerrar
            btn_close.alt = "Ocultar equipaciones de la ubicación " + ubi.ubi_nombre + ".";
            const btn_img = document.createElement("img");
            btn_img.src = srcAbrir;
            btn_close.appendChild(btn_img);
            btn_close.classList.add("btn-xs");
            btn_close.classList.add("oculto");

            // [ Muestra los Equipamientos de la ubicacion ]
            btn_open.addEventListener("click", () => {
                btn_open.classList.remove("visible");
                btn_open.classList.add("oculto");

                btn_close.classList.remove("oculto");
                btn_close.classList.add("visible");

                // cargarEquiposDeUbicacion();
            });

            // [ Oculta los Equipamientos de la ubicacion ]
            btn_close.addEventListener("click", () => {
                btn_close.classList.remove("visible");
                btn_close.classList.add("oculto");

                btn_open.classList.remove("oculto");
                btn_open.classList.add("visible");

                limpiarEquiposDeUbicacion();
            });

            ubi_btn.appendChild(btn_edit);
            ubi_btn.appendChild(btn_del);
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

// [ Pide el listado de los equipos de una Ubicacion ]
async function cargarEquiposDeUbicacion() {
    let url = EQU_URL;
    let method = "GET";
    let data = [];
    let equipamientos;

    let srcEdit = "../assets/icons/icon_editar.png";
    let srcSave = "../assets/icons/icon_guardar.png";
    let srcDel = "../assets/icons/icon_eliminar.png";

    limpiarEquiposDeUbicacion();

    equipamientos = petition(url, method, data);

    equipamientos.then((value) => {
        value.forEach(equ => {
            console.log(equ);

            let art_equ = document.createElement("article"); // Nuevo Equipamiento
            art_equ.classList.add("equ");

            let sec_equ_inf = document.createElement("section"); // Información
            sec_equ_inf.classList.add("equ-inf");
            let img_equ_img = document.createElement("img");
            img_equ_img.classList.add("equ-img");
            img_equ_img.src = "../assets/img/categoria_" + equ.equ_categoria.toLowerCase() + ".jpg";
            img_equ_img.alt = "Equipamiento " + equ.equ_nombre + ".";

            let div_det = document.createElement("div"); // Detalles del Equipamiento
            div_det.classList.add("det");

            let div_equ_nom = document.createElement("div"); // Nombre
            let h3_equ_nom = document.createElement("h3");
            div_equ_nom.appendChild(h3_equ_nom);

            let inp_equ_nom = document.createElement("input");
            inp_equ_nom.type = "text";
            inp_equ_nom.id = "equ-nom";
            inp_equ_mar.placeholder = equ.equ_nombre;
            div_det.appendChild(div_equ_nom);
            div_det.appendChild(inp_equ_nom);

            let div_equ_det = document.createElement("div"); // Detalles
            let p_equ_det = document.createElement("p");
            div_equ_det.appendChild(p_equ_det);

            let inp_equ_mar = document.createElement("input");
            inp_equ_mar.type = "text";
            inp_equ_mar.id = "equ-mar";
            inp_equ_mar.placeholder = equ.equ_marca;

            let inp_equ_mod = document.createElement("input");
            inp_equ_mod.type = "text";
            inp_equ_mod.id = "equ-mod";
            inp_equ_mar.placeholder = equ.equ_modelo;
            div_det.appendChild(div_equ_det);
            div_det.appendChild(inp_equ_mar);
            div_det.appendChild(inp_equ_mod);

            sec_equ_inf.appendChild(img_equ_img); // Imagen en información
            sec_equ_inf.appendChild(div_det); // Detalles en información

            let sec_equ_btn = document.createElement("section"); // Botones
            sec_equ_btn.classList.add("equ-btn");

            const btn_edi = document.createElement("button"); // Boton editar
            btn_edi.classList.add("btn-xs");
            btn_edi.classList.add("btn-edit");
            const img_btn_edi = document.createElement("img");
            img_btn_edi.src = srcEditar;
            btn_edi.alt = "Editar campos del equipamiento " + equ.equ_nombre + ".";
            btn_edi.appendChild(img_btn_edi);

            btn_edi.addEventListener("click", () => {
                h3_equ_nom.replaceWith(inp_equ_nom);
                p_equ_det.replaceWith(inp_equ_mar, inp_equ_mod);
            });

            const btn_gua = document.createElement("button"); // Boton guardar
            btn_gua.classList.add("btn-xs");
            btn_gua.classList.add("btn-save");
            const img_btn_gua = document.createElement("img");
            img_btn_gua.src = srcGuardar;
            btn_gua.alt = "Guardar cambios del equipamiento " + equ.equ_nombre + ".";
            btn_gua.appendChild(img_btn_gua);

            btn_gua.addEventListener("click", () => {
                
            });

            const btn_eli = document.createElement("button"); // Boton eliminar
            btn_eli.classList.add("btn-xs");
            btn_eli.classList.add("btn-delete");
            const img_btn_eli = document.createElement("img");
            img_btn_eli.src = srcEliminar;
            btn_eli.alt = "Eliminar equipamiento " + equ.equ_nombre + ".";
            btn_eli.appendChild(img_btn_eli);

            btn_eli.addEventListener("click", () => {

            });

            sec_equ_btn.appendChild(btn_edi);
            sec_equ_btn.appendChild(btn_gua);
            sec_equ_btn.appendChild(btn_eli);

            art_equ.appendChild(sec_equ_inf); // Seccion de información al artículo
            art_equ.appendChild(sec_equ_btn); // Seccion de botones al artículo
        });
    });
}

// [ Limpia el listado de los equipos de una Ubicacion ]
function limpiarEquiposDeUbicacion() {
    equipamientos.innerHTML = '';
}