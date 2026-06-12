# Desviaciones — bances-web

> Registro prescriptivo de desviaciones respecto al plan, la arquitectura o las convenciones del proyecto. Toda desviación significativa debe quedar anotada aquí antes de cerrar la fase o sesión que la produjo. Aplica la Regla 0: leer este archivo COMPLETO al iniciar cierre de fase — no omitir puntos silenciosamente.

## Formato de cada entrada

```markdown
### [YYYY-MM-DD] — Título corto y buscable

**Qué se desvió**: descripción concisa del cambio respecto al plan/diseño original.

**Por qué**: causa técnica o decisión explícita del usuario. Incluir evidencia concreta (archivo:línea, referencia a conversación, métrica). Vaguedades como "por simplicidad" o "para iterar" NO son evidencia válida (ver skill `meta/anti-pereza-recomendaciones` sección P4).

**Impacto**: componentes afectados, regresiones potenciales, documentación a actualizar.

**Decisión**: qué se hace ahora y qué queda pendiente. Si se aplaza algo, rellenar la tabla P4 abajo.

**Aprobación del usuario**: cita literal del mensaje donde el usuario aprobó (o "automática — dentro del alcance acordado").

**Fecha**: YYYY-MM-DD.

---
```

### Tabla P4 (cuando se aplaza trabajo)

Si la desviación implica aplazar una pieza del plan, rellenar:

| Ítem aplazado | ¿Depende de datos emergentes? | Evidencia concreta | ¿Qué se ahorra ahora vs diferido? |
|:---|:---:|:---|:---|
| (descripción del ítem) | Sí/No | (referencia concreta o vacío) | (coste evitado ahora vs hacerlo luego) |

Si todos los ítems responden "No" en la columna 2 y la evidencia está vacía, el aplazamiento **no es válido** — hacer el trabajo ahora en vez de registrarlo como desviación.

---

## Ejemplo (borrar esta sección al registrar la primera desviación real)

```markdown
### [2026-04-16] — Pipeline --ia falló en T13; skill creado manualmente

**Qué se desvió**: el plan del SDD prescribe crear el skill `gestion/checklist-cierre-fase` vía `ypc skills new --ia`. El pipeline falló por cuota de Claude CLI agotada. Se creó manualmente.

**Por qué**: cuota de Claude API agotada para la cuenta (verificado con `ypc ai health`). Sin capacidad de esperar al reset del cupo en esta sesión.

**Impacto**: el skill existe pero sin el pulido IA ni self-critique. Posible gap de calidad en tabla de equivalencias y ejemplos. Revisar en próxima sesión con IA disponible.

**Decisión**: skill creado manualmente cumpliendo specs S-A01 a S-A04 salvo pulido estilístico. Issue abierto en PENDIENTES.md para refinar con `--ia` cuando la cuota esté disponible.

**Aprobación del usuario**: "adelante manual, no esperamos" (conversación 2026-04-16 17:35).

**Fecha**: 2026-04-16.
```

---

## Desviaciones registradas

<!-- Añade nuevas entradas arriba de este comentario, en orden cronológico inverso (más reciente primero). -->

*(sin desviaciones registradas todavía — al registrar la primera, borrar esta línea)*
