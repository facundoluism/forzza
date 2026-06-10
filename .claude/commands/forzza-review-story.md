---
description: Revisa una historia sin modificar código. Input: ID de historia.
---
Revisá la historia $ARGUMENTS sin modificar código.
1. Delegá a product-spec-guardian: comparar el diff de la historia contra el master doc y CLAUDE.md; veredicto CUMPLE/VIOLA(sección) por criterio.
2. Si hay VIOLA: generá lista de fixes con agente responsable y bloqueá el cierre.
3. Si CUMPLE: registrá el veredicto en docs/progress y autorizá continuar.
