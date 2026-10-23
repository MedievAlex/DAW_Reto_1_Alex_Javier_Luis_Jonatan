const NOT_URL = "../../api/NotificacionController.php";

const btnNotificaciones1 = document.getElementById("boton-notificaciones");
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

        result.data.forEach((notificacion) => {
            const notificacion_id = notificacion.not_id;

            const fechaLimpia = new Date(notificacion.fecha.date).toLocaleString();

            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btnEliminarNotificacion";
            btnEliminar.innerHTML = '<img src="../assets/icons/icon_eliminar.png" alt="Eliminar notificación">';
            btnEliminar.addEventListener("click", (event) => {
                eliminarNotificacion(notificacion_id, event.currentTarget);
            });

            const btnModificar = document.createElement("button");
            btnModificar.className = "btnModificarNotificacion";
            btnModificar.innerHTML = '<img src="../assets/icons/icon_editar.png" alt="Editar notificación">';

            const elemento = document.createElement("article");
            elemento.className = "notificacion";
            elemento.id = "elementoNotificacion";

            const titulo = document.createElement("h3");
            titulo.textContent = notificacion.titulo;

            const descripcion = document.createElement("p");
            descripcion.textContent = notificacion.descripcion;

            const detalles = document.createElement("p");
            detalles.className = "notificacionDetalles";
            detalles.textContent = `${fechaLimpia} · ${notificacion.estado}`;

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

    resultado = petition(url, method, data);
    resultado.then((value) => {
        if (value.success) {
            alert("Notificación agregada correctamente.");
            cargarNotificaciones(); // Recargar la lista de notificaciones
        }
    });
}

function modificarNotificacion(id, titulo, descripcion) {
    let url = NOT_URL + "?not_id=" + id;
    let method = "PUT";
    let data = { titulo: titulo, descripcion: descripcion };
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
            }

            if (listaNotificaciones && !listaNotificaciones.querySelector(".notificacion")) {
                listaNotificaciones.textContent = "No hay notificaciones.";
            }
        }
    })
}