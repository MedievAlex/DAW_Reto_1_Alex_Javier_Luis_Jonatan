<?php
//require_once("../dao/EquipamientoDAO.php");
require_once("../dao/Historico_UbicacionDAO.php");
require_once("../dao/NotificacionDAO.php");
require_once("../dao/UbicacionDAO.php");
require_once("../dao/UsuarioDAO.php");

class Controller
{
    // la contraseña debe tener entre 8 y 72 caracteres (bcrypt solo usa los primeros 72)
    private const LONGITUD_MINIMA_PASSWORD = 8;
    private const LONGITUD_MAXIMA_PASSWORD = 72;
    //private EquipamientoDAO $equ_dao;
    private Historico_UbicacionDAO $his_dao;
    private NotificacionDAO $not_dao;
    private UbicacionDAO $ubi_dao;
    private UsuarioDAO $usu_dao;

    public function __construct()
    {
        //$this->equ_dao = new EquipamientoDAO();
        $this->his_dao = new Historico_UbicacionDAO();
        $this->not_dao = new NotificacionDAO();
        $this->ubi_dao = new UbicacionDAO();
        $this->usu_dao = new UsuarioDAO();
    }

    // ---------------------------------------- [ EQUIPAMIENTO ]


    // ---------------------------------------- [ HISTORICO ]

    /**
     * Función que obtiene todos los Historico Ubicacion.
     *
     * @return array $historicos Listado de los Historico Ubicacion obtenidos
     * 
     * @author Alex
     */
    public function cargarHistoricos()
    {
        return $this->his_dao->cargarHistoricos();
    }

    /**
     * Función que obtiene un Historico Ubicacion buscado por ID.
     *
     * @param int $his_id ID del Historico Ubicacion a buscar
     * @return Historico_Ubicacion $historico Objeto encontrado
     * 
     * @author Alex
     */
    public function buscarHistoricoPorId(int $his_id)
    {
        return $this->his_dao->buscarHistoricoPorId($his_id);
    }

    /**
     * Función que obtiene los Historico Ubicacion de un Equipamiento.
     *
     * @param int $his_equipamiento ID del Equipamiento a revisar sus Historico Ubicacion
     * @return array $historicos Listado de los Historico Ubicacion obtenidos
     * 
     * @author Alex
     */
    public function cargarHistoricosDeEquipamiento(int $his_equipamiento)
    {
        return $this->his_dao->cargarHistoricosDeEquipamiento($his_equipamiento);
    }

    /**
     * Función que crea y registra un Historico Ubicacion nuevo.
     *
     * @param Historico_Ubicacion $historico Objeto a crear
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function crearHistorico(Historico_Ubicacion $historico)
    {
        $this->his_dao->crearHistorico($historico);
    }

    /**
     * Función que edita un Historico Ubicacion existente.
     *
     * @param Historico_Ubicacion $historico Objeto a modificar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function editarHistorico(Historico_Ubicacion $historico)
    {
        return $this->his_dao->editarHistorico($historico);
    }

    /**
     * Función que elimina un Historico Ubicacion.
     *
     * @param int $his_id ID del Historico Ubicacion a eliminar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function eliminarHistorico(int $his_id)
    {
        return $this->his_dao->eliminarHistorico($his_id);
    }

    // ---------------------------------------- [ NOTIFICACION ]

    public function consultarNotificaciones()
    {
        return $this->not_dao->consultarNotificaciones();
    }

    public function crearNotificacion(Notificacion $notificacion)
    {
        return $this->not_dao->crearNotificacion($notificacion);
    }

    public function modificarNotificacion(Notificacion $notificacion)
    {
        return $this->not_dao->modificarNotificacion($notificacion);
    }

    public function eliminarNotificacion(int $not_id)
    {
        return $this->not_dao->eliminarNotificacion($not_id);
    }

    public function consultarNotificacionesId(int $id_Usuario)
    {
        return $this->not_dao->consultarNotificacionesId($id_Usuario);
    }


    // ---------------------------------------- [ UBICACION ]

    /**
     * Función que obtiene todas las Ubicacion.
     *
     * @return array $ubicaciones Listado de las Ubicacion obtenidas
     * 
     * @author Alex
     */
    public function cargarUbicaciones()
    {
        return $this->ubi_dao->cargarUbicaciones();
    }

    /**
     * Función que obtiene una Ubicacion buscada por id.
     *
     * @param int $ubi_id ID del historico a buscar
     * @return Ubicacion $ubicacion Objeto encontrado
     * 
     * @author Alex
     */
    public function buscarUbicacionPorId(int $ubi_id)
    {
        return $this->ubi_dao->buscarUbicacionPorId($ubi_id);
    }

    /**
     * Función que obtiene una Ubicacion buscada por nombre.
     *
     * @param string $ubi_nombre NOMBRE de la Ubicacion a buscar
     * @return Ubicacion $ubicacion Objeto encontrado
     * 
     * @author Alex
     */
    public function buscarUbicacionPorNombre(string $ubi_nombre)
    {
        return $this->ubi_dao->buscarUbicacionPorNombre($ubi_nombre);
    }

    /**
     * Función que crea y registra una Ubicacion nueva.
     *
     * @param Ubicacion $ubicacion Objeto a crear
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function crearUbicacion(Ubicacion $ubicacion)
    {
        return $this->ubi_dao->crearUbicacion($ubicacion);
    }

    /**
     * Función que edita una Ubicacion existente.
     *
     * @param Ubicacion $ubicacion Objeto a modificar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function editarUbicacion(Ubicacion $ubicacion)
    {
        return $this->ubi_dao->editarUbicacion($ubicacion);
    }

    /**
     * Función que elimina una Ubicacion.
     *
     * @param int $ubi_id id de la Ubicacion a eliminar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function eliminarUbicacion(int $ubi_id)
    {
        return $this->ubi_dao->eliminarUbicacion($ubi_id);
    }

    // ---------------------------------------- [ USUARIO ]

    public function cargarUsuarios()
    {
        return $this->usu_dao->cargarUsuarios();
    }

    public function buscarUsuarioPorId(int $usu_id)
    {
        return $this->usu_dao->buscarUsuarioPorId($usu_id);
    }

    public function buscarUsuarioPorNombreUsuario(string $usu_nombre_usuario)
    {
        return $this->usu_dao->buscarUsuarioPorNombreUsuario($usu_nombre_usuario);
    }

    public function existeNombreUsuario(string $usu_nombre_usuario, int $usu_excluir_id = 0)
    {
        return $this->usu_dao->existeNombreUsuario($usu_nombre_usuario, $usu_excluir_id);
    }

    public function contarAdministradores()
    {
        return $this->usu_dao->contarAdministradores();
    }

    public function tieneNotificaciones(int $usu_id)
    {
        return $this->usu_dao->tieneNotificaciones($usu_id);
    }

    public function crearUsuario(Usuario $usuario)
    {
        return $this->usu_dao->crearUsuario($usuario);
    }

    public function editarUsuario(Usuario $usuario)
    {
        return $this->usu_dao->editarUsuario($usuario);
    }

    public function eliminarUsuario(int $usu_id)
    {
        return $this->usu_dao->eliminarUsuario($usu_id);
    }

    // ---------------------------------------- HASH DE CONTRASEÑAS

    // REGISTRAR USUARIO
    // valida la contraseña; el DAO genera el hash y crea el usuario
    public function registrarUsuario(Usuario $usuario, string $usu_password): bool
    {
        $this->validarPassword($usu_password);

        return $this->usu_dao->registrarUsuario($usuario, $usu_password);
    }

    // CAMBIAR CONTRASEÑA
    public function cambiarPassword(int $usu_id, string $usu_password): bool
    {
        $this->validarPassword($usu_password);

        return $this->usu_dao->cambiarPassword($usu_id, $usu_password);
    }

    // INICIAR SESIÓN
    public function iniciarSesion(string $usu_nombre_usuario, string $usu_password): ?Usuario
    {
        return $this->usu_dao->iniciarSesion($usu_nombre_usuario, $usu_password);
    }

    // VALIDAR CONTRASEÑA
    private function validarPassword(string $password): void
    {
        if (strlen($password) < self::LONGITUD_MINIMA_PASSWORD) {
            throw new InvalidArgumentException(
                'La contraseña debe tener al menos ' . self::LONGITUD_MINIMA_PASSWORD . ' caracteres'
            );
        }

        if (strlen($password) > self::LONGITUD_MAXIMA_PASSWORD) {
            throw new InvalidArgumentException(
                'La contraseña no puede superar los ' . self::LONGITUD_MAXIMA_PASSWORD . ' caracteres'
            );
        }
    }
    
}

?>