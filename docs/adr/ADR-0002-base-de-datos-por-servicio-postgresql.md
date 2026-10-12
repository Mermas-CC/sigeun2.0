# ADR-0002: Base de datos por servicio sobre PostgreSQL

- Estado: Propuesto
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

El plan habla de un "modelo de datos unificado", lo que contradice el principio de base de datos por servicio. A la vez, la universidad necesita un vocabulario común (persona, programa, periodo, curso) y reportes institucionales que cruzan dominios. La infraestructura es limitada (3 nodos).

## Decisión

- **Modelo canónico** compartido solo como vocabulario de contratos y eventos.
- **Un esquema y un usuario de base de datos por servicio** en un clúster PostgreSQL de alta disponibilidad (CloudNativePG: 1 primaria + 2 réplicas). Ningún servicio tiene permisos sobre esquemas ajenos.
- Los servicios críticos (`matricula`, `pagos`, `banco-preguntas`) pueden migrarse a instancias propias sin cambiar código.
- Migraciones de esquema versionadas con Flyway dentro del repositorio del servicio.
- Los reportes que cruzan dominios salen del **almacén de datos**, alimentado por CDC (Debezium) desde réplicas, nunca de consultas cruzadas en producción.
- `personas` es el registro maestro de toda persona.

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| Una base de datos compartida con tablas comunes | Acoplamiento total: cualquier cambio de esquema rompe a otros servicios |
| Una instancia física por servicio desde el inicio | Costo operativo y de hardware desproporcionado para 3 nodos |
| Motores distintos por servicio (políglota) | Más conocimiento operativo para un equipo pequeño |

## Consecuencias

- (+) Aislamiento lógico con costo operativo bajo; ruta clara hacia el aislamiento físico.
- (+) Un solo motor que operar, respaldar y monitorear.
- (−) El clúster compartido es un dominio de falla común: se mitiga con alta disponibilidad, límites de conexiones por servicio y monitoreo.
- (−) Se necesita disciplina (revisión de permisos en CI) para evitar accesos cruzados.
