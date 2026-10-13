<?php

class Hash
{
    // ---------------------------------------- GENERAR HASH
    // cifra la contraseña; el resultado es lo que se guarda en password_hash
    public static function generar(string $password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    // ---------------------------------------- VERIFICAR
    // true si la contraseña escrita coincide con el hash guardado
    public static function verificar(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    // ---------------------------------------- NECESITA REGENERAR
    // true si el hash guardado usa un algoritmo antiguo y conviene generarlo de nuevo
    public static function necesitaRegenerar(string $hash): bool
    {
        return password_needs_rehash($hash, PASSWORD_DEFAULT);
    }
}

?>