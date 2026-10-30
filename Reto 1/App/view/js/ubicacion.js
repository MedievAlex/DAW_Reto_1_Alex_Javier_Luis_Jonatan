/* ---------------------------------------------- [Constantes]*/
const UBI_URL = "../../api/UbicacionController.php";
const EQU_URL = "../../api/EquipacionController.php";

const artUbi = document.getElementById("ubicaciones");
const tbody_ubicaciones = document.querySelector("#ubicaciones table tbody");

const artEqu = document.getElementById("equipamientos");

/* ---------------------------------------- [FUNCIONES]*/
document.addEventListener("DOMContentLoaded", () => {
    cargarUbicaciones();

    // mockUbicaciones(); // mockData.js
});

// [ Pide el listado de todas las Ubicaciones ]
async function cargarUbicaciones() {
    let url = UBI_URL;
    let method = "GET";
    let data = [];
    let ubicaciones;

    ubicaciones = petition(url, method, data); // Llama al petition de global.js

    ubicaciones.then((value) => {
        if (Array.isArray(value)) {
            let atributos = ["ubi_id", "ubi_nombre", "ubi_descripcion"];

            // Verifica si todos los objetos tienen todos los atributos
            let valido = value.every(obj =>
                atributos.every(clave => clave in obj)
            );

            if (valido) {
                value = ordenarUbicaciones(value);

                value.forEach(ubi => {
                    let ubi_id = ubi.ubi_id;
                    let tr_ubi = document.createElement("tr");// Nueva Ubicacion
                    tr_ubi.classList.add("aula");

                    let ubi_nombre = document.createElement("td"); // Nombre
                    let h3_ubi_nombre = document.createElement("h3");
                    h3_ubi_nombre.classList.add("ubi_nombre");
                    h3_ubi_nombre.textContent = ubi.ubi_nombre;
                    ubi_nombre.appendChild(h3_ubi_nombre);

                    tr_ubi.appendChild(ubi_nombre);

                    let ubi_descripcion = document.createElement("td"); // Descripcion
                    ubi_descripcion.textContent = ubi.ubi_descripcion;

                    tr_ubi.appendChild(ubi_descripcion);

                    let ubi_btn = document.createElement("td"); // Botones

                    // ---------------------------------------- Boton Editar
                    let btn_edit = document.createElement("button");
                    btn_edit.alt = "Editar ubicación " + ubi.ubi_nombre + ".";
                    let img_edit = document.createElement("img");
                    img_edit.src = srcEditar;
                    btn_edit.appendChild(img_edit);
                    btn_edit.classList.add("btn-s");
                    btn_edit.classList.add("btn-edit");

                    // [ Edita la Ubicacion selecionada ] PENDIENTE
                    btn_edit.addEventListener("click", () => {
                        btn_edit.classList.remove("visible");
                        btn_edit.classList.add("oculto");

                        btn_save.classList.remove("oculto");
                        btn_save.classList.add("visible");

                    });

                    ubi_btn.appendChild(btn_edit);

                    // ---------------------------------------- Boton Guardar
                    let btn_save = document.createElement("button");
                    btn_save.alt = "Editar ubicación " + ubi.ubi_nombre + ".";
                    let img_save = document.createElement("img");
                    img_save.src = srcGuardar;
                    btn_save.appendChild(img_save);
                    btn_save.classList.add("btn-s");
                    btn_save.classList.add("btn-edit");
                    btn_save.classList.add("oculto");

                    // [ Guarda las modificaciones de la Ubicacion editada ] PENDIENTE
                    btn_save.addEventListener("click", () => {
                        btn_save.classList.remove("visible");
                        btn_save.classList.add("oculto");

                        btn_edit.classList.remove("oculto");
                        btn_edit.classList.add("visible");

                    });

                    ubi_btn.appendChild(btn_save);

                    // ---------------------------------------- Boton Eliminar
                    if (ubi.ubi_nombre != "Almacén") {
                        let btn_delete = document.createElement("button");
                        btn_delete.alt = "Editar ubicación " + ubi.ubi_nombre + ".";
                        let img_delete = document.createElement("img");
                        img_delete.src = srcEliminar;
                        btn_delete.appendChild(img_delete);
                        btn_delete.classList.add("btn-s");
                        btn_delete.classList.add("btn-delete");

                        // [ Elimina la Ubicacion ] PENDIENTE
                        btn_delete.addEventListener("click", () => {
                            eliminarUbicacion(ubi_id);
                        });

                        if (verificarEquipamientos(ubi_id)) {
                            btn_delete.disabled = true;
                        } else {
                            btn_delete.disabled = false;
                        }

                        ubi_btn.appendChild(btn_delete);
                    }

                    // ---------------------------------------- Boton Abrir
                    let btn_open = document.createElement("button");
                    btn_open.alt = "Mostrar equipaciones de la ubicación " + ubi.ubi_nombre + ".";
                    let img_open = document.createElement("img");
                    img_open.src = srcCerrar;
                    btn_open.appendChild(img_open);
                    btn_open.classList.add("btn-s");
                    btn_open.classList.add("btn-open");

                    // [ Muestra los Equipamientos de la Ubicacion ]
                    btn_open.addEventListener("click", (event) => {
                        btn_open.classList.remove("visible");
                        btn_open.classList.add("oculto");

                        btn_close.classList.remove("oculto");
                        btn_close.classList.add("visible");

                        //cargarEquiposDeUbicacion();

                        limpiarEquiposDeUbicacion(event.currentTarget);
                        mockEquipamientos(); // mockData.js
                    });

                    ubi_btn.appendChild(btn_open);

                    // ---------------------------------------- Boton Cerrar
                    let btn_close = document.createElement("button");
                    btn_close.alt = "Ocultar equipaciones de la ubicación " + ubi.ubi_nombre + ".";
                    let btn_img = document.createElement("img");
                    btn_img.src = srcAbrir;
                    btn_close.appendChild(btn_img);
                    btn_close.classList.add("btn-s");
                    btn_close.classList.add("btn-close");
                    btn_close.classList.add("oculto");

                    // [ Oculta los Equipamientos de la Ubicacion ]
                    btn_close.addEventListener("click", (event) => {
                        btn_close.classList.remove("visible");
                        btn_close.classList.add("oculto");

                        btn_open.classList.remove("oculto");
                        btn_open.classList.add("visible");

                        limpiarEquiposDeUbicacion(event.currentTarget);
                    });

                    ubi_btn.appendChild(btn_close);

                    tr_ubi.appendChild(ubi_btn);

                    tbody_ubicaciones.appendChild(tr_ubi);
                });

            } else {
                ubiNoValido(value[0].message);
            }

        } else {
            ubiNoValido("[ERROR]: Formato de datos incorrecto.");
        }
    });
}

// [ Pide una Ubicacion mediante el ID ]
async function buscarUbicacionPorId() {
    let url = UBI_URL + "?ubi_id=" + 2;
    let method = "GET";
    let data = [];
    let ubicacion;

    ubicacion = petition(url, method, data); // Llama al petition de global.js

    ubicacion.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre);

        if ("success" in value && value.success) {

        } else {

        }
    });
}

// [ Pide una Ubicacion mediante el NOMBRE ]
async function buscarUbicacionPorNombre(ubi_nombre) {
    let url = UBI_URL + "?ubi_nombre=" + ubi_nombre;
    let method = "GET";
    let data = [];
    let ubicacion;
    let ubi = null;

    ubicacion = petition(url, method, data); // Llama al petition de global.js

    ubicacion.then((value) => {
        let atributos = ["ubi_id", "ubi_nombre", "ubi_descripcion"];

        // Verifica si todos los objetos tienen todos los atributos
        let valido = value.every(obj =>
            atributos.every(clave => clave in obj)
        );

        if (valido) {
            ubi = value[0];

        } else {
            ubi = value[0];
        }

        console.log(value[0]);
    });

    return ubi;
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

    ubicacion = petition(url, method, data); // Llama al petition de global.js

    ubicacion.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre + " creada correctamente.");

        if ("success" in value && value.success) {

        } else {

        }
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

    ubicacion = petition(url, method, data); // Llama al petition de global.js

    ubicacion.then((value) => {
        console.log(value[0]);
        alert(value[0].ubi_nombre + " editada correctamente.");

        if ("success" in value && value.success) {

        } else {

        }
    });
}

// [ Elimina la Ubicacion ]
async function eliminarUbicacion(ubi_id) {
    let url = UBI_URL + "?ubi_id=" + ubi_id;
    let method = "DELETE";
    let data = {};
    let ubicacion;

    ubicacion = petition(url, method, data); // Llama al petition de global.js

    ubicacion.then((value) => {
        console.log(value[0].message);
        alert(value[0].message);

        if ("success" in value && value.success) {

        } else {

        }
    });
}

// [ Pide el listado de los equipos de una Ubicacion ]
async function cargarEquiposDeUbicacion() {
    let url = EQU_URL;
    let method = "GET";
    let data = [];
    let equipamientos;

    limpiarEquiposDeUbicacion();

    equipamientos = petition(url, method, data); // Llama al petition de global.js

    equipamientos.then((value) => {
        if (Array.isArray(value)) {
            let atributos = ["equ_id", "equ_nombre", "equ_descripcion", "equ_marca", "equ_modelo", "equ_categoria", "equ_ubicacion"];

            // Verifica si todos los objetos tienen todos los atributos
            let valido = value.every(obj =>
                atributos.every(clave => clave in obj)
            );

            if (valido) {
                value.sort((a, b) => a.equ_nombre.localeCompare(b.equ_nombre));

                value.forEach(equ => {
                    let art_equ = document.createElement("article"); // Nuevo Equipamiento
                    art_equ.classList.add("equ");
                    art_equ.classList.add("tarjeta");

                    let sec_equ_inf = document.createElement("section"); // Información
                    sec_equ_inf.classList.add("equ-inf");
                    let img_equ_img = document.createElement("img");
                    img_equ_img.classList.add("equ-img");
                    img_equ_img.src = "../assets/img/categoria_" + equ.equ_categoria.toLowerCase() + ".jpg";
                    img_equ_img.alt = "Equipamiento " + equ.equ_nombre + ".";

                    art_equ.appendChild(sec_equ_inf); // Seccion de información al artículo

                    let div_det = document.createElement("div"); // Detalles del Equipamiento
                    div_det.classList.add("det");

                    let div_equ_nom = document.createElement("div"); // Nombre
                    let h3_equ_nom = document.createElement("h3");
                    h3_equ_nom.textContent = equ.equ_nombre;
                    div_equ_nom.appendChild(h3_equ_nom);

                    let inp_equ_nom = document.createElement("input"); // Input Nombre
                    inp_equ_nom.type = "text";
                    inp_equ_nom.id = "equ-nom";
                    inp_equ_nom.placeholder = equ.equ_nombre;
                    div_det.appendChild(div_equ_nom);
                    //div_det.appendChild(inp_equ_nom);

                    let div_equ_det = document.createElement("div"); // Detalles
                    let p_equ_det = document.createElement("p");
                    p_equ_det.textContent = equ.equ_marca + " - " + equ.equ_modelo;
                    div_equ_det.appendChild(p_equ_det);

                    let inp_equ_mar = document.createElement("input"); // Input Marca
                    inp_equ_mar.type = "text";
                    inp_equ_mar.id = "equ-mar";
                    inp_equ_mar.placeholder = equ.equ_marca;
                    //div_equ_det.appendChild(inp_equ_mar);

                    let inp_equ_mod = document.createElement("input"); // Input Modelo
                    inp_equ_mod.type = "text";
                    inp_equ_mod.id = "equ-mod";
                    inp_equ_mod.placeholder = equ.equ_modelo;
                    //div_equ_det.appendChild(inp_equ_mod);

                    div_det.appendChild(div_equ_det);

                    sec_equ_inf.appendChild(img_equ_img); // Imagen en información
                    sec_equ_inf.appendChild(div_det); // Detalles en información

                    let sec_equ_btn = document.createElement("section"); // Botones
                    sec_equ_btn.classList.add("equ-btn");

                    art_equ.appendChild(sec_equ_btn); // Seccion de botones al artículo

                    // ---------------------------------------- Boton Editar
                    let btn_edit = document.createElement("button");
                    btn_edit.classList.add("btn-s");
                    btn_edit.classList.add("btn-edit");
                    let img_btn_edit = document.createElement("img");
                    img_btn_edit.src = srcEditar;
                    btn_edit.alt = "Editar campos del equipamiento " + equ.equ_nombre + ".";
                    btn_edit.appendChild(img_btn_edit);

                    // [ Edita el Equipamiento selecionado ]
                    btn_edit.addEventListener("click", () => {
                        btn_edit.classList.remove("visible");
                        btn_edit.classList.add("oculto");

                        btn_save.classList.remove("oculto");
                        btn_save.classList.add("visible");
                    });

                    sec_equ_btn.appendChild(btn_edit);

                    // ---------------------------------------- Boton Guardar
                    let btn_save = document.createElement("button");
                    btn_save.classList.add("btn-s");
                    btn_save.classList.add("btn-save");
                    btn_save.classList.add("oculto");
                    let img_btn_save = document.createElement("img");
                    img_btn_save.src = srcGuardar;
                    btn_save.alt = "Guardar cambios del equipamiento " + equ.equ_nombre + ".";
                    btn_save.appendChild(img_btn_save);

                    // [ Guarda las modificaciones del Equipamiento editado ]
                    btn_save.addEventListener("click", () => {
                        btn_save.classList.remove("visible");
                        btn_save.classList.add("oculto");

                        btn_edit.classList.remove("oculto");
                        btn_edit.classList.add("visible");
                    });

                    sec_equ_btn.appendChild(btn_save);

                    // ---------------------------------------- Boton Eliminar
                    let btn_delete = document.createElement("button");
                    btn_delete.classList.add("btn-s");
                    btn_delete.classList.add("btn-delete");
                    let img_btn_delete = document.createElement("img");
                    img_btn_delete.src = srcEliminar;
                    btn_delete.alt = "Eliminar equipamiento " + equ.equ_nombre + ".";
                    btn_delete.appendChild(img_btn_delete);

                    // [ Elimina el Equipamiento ]
                    btn_delete.addEventListener("click", () => {

                    });

                    sec_equ_btn.appendChild(btn_delete);

                    artEqu.appendChild(art_equ);
                });

            } else {
                equNoValido(value[0].message);
            }

        } else {
            equNoValido("Formato de datos incorrecto.");
        }
    });
}

// [ Verifica si la Ubicacion tiene Equpamientos ]
async function verificarEquipamientos(ubi_id) {
    let url = UBI_URL + "?equ_ubi_id=" + ubi_id;
    let method = "GET";
    let data = [];
    let tieneEqu;

    tieneEqu = petition(url, method, data); // Llama al petition de global.js

    tieneEqu.then((value) => {
        console.log(value[0]);
        return value[0].equ_ubi;
    });
}

// [ Ordena alfabéticamente las Ubicaciones ]
function ordenarUbicaciones(value) {
    let almacen = value.find(a => a.ubi_nombre === "Almacén"); // Busca la Ubicación Almacén
    let ubicacionesFiltradas = Array.from(value).filter(b => b.ubi_nombre !== almacen.ubi_nombre); // Quita Ubicacion Almacén para ordenar el resto
    let ubicacionesOrdenadas = ubicacionesFiltradas.sort((a, b) => a.ubi_nombre.localeCompare(b.ubi_nombre)); // Ordena las demás Ubicaciones

    value = [];
    value.push(almacen);
    ubicacionesOrdenadas.forEach(ubi => {
        value.push(ubi);
    });

    return value;
}

// [ Limpia el listado de los equipos de una Ubicacion ]
function limpiarEquiposDeUbicacion(event_btn) {
    let botonesAbrir = Array.from(document.getElementsByClassName("btn-open"));
    let botonesCerrar = Array.from(document.getElementsByClassName("btn-close"));

    let posicion = botonesAbrir.indexOf(event_btn); // Obtiene la posición del índice del boton

    let botonesAbirFiltrados = Array.from(botonesAbrir).filter(b => b !== botonesAbrir[posicion]); // Elimina el botón de la posicion deseada 
    let botonesCerrarFiltrados = Array.from(botonesCerrar).filter(b => b !== botonesCerrar[posicion]); // Elimina el botón de la posicion deseada 

    equipamientos.innerHTML = "";

    for (var i = 0; i < botonesAbirFiltrados.length; i++) {
        botonesAbirFiltrados[i].classList.remove("oculto");
        botonesAbirFiltrados[i].classList.add("visible");
    }

    for (var i = 0; i < botonesCerrarFiltrados.length; i++) {
        botonesCerrarFiltrados[i].classList.remove("visible");
        botonesCerrarFiltrados[i].classList.add("oculto");
    }
}

// [ Genera la tarjeta del mensaje de error de Ubicacion ]
function ubiNoValido(message) {
    let tr_err = document.createElement("tr");
    let td_err = document.createElement("td");

    let ubi_err = document.createElement("div");
    ubi_err.classList.add("err");
    ubi_err.textContent = "[ERROR]: " + message;

    td_err.appendChild(ubi_err);
    tr_err.appendChild(td_err);
    tbody_ubicaciones.appendChild(tr_err);
}

// [ Genera la tarjeta del mensaje de error de Equipamientos ]
function equNoValido(message) {
    let equ_err = document.createElement("div");
    equ_err.classList.add("err");
    equ_err.textContent = "[ERROR]: " + message;

    artEqu.appendChild(equ_err);
}