# ADR-0003: REST síncrono + eventos asíncronos con transactional outbox

- Estado: Propuesto
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

El plan propone "interoperabilidad total mediante API REST". Solo con llamadas síncronas, una matrícula dependería en línea de pagos, programación, historial y biblioteca: si uno falla, falla todo. Esa dependencia es más grave en los picos de matrícula.

## Decisión

- **REST síncrono** solo para comandos y consultas del usuario (canal → BFF → servicio dueño), con como máximo un salto adicional entre servicios.
- **Eventos de dominio asíncronos** sobre **RabbitMQ** (colas *quorum*) para todo proceso entre dominios.
- **Transactional outbox:** el evento se escribe en la misma transacción que el cambio de estado y un relay lo publica. Entrega "al menos una vez", **consumidores idempotentes** y cola de mensajes fallidos.
- **Copias locales de solo lectura** alimentadas por eventos para los datos de otros dominios que se consultan seguido.
- **Sagas** para procesos con compensación (matrícula con pago, trámites con pago). Las de flujo humano se orquestan con el servicio `workflow`.
- Contratos de eventos en **AsyncAPI**, con versión en el nombre del tipo de mensaje cuando hay cambios incompatibles.
- Resiliencia en llamadas síncronas: *timeouts*, reintentos con *backoff*, *circuit breaker* (Resilience4j).

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| Solo REST | Acoplamiento temporal y fallas en cascada |
| Kafka | Más potente (replay, alto volumen), pero su operación es más costosa a esta escala. Se puede reevaluar si el volumen lo justifica |
| Transacciones distribuidas (2PC) | No escalan, no las soportan los brokers modernos y bloquean recursos |

## Consecuencias

- (+) La matrícula sigue funcionando aunque `pagos` esté temporalmente caído.
- (+) Nuevos consumidores (por ejemplo, analítica) se suman sin tocar al productor.
- (−) Consistencia eventual visible para el usuario: los estados intermedios ("pendiente de pago") deben diseñarse en la interfaz.
- (−) Se necesitan trazas distribuidas para seguir un proceso entre servicios.
