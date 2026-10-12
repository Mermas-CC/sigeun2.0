# ADR-0009: Repositorios institucionales y trunk-based development

- Estado: Propuesto
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

El equipo se contrata por locación de servicios por periodos cortos. Si el código vive en cuentas personales o se entrega al final, la universidad pierde control y conocimiento. Con 34 servicios, un repositorio por servicio multiplica la configuración de CI y los cambios coordinados.

## Decisión

- Todo el código vive en la **organización institucional** de la UNAM (GitHub o GitLab autohospedado) desde el primer día. Los accesos se dan y retiran según el contrato.
- **Monorepos por capa:** `sigeun-services` (backend), `sigeun-web` (frontend), `sigeun-contracts`, `sigeun-platform`, `sigeun-gitops` y este repositorio de arquitectura. Cada servicio conserva build, imagen y despliegue independientes.
- **Trunk-based development:** ramas de vida corta, *pull request* con al menos una aprobación, `CODEOWNERS` por servicio, *quality gate* obligatorio.
- **Conventional Commits** y **versionado semántico** por servicio, con *changelog* automático.
- La entrega contractual se verifica en el repositorio (código fusionado, pruebas en verde, desplegado en QA), no con informes.

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| Un repositorio por servicio | Más sobrecarga de CI y de cambios coordinados para un equipo pequeño |
| GitFlow | Ramas largas, integración tardía y conflictos; no encaja con entrega continua |

## Consecuencias

- (+) Cambios atómicos entre servicios, librerías compartidas y una sola configuración de CI.
- (−) El CI debe construir solo lo que cambió (filtros por ruta) para mantener tiempos cortos.
