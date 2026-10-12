# ADR-0001: Microservicios de grano medio por contexto acotado

- Estado: Propuesto
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

El SIGEUN 1.0 es un monolito que no permite desplegar ni versionar módulos de forma independiente. El plan de trabajo v01 propone microservicios, pero define los módulos por unidad orgánica (DASA, Facultades, Escuelas) y por nivel (pregrado, posgrado), lo que repite reglas en varios lugares. El equipo es pequeño (13 personas en la Fase 0) y tiene rotación.

## Decisión

- Usar **microservicios de grano medio**, uno por *bounded context* identificado con talleres de Event Storming: 34 servicios en la visión completa y unos 10 en la Fase 0.
- Facultad, escuela, sede y nivel son **atributos y ámbitos de autorización**, no servicios.
- Cada servicio tiene un equipo dueño, un esquema de datos propio, contratos publicados (OpenAPI/AsyncAPI) y su propio ciclo de despliegue.
- Se separa un servicio solo si tiene lenguaje, reglas y ritmo de cambio propios. Si dos servicios cambian siempre juntos, se fusionan.

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| Mantener y extender el monolito | No resuelve el problema de despliegue y versionado que motiva el plan |
| Monolito modular | Opción válida y más simple. Se descarta como destino porque los picos de matrícula y admisión piden escalado independiente y porque el plan exige despliegue modular. Sus reglas de modularidad se aplican dentro de cada servicio |
| Microservicios de grano fino (uno por submódulo o pantalla) | Más de 80 servicios inmanejables para el equipo; produce un monolito distribuido |
| Un servicio por unidad orgánica | Repite reglas (planes de estudio, horarios) en DASA, Facultades y Escuelas |

## Consecuencias

- (+) Despliegue independiente, escalado por dominio y aislamiento de fallas.
- (+) Lenguaje de negocio claro y dueños de proceso identificables.
- (−) Consistencia eventual entre dominios: se resuelve con eventos, sagas y copias locales de lectura (ADR-0003).
- (−) Requiere plataforma, observabilidad y prácticas DevOps desde el inicio (ADR-0005), y roles de arquitectura y DevOps en el equipo.
