const PERFIL_ROLES = { ADMIN: "Administrador", USER: "Conserje" };

const perfil = {};          // referencias al DOM
let perfilUsuarios = [];    // usuarios cargados desde el servidor
let perfilSeleccionId = null;
let perfilModo = null;      // "crear" | "editar" | null (lista)
let perfilOcupado = false;  // hay una petición en curso

// ---------------------------------------- Inicio

function iniciarPerfil() {
    perfil.modal = document.getElementById("modalPerfil");

    if (perfil.modal === null) {
        return;
    }

    perfil.abrir = document.getElementById("boton-perfil");
    perfil.cerrar = perfil.modal.querySelector(".cerrar");
    perfil.contenedor = document.getElementById("perfil-contenedor");
    perfil.nombre = document.getElementById("perfil-nombre");
    perfil.usuario = document.getElementById("perfil-usuario");
    perfil.rol = document.getElementById("perfil-rol");
    perfil.btnSalir = document.getElementById("btn-cerrar-sesion");

    perfil.gestion = document.getElementById("perfil-gestion");
    perfil.mensaje = document.getElementById("perfil-mensaje");
    perfil.vistaLista = document.getElementById("perfil-vista-lista");
    perfil.lista = document.getElementById("usuarios-lista");
    perfil.plantilla = document.getElementById("plantilla-usuario");
    perfil.btnNuevo = document.getElementById("btn-usuario-nuevo");
    perfil.btnEditar = document.getElementById("btn-usuario-editar");
    perfil.btnEliminar = document.getElementById("btn-usuario-eliminar");

    perfil.vistaConfirmar = document.getElementById("perfil-vista-confirmar");
    perfil.confirmarTexto = document.getElementById("confirmar-texto");
    perfil.btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");
    perfil.btnConfirmarCancelar = document.getElementById("btn-confirmar-cancelar");

    perfil.formulario = document.getElementById("form-usuario");
    perfil.formTitulo = document.getElementById("form-usuario-titulo");
    perfil.campoId = document.getElementById("usu-id");
    perfil.campoNombre = document.getElementById("usu-nombre");
    perfil.campoApellidos = document.getElementById("usu-apellidos");
    perfil.campoUsuario = document.getElementById("usu-nombre-usuario");
    perfil.campoRol = document.getElementById("usu-rol");
    perfil.campoPassword = document.getElementById("usu-password");
    perfil.bloquePassword = document.getElementById("bloque-password");
    perfil.btnTogglePassword = document.getElementById("btn-toggle-password");
    perfil.iconoPassword = document.getElementById("icono-toggle-password");
    perfil.panelPassword = document.getElementById("panel-password");
    perfil.btnCancelar = document.getElementById("btn-usuario-cancelar");

    // Abrir y cerrar el modal
    perfil.abrir?.addEventListener("click", abrirModalPerfil);
    perfil.cerrar.addEventListener("click", cerrarModalPerfil);
    perfil.cerrar.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            cerrarModalPerfil();
        }
    });
    perfil.modal.addEventListener("click", function (evento) {
        if (evento.target === perfil.modal) {
            cerrarModalPerfil(); // clic en el fondo oscuro
        }
    });
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && modalPerfilAbierto()) {
            cerrarModalPerfil();
        }
    });

    perfil.btnSalir.addEventListener("click", salir); // salir() está en auth.js

    // Gestión de usuarios (el panel solo se muestra al ADMIN)
    perfil.lista.addEventListener("click", clicEnLista); // una sola escucha para todas las tarjetas
    perfil.lista.addEventListener("keydown", teclaEnLista); // Enter o espacio también seleccionan
    perfil.btnNuevo.addEventListener("click", function () { abrirFormulario("crear", null); });
    perfil.btnEditar.addEventListener("click", function () { abrirFormulario("editar", usuarioSeleccionado()); });
    perfil.btnEliminar.addEventListener("click", pedirConfirmacionEliminar);
    perfil.btnConfirmarEliminar.addEventListener("click", confirmarEliminar);
    perfil.btnConfirmarCancelar.addEventListener("click", volverALista);
    perfil.formulario.addEventListener("submit", guardarFormulario);
    perfil.btnCancelar.addEventListener("click", volverALista);
    perfil.btnTogglePassword.addEventListener("click", function () {
        mostrarCampoPassword(perfil.panelPassword.classList.contains("oculto"));
    });
}

// ---------------------------------------- Modal

function modalPerfilAbierto() {
    return perfil.modal.style.display === "block";
}

// Abre el modal y adapta la interfaz al rol guardado en la sesión.
function abrirModalPerfil() {
    const usuario = obtenerUsuarioSesion();

    if (usuario === null) {
        return;
    }

    const esAdmin = usuario.rol === "ADMIN";

    pintarPerfil(usuario);
    limpiarMensaje();
    perfil.gestion.classList.toggle("oculto", !esAdmin);
    perfil.contenedor.classList.toggle("perfil-admin", esAdmin);
    perfil.modal.style.display = "block";
    perfil.cerrar.focus();

    if (esAdmin) {
        volverALista();
        cargarListaUsuarios();
    }
}

function cerrarModalPerfil() {
    perfil.modal.style.display = "none";
    volverALista();
    limpiarMensaje();
    perfil.abrir?.focus();
}

// Muestra los datos del usuario de la sesión (textContent: nunca se interpreta como HTML).
function pintarPerfil(usuario) {
    perfil.nombre.textContent = usuario.nombre + " " + usuario.apellidos;
    perfil.usuario.textContent = usuario.nombre_usuario;
    perfil.rol.textContent = PERFIL_ROLES[usuario.rol] || usuario.rol;
}

// ---------------------------------------- Mensajes

function mostrarMensaje(texto, correcto = false) {
    perfil.mensaje.textContent = texto;
    perfil.mensaje.classList.toggle("perfil-ok", correcto);
    perfil.mensaje.classList.remove("oculto");
}

function limpiarMensaje() {
    perfil.mensaje.textContent = "";
    perfil.mensaje.classList.add("oculto");
}

// ---------------------------------------- Lista de usuarios

async function cargarListaUsuarios() {
    perfil.lista.setAttribute("aria-busy", "true");
    mostrarEstadoLista("Cargando usuarios...");

    let datos = [];
    let fallo = null;

    try {
        datos = await cargarUsuarios();
    } catch (error) {
        fallo = error;
    }

    perfil.lista.setAttribute("aria-busy", "false");
    perfilSeleccionId = null;

    if (fallo !== null) {
        perfilUsuarios = [];
        mostrarEstadoLista("No se han podido cargar los usuarios.");
        mostrarMensaje(fallo.message);
        actualizarBotonesBarra();
        return;
    }

    perfilUsuarios = datos;
    renderizarUsuarios();
}

// Sustituye la lista por un único texto (cargando, vacío o error).
function mostrarEstadoLista(texto) {
    const elemento = document.createElement("li");

    elemento.className = "usuarios-vacio";
    elemento.setAttribute("role", "presentation");
    elemento.textContent = texto;
    perfil.lista.replaceChildren(elemento);
}

// Dibuja una tarjeta por usuario a partir de la plantilla, con un solo volcado al DOM.
function renderizarUsuarios() {
    if (perfilUsuarios.length === 0) {
        mostrarEstadoLista("No hay usuarios.");
        actualizarBotonesBarra();
        return;
    }

    const sesion = obtenerUsuarioSesion();
    const fragmento = document.createDocumentFragment();

    for (const usuario of perfilUsuarios) {
        const nodo = perfil.plantilla.content.cloneNode(true);
        const tarjeta = nodo.querySelector(".tarjeta");
        const esPropio = sesion !== null && sesion.usu_id === usuario.usu_id;

        tarjeta.dataset.id = usuario.usu_id;
        tarjeta.querySelector(".usuario-nombre").textContent = usuario.nombre + " " + usuario.apellidos;
        tarjeta.querySelector(".usuario-login").textContent = usuario.nombre_usuario + (esPropio ? " (tú)" : "");
        tarjeta.querySelector(".usuario-rol").textContent = PERFIL_ROLES[usuario.rol] || usuario.rol;

        fragmento.appendChild(nodo);
    }

    perfil.lista.replaceChildren(fragmento);
    marcarSeleccion();
}

// Delegación de eventos: un solo listener en la lista para todas las tarjetas.
function clicEnLista(evento) {
    const tarjeta = evento.target.closest(".tarjeta");

    if (tarjeta !== null) {
        alternarSeleccion(tarjeta);
    }
}

function teclaEnLista(evento) {
    const tarjeta = evento.target.closest(".tarjeta");

    if (tarjeta !== null && (evento.key === "Enter" || evento.key === " ")) {
        evento.preventDefault();
        alternarSeleccion(tarjeta);
    }
}

function alternarSeleccion(tarjeta) {
    if (perfilOcupado) {
        return;
    }

    const id = Number(tarjeta.dataset.id);

    perfilSeleccionId = perfilSeleccionId === id ? null : id; // segundo clic: deselecciona
    marcarSeleccion();
}

// Actualiza las tarjetas sin volver a pintarlas (así no se pierde el foco del teclado).
function marcarSeleccion() {
    for (const tarjeta of perfil.lista.querySelectorAll(".tarjeta")) {
        const seleccionada = Number(tarjeta.dataset.id) === perfilSeleccionId;

        tarjeta.setAttribute("aria-selected", String(seleccionada));
    }

    actualizarBotonesBarra();
}

function usuarioSeleccionado() {
    return perfilUsuarios.find(function (usuario) {
        return usuario.usu_id === perfilSeleccionId;
    }) || null;
}

// Editar y eliminar solo tienen sentido con un usuario seleccionado.
function actualizarBotonesBarra() {
    const sinSeleccion = usuarioSeleccionado() === null;

    perfil.btnEditar.disabled = sinSeleccion;
    perfil.btnEliminar.disabled = sinSeleccion;
}

// Bloquea los botones del panel mientras hay una petición en curso (evita envíos duplicados).
function bloquearGestion(bloquear) {
    perfilOcupado = bloquear;

    for (const boton of perfil.gestion.querySelectorAll("button")) {
        boton.disabled = bloquear;
    }

    if (!bloquear) {
        actualizarBotonesBarra();
    }
}

// ---------------------------------------- Formulario (crear / editar)

function volverALista() {
    perfilModo = null;
    perfil.formulario.classList.add("oculto");
    perfil.vistaConfirmar.classList.add("oculto");
    perfil.vistaLista.classList.remove("oculto");
}

function abrirFormulario(modo, usuario) {
    if (modo === "editar" && usuario === null) {
        return;
    }

    const crear = modo === "crear";

    perfilModo = modo;
    perfil.formulario.reset();
    perfil.campoId.value = crear ? "" : usuario.usu_id;
    perfil.formTitulo.textContent = crear ? "Nuevo usuario" : "Editar usuario";
    perfil.campoPassword.required = crear; // al editar es opcional: sin ella se mantiene la actual

    if (!crear) {
        perfil.campoNombre.value = usuario.nombre;
        perfil.campoApellidos.value = usuario.apellidos;
        perfil.campoUsuario.value = usuario.nombre_usuario;
        perfil.campoRol.value = usuario.rol;
    }

    perfil.btnTogglePassword.classList.toggle("oculto", crear);
    mostrarCampoPassword(crear); // al crear siempre visible; al editar, plegada

    limpiarMensaje();
    perfil.vistaLista.classList.add("oculto");
    perfil.formulario.classList.remove("oculto");
    perfil.campoNombre.focus();
}

// Despliega o pliega el campo de contraseña y cambia el icono del desplegable.
function mostrarCampoPassword(mostrar) {
    perfil.panelPassword.classList.toggle("oculto", !mostrar);
    perfil.btnTogglePassword.setAttribute("aria-expanded", String(mostrar));
    perfil.iconoPassword.src = mostrar ? srcCerrar : srcAbrir;

    if (!mostrar) {
        perfil.campoPassword.value = "";
    }
}

async function guardarFormulario(evento) {
    evento.preventDefault();

    if (perfilOcupado || perfilModo === null) {
        return;
    }

    const datos = {
        usu_id: Number(perfil.campoId.value),
        nombre: perfil.campoNombre.value.trim(),
        apellidos: perfil.campoApellidos.value.trim(),
        nombre_usuario: perfil.campoUsuario.value.trim(),
        rol: perfil.campoRol.value,
        password: perfil.campoPassword.value
    };

    // required admite espacios en blanco: se comprueba también sin ellos
    if (datos.nombre === "" || datos.apellidos === "" || datos.nombre_usuario === "" || datos.rol === "") {
        mostrarMensaje("Rellena todos los campos obligatorios.");
        return;
    }

    const crear = perfilModo === "crear";

    let guardado;

    bloquearGestion(true);

    try {
        guardado = crear ? await crearUsuario(datos) : await editarUsuario(datos);
    } catch (error) {
        mostrarMensaje(error.message); // mensaje del servidor: 409 nombre repetido, 400 datos no válidos...
        return;
    } finally {
        bloquearGestion(false);
    }

    // Se usa la respuesta del servidor para actualizar la lista, sin recargarla
    if (crear) {
        perfilUsuarios.push(guardado);
    } else {
        perfilUsuarios = perfilUsuarios.map(function (usuario) {
            return usuario.usu_id === guardado.usu_id ? guardado : usuario;
        });
    }

    const sesion = obtenerUsuarioSesion();

    if (sesion !== null && sesion.usu_id === guardado.usu_id) {
        guardarUsuario(guardado); // auth.js: mantiene al día los datos del perfil propio
        pintarPerfil(guardado);
    }

    perfilSeleccionId = guardado.usu_id;
    volverALista();
    renderizarUsuarios();
    mostrarMensaje(crear ? "Usuario creado correctamente." : "Usuario editado correctamente.", true);
}

// ---------------------------------------- Eliminar

// Paso 1: muestra la confirmación dentro del propio modal (no se usa el confirm() del navegador).
function pedirConfirmacionEliminar() {
    const usuario = usuarioSeleccionado();

    if (usuario === null || perfilOcupado) {
        return;
    }

    const sesion = obtenerUsuarioSesion();

    if (sesion !== null && sesion.usu_id === usuario.usu_id) {
        mostrarMensaje("No puedes eliminar tu propio usuario.");
        return;
    }

    limpiarMensaje();
    perfil.confirmarTexto.textContent = "¿Seguro que quieres eliminar a " + usuario.nombre + " " + usuario.apellidos + "? Esta acción no se puede deshacer.";
    perfil.vistaLista.classList.add("oculto");
    perfil.vistaConfirmar.classList.remove("oculto");
    perfil.btnConfirmarCancelar.focus(); // por defecto, la opción segura
}

// Paso 2: el usuario ha confirmado.
async function confirmarEliminar() {
    const usuario = usuarioSeleccionado();

    if (usuario === null || perfilOcupado) {
        return;
    }

    bloquearGestion(true);

    try {
        await eliminarUsuario(usuario.usu_id);
    } catch (error) {
        volverALista();
        mostrarMensaje(error.message); // p. ej. 409: tiene notificaciones o es el único Administrador
        return;
    } finally {
        bloquearGestion(false);
    }

    perfilUsuarios = perfilUsuarios.filter(function (u) {
        return u.usu_id !== usuario.usu_id;
    });
    perfilSeleccionId = null;
    volverALista();
    renderizarUsuarios();
    mostrarMensaje("Usuario eliminado correctamente.", true);
}

document.addEventListener("DOMContentLoaded", iniciarPerfil);