# 1. Análisis crítico del Plan de Trabajo SIGEUN 2.0 (Versión 01)

> Documento analizado: *Plan de Trabajo "Fortalecimiento del Sistema Integrado de Gestión Universitaria – SIGEUN 2.0", Núcleo Académico*, Universidad Nacional de Moquegua (UNAM), versión 01, 21 páginas. Aprobado por el Rectorado el 24/09/2026.
>
> Fecha del análisis: 12/10/2026.

## 1.1 Ficha del plan

| Dato | Valor en el plan |
|---|---|
| Objetivo general | Implementar progresivamente los módulos del ecosistema SIGEUN 2.0 durante 2026–2027 |
| Alcance 2026 | 9 desarrollos: DASA, Escuelas, Aula virtual, Facultad, Docente, Estudiante, Recursos Humanos, Tesorería y pagos, Trámite documentario |
| Visión total | 16 módulos (Académico, Admisión, Estudiantes, Docente, Investigación, Calidad, Bienestar, Grados y Títulos, RR. HH., Tesorería, Logística, Trámite, Biblioteca, Infraestructura, Reportes, IA) |
| Plazo | 4 meses (setiembre–diciembre 2026) |
| Equipo | 13 profesionales por locación de servicios (1 analista, 1 diseñador UX/UI/BD, 4 programadores senior, 4 junior, 1 QA, 1 documentador, 1 coordinador) |
| Presupuesto | S/ 747,800: servicios S/ 292,000 (39 %) y equipos S/ 455,800 (61 %) |
| Arquitectura declarada | Microservicios, en reemplazo del SIGEUN monolítico |
| Norma de proceso citada | NTP-ISO/IEC 12207:2016 (RM N.° 041-2017-PCM) |

## 1.2 Veredicto

El plan está bien alineado en lo institucional: se vincula con el PEI/POI y las Condiciones Básicas de Calidad (CBC) de SUNEDU, define dueños de proceso y prioriza módulos. **Tal como está escrito no es técnicamente ejecutable.** Hay tres causas principales:

1. **El alcance, el plazo y el equipo no cuadran.** Se pide construir 9 módulos con 8 programadores en unos 3 meses efectivos. Eso deja alrededor de 2.7 meses-persona por módulo, y solo Matrícula con Programación Académica suele exigir varias veces esa cantidad. Además, el plan se aprobó el 24/09/2026, así que la Fase I (programada para setiembre) ya no se pudo ejecutar.
2. **La arquitectura se queda en la teoría.** El plan describe en qué consisten los microservicios en general, pero no define servicios, contratos, datos, mensajería, seguridad, despliegue ni operación. Tampoco hay en el equipo un arquitecto, un DevOps/SRE ni un especialista en seguridad, que son los perfiles que hacen viables los microservicios.
3. **Faltan los procesos de ingeniería que la propia NTP-ISO/IEC 12207 exige:** requisitos no funcionales, gestión de configuración, pruebas automatizadas, migración de datos, transición a producción, operación y mantenimiento.

La recomendación es **reformular el plan como un programa multianual por entregas (releases)**. El tramo 2026 debe dedicarse a las *fundaciones*: arquitectura, plataforma, identidad, datos maestros y un primer flujo de punta a punta. Los módulos se construyen de forma incremental en 2027–2028, reutilizando productos existentes (Moodle, Koha, DSpace, SIAF/SIGA-MEF, FirmaPerú) en lugar de reconstruirlos. El detalle está en [02-propuesta-tecnica-mejorada.md](02-propuesta-tecnica-mejorada.md) y en [03-arquitectura-microservicios.md](03-arquitectura-microservicios.md).

## 1.3 Fortalezas que se deben conservar

- Alineamiento explícito con OEI.04 / AEI.04.02, AEI.04.04 y AEI.04.05 del PEI 2026–2030 y con actividades del POI 2026.
- Justificación correcta del problema: el monolito actual impide el versionado y el despliegue modular.
- Mapa funcional amplio de 16 módulos, con submódulos y prioridad (Alta/Media).
- Cada módulo describe sus integraciones esperadas (por ejemplo, Tesorería con bancos, pasarelas, firma digital y analítica).
- Estructura de gobierno con patrocinador, comité directivo, dueños de proceso y **custodio de datos** (OTI + Registros Académicos).
- Mecanismos de control (reuniones semanales, comités mensuales, UAT) y una matriz de riesgos inicial.
- Mención obligatoria de la NTP-ISO/IEC 12207, que da el marco correcto para corregir el ciclo de vida.

## 1.4 Hallazgos

Severidad: **C** = crítico (impide el éxito), **A** = alto, **M** = medio, **B** = bajo.

### A. Alcance, plazo y planificación

| ID | Sev. | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| H-01 | C | Alcance inviable: 9 módulos en ~3 meses efectivos con 8 programadores. La integración total se programa recién en nov–dic (integración *big bang*). | Sec. 6.1, 7.1 | Programa multianual. El tramo 2026 se limita a fundaciones más un flujo vertical. Integración continua desde el día 1. |
| H-02 | C | El cronograma ya caducó: la Fase I (arquitectura, modelo de datos y levantamiento) estaba prevista para setiembre, y el plan se aprobó el 24/09/2026. La contratación de 13 locadores y la compra de equipos bajo la Ley N.° 32069 no se completan en semanas. | Firmas p. 1; sec. 7.1 y 8.2 | Reprogramar en el POI. Ejecutar en 2026 solo lo contratable a tiempo y asegurar la continuidad en el PIA/POI 2027. |
| H-03 | A | No hay diagnóstico AS-IS del SIGEUN 1.0 (tecnología, base de datos, volumen de datos, usuarios, deuda técnica, qué funciona). Sin él no se puede planificar la migración ni la convivencia. | Sec. V | Diagnóstico técnico como primer entregable de la Fase 0. |
| H-04 | A | Sin estrategia de transición. No se dice cómo convivirán el SIGEUN 1.0 y el 2.0, ni cómo se migran datos históricos (notas, actas, pagos) ni cuándo se apaga el sistema antiguo. | No figura | Patrón *Strangler Fig* con capa anticorrupción. Migración por dominio con ensayos y conciliación. |
| H-05 | A | Los módulos se definen por **unidad orgánica** (DASA, Facultades, Escuelas) y por **nivel** (pregrado/posgrado), no por capacidad de negocio. Planes de estudio, secciones y horarios aparecen repetidos en DASA, Escuelas y Facultades. | Sec. 5.1, 5.2.1 | Modelar por *bounded contexts* (curricular, programación, matrícula, evaluación, etc.). Facultad, escuela y nivel pasan a ser **ámbitos de autorización** y atributos, no módulos. |
| H-06 | A | Se propone construir un **Aula virtual** propia. El plan mismo la califica como riesgo de probabilidad e impacto altos. | Sec. 5.2.1, X | Usar Moodle (LMS libre y estándar) e integrarlo con SSO, LTI 1.3 y web services. |
| H-07 | M | Se incluyen módulos que en el Estado ya resuelven sistemas rectores: Logística y Patrimonio (SIGA-MEF), Tesorería y Presupuesto (SIAF-RP), Remuneraciones (AIRHSP/MCPP). | Sec. 5.1 | **Integrar, no reconstruir.** Construir solo lo propio de la universidad, como la recaudación de servicios académicos. |
| H-08 | M | El objetivo de "trazabilidad desde la admisión" no es coherente con un alcance 2026 que excluye Admisión, y aun así se compran lectores biométricos y de código de barras. | Sec. II, 5.1, 8.2 | Alinear las compras con el alcance real de cada entrega. |

### B. Arquitectura

| ID | Sev. | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| H-09 | C | La sección de arquitectura es genérica: no hay catálogo de servicios, límites de dominio, contratos de API, eventos, propiedad de datos ni vistas de despliegue. | Sec. V | Documentar con el modelo C4 y ADRs (ver doc. 03). |
| H-10 | A | Solo se mencionan las ventajas de los microservicios y se omiten sus costos: consistencia eventual, transacciones distribuidas, latencia, observabilidad y carga operativa. Para un equipo pequeño, adoptarlos sin plataforma ni prácticas DevOps produce un **monolito distribuido**. | Sec. V | Microservicios de grano medio por dominio (34 en la visión completa y unos 10 en la Fase 0). Plataforma común y patrones de resiliencia. |
| H-11 | A | "Modelo de datos unificado" contradice el principio de base de datos por servicio que el mismo plan dibuja. | Sec. 7.1 vs. p. 6 | Separar un **modelo canónico** (vocabulario y datos maestros compartidos) de los **esquemas privados** de cada servicio. |
| H-12 | A | "Interoperabilidad total mediante API REST" solo con llamadas síncronas genera acoplamiento temporal y fallas en cascada. | Sec. II | Combinar REST para consultas y comandos con **eventos de dominio** asíncronos (bus de mensajes y patrón *outbox*). |
| H-13 | M | El diagrama funcional pone un núcleo central "SIGEU-IA" por el que pasa todo. Ese núcleo se vuelve punto único de acoplamiento y de falla. | p. 7 | API Gateway y bus de eventos como infraestructura sin lógica de negocio. Cada dominio es dueño de su lógica. |
| H-14 | M | Se presenta como ventaja que "cada microservicio puede estar en un lenguaje diferente". Para una universidad pública con rotación de personal, el poliglotismo encarece el mantenimiento. | p. 5 | Un stack principal estándar más Python solo para analítica e IA (ADR-0008). |
| H-15 | A | Faltan componentes transversales: identidad y SSO, **registro único de personas**, notificaciones, gestión documental y firma digital, auditoría, motor de flujos, catálogos y estructura orgánica. | Sec. 5.1 | Incluirlos como servicios transversales de la Fase 0. |
| H-16 | A | No se mencionan las integraciones obligatorias o críticas con el Estado: PIDE (RENIEC, SUNEDU, SUNAT, MINEDU), SIAF-RP, SIGA, AIRHSP, comprobantes electrónicos de SUNAT, FirmaPerú, RENATI/ALICIA (repositorio de tesis) y CTI Vitae. | Sec. 5.2 | Capa de integración con adaptadores por sistema externo. Iniciar convenios y accesos en la Fase 0, porque toman meses. |

### C. Requisitos, calidad y ciclo de vida (NTP-ISO/IEC 12207)

| ID | Sev. | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| H-17 | C | No hay requisitos no funcionales medibles: concurrencia en matrícula, disponibilidad, tiempos de respuesta, RPO/RTO, accesibilidad, retención de datos. | No figura | Catálogo de requisitos no funcionales basado en ISO/IEC 25010 con metas cuantificadas. |
| H-18 | A | No se declara metodología de desarrollo. Las fases son en cascada: análisis en setiembre, construcción en paralelo y QA y documentación al final. | Sec. 6.1, 7.1 | Modelo híbrido: gobierno predictivo para contratos y presupuesto, ejecución ágil (Scrum) con entregas incrementales. |
| H-19 | A | La NTP-ISO/IEC 12207 se cita pero no se aplica. No hay gestión de configuración, verificación, validación, transición, operación ni mantenimiento. | p. 6 | Matriz de procesos 12207 → prácticas del proyecto (doc. 02, sec. 2.3). |
| H-20 | A | Un solo QA para 9 módulos, que interviene solo en la "fase de pruebas". Sin pruebas automatizadas. | Sec. 6.1 | Calidad integrada: pruebas automatizadas en cada commit, QA de automatización por equipo y *quality gates*. |
| H-21 | M | La documentación se deja para la "fase de cierre" y a cargo de un documentador. | Sec. 6.1 | *Docs-as-code* continuo: OpenAPI, ADRs y manuales versionados junto al código. |

### D. Seguridad, privacidad y cumplimiento

| ID | Sev. | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| H-22 | C | La seguridad se enuncia ("medidas y protocolos acorde a estándares vigentes") sin controles concretos. No figura la NTP-ISO/IEC 27001 (SGSI) exigida a las entidades públicas. | Sec. I, III | Seguridad desde el diseño: OWASP ASVS nivel 2, MFA, cifrado, gestión de secretos, auditoría, pentest antes de cada salida a producción. |
| H-23 | A | Se procesarán datos personales y **datos biométricos** (huella dactilar), que son datos sensibles, sin mencionar la Ley N.° 29733 ni su reglamento: consentimiento, registro de bancos de datos y medidas de seguridad. | Sec. 5.1, 8.2 | Evaluación de impacto en privacidad, registro de bancos de datos personales, minimización y anonimización en ambientes de prueba. |
| H-24 | M | El módulo de IA no considera la Ley N.° 31814 y su reglamento (uso de IA en el Estado), ni gobierno de datos, sesgos o supervisión humana. | Sec. 5.1 | Postergar la IA hasta tener datos de calidad (2028), con casos de uso medibles y supervisión humana. |
| H-25 | M | No se precisa que el código fuente y los derechos patrimoniales serán de la universidad. Con locadores individuales, el código puede quedar en cuentas personales. | Sec. 6.1 | Cláusulas de cesión de derechos, repositorio institucional desde el día 1 y entregables verificables en el repositorio. |

### E. Equipo

| ID | Sev. | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| H-26 | C | Faltan los roles críticos de microservicios: **arquitecto de software, DevOps/SRE, seguridad y DBA/arquitecto de datos**. | Sec. 6.1 | Recomponer el equipo con el mismo número de personas (doc. 02, sec. 2.10). |
| H-27 | A | Un solo analista y un solo diseñador "secuenciales" para 9 módulos: cuello de botella que bloquea a 8 programadores. Además, el perfil "UX/UI/BD" mezcla diseño de experiencia con diseño de bases de datos. | Sec. 6.1 | Separar UX/UI de arquitectura de datos. Analistas por equipo de dominio. |
| H-28 | A | Contratos de 4 meses sin plan de continuidad. En diciembre el conocimiento se va con los locadores y no hay quién opere una plataforma de microservicios. | Sec. 6.1 | Personal de la OTI integrado al equipo, transferencia de conocimiento, runbooks y presupuesto de operación 2027. |
| H-29 | M | Honorario de "senior" (S/ 6,000) igual al del analista y apenas S/ 1,000 sobre el junior. Hay riesgo de no atraer perfiles con experiencia real en sistemas distribuidos. | Sec. 8.1 | Revisar con un estudio de mercado. Priorizar experiencia comprobable en los TDR. |

### F. Infraestructura y presupuesto

| ID | Sev. | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| H-30 | C | Con **dos servidores** no hay alta disponibilidad: un clúster Kubernetes y una base de datos replicada necesitan al menos 3 nodos para tener quórum. Tampoco hay almacenamiento de respaldo, copia fuera del sitio ni plan de recuperación ante desastres. | Sec. 6.1 (equipos) | Al menos 3 nodos homogéneos, NAS de respaldo, red de 10 GbE y copia externa (por ejemplo en la sede Ilo o en la nube). |
| H-31 | A | El servidor sin GPU tiene solo 1.92 TB de disco para bases de datos, logs, documentos digitalizados y contenido del aula virtual. | p. 12 | Dimensionar el almacenamiento según los volúmenes del diagnóstico AS-IS. |
| H-32 | A | El servidor con GPU (para IA) se compra en 2026, aunque la IA es de prioridad media y no tiene casos de uso definidos. | p. 12, sec. 5.1 | Diferir la GPU hasta la entrega de IA. Usar ese monto en alta disponibilidad y respaldo. |
| H-33 | M | El equipamiento del equipo no se justifica por la función: estaciones con 24 núcleos y GPU de 24 GB, monitores OLED de 34" (sufren *burn-in* con interfaces estáticas como un IDE), 3 impresoras láser de S/ 15,000 en un proyecto de "cero papel" y lectores de código de barras a S/ 2,000 cada uno. | p. 13–15, 19 | Especificaciones funcionales con estudio de mercado. Reasignar el ahorro a perfiles críticos (doc. 02, sec. 2.11). |
| H-34 | M | El 61 % del presupuesto se va en hardware en un plan cuyo producto es software. No se presupuestan licencias, certificados, pruebas de penetración, capacitación ni respaldo externo. | Sec. VIII | Presupuesto por capacidades: personas, plataforma, seguridad y gestión del cambio. |

## 1.5 Inconsistencias internas del documento

| # | Inconsistencia | Dónde |
|---|---|---|
| I-01 | El cronograma financiero de equipos suma S/ 208,800 (192,000 en setiembre + 16,800 en octubre), pero el total declarado es **S/ 455,800**: faltan S/ 247,000 por programar. | Sec. VIII, fila 1.1.2 |
| I-02 | Cantidad de equipos: la sec. VIII declara 63 unidades y la sec. 8.2 suma 63, pero el resumen (sec. 9) suma **61**. | Sec. VIII, 8.2, 9 |
| I-03 | Periféricos: la sec. 8.2 lista 3 tipos (32 unidades) y la sec. 9 lista 4 tipos (30 unidades), incluida "Memoria RAM 32 GB **DDR4**", que no figura en el cronograma físico y no es compatible con los equipos DDR5 que se compran. | Sec. 8.2 vs. 9 |
| I-04 | La sec. 5.2 describe 5 módulos para 2026, pero el cronograma incluye **Recursos Humanos**, que no tiene descripción. "Seguimiento al egresado" aparece en la sec. 5.1 pero no se describe ni se programa. | Sec. 5.2 vs. 7.1 |
| I-05 | El plan se titula "Núcleo académico" pero incluye módulos administrativos (RR. HH., Tesorería, Trámite). | Portada, 7.1 |
| I-06 | El sistema se llama "SIGEUN 2.0" y "SIGEU-IA" según la sección. | p. 7, sec. IX |
| I-07 | La numeración se rompe: la sección "IX" contiene los apartados 10.1 y 10.2, y la "9. Resumen del presupuesto" está entre VIII y IX. | Sec. 9, IX, X |
| I-08 | La introducción invoca la Ley N.° 32185, art. 80.2 d), que no figura en la base legal (sec. III). Las leyes de presupuesto son anuales: hay que verificar que la disposición se aplique al año fiscal 2026. Se cita el D.S. N.° 301-2025-EF (UIT 2026) sin decir para qué se usa. | Sec. I, III |
| I-09 | El servidor con 2 GPU y 128 GB de RAM (S/ 78,000) cuesta menos que el servidor sin GPU (S/ 130,000). Es posible por los 768 GB de RAM, pero debe sustentarse con un estudio de mercado. | Sec. 9 |
| I-10 | Se pide "Garantía 24 meses" y "Garantía 12 meses" en la misma ficha técnica de monitores. | p. 14 |

## 1.6 Brechas frente a buenas prácticas de ingeniería de software

Esto **no aparece en el plan** y debe estar en cualquier proyecto de esta envergadura:

- Control de versiones con estrategia de ramas, revisión de código obligatoria y versionado semántico.
- Integración y entrega continuas (CI/CD) con *quality gates*: pruebas, cobertura, análisis estático y escaneo de vulnerabilidades.
- Ambientes separados (desarrollo, QA, preproducción, producción) e infraestructura como código.
- Contratos de API primero (OpenAPI/AsyncAPI) y pruebas de contrato entre servicios.
- Observabilidad (logs, métricas y trazas distribuidas) con alertas y objetivos de nivel de servicio (SLO).
- Respaldo 3-2-1 con restauraciones probadas, y RPO/RTO definidos.
- Plan de migración de datos con ensayos y conciliación firmada por el custodio de datos.
- Plan de salida a producción (*cutover*), *hypercare* y mesa de ayuda.
- Gestión del cambio y capacitación estructurada (el riesgo "resistencia al cambio" se califica de probabilidad alta, pero no tiene plan).
- Indicadores de producto y de ingeniería (DORA), no solo "% de avance".
- Definición de Listo y de Terminado (DoR/DoD) y criterios de aceptación por historia.

## 1.7 Conclusión

El plan acierta en el **qué** (modernizar el SIGEUN con una arquitectura modular alineada a las CBC) y falla en el **cómo**. Corregirlo no exige más dinero en 2026. Exige:

1. Recortar el alcance de 2026 a fundaciones ejecutables.
2. Recomponer el equipo con los roles técnicos que faltan, sin aumentar el número de personas.
3. Reasignar parte del gasto en hardware hacia alta disponibilidad, respaldo y especialistas.
4. Formalizar la arquitectura, los requisitos no funcionales, la seguridad y la migración antes de escribir código de negocio.
5. Asegurar la continuidad presupuestal para 2027–2028.
