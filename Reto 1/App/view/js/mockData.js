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
        let valido = value.every(obj =>
            atributos.every(clave => clave in obj)
        );

        if (valido) {
            value.sort((a, b) => a.ubi_nombre.localeCompare(b.ubi_nombre));

            value.forEach(ubi => {
                let tr_ubi = document.createElement("tr");// Nueva Ubicacion

                let ubi_nombre = document.createElement("td"); // Nombre
                let h3_ubi_nombre = document.createElement("h3");
                h3_ubi_nombre.classList.add("ubi_nombre");
                h3_ubi_nombre.textContent = ubi.ubi_nombre;
                ubi_nombre.appendChild(h3_ubi_nombre);

                let ubi_descripcion = document.createElement("td"); // Descripcion
                ubi_descripcion.textContent = ubi.ubi_descripcion;

                let ubi_btn = document.createElement("td"); // Botones

                let btn_edit = document.createElement("button"); // Boton Editar
                btn_edit.alt = "Editar ubicación " + ubi.ubi_nombre + ".";
                let img_edit = document.createElement("img");
                img_edit.src = srcEditar;
                btn_edit.appendChild(img_edit);
                btn_edit.classList.add("btn-s");
                btn_edit.classList.add("btn-edit");

                let btn_save = document.createElement("button"); // Boton Guardar
                btn_save.alt = "Editar ubicación " + ubi.ubi_nombre + ".";
                let img_save = document.createElement("img");
                img_save.src = srcGuardar;
                btn_save.appendChild(img_save);
                btn_save.classList.add("btn-s");
                btn_save.classList.add("btn-edit");
                btn_save.classList.add("oculto");

                let btn_delete = document.createElement("button"); // Boton Eliminar
                btn_delete.alt = "Editar ubicación " + ubi.ubi_nombre + ".";
                let img_delete = document.createElement("img");
                img_delete.src = srcEliminar;
                btn_delete.appendChild(img_delete);
                btn_delete.classList.add("btn-s");
                btn_delete.classList.add("btn-delete");

                let btn_open = document.createElement("button"); // Boton Abrir
                btn_open.alt = "Mostrar equipaciones de la ubicación " + ubi.ubi_nombre + ".";
                let img_open = document.createElement("img");
                img_open.src = srcCerrar;
                btn_open.appendChild(img_open);
                btn_open.classList.add("btn-s");
                btn_open.classList.add("btn-open");

                let btn_close = document.createElement("button"); // Boton Cerrar
                btn_close.alt = "Ocultar equipaciones de la ubicación " + ubi.ubi_nombre + ".";
                let btn_img = document.createElement("img");
                btn_img.src = srcAbrir;
                btn_close.appendChild(btn_img);
                btn_close.classList.add("btn-s");
                btn_close.classList.add("btn-close");
                btn_close.classList.add("oculto");

                // [ Edita la Ubicacion selecionada ]
                btn_edit.addEventListener("click", () => {
                    btn_edit.classList.remove("visible");
                    btn_edit.classList.add("oculto");

                    btn_save.classList.remove("oculto");
                    btn_save.classList.add("visible");

                });

                // [ Guarda las modificaciones de la Ubicacion editada ]
                btn_save.addEventListener("click", () => {
                    btn_save.classList.remove("visible");
                    btn_save.classList.add("oculto");

                    btn_edit.classList.remove("oculto");
                    btn_edit.classList.add("visible");

                });

                // [ Elimina la Ubicacion ]
                btn_delete.addEventListener("click", (event) => {
                    let botonesEliminar = Array.from(document.getElementsByClassName("btn-delete"));
                    let posicion = botonesEliminar.indexOf(event.currentTarget); // Obtiene la posición del índice del boton

                    let aulas = Array.from(document.getElementsByClassName("aula")); // Obtiene todas las aulas
                    let aula = aulas[posicion]; // Obtiene el aula de la posición del boton

                    eliminarUbicacion(aula);
                });

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

                // [ Oculta los Equipamientos de la Ubicacion ]
                btn_close.addEventListener("click", (event) => {
                    btn_close.classList.remove("visible");
                    btn_close.classList.add("oculto");

                    btn_open.classList.remove("oculto");
                    btn_open.classList.add("visible");

                    limpiarEquiposDeUbicacion(event.currentTarget);
                });

                ubi_btn.appendChild(btn_edit);
                ubi_btn.appendChild(btn_save);
                ubi_btn.appendChild(btn_delete);
                ubi_btn.appendChild(btn_open);
                ubi_btn.appendChild(btn_close);

                tr_ubi.appendChild(ubi_nombre);
                tr_ubi.appendChild(ubi_descripcion);
                tr_ubi.appendChild(ubi_btn);

                tr_ubi.classList.add("aula");

                tbody_ubicaciones.appendChild(tr_ubi);
            });

        } else {
            ubiNoValido(value[0].message);
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
            equ_nombre: "Portatil 102-01",
            equ_descripcion: "Portatil HP nº01 de curso Integración social.",
            equ_marca: "HP",
            equ_modelo: "HP-X45",
            equ_categoria: "PORTATIL",
            equ_ubicacion: 3
        },
        {
            equ_id: 2,
            equ_nombre: "Portatil 102-02",
            equ_descripcion: "Portatil HP nº01 de curso Integración social.",
            equ_marca: "HP",
            equ_modelo: "HP-X45",
            equ_categoria: "PORTATIL",
            equ_ubicacion: 3
        },
        {
            equ_id: 3,
            equ_nombre: "Ventilador",
            equ_descripcion: "Ventilador averiado.",
            equ_marca: "Amazon",
            equ_modelo: "Vent-A124",
            equ_categoria: "OTROS",
            equ_ubicacion: 1
        },
        {
            equ_id: 4,
            equ_nombre: "Portatil 202-01",
            equ_descripcion: "Portatil ASUS nº01 de curso Desarollo de aplicaciones web.",
            equ_marca: "ASUS",
            equ_modelo: "ASUS Rog 450-X",
            equ_categoria: "PORTATIL",
            equ_ubicacion: 5
        },
        {
            equ_id: 5,
            equ_nombre: "Portatil 202-02",
            equ_descripcion: "Portatil ASUS nº02 de curso Desarollo de aplicaciones web.",
            equ_marca: "ASUS",
            equ_modelo: "ASUS Rog 450-X",
            equ_categoria: "PORTATIL",
            equ_ubicacion: 5
        },
        {
            equ_id: 6,
            equ_nombre: "Torre 202-01",
            equ_descripcion: "Torre de profesor de curso Desarollo de aplicaciones web.",
            equ_marca: "HP",
            equ_modelo: "HP-XJ11289",
            equ_categoria: "SOBREMESA",
            equ_ubicacion: 5
        }
    ];

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

                let btn_edit = document.createElement("button"); // Boton editar
                btn_edit.classList.add("btn-s");
                btn_edit.classList.add("btn-edit");
                let img_btn_edit = document.createElement("img");
                img_btn_edit.src = srcEditar;
                btn_edit.alt = "Editar campos del equipamiento " + equ.equ_nombre + ".";
                btn_edit.appendChild(img_btn_edit);

                let btn_save = document.createElement("button"); // Boton guardar
                btn_save.classList.add("btn-s");
                btn_save.classList.add("btn-save");
                btn_save.classList.add("oculto");
                let img_btn_save = document.createElement("img");
                img_btn_save.src = srcGuardar;
                btn_save.alt = "Guardar cambios del equipamiento " + equ.equ_nombre + ".";
                btn_save.appendChild(img_btn_save);

                let btn_delete = document.createElement("button"); // Boton eliminar
                btn_delete.classList.add("btn-s");
                btn_delete.classList.add("btn-delete");
                let img_btn_delete = document.createElement("img");
                img_btn_delete.src = srcEliminar;
                btn_delete.alt = "Eliminar equipamiento " + equ.equ_nombre + ".";
                btn_delete.appendChild(img_btn_delete);

                // [ Edita el Equipamiento selecionado ]
                btn_edit.addEventListener("click", () => {
                    btn_edit.classList.remove("visible");
                    btn_edit.classList.add("oculto");

                    btn_save.classList.remove("oculto");
                    btn_save.classList.add("visible");
                });

                // [ Guarda las modificaciones del Equipamiento editado ]
                btn_save.addEventListener("click", () => {
                    btn_save.classList.remove("visible");
                    btn_save.classList.add("oculto");

                    btn_edit.classList.remove("oculto");
                    btn_edit.classList.add("visible");
                });

                // [ Elimina el Equipamiento ]
                btn_delete.addEventListener("click", () => {

                });

                sec_equ_btn.appendChild(btn_edit);
                sec_equ_btn.appendChild(btn_save);
                sec_equ_btn.appendChild(btn_delete);

                art_equ.appendChild(sec_equ_inf); // Seccion de información al artículo
                art_equ.appendChild(sec_equ_btn); // Seccion de botones al artículo

                artEqu.appendChild(art_equ);
            });

        } else {
            equNoValido(value[0].message);
        }

    } else {
        equNoValido("Formato de datos incorrecto.");
    }
}