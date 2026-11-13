<?php
// Iniciamos o recuperamos la sesión.
session_start();

// Eliminamos todos los datos de la sesión.
$_SESSION = [];
session_destroy();

// Volvemos a la página de login.
header("Location: ../../Public/index.html");
exit();
?>
