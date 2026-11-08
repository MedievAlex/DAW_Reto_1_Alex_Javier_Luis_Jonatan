// El módulo no publica nombres globales que puedan colisionar con otros scripts.
(() => {
    const categorias = {
        PORTATIL: { nombre: "Portátil", imagen: "categoria_portatil.jpg" },
        SOBREMESA: { nombre: "Sobremesa", imagen: "categoria_sobremesa.jpg" },
        PERIFERICO: { nombre: "Periférico", imagen: "categoria_perifericos.jpg" },
        AUDIOVISUAL: { nombre: "Audiovisual", imagen: "categoria_audiovisual.jpg" },
        OTROS: { nombre: "Otros", imagen: "categoria_otros.jpg" }
    };

    const lista = document.getElementById("lista-equipamientos");
    const mensaje = document.getElementById("mensaje-equipamientos");
    const filtroCategoria = document.getElementById("filtro-categoria-equipamientos");
    let cargandoInventario = false;
    let rolConfirmado = null;
    let guardandoEquipo = false;
    const acciones = document.getElementById("acciones-equipamientos");
    const botonNuevo = document.getElementById("nuevo-equipamiento");
    const modalAlta = document.getElementById("modal-alta-equipamiento");
    const formularioAlta = document.getElementById("form-alta-equipamiento");
    const mensajeAlta = document.getElementById("mensaje-alta-equipamiento");
    const confirmacionAlta = document.getElementById("confirmacion-alta-equipamiento");
    const camposAlta = ["nombre", "descripcion", "marca", "modelo", "categoria"];
    let fondoModal = [];
    let modoFormulario = "crear";
    let idEquipoEditado = null;
    let equiposPorId = new Map();
    let origenFormulario = null;
    const modalEliminar = document.getElementById("modal-eliminar-equipamiento");
    const mensajeEliminar = document.getElementById("mensaje-eliminar-equipamiento");
    const cancelarEliminar = document.getElementById("cancelar-eliminar-equipamiento");
    const confirmarEliminar = document.getElementById("confirmar-eliminar-equipamiento");
    let equipoAEliminar = null;
    let origenEliminar = null;
    let fondoEliminar = [];
    const modalTraslado = document.getElementById("modal-trasladar-equipamiento");
    const formularioTraslado = document.getElementById("form-trasladar-equipamiento");
    const destinoTraslado = document.getElementById("destino-trasladar-equipamiento");
    const mensajeTraslado = document.getElementById("mensaje-trasladar-equipamiento");
    const cancelarTraslado = document.getElementById("cancelar-trasladar-equipamiento");
    const confirmarTraslado = document.getElementById("confirmar-trasladar-equipamiento");
    let equipoATrasladar = null;
    let origenTraslado = null;
    let fondoTraslado = [];
    let ubicacionesPorId = new Map();
    let destinosTraslado = new Map();
    let consultaTraslado = 0;
    const modalHistorico = document.getElementById("modal-historico-equipamiento");
    const mensajeHistorico = document.getElementById("mensaje-historico-equipamiento");
    const contenidoHistorico = document.getElementById("contenido-historico-equipamiento");
    const tablaHistorico = document.getElementById("tabla-historico-equipamiento");
    const registrosHistorico = document.getElementById("registros-historico-equipamiento");
    const cerrarHistorico = document.getElementById("cerrar-historico-equipamiento");
    let origenHistorico = null;
    let fondoHistorico = [];
    let consultaHistorico = 0;

    function actualizarPermisoAlta() {
        acciones.classList.toggle("oculto", rolConfirmado !== "ADMIN");
        botonNuevo.disabled = guardandoEquipo || cargandoInventario || rolConfirmado !== "ADMIN";
        lista.querySelectorAll('[data-accion="editar"], [data-accion="eliminar"]').forEach(boton => {
            boton.hidden = rolConfirmado !== "ADMIN";
            boton.disabled = guardandoEquipo || cargandoInventario || rolConfirmado !== "ADMIN";
        });
        lista.querySelectorAll('[data-accion="trasladar"]').forEach(boton => {
            boton.hidden = rolConfirmado !== "USER";
            boton.disabled = guardandoEquipo || cargandoInventario || rolConfirmado !== "USER";
        });
        lista.querySelectorAll('[data-accion="historico"]').forEach(boton => {
            boton.hidden = !["ADMIN", "USER"].includes(rolConfirmado);
            boton.disabled = guardandoEquipo || cargandoInventario || boton.hidden;
        });
    }

    function mostrarMensajeHistorico(texto, error = false) {
        mensajeHistorico.textContent = texto;
        mensajeHistorico.setAttribute("role", error ? "alert" : "status");
        mensajeHistorico.setAttribute("aria-live", error ? "assertive" : "polite");
    }

    // Interpretamos el calendario recibido sin inventar una zona horaria ni normalizar fechas inválidas.
    function interpretarEntradaHistorico(valor) {
        const texto = typeof valor === "string" ? valor : valor?.date;
        if (typeof texto !== "string") return null;
        const partes = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?$/.exec(texto);
        if (!partes) return null;
        const [anio, mes, dia, hora, minuto, segundo] = partes.slice(1, 7).map(Number);
        const calendario = new Date(0);
        calendario.setUTCFullYear(anio, mes - 1, dia);
        calendario.setUTCHours(hora, minuto, segundo, 0);
        if (anio < 1 || calendario.getUTCFullYear() !== anio || calendario.getUTCMonth() !== mes - 1 ||
            calendario.getUTCDate() !== dia || calendario.getUTCHours() !== hora ||
            calendario.getUTCMinutes() !== minuto || calendario.getUTCSeconds() !== segundo) return null;
        return {
            orden: partes.slice(1, 7).join("") + (partes[7] ?? "").padEnd(6, "0"),
            texto: `${partes[3]}/${partes[2]}/${partes[1]} ${partes[4]}:${partes[5]}:${partes[6]}`
        };
    }

    function representarHistorico(registros, ubicaciones, idEquipo) {
        const filas = registros.map(registro => {
            if (!registro || registro.his_equipamiento !== idEquipo ||
                !Number.isInteger(registro.his_ubicacion) || registro.his_ubicacion <= 0 ||
                !/^[1-9]\d*$/.test(String(registro.his_id))) {
                throw new Error("El histórico recibido tiene un formato inesperado o no corresponde al equipo seleccionado.");
            }
            return { registro, entrada: interpretarEntradaHistorico(registro.his_fecha_ini) };
        });
        filas.sort((a, b) => {
            const fechaA = a.entrada?.orden ?? "99999999999999999999";
            const fechaB = b.entrada?.orden ?? "99999999999999999999";
            return fechaA.localeCompare(fechaB) || String(a.registro.his_id).localeCompare(String(b.registro.his_id), "es", { numeric: true });
        });
        const fragmento = document.createDocumentFragment();
        for (const { registro, entrada } of filas) {
            const fila = document.createElement("tr");
            const valores = [
                ubicaciones.get(registro.his_ubicacion) ?? "Ubicación no disponible",
                entrada?.texto ?? "No disponible",
                "No disponible"
            ];
            // fecha_fin puede ser una fecha artificial generada al convertir NULL en PHP.
            // No basta con comprobar que su formato sea válido para mostrarla como salida real.
            for (const valor of valores) {
                const celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            }
            fragmento.appendChild(fila);
        }
        registrosHistorico.replaceChildren(fragmento);
        tablaHistorico.hidden = filas.length === 0;
        return {
            entradasInvalidas: filas.some(fila => !fila.entrada),
            ubicacionesAusentes: filas.some(fila => !ubicaciones.has(fila.registro.his_ubicacion))
        };
    }

    function detectarInconsistenciaHistorico(registros, equipoActual, incidencias) {
        // La ausencia de discrepancias no demuestra que estén registrados todos los movimientos.
        return incidencias.entradasInvalidas || incidencias.ubicacionesAusentes ||
            (equipoActual !== null && !registros.some(registro => registro.his_ubicacion === equipoActual.id_ubicacion_actual));
    }

    async function abrirHistorico(equipo, origen) {
        if (!["ADMIN", "USER"].includes(rolConfirmado) || guardandoEquipo || cargandoInventario ||
            !modalHistorico.hidden || !modalAlta.hidden || !modalEliminar.hidden || !modalTraslado.hidden) return;
        const consultaActual = ++consultaHistorico;
        origenHistorico = origen;
        document.getElementById("equipo-historico-equipamiento").textContent = equipo.nombre;
        const ubicacionActual = document.getElementById("ubicacion-actual-historico-equipamiento");
        const aviso = document.getElementById("aviso-historico-equipamiento");
        ubicacionActual.textContent = "Consultando ubicación actual…";
        aviso.textContent = "";
        aviso.hidden = true;
        registrosHistorico.replaceChildren();
        tablaHistorico.hidden = true;
        mostrarMensajeHistorico("Cargando histórico…");
        contenidoHistorico.setAttribute("aria-busy", "true");
        modalHistorico.hidden = false;
        modalHistorico.style.display = "block";
        fondoHistorico = [...document.querySelectorAll("header, nav, footer, #inventario-equipamientos, #modalAjustes, #modalNotificaciones, #modalPerfil, #modalAula, #modal-alta-equipamiento, #modal-eliminar-equipamiento, #modal-trasladar-equipamiento")]
            .map(elemento => ({ elemento, anterior: elemento.inert }));
        fondoHistorico.forEach(({ elemento }) => { elemento.inert = true; });
        cerrarHistorico.focus();
        try {
            // La API ajena de histórico carece de autorización: comprobamos la sesión en el frontend,
            // sin presentar esa comprobación como protección del endpoint en el servidor.
            const usuarios = await consultarApi("LoginController.php");
            if (consultaActual !== consultaHistorico || modalHistorico.hidden) return;
            if (!["ADMIN", "USER"].includes(usuarios[0]?.rol)) {
                rolConfirmado = null;
                actualizarPermisoAlta();
                throw new Error("La sesión no permite consultar el histórico.");
            }
            rolConfirmado = usuarios[0].rol;
            guardarUsuario(usuarios[0]);
            actualizarPermisoAlta();
            const [historico, ubicaciones, consultaEquipo] = await Promise.allSettled([
                consultarApi("Historico_UbicacionController.php?his_equipamiento=" + encodeURIComponent(equipo.id_equipamiento)),
                consultarApi("UbicacionController.php").then(prepararUbicaciones),
                consultarApi("EquipamientoController.php?id_equipamiento=" + encodeURIComponent(equipo.id_equipamiento)).then(equipos => {
                    validarEquipos(equipos);
                    if (equipos.length !== 1 || equipos[0].id_equipamiento !== equipo.id_equipamiento) {
                        throw new Error("No se ha podido consultar el equipo seleccionado.");
                    }
                    return equipos[0];
                })
            ]);
            if (consultaActual !== consultaHistorico || modalHistorico.hidden) return;
            const nombres = ubicaciones.status === "fulfilled" ? ubicaciones.value : new Map();
            const equipoActual = consultaEquipo.status === "fulfilled" ? consultaEquipo.value : null;
            if (equipoActual !== null) document.getElementById("equipo-historico-equipamiento").textContent = equipoActual.nombre;
            ubicacionActual.textContent = "Ubicación actual: " +
                (equipoActual !== null ? nombres.get(equipoActual.id_ubicacion_actual) ?? "No disponible" : "No disponible");
            if (historico.status === "rejected") throw historico.reason;
            const incidencias = representarHistorico(historico.value, nombres, equipo.id_equipamiento);
            if (detectarInconsistenciaHistorico(historico.value, equipoActual, incidencias)) {
                aviso.textContent = "El histórico puede estar incompleto. Algunos datos no están disponibles";
                aviso.hidden = false;
            }
            let texto = historico.value.length === 0 ? "No hay movimientos registrados para este equipo."
                : `Movimientos registrados: ${historico.value.length}.`;
            if (ubicaciones.status === "rejected") texto += " No se han podido cargar los nombres de las ubicaciones.";
            if (consultaEquipo.status === "rejected") texto += " No se ha podido consultar la ubicación actual.";
            if (incidencias.entradasInvalidas) texto += " Los movimientos sin fecha de entrada disponible aparecen al final.";
            mostrarMensajeHistorico(texto, ubicaciones.status === "rejected" || consultaEquipo.status === "rejected");
        } catch (error) {
            if (consultaActual === consultaHistorico && !modalHistorico.hidden) {
                registrosHistorico.replaceChildren();
                tablaHistorico.hidden = true;
                if (ubicacionActual.textContent === "Consultando ubicación actual…") ubicacionActual.textContent = "Ubicación actual: No disponible";
                mostrarMensajeHistorico("No se ha podido cargar el histórico. Cierra esta ventana e inténtalo de nuevo.", true);
            }
        } finally {
            if (consultaActual === consultaHistorico) contenidoHistorico.setAttribute("aria-busy", "false");
        }
    }

    function cerrarConsultaHistorico() {
        ++consultaHistorico;
        modalHistorico.hidden = true;
        modalHistorico.style.display = "none";
        contenidoHistorico.setAttribute("aria-busy", "false");
        fondoHistorico.forEach(({ elemento, anterior }) => { elemento.inert = anterior; });
        fondoHistorico = [];
        if (origenHistorico?.isConnected && !origenHistorico.disabled && !origenHistorico.hidden) origenHistorico.focus();
        else document.getElementById("titulo-equipamientos").focus();
    }

    cerrarHistorico.addEventListener("click", cerrarConsultaHistorico);
    modalHistorico.addEventListener("click", evento => { if (evento.target === modalHistorico) cerrarConsultaHistorico(); });
    modalHistorico.addEventListener("keydown", evento => {
        if (evento.key === "Escape") { evento.preventDefault(); cerrarConsultaHistorico(); }
        if (evento.key !== "Tab") return;
        const primero = tablaHistorico.hidden ? cerrarHistorico : tablaHistorico;
        if (evento.shiftKey && document.activeElement === primero) { evento.preventDefault(); cerrarHistorico.focus(); }
        else if (!evento.shiftKey && document.activeElement === cerrarHistorico) { evento.preventDefault(); primero.focus(); }
    });

    function mostrarMensajeTraslado(texto, error = false) {
        mensajeTraslado.textContent = texto;
        mensajeTraslado.setAttribute("role", error ? "alert" : "status");
        mensajeTraslado.setAttribute("aria-live", error ? "assertive" : "polite");
    }

    async function abrirTraslado(equipo, origen) {
        if (rolConfirmado !== "USER" || guardandoEquipo || cargandoInventario || !modalTraslado.hidden) return;
        equipoATrasladar = equipo;
        origenTraslado = origen;
        destinosTraslado = new Map();
        const consultaActual = ++consultaTraslado;
        formularioTraslado.reset();
        destinoTraslado.replaceChildren(new Option("Selecciona una ubicación", ""));
        destinoTraslado.disabled = true;
        destinoTraslado.removeAttribute("aria-invalid");
        confirmarTraslado.disabled = true;
        document.getElementById("datos-trasladar-equipamiento").textContent =
            `${equipo.nombre}. Ubicación actual: ${ubicacionesPorId.get(equipo.id_ubicacion_actual) ?? "Ubicación no disponible"}.`;
        mostrarMensajeTraslado("Cargando ubicaciones disponibles…");
        modalTraslado.hidden = false;
        modalTraslado.style.display = "block";
        formularioTraslado.setAttribute("aria-busy", "true");
        fondoTraslado = [...document.querySelectorAll("header, nav, footer, #inventario-equipamientos, #modalAjustes, #modalNotificaciones, #modalPerfil, #modalAula, #modal-alta-equipamiento, #modal-eliminar-equipamiento")]
            .map(elemento => ({ elemento, anterior: elemento.inert }));
        fondoTraslado.forEach(({ elemento }) => { elemento.inert = true; });
        cancelarTraslado.focus();
        try {
            const ubicaciones = prepararUbicaciones(await consultarApi("UbicacionController.php"));
            // Cancelar o abrir otro equipo invalida las respuestas anteriores.
            if (consultaActual !== consultaTraslado || modalTraslado.hidden) return;
            destinosTraslado = ubicaciones;
            document.getElementById("datos-trasladar-equipamiento").textContent =
                `${equipo.nombre}. Ubicación actual: ${ubicaciones.get(equipo.id_ubicacion_actual) ?? "Ubicación no disponible"}.`;
            for (const [id, nombre] of ubicaciones) {
                destinoTraslado.appendChild(new Option(nombre, String(id)));
            }
            destinoTraslado.disabled = ubicaciones.size === 0;
            confirmarTraslado.disabled = ubicaciones.size === 0 || rolConfirmado !== "USER";
            mostrarMensajeTraslado(ubicaciones.size === 0 ? "No hay ubicaciones disponibles para el traslado."
                : "Selecciona el destino y pulsa Confirmar traslado. Si eliges la ubicación actual, no se enviará ningún cambio.");
        } catch (error) {
            if (consultaActual === consultaTraslado && !modalTraslado.hidden) mostrarMensajeTraslado(error.message, true);
        } finally {
            if (consultaActual === consultaTraslado) formularioTraslado.setAttribute("aria-busy", "false");
        }
    }

    function cerrarTraslado(confirmado = false) {
        if (guardandoEquipo && !confirmado) return;
        ++consultaTraslado;
        modalTraslado.hidden = true;
        modalTraslado.style.display = "none";
        formularioTraslado.setAttribute("aria-busy", "false");
        fondoTraslado.forEach(({ elemento, anterior }) => { elemento.inert = anterior; });
        fondoTraslado = [];
        equipoATrasladar = null;
        destinosTraslado.clear();
        if (origenTraslado?.isConnected && !origenTraslado.disabled) origenTraslado.focus();
        else document.getElementById("titulo-equipamientos").focus();
    }

    async function confirmarTrasladoEquipo(evento) {
        evento.preventDefault();
        if (guardandoEquipo || cargandoInventario || modalTraslado.hidden) return;
        if (rolConfirmado !== "USER") {
            mostrarMensajeTraslado("Solo USER puede trasladar equipamientos.", true);
            return;
        }
        const idEquipo = equipoATrasladar?.id_equipamiento;
        const idDestino = Number(destinoTraslado.value);
        if (!Number.isInteger(idEquipo) || idEquipo <= 0 || !Number.isInteger(idDestino) || !destinosTraslado.has(idDestino)) {
            destinoTraslado.setAttribute("aria-invalid", "true");
            mostrarMensajeTraslado("Selecciona una ubicación válida del catálogo recibido.", true);
            if (!destinoTraslado.disabled) destinoTraslado.focus();
            return;
        }
        destinoTraslado.removeAttribute("aria-invalid");
        if (idDestino === equipoATrasladar.id_ubicacion_actual) {
            mostrarMensajeTraslado("El equipo ya se encuentra en esa ubicación. No se han enviado cambios.");
            return;
        }
        const nombre = equipoATrasladar.nombre;
        guardandoEquipo = true;
        actualizarPermisoAlta();
        destinoTraslado.disabled = true;
        confirmarTraslado.disabled = true;
        cancelarTraslado.disabled = true;
        formularioTraslado.setAttribute("aria-busy", "true");
        mostrarMensajeTraslado("Trasladando equipamiento…");
        try {
            let respuesta;
            try {
                respuesta = await fetch(new URL("EquipamientoController.php", API_BASE), {
                    method: "PATCH",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ id_equipamiento: idEquipo, id_nueva_ubicacion: idDestino })
                });
            } catch (error) {
                throw new Error("Se ha perdido la conexión. No se puede confirmar el traslado. Consulta el inventario antes de repetirlo.");
            }
            if (respuesta.status === 401) {
                rolConfirmado = null;
                irALogin();
                throw new Error("La sesión ha caducado. Inicia sesión de nuevo.");
            }
            if (respuesta.status === 403) {
                rolConfirmado = null;
                throw new Error("Tu sesión no tiene permiso para trasladar equipamientos.");
            }
            if (respuesta.status === 404) throw new Error("El equipo o la ubicación de destino ya no existe. Cancela y actualiza el inventario.");
            if (respuesta.status >= 500) throw new Error("Error del servidor. No se ha confirmado el traslado. Consulta el inventario antes de repetirlo.");
            let resultado;
            try { resultado = await respuesta.json(); }
            catch (error) { throw new Error("La respuesta no permite confirmar el traslado. Consulta el inventario antes de repetirlo."); }
            if (respuesta.status === 400) throw new Error(typeof resultado?.message === "string" ? resultado.message : "Los datos del traslado no son válidos.");
            if (respuesta.status !== 200 || resultado?.success !== true) throw new Error("No se ha confirmado el traslado. Consulta el inventario antes de repetirlo.");
            // El servidor también puede confirmar que no hubo cambios por otro traslado simultáneo.
            const confirmacion = `${nombre}: ${typeof resultado.message === "string" ? resultado.message : "Operación de traslado confirmada."}`;
            cerrarTraslado(true);
            confirmacionAlta.textContent = confirmacion;
            confirmacionAlta.classList.remove("oculto");
            const actualizado = await cargarInventario();
            if (!actualizado) confirmacionAlta.textContent = confirmacion + " No se ha podido actualizar el inventario. Recarga la página; no repitas el traslado.";
            if (actualizado) origenTraslado = lista.querySelector(`[data-id="${idEquipo}"] [data-accion="trasladar"]`);
        } catch (error) {
            mostrarMensajeTraslado(error.message, true);
        } finally {
            guardandoEquipo = false;
            formularioTraslado.setAttribute("aria-busy", "false");
            cancelarTraslado.disabled = false;
            destinoTraslado.disabled = rolConfirmado !== "USER" || destinosTraslado.size === 0;
            confirmarTraslado.disabled = destinoTraslado.disabled;
            actualizarPermisoAlta();
            if (!modalTraslado.hidden) cancelarTraslado.focus();
            else if (origenTraslado?.isConnected && !origenTraslado.disabled) origenTraslado.focus();
            else document.getElementById("titulo-equipamientos").focus();
        }
    }

    formularioTraslado.addEventListener("submit", confirmarTrasladoEquipo);
    cancelarTraslado.addEventListener("click", () => cerrarTraslado());
    modalTraslado.addEventListener("click", evento => { if (evento.target === modalTraslado) cerrarTraslado(); });
    modalTraslado.addEventListener("keydown", evento => {
        if (evento.key === "Escape") { evento.preventDefault(); cerrarTraslado(); }
        if (evento.key !== "Tab") return;
        const controles = [...modalTraslado.querySelectorAll("select, button")].filter(control => !control.disabled);
        if (!controles.length) { evento.preventDefault(); return; }
        const primero = controles[0], ultimo = controles[controles.length - 1];
        if (evento.shiftKey && document.activeElement === primero) { evento.preventDefault(); ultimo.focus(); }
        else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primero.focus(); }
    });

    function abrirEliminacion(equipo, origen) {
        if (rolConfirmado !== "ADMIN" || guardandoEquipo || cargandoInventario || !modalAlta.hidden || !modalEliminar.hidden) return;
        equipoAEliminar = equipo;
        origenEliminar = origen;
        document.getElementById("aviso-eliminar-equipamiento").textContent =
            `¿Quieres eliminar «${equipo.nombre}»? La eliminación es permanente y también eliminará todo su histórico de ubicaciones asociado. Esta acción no se puede deshacer.`;
        mensajeEliminar.textContent = "";
        mensajeEliminar.classList.add("oculto");
        confirmarEliminar.disabled = false;
        modalEliminar.hidden = false;
        modalEliminar.style.display = "block";
        fondoEliminar = [...document.querySelectorAll("header, nav, footer, #inventario-equipamientos, #modalAjustes, #modalNotificaciones, #modalPerfil, #modalAula, #modal-alta-equipamiento")]
            .map(elemento => ({ elemento, anterior: elemento.inert }));
        fondoEliminar.forEach(({ elemento }) => { elemento.inert = true; });
        cancelarEliminar.focus();
    }

    function cerrarEliminacion(confirmada = false) {
        if (guardandoEquipo && !confirmada) return;
        modalEliminar.hidden = true;
        modalEliminar.style.display = "none";
        fondoEliminar.forEach(({ elemento, anterior }) => { elemento.inert = anterior; });
        fondoEliminar = [];
        equipoAEliminar = null;
        if (origenEliminar?.isConnected && !origenEliminar.disabled) origenEliminar.focus();
        else document.getElementById("titulo-equipamientos").focus();
    }

    function mostrarErrorEliminacion(texto) {
        mensajeEliminar.textContent = texto;
        mensajeEliminar.classList.remove("oculto");
    }

    async function eliminarEquipoConfirmado() {
        if (guardandoEquipo || cargandoInventario || modalEliminar.hidden) return;
        if (rolConfirmado !== "ADMIN") {
            mostrarErrorEliminacion("Solo ADMIN puede eliminar equipamientos.");
            return;
        }
        const id = equipoAEliminar?.id_equipamiento;
        if (!Number.isInteger(id) || id <= 0) {
            mostrarErrorEliminacion("No se ha podido identificar el equipo que quieres eliminar.");
            return;
        }
        const nombre = equipoAEliminar.nombre;
        guardandoEquipo = true;
        actualizarPermisoAlta();
        cancelarEliminar.disabled = true;
        confirmarEliminar.disabled = true;
        modalEliminar.setAttribute("aria-busy", "true");
        mostrarErrorEliminacion("Eliminando equipamiento…");
        try {
            let respuesta;
            try {
                const url = new URL("EquipamientoController.php", API_BASE);
                url.searchParams.set("id_equipamiento", String(id));
                respuesta = await fetch(url, {
                    method: "DELETE",
                    credentials: "same-origin",
                    headers: { Accept: "application/json" }
                });
            } catch (error) {
                throw new Error("Se ha perdido la conexión. No se puede confirmar la eliminación. Cancela y consulta el inventario antes de repetir la operación.");
            }
            if (respuesta.status === 401) {
                rolConfirmado = null;
                irALogin();
                throw new Error("La sesión ha caducado. Inicia sesión de nuevo.");
            }
            if (respuesta.status === 403) {
                rolConfirmado = null;
                throw new Error("Tu sesión no tiene permiso para eliminar equipamientos.");
            }
            if (respuesta.status === 404) {
                throw new Error("El equipo ya no existe. Cancela y actualiza el inventario.");
            }
            if (respuesta.status >= 500) {
                throw new Error("Error del servidor. No se ha confirmado la eliminación. Consulta el inventario antes de repetirla.");
            }
            let resultado;
            try { resultado = await respuesta.json(); }
            catch (error) {
                throw new Error("La respuesta no permite confirmar la eliminación. Consulta el inventario antes de repetirla.");
            }
            if (respuesta.status === 400) {
                throw new Error(typeof resultado?.message === "string" ? resultado.message : "El identificador del equipo no es válido.");
            }
            if (respuesta.status !== 200 || resultado?.success !== true) {
                throw new Error("No se ha confirmado la eliminación. Consulta el inventario antes de repetirla.");
            }
            cerrarEliminacion(true);
            const confirmacion = `Equipamiento «${nombre}» eliminado correctamente.`;
            confirmacionAlta.textContent = confirmacion;
            confirmacionAlta.classList.remove("oculto");
            const actualizado = await cargarInventario();
            if (!actualizado) {
                confirmacionAlta.textContent = confirmacion + " No se ha podido actualizar el inventario. Recarga la página; no repitas la eliminación.";
            }
        } catch (error) {
            mostrarErrorEliminacion(error.message);
        } finally {
            guardandoEquipo = false;
            modalEliminar.setAttribute("aria-busy", "false");
            cancelarEliminar.disabled = false;
            confirmarEliminar.disabled = rolConfirmado !== "ADMIN";
            actualizarPermisoAlta();
            if (modalEliminar.hidden) document.getElementById("titulo-equipamientos").focus();
            else cancelarEliminar.focus();
        }
    }

    cancelarEliminar.addEventListener("click", () => cerrarEliminacion());
    confirmarEliminar.addEventListener("click", eliminarEquipoConfirmado);
    modalEliminar.addEventListener("click", evento => { if (evento.target === modalEliminar) cerrarEliminacion(); });
    modalEliminar.addEventListener("keydown", evento => {
        if (evento.key === "Escape") { evento.preventDefault(); cerrarEliminacion(); }
        if (evento.key !== "Tab") return;
        if (guardandoEquipo) { evento.preventDefault(); return; }
        const ultimo = confirmarEliminar.disabled ? cancelarEliminar : confirmarEliminar;
        if (evento.shiftKey && document.activeElement === cancelarEliminar) { evento.preventDefault(); ultimo.focus(); }
        else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); cancelarEliminar.focus(); }
    });

    function mostrarErrorAlta(texto) {
        mensajeAlta.textContent = texto;
        mensajeAlta.classList.remove("oculto");
    }

    function limpiarErroresAlta() {
        mensajeAlta.textContent = "";
        mensajeAlta.classList.add("oculto");
        for (const campo of camposAlta) {
            formularioAlta.elements[campo].removeAttribute("aria-invalid");
            const error = document.getElementById("error-alta-" + campo);
            error.textContent = "";
            error.hidden = true;
        }
    }

    function abrirAlta(equipo = null, origen = botonNuevo) {
        if (rolConfirmado !== "ADMIN" || guardandoEquipo || cargandoInventario) return;
        modoFormulario = equipo === null ? "crear" : "editar";
        idEquipoEditado = equipo === null ? null : equipo.id_equipamiento;
        origenFormulario = origen;
        formularioAlta.reset();
        limpiarErroresAlta();
        if (equipo !== null) {
            for (const campo of camposAlta) formularioAlta.elements[campo].value = equipo[campo];
        }
        document.getElementById("titulo-alta-equipamiento").textContent = equipo === null
            ? "Nuevo equipamiento" : "Editar equipamiento";
        document.getElementById("ayuda-alta-equipamiento").textContent = equipo === null
            ? "Todos los campos son obligatorios. Los equipos nuevos se asignan automáticamente al Almacén."
            : "Todos los campos son obligatorios. La edición de estos datos no cambia la ubicación actual.";
        document.getElementById("cerrar-alta-equipamiento").setAttribute("aria-label", "Cerrar formulario de equipamiento");
        const guardar = document.getElementById("guardar-alta-equipamiento");
        const etiquetaGuardar = equipo === null ? "Guardar nuevo equipamiento" : "Guardar cambios del equipamiento";
        guardar.setAttribute("aria-label", etiquetaGuardar);
        guardar.title = etiquetaGuardar;
        modalAlta.hidden = false;
        modalAlta.style.display = "block";
        // Aislamos el diálogo sin cambiar permanentemente los elementos comunes.
        fondoModal = [...document.querySelectorAll("header, nav, footer, #inventario-equipamientos, #modalAjustes, #modalNotificaciones, #modalPerfil, #modalAula")]
            .map(elemento => ({ elemento, anterior: elemento.inert }));
        fondoModal.forEach(({ elemento }) => { elemento.inert = true; });
        formularioAlta.elements.nombre.focus();
    }

    function cerrarAlta(confirmada = false) {
        if (guardandoEquipo && !confirmada) return;
        modalAlta.style.display = "none";
        modalAlta.hidden = true;
        fondoModal.forEach(({ elemento, anterior }) => { elemento.inert = anterior; });
        fondoModal = [];
        formularioAlta.reset();
        limpiarErroresAlta();
        if (origenFormulario?.isConnected && !origenFormulario.disabled) origenFormulario.focus();
        else document.getElementById("titulo-equipamientos").focus();
    }

    function validarAlta() {
        limpiarErroresAlta();
        const datos = {};
        let primerError = null;
        const limites = { nombre: 120, descripcion: 255, marca: 100, modelo: 100 };
        // Sintaxis decimal y científica que PHP reconoce con is_numeric().
        const numero = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
        for (const campo of camposAlta) {
            const entrada = formularioAlta.elements[campo];
            const valor = entrada.value.trim();
            datos[campo] = valor;
            let texto = "";
            if (valor === "") texto = "Este campo es obligatorio.";
            else if (campo === "categoria" && !Object.hasOwn(categorias, valor)) texto = "Selecciona una categoría válida.";
            else if (limites[campo] && Array.from(valor).length > limites[campo]) texto = `El máximo es de ${limites[campo]} caracteres.`;
            else if ((campo === "nombre" || campo === "marca") && numero.test(valor)) texto = "No puede ser un valor exclusivamente numérico.";
            if (texto) {
                const error = document.getElementById("error-alta-" + campo);
                error.textContent = texto;
                error.hidden = false;
                entrada.setAttribute("aria-invalid", "true");
                primerError ??= entrada;
            }
        }
        if (primerError) {
            mostrarErrorAlta("Revisa los campos indicados. No se ha enviado el formulario.");
            primerError.focus();
            return null;
        }
        return datos;
    }

    function bloquearAlta(bloquear) {
        guardandoEquipo = bloquear;
        formularioAlta.setAttribute("aria-busy", String(bloquear));
        modalAlta.querySelectorAll("input, textarea, select, button").forEach(control => { control.disabled = bloquear; });
        actualizarPermisoAlta();
    }

    async function enviarAlta(evento) {
        evento.preventDefault();
        if (guardandoEquipo || modalAlta.hidden) return;
        if (rolConfirmado !== "ADMIN") {
            mostrarErrorAlta("Solo ADMIN puede crear o editar equipamientos.");
            return;
        }
        const datos = validarAlta();
        if (!datos) return;
        const esEdicion = modoFormulario === "editar";
        const idOperacion = idEquipoEditado;
        if (esEdicion) {
            if (!Number.isInteger(idOperacion) || idOperacion <= 0) {
                mostrarErrorAlta("No se ha podido identificar el equipo que quieres editar.");
                return;
            }
            datos.id_equipamiento = idOperacion;
        }
        bloquearAlta(true);
        mensajeAlta.classList.remove("oculto");
        mensajeAlta.textContent = "Guardando equipamiento…";
        try {
            let respuesta;
            try {
                respuesta = await fetch(new URL("EquipamientoController.php", API_BASE), {
                    method: esEdicion ? "PUT" : "POST",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify(datos)
                });
            } catch (error) {
                throw new Error("Se ha perdido la conexión. No se puede confirmar si se guardó el equipo. Consulta el inventario antes de repetir la operación.");
            }
            if (respuesta.status === 401) {
                rolConfirmado = null;
                actualizarPermisoAlta();
                irALogin();
                throw new Error("La sesión ha caducado. Inicia sesión de nuevo.");
            }
            if (respuesta.status === 403) {
                rolConfirmado = null;
                actualizarPermisoAlta();
                throw new Error("El servidor no permite guardar equipamientos con tu sesión actual.");
            }
            let resultado;
            try { resultado = await respuesta.json(); }
            catch (error) {
                throw new Error("La respuesta no permite confirmar el guardado. Consulta el inventario antes de repetir la operación.");
            }
            if (respuesta.status === 400) {
                throw new Error(typeof resultado?.message === "string" ? resultado.message : "Los datos del equipo no son válidos.");
            }
            if (respuesta.status === 404 && esEdicion) {
                throw new Error("El equipo ya no existe. Cancela y actualiza el inventario.");
            }
            if (respuesta.status !== (esEdicion ? 200 : 201) || resultado?.success !== true) {
                throw new Error("El servidor no ha confirmado el guardado. Comprueba el inventario antes de repetir la operación.");
            }
            cerrarAlta(true);
            const fueraDelFiltro = filtroCategoria.value !== "" && filtroCategoria.value !== datos.categoria;
            const textoConfirmacion = esEdicion ? "Equipamiento editado correctamente." : "Equipamiento creado correctamente.";
            confirmacionAlta.textContent = textoConfirmacion +
                (fueraDelFiltro ? " No aparece en la lista porque pertenece a otra categoría. Se conserva el filtro seleccionado." : "");
            confirmacionAlta.classList.remove("oculto");
            const actualizado = await cargarInventario();
            if (!actualizado) confirmacionAlta.textContent = textoConfirmacion + " No se ha podido actualizar el inventario. Recarga la página; no repitas la operación.";
            if (esEdicion && actualizado) {
                origenFormulario = lista.querySelector(`[data-id="${idOperacion}"] [data-accion="editar"]`);
            }
        } catch (error) {
            mostrarErrorAlta(error.message);
        } finally {
            bloquearAlta(false);
            if (modalAlta.hidden) {
                if (origenFormulario?.isConnected && !origenFormulario.disabled) origenFormulario.focus();
                else document.getElementById("titulo-equipamientos").focus();
            }
            else if (!modalAlta.hidden) formularioAlta.elements.nombre.focus();
        }
    }

    botonNuevo.addEventListener("click", () => abrirAlta());
    lista.addEventListener("click", evento => {
        const boton = evento.target.closest('[data-accion="editar"], [data-accion="eliminar"], [data-accion="trasladar"], [data-accion="historico"]');
        if (!boton || !lista.contains(boton)) return;
        const equipo = equiposPorId.get(Number(boton.closest("[data-id]").dataset.id));
        if (!equipo) return;
        if (boton.dataset.accion === "historico") {
            abrirHistorico(equipo, boton);
            return;
        }
        if (boton.dataset.accion === "trasladar") {
            if (rolConfirmado === "USER") abrirTraslado(equipo, boton);
            return;
        }
        if (rolConfirmado !== "ADMIN") return;
        if (boton.dataset.accion === "editar") abrirAlta(equipo, boton);
        else abrirEliminacion(equipo, boton);
    });
    document.getElementById("cerrar-alta-equipamiento").addEventListener("click", () => cerrarAlta());
    document.getElementById("cancelar-alta-equipamiento").addEventListener("click", () => cerrarAlta());
    formularioAlta.addEventListener("submit", enviarAlta);
    modalAlta.addEventListener("click", evento => { if (evento.target === modalAlta) cerrarAlta(); });
    modalAlta.addEventListener("keydown", evento => {
        if (evento.key === "Escape") { evento.preventDefault(); cerrarAlta(); }
        if (evento.key !== "Tab") return;
        const controles = [...modalAlta.querySelectorAll("button, input, textarea, select")].filter(control => !control.disabled);
        if (controles.length === 0) { evento.preventDefault(); return; }
        const primero = controles[0];
        const ultimo = controles[controles.length - 1];
        if (evento.shiftKey && document.activeElement === primero) { evento.preventDefault(); ultimo.focus(); }
        else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primero.focus(); }
    });

    function mostrarMensaje(texto, esError = false) {
        mensaje.textContent = texto;
        mensaje.setAttribute("role", esError ? "alert" : "status");
        mensaje.setAttribute("aria-live", esError ? "assertive" : "polite");
    }

    // Solo consultas GET. La sesión PHP viaja con las cookies del mismo origen.
    async function consultarApi(archivo) {
        let respuesta;
        try {
            respuesta = await fetch(new URL(archivo, API_BASE), {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store",
                headers: { Accept: "application/json" }
            });
        } catch (error) {
            throw new Error("No se ha podido conectar con el servidor. Comprueba la conexión y vuelve a cargar la página.");
        }

        if (respuesta.status === 401) {
            irALogin();
            throw new Error("La sesión ha caducado. Debes iniciar sesión de nuevo.");
        }
        if (respuesta.status === 403) {
            throw new Error("No tienes permiso para consultar estos datos.");
        }
        if (respuesta.status >= 500) {
            throw new Error("El servidor no ha podido completar la consulta. Inténtalo de nuevo más tarde.");
        }

        let resultado;
        try {
            resultado = await respuesta.json();
        } catch (error) {
            throw new Error("El servidor no ha devuelto una respuesta JSON válida.");
        }
        if (!respuesta.ok || resultado?.success !== true) {
            throw new Error("No se ha podido completar la consulta solicitada.");
        }
        if (!Array.isArray(resultado.data)) {
            throw new Error("Los datos recibidos no tienen el formato esperado.");
        }
        return resultado.data;
    }

    function validarEquipos(equipos) {
        const textos = ["nombre", "descripcion", "marca", "modelo", "categoria"];
        if (!equipos.every(equipo => equipo &&
            Number.isInteger(equipo.id_equipamiento) && equipo.id_equipamiento > 0 &&
            Number.isInteger(equipo.id_ubicacion_actual) && equipo.id_ubicacion_actual > 0 &&
            textos.every(campo => typeof equipo[campo] === "string") &&
            Object.hasOwn(categorias, equipo.categoria))) {
            throw new Error("El inventario recibido contiene datos con un formato inesperado.");
        }
    }

    function prepararUbicaciones(ubicaciones) {
        const nombres = new Map();
        for (const ubicacion of ubicaciones) {
            if (!ubicacion || !Number.isInteger(ubicacion.ubi_id) || ubicacion.ubi_id <= 0 ||
                typeof ubicacion.ubi_nombre !== "string" || ubicacion.ubi_nombre.trim() === "") {
                throw new Error("Las ubicaciones recibidas no tienen el formato esperado.");
            }
            nombres.set(ubicacion.ubi_id, ubicacion.ubi_nombre);
        }
        return nombres;
    }

    function crearTarjeta(equipo, ubicaciones) {
        const tarjeta = document.createElement("li");
        tarjeta.className = "tarjeta equipamiento-tarjeta";
        tarjeta.dataset.id = equipo.id_equipamiento;

        const imagen = document.createElement("img");
        imagen.className = "equipamiento-imagen";
        imagen.src = "../assets/img/" + categorias[equipo.categoria].imagen;
        imagen.alt = ""; // La categoría ya está escrita en los detalles.
        imagen.loading = "lazy";
        imagen.addEventListener("error", () => { imagen.hidden = true; }, { once: true });

        const informacion = document.createElement("div");
        informacion.className = "equipamiento-informacion";
        const nombre = document.createElement("h3");
        nombre.textContent = equipo.nombre;
        const detalles = document.createElement("dl");
        detalles.className = "equipamiento-detalles";
        const campos = [
            ["Marca", equipo.marca],
            ["Modelo", equipo.modelo],
            ["Categoría", categorias[equipo.categoria].nombre],
            ["Ubicación actual", ubicaciones.get(equipo.id_ubicacion_actual) ?? "Ubicación no disponible"]
        ];
        for (const [etiqueta, valor] of campos) {
            const campo = document.createElement("div");
            const termino = document.createElement("dt");
            const contenido = document.createElement("dd");
            termino.textContent = etiqueta;
            contenido.textContent = valor;
            campo.append(termino, contenido);
            detalles.appendChild(campo);
        }
        informacion.append(nombre, detalles);
        tarjeta.append(imagen, informacion);
        if (rolConfirmado === "ADMIN") {
            const accionesTarjeta = document.createElement("div");
            accionesTarjeta.className = "equipamiento-acciones-tarjeta";
            const editar = document.createElement("button");
            editar.type = "button";
            editar.className = "btn-texto btn-edit";
            editar.dataset.accion = "editar";
            editar.setAttribute("aria-label", "Editar " + equipo.nombre);
            const icono = document.createElement("img");
            icono.src = "../assets/icons/icon_editar.png";
            icono.alt = "";
            editar.append(icono, document.createTextNode("Editar"));
            accionesTarjeta.appendChild(editar);
            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.className = "btn-texto btn-delete";
            eliminar.dataset.accion = "eliminar";
            eliminar.setAttribute("aria-label", "Eliminar " + equipo.nombre);
            const iconoEliminar = document.createElement("img");
            iconoEliminar.src = "../assets/icons/icon_eliminar.png";
            iconoEliminar.alt = "";
            eliminar.append(iconoEliminar, document.createTextNode("Eliminar"));
            accionesTarjeta.appendChild(eliminar);
            tarjeta.appendChild(accionesTarjeta);
        }
        if (rolConfirmado === "USER") {
            const accionesTarjeta = document.createElement("div");
            accionesTarjeta.className = "equipamiento-acciones-tarjeta";
            const trasladar = document.createElement("button");
            trasladar.type = "button";
            trasladar.className = "btn-texto";
            trasladar.dataset.accion = "trasladar";
            trasladar.textContent = "Trasladar";
            trasladar.setAttribute("aria-label", "Trasladar " + equipo.nombre);
            accionesTarjeta.appendChild(trasladar);
            tarjeta.appendChild(accionesTarjeta);
        }
        if (["ADMIN", "USER"].includes(rolConfirmado)) {
            const accionesTarjeta = tarjeta.querySelector(".equipamiento-acciones-tarjeta");
            const historico = document.createElement("button");
            historico.type = "button";
            historico.className = "btn-texto";
            historico.dataset.accion = "historico";
            historico.textContent = "Ver histórico";
            historico.setAttribute("aria-label", "Ver histórico de " + equipo.nombre);
            accionesTarjeta.appendChild(historico);
        }
        return tarjeta;
    }

    async function cargarInventario() {
        // Bloqueamos el selector durante la consulta para no mezclar respuestas.
        if (cargandoInventario) {
            return;
        }
        const categoriaSeleccionada = filtroCategoria.value;
        if (categoriaSeleccionada !== "" && !Object.hasOwn(categorias, categoriaSeleccionada)) {
            mostrarMensaje("Selecciona una categoría válida.", true);
            return;
        }
        cargandoInventario = true;
        rolConfirmado = null;
        actualizarPermisoAlta();
        filtroCategoria.disabled = true;
        lista.setAttribute("aria-busy", "true");
        lista.replaceChildren();
        equiposPorId.clear();
        mostrarMensaje("Comprobando la sesión y preparando el inventario…");
        try {
            // exigirSesion() no devuelve el usuario ni propaga fallos de conexión.
            // Confirmamos aquí la sesión antes de consultar el catálogo de ubicaciones.
            const usuarios = await consultarApi("LoginController.php");
            const usuario = usuarios[0];
            if (!usuario || !["ADMIN", "USER"].includes(usuario.rol)) {
                throw new Error("La sesión no contiene un rol permitido para consultar el inventario.");
            }
            guardarUsuario(usuario);
            rolConfirmado = usuario.rol;
            mostrarMensaje("Cargando equipamientos y ubicaciones…");

            const rutaEquipos = categoriaSeleccionada === "" ? "EquipamientoController.php"
                : "EquipamientoController.php?categoria=" + encodeURIComponent(categoriaSeleccionada);

            // Un fallo de ubicaciones no convierte un inventario válido en una lista vacía.
            const [consultaEquipos, consultaUbicaciones] = await Promise.allSettled([
                consultarApi(rutaEquipos),
                consultarApi("UbicacionController.php").then(prepararUbicaciones)
            ]);
            if (consultaEquipos.status === "rejected") {
                throw consultaEquipos.reason;
            }
            const equipos = consultaEquipos.value;
            validarEquipos(equipos);
            equiposPorId = new Map(equipos.map(equipo => [equipo.id_equipamiento, equipo]));
            const ubicaciones = consultaUbicaciones.status === "fulfilled"
                ? consultaUbicaciones.value : new Map();
            ubicacionesPorId = ubicaciones;
            const fragmento = document.createDocumentFragment();
            for (const equipo of equipos) {
                fragmento.appendChild(crearTarjeta(equipo, ubicaciones));
            }
            lista.replaceChildren(fragmento);

            const nombreCategoria = categoriaSeleccionada === "" ? "Todas las categorías"
                : categorias[categoriaSeleccionada].nombre;
            const resumen = equipos.length === 0
                ? (categoriaSeleccionada === "" ? "No hay equipamientos registrados."
                    : `No hay equipamientos en la categoría ${nombreCategoria}.`)
                : `${nombreCategoria}. Equipamientos mostrados: ${equipos.length}.`;
            if (consultaUbicaciones.status === "rejected") {
                mostrarMensaje(resumen + " No se han podido consultar las ubicaciones. " +
                    consultaUbicaciones.reason.message, true);
            } else if (equipos.some(equipo => !ubicaciones.has(equipo.id_ubicacion_actual))) {
                mostrarMensaje(resumen + " Hay equipos cuya ubicación no aparece en el catálogo recibido.", true);
            } else {
                mostrarMensaje(resumen);
            }
            return true;
        } catch (error) {
            mostrarMensaje(error.message + " Puedes seleccionar otra categoría o volver a cargar la página para reintentar.", true);
            return false;
        } finally {
            lista.setAttribute("aria-busy", "false");
            filtroCategoria.disabled = false;
            cargandoInventario = false;
            actualizarPermisoAlta();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        // Solo aceptamos los valores exactos del enum; una URL inválida muestra todos.
        const categoriaUrl = new URLSearchParams(window.location.search).get("categoria");
        filtroCategoria.value = categoriaUrl !== null && Object.hasOwn(categorias, categoriaUrl)
            ? categoriaUrl : "";
        filtroCategoria.addEventListener("change", () => {
            confirmacionAlta.textContent = "";
            confirmacionAlta.classList.add("oculto");
            cargarInventario();
        });
        if (haySesion()) {
            cargarInventario();
        } else {
            lista.setAttribute("aria-busy", "false");
            mostrarMensaje("Debes iniciar sesión para consultar el inventario.");
            irALogin();
        }
    });
})();
