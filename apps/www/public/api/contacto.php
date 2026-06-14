<?php
/**
 * Clínica Dental Bances — Endpoint de contacto / cita (SMTP vía PHPMailer).
 *
 * Acepta dos modos:
 *  - POST de formulario clásico (application/x-www-form-urlencoded / multipart):
 *    el formulario de la home (Contacto.astro) sin JS → tras enviar redirige a
 *    /?enviado=ok#Contacto o /?enviado=error#Contacto.
 *  - POST JSON (fetch con X-Requested-With) → responde JSON (mejora progresiva).
 *
 * Patrón reutilizado de logopedajessica-web / smedialab-web.
 */

require_once __DIR__ . '/lib/PHPMailer.php';
require_once __DIR__ . '/lib/SMTP.php';
require_once __DIR__ . '/lib/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --- Configuración SMTP (ajustar en el servidor) ---
$smtp_config = [
    'host'     => 'mail.dev-smedialab.com',
    'port'     => 587,
    'username' => 'astroweb@dev-smedialab.com',
    'password' => '',
    'security' => 'tls',
];

// Contraseña SMTP desde config.local.php (no versionado).
$config_local = __DIR__ . '/config.local.php';
if (file_exists($config_local)) {
    $local = require $config_local;
    if (!empty($local['smtp_password'])) {
        $smtp_config['password'] = $local['smtp_password'];
    }
}

$destinatario       = 'info@clinicadentalbances.com';
$destinatario_nombre = 'Clínica Dental Bances';
$asunto_prefix      = '[Web Clínica Dental Bances]';
$dominio_permitido  = 'clinicadentalbances.com';
$header_token       = 'BancesContactForm';
$permitir_localhost = true; // dev local
$rate_limit_max     = 5;
$rate_limit_ventana = 3600;
$rate_limit_dir     = sys_get_temp_dir() . '/bances_rate_limit';

// --- ¿Petición JSON (fetch) o formulario clásico? ---
$content_type = $_SERVER['CONTENT_TYPE'] ?? '';
$es_json = stripos($content_type, 'application/json') !== false;

// --- Origin + allowlist ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$es_origen_valido = $origin !== '' && preg_match(
    '/^https?:\/\/([a-z0-9-]+\.)?' . preg_quote($dominio_permitido, '/') . '$/',
    $origin
);
$es_localhost = $permitir_localhost && preg_match(
    '/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/',
    $origin
);
$origen_ok = (bool) ($es_origen_valido || $es_localhost || $origin === '');

header('Vary: Origin');

// --- Preflight CORS (solo modo JSON) ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($origen_ok && $origin !== '') {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
        header('Access-Control-Max-Age: 86400');
        http_response_code(204);
    } else {
        http_response_code(403);
    }
    exit;
}

// --- Solo POST ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

/** Responde según el modo: JSON o redirección del formulario clásico. */
function responder($ok, $codigo, $payload, $es_json) {
    if ($es_json) {
        http_response_code($codigo);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload);
    } else {
        $estado = $ok ? 'ok' : 'error';
        header('Location: /?enviado=' . $estado . '#Contacto', true, 303);
    }
    exit;
}

// --- Seguridad extra para JSON (header custom + origin) ---
if ($es_json) {
    $custom_header = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    if ($custom_header !== $header_token || !$origen_ok) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Acceso denegado']);
        exit;
    }
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
}

// --- Rate limiting por IP ---
$client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_file = $rate_limit_dir . '/' . md5($client_ip) . '.json';
if (!is_dir($rate_limit_dir)) {
    @mkdir($rate_limit_dir, 0700, true);
}
$ahora = time();
$intentos = [];
if (file_exists($rate_file)) {
    $intentos = json_decode(file_get_contents($rate_file), true) ?: [];
    $intentos = array_values(array_filter($intentos, function ($t) use ($ahora, $rate_limit_ventana) {
        return ($ahora - $t) < $rate_limit_ventana;
    }));
}
if (count($intentos) >= $rate_limit_max) {
    responder(false, 429, ['error' => 'Demasiados envíos. Inténtalo más tarde.'], $es_json);
}

// --- Leer datos (JSON o $_POST) ---
if ($es_json) {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
} else {
    $data = $_POST;
}

// --- Honeypot ---
if (!empty($data['website'])) {
    responder(true, 200, ['ok' => true], $es_json);
}

// --- Validación ---
$nombre      = trim($data['nombre'] ?? '');
$email       = trim($data['email'] ?? '');
$telefono    = trim($data['telefono'] ?? '');
$tratamiento = trim($data['tratamiento'] ?? '');
$mensaje     = trim($data['mensaje'] ?? '');
$privacidad  = !empty($data['rgpd']) || !empty($data['privacidad']);

$errores = [];
if (strlen($nombre) < 2) $errores[] = 'Nombre requerido';
if (empty($email) && empty($telefono)) $errores[] = 'Introduce tu email o teléfono';
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errores[] = 'Email no válido';
if (strlen($mensaje) < 5) $errores[] = 'Mensaje demasiado corto';
if (!$privacidad) $errores[] = 'Debes aceptar la política de privacidad';

if (!empty($errores)) {
    responder(false, 422, ['error' => 'Validación fallida', 'detalles' => $errores], $es_json);
}

// --- Sanitizar ---
$nombre      = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
$telefono    = htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8');
$tratamiento = htmlspecialchars($tratamiento, ENT_QUOTES, 'UTF-8');
$mensaje_s   = htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8');

// --- Registrar intento ---
$intentos[] = $ahora;
@file_put_contents($rate_file, json_encode($intentos));

// --- Enviar por SMTP ---
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $smtp_config['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_config['username'];
    $mail->Password   = $smtp_config['password'];
    $mail->SMTPSecure = $smtp_config['security'];
    $mail->Port       = $smtp_config['port'];
    $mail->CharSet    = 'UTF-8';
    $mail->XMailer    = ' ';
    $mail->Hostname   = preg_replace('/^[^@]+@/', '', $smtp_config['username']);

    $mail->setFrom($smtp_config['username'], 'Web Clínica Dental Bances');
    $mail->addAddress($destinatario, $destinatario_nombre);
    if (!empty($email)) {
        $mail->addReplyTo($email, $nombre);
    }

    $mail->isHTML(false);
    $mail->Subject = "$asunto_prefix Cita/consulta - $nombre";
    $mail->Body =
        "Nuevo mensaje desde el formulario de clinicadentalbances.com\n"
        . "============================================================\n\n"
        . "Nombre:      $nombre\n"
        . "Email:       " . ($email ?: 'No indicado') . "\n"
        . "Teléfono:    " . ($telefono ?: 'No indicado') . "\n"
        . "Tratamiento: " . ($tratamiento ?: 'No indicado') . "\n\n"
        . "Mensaje:\n------------------------------------------------------------\n"
        . "$mensaje_s\n------------------------------------------------------------\n\n"
        . "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'desconocida') . "\n"
        . "Fecha: " . date('d/m/Y H:i:s') . "\n";

    $mail->send();
    responder(true, 200, ['ok' => true, 'mensaje' => 'Mensaje enviado correctamente'], $es_json);
} catch (Exception $e) {
    responder(false, 500, ['error' => 'Error al enviar el email. Inténtalo de nuevo.'], $es_json);
}
