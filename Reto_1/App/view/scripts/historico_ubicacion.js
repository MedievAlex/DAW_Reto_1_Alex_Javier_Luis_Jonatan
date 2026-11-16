/* ---------------------------------------------- [Constantes]*/
const HIS_URL = "../../api/Historico_UbicacionController.php";

/* ---------------------------------------- [FUNCIONES]*/
// [ Pide el listado de todos los Historico Ubicaciones ]
async function cargarHistoricos() {
    let url = HIS_URL;
    let method = "GET";
    let data = [];
    let historicos;

    historicos = petition(url, method, data); // Llama al petition de global.js

    historicos.then((value) => {
        value.forEach(ubi => {
            console.log(ubi);
            alert(ubi);
        });
    });
}

// [ Pide un Historico Ubicacion mediante el ID ]
function buscarHistoricoPorId() {
    let url = HIS_URL + "?his_id=" + 2;
    let method = "GET";
    let data = [];
    let historico;

    historico = petition(url, method, data); // Llama al petition de global.js

    historico.then((value) => {
        console.log(value[0]);
        alert(value[0]);
    });
}

// [ Pide un Historico Ubicacion mediante el ID EQUIPAMIENTO ]
function cargarHistoricosDeEquipamiento() {
    let url = HIS_URL + "?his_equipamiento=" + 2;
    let method = "GET";
    let data = [];
    let historico;

    historico = petition(url, method, data); // Llama al petition de global.js

    historico.then((value) => {
        console.log(value[0]);
        alert(value[0]);
    });
}

// [ Pide un Historico Ubicacion mediante el ID UBICACION ]
function cargarHistoricosDeUbicacion() {
    let url = HIS_URL + "?his_ubicacion=" + 2;
    let method = "GET";
    let data = [];
    let historico;

    historico = petition(url, method, data); // Llama al petition de global.js

    historico.then((value) => {
        console.log(value[0]);
        alert(value[0]);
    });
}

// [ Crea el Historico Ubicacion enviado ]
async function crearHistorico() {
    let url = HIS_URL;
    let method = "POST";
    let data = {
        his_id: 1,
        his_equipamiento: 2,
        his_ubicacion: 2,
        his_fecha_ini: ""
    };
    let historico;

    historico = petition(url, method, data); // Llama al petition de global.js

    historico.then((value) => {
        console.log(value[0]);
        alert(value[0] + " creado correctamente.");
    });
}

// [ Editar el Historico Ubicacion con los datos nuevos ]
async function crearHistorico() {
    let url = HIS_URL;
    let method = "PUT";
    let data = {
        his_id: 1,
        his_equipamiento: 2,
        his_ubicacion: 2,
        his_fecha_ini: ""
    };
    let historico;

    historico = petition(url, method, data); // Llama al petition de global.js

    historico.then((value) => {
        console.log(value[0]);
        alert(value[0] + " editado correctamente.");
    });
}

// [ Elimina el Historico Ubicacion ]
async function eliminarUbicacion() {
    let url = HIS_URL + "?his_id=" + 21;
    let method = "DELETE";
    let data = {};
    let historico;

    historico = petition(url, method, data); // Llama al petition de global.js

    historico.then((value) => {
        console.log(value[0].message);
        alert(value[0].message);
    });
}