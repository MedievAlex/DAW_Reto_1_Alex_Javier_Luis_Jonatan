<?php
class ConexionDB
{
    public static function conexion(): mysqli
    {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

        $conexion = new mysqli(
            "localhost",
            "root",
            "",
            "reto_2daw"
        );
        $conexion->set_charset("utf8mb4");

        return $conexion;
    }
}
?>