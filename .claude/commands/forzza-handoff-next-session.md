---
description: Prepara el traspaso a la próxima sesión. Usar siempre antes de cerrar una sesión larga.
---
Preparar el traspaso a una sesión nueva:
1. docs-maintainer escribe docs/progress/HANDOFF.md: fase actual, qué quedó hecho (commits), qué quedó a medias (archivo y línea), próximos 3 pasos exactos, HUMAN_REQUIRED pendientes, y qué prompt de fase retomar.
2. Verificar que no hay cambios sin commitear (git status); si los hay, commit WIP convencional.
3. Mensaje final para el humano: "Cerrá esta sesión. En la próxima: /clear, pegá el contenido de docs/progress/HANDOFF.md y continuá".
