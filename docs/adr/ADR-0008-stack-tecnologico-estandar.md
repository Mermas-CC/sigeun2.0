# ADR-0008: Stack tecnológico estándar

- Estado: Propuesto
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

El plan presenta como ventaja que cada microservicio pueda usar un lenguaje distinto. En una universidad pública con contratos temporales, cada lenguaje adicional exige más conocimiento para mantener, operar y asegurar el sistema.

## Decisión

| Capa | Estándar |
|---|---|
| Backend de dominio | Java 21 o 25 (LTS) + Spring Boot en su versión con soporte vigente |
| Analítica e IA | Python 3.12+ (FastAPI, scikit-learn), solo en `analitica` e `ia-asistente` |
| Frontend | React + TypeScript + Vite, con sistema de diseño propio; PWA para móvil |
| Datos | PostgreSQL, Valkey, almacenamiento S3 compatible, OpenSearch |
| Mensajería | RabbitMQ |
| Pruebas | JUnit 5, Testcontainers, Pact, Playwright, k6 |

Todo servicio nuevo nace de la **plantilla estándar** (ver doc. 03, sec. 3.17). Una excepción al stack requiere un ADR propio.

## Alternativas consideradas

- .NET o Kotlin: equivalentes en capacidad. Se elige Java por la disponibilidad de talento local; si el equipo existente domina otro stack, este ADR se reemplaza por uno nuevo antes de iniciar R1.
- Libertad por servicio: descartada por el costo de mantenimiento.

## Consecuencias

- (+) Rotación de personas entre equipos sin reaprendizaje; librerías comunes (seguridad, outbox, observabilidad).
- (−) Menos libertad para usar herramientas especializadas; se canaliza con ADRs de excepción.
