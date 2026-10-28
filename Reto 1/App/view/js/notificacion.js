const NOT_URL = "../../api/NotificacionController.php";

const btnNotificaciones1 = document.getElementById("boton-notificaciones");
const btnAgregarNotificacion = document.getElementById("btnAniadirNot");
const listaNotificaciones = document.getElementById("listaNotificaciones");
const filtroNotificaciones = document.getElementById("filtroNotificaciones");

async function petition(url, method, data) {
    try {
        const options = {
            method: method,
            headers: { "Content-type": "application/json" }
        };

        if (method !== "GET") {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "No se pudo completar la operación.");
        }

        return result;
    } catch (error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
        return { success: false, message: error.message };
    }
}

//Método para cargar todas las notificaciones desde el servidor
async function cargarNotificaciones() {
    if (!listaNotificaciones) {
        console.log("Notificaciones vacías.")
    }

    listaNotificaciones.textContent = "Cargando notificaciones...";

    try {
        const response = await fetch(NOT_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "No se pudieron cargar las notificaciones.");
        }
        listaNotificaciones.replaceChildren();

        if (result.data.length === 0) {
            listaNotificaciones.textContent = "No hay notificaciones.";
        }

        btnAgregarNotificacion.addEventListener("click", () => {
            // Evitamos que se abran varios formularios de creación a la vez
            if (document.getElementById("elementoNuevoNotificacion")) {
                return;
            }

            const usuarioNuevaNot = document.createElement("input");
            usuarioNuevaNot.className = "inputNuevaNotUsuario";
            usuarioNuevaNot.type = "number";
            usuarioNuevaNot.min = "1";
            usuarioNuevaNot.placeholder = "ID de usuario (ej. 1)";

            const elementoNuevo = document.createElement("article");
            elementoNuevo.className = "nuevaNotificacion";
            elementoNuevo.id = "elementoNuevoNotificacion";

            // Input Título
            const tituloNuevaNot = document.createElement("input");
            tituloNuevaNot.className = "inputNuevaNotTitulo";
            tituloNuevaNot.type = "text";
            tituloNuevaNot.placeholder = "Título de la notificación...";

            // Input Descripción
            const descripcionNuevaNot = document.createElement("textarea");
            descripcionNuevaNot.className = "inputNuevaNotDesc";
            descripcionNuevaNot.placeholder = "Descripción...";

            // Selector de Fecha y Hora (abre el calendario nativo del navegador)
            const fechaNuevaNot = document.createElement("input");
            fechaNuevaNot.className = "inputNuevaNotFecha";
            fechaNuevaNot.type = "datetime-local";

            const estadoNuevaNot = document.createElement("select");
            estadoNuevaNot.className = "inputNuevaNotEstado";

            // Selector de Estado (por si tu POST en PHP también exige el estado)
            const estadosPosibles = ["PENDIENTE", "EN_PROCESO", "REALIZADA"];
            estadosPosibles.forEach((valorEstado) => {
                const option = document.createElement("option");
                option.value = valorEstado;
                option.textContent = valorEstado;
                estadoNuevaNot.append(option);
            });

            // Botón para Guardar la nueva notificación
            const btnGuardarNueva = document.createElement("button");
            btnGuardarNueva.textContent = "Guardar";
            btnGuardarNueva.className = "btnGuardarNuevaNot";

            // Botón para Cancelar por si te arrepientes
            const btnCancelarNueva = document.createElement("button");
            btnCancelarNueva.textContent = "Cancelar";
            btnCancelarNueva.className = "btnCancelarNuevaNot";
            btnCancelarNueva.addEventListener("click", () => {
                elementoNuevo.remove();
            });

            btnGuardarNueva.addEventListener("click", () => {
                const idUsuario = parseInt(usuarioNuevaNot.value, 10);
                const titulo = tituloNuevaNot.value.trim();
                const descripcion = descripcionNuevaNot.value.trim();
                const fechaRaw = fechaNuevaNot.value; // Devuelve "YYYY-MM-DDTHH:MM"
                const estado = estadoNuevaNot.value.trim();

                if (!titulo || !descripcion || !fechaRaw) {
                    alert("Por favor, rellena el título, la descripción y selecciona una fecha.");
                }

                // Convertimos "2026-10-28T10:30" a "2026-10-28 10:30:00" para PHP/MySQL
                const fechaFormateada = fechaRaw.replace("T", " ") + ":00";

                agregarNotificacion(idUsuario, titulo, descripcion, fechaFormateada, estado);
            });

            elementoNuevo.append(
                usuarioNuevaNot,
                tituloNuevaNot,
                descripcionNuevaNot,
                fechaNuevaNot,
                estadoNuevaNot,
                btnGuardarNueva,
                btnCancelarNueva
            );

            listaNotificaciones.prepend(elementoNuevo);
            tituloNuevaNot.focus();
        });

        //Aqui está la logica para cargar las notificaciones
        result.data.forEach((notificacion) => {
            const notificacion_id = notificacion.not_id;
            const fechaLimpia = new Date(notificacion.fecha.date).toLocaleString();
            const fechaFormatoSQL = notificacion.fecha.date.split(".")[0];

            // Creamos primero los elementos de texto para poder manipularlos luego
            const elemento = document.createElement("article");
            elemento.className = "notificacion";
            elemento.id = `elementoNotificacion-${notificacion_id}`;

            const titulo = document.createElement("h3");
            titulo.textContent = notificacion.titulo;

            const descripcion = document.createElement("p");
            descripcion.textContent = notificacion.descripcion;

            const detalles = document.createElement("p");
            detalles.className = "notificacionDetalles";
            detalles.textContent = `${fechaLimpia} · ${notificacion.estado}`;

            // Botón Eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btnEliminarNotificacion";
            btnEliminar.innerHTML = '<img src="../assets/icons/icon_eliminar.png" alt="Eliminar notificación">';
            btnEliminar.addEventListener("click", (event) => {
                eliminarNotificacion(notificacion_id, event.currentTarget);
            });

            // Botón Modificar con estado de edición en línea
            const btnModificar = document.createElement("button");
            btnModificar.className = "btnModificarNotificacion";
            btnModificar.innerHTML = '<img src="../assets/icons/icon_editar.png" alt="Editar notificación">';

            // Variables para controlar la edición de ESTA tarjeta en concreto
            let editando = false;
            let inputTitulo = null;
            let inputFecha = null;
            let inputDescripcion = null;
            let inputEstado = null;

            btnModificar.addEventListener("click", () => {
                if (!editando) {
                    // Primer click: Convertir h3 y p en campos editables
                    inputTitulo = document.createElement("input");
                    inputTitulo.type = "text";
                    inputTitulo.value = titulo.textContent;
                    inputTitulo.className = "inputEditarTitulo";

                    inputDescripcion = document.createElement("textarea");
                    inputDescripcion.value = descripcion.textContent;
                    inputDescripcion.className = "inputEditarDescripcion";

                    inputFecha = document.createElement("input");
                    inputFecha.type = "text";
                    inputFecha.value = fechaFormatoSQL;

                    inputEstado = document.createElement("input");
                    inputEstado.type = "text";
                    inputEstado.value = notificacion.estado;
                    // Reemplazamos los textos por los inputs en el DOM
                    titulo.replaceWith(inputTitulo);
                    descripcion.replaceWith(inputDescripcion);
                    detalles.replaceWith(inputFecha, inputEstado);

                    // Cambiamos el botón para indicar que el siguiente click guarda
                    btnModificar.textContent = "Guardar";
                    editando = true;
                    inputTitulo.focus();

                } else {
                    // Segundo click: Recoger los nuevos valores y guardar
                    const nuevoTitulo = inputTitulo.value.trim();
                    const nuevaDescripcion = inputDescripcion.value.trim();
                    const nuevaFecha = inputFecha.value.trim();
                    const nuevoEstado = inputEstado.value.trim();

                    if (!nuevoTitulo || !nuevaDescripcion) {
                        alert("El título y la descripción no pueden estar vacíos.");
                    }

                    // Llamamos a la función PUT con los datos nuevos de los inputs
                    modificarNotificacion(
                        notificacion_id,
                        nuevoTitulo,
                        nuevaDescripcion,
                        nuevaFecha,
                        nuevoEstado
                    );
                }
            });

            // Añadimos todo al article y a la lista
            elemento.append(btnEliminar, btnModificar, titulo, descripcion, detalles);
            listaNotificaciones.append(elemento);
        });
    } catch (error) {
        console.error("Error al cargar las notificaciones:", error);
        listaNotificaciones.textContent = "No se pudieron cargar las notificaciones.";
    }
}

//Esto carga las notificaciones al entrar en el modal
btnNotificaciones1.addEventListener("click", cargarNotificaciones);

function agregarNotificacion(idUsuario ,titulo, descripcion, fecha, estado) {
    let url = NOT_URL;
    let method = "POST";
    let data = {
        not_id: idUsuario,
        titulo: titulo,
        descripcion: descripcion,
        fecha: {
            date: fecha
        },
        estado: estado
    };
    let resultado;

    resultado = petition(url, method, data);
    resultado.then((value) => {
        if (value.success) {
            alert("Notificación agregada correctamente.");
            cargarNotificaciones(); // Recargar la lista de notificaciones
        }
    });
}

function modificarNotificacion(id, titulo, descripcion, fecha, estado) {
    let url = NOT_URL + "?not_id=" + id;
    let method = "PUT";
    let data = {
        not_id: id,
        titulo: titulo,
        descripcion: descripcion,
        fecha: {
            date: fecha
        },
        estado: estado
    };
    let resultado;


    resultado = petition(url, method, data);
    resultado.then((value) => {
        if (value.success) {
            alert("Notificación modificada correctamente.");
            cargarNotificaciones(); // Recargar la lista de notificaciones
        }
    });
}

function eliminarNotificacion(id, btnEliminar) {
    let url = NOT_URL + "?not_id=" + id;
    let method = "DELETE";
    let data = [];
    let resultado;

    resultado = petition(url, method, data);
    resultado.then((value) => {
        if (value.success) {
            const elementoEliminado = btnEliminar.closest(".notificacion");
            if (elementoEliminado) {
                elementoEliminado.remove();
                cargarNotificaciones();
            }

            if (listaNotificaciones && !listaNotificaciones.querySelector(".notificacion")) {
                listaNotificaciones.textContent = "No hay notificaciones.";
            }
        }
    })
}