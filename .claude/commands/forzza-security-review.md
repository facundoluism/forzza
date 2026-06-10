---
description: Auditoría de seguridad de un alcance. Input: nombre del alcance (ej: fase-2).
---
Auditoría de seguridad del alcance "$ARGUMENTS".
Delegá a security-privacy-reviewer: RLS default-deny con intentos de bypass, buckets privados y TTL, PII/datos de salud en logs/analytics (grep), firmas de webhooks, secretos en el repo (grep de patrones token/key/secret), consentimiento parental server-side. Reporte docs/progress/security-review-$ARGUMENTS.md con severidades. CRÍTICA/ALTA = bloqueante: presentame el caso y recomendación antes de seguir.
