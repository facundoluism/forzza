---
description: Construye una historia del backlog. Input: ID de historia + agente.
---
Construí la historia $ARGUMENTS.
1. Delegá al subagente indicado (segundo argumento) con: la sección del master doc que la define, los archivos permitidos/prohibidos de su agente, y el criterio de aceptación textual.
2. El subagente implementa con TS estricto, estados loading/empty/error/success si es UI, y tests de su lógica.
3. Al terminar: delegá a qa-automation-engineer la verificación del criterio y a docs-maintainer la entrada en progress.
4. Commits convencionales pequeños: tipo(ID): descripción. No toques nada fuera del scope de la historia.
