<?php
/**
 * Plantilla de configuración local del endpoint de contacto de Clínica Dental Bances.
 *
 * COPIAR a `config.local.php` EN EL SERVIDOR (nunca commitear el real: está en
 * .gitignore y el deploy debe excluirlo con --exclude='api/config.local.php').
 *
 *   cp config.local.example.php config.local.php
 *   # editar config.local.php y pegar la contraseña real del buzón SMTP
 *
 * Ajusta también host/puerto/usuario en contacto.php si el relay SMTP difiere.
 */
return [
    'smtp_password' => 'PEGAR_AQUI_LA_CONTRASEÑA_SMTP',
];
