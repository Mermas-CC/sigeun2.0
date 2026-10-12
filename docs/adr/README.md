# Registro de decisiones de arquitectura (ADR)

Cada decisión técnica relevante se registra en un archivo corto con contexto, decisión, alternativas y consecuencias (formato de Michael Nygard). La **autoridad de diseño** aprueba los ADR; un ADR aprobado no se edita: si cambia la decisión, se crea uno nuevo que lo reemplaza.

| ADR | Decisión | Estado |
|---|---|---|
| [0001](ADR-0001-microservicios-por-contexto-acotado.md) | Microservicios de grano medio por contexto acotado | Propuesto |
| [0002](ADR-0002-base-de-datos-por-servicio-postgresql.md) | Base de datos por servicio sobre PostgreSQL | Propuesto |
| [0003](ADR-0003-comunicacion-rest-y-eventos-con-outbox.md) | REST síncrono + eventos asíncronos con outbox | Propuesto |
| [0004](ADR-0004-identidad-keycloak-sso.md) | Identidad con Keycloak, SSO y federación con Microsoft Entra ID | Propuesto |
| [0005](ADR-0005-plataforma-kubernetes-gitops.md) | Kubernetes on-premise de 3 nodos con GitOps | Reemplazado por 0010 (objetivo futuro) |
| [0006](ADR-0006-reutilizar-antes-que-construir.md) | Reutilizar e integrar antes que construir | Propuesto |
| [0007](ADR-0007-migracion-strangler-fig.md) | Migración progresiva Strangler Fig con capa anticorrupción | Propuesto |
| [0008](ADR-0008-stack-tecnologico-estandar.md) | Stack tecnológico estándar | Propuesto |
| [0009](ADR-0009-repositorios-y-flujo-de-trabajo.md) | Repositorios institucionales y trunk-based development | Propuesto |
| [0010](ADR-0010-despliegue-con-los-equipos-del-plan.md) | Despliegue con los equipos del plan (2 servidores) | Aceptado |

Plantilla para nuevos ADR:

```markdown
# ADR-NNNN: Título en forma de decisión

- Estado: Propuesto | Aprobado | Reemplazado por ADR-XXXX
- Fecha: AAAA-MM-DD
- Decisores: autoridad de diseño

## Contexto
## Decisión
## Alternativas consideradas
## Consecuencias
```
