# SIGEUN 2.0: análisis y propuesta de arquitectura de microservicios

Repositorio de arquitectura del **Sistema Integrado de Gestión Universitaria SIGEUN 2.0** de la Universidad Nacional de Moquegua (UNAM). Parte del *Plan de Trabajo "Fortalecimiento del SIGEUN 2.0 – Núcleo Académico", versión 01* (aprobado el 24/09/2026), lo analiza y propone cómo ejecutarlo según las buenas prácticas de ingeniería de software.

![Arquitectura de microservicios SIGEUN 2.0](diagramas/01-arquitectura-microservicios.png)

## Conclusión

El plan está bien alineado con el PEI/POI y con las CBC de SUNEDU, pero **no es ejecutable tal como está escrito**:

- Pide 9 módulos en unos 3 meses efectivos con 8 programadores, con la integración al final.
- La arquitectura de microservicios se describe en teoría, sin servicios, contratos, datos, seguridad ni despliegue.
- Faltan los roles que la sostienen (arquitecto, DevOps/SRE, seguridad, datos), los requisitos no funcionales y la estrategia de migración.
- Dos servidores no dan alta disponibilidad (la entidad decidió mantenerlos; ver [ADR-0010](docs/adr/ADR-0010-despliegue-con-los-equipos-del-plan.md)), y el presupuesto tiene inconsistencias (por ejemplo, el cronograma de equipos suma S/ 208,800 frente a S/ 455,800 declarados).

La propuesta lo convierte en un **programa por entregas (2026–2028)**: fundaciones en 2026 con el mismo presupuesto y el mismo número de personas, **34 microservicios por dominio** construidos de forma incremental, reutilizando Moodle, Koha, DSpace, SIAF, SIGA, AIRHSP y FirmaPerú, y reemplazando el SIGEUN 1.0 de forma progresiva.

## Contenido

| Documento | Qué contiene |
|---|---|
| [1. Análisis crítico del plan](docs/01-analisis-critico-del-plan.md) | Fortalezas, 34 hallazgos con severidad y evidencia, 10 inconsistencias internas, brechas de ingeniería |
| [2. Propuesta técnica mejorada](docs/02-propuesta-tecnica-mejorada.md) | Hoja de ruta, metodología según NTP-ISO/IEC 12207, requisitos no funcionales, pruebas, DevSecOps, seguridad y datos personales, migración de datos, equipo, presupuesto reformulado, gobernanza, riesgos, indicadores y entregables |
| [3. Arquitectura de microservicios](docs/03-arquitectura-microservicios.md) | Vistas C4, catálogo de los 34 servicios, trazabilidad de los 16 módulos, mapa de contextos, eventos, saga de matrícula, datos, seguridad, CI/CD, despliegue, observabilidad, migración y stack |
| [4. Guía de estudio](docs/04-guia-de-estudio.md) | Todo lo que el equipo debe saber para empezar, desde lo básico: fundamentos, ingeniería, arquitectura, plataforma, dominio universitario, uso de los equipos del plan, roles y **cómo trabajar con Claude Code** |
| [Decisiones de arquitectura (ADR)](docs/adr/README.md) | 10 decisiones con alternativas y consecuencias |
| [Diagramas](diagramas/) | PNG y SVG de los 4 diagramas, y una página HTML con todos ellos |

## Diagramas

| Diagrama | PNG | SVG |
|---|---|---|
| Arquitectura completa por capas | [PNG](diagramas/01-arquitectura-microservicios.png) | [SVG](diagramas/01-arquitectura-microservicios.svg) |
| Saga de matrícula con pago | [PNG](diagramas/02-saga-matricula.png) | [SVG](diagramas/02-saga-matricula.svg) |
| Migración progresiva desde el SIGEUN 1.0 | [PNG](diagramas/03-migracion-strangler.png) | [SVG](diagramas/03-migracion-strangler.svg) |
| Topología de despliegue (2 servidores del plan) | [PNG](diagramas/04-despliegue.png) | [SVG](diagramas/04-despliegue.svg) |

Para regenerar los diagramas después de editar `diagramas/fuente/build-diagramas.mjs`:

```bash
node diagramas/fuente/build-diagramas.mjs   # genera diagramas/sigeun2-arquitectura.html
npm install --no-save playwright            # una sola vez
node diagramas/fuente/exportar.mjs          # exporta PNG (2x) y SVG
```

Los documentos también incluyen diagramas en Mermaid, que GitHub muestra directamente y se editan como texto.
