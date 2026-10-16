<?php
    require_once ("model/NotificacionDAO.php");
    require_once ("model/Usuario.php");
    require_once ("model/Estado.php");

    $dao = new NotificacionDAO();
    
    $notificacion = $_POST['notificacion'] ?? null;

    $notificaciones = $dao->crearNotificacion($notificacion);

    $notificaciones = $dao->consultarNotificaciones($notificacion->getIdUsuario());

    $notificaciones = $dao->eliminarNotificacion($notificacion->getIdNotificacion());

    $notificaciones = $dao->modificarNotificacion($notificacion);
?>