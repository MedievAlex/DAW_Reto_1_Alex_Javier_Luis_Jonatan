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
    perfil.titulo = document.getElementById("perfil-titulo");
    perfil.campos = document.getElementById("perfil-campos");
    perfil.nombre = document.getElementById("perfil-nombre");
    perfil.apellidos = document.getElementById("perfil-apellidos");
    perfil.usuario = document.getElementById("perfil-usuario");
    perfil.mensajePerfil = document.getElementById("perfil-propio-mensaje");
    perfil.acciones = document.getElementById("perfil-acciones");
    perfil.btnPerfilEditar = document.getElementById("btn-perfil-editar");
    perfil.formPerfil = document.getElementById("form-perfil-propio");
    perfil.campoPerfilNombre = document.getElementById("perfil-edit-nombre");
    perfil.campoPerfilApellidos = document.getElementById("perfil-edit-apellidos");
    perfil.campoPerfilUsuario = document.getElementById("perfil-edit-usuario");
    perfil.campoPerfilPassword = document.getElementById("perfil-edit-password");
    perfil.btnPerfilVerPassword = document.getElementById("btn-perfil-pwd-ver");
    perfil.iconoPerfilVerPassword = document.getElementById("icono-perfil-pwd-ver");
    perfil.btnPerfilGuardar = document.getElementById("btn-perfil-guardar");
    perfil.btnPerfilCancelar = document.getElementById("btn-perfil-cancelar");
    perfil.btnSalir = document.getElementById("btn-cerrar-sesion");
    perfil.contenido = perfil.modal.querySelector(".modalContenido");
    perfil.btnPassword = document.getElementById("btn-cambiar-password");
    perfil.iconoCambiarPassword = document.getElementById("icono-cambiar-password");
    perfil.formPassword = document.getElementById("form-password");
    perfil.campoPasswordNueva = document.getElementById("pwd-nueva");
    perfil.btnVerPassword = document.getElementById("btn-pwd-ver");
    perfil.iconoVerPassword = document.getElementById("icono-pwd-ver");
    perfil.mensajePassword = document.getElementById("password-mensaje");
    perfil.btnPasswordGuardar = document.getElementById("btn-password-guardar");
    perfil.btnPasswordCancelar = document.getElementById("btn-password-cancelar");

    perfil.gestion = document.getElementById("perfil-gestion");
    perfil.mensaje = document.getElementById("perfil-mensaje");
    perfil.vistaLista = document.getElementById("perfil-vista-lista");
    perfil.lista = document.getElementById("usuarios-lista");
    perfil.plantilla = document.getElementById("plantilla-usuario");
    perfil.btnNuevo = document.getElementById("btn-usuario-nuevo");
    perfil.btnEditar = document.getElementById("btn-usuario-editar");
    perfil.btnEliminar = document.getElementById("btn-usuario-eliminar");
    perfil.buscador = document.getElementById("usuarios-buscar");
    perfil.filtroRol = document.getElementById("usuarios-filtro-rol");

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

    perfil.btnPerfilEditar.addEventListener("click", alternarFormularioPerfil);
    perfil.formPerfil.addEventListener("submit", guardarPerfil);
    perfil.btnPerfilCancelar.addEventListener("click", ocultarFormularioPerfil);
    perfil.btnPerfilVerPassword.addEventListener("click", function () {
        mostrarPasswordPerfil(perfil.campoPerfilPassword.type === "password");
    });

    perfil.btnPassword.addEventListener("click", alternarFormularioPassword);
    perfil.formPassword.addEventListener("submit", guardarPassword);
    perfil.btnPasswordCancelar.addEventListener("click", ocultarFormularioPassword);
    perfil.btnVerPassword.addEventListener("click", function () {
        mostrarPasswordNueva(perfil.campoPasswordNueva.type === "password");
    });

    // Gestión de usuarios (el panel solo se muestra al ADMIN)
    perfil.lista.addEventListener("click", clicEnLista); // una sola escucha para todas las tarjetas
    perfil.lista.addEventListener("keydown", teclaEnLista); // Enter o espacio también seleccionan
    perfil.buscador.addEventListener("input", renderizarUsuarios);
    perfil.filtroRol.addEventListener("change", renderizarUsuarios);
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
    ocultarFormularioPerfil();
    ocultarFormularioPassword();
    perfil.gestion.classList.toggle("oculto", !esAdmin);
    perfil.contenedor.classList.toggle("perfil-admin", esAdmin);
    perfil.contenido.classList.toggle("perfil-compacto", !esAdmin);
    perfil.modal.style.display = "block";
    perfil.cerrar.focus();

    if (esAdmin) {
        perfil.buscador.value = "";
        perfil.filtroRol.value = "";
        volverALista();
        cargarListaUsuarios();
    }
}

function cerrarModalPerfil() {
    perfil.modal.style.display = "none";
    volverALista();
    ocultarFormularioPerfil();
    ocultarFormularioPassword();
    limpiarMensaje();
    perfil.abrir?.focus();
}

// Muestra los datos del usuario de la sesión (textContent: nunca se interpreta como HTML).
function pintarPerfil(usuario) {
    perfil.titulo.textContent = "Perfil: " + (PERFIL_ROLES[usuario.rol] || usuario.rol);
    perfil.nombre.textContent = usuario.nombre;
    perfil.apellidos.textContent = usuario.apellidos;
    perfil.usuario.textContent = usuario.nombre_usuario;
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

function usuariosVisibles() {
    const sesion = obtenerUsuarioSesion();
    const texto = perfil.buscador.value.trim().toLowerCase();
    const rol = perfil.filtroRol.value;

    return perfilUsuarios.filter(function (usuario) {
        if (sesion !== null && sesion.usu_id === usuario.usu_id) {
            return false;
        }

        if (rol !== "" && usuario.rol !== rol) {
            return false;
        }

        return usuario.nombre_usuario.toLowerCase().includes(texto);
    });
}

// Dibuja una tarjeta por usuario a partir de la plantilla, con un solo volcado al DOM.
function renderizarUsuarios() {
    const visibles = usuariosVisibles();

    if (!visibles.some(function (usuario) { return usuario.usu_id === perfilSeleccionId; })) {
        perfilSeleccionId = null;
    }

    if (visibles.length === 0) {
        const filtrando = perfil.buscador.value.trim() !== "" || perfil.filtroRol.value !== "";

        mostrarEstadoLista(filtrando ? "Ningún usuario coincide con la búsqueda." : "No hay usuarios.");
        actualizarBotonesBarra();
        return;
    }

    const sesion = obtenerUsuarioSesion();
    const fragmento = document.createDocumentFragment();

    for (const usuario of visibles) {
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

// ---------------------------------------- Editar mi perfil

function alternarFormularioPerfil() {
    if (!perfil.formPerfil.classList.contains("oculto")) {
        ocultarFormularioPerfil();
        return;
    }

    const sesion = obtenerUsuarioSesion();

    if (sesion === null) {
        return;
    }

    ocultarFormularioPassword(); // solo un formulario abierto a la vez
    limpiarMensajePerfil();
    perfil.campoPerfilNombre.value = sesion.nombre;
    perfil.campoPerfilApellidos.value = sesion.apellidos;
    perfil.campoPerfilUsuario.value = sesion.nombre_usuario;
    perfil.campos.classList.add("oculto");
    perfil.formPerfil.classList.remove("oculto");
    perfil.btnPerfilEditar.setAttribute("aria-expanded", "true");
    actualizarAccionesPerfil(); // desaparecen editar y cambiar contraseña
    perfil.formPerfil.scrollIntoView({ behavior: "smooth", block: "nearest" }); // que se vea dentro del modal
    perfil.campoPerfilNombre.focus({ preventScroll: true });
}

function ocultarFormularioPerfil() {
    perfil.formPerfil.reset();
    mostrarPasswordPerfil(false);
    perfil.formPerfil.classList.add("oculto");
    perfil.campos.classList.remove("oculto");
    perfil.btnPerfilEditar.setAttribute("aria-expanded", "false");
    limpiarMensajePerfil();
    actualizarAccionesPerfil(); // vuelven a aparecer si no hay otro formulario abierto
}

// La fila de acciones (editar y cambiar contraseña) solo se ve cuando no hay ningún formulario abierto:
// al abrir uno, se sustituye por sus botones Guardar y Cancelar.
function actualizarAccionesPerfil() {
    const hayFormularioAbierto = !perfil.formPerfil.classList.contains("oculto") ||
        !perfil.formPassword.classList.contains("oculto");

    perfil.acciones.classList.toggle("oculto", hayFormularioAbierto);
}

// Muestra u oculta la contraseña del formulario de editar y cambia el icono del ojo.
function mostrarPasswordPerfil(mostrar) {
    const texto = mostrar ? "Ocultar contraseña" : "Mostrar contraseña";

    perfil.campoPerfilPassword.type = mostrar ? "text" : "password";
    perfil.iconoPerfilVerPassword.src = mostrar ? srcVisible : srcOculto;
    perfil.btnPerfilVerPassword.setAttribute("aria-pressed", String(mostrar));
    perfil.btnPerfilVerPassword.setAttribute("aria-label", texto);
    perfil.btnPerfilVerPassword.title = texto;
}

// El servidor responde 409 si el nombre de usuario ya lo tiene otra persona.
function mensajeErrorPerfil(mensaje) {
    if (/ya existe|duplic|already|exists|en uso|409/i.test(mensaje)) {
        return "Ese nombre de usuario ya existe. Elige otro.";
    }

    return mensaje;
}

function mostrarMensajePerfil(texto, correcto = false) {
    perfil.mensajePerfil.textContent = texto;
    perfil.mensajePerfil.classList.toggle("perfil-ok", correcto);
    perfil.mensajePerfil.classList.remove("oculto");
}

function limpiarMensajePerfil() {
    perfil.mensajePerfil.textContent = "";
    perfil.mensajePerfil.classList.add("oculto");
}

async function guardarPerfil(evento) {
    evento.preventDefault();

    if (perfil.btnPerfilGuardar.disabled) {
        return;
    }

    const sesion = obtenerUsuarioSesion();

    if (sesion === null) {
        return;
    }

    const datos = {
        nombre: perfil.campoPerfilNombre.value.trim(),
        apellidos: perfil.campoPerfilApellidos.value.trim(),
        nombre_usuario: perfil.campoPerfilUsuario.value.trim()
    };
    const passwordNueva = perfil.campoPerfilPassword.value; // opcional: vacía = se mantiene la actual

    // required admite espacios en blanco: se comprueba también sin ellos
    if (datos.nombre === "" || datos.apellidos === "" || datos.nombre_usuario === "") {
        mostrarMensajePerfil("Rellena nombre, apellidos y usuario.");
        return;
    }

    if (passwordNueva !== "" && (passwordNueva.length < 8 || passwordNueva.length > 72)) {
        mostrarMensajePerfil("La contraseña debe tener de 8 a 72 caracteres.");
        perfil.campoPerfilPassword.focus();
        return;
    }

    const cambiaPerfil = datos.nombre !== sesion.nombre || datos.apellidos !== sesion.apellidos || datos.nombre_usuario !== sesion.nombre_usuario;
    const cambiaPassword = passwordNueva !== "";

    // Sin cambios: no hace falta llamar al servidor
    if (!cambiaPerfil && !cambiaPassword) {
        ocultarFormularioPerfil();
        return;
    }

    perfil.btnPerfilGuardar.disabled = true;

    // Paso 1: nombre, apellidos y usuario (si el usuario ya existe, se para aquí y no se toca la contraseña)
    if (cambiaPerfil) {
        let guardado;

        try {
            guardado = await editarPerfilPropio(datos);
        } catch (error) {
            mostrarMensajePerfil(mensajeErrorPerfil(error.message)); // p. ej. 409: el nombre de usuario ya existe
            perfil.campoPerfilUsuario.focus();
            perfil.btnPerfilGuardar.disabled = false;
            return;
        }

        guardarUsuario(guardado); // auth.js: mantiene al día los datos de la sesión
        pintarPerfil(guardado);

        perfilUsuarios = perfilUsuarios.map(function (usuario) {
            return usuario.usu_id === guardado.usu_id ? guardado : usuario;
        });
    }

    // Paso 2: contraseña nueva (solo si se ha escrito)
    if (cambiaPassword) {
        try {
            await cambiarPasswordPropia(passwordNueva);
        } catch (error) {
            perfil.btnPerfilGuardar.disabled = false;
            perfil.campoPerfilPassword.value = "";
            mostrarMensajePerfil((cambiaPerfil ? "Perfil guardado, pero no se pudo cambiar la contraseña: " : "") + error.message);
            return;
        }
    }

    perfil.btnPerfilGuardar.disabled = false;
    ocultarFormularioPerfil();

    if (cambiaPerfil && cambiaPassword) {
        mostrarMensajePerfil("Perfil y contraseña editados correctamente.", true);
    } else if (cambiaPassword) {
        mostrarMensajePerfil("Contraseña cambiada correctamente.", true);
    } else {
        mostrarMensajePerfil("Perfil editado correctamente.", true);
    }
}

// ---------------------------------------- Cambiar contraseña

function alternarFormularioPassword() {
    if (perfil.formPassword.classList.contains("oculto")) {
        ocultarFormularioPerfil(); // solo un formulario abierto a la vez: así todo cabe en el modal
        perfil.formPassword.classList.remove("oculto");
        perfil.btnPassword.setAttribute("aria-expanded", "true");
        perfil.iconoCambiarPassword.src = srcCerrar;
        actualizarAccionesPerfil(); // desaparecen editar y cambiar contraseña
        perfil.formPassword.scrollIntoView({ behavior: "smooth", block: "nearest" }); // que se vea dentro del modal
        perfil.campoPasswordNueva.focus({ preventScroll: true });
    } else {
        ocultarFormularioPassword();
    }
}

function ocultarFormularioPassword() {
    perfil.formPassword.reset();
    mostrarPasswordNueva(false);
    perfil.formPassword.classList.add("oculto");
    perfil.btnPassword.setAttribute("aria-expanded", "false");
    perfil.iconoCambiarPassword.src = srcAbrir;
    limpiarMensajePassword();
    actualizarAccionesPerfil(); // vuelven a aparecer si no hay otro formulario abierto
}

// Muestra u oculta la contraseña nueva y cambia el icono del ojo.
function mostrarPasswordNueva(mostrar) {
    const texto = mostrar ? "Ocultar contraseña" : "Mostrar contraseña";

    perfil.campoPasswordNueva.type = mostrar ? "text" : "password";
    perfil.iconoVerPassword.src = mostrar ? srcVisible : srcOculto;
    perfil.btnVerPassword.setAttribute("aria-pressed", String(mostrar));
    perfil.btnVerPassword.setAttribute("aria-label", texto);
    perfil.btnVerPassword.title = texto;
}

function mostrarMensajePassword(texto, correcto = false) {
    perfil.mensajePassword.textContent = texto;
    perfil.mensajePassword.classList.toggle("perfil-ok", correcto);
    perfil.mensajePassword.classList.remove("oculto");
}

function limpiarMensajePassword() {
    perfil.mensajePassword.textContent = "";
    perfil.mensajePassword.classList.add("oculto");
}

async function guardarPassword(evento) {
    evento.preventDefault();

    if (perfil.btnPasswordGuardar.disabled) {
        return;
    }

    const nueva = perfil.campoPasswordNueva.value;

    if (nueva === "") {
        mostrarMensajePassword("Indica la contraseña nueva.");
        return;
    }

    if (nueva.length < 8 || nueva.length > 72) {
        mostrarMensajePassword("La contraseña debe tener de 8 a 72 caracteres.");
        return;
    }

    perfil.btnPasswordGuardar.disabled = true;

    try {
        await cambiarPasswordPropia(nueva);
    } catch (error) {
        mostrarMensajePassword(error.message);
        return;
    } finally {
        perfil.btnPasswordGuardar.disabled = false;
    }

    ocultarFormularioPassword();
    mostrarMensajePerfil("Contraseña cambiada correctamente.", true);
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