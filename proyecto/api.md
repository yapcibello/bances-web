# API — bances-web

El sitio es estático (Astro SSG). La única "API" es el **endpoint del formulario de citas/contacto**, implementado en PHP + PHPMailer y servido como archivo desde `apps/www/public/api/contacto.php` (se despliega tal cual al hosting Hestia).

> Estado: **implementado** en el repo. El secreto SMTP (`config.local.php`) se crea en el servidor durante la fase deploy; el endpoint no envía correos hasta que esa credencial existe.

## Endpoint

| | |
|---|---|
| **Ruta** | `POST /api/contacto.php` |
| **Archivo** | `apps/www/public/api/contacto.php` |
| **Dependencias** | `apps/www/public/api/lib/` → `PHPMailer.php`, `SMTP.php`, `Exception.php` |
| **Destinatario** | `info@clinicadentalbances.com` (Clínica Dental Bances) |
| **Asunto** | `[Web Clínica Dental Bances] Cita/consulta - {nombre}` |

Acepta **dos modos** según el `Content-Type`:

1. **Formulario clásico** (`application/x-www-form-urlencoded` / `multipart/form-data`) — el que usan los dos formularios de la home sin JS. Responde con redirección **303**.
2. **JSON** (`application/json`, mejora progresiva vía `fetch`) — requiere header `X-Requested-With: BancesContactForm`. Responde con JSON.

## Consumidores (formularios del sitio)

Ambos formularios viven en la home con `method="post"` y `action="/api/contacto.php"`.

### Formulario rápido del Hero (`components/home/Hero.astro`)

"Solicitud rápida de cita", barra bajo el hero.

| Campo | `name` | Tipo | Obligatorio |
|-------|--------|------|-------------|
| Nombre | `nombre` | text | Sí |
| Email | `email` | email | Sí |
| Teléfono | `telefono` | tel | No |
| Tratamiento | `tratamiento` | select | No |
| Mensaje (oculto) | `mensaje` | hidden | Sí (valor por defecto) |

> El Hero envía un `mensaje` oculto con valor por defecto ("Solicitud rápida de cita desde el formulario destacado de la home.") para cumplir la validación del backend (`mensaje` ≥ 5). Muestra una microcopia con enlace a la política de privacidad; el `rgpd` no es bloqueante en el backend (ver "Validación").

### Formulario de contacto (`components/home/Contacto.astro`)

Sección `#Contacto` (ancla del menú "Pedir Cita").

| Campo | `name` | Tipo | Obligatorio |
|-------|--------|------|-------------|
| Nombre | `nombre` | text | Sí |
| Correo electrónico | `email` | email | Sí |
| Teléfono | `telefono` | tel | No |
| Tratamiento | `tratamiento` | select | No |
| Mensaje | `mensaje` | textarea | Sí |
| Acepto la política de privacidad | `rgpd` | checkbox | Sí |

Opciones del select `tratamiento` (literales del origen): Implantes dentales, Blanqueamiento Dental, Cirugía Oral, Endodoncias, Odontología Conservadora, Odontopediatría, Ortodoncia, Periodoncia, Prótesis Dentales, Seguros Dentales, Otros.

## Validación (servidor)

El backend lee los campos `nombre`, `email`, `telefono`, `tratamiento`, `mensaje` y acepta el consentimiento como `rgpd` **o** `privacidad`. Reglas:

- `nombre`: longitud ≥ 2.
- `email` o `telefono`: al menos uno presente.
- `email`: si se envía, debe ser válido (`FILTER_VALIDATE_EMAIL`).
- `mensaje`: longitud ≥ 5 (el Hero lo cubre con un valor oculto por defecto).
- consentimiento (`rgpd`/`privacidad`): se recoge y registra, pero **no es un error bloqueante** en el backend actual (el formulario de contacto lo exige en cliente con `required`).

Tras validar, los campos se sanitizan con `htmlspecialchars(... ENT_QUOTES, 'UTF-8')` antes de componer el correo.

## Seguridad

- **Honeypot**: campo oculto `website`; si llega relleno se responde 200 sin enviar (silencioso anti-bot).
- **Allowlist de origen** (`Origin`): se permite `*.clinicadentalbances.com`, `localhost`/`127.0.0.1` (dev) y origen vacío. En modo JSON, además, se exige el header `X-Requested-With: BancesContactForm`; en otro caso → **403**.
- **CORS**: preflight `OPTIONS` gestionado (204 si el origen es válido, 403 si no).
- **Rate limiting** por IP: máximo **5 envíos / 3600 s**, persistido en archivos JSON bajo `sys_get_temp_dir()/bances_rate_limit`. Al superarlo → **429**.
- **Método**: solo `POST` (y `OPTIONS` para preflight); cualquier otro → **405**.

## Envío (PHPMailer / SMTP)

El correo se envía por SMTP con PHPMailer. Configuración por defecto en `contacto.php` (ajustable en servidor): host `mail.dev-smedialab.com`, puerto `587`, seguridad `tls`, usuario `astroweb@dev-smedialab.com`. El `From` es el usuario SMTP ("Web Clínica Dental Bances") y se añade `Reply-To` al email del visitante si lo aporta. Cuerpo en texto plano con nombre, email, teléfono, tratamiento, mensaje, IP y fecha.

> Nota: host/usuario SMTP por defecto apuntan al relay de SMedialab. Confirmar/ajustar en el servidor según el buzón definitivo de la clínica durante la fase deploy.

## Variables / secretos

La contraseña SMTP **no se versiona**. Se carga desde `config.local.php` (en `apps/www/public/api/`, ignorado por git y excluido del paquete de deploy):

| Clave | Archivo | Descripción |
|-------|---------|-------------|
| `smtp_password` | `config.local.php` (return array PHP) | Contraseña del buzón SMTP. **Nunca** en el repo |

Plantilla versionada: `config.local.example.php`. En el servidor:

```bash
cp config.local.example.php config.local.php
# editar config.local.php y pegar la contraseña real del buzón SMTP
```

Si `config.local.php` no existe o `smtp_password` está vacío, el endpoint intenta enviar con contraseña vacía y el envío falla con **500**.

## Respuestas

### Modo formulario clásico (redirección 303)

- Éxito → `Location: /?enviado=ok#Contacto`
- Error de validación, rate-limit o envío → `Location: /?enviado=error#Contacto`

(La home lee `enviado=ok|error` para mostrar el mensaje al usuario.)

### Modo JSON

| Código | Cuerpo | Caso |
|--------|--------|------|
| `200` | `{ "ok": true, "mensaje": "Mensaje enviado correctamente" }` | envío correcto (o honeypot) |
| `403` | `{ "error": "Acceso denegado" }` | origen no permitido o header custom ausente |
| `405` | `{ "error": "Método no permitido" }` | método distinto de POST |
| `422` | `{ "error": "Validación fallida", "detalles": [...] }` | campos inválidos |
| `429` | `{ "error": "Demasiados envíos. Inténtalo más tarde." }` | rate limit superado |
| `500` | `{ "error": "Error al enviar el email. Inténtalo de nuevo." }` | fallo SMTP |
| `204` | (sin cuerpo) | preflight `OPTIONS` con origen válido |

## Pendientes / a revisar en deploy

- **Coherencia de campos del Hero con la validación** (resuelto 2026-06-14): el Hero envía un `mensaje` oculto por defecto, por lo que ya no se produce el 422. El `rgpd` no es bloqueante en el backend.
- **Buzón/relay SMTP definitivo**: host y usuario por defecto apuntan al relay de SMedialab; confirmar el buzón real de la clínica.
- **Exclusión de `config.local.php`** del ZIP de deploy (ver `proyecto/runbook.md` y `proyecto/despliegue.md`).
