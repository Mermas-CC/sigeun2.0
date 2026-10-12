# ADR-0006: Reutilizar e integrar antes que construir

- Estado: Propuesto
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

El plan propone construir desde cero un aula virtual, logística y patrimonio, tesorería y remuneraciones. Ya existen productos maduros y de uso obligatorio o extendido en el Estado y en universidades. El presupuesto y el equipo son limitados.

## Decisión

| Necesidad | Se usa | Lo que se construye |
|---|---|---|
| Aula virtual | **Moodle** (código abierto) | `lms-connector`: sincronización con LTI 1.3 y web services, SSO |
| Biblioteca física | **Koha** (código abierto) | `biblioteca`: conector de préstamos y multas como impedimentos |
| Repositorio de tesis | **DSpace**, cosechable por OAI-PMH (RENATI/ALICIA) | Envío desde `investigacion` y `grados-titulos` |
| Logística y patrimonio | **SIGA-MEF** | `logistica`: consulta e integración |
| Presupuesto, tesorería, contabilidad | **SIAF-RP** | `pagos` (recaudación propia) + `interop-mef` |
| Planillas | **AIRHSP / MCPP** | `rrhh`: legajo, escalafón, asistencia |
| Firma digital | **FirmaPerú** | `documentos`: integración y verificación |
| Identidad | **Keycloak** + Entra ID | Configuración y federación |
| Gestión documental | Cumplimiento del **Modelo de Gestión Documental**; evaluar soluciones del Software Público Peruano antes de construir | `tramite` |

## Alternativas consideradas

Construir todo a medida: mayor control aparente, pero multiplica el alcance, duplica sistemas rectores del Estado y crea deuda de mantenimiento.

## Consecuencias

- (+) El alcance se concentra en lo que diferencia a la universidad (procesos académicos).
- (+) Cumplimiento normativo heredado de los sistemas rectores.
- (−) Dependencia de las interfaces que ofrecen terceros: se aísla con adaptadores (capa anticorrupción) para no contaminar el modelo propio.
