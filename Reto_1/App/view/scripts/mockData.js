// [ Datos falsos para probar la generación de html ]
function mockUbicaciones() {
    let value = [];

    value = [{
        "success": false,
        "message": "Mensaje de error recibido."
    }];
    /*
    value = [
        {
            ubi_id: 1,
            ubi_nombre: "Almacén",
            ubi_descripcion: "Almacén de los equipamientos del centro."
        },
        {
            ubi_id: 2,
            ubi_nombre: "101 - Aula",
            ubi_descripcion: "Aula para el curso de Mantenimiento electrónico."
        },
        {
            ubi_id: 3,
            ubi_nombre: "102 - Aula",
            ubi_descripcion: "Aula para el curso de Integración social."
        },
        {
            ubi_id: 4,
            ubi_nombre: "201 - Aula",
            ubi_descripcion: "Aula para el curso de Desarollo de aplicaciones multiplataforma."
        },
        {
            ubi_id: 5,
            ubi_nombre: "202 - Aula",
            ubi_descripcion: "Aula para el curso de Desarollo de aplicaciones web."
        },
        {
            ubi_id: 6,
            ubi_nombre: "203 - Aula",
            ubi_descripcion: "Aula para el curso de Ciberseguridad."
        }
    ];
    */
    if (Array.isArray(value)) {
        let atributos = ["ubi_id", "ubi_nombre", "ubi_descripcion"];

        // Verifica si todos los objetos tienen todos los atributos
        let valido = value.data.every(obj =>
            atributos.every(clave => clave in obj)
        );

        if (valido) {
            tbody_ubicaciones.innerHTML = "";
            ubicaciones = ordenarUbicaciones(value.data);

            ubicaciones.forEach(ubi => {
                let ubi_id = ubi.ubi_id;
                let tr_ubi = document.createElement("tr");// Nueva Ubicacion
                tr_ubi.classList.add("aula");

                let ubi_nombre = document.createElement("td"); // Nombre
                let h3_ubi_nombre = document.createElement("h3");
                h3_ubi_nombre.classList.add("ubi_nombre");
                h3_ubi_nombre.textContent = ubi.ubi_nombre;
                ubi_nombre.appendChild(h3_ubi_nombre);
                tr_ubi.appendChild(ubi_nombre);

                let inp_ubi_nom = document.createElement("input"); // Input Nombre
                inp_ubi_nom.type = "text";
                inp_ubi_nom.value = ubi.ubi_nombre;
                inp_ubi_nom.className = "ubi-nom";

                let ubi_descripcion = document.createElement("td"); // Descripcion
                let p_ubi_descripcion = document.createElement("p");
                p_ubi_descripcion.textContent = ubi.ubi_descripcion;
                ubi_descripcion.appendChild(p_ubi_descripcion);
                tr_ubi.appendChild(ubi_descripcion);

                let inp_ubi_des = document.createElement("input"); // Input Descripcion
                inp_ubi_des.type = "text";
                inp_ubi_des.value = ubi.ubi_descripcion;
                inp_ubi_des.className = "ubi-des";

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

                    h3_ubi_nombre.replaceWith(inp_ubi_nom);
                    p_ubi_descripcion.replaceWith(inp_ubi_des);
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

                    editarUbicacion(ubi.ubi_id, inp_ubi_nom.value.trim(), inp_ubi_des.value.trim());
                });

                ubi_btn.appendChild(btn_save);

                // ---------------------------------------- Boton Eliminar
                if (ubi.ubi_nombre != "Almacén") {
                    let btn_delete = document.createElement("button");
                    btn_delete.alt = "Eliminar ubicación " + ubi.ubi_nombre + ".";
                    let img_delete = document.createElement("img");
                    img_delete.src = srcEliminar;
                    btn_delete.appendChild(img_delete);
                    btn_delete.classList.add("btn-s");
                    btn_delete.classList.add("btn-delete");

                    // [ Elimina la Ubicacion ] PENDIENTE
                    btn_delete.addEventListener("click", () => {
                        eliminarUbicacion(ubi_id);
                    });

                    verificarEquipamientos(btn_delete, ubi.ubi_id);

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
            ubiNoValido(value.message);
        }
    } else {
        ubiNoValido("[ERROR]: Formato de datos incorrecto.");
    }
}

function mockEquipamientos() {
    let value = [];

    value = [{
        "success": false,
        "message": "Mensaje de error"
    }];

    value = [
        {
            equ_id: 1,
            nombre: "Portatil 102-01",
            descripcion: "Portatil HP nº01 de curso Integración social.",
            marca: "HP",
            modelo: "HP-X45",
            categoria: "PORTATIL",
            id_ubicacion_actual: 3
        },
        {
            equ_id: 2,
            nombre: "Portatil 102-02",
            descripcion: "Portatil HP nº01 de curso Integración social.",
            marca: "HP",
            modelo: "HP-X45",
            categoria: "PORTATIL",
            id_ubicacion_actual: 3
        },
        {
            equ_id: 3,
            nombre: "Ventilador",
            descripcion: "Ventilador averiado.",
            marca: "Amazon",
            modelo: "Vent-A124",
            categoria: "OTROS",
            id_ubicacion_actual: 1
        },
        {
            equ_id: 4,
            nombre: "Portatil 202-01",
            descripcion: "Portatil ASUS nº01 de curso Desarollo de aplicaciones web.",
            marca: "ASUS",
            modelo: "ASUS Rog 450-X",
            categoria: "PORTATIL",
            id_ubicacion_actual: 5
        },
        {
            equ_id: 5,
            nombre: "Portatil 202-02",
            descripcion: "Portatil ASUS nº02 de curso Desarollo de aplicaciones web.",
            marca: "ASUS",
            modelo: "ASUS Rog 450-X",
            categoria: "PORTATIL",
            id_ubicacion_actual: 5
        },
        {
            equ_id: 6,
            nombre: "Torre 202-01",
            descripcion: "Torre de profesor de curso Desarollo de aplicaciones web.",
            marca: "HP",
            modelo: "HP-XJ11289",
            categoria: "SOBREMESA",
            id_ubicacion_actual: 5
        }
    ];

    if (Array.isArray(value)) {
        let atributos = ["id_equipamiento", "nombre", "descripcion", "marca", "modelo", "categoria", "id_ubicacion_actual"];

        // Verifica si todos los objetos tienen todos los atributos
        let valido = value.every(obj =>
            atributos.every(clave => clave in obj)
        );

        if (valido) {
            value.sort((a, b) => a.nombre.localeCompare(b.nombre));

            value.forEach(equ => {
                let art_equ = document.createElement("article"); // Nuevo Equipamiento
                art_equ.classList.add("equ");
                art_equ.classList.add("tarjeta");

                let sec_equ_inf = document.createElement("section"); // Información
                sec_equ_inf.classList.add("equ-inf");
                let img_equ_img = document.createElement("img");
                img_equ_img.classList.add("equ-img");
                img_equ_img.src = "../assets/img/categoria_" + equ.categoria.toLowerCase() + ".jpg";
                img_equ_img.alt = "Equipamiento " + equ.nombre + ".";

                art_equ.appendChild(sec_equ_inf); // Seccion de información al artículo

                let div_det = document.createElement("div"); // Detalles del Equipamiento
                div_det.classList.add("det");

                let div_equ_nom = document.createElement("div"); // Nombre
                let h3_equ_nom = document.createElement("h3");
                h3_equ_nom.textContent = equ.nombre;
                div_equ_nom.appendChild(h3_equ_nom);
                div_det.appendChild(div_equ_nom);

                let inp_equ_nom = document.createElement("input"); // Input Nombre
                inp_equ_nom.type = "text";
                inp_equ_nom.value = equ.nombre;
                inp_equ_nom.className = "equ-nom";

                let div_equ_det = document.createElement("div"); // Detalles
                let p_equ_det = document.createElement("p");
                p_equ_det.textContent = equ.marca + " - " + equ.modelo;
                div_equ_det.appendChild(p_equ_det);
                div_det.appendChild(div_equ_det);

                let inp_equ_mar = document.createElement("input"); // Input Marca
                inp_equ_mar.type = "text";
                inp_equ_mar.value = equ.marca;
                inp_equ_mar.className = "equ-mar";

                let inp_equ_mod = document.createElement("input"); // Input Modelo
                inp_equ_mod.type = "text";
                inp_equ_mod.value = equ.modelo;
                inp_equ_mod.className = "equ-mod";

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
                btn_edit.alt = "Editar campos del equipamiento " + equ.nombre + ".";
                btn_edit.appendChild(img_btn_edit);

                // [ Edita el Equipamiento selecionado ]
                btn_edit.addEventListener("click", () => {
                    btn_edit.classList.remove("visible");
                    btn_edit.classList.add("oculto");

                    btn_save.classList.remove("oculto");
                    btn_save.classList.add("visible");

                    div_equ_nom.replaceWith(inp_equ_nom);
                    div_equ_det.replaceWith(inp_equ_mar, inp_equ_mod);

                    inp_equ_nom.focus();
                });

                sec_equ_btn.appendChild(btn_edit);

                // ---------------------------------------- Boton Guardar
                let btn_save = document.createElement("button");
                btn_save.classList.add("btn-s");
                btn_save.classList.add("btn-save");
                btn_save.classList.add("oculto");
                let img_btn_save = document.createElement("img");
                img_btn_save.src = srcGuardar;
                btn_save.alt = "Guardar cambios del equipamiento " + equ.nombre + ".";
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
                btn_delete.alt = "Eliminar equipamiento " + equ.nombre + ".";
                btn_delete.appendChild(img_btn_delete);

                // [ Elimina el Equipamiento ]
                btn_delete.addEventListener("click", () => {

                });

                sec_equ_btn.appendChild(btn_delete);

                artEqu.appendChild(art_equ);
            });

        } else {
            equNoValido(value.message);
        }
    } else {
        equNoValido("Formato de datos incorrecto.");
    }
}