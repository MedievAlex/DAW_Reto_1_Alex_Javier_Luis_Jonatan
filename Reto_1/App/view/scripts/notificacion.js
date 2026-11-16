const NOT_URL = "../../api/NotificacionController.php";

const btnNotificaciones1 = document.getElementById("boton-notificaciones");
const btnAgregarNotificacion = document.getElementById("btnAniadirNot");
const listaNotificaciones = document.getElementById("listaNotificaciones");
const filtroNotificaciones = document.getElementById("filtroNotificaciones");
let filtros = [];

if (filtroNotificaciones) {
    filtroNotificaciones.addEventListener("change", () => {
        aplicarFiltro();
    })
}

if (btnAgregarNotificacion) {
    btnAgregarNotificacion.addEventListener("click", () => {
        const existeNuevo = document.getElementById("elementoNuevoNotificacion");
        const hayEdicionActiva = document.querySelector(".tarjeta.editando-activo");

        const datosSesion = sessionStorage.getItem("auth_usuario");
        const usuarioSesion = datosSesion ? JSON.parse(datosSesion) : null;

        const idUsuarioSesion = usuarioSesion ? parseInt(usuarioSesion.usu_id, 10) : NaN;
        const puedeAgregar = usuarioSesion !== null && !isNaN(idUsuarioSesion) && usuarioSesion.rol === "USER";


        if (!puedeAgregar) {
            alert("No tienes una sesión válida o permisos para crear notificaciones.");
        } else {
            // Evitamos que se abran varios formularios de creación a la vez o edición a la vez
            if (!existeNuevo && !hayEdicionActiva) {
                /*
                const usuarioNuevaNot = document.createElement("input");
                usuarioNuevaNot.className = "inputNuevaNotUsuario";
                usuarioNuevaNot.type = "number";
                usuarioNuevaNot.min = "1";
                usuarioNuevaNot.placeholder = "ID de usuario (ej. 1)";
                */
                const elementoNuevo = document.createElement("article");
                elementoNuevo.classList.add("tarjeta");
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
                    const titulo = tituloNuevaNot.value.trim();
                    const descripcion = descripcionNuevaNot.value.trim();
                    const fechaRaw = fechaNuevaNot.value; // Devuelve "YYYY-MM-DDTHH:MM"
                    const estado = "PENDIENTE";

                    if (!titulo || !descripcion || !fechaRaw || isNaN(idUsuarioSesion)) {
                        alert("Por favor, rellena el título, la descripción y selecciona una fecha.");
                    } else {
                        // Convertimos "2026-10-28T10:30" a "2026-10-28 10:30:00" para PHP/MySQL
                        const fechaFormateada = fechaRaw.replace("T", " ") + ":00";
                        agregarNotificacion(idUsuarioSesion, titulo, descripcion, fechaFormateada, estado);
                    }
                });

                elementoNuevo.append(
                    tituloNuevaNot,
                    descripcionNuevaNot,
                    fechaNuevaNot,
                    btnGuardarNueva,
                    btnCancelarNueva
                );

                listaNotificaciones.prepend(elementoNuevo);
                tituloNuevaNot.focus();
            } else {
                if (hayEdicionActiva) {
                    alert("No se puede agregar una nueva notificacion mientras se edita.");
                }
            }
        }
    });
}

//Método para cargar todas las notificaciones desde el servidor
async function cargarNotificaciones() {
    if (!listaNotificaciones) {
        console.log("Notificaciones vacías.")
    } else {
        const datosSesion = sessionStorage.getItem("auth_usuario");
        const usuarioSesion = datosSesion ? JSON.parse(datosSesion) : null;

        if (btnAgregarNotificacion) {
            if (usuarioSesion && usuarioSesion.rol === "ADMIN") {
                btnAgregarNotificacion.classList.add("oculto");
            } else {
                btnAgregarNotificacion.classList.remove("oculto");
            }
        }
    }

    listaNotificaciones.textContent = "Cargando notificaciones...";

    try {
        const response = await fetch(NOT_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "No se pudieron cargar las notificaciones.");
        } else {
            // listaNotificaciones.replaceChildren();
            filtros = result.data || [];

            // Si el desplegable tiene un filtro activo, lo aplicamos; si no, mostramos todas
            aplicarFiltro();
        }

    } catch (error) {
        console.error("Error al cargar las notificaciones:", error);
        listaNotificaciones.textContent = "No se pudieron cargar las notificaciones.";
    }
}

//Esto carga las notificaciones al entrar en el modal
btnNotificaciones1.addEventListener("click", cargarNotificaciones);

async function agregarNotificacion(idUsuario, titulo, descripcion, fecha, estado) {
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

    resultado = await petition(url, method, data); // Llama al petition de global.js
    const error = Array.isArray(resultado) && resultado[0] === false;

    if (error) {
        console.warn("Error al agregar notificacion: " + resultado[0].message);
    } else {
        alert("Notificación agregada correctamente.");
        cargarNotificaciones(); // Recargar la lista de notificaciones
    }
}

async function modificarNotificacion(id, titulo, descripcion, fecha, estado) {
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

    resultado = await petition(url, method, data); // Llama al petition de global.js

    const error = Array.isArray(resultado) && resultado[0] === false;
    if (error) {
        console.warn("Error en el PUT: ", resultado[0].message);
    } else {
        alert("Notificación modificada correctamente.");
        cargarNotificaciones(); // Recargar la lista de notificaciones
    }
}

async function eliminarNotificacion(id, btnEliminar) {
    const existeNuevo = document.getElementById("elementoNuevoNotificacion");
    const hayEdicionActiva = document.querySelector(".tarjeta.editando-activo");

    if (existeNuevo || hayEdicionActiva) {
        alert("Termina de editar o crear la notificación actual antes de eliminar otra.");
    } else {
        const confirmado = window.confirm("¿Estás seguro de que quieres eliminar esta notificación?");
        if (!confirmado) {
            console.log("Eliminación cancelada.");
        } else {
            let url = NOT_URL + "?not_id=" + id;
            let method = "DELETE";
            let data = [];
            let resultado;

            resultado = await petition(url, method, data); // Llama al petition de global.js
            const error = Array.isArray(resultado) && resultado[0] === false;

            if (error) {
                console.warn("No se pudo eliminar por: " + resultado[0].message);

            } else {
                const elementoEliminado = btnEliminar.closest(".tarjeta");
                if (elementoEliminado) {
                    elementoEliminado.remove();
                    console.log("Notificacion eliminada correctamente.")
                    cargarNotificaciones();
                }

                if (listaNotificaciones && !listaNotificaciones.querySelector(".tarjeta")) {
                    listaNotificaciones.textContent = "No hay notificaciones.";
                }
            }
        }

    }


}

async function aplicarFiltro() {
    const filtroSeleccionado = filtroNotificaciones ? filtroNotificaciones.value : "";

    const estados = {
        "pendientes": "PENDIENTE",
        "en_proceso": "EN_PROCESO",
        "realizadas": "REALIZADA",
        "Pendientes": "PENDIENTE",
        "En proceso": "EN_PROCESO",
        "Realizadas": "REALIZADA"
    }

    const estadoFiltrado = estados[filtroSeleccionado] || filtroSeleccionado;
    if (!estadoFiltrado || estadoFiltrado === "Filtros" || estadoFiltrado === "TODAS") {
        cargarNotificacionesFiltradas(filtros);
    } else {
        const filtracion = filtros.filter((notificacion) => notificacion.estado === estadoFiltrado);
        cargarNotificacionesFiltradas(filtracion);
    }
}

async function cargarNotificacionesFiltradas(lista) {
    listaNotificaciones.replaceChildren();

    const datosSesion = sessionStorage.getItem("auth_usuario");
    const usuarioSesion = datosSesion ? JSON.parse(datosSesion) : null;
    const rolActual = usuarioSesion ? usuarioSesion.rol : "USER";

    if (!lista || lista.length === 0) {
        listaNotificaciones.textContent = "No hay notificaciones.";
    } else {
        // Aquí se cargan las notificaciones
        lista.forEach((notificacion) => {
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
            detalles.textContent = `${fechaLimpia} · `;

            const iconosEstado = {
                "PENDIENTE": srcPendiente,
                "EN_PROCESO": srcProceso,
                "REALIZADA": srcRealizado
            };

            const imgEstado = document.createElement("img");
            imgEstado.src = iconosEstado[notificacion.estado] || srcPendiente;
            imgEstado.alt = notificacion.estado;
            imgEstado.title = notificacion.estado; // Muestra el texto si pasas el ratón por encima
            imgEstado.classList.add("iconoEstadoNot");

            detalles.appendChild(imgEstado);

            // Botón Eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn-s");
            btnEliminar.classList.add("btn-delete");
            btnEliminar.innerHTML = '<img src="' + srcEliminar + '" alt="Eliminar notificación">';
            if (rolActual === "ADMIN") {
                btnEliminar.classList.add("oculto");
            } else {
                if (notificacion.estado !== "PENDIENTE") {
                    btnEliminar.disabled = true;
                    btnEliminar.title = "No se puede eliminar una notificación en proceso o realizada.";
                } else {
                    btnEliminar.addEventListener("click", (event) => {
                        eliminarNotificacion(notificacion_id, event.currentTarget);
                    });
                }
            }

            // Botón Modificar con estado de edición en línea
            const btnModificar = document.createElement("button");
            btnModificar.classList.add("btn-s");
            btnModificar.classList.add("btn-edit");
            btnModificar.innerHTML = '<img src="' + srcEditar + '" alt="Editar notificación">';

            // Variables para controlar la edición de ESTA tarjeta en concreto
            let editando = false;
            let inputTitulo = null;
            // let inputFecha = null;
            let inputDescripcion = null;
            let inputEstado = null;
            let btnCancelarMod = null;

            btnModificar.addEventListener("click", () => {
                if (!editando) {
                    const existeNuevo = document.getElementById("elementoNuevoNotificacion");
                    const hayEdicionActiva = document.querySelector(".tarjeta.editando-activo");

                    if (!existeNuevo && !hayEdicionActiva) {
                        elemento.classList.add("editando-activo");

                        inputEstado = document.createElement("select");
                        inputEstado.className = "inputEditarEstado";

                        const estadosPosibles = ["PENDIENTE", "EN_PROCESO", "REALIZADA"];
                        estadosPosibles.forEach((valorEstado) => {
                            const opcion = document.createElement("option");
                            opcion.textContent = valorEstado;
                            opcion.value = valorEstado;

                            inputEstado.appendChild(opcion);
                        })

                        if (rolActual === "ADMIN") {
                            detalles.replaceWith(inputEstado);
                        } else {
                            // Primer click: Convertir h3 y p en campos editables
                            inputTitulo = document.createElement("input");
                            inputTitulo.type = "text";
                            inputTitulo.value = titulo.textContent;
                            inputTitulo.className = "inputEditarTitulo";

                            inputDescripcion = document.createElement("textarea");
                            inputDescripcion.value = descripcion.textContent;
                            inputDescripcion.className = "inputEditarDescripcion";

                            // inputFecha = document.createElement("input");
                            // inputFecha.type = "datetime-local";
                            // inputFecha.value = fechaFormatoSQL;

                            // Reemplazamos los textos por los inputs en el DOM
                            titulo.replaceWith(inputTitulo);
                            descripcion.replaceWith(inputDescripcion);
                            // detalles.replaceWith(inputFecha);
                            inputTitulo.focus();
                        }

                        // Cambiamos el botón para indicar que el siguiente click guarda
                        //btnModificar.textContent = "Guardar";
                        btnModificar.textContent = "";
                        let img_guar = document.createElement("img");
                        img_guar.src = srcGuardar;
                        btnModificar.appendChild(img_guar);
                        editando = true;

                    } else {
                        alert("Termina de editar o crear la notificación actual antes de modificar otra.");
                    }
                } else {

                    // Segundo click: Recoger los nuevos valores segun el rol y guardar
                    const nuevoTitulo = inputTitulo ? inputTitulo.value.trim() : notificacion.titulo;
                    const nuevaDescripcion = inputDescripcion ? inputDescripcion.value.trim() : notificacion.descripcion;
                    //   const nuevaFecha = inputFecha ? inputFecha.value.trim() : fechaFormatoSQL;
                    const nuevoEstado = inputEstado ? inputEstado.value.trim() : notificacion.estado;

                    if (!nuevoTitulo || !nuevaDescripcion) {
                        alert("El título y la descripción no pueden estar vacíos.");
                    }

                    elemento.classList.remove("editando-activo");

                    // Llamamos a la función PUT con los datos nuevos de los inputs
                    modificarNotificacion(
                        notificacion_id,
                        nuevoTitulo,
                        nuevaDescripcion,
                        nuevoEstado,
                    );
                }
            });

            // Añadimos todo al article y a la lista
            elemento.append(btnEliminar, btnModificar, titulo, descripcion, detalles);
            listaNotificaciones.append(elemento);
        });
    }
}