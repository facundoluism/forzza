---
description: Protocolo de corrección cuando hay tests rojos.
---
Hay tests rojos. Protocolo:
1. qa-automation-engineer clasifica cada fallo: (a) test desactualizado vs (b) bug de producción vs (c) entorno/credencial.
2. (a) lo corrige qa SOLO en archivos de test, justificando por qué el test estaba mal. (b) lo corrige el agente DUEÑO del archivo (ver ownership en docs). (c) se documenta HUMAN_REQUIRED con instrucción exacta.
3. Prohibido: borrar tests, bajar cobertura, agregar skip sin entrada en open-questions.md.
4. Re-correr la suite y reportar.
