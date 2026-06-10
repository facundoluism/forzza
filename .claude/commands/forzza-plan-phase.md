---
description: Planifica una fase sin escribir código. Input: número de fase.
---
Planificá la FASE $ARGUMENTS sin escribir código.
1. Leé CLAUDE.md, docs/progress/ de la fase anterior y las secciones del master doc citadas en el prompt de la fase (docs/prompts/).
2. Descomponé en tareas atómicas: cada una con subagente dueño, archivos que toca, criterio de aceptación y si puede paralelizarse (solo sin archivos compartidos).
3. Identificá checkpoints HUMAN_REQUIRED y verificá en .env si la credencial existe; si no, planificá el mock.
4. Emití el plan como tabla y esperá mi confirmación antes de delegar.
