/** */
const USU_URL = "../../api/UsuarioController.php";

//----------------------------------------Funciones
//Se encarga de hacer la petiocion al php. Devuelve un arry de "Data" de la repuesta o null en caso de error 

async function petition(url, method, data) {
    try {
        if (method == "GET") {
            const response = await fetch(url, { // Peticion al PHP
                method: method, // Metodo de peticion
                headers: { "Content-type": "application/json" }
            });
            const result = await response.json();

            if (response.ok) {
                return result.data;
            } else {
                alert(result.message);
                return null;
            }
        } else {
            const response = await fetch(url, { // Peticion al PHP
                method: method, // Metodo de peticion
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(data) // Contenido
            });
            const result = await response.json();

            if (response.ok) {
                return result.data;
            } else {
                alert(result.message);
                return null;
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
        alert("Error: " + error.message);
        return null;
    }
}

// Pide la lista de todos los usuarios 
async function cargarUsuarios() {

    let url = USU_URL;
    let method = "GET";
    let data = [];

    return await petition(url, method, data);

}
// Pide un Usuario mediante el id
async function buscarUsuarioPorId(usu_id) {

    let url = USU_URL + "?usu_id=" + encodeURIComponent(usu_id); 
    let method = "GET";
    let data = [];
    let usuarios;

    usuarios = await petition(url, method, data); 

    if (usuarios === null) {
        return null;
    }

    console.log(usuarios[0]);
    alert(usuarios[0].nombre);

    return usuarios[0];
}

// Crea un usuario. usuario = { nombre, apellido, nombre_usuario, password, rol }
async function crearUsuario(usuario) {

    let url = USU_URL;
    let method = "POST"; 
    let data = {
        nombre: usuario.nombre,
        apellidos:usuario.apellidos,
        nombre_usuario: usuario.nombre_usuario,
        password: usuario.password,
        rol: usuario.rol
    };
    let usuarios; 
    
    usuarios = await petition(url, method, data);

    if (usuarios === null) {
        return null;
    }

    console.log(usuarios[0]);
    alert(usuarios[0].nombre);

    return usuarios[0];
}

// Edita un Usuario. usuario = { usu_id, nombre, apellidos, nombre_usuario, rol, password }
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

    usuarios = await petition(url, method, data);

    if (usuarios === null) {
        return null;
    }

    console.log(usuarios[0]);
    alert(usuarios[0].nombre);

    return usuarios[0];
}

// Elimina un usuario mediante el id. Devuelve true si se ha eliminado 
async function eliminarUsuario(usu_id) {

    let url = USU_URL + "?usu_id=" + encodeURIComponent(usu_id);
    let method = "DELETE";
    let data = [];
    let usuarios;

    usuarios = await petition(url, method, data);

    if (usuarios === null) {
        return false;
    }

    console.log("Usuario " + usu_id + " eliminado");

    return true;
    
}

