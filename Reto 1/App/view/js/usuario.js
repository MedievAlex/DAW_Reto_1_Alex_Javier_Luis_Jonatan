const USU_URL = "../../api/UsuarioController.php";

//----------------------------------------Funciones

// valida la respuesta de la API. Lanza un error si no es correcta.
function validarRespuestaUsuario(respuesta) {
    if (Array.isArray(respuesta)) {
        if (respuesta.length > 0 && respuesta[0].success === false) {
            throw new Error(respuesta[0].message || "No se pudo completar la operación.");
        }

        return respuesta;
    }

    if (!respuesta || !respuesta.success) {
        throw new Error(respuesta && respuesta.message || "No se pudo completar la operación.");
    }

    return respuesta;
}

function datosRespuestaUsuario(respuesta) {
    validarRespuestaUsuario(respuesta);
    return Array.isArray(respuesta) ? respuesta : respuesta.data;
}

// Pide la lista de todos los usuarios. Devuelve un array o null si falla.
async function cargarUsuarios() {

    let url = USU_URL;
    let method = "GET";
    let data = [];

    return datosRespuestaUsuario(await petition(url, method, data));

}

// Pide un Usuario mediante el id. Devuelve el usuario o null si falla.
async function buscarUsuarioPorId(usu_id) {

    let url = USU_URL + "?usu_id=" + encodeURIComponent(usu_id);
    let method = "GET";
    let data = [];
    let usuarios;

    usuarios = await petition(url, method, data); // Llama al petition de global.js

    const datos = datosRespuestaUsuario(usuarios);
    return datos[0] || null;
}

// Crea un usuario. usuario = { nombre, apellidos, nombre_usuario, password, rol }
// Devuelve el usuario creado o null si falla.
async function crearUsuario(usuario) {

    let url = USU_URL;
    let method = "POST";
    let data = {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        nombre_usuario: usuario.nombre_usuario,
        password: usuario.password,
        rol: usuario.rol
    };
    let usuarios;

    usuarios = await petition(url, method, data); // Llama al petition de global.js

    const datos = datosRespuestaUsuario(usuarios);
    return datos[0] || null;
}

// Edita un Usuario. usuario = { usu_id, nombre, apellidos, nombre_usuario, rol, password }
// La password es opcional: sin ella se mantiene la actual. Devuelve el usuario editado o null si falla.
async function editarUsuario(usuario) {
    let url = USU_URL;
    let method = "PUT";
    let data = {
        usu_id: usuario.usu_id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol
    };
    let usuarios;

    if (usuario.password) {
        data.password = usuario.password;
    }

    usuarios = await petition(url, method, data); // Llama al petition de global.js

    const datos = datosRespuestaUsuario(usuarios);
    return datos[0] || null;
}

// Elimina un usuario mediante el id. Devuelve true si se ha eliminado
async function eliminarUsuario(usu_id) {

    let url = USU_URL + "?usu_id=" + encodeURIComponent(usu_id);
    let method = "DELETE";
    let data = [];
    let usuarios;

    usuarios = await petition(url, method, data); // Llama al petition de global.js

    datosRespuestaUsuario(usuarios);
    return true;

}

// Cambia la contraseña del usuario de la sesión. Devuelve true si se ha cambiado
async function cambiarPasswordPropia(password_actual, password_nueva) {

    let url = USU_URL;
    let method = "PUT";
    let data = {
        password_actual: password_actual,
        password_nueva: password_nueva
    };
    let usuarios;

    usuarios = await petition(url, method, data); // Llama al petition de global.js

    datosRespuestaUsuario(usuarios);
    return true;

}       