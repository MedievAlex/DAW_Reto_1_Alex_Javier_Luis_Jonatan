<?php
//require_once("../dao/EquipamientoDAO.php");
require_once("../dao/Historico_UbicacionDAO.php");
require_once("../dao/NotificacionDAO.php");
require_once("../dao/UbicacionDAO.php");
require_once("../dao/UsuarioDAO.php");

class Controller
{
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

    // ---------------------------------------- EQUIPAMIENTO


    // ---------------------------------------- HISTORICO

    /**
     * Función que obtiene todos los historicos.
     *
     * @return array $historicos Listado de los historico obtenidos
     * 
     * @author Alex
     */
    public function cargarHistoricos()
    {
        return $this->his_dao->cargarHistoricos();
    }

    /**
     * Función que obtiene un historico buscado por id.
     *
     * @param int $his_id Id del historico a buscar
     * @return Historico_Ubicacion $historico Objeto encontrado
     * 
     * @author Alex
     */
    public function buscarHistoricoPorId(int $his_id)
    {
        return $this->his_dao->buscarHistoricoPorId($his_id);
    }

    /**
     * Función que obtiene los historicos de un equipamiento.
     *
     * @param int $his_equipamiento Id del equipamiento a revisar sus historicos
     * @return array $historicos Listado de los historico obtenidos
     * 
     * @author Alex
     */
    public function cargarHistoricosDeEquipamiento(int $his_equipamiento)
    {
        return $this->his_dao->cargarHistoricosDeEquipamiento($his_equipamiento);
    }

    /**
     * Función que crea y registra un historico nuevo.
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
     * Función que edita un historico existente.
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
     * Función que elimina un historico.
     *
     * @param int $his_id Id del historico a eliminar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function eliminarHistorico(int $his_id)
    {
        return $this->his_dao->eliminarHistorico($his_id);
    }

    // ---------------------------------------- NOTIFICACION


    // ---------------------------------------- UBICACION

    /**
     * Función que obtiene todas las ubicaciones.
     *
     * @return array $ubicaciones Listado de las ubicaciones obtenidas
     * 
     * @author Alex
     */
    public function cargarUbicaciones()
    {
        return $this->ubi_dao->cargarUbicaciones();
    }

    /**
     * Función que obtiene una ubicacion buscada por id.
     *
     * @param int $ubi_id Id del historico a buscar
     * @return Ubicacion $ubicacion Objeto encontrado
     * 
     * @author Alex
     */
    public function buscarUbicacionPorId(int $ubi_id)
    {
        return $this->ubi_dao->buscarUbicacionPorId($ubi_id);
    }

    /**
     * Función que obtiene una ubicacion buscada por nombre.
     *
     * @param string $ubi_nombre Id del historico a buscar
     * @return Ubicacion $ubicacion Objeto encontrado
     * 
     * @author Alex
     */
    public function buscarUbicacionPorNombre(string $ubi_nombre)
    {
        return $this->ubi_dao->buscarUbicacionPorNombre($ubi_nombre);
    }

    /**
     * Función que crea y registra una ubicacion nueva.
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
     * Función que edita una ubicacion existente.
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
     * Función que elimina una ubicacion.
     *
     * @param int $ubi_id Id de la ubicacion a eliminar
     * @return bool Valor devuelto por la ejecution de la consulta
     * 
     * @author Alex
     */
    public function eliminarUbicacion(int $ubi_id)
    {
        return $this->ubi_dao->eliminarUbicacion($ubi_id);
    }

    // ---------------------------------------- USUARIO

    
}

?>