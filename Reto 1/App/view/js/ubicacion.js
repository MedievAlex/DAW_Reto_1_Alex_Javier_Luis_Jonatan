/* ---------------------------------------------- [ CONSTANTES ]*/
const UBI_URL = "../../api/UbicacionController.php";
const EQU_URL = "../../api/EquipamientoController.php";

const artUbi = document.getElementById("ubicaciones");
const ubiSearch = document.getElementById("ubi-search");
const btnSearch = document.getElementById("search");

const table_ubicaciones = document.querySelector("#ubicaciones table");
const tbody_ubicaciones = document.querySelector("#ubicaciones table tbody");

const btnNewUbi = document.getElementById("btn-new-ubi");

const artEqu = document.getElementById("equipamientos");

// Usuario
const datosSesion = sessionStorage.getItem("auth_usuario");
const usuarioSesion = datosSesion ? JSON.parse(datosSesion) : null;
const idUsuarioSesion = usuarioSesion ? parseInt(usuarioSesion.usu_id, 10) : NaN;
var esAdmin = false;

if (usuarioSesion !== null && !isNaN(idUsuarioSesion) && usuarioSesion.rol === "ADMIN") {
    esAdmin = true;
}

/* ---------------------------------------- [ LISTENERS ]*/
document.addEventListener("DOMContentLoaded", () => {
    cargarUbicaciones();
    // mockUbicaciones(); // mockData.js
});

if (esAdmin) {
    btnNewUbi.addEventListener("click", () => {
        btnNewUbi.disabled = true;

        let tr_ubi = tbody_ubicaciones.insertRow(0);// Nueva Ubicacion
        tr_ubi.classList.add("aula");

        let td_ubi_nom = tr_ubi.insertCell(0); // Nombre
        let inp_ubi_nom = document.createElement("input"); // Input Nombre
        inp_ubi_nom.type = "text";
        inp_ubi_nom.placeholder = "nombre";
        inp_ubi_nom.className = "ubi-nom";
        inp_ubi_nom.title = "Nombre de la ubicación nueva.";
        inp_ubi_nom.focus();

        td_ubi_nom.appendChild(inp_ubi_nom);
        tr_ubi.appendChild(td_ubi_nom);

        let td_ubi_des = tr_ubi.insertCell(1); // Descripcion
        let inp_ubi_des = document.createElement("input"); // Input Descripcion
        inp_ubi_des.type = "text";
        inp_ubi_des.placeholder = "descripcion";
        inp_ubi_des.className = "ubi-des";
        inp_ubi_des.title = "Descripción de la ubicación nueva.";

        td_ubi_des.appendChild(inp_ubi_des);
        tr_ubi.appendChild(td_ubi_des);

        let ubi_btn = tr_ubi.insertCell(2); // Botones

        // ---------------------------------------- Boton Guardar
        let btn_save = document.createElement("button");
        btn_save.alt = "Guardar Ubicación.";
        let img_save = document.createElement("img");
        img_save.src = srcGuardar;
        btn_save.appendChild(img_save);
        btn_save.classList.add("btn-s");
        btn_save.classList.add("btn-edit");
        btn_save.title = "Guardar ubicación nueva.";

        // [ Guarda las modificaciones de la Ubicacion editada ]
        btn_save.addEventListener("click", () => {
            let ubi_nom = inp_ubi_nom.value.trim();
            let ubi_des = inp_ubi_des.value.trim();

            if (ubi_nom === "" || ubi_des === "") {
                logMessage("[ERROR]: No se puede crear una ubicación con campos vacios.");

                if (ubi_nom === "" || ubi_des === "") {
                    logMessage("[ERROR]: No se puede guardar una ubicación con campos vacios.");

                    if (ubi_nom === "") {
                        inp_ubi_nom.classList.add("inpErr");

                    } else if (ubi_des === "") {
                        inp_ubi_des.classList.add("inpErr");
                    }
                }
            } else {
                crearUbicacion(0, ubi_nom, ubi_des);
            }
        });

        ubi_btn.appendChild(btn_save);

        // ---------------------------------------- Boton Cancelar
        let btn_cancel = document.createElement("button");
        btn_cancel.alt = "Cancelar nueva ubicación.";
        let img_cancel = document.createElement("img");
        img_cancel.src = srcCancelar;
        btn_cancel.appendChild(img_cancel);
        btn_cancel.classList.add("btn-s");
        btn_cancel.classList.add("btn-delete");
        btn_cancel.title = "Cancelar.";

        // [ Cancela la acción ]
        btn_cancel.addEventListener("click", () => {
            cargarUbicaciones();
        });

        ubi_btn.appendChild(btn_cancel);
        tr_ubi.appendChild(ubi_btn);

        tbody_ubicaciones.prepend(tr_ubi);
    });
} else {
    btnNewUbi.classList.add("oculto");
}

btnSearch.addEventListener("click", () => {
    filtrarUbicaciones(ubiSearch.value);

});

/* ---------------------------------------- [ FUNCIONES ]*/
// [ Genera la tarjeta del mensaje de error de Ubicacion ]
function logMessage(message) {
    console.log(message);
    alert(message);
}

// [ Genera la tarjeta del mensaje de error de Ubicacion ]
function ubiErr(message) {
    let tr_err = document.createElement("tr");
    let td_err = document.createElement("td");

    let ubi_err = document.createElement("div");
    ubi_err.classList.add("err");
    ubi_err.textContent = message;

    td_err.appendChild(ubi_err);
    tr_err.appendChild(td_err);
    tbody_ubicaciones.appendChild(tr_err);
}

// [ Genera la tarjeta del mensaje de error de Equipamientos ]
function equErr(message) {
    let equ_err = document.createElement("div");
    equ_err.classList.add("err");
    equ_err.textContent = message;

    artEqu.appendChild(equ_err);
}

/* ------------------------------------------------------------------------ [ UBICACIONES ]*/
// [ Pide el listado de todas las Ubicaciones ]
async function cargarUbicaciones() {
    let url = UBI_URL;
    let method = "GET";
    let data = [];
    let response;

    btnNewUbi.disabled = false;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            if (Array.isArray(value.data)) {
                let atributos = ["ubi_id", "ubi_nombre", "ubi_descripcion"];

                // Verifica si todos los objetos tienen todos los atributos
                let valido = value.data.every(obj =>
                    atributos.every(clave => clave in obj)
                );

                if (valido) {
                    generarUbicaciones(value);
                } else {
                    ubiErr("[ERROR]: " + value.message);
                }
            }
        } else {
            ubiErr("[ERROR]: Formato de datos incorrecto.");
        }
    });
}

// [ Pide una Ubicacion mediante el ID ]
async function buscarUbicacionPorId(ubi_id) {
    let url = UBI_URL + "?ubi_id=" + ubi_id;
    let method = "GET";
    let data = [];
    let response;
    let ubi = null;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            let atributos = ["ubi_id", "ubi_nombre", "ubi_descripcion"];

            // Verifica si todos los objetos tienen todos los atributos
            let valido = value.data.every(obj =>
                atributos.every(clave => clave in obj)
            );

            if (valido) {
                console.log(value.data);
                ubi = {
                    ubi_id: value.data.ubi_id,
                    ubi_nombre: value.data.ubi_nombre,
                    ubi_descripcion: value.data.ubi_descripcion
                };
            } else {
                console.log(value.message);
            }
        } else {
            console.log(value.message);
        }
    });

    return ubi;
}

// [ Pide una Ubicacion mediante el NOMBRE ]
async function buscarUbicacionPorNombre(ubi_nombre) {
    let url = UBI_URL + "?ubi_nombre=" + ubi_nombre;
    let method = "GET";
    let data = [];
    let response;
    let ubi = null;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            let atributos = ["ubi_id", "ubi_nombre", "ubi_descripcion"];

            // Verifica si todos los objetos tienen todos los atributos
            let valido = value.data.every(obj =>
                atributos.every(clave => clave in obj)
            );

            if (valido) {
                console.log(value.data);
                ubi = {
                    ubi_id: value.data.ubi_id,
                    ubi_nombre: value.data.ubi_nombre,
                    ubi_descripcion: value.data.ubi_descripcion
                };
            } else {
                console.log(value.message);
            }
        } else {
            console.log(value.message);
        }
    });

    return ubi;
}

// [ Crea la Ubicacion enviada ]
async function crearUbicacion(ubi_id, ubi_nombre, ubi_descripcion) {
    let url = UBI_URL;
    let method = "POST";
    let data = {
        ubi_id: ubi_id,
        ubi_nombre: ubi_nombre,
        ubi_descripcion: ubi_descripcion
    };
    let response;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            logMessage(value.message);
        } else {
            logMessage(value.message);
        }

        cargarUbicaciones();
    });
}

// [ Editar la Ubicacion con los datos nuevos ]
async function editarUbicacion(ubi_id, ubi_nombre, ubi_descripcion) {
    let url = UBI_URL;
    let method = "PUT";
    let data = {
        ubi_id: ubi_id,
        ubi_nombre: ubi_nombre,
        ubi_descripcion: ubi_descripcion
    };
    let response;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            if (Array.isArray(value.data)) {
                let atributos = ["ubi_id", "ubi_nombre", "ubi_descripcion"];

                // Verifica si todos los objetos tienen todos los atributos
                let valido = value.data.every(obj =>
                    atributos.every(clave => clave in obj)
                );

                if (valido) {
                    logMessage(value.message);
                } else {
                    logMessage(value.message);
                }
            } else {
                logMessage(value.message);
            }
        } else {
            logMessage(value.message);
        }

        cargarUbicaciones();
    });
}

// [ Verifica si la Ubicacion tiene Equpamientos ]
async function verificarEquipamientos(btn_delete, ubi_id) {
    let url = UBI_URL + "?equ_ubi_id=" + ubi_id;
    let method = "GET";
    let data = [];
    let response;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if (value.data[0].equ_ubi) { // No lo ejecuta a tiempo (Similar al problema del ID al Eliminar)
            btn_delete.disabled = true;
        } else {
            btn_delete.disabled = false;
        }
    });
}

// [ Elimina la Ubicacion ]
async function eliminarUbicacion(ubi_id) {
    let url = UBI_URL + "?ubi_id=" + ubi_id;
    let method = "DELETE";
    let data = {};
    let response;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            logMessage(value.message);
        } else {
            logMessage(value.message);
        }

        cargarUbicaciones();
    });
}

// [ Genera las Ubicaciones en el HTML ]
function generarUbicaciones(value) {
    tbody_ubicaciones.innerHTML = "";
    let ubicaciones = ordenarUbicaciones(value.data);

    ubicaciones.forEach(ubi => {
        let ubi_id = ubi.ubi_id;
        let ubi_nombre = ubi.ubi_nombre;
        let ubi_descripcion = ubi.ubi_descripcion;

        let btn_edit;
        let btn_save;
        let btn_cancel;
        let btn_delete;
        let btn_open;
        let btn_close;

        let tr_ubi = document.createElement("tr");// Nueva Ubicacion
        tr_ubi.classList.add("aula");

        let td_ubi_nom = document.createElement("td"); // Nombre
        let h3_ubi_nom = document.createElement("h3");
        h3_ubi_nom.classList.add("ubi-nom");
        h3_ubi_nom.textContent = ubi_nombre;

        td_ubi_nom.appendChild(h3_ubi_nom);
        tr_ubi.appendChild(td_ubi_nom);

        let inp_ubi_nom = document.createElement("input"); // Input Nombre
        inp_ubi_nom.type = "text";
        inp_ubi_nom.value = ubi_nombre;
        inp_ubi_nom.className = "ubi-nom";
        inp_ubi_nom.title = "Nombre de la ubicación.";

        let td_ubi_des = document.createElement("td"); // Descripcion
        let p_ubi_des = document.createElement("p");
        p_ubi_des.textContent = ubi_descripcion;

        td_ubi_des.appendChild(p_ubi_des);
        tr_ubi.appendChild(td_ubi_des);

        let inp_ubi_des = document.createElement("input"); // Input Descripcion
        inp_ubi_des.type = "text";
        inp_ubi_des.value = ubi_descripcion;
        inp_ubi_des.className = "ubi-des";
        inp_ubi_des.title = "Descripción de la ubicación " + ubi_nombre + ".";

        let ubi_btn = document.createElement("td"); // Botones

        if (esAdmin) {
            // ---------------------------------------- Boton Editar
            btn_edit = document.createElement("button");
            btn_edit.alt = "Editar ubicación " + ubi_nombre + ".";
            let img_edit = document.createElement("img");
            img_edit.src = srcEditar;
            btn_edit.title = "Editar ubicación " + ubi_nombre + ".";

            btn_edit.appendChild(img_edit);
            btn_edit.classList.add("btn-s");
            btn_edit.classList.add("btn-edit");

            ubi_btn.appendChild(btn_edit);

            // ---------------------------------------- Boton Guardar
            btn_save = document.createElement("button");
            btn_save.alt = "Editar ubicación " + ubi_nombre + ".";
            let img_save = document.createElement("img");
            img_save.src = srcGuardar;
            btn_save.title = "Guardar modificaciones de ubicación " + ubi_nombre + ".";

            btn_save.appendChild(img_save);
            btn_save.classList.add("btn-s");
            btn_save.classList.add("btn-edit");
            btn_save.classList.add("oculto");

            ubi_btn.appendChild(btn_save);

            // ---------------------------------------- Boton Cancelar
            btn_cancel = document.createElement("button");
            btn_cancel.alt = "Cancelar nueva ubicación.";
            let img_cancel = document.createElement("img");
            img_cancel.src = srcCancelar;
            btn_cancel.title = "Cancelar.";

            btn_cancel.appendChild(img_cancel);
            btn_cancel.classList.add("btn-s");
            btn_cancel.classList.add("btn-delete");
            btn_cancel.classList.add("oculto");

            ubi_btn.appendChild(btn_cancel);

            // ---------------------------------------- Boton Eliminar
            if (ubi_nombre != "Almacén") {
                btn_delete = document.createElement("button");
                btn_delete.alt = "Eliminar ubicación " + ubi_nombre + ".";
                let img_delete = document.createElement("img");
                img_delete.src = srcEliminar;
                btn_delete.title = "Eliminar ubicación " + ubi_nombre + ".";

                btn_delete.appendChild(img_delete);
                btn_delete.classList.add("btn-s");
                btn_delete.classList.add("btn-delete");

                // [ Elimina la Ubicacion ]
                btn_delete.addEventListener("click", () => {
                    const conf = window.confirm("Se va a eliminar la ubicación " + ubi_nombre.toUpperCase() + ". Esta acción no se puede desacer.");
                    if (conf) {
                        eliminarUbicacion(ubi_id);
                    } else {
                        logMessage("Se ha cancelado la acción.");
                    }
                });

                verificarEquipamientos(btn_delete, ubi_id);

                ubi_btn.appendChild(btn_delete);
            }
        }

        // ---------------------------------------- Boton Abrir
        btn_open = document.createElement("button");
        btn_open.alt = "Mostrar equipaciones de la ubicación " + ubi_nombre + ".";
        let img_open = document.createElement("img");
        img_open.src = srcCerrar;
        btn_open.title = "Mostrar equipamientos de la ubicación " + ubi_nombre + ".";

        btn_open.appendChild(img_open);
        btn_open.classList.add("btn-s");
        btn_open.classList.add("btn-open");

        ubi_btn.appendChild(btn_open);

        // ---------------------------------------- Boton Cerrar
        btn_close = document.createElement("button");
        btn_close.alt = "Ocultar equipaciones de la ubicación " + ubi_nombre + ".";
        let btn_img = document.createElement("img");
        btn_img.src = srcAbrir;
        btn_close.title = "Ocultar equipamientos de la ubicación " + ubi_nombre + ".";

        btn_close.appendChild(btn_img);
        btn_close.classList.add("btn-s");
        btn_close.classList.add("btn-close");
        btn_close.classList.add("oculto");

        ubi_btn.appendChild(btn_close);

        // ---------------------------------------- Event Listeners
        if (esAdmin) {
            // [ Edita la Ubicacion selecionada ]
            btn_edit.addEventListener("click", () => {
                btn_edit.classList.remove("visible");
                btn_edit.classList.add("oculto");

                btn_save.classList.remove("oculto");
                btn_save.classList.add("visible");

                btn_cancel.classList.remove("oculto");
                btn_cancel.classList.add("visible");

                if (ubi_nombre != "Almacén") {
                    btn_delete.classList.add("oculto");

                    h3_ubi_nom.replaceWith(inp_ubi_nom);
                }

                p_ubi_des.replaceWith(inp_ubi_des);

                p_ubi_des.focus();
            });

            // [ Guarda las modificaciones de la Ubicacion editada ]
            btn_save.addEventListener("click", () => {
                let ubi_nom = inp_ubi_nom.value.trim();
                let ubi_des = inp_ubi_des.value.trim();

                if (ubi_nom === "" || ubi_des === "") {
                    logMessage("[ERROR]: No se puede guardar una ubicación con campos vacios.");

                    if (ubi_nom === "") {
                        inp_ubi_nom.classList.add("inpErr");

                    } else if (ubi_des === "") {
                        inp_ubi_des.classList.add("inpErr");
                    }
                } else {
                    editarUbicacion(ubi_id, ubi_nom, ubi_des);

                    btn_save.classList.remove("visible");
                    btn_save.classList.add("oculto");

                    btn_edit.classList.remove("oculto");
                    btn_edit.classList.add("visible");
                }
            });

            // [ Cancela la acción ]
            btn_cancel.addEventListener("click", () => {
                btn_save.classList.remove("visible");
                btn_save.classList.add("oculto");

                btn_edit.classList.remove("oculto");
                btn_edit.classList.add("visible");

                btn_cancel.classList.remove("visible");
                btn_cancel.classList.add("oculto");

                if (ubi_nombre != "Almacén") {
                    btn_delete.classList.remove("oculto");
                    btn_delete.classList.add("visible");

                    inp_ubi_nom.replaceWith(h3_ubi_nom);
                }

                inp_ubi_des.replaceWith(p_ubi_des);
            });
        }

        // [ Muestra los Equipamientos de la Ubicacion ]
        btn_open.addEventListener("click", (event) => {
            btn_open.classList.remove("visible");
            btn_open.classList.add("oculto");

            btn_close.classList.remove("oculto");
            btn_close.classList.add("visible");

            cerrarEquiposDeUbicacion(event.currentTarget);

            cargarEquiposDeUbicacion(ubi_id);
            //mockEquipamientos(); // mockData.js
        });

        // [ Oculta los Equipamientos de la Ubicacion ]
        btn_close.addEventListener("click", (event) => {
            btn_close.classList.remove("visible");
            btn_close.classList.add("oculto");

            btn_open.classList.remove("oculto");
            btn_open.classList.add("visible");

            cerrarEquiposDeUbicacion(event.currentTarget);
        });

        tr_ubi.appendChild(ubi_btn);

        tbody_ubicaciones.appendChild(tr_ubi);
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

// [ Filtra por el nombre buscado ]
function filtrarUbicaciones(search) {
    const trows = tbody_ubicaciones.querySelectorAll("tr");

    limpiarEquiposDeUbicacion();

    trows.forEach(row => {
        if (search.trim() !== "") {
            let nom = row.querySelector(".ubi-nom").textContent.trim().toLowerCase();

            if (nom.includes(search.trim())) {
                row.classList.remove("oculto");
            } else {
                row.classList.add("oculto");
            }
        } else {
            row.classList.remove("oculto");
        }
    });


}

// [ Limpia el listado de los equipos de una Ubicacion ]
function limpiarEquiposDeUbicacion() {
    let botonesAbrir = Array.from(document.getElementsByClassName("btn-open"));
    let botonesCerrar = Array.from(document.getElementsByClassName("btn-close"));

    artEqu.innerHTML = "";

    for (var i = 0; i < botonesAbrir.length; i++) {
        botonesAbrir[i].classList.remove("oculto");
        botonesAbrir[i].classList.add("visible");
    }

    for (var i = 0; i < botonesCerrar.length; i++) {
        botonesCerrar[i].classList.remove("visible");
        botonesCerrar[i].classList.add("oculto");
    }
}

// [ Limpia el listado de los equipos de una Ubicacion ]
function cerrarEquiposDeUbicacion(event_btn) {
    let botonesAbrir = Array.from(document.getElementsByClassName("btn-open"));
    let botonesCerrar = Array.from(document.getElementsByClassName("btn-close"));

    let posicion = botonesAbrir.indexOf(event_btn); // Obtiene la posición del índice del boton

    let botonesAbirFiltrados = Array.from(botonesAbrir).filter(b => b !== botonesAbrir[posicion]); // Elimina el botón de la posicion deseada 
    let botonesCerrarFiltrados = Array.from(botonesCerrar).filter(b => b !== botonesCerrar[posicion]); // Elimina el botón de la posicion deseada 

    artEqu.innerHTML = "";

    for (var i = 0; i < botonesAbirFiltrados.length; i++) {
        botonesAbirFiltrados[i].classList.remove("oculto");
        botonesAbirFiltrados[i].classList.add("visible");
    }

    for (var i = 0; i < botonesCerrarFiltrados.length; i++) {
        botonesCerrarFiltrados[i].classList.remove("visible");
        botonesCerrarFiltrados[i].classList.add("oculto");
    }
}

/* ------------------------------------------------------------------------ [ EQUIPAMIENTOS ]*/

// [ Pide el listado de los equipos de una Ubicacion ]
async function cargarEquiposDeUbicacion(ubi_id) {
    let url = EQU_URL + "?id_ubicacion=" + ubi_id;
    let method = "GET";
    let data = [];
    let response;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            if (Array.isArray(value.data)) {
                if (value.data.length == 0) {
                    artEqu.innerHTML = "";
                    equErr("No se encontraron equipamientos en la ubicación.");
                } else {
                    let atributos = ["id_equipamiento", "nombre", "descripcion", "marca", "modelo", "categoria", "id_ubicacion_actual"];

                    // Verifica si todos los objetos tienen todos los atributos
                    let valido = value.data.every(obj =>
                        atributos.every(clave => clave in obj)
                    );

                    if (valido) {
                        generarEquipamientos(value);
                    } else {
                        equErr("[ERROR]: " + value.message);
                    }
                }
            } else {
                equErr("[ERROR]: Formato de datos incorrecto.");
            }
        }
    });
}

// [ Editar el Equipamiento con los datos nuevos ]
async function editarEquipoDeUbicacion(id_equipamiento, nombre, descripcion, marca, modelo, categoria, id_ubicacion_actual) {
    let url = EQU_URL;
    let method = "PUT";
    let data = {
        id_equipamiento: id_equipamiento,
        nombre: nombre,
        descripcion: descripcion,
        marca: marca,
        modelo: modelo,
        categoria: categoria,
        id_ubicacion_actual: id_ubicacion_actual
    };
    let response;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            if (Array.isArray(value.data)) {
                let atributos = ["id_equipamiento", "nombre", "descripcion", "marca", "modelo", "categoria", "id_ubicacion_actual"];

                // Verifica si todos los objetos tienen todos los atributos
                let valido = value.data.every(obj =>
                    atributos.every(clave => clave in obj)
                );

                if (valido) {
                    logMessage(value.message);

                    cargarEquiposDeUbicacion(id_ubicacion_actual);
                } else {
                    logMessage(value.message);
                }
            } else {
                logMessage(value.message);
            }
        } else {
            logMessage(value.message);
        }
    });
}

// [ Elimina el Equipamiento ]
async function eliminarEquipoDeUbicacion(equ_id, equ_ubicacion) {
    let url = EQU_URL + "?id_equipamiento=" + equ_id;
    let method = "DELETE";
    let data = [];
    let response;

    response = petition(url, method, data); // Llama al petition de global.js

    response.then((value) => {
        if ("success" in value && value.success) {
            logMessage(value.message);

            cargarEquiposDeUbicacion(equ_ubicacion);
            cargarUbicaciones();
        } else {
            logMessage(value.message);
        }
    });
}

// [ Genera los Equipamientos en el HTML ]
function generarEquipamientos(value) {
    artEqu.innerHTML = "";
    value.data.sort((a, b) => a.nombre.localeCompare(b.nombre));

    value.data.forEach(equ => {
        let equ_id = equ.id_equipamiento;
        let equ_nombre = equ.nombre;
        let equ_descripcion = equ.descripcion;
        let equ_marca = equ.marca;
        let equ_modelo = equ.modelo;
        let equ_categoria = equ.categoria;
        let equ_ubicacion = equ.id_ubicacion_actual // Para la modificación y eliminacion

        let art_equ = document.createElement("article"); // Nuevo Equipamiento
        art_equ.classList.add("equ");
        art_equ.classList.add("tarjeta");

        let sec_equ_inf = document.createElement("section"); // Información
        sec_equ_inf.classList.add("equ-inf");
        let img_equ_img = document.createElement("img");
        img_equ_img.classList.add("equ-img");
        img_equ_img.src = "../assets/img/categoria_" + equ_categoria.toLowerCase() + ".jpg";
        img_equ_img.alt = "Equipamiento " + equ_nombre + ".";

        art_equ.appendChild(sec_equ_inf); // Seccion de información al artículo

        let div_det = document.createElement("div"); // Detalles del Equipamiento
        div_det.classList.add("det");

        let div_equ_nom = document.createElement("div"); // Nombre
        let h3_equ_nom = document.createElement("h3");
        h3_equ_nom.textContent = equ_nombre;
        h3_equ_nom.classList.add("equ-nom");
        div_equ_nom.appendChild(h3_equ_nom);
        div_det.appendChild(div_equ_nom);

        let inp_equ_nom = document.createElement("input"); // Input Nombre
        inp_equ_nom.type = "text";
        inp_equ_nom.value = equ_nombre;
        inp_equ_nom.className = "equ-nom";

        let div_equ_des = document.createElement("div"); // Descripción
        let p_equ_des = document.createElement("span");
        p_equ_des.textContent = equ_descripcion;
        p_equ_des.classList.add("equ-des");
        div_equ_des.appendChild(p_equ_des);
        div_det.appendChild(div_equ_des);

        let inp_equ_des = document.createElement("input"); // Input Descripción
        inp_equ_des.type = "text";
        inp_equ_des.value = equ_descripcion;
        inp_equ_des.className = "equ-des";

        let div_equ_det = document.createElement("div"); // Detalles
        let p_equ_det = document.createElement("span");
        p_equ_det.textContent = equ_marca + " - " + equ_modelo;
        p_equ_det.classList.add("equ-det");
        div_equ_det.appendChild(p_equ_det);
        div_det.appendChild(div_equ_det);

        let inp_equ_mar = document.createElement("input"); // Input Marca
        inp_equ_mar.type = "text";
        inp_equ_mar.value = equ_marca;
        inp_equ_mar.className = "equ-mar";

        let inp_equ_mod = document.createElement("input"); // Input Modelo
        inp_equ_mod.type = "text";
        inp_equ_mod.value = equ_modelo;
        inp_equ_mod.className = "equ-mod";

        sec_equ_inf.appendChild(img_equ_img); // Imagen en información
        sec_equ_inf.appendChild(div_det); // Detalles en información

        let sec_equ_btn = document.createElement("section"); // Botones
        sec_equ_btn.classList.add("equ-btn");

        if (esAdmin) {
            art_equ.appendChild(sec_equ_btn); // Seccion de botones al artículo

            // ---------------------------------------- Boton Editar
            let btn_edit = document.createElement("button");
            btn_edit.classList.add("btn-s");
            btn_edit.classList.add("btn-edit");
            let img_btn_edit = document.createElement("img");
            img_btn_edit.src = srcEditar;
            btn_edit.alt = "Editar campos del equipamiento " + equ_nombre + ".";
            btn_edit.appendChild(img_btn_edit);

            // [ Edita el Equipamiento selecionado ]
            btn_edit.addEventListener("click", () => {
                btn_edit.classList.remove("visible");
                btn_edit.classList.add("oculto");

                btn_save.classList.remove("oculto");
                btn_save.classList.add("visible");

                h3_equ_nom.replaceWith(inp_equ_nom);
                p_equ_des.replaceWith(inp_equ_des);
                p_equ_det.replaceWith(inp_equ_mar, inp_equ_mod);

                div_equ_des.focus();
            });

            sec_equ_btn.appendChild(btn_edit);

            // ---------------------------------------- Boton Guardar
            let btn_save = document.createElement("button");
            btn_save.classList.add("btn-s");
            btn_save.classList.add("btn-save");
            btn_save.classList.add("oculto");
            let img_btn_save = document.createElement("img");
            img_btn_save.src = srcGuardar;
            btn_save.alt = "Guardar cambios del equipamiento " + equ_nombre + ".";
            btn_save.appendChild(img_btn_save);

            // [ Guarda las modificaciones del Equipamiento editado ]
            btn_save.addEventListener("click", () => {
                let equ_nom = inp_equ_nom.value.trim();
                let equ_des = inp_equ_des.value.trim();
                let equ_mar = inp_equ_mar.value.trim();
                let equ_mod = inp_equ_mod.value.trim();
                equ_cat = equ_categoria;

                if (equ_nom === "" || equ_des === "" || equ_mar === "" || equ_mod === "") {
                    logMessage("[ERROR]: No se puede guardar un equipamiento con campos vacios.");

                    if (equ_nom === "") {
                        inp_equ_nom.classList.add("inpErr");
                    } else if (equ_des === "") {
                        inp_equ_des.classList.add("inpErr");
                    } else if (equ_mar === "") {
                        inp_equ_mar.classList.add("inpErr");
                    } else if (equ_mod === "") {
                        inp_equ_mod.classList.add("inpErr");
                    }
                } else {
                    editarEquipoDeUbicacion(equ_id, equ_nom, equ_des, equ_mar, equ_mod, equ_cat, equ_ubicacion);

                    btn_save.classList.remove("visible");
                    btn_save.classList.add("oculto");

                    btn_edit.classList.remove("oculto");
                    btn_edit.classList.add("visible");
                }
            });

            sec_equ_btn.appendChild(btn_save);

            // ---------------------------------------- Boton Eliminar
            let btn_delete = document.createElement("button");
            btn_delete.classList.add("btn-s");
            btn_delete.classList.add("btn-delete");
            let img_btn_delete = document.createElement("img");
            img_btn_delete.src = srcEliminar;
            btn_delete.alt = "Eliminar equipamiento " + equ_nombre + ".";
            btn_delete.title = "Eliminar equipamiento " + equ_nombre + ".";
            btn_delete.appendChild(img_btn_delete);

            // [ Elimina el Equipamiento ]
            btn_delete.addEventListener("click", () => {
                const conf = window.confirm("Se va a eliminar el equipamiento " + equ_nombre.toUpperCase() + ". Esta acción no se puede desacer.");

                if (conf) {
                    eliminarEquipoDeUbicacion(equ_id, equ_ubicacion);
                } else {
                    logMessage("Se ha cancelado la acción.");
                }
            });

            sec_equ_btn.appendChild(btn_delete);
        }

        artEqu.appendChild(art_equ);
    });
}