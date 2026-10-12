# ADR-0010: Despliegue con los equipos del plan (2 servidores)

- Estado: Aceptado (reemplaza a ADR-0005 para 2026)
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0, por decisión de la entidad

## Contexto

ADR-0005 proponía 3 nodos homogéneos, NAS de respaldo y red de 10/25 GbE. La entidad confirmó que **los equipos del Plan de Trabajo v01 no cambian**: un servidor sin GPU (48 núcleos, 768 GB, 2 × 960 GB SSD con RAID, 4 × 1 GbE), un servidor con GPU (32 núcleos / 64 hilos, 128 GB, 2 GPU con 40 GB VRAM en total, 1 TB NVMe + 7.68 TB, 2 × 10 GbE), 8 estaciones, 5 laptops, 5 SSD externos y periféricos.

## Decisión

- **Servidor 1 (sin GPU) = producción** y staging aislado con cuotas. Los 2 SSD en RAID 1 (≈ 960 GB útiles).
- **Servidor 2 (con GPU) = todo lo demás:** dev y qa, runner de CI y Harbor, observabilidad, respaldos (Proxmox Backup Server y almacén S3 de WAL y objetos), PostgreSQL en espera y una VM `ia-lab` con las GPU, encendida a demanda (OCR de actas para la migración, pruebas de IA sin sacar datos de la universidad).
- **Proxmox VE** en ambos servidores. Kubernetes RKE2 en VMs: 3 VM para producción (para actualizar nodos sin cortar el servicio), 1 para staging y 1 o 2 para no producción.
- **PostgreSQL (CloudNativePG):** primaria en el servidor 1, WAL continuo hacia el almacén del servidor 2 y una réplica en espera en el servidor 2.
- **Respaldo 3-2-1:** original en el servidor 1, copia en el servidor 2 y **copia semanal cifrada en los SSD externos del plan, en rotación y guardados fuera del campus**.
- **Contingencia:** runbook de conmutación al servidor 2 (apagar dev/qa, promover la réplica, desplegar producción desde Git) con meta RTO ≤ 4 h y RPO ≤ 15 min para la base de datos. Simulacro dos veces al año.
- Detalle de asignación de recursos y runbook: [guía de estudio, sección 7](../04-guia-de-estudio.md#7-los-equipos-del-plan-cómo-sacarles-provecho).

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| Producción en el servidor con GPU | Su disco de datos no tiene redundancia y tiene menos RAM |
| Producción repartida en ambos servidores | Sin un tercer voto (quórum) se arriesga una división de cerebro (*split-brain*); y las copias quedarían en el mismo equipo que el original |
| Sin Kubernetes (Docker Compose) | Más simple al inicio, pero obliga a migrar de plataforma en 2027 y pierde GitOps y despliegues progresivos |

## Consecuencias

- (−) **No hay alta disponibilidad de hardware:** si falla el servidor 1, el servicio cae hasta conmutar. Se mitiga con el runbook, los simulacros y el congelamiento de cambios en matrícula y admisión.
- (−) El disco del servidor 1 es la restricción principal; se monitorea cada semana.
- (+) Respaldos, observabilidad y réplica sobreviven a la falla de producción.
- **Necesidades para el presupuesto 2027:** discos para las bahías libres del servidor 1, tarjeta de 10 GbE (OCP) para el servidor 1, un segundo disco en el servidor 2 para redundancia y un tercer nodo cuando se busque alta disponibilidad real (ADR-0005 queda como objetivo).
