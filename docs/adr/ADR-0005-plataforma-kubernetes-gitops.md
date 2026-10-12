# ADR-0005: Kubernetes on-premise de 3 nodos con GitOps

- Estado: Reemplazado por [ADR-0010](ADR-0010-despliegue-con-los-equipos-del-plan.md) para 2026 (se mantiene como objetivo de crecimiento)
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

El plan adquiere 2 servidores sin estrategia de alta disponibilidad ni respaldo. Un clúster Kubernetes, PostgreSQL replicado y RabbitMQ necesitan quórum, es decir, al menos 3 nodos. Microservicios sin automatización de despliegue y sin observabilidad son inoperables.

## Decisión

- **3 nodos de cómputo homogéneos** con Proxmox VE (sin costo de licencias) y red de 10/25 GbE.
- **Kubernetes RKE2** con dos clústeres: producción y no producción (`dev`, `qa`, `staging`).
- **GitOps con Argo CD**: el estado de cada ambiente vive en el repositorio `sigeun-gitops`; nadie aplica cambios manuales en producción.
- **Observabilidad** con OpenTelemetry, Prometheus, Loki, Tempo y Grafana desde la Fase 0.
- **Respaldo 3-2-1**: NAS con *snapshots* inmutables y copia cifrada fuera del sitio (sede Ilo o nube). Restauración probada cada trimestre.
- El nodo con GPU se adquiere en R4, cuando exista el caso de uso de IA.
- Revisar cada año el costo total de propiedad de una opción híbrida (nube para recuperación ante desastres o picos).

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| 2 servidores (plan original) | Sin quórum: la caída de uno detiene el sistema |
| Docker Compose en VMs | No ofrece autoescalado, despliegues progresivos ni autorreparación |
| Nube pública completa | Viable técnicamente; requiere análisis de costo recurrente, contratación y conectividad. Se deja como opción para respaldo y recuperación |

## Consecuencias

- (+) Alta disponibilidad real, despliegues reproducibles y auditables.
- (−) Requiere al menos un ingeniero DevOps/SRE permanente y capacitación de la OTI.
