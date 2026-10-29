const NOT_URL = "../../api/NotificacionController.php";

const btnNotificaciones1 = document.getElementById("boton-notificaciones");
const listaNotificaciones = document.getElementById("listaNotificaciones");
const filtroNotificaciones = document.getElementById("filtroNotificaciones");

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

        result.data.forEach((notificacion) => {
            const notificacion_id = notificacion.not_id;
            const fechaLimpia = new Date(notificacion.fecha.date).toLocaleString();
            const fechaFormatoSQL = notificacion.fecha.date.split(".")[0];

            // Creamos primero los elementos de texto para poder manipularlos luego
            const elemento = document.createElement("article");
            elemento.classList.add("tarjeta");
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
            btnEliminar.classList.add("btn-s");
            btnEliminar.classList.add("btn-delete");
            btnEliminar.innerHTML = '<img src="../assets/icons/icon_eliminar.png" alt="Eliminar notificación">';
            btnEliminar.addEventListener("click", (event) => {
                eliminarNotificacion(notificacion_id, event.currentTarget);
            });

            // Botón Modificar con estado de edición en línea
            const btnModificar = document.createElement("button");
            btnModificar.classList.add("btn-s");
            btnModificar.classList.add("btn-edit");
            btnModificar.innerHTML = '<img src="../assets/icons/icon_editar.png" alt="Editar notificación">';

            // Variables para controlar la edición de ESTA tarjeta en concreto
            let editando = false;
            let inputTitulo = null;
            let inputFecha = null;
            let inputDescripcion = null;

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
                    //btnModificar.textContent = "Guardar";
                    btnModificar.textContent = "";
                    let img_guar = document.createElement("img");
                    img_guar.src = srcGuardar;
                    btnModificar.appendChild(img_guar);
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

btnNotificaciones1.addEventListener("click", cargarNotificaciones);

function agregarNotificacion(titulo, descripcion) {
    let url = NOT_URL;
    let method = "POST";
    let data = { titulo: titulo, descripcion: descripcion };
    let resultado;

    resultado = petition(url, method, data); // Llama al petition de global.js
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


    resultado = petition(url, method, data); // Llama al petition de global.js
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

    resultado = petition(url, method, data); // Llama al petition de global.js
    resultado.then((value) => {
        if (value.success) {
            const elementoEliminado = btnEliminar.closest(".notificacion");
            if (elementoEliminado) {
                elementoEliminado.remove();
            }

            if (listaNotificaciones && !listaNotificaciones.querySelector(".notificacion")) {
                listaNotificaciones.textContent = "No hay notificaciones.";
            }
        }
    })
}