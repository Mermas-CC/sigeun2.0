# ADR-0007: Migración progresiva Strangler Fig con capa anticorrupción

- Estado: Propuesto
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

El SIGEUN 1.0 está en producción y sostiene la operación académica. Reemplazarlo de golpe (*big bang*) en una fecha pone en riesgo la matrícula, el registro de notas y los pagos. El plan no define cómo convivirán ambos sistemas.

## Decisión

- Poner el **API Gateway delante del SIGEUN 1.0** desde la Fase 0.
- Mover rutas al SIGEUN 2.0 **dominio por dominio**, solo después de migrar y conciliar sus datos.
- Servicio **`legacy-acl`** (capa anticorrupción): lee cambios del 1.0 (CDC o vistas), los traduce al modelo canónico y los publica como eventos. Escribe de vuelta en el 1.0 solo lo indispensable mientras un dominio dependiente siga allí.
- El 1.0 queda en **solo lectura** como archivo histórico al cierre de R4.

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| Big bang | Riesgo inaceptable sobre la operación académica |
| Ejecución en paralelo completa | Doble digitación y conflictos de datos |

## Consecuencias

- (+) Cada entrega pasa a producción con riesgo acotado y se puede revertir.
- (−) Mientras dure la convivencia hay que mantener `legacy-acl` y conciliaciones periódicas.
