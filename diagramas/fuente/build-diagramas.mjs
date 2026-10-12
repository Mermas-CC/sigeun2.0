// Genera diagramas/sigeun2-arquitectura.html con los 4 diagramas SVG de la arquitectura SIGEUN 2.0.
// Uso: node diagramas/fuente/build-diagramas.mjs
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, '..', 'sigeun2-arquitectura.html');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const REL = { F0: 0, R1: 1, R2: 2, R3: 3, R4: 4 };

// ---------- primitivas ----------
const markers = (p) => `<defs>
  <marker id="${p}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker>
  <marker id="${p}-e" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah-ev"/></marker>
</defs>`;

function badge(x, y, rel) {
  return `<rect x="${x}" y="${y}" width="26" height="15" rx="3" class="rel rel${REL[rel]}"/>` +
    `<text x="${x + 13}" y="${y + 11}" text-anchor="middle" class="t-badge">${rel}</text>`;
}

// Caja de microservicio: nombre en monoespaciada + responsabilidad + etiqueta de entrega
function svc(x, y, w, h, id, desc, rel) {
  const idY = h >= 46 ? y + 20 : y + 17;
  const dY = h >= 46 ? y + 37 : y + 32;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="d-box"/>` +
    `<text x="${x + 10}" y="${idY}" class="t-id">${esc(id)}</text>` +
    `<text x="${x + 10}" y="${dY}" class="t-sub">${esc(desc)}</text>` +
    (rel ? badge(x + w - 34, y - 8, rel) : '') + `</g>`;
}

// Caja genérica: título + subtítulo. cls: d-box | d-ext | d-acc
function box(x, y, w, h, title, sub, cls = 'd-box', titleCls = 't-title') {
  const tY = sub ? y + h / 2 - 3 : y + h / 2 + 4.5;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="${cls}"/>` +
    `<text x="${x + 10}" y="${tY}" class="${titleCls}">${esc(title)}</text>` +
    (sub ? `<text x="${x + 10}" y="${tY + 16}" class="t-sub">${esc(sub)}</text>` : '') + `</g>`;
}

function panel(x, y, w, h, title, count, cls = 'd-panel') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${cls}"/>` +
    `<text x="${x + 12}" y="${y + 17}" class="t-group">${esc(title)}</text>` +
    (count ? `<text x="${x + w - 12}" y="${y + 17}" text-anchor="end" class="t-count">${esc(count)}</text>` : '');
}

function line(p, x1, y1, x2, y2, { ev = false, start = false, end = true, dash = false } = {}) {
  const m = ev ? `${p}-e` : `${p}-a`;
  const cls = ev ? 'd-edge d-edge-ev' : dash ? 'd-edge d-edge-dash' : 'd-edge';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"` +
    (end ? ` marker-end="url(#${m})"` : '') + (start ? ` marker-start="url(#${m})"` : '') + `/>`;
}

function path(p, d, { ev = false, end = true, dash = false } = {}) {
  const m = ev ? `${p}-e` : `${p}-a`;
  const cls = ev ? 'd-edge d-edge-ev' : dash ? 'd-edge d-edge-dash' : 'd-edge';
  return `<path d="${d}" class="${cls}"${end ? ` marker-end="url(#${m})"` : ''}/>`;
}

const lbl = (x, y, t, anchor = 'middle', cls = 't-edge') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls} halo">${esc(t)}</text>`;

// ---------- Diagrama 1: arquitectura completa ----------
function diagramaArquitectura() {
  const P = 'd1';
  const W = 1680, H = 1072;
  const X0 = 152;
  let s = '';

  // Etiquetas de capa en el margen izquierdo
  const capas = [
    ['CANALES', 51], ['BORDE', 151], ['DOMINIOS', 353], ['EVENTOS', 529],
    ['TRANSVERSALES', 623], ['DATOS', 723], ['INTEGRACIÓN', 867], ['PLATAFORMA', 1017],
  ];
  s += `<line x1="138" y1="16" x2="138" y2="1056" class="d-rule"/>`;
  for (const [t, y] of capas) s += `<text x="20" y="${y}" class="t-layer">${t}</text>`;

  // Canales
  const canales = [
    ['Portal público', 'admisión, mesa de partes', 'd-box'],
    ['Portal estudiante', 'web adaptable + PWA', 'd-box'],
    ['Portal docente', 'carga, sílabos, notas', 'd-box'],
    ['Backoffice', 'DASA, facultades, oficinas', 'd-box'],
    ['Tableros BI', 'Superset · RTC · CBC', 'd-box'],
    ['Aula virtual', 'Moodle (existente)', 'd-ext'],
    ['Asistente virtual', 'chat con IA (R4)', 'd-box'],
  ];
  canales.forEach(([t, sub, cls], i) => {
    const x = X0 + i * 218;
    s += box(x, 20, 204, 54, t, sub, cls);
    s += `<line x1="${x + 102}" y1="74" x2="${x + 102}" y2="92" class="d-edge"/>`;
  });
  s += `<line x1="247" y1="92" x2="${X0 + 6 * 218 + 102}" y2="92" class="d-edge"/>`;
  s += line(P, 247, 92, 247, 119);
  s += lbl(256, 110, 'HTTPS · TLS 1.3', 'start');

  // Borde
  s += box(152, 120, 190, 54, 'WAF + Ingress', 'OWASP CRS, límite de tasa');
  s += box(392, 120, 190, 54, 'API Gateway', 'rutas, JWT, cuotas');
  ['Público', 'Estudiante', 'Docente', 'Backoffice'].forEach((t, i) => {
    s += box(632 + i * 160, 120, 150, 54, `BFF ${t}`, 'agrega por canal');
  });
  s += box(1312, 120, 172, 54, 'Keycloak (IAM)', 'SSO, MFA, RBAC + ABAC', 'd-acc');
  s += box(1532, 120, 132, 54, 'Entra ID', 'cuentas M365', 'd-ext');
  s += line(P, 342, 147, 391, 147) + lbl(367, 140, 'API');
  s += line(P, 582, 147, 631, 147) + lbl(607, 140, 'enruta');
  s += line(P, 1262, 147, 1311, 147, { dash: true }) + lbl(1287, 140, 'token');
  s += line(P, 1484, 147, 1531, 147, { start: true }) + lbl(1508, 140, 'federa');

  // BFF -> dominios
  s += `<line x1="947" y1="174" x2="947" y2="196" class="d-edge"/>`;
  s += `<line x1="479" y1="196" x2="1497" y2="196" class="d-edge"/>`;
  for (const x of [479, 1068, 1497]) s += line(P, x, 196, x, 221);
  s += lbl(957, 190, 'REST · OpenAPI · síncrono', 'start');

  // Dominios, fila 1
  const col = (px, c) => px + 12 + c * 160;
  s += panel(152, 222, 654, 148, 'Académico (núcleo)', '7 servicios');
  const aca = [
    [0, 0, 'curricular', 'planes y cursos', 'R1'],
    [1, 0, 'programacion', 'secciones y horarios', 'R1'],
    [2, 0, 'matricula', 'matrícula y cupos', 'R1'],
    [3, 0, 'evaluacion', 'notas y actas', 'R2'],
    [0, 1, 'historial', 'récord y ranking', 'R2'],
    [1, 1, 'tutoria', 'tutoría y alertas', 'R2'],
    [2, 1, 'lms-connector', 'sincroniza Moodle', 'R1'],
  ];
  for (const [c, r, id, d, rel] of aca) s += svc(col(152, c), 252 + r * 58, 150, 48, id, d, rel);
  s += `<text x="${col(152, 3) + 4}" y="331" class="t-note">pregrado y posgrado:</text>`;
  s += `<text x="${col(152, 3) + 4}" y="347" class="t-note">atributo, no módulo</text>`;

  s += panel(821, 222, 494, 148, 'Comunidad universitaria', '6 servicios');
  const com = [
    [0, 0, 'estudiantes', 'expediente y estados', 'R1'],
    [1, 0, 'docentes', 'perfil y carga', 'R1'],
    [2, 0, 'admision', 'postulación y examen', 'R2'],
    [0, 1, 'banco-preguntas', 'aislado y cifrado', 'R2'],
    [1, 1, 'grados-titulos', 'expediente y diploma', 'R3'],
    [2, 1, 'egresados', 'seguimiento y empleo', 'R3'],
  ];
  for (const [c, r, id, d, rel] of com) s += svc(col(821, c), 252 + r * 58, 150, 48, id, d, rel);

  s += panel(1330, 222, 334, 148, 'Administración', '4 servicios');
  const adm = [
    [0, 0, 'pagos', 'tasas, caja, CPE', 'R1'],
    [1, 0, 'tramite', 'mesa de partes, MGD', 'F0'],
    [0, 1, 'rrhh', 'legajo y escalafón', 'R3'],
    [1, 1, 'logistica', 'patrimonio vía SIGA', 'R4'],
  ];
  for (const [c, r, id, d, rel] of adm) s += svc(col(1330, c), 252 + r * 58, 150, 48, id, d, rel);

  // Dominios, fila 2
  s += panel(152, 386, 494, 90, 'Investigación y calidad', '3 servicios');
  [['investigacion', 'proyectos y tesis', 'R3'], ['calidad', 'CBC y acreditación', 'R3'], ['biblioteca', 'Koha y DSpace', 'R3']]
    .forEach(([id, d, rel], c) => { s += svc(col(152, c), 416, 150, 48, id, d, rel); });
  s += panel(661, 386, 334, 90, 'Bienestar y campus', '2 servicios');
  [['bienestar', 'comedor, salud, becas', 'R3'], ['infraestructura', 'aulas y ambientes', 'R1']]
    .forEach(([id, d, rel], c) => { s += svc(col(661, c), 416, 150, 48, id, d, rel); });
  s += panel(1010, 386, 334, 90, 'Analítica e IA', '2 servicios');
  [['ia-asistente', 'RAG sobre normativa', 'R4'], ['analitica', 'alerta de deserción', 'R4']]
    .forEach(([id, d, rel], c) => { s += svc(col(1010, c), 416, 150, 48, id, d, rel); });

  // Leyenda
  s += `<rect x="1359" y="386" width="305" height="90" rx="8" class="d-legend"/>`;
  s += `<text x="1371" y="405" class="t-count">LEYENDA</text>`;
  ['F0', 'R1', 'R2', 'R3', 'R4'].forEach((r, i) => { s += badge(1371 + i * 30, 413, r); });
  s += `<text x="1525" y="424" class="t-legend">entrega que lo construye</text>`;
  s += `<rect x="1371" y="434" width="26" height="14" rx="3" class="d-ext"/>`;
  s += `<text x="1405" y="445" class="t-legend">sistema o producto existente</text>`;
  s += `<text x="1371" y="467" class="t-legend"><tspan class="t-id-sm">matricula</tspan> = microservicio · 34 + 4 BFF</text>`;

  // Bus de eventos
  for (const x of [399, 828, 1177]) s += line(P, x, 478, x, 505, { ev: true, start: true });
  s += lbl(408, 496, 'publican y consumen eventos', 'start', 't-edge-ev');
  s += `<rect x="152" y="506" width="1512" height="38" rx="6" class="d-bus"/>`;
  s += `<text x="908" y="530" text-anchor="middle" class="t-bus">Bus de eventos de dominio · RabbitMQ · outbox transaccional · consumidores idempotentes · contratos AsyncAPI</text>`;
  for (const x of [485, 908, 1331]) s += line(P, x, 545, x, 573, { ev: true, start: true });

  // Transversales
  s += panel(152, 574, 1512, 90, 'Servicios transversales de negocio', '7 servicios');
  const tra = [
    ['personas', 'registro único + RENIEC', 'F0'],
    ['organizacion', 'facultades, escuelas, sedes', 'F0'],
    ['documentos', 'plantillas, PDF, firma', 'F0'],
    ['notificaciones', 'correo, SMS, push', 'F0'],
    ['workflow', 'BPMN y sagas', 'R2'],
    ['auditoria', 'registro inmutable', 'F0'],
    ['reportes', 'PDF y Excel operativos', 'R1'],
  ];
  tra.forEach(([id, d, rel], i) => { s += svc(164 + i * 214, 604, 204, 48, id, d, rel); });

  // Datos
  s += line(P, 302, 664, 302, 693);
  s += lbl(311, 684, 'cada servicio escribe solo en su esquema', 'start');
  const db = (x, w, t, sub) => {
    const cx = x + 18, cy = 707;
    return `<g><rect x="${x}" y="694" width="${w}" height="50" rx="5" class="d-box"/>` +
      `<path d="M${cx - 7},${cy} v14 a7,3 0 0 0 14,0 v-14" class="d-cyl"/>` +
      `<ellipse cx="${cx}" cy="${cy}" rx="7" ry="3" class="d-cyl"/>` +
      `<text x="${x + 34}" y="${716}" class="t-title">${esc(t)}</text>` +
      `<text x="${x + 34}" y="${732}" class="t-sub">${esc(sub)}</text></g>`;
  };
  s += db(152, 300, 'PostgreSQL HA', 'un esquema y usuario por servicio');
  s += db(516, 300, 'Almacén de datos', 'Debezium → dbt → BI e IA');
  s += db(830, 270, 'Valkey', 'caché, sesiones, cupos');
  s += db(1114, 270, 'Objetos S3', 'documentos y actas cifrados');
  s += db(1398, 266, 'OpenSearch', 'búsqueda de texto y logs');
  s += line(P, 452, 719, 515, 719) + lbl(484, 712, 'CDC');

  // Integración y externos
  s += panel(152, 774, 300, 178, 'Integración y anticorrupción', '');
  const integ = [
    ['interop-estado', 'PIDE: RENIEC, SUNEDU, SUNAT', 'F0'],
    ['interop-mef', 'SIAF-RP, SIGA, AIRHSP', 'R1'],
    ['legacy-acl', 'traduce el SIGEUN 1.0', 'F0'],
  ];
  integ.forEach(([id, d, rel], i) => { s += svc(164, 804 + i * 50, 276, 40, id, d, rel); });
  s += panel(516, 774, 1148, 178, 'Sistemas externos y productos existentes', '');
  const ext = [
    ['PIDE · RENIEC, SUNEDU, SUNAT, MINEDU', 'interop-estado'],
    ['MEF · SIAF-RP, SIGA, AIRHSP/MCPP', 'interop-mef'],
    ['SIGEUN 1.0 (en retiro)', 'legacy-acl'],
    ['Bancos · Págalo.pe · OSE de SUNAT', 'pagos'],
    ['Moodle (LTI 1.3)', 'lms-connector'],
    ['Koha · DSpace → RENATI y ALICIA', 'biblioteca'],
    ['FirmaPerú (firma digital)', 'documentos'],
    ['CONCYTEC CTI Vitae · antiplagio', 'investigacion'],
    ['Microsoft 365 (correo, Teams)', 'notificaciones'],
  ];
  ext.forEach(([t, via], i) => {
    const c = Math.floor(i / 3), r = i % 3;
    const x = 528 + c * 379, y = 804 + r * 50;
    s += `<g><rect x="${x}" y="${y}" width="366" height="40" rx="5" class="d-ext"/>` +
      `<text x="${x + 10}" y="${y + 17}" class="t-title">${esc(t)}</text>` +
      `<text x="${x + 10}" y="${y + 32}" class="t-sub">vía <tspan class="t-id-sm">${esc(via)}</tspan></text></g>`;
  });
  [['SOAP/REST', 824], ['interfaz', 874], ['CDC', 924]].forEach(([t, y]) => {
    s += line(P, 440, y, 527, y) + lbl(484, y - 6, t);
  });

  // Plataforma
  s += panel(152, 972, 1512, 84, 'Plataforma común (equipo de plataforma)', '');
  const plat = [
    ['Kubernetes RKE2', '3 nodos · prod y no prod'],
    ['GitOps · Argo CD', 'Git es la fuente de verdad'],
    ['CI con quality gate', 'pruebas, SAST, SCA, firma'],
    ['Harbor + Trivy', 'registro y escaneo'],
    ['OpenBao', 'secretos y certificados'],
    ['Observabilidad', 'OTel, Prometheus, Loki'],
    ['Respaldo 3-2-1', 'NAS inmutable + sitio alterno'],
  ];
  plat.forEach(([t, d], i) => { s += box(164 + i * 214, 1004, 204, 42, t, d); });

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Arquitectura de microservicios SIGEUN 2.0 en ocho capas: canales, borde, 34 microservicios de dominio agrupados en seis dominios, bus de eventos, servicios transversales, datos con esquema por servicio, integración con sistemas del Estado y plataforma Kubernetes." xmlns="http://www.w3.org/2000/svg" class="diagram d-main">${markers(P)}${s}</svg>`;
}

// ---------- Diagrama 2: saga de matrícula ----------
function diagramaSaga() {
  const P = 'd2';
  const W = 1180, H = 790;
  const L = { E: 90, B: 250, M: 420, Q: 590, P: 760, G: 920, C: 1080 };
  let s = '';
  const heads = [
    ['E', 'Estudiante', 'portal o PWA', 'd-box', 't-title', 140],
    ['B', 'bff-estudiante', 'borde', 'd-box', 't-id', 140],
    ['M', 'matricula', 'dueño del proceso', 'd-box', 't-id', 140],
    ['Q', 'Bus de eventos', 'RabbitMQ', 'd-bus', 't-title', 140],
    ['P', 'pagos', 'obligaciones', 'd-box', 't-id', 140],
    ['G', 'Pasarela o banco', 'externo', 'd-ext', 't-title', 140],
    ['C', 'consumidores', 'lms · documentos · avisos', 'd-box', 't-id', 168],
  ];
  for (const [k, t, sub, cls, tc, w] of heads) {
    const x = L[k] - w / 2;
    s += `<line x1="${L[k]}" y1="64" x2="${L[k]}" y2="770" class="d-life"/>`;
    s += box(x, 20, w, 44, t, sub, cls, tc);
  }
  const msg = (a, b, y, t, ev = false) => {
    const x1 = L[a], x2 = L[b];
    const dir = x2 > x1 ? 1 : -1;
    return line(P, x1 + dir * 3, y, x2 - dir * 4, y, { ev }) + lbl((x1 + x2) / 2, y - 7, t, 'middle', ev ? 't-edge-ev' : 't-edge');
  };
  const self = (k, y, t, anchor = 'start') => {
    const x = L[k];
    if (anchor === 'start') {
      return path(P, `M${x + 3},${y - 9} h28 v18 h-26`) + lbl(x + 40, y + 4, t, 'start');
    }
    return path(P, `M${x - 3},${y - 9} h-28 v18 h26`) + lbl(x - 40, y + 4, t, 'end');
  };
  s += msg('E', 'B', 100, '1 · elige secciones');
  s += msg('B', 'M', 140, '2 · POST /v1/matriculas + Idempotency-Key');
  s += self('M', 182, '3 · valida reglas con copias locales y reserva cupos');
  s += msg('M', 'Q', 228, '4 · MatriculaRegistrada (outbox)', true);
  s += msg('Q', 'P', 268, '5 · MatriculaRegistrada', true);
  s += self('P', 308, '6 · genera obligación y código de pago');
  s += msg('E', 'G', 352, '7 · paga con el código');
  s += msg('G', 'P', 392, '8 · confirmación (webhook firmado)');
  s += msg('P', 'Q', 432, '9 · PagoConfirmado', true);
  s += msg('Q', 'M', 472, '10 · PagoConfirmado', true);
  s += self('M', 512, '11 · confirma matrícula');
  s += msg('M', 'Q', 556, '12 · MatriculaConfirmada', true);
  s += msg('Q', 'C', 596, '13 · MatriculaConfirmada', true);
  s += self('C', 638, '14 · inscribe en Moodle, constancia firmada, correo', 'end');
  // Compensación
  s += `<rect x="300" y="668" width="420" height="96" rx="4" class="d-frame"/>`;
  s += `<path d="M300,668 h200 v18 l-8,8 h-192 z" class="d-frame-tab"/>`;
  s += `<text x="308" y="684" class="t-frame">alt · sin pago en el plazo</text>`;
  s += self('M', 712, 'vence la reserva y libera cupos');
  s += msg('M', 'Q', 750, 'MatriculaAnulada', true);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Saga de matrícula: matrícula reserva cupos y publica un evento; pagos genera la obligación; al confirmarse el pago, matrícula confirma y los consumidores inscriben en Moodle, generan la constancia y notifican. Sin pago en el plazo, la reserva vence y se liberan los cupos." xmlns="http://www.w3.org/2000/svg" class="diagram d-mid">${markers(P)}${s}</svg>`;
}

// ---------- Diagrama 3: migración Strangler Fig ----------
function diagramaMigracion() {
  const P = 'd3';
  const W = 1180, H = 470;
  let s = '';
  s += box(20, 190, 150, 60, 'Usuarios', 'todos los canales');
  s += box(230, 180, 180, 80, 'API Gateway', 'enruta por prefijo de URL', 'd-acc');
  s += line(P, 170, 220, 229, 220) + lbl(200, 213, 'HTTPS');

  s += panel(560, 20, 600, 182, 'SIGEUN 2.0 · microservicios', 'rutas que pasan en cada entrega');
  const rutas = [
    ['F0', '/tramites  /personas', 'mesa de partes virtual'],
    ['R1', '/matricula  /programacion  /pagos', 'matrícula 2027-II'],
    ['R2', '/notas  /historial  /admision', 'actas 2027-II, admisión 2028-I'],
    ['R3', '/grados  /rrhh  /bienestar', 'grados ante SUNEDU'],
    ['R4', '/logistica  /ia', 'el 1.0 queda en solo lectura'],
  ];
  rutas.forEach(([r, path_, hito], i) => {
    const y = 44 + i * 30;
    s += badge(576, y, r);
    s += `<text x="614" y="${y + 12}" class="t-id-sm">${esc(path_)}</text>`;
    s += `<text x="1146" y="${y + 12}" text-anchor="end" class="t-sub">${esc(hito)}</text>`;
  });

  s += box(560, 322, 600, 120, 'SIGEUN 1.0 · monolito', 'atiende lo que aún no migra; en R4 queda como archivo histórico', 'd-ext');

  s += path(P, 'M410,205 C480,205 480,111 559,111');
  s += lbl(496, 110, 'rutas migradas', 'end');
  s += path(P, 'M410,240 C480,240 480,382 559,382');
  s += lbl(496, 372, 'el resto (cada vez menos)', 'end');

  s += box(740, 236, 240, 48, 'legacy-acl', 'traduce al modelo canónico', 'd-box', 't-id');
  // Subida: 1.0 -> acl -> 2.0
  s += line(P, 800, 322, 800, 285, { ev: true }) + lbl(792, 309, 'cambios (CDC)', 'end', 't-edge-ev');
  s += line(P, 800, 236, 800, 203, { ev: true }) + lbl(792, 224, 'eventos canónicos', 'end', 't-edge-ev');
  // Bajada: 2.0 -> acl -> 1.0
  s += line(P, 920, 202, 920, 235) + lbl(928, 224, 'escrituras mínimas', 'start');
  s += line(P, 920, 284, 920, 321) + lbl(928, 309, 'API o vistas', 'start');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Migración progresiva: el API Gateway envía las rutas ya migradas al SIGEUN 2.0 y el resto al SIGEUN 1.0; la capa legacy-acl traduce los cambios del 1.0 a eventos canónicos y escribe de vuelta solo lo mínimo." xmlns="http://www.w3.org/2000/svg" class="diagram d-mid">${markers(P)}${s}</svg>`;
}

// ---------- Diagrama 4: despliegue con los 2 servidores del plan ----------
function diagramaDespliegue() {
  const P = 'd4';
  const W = 1180, H = 540;
  let s = '';
  s += `<circle cx="76" cy="60" r="34" class="d-ext"/><text x="76" y="64" text-anchor="middle" class="t-title">Internet</text>`;
  s += box(150, 36, 180, 48, 'Firewall perimetral', 'filtrado y VPN de gestión');
  s += box(390, 36, 250, 48, 'Proxy inverso + WAF', 'VM en la DMZ del servidor 1', 'd-acc');
  s += line(P, 110, 60, 149, 60) + line(P, 330, 60, 389, 60);
  s += line(P, 420, 84, 420, 129);

  // Servidor 1: producción
  s += panel(40, 130, 520, 234, 'Servidor 1 · sin GPU · producción', '48 NÚCLEOS · 768 GB · RAID 1');
  s += box(52, 166, 496, 40, 'k8s-prod · 3 VM', 'microservicios, Keycloak, RabbitMQ', 'd-acc');
  s += box(52, 214, 496, 40, 'PostgreSQL primaria', 'CloudNativePG', 'd-acc');
  s += box(52, 262, 496, 40, 'Objetos de producción', 'documentos y adjuntos');
  s += box(52, 310, 496, 40, 'k8s-staging · 1 VM', 'con cuotas de CPU y RAM');

  // Servidor 2: todo lo demás
  s += panel(620, 130, 520, 390, 'Servidor 2 · con GPU · todo lo demás', '32 NÚCLEOS · 128 GB · 2 GPU');
  s += box(632, 166, 496, 40, 'Observabilidad', 'Prometheus, Loki, Tempo, Grafana');
  s += box(632, 214, 496, 88, 'Respaldos', 'WAL de PostgreSQL · Proxmox Backup Server · réplica de objetos');
  s += box(632, 322, 496, 40, 'PostgreSQL en espera', 'se promueve si falla el servidor 1', 'd-acc');
  s += box(632, 370, 496, 40, 'k8s-noprod', 'dev y qa');
  s += box(632, 418, 496, 40, 'Runner de CI + Harbor', 'compilación, pruebas, imágenes');
  s += box(632, 466, 496, 40, 'VM ia-lab con las 2 GPU', 'OCR de actas e IA, encendida a demanda');

  // Flujos entre servidores
  s += line(P, 548, 186, 631, 186) + lbl(590, 179, 'telemetría');
  s += line(P, 548, 234, 631, 234) + lbl(590, 227, 'WAL continuo');
  s += line(P, 548, 282, 631, 282) + lbl(590, 275, 'copia diaria');
  s += line(P, 700, 302, 700, 321) + lbl(708, 316, 'reproduce el WAL', 'start');

  // Copia fuera del campus
  s += path(P, 'M632,296 H590 V445 H549');
  s += lbl(584, 400, 'copia semanal cifrada', 'end');
  s += `<g><rect x="52" y="420" width="496" height="50" rx="5" class="d-box"/>` +
    `<path d="M70,434 v16 a8,3 0 0 0 16,0 v-16" class="d-cyl"/><ellipse cx="78" cy="434" rx="8" ry="3" class="d-cyl"/>` +
    `<text x="98" y="441" class="t-title">SSD externos del plan, en rotación</text>` +
    `<text x="98" y="457" class="t-sub">guardados fuera del campus · tercera copia de la regla 3-2-1</text></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Despliegue en los dos servidores del plan: producción y staging en el servidor sin GPU; observabilidad, respaldos, PostgreSQL en espera, no producción, CI e IA en el servidor con GPU; copia semanal cifrada en SSD externos fuera del campus." xmlns="http://www.w3.org/2000/svg" class="diagram d-mid">${markers(P)}${s}</svg>`;
}

// ---------- Página ----------
const hallazgos = [
  ['C', 'Alcance inviable', '9 módulos en unos 3 meses efectivos con 8 programadores, e integración recién al final.'],
  ['C', 'Cronograma vencido', 'La Fase I estaba prevista para setiembre y el plan se aprobó el 24/09/2026.'],
  ['C', 'Arquitectura sin definir', 'No hay catálogo de servicios, contratos, datos, mensajería, seguridad ni despliegue.'],
  ['C', 'Sin requisitos no funcionales', 'Ni concurrencia de matrícula, ni disponibilidad, ni RPO/RTO, ni accesibilidad.'],
  ['C', 'Faltan roles críticos', 'No hay arquitecto, DevOps/SRE, seguridad ni DBA en un proyecto de microservicios.'],
  ['C', 'Dos servidores, sin alta disponibilidad', 'La alta disponibilidad exige 3 nodos. Se mantienen los 2 servidores, con respaldo y plan de contingencia.'],
  ['C', 'Seguridad solo enunciada', 'No cita la NTP-ISO/IEC 27001 ni la Ley N.° 29733, y se tratarán datos biométricos.'],
  ['A', 'Módulos por organigrama', 'DASA, Facultades y Escuelas repiten planes, secciones y horarios. Pregrado y posgrado no son módulos.'],
  ['A', 'Construir lo que ya existe', 'Aula virtual, logística, tesorería y planillas ya los resuelven Moodle, SIGA, SIAF y AIRHSP.'],
  ['A', 'Errores en el presupuesto', 'El cronograma de equipos suma S/ 208,800 frente a S/ 455,800 declarados; 63 frente a 61 unidades.'],
];

const modulos = [
  ['1', 'Académico', 'curricular, programacion, matricula, evaluacion, historial, lms-connector + Moodle'],
  ['2', 'Admisión', 'admision, banco-preguntas, pagos, personas + RENIEC'],
  ['3', 'Estudiantes', 'estudiantes (nivel como atributo), tutoria'],
  ['4', 'Docente', 'docentes; la carga lectiva vive en programacion'],
  ['5', 'Investigación', 'investigacion + DSpace y CTI Vitae'],
  ['6', 'Calidad, licenciamiento y acreditación', 'calidad + almacén de datos'],
  ['7', 'Bienestar universitario', 'bienestar'],
  ['8', 'Grados y títulos', 'grados-titulos, egresados, documentos, interop-estado (SUNEDU)'],
  ['9', 'Recursos humanos', 'rrhh + AIRHSP/MCPP'],
  ['10', 'Tesorería y pagos', 'pagos + bancos, OSE y SIAF'],
  ['11', 'Logística y patrimonio', 'logistica + SIGA-MEF'],
  ['12', 'Trámite documentario', 'tramite, documentos, workflow, notificaciones'],
  ['13', 'Biblioteca', 'biblioteca + Koha y DSpace'],
  ['14', 'Infraestructura y ambientes', 'infraestructura'],
  ['15', 'Reportes y tableros', 'reportes, almacén de datos, Superset'],
  ['16', 'Inteligencia artificial', 'ia-asistente, analitica'],
  ['+', 'Nuevos transversales', 'IAM, API Gateway, BFF, personas, organizacion, notificaciones, documentos, workflow, auditoria, interop-estado, interop-mef, legacy-acl'],
];

const entregas = [
  ['F0', 'Fundaciones', 'nov 2026 – feb 2027', 1, 4, 'Mesa de Partes Virtual'],
  ['R1', 'Núcleo académico', 'mar – jul 2027', 5, 9, 'Matrícula 2027-II en 2.0'],
  ['R2', 'Evaluación y servicios', 'ago – dic 2027', 10, 14, 'Actas 2027-II y admisión 2028-I en 2.0'],
  ['R3', 'Ciclo de vida completo', 'ene – jun 2028', 15, 20, 'Grados ante SUNEDU desde 2.0'],
  ['R4', 'Optimización e IA', 'jul – dic 2028', 21, 26, 'SIGEUN 1.0 en solo lectura'],
];

const equipo = [
  ['Coordinador / Jefe de proyecto', 'Jefe de proyecto y Scrum Master; enlace con los dueños de proceso'],
  ['Programador senior 1', 'Arquitecto y líder técnico: ADRs, contratos, revisión final'],
  ['Programador senior 2', 'Plataforma y seguridad: Proxmox, Kubernetes, CI/CD, respaldos, Keycloak'],
  ['Programador senior 3', 'Servicios transversales y dueño del modelo de datos'],
  ['Programador senior 4', 'Trámite y documentos (Mesa de Partes Virtual)'],
  ['Programadores junior (4)', 'Frontend y fullstack en pareja con un senior'],
  ['Analista funcional', 'Event Storming, historias, BDD y UAT'],
  ['Diseñador UX/UI/BD', 'UX/UI y sistema de diseño; apoyo al modelo de datos'],
  ['Testeador (QA)', 'Automatización E2E y pruebas de carga'],
  ['Documentador', 'Docs-as-code: manuales, runbooks, ADRs'],
];

const months = ['N', 'D', 'E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const html = `<title>SIGEUN 2.0 Arquitectura</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>
/* Layout: plano técnico. Columna de lectura de 1180px; los diagramas salen a 1680px y se desplazan en horizontal en pantallas chicas. */
:root {
  --bg: #F5F6FA;
  --surface: #FFFFFF;
  --panel: #E9EDF6;
  --ink: #161A2E;
  --ink-2: #4E5674;
  --line: #C3CADD;
  --accent: #2A3A8F;
  --accent-2: #157F7A;
  --accent-soft: #DFE5F7;
  --crit: #B3261E;
  --crit-soft: #F9E1DE;
  --high: #8A5300;
  --high-soft: #FBEBCB;
  --rel0: #0E7C76; --rel1: #1F6FA8; --rel2: #3550A8; --rel3: #5B3FA0; --rel4: #7A3C8F;
  --font-display: "Archivo", "Helvetica Neue", Arial, sans-serif;
  --font-body: "IBM Plex Sans", "Segoe UI", Roboto, Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SFMono-Regular", Consolas, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0F1220; --surface: #171B2E; --panel: #1D2238; --ink: #E6E9F4; --ink-2: #A2A9C4; --line: #343B5A;
    --accent: #9DAEF5; --accent-2: #4CC9C2; --accent-soft: #232B4E;
    --crit: #FF9C8F; --crit-soft: #3A1A1A; --high: #F2C266; --high-soft: #352812;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg: #0F1220; --surface: #171B2E; --panel: #1D2238; --ink: #E6E9F4; --ink-2: #A2A9C4; --line: #343B5A;
  --accent: #9DAEF5; --accent-2: #4CC9C2; --accent-soft: #232B4E;
  --crit: #FF9C8F; --crit-soft: #3A1A1A; --high: #F2C266; --high-soft: #352812;
  color-scheme: dark;
}
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--ink); font-family: var(--font-body); font-size: 16px; line-height: 1.6; overflow-x: clip; }
.page { padding-inline: 16px; padding-block: 40px 72px; display: flex; flex-direction: column; gap: 56px; }
.narrow { width: 100%; max-width: 1180px; margin-inline: auto; min-width: 0; }
.wide { width: 100%; max-width: 1680px; margin-inline: auto; min-width: 0; }
h1, h2, h3 { font-family: var(--font-display); text-wrap: balance; margin: 0; line-height: 1.15; }
h1 { font-size: clamp(30px, 4.4vw, 48px); font-weight: 800; letter-spacing: -0.01em; }
h2 { font-size: clamp(22px, 2.6vw, 28px); font-weight: 700; }
h3 { font-size: 18px; font-weight: 700; }
p { margin: 0; }
.eyebrow { font-size: 12.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-2); }
.lede { font-size: 18px; max-width: 68ch; color: var(--ink); }
.meta { font-size: 14px; color: var(--ink-2); }
.stack { display: flex; flex-direction: column; gap: 14px; }
.prose { max-width: 70ch; color: var(--ink-2); }
.prose strong { color: var(--ink); }
header.hero { display: flex; flex-direction: column; gap: 16px; border-bottom: 2px solid var(--accent); padding-bottom: 28px; }
.changes { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin-top: 8px; }
.change { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.change b { font-family: var(--font-display); font-size: 15px; }
.change span { font-size: 14px; color: var(--ink-2); line-height: 1.45; }
.findings { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 10px 28px; }
.findings li { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: baseline; padding-block: 10px; border-top: 1px solid var(--line); min-width: 0; }
.findings b { display: block; font-size: 15px; }
.findings span.t { font-size: 14px; color: var(--ink-2); line-height: 1.45; }
.sev { font: 600 11px/1 var(--font-mono); letter-spacing: 0.04em; padding: 4px 6px; border-radius: 3px; white-space: nowrap; }
.sev.c { color: var(--crit); background: var(--crit-soft); }
.sev.a { color: var(--high); background: var(--high-soft); }
figure { margin: 0; display: flex; flex-direction: column; gap: 12px; }
.fig-head { display: flex; flex-direction: column; gap: 6px; }
.scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); }
.scroll:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
figcaption { font-size: 14px; color: var(--ink-2); max-width: 80ch; }
.diagram { display: block; width: 100%; height: auto; }
.d-main { min-width: 1400px; }
.d-mid { min-width: 940px; max-width: 1180px; margin-inline: auto; }
.hint { font-size: 13px; color: var(--ink-2); }
/* SVG */
.d-box { fill: var(--surface); stroke: var(--line); stroke-width: 1; }
.d-acc { fill: var(--surface); stroke: var(--accent); stroke-width: 1.4; }
.d-ext { fill: var(--bg); stroke: var(--ink-2); stroke-width: 1; stroke-dasharray: 5 4; }
.d-panel { fill: var(--panel); stroke: none; }
.d-legend { fill: none; stroke: var(--line); stroke-width: 1; }
.d-bus { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1.2; }
.d-rule { stroke: var(--line); stroke-width: 1; }
.d-life { stroke: var(--line); stroke-width: 1.2; stroke-dasharray: 4 4; }
.d-frame { fill: none; stroke: var(--ink-2); stroke-width: 1; stroke-dasharray: 6 3; }
.d-frame-tab { fill: var(--panel); stroke: var(--ink-2); stroke-width: 1; }
.d-cyl { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1; }
.d-edge { stroke: var(--ink-2); stroke-width: 1.4; fill: none; }
.d-edge-dash { stroke-dasharray: 5 4; }
.d-edge-ev { stroke: var(--accent); stroke-dasharray: 6 4; }
.ah { fill: var(--ink-2); }
.ah-ev { fill: var(--accent); }
.rel0 { fill: var(--rel0); } .rel1 { fill: var(--rel1); } .rel2 { fill: var(--rel2); } .rel3 { fill: var(--rel3); } .rel4 { fill: var(--rel4); }
.t-id { font: 600 13px var(--font-mono); fill: var(--ink); }
.t-id-sm { font: 500 12px var(--font-mono); fill: var(--ink); }
.t-title { font: 600 13px var(--font-body); fill: var(--ink); }
.t-sub { font: 400 11.5px var(--font-body); fill: var(--ink-2); }
.t-group { font: 700 13.5px var(--font-display); fill: var(--ink); }
.t-count { font: 600 10.5px var(--font-body); fill: var(--ink-2); letter-spacing: 0.08em; }
.t-layer { font: 600 11px var(--font-body); fill: var(--ink-2); letter-spacing: 0.14em; }
.t-badge { font: 700 10px var(--font-body); fill: #FFFFFF; letter-spacing: 0.04em; }
.t-edge { font: 500 11px var(--font-body); fill: var(--ink-2); }
.t-edge-ev { font: 500 11px var(--font-body); fill: var(--accent); }
.t-bus { font: 600 12.5px var(--font-body); fill: var(--accent); }
.t-note { font: italic 400 11.5px var(--font-body); fill: var(--ink-2); }
.t-legend { font: 400 11px var(--font-body); fill: var(--ink-2); }
.t-frame { font: 600 11px var(--font-mono); fill: var(--ink); }
.halo { paint-order: stroke; stroke: var(--bg); stroke-width: 4px; stroke-linejoin: round; }
/* Tablas */
.tbl-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
table { width: 100%; border-collapse: collapse; font-size: 14.5px; }
th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-2); font-weight: 600; background: var(--panel); }
tr:last-child td { border-bottom: 0; }
td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
td code, .mono { font-family: var(--font-mono); font-size: 13px; }
tfoot td { font-weight: 600; background: var(--panel); }
.two { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr)); gap: 28px; align-items: start; }
.two > * { min-width: 0; }
/* Hoja de ruta */
.roadmap { min-width: 900px; padding: 18px; display: grid; grid-template-columns: 150px repeat(26, minmax(0, 1fr)); row-gap: 10px; align-items: center; }
.rm-year { grid-row: 1; font: 600 12px var(--font-body); color: var(--ink-2); border-left: 1px solid var(--line); padding-left: 6px; }
.rm-month { grid-row: 2; font: 500 11px var(--font-mono); color: var(--ink-2); text-align: center; }
.rm-label { grid-column: 1; font-size: 14px; display: flex; gap: 8px; align-items: center; }
.rm-bar { border-radius: 4px; color: #FFFFFF; font-size: 12.5px; font-weight: 500; padding: 7px 10px; line-height: 1.3; }
.rb0 { background: var(--rel0); } .rb1 { background: var(--rel1); } .rb2 { background: var(--rel2); } .rb3 { background: var(--rel3); } .rb4 { background: var(--rel4); }
.chip { font: 700 11px/1 var(--font-body); color: #FFFFFF; padding: 4px 6px; border-radius: 3px; }
.docs { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
.docs a { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--ink); text-decoration: none; min-width: 0; }
.docs a:hover, .docs a:focus-visible { border-color: var(--accent); outline: none; }
.docs a span { font-size: 13.5px; color: var(--ink-2); }
.docs a b { font-family: var(--font-display); }
@media (max-width: 560px) { .findings { grid-template-columns: 1fr; } .lede { font-size: 16.5px; } }
</style>

<main class="page">
  <header class="hero narrow">
    <span class="eyebrow">Universidad Nacional de Moquegua · Propuesta sobre el Plan de Trabajo v01</span>
    <h1>Arquitectura de microservicios SIGEUN 2.0</h1>
    <p class="lede">El plan aprobado el 24/09/2026 acierta en el objetivo y en el alineamiento con las CBC de SUNEDU, pero no es ejecutable tal como está: pide 9 módulos en unos 3 meses efectivos, sin arquitectura definida, sin requisitos no funcionales y sin los roles que sostienen una plataforma de microservicios. Esta propuesta lo reorganiza como un programa por entregas, con el mismo presupuesto en 2026.</p>
    <p class="meta">Análisis del 12 de octubre de 2026 · 34 microservicios + 4 BFF · 5 entregas entre nov 2026 y dic 2028</p>
    <div class="changes">
      <div class="change"><b>Entregas, no un big bang</b><span>2026 se dedica a fundaciones y a un primer flujo en producción.</span></div>
      <div class="change"><b>Mismo equipo, roles claros</b><span>Los 13 perfiles cubren arquitectura, plataforma y datos.</span></div>
      <div class="change"><b>Dos servidores bien repartidos</b><span>Producción en uno; copias, réplica y monitoreo en el otro.</span></div>
      <div class="change"><b>Integrar antes que construir</b><span>Moodle, Koha, DSpace, SIAF, SIGA, AIRHSP y FirmaPerú.</span></div>
      <div class="change"><b>Migración progresiva</b><span>El SIGEUN 1.0 se reemplaza por rutas, dominio por dominio.</span></div>
    </div>
  </header>

  <section class="narrow stack" aria-labelledby="h-hallazgos">
    <h2 id="h-hallazgos">Hallazgos principales del plan</h2>
    <p class="prose">De 34 hallazgos y 10 inconsistencias internas, estos son los que impiden o ponen en riesgo el resultado. <strong>CRÍTICO</strong> impide el éxito; <strong>ALTO</strong> lo pone en riesgo serio.</p>
    <ul class="findings">
      ${hallazgos.map(([s, t, d]) => `<li><span class="sev ${s === 'C' ? 'c' : 'a'}">${s === 'C' ? 'CRÍTICO' : 'ALTO'}</span><div><b>${esc(t)}</b><span class="t">${esc(d)}</span></div></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="wide" aria-labelledby="h-arq">
    <figure>
      <div class="fig-head narrow">
        <h2 id="h-arq">Arquitectura completa</h2>
        <p class="prose">Los 16 módulos del plan quedan organizados en 34 microservicios por dominio de negocio. Cada uno tiene su propio esquema de datos y se comunica por REST cuando atiende a un usuario y por eventos cuando coordina con otro dominio.</p>
      </div>
      <div class="scroll" tabindex="0" role="region" aria-label="Diagrama de arquitectura, desplazable en horizontal">
        ${diagramaArquitectura()}
      </div>
      <figcaption class="narrow">Cada caja con nombre en código es un microservicio desplegable por separado; la etiqueta de color indica la entrega en que se construye (F0 nov 2026–feb 2027, R1 mar–jul 2027, R2 ago–dic 2027, R3 ene–jun 2028, R4 jul–dic 2028). Todos los servicios de dominio y transversales publican y consumen eventos del bus, y escriben solo en su propio esquema. Las cajas punteadas son productos o sistemas que se integran y no se construyen.</figcaption>
    </figure>
  </section>

  <section class="narrow stack" aria-labelledby="h-traza">
    <h2 id="h-traza">De los 16 módulos del plan a los microservicios</h2>
    <p class="prose">Ningún módulo se pierde. DASA, Facultades y Escuelas dejan de ser módulos y pasan a ser <strong>ámbitos de permiso</strong> en el backoffice; pregrado y posgrado son un atributo del estudiante y del programa.</p>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th class="num">#</th><th>Módulo del plan</th><th>Microservicios</th></tr></thead>
        <tbody>
          ${modulos.map(([n, m, s]) => `<tr><td class="num">${n}</td><td>${esc(m)}</td><td class="mono">${esc(s)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="narrow" aria-labelledby="h-saga">
    <figure>
      <div class="fig-head">
        <h2 id="h-saga">Cómo funciona una matrícula</h2>
        <p class="prose">La matrícula nunca espera en línea a que responda el banco. Reserva el cupo de inmediato, publica un evento y se confirma cuando llega el pago. Si <span class="mono">pagos</span> se cae en el día pico, las matrículas se siguen registrando y se confirman cuando el servicio vuelve.</p>
      </div>
      <div class="scroll" tabindex="0" role="region" aria-label="Diagrama de secuencia de la matrícula">
        ${diagramaSaga()}
      </div>
      <figcaption>Línea continua: llamada síncrona. Línea discontinua azul: evento asíncrono por el bus, guardado con el patrón outbox en la misma transacción que el cambio. El recuadro inferior es la compensación: si no hay pago en el plazo, la reserva vence y los cupos se liberan.</figcaption>
    </figure>
  </section>

  <section class="narrow" aria-labelledby="h-mig">
    <figure>
      <div class="fig-head">
        <h2 id="h-mig">Cómo se reemplaza el SIGEUN 1.0</h2>
        <p class="prose">Desde la Fase 0 el API Gateway se pone delante del sistema actual. En cada entrega, las rutas de un dominio pasan al 2.0 solo después de migrar y conciliar sus datos. El usuario no ve un corte.</p>
      </div>
      <div class="scroll" tabindex="0" role="region" aria-label="Diagrama de migración progresiva">
        ${diagramaMigracion()}
      </div>
      <figcaption>La capa <span class="mono">legacy-acl</span> lee los cambios del 1.0 y los traduce al modelo del 2.0. Escribe de vuelta solo lo que el 1.0 todavía necesita; por ejemplo, las matrículas 2027-II mientras las notas de ese semestre sigan registrándose en el 1.0.</figcaption>
    </figure>
  </section>

  <section class="narrow" aria-labelledby="h-dep">
    <figure>
      <div class="fig-head">
        <h2 id="h-dep">Dónde corre</h2>
        <p class="prose">Se usan los dos servidores del plan. Producción va en el que tiene RAID y más memoria; las copias, la réplica en espera y el monitoreo van en el otro, para que sobrevivan si producción falla.</p>
      </div>
      <div class="scroll" tabindex="0" role="region" aria-label="Diagrama de despliegue">
        ${diagramaDespliegue()}
      </div>
      <figcaption>No hay alta disponibilidad de hardware: si el servidor 1 falla, se conmuta al servidor 2 siguiendo el runbook (apagar dev y qa, promover la réplica, desplegar desde Git; meta de 4 horas). Las GPU se usan para OCR de actas antiguas e IA sin sacar datos personales de la universidad.</figcaption>
    </figure>
  </section>

  <section class="narrow stack" aria-labelledby="h-ruta">
    <h2 id="h-ruta">Hoja de ruta</h2>
    <p class="prose">Cada entrega termina en producción y sirve por sí sola. Las fechas se ajustan al calendario académico oficial.</p>
    <div class="tbl-wrap" tabindex="0" role="region" aria-label="Hoja de ruta por meses">
      <div class="roadmap">
        <span class="rm-year" style="grid-column: 2 / span 2">2026</span>
        <span class="rm-year" style="grid-column: 4 / span 12">2027</span>
        <span class="rm-year" style="grid-column: 16 / span 12">2028</span>
        ${months.map((m, i) => `<span class="rm-month" style="grid-column:${i + 2}">${m}</span>`).join('')}
        ${entregas.map(([r, n, per, a, b, hito], i) => `<span class="rm-label" style="grid-row:${i + 3}"><span class="chip rb${REL[r]}">${r}</span>${esc(n)}</span><span class="rm-bar rb${REL[r]}" style="grid-row:${i + 3}; grid-column:${a + 1} / ${b + 2}">${esc(hito)}</span>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="narrow stack" aria-labelledby="h-eq">
    <h2 id="h-eq">Equipo: los perfiles del plan con responsabilidades claras</h2>
    <p class="prose">Se mantienen los 13 perfiles y los equipos del plan. Para cubrir los roles que el plan no tenía (arquitectura, plataforma, seguridad y datos) sin cambiar contratos, cada perfil asume responsabilidades concretas. La OTI suma al menos dos servidores de planta para asegurar la continuidad.</p>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>Perfil del plan</th><th>Responsabilidad en SIGEUN 2.0</th></tr></thead>
        <tbody>
          ${equipo.map(([p, r]) => `<tr><td>${esc(p)}</td><td>${esc(r)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <p class="hint">Necesidades para el presupuesto 2027: discos para las bahías libres del servidor 1, tarjeta de 10 GbE, redundancia de disco en el servidor 2 y un tercer nodo cuando se busque alta disponibilidad.</p>
  </section>

  <section class="narrow stack" aria-labelledby="h-docs">
    <h2 id="h-docs">Documentación completa</h2>
    <p class="prose">El detalle está en el repositorio <span class="mono">Mermas-CC/sigeun2.0</span>, rama <span class="mono">claude/microservices-architecture-plan-cufm1i</span>.</p>
    <div class="docs">
      <a href="https://github.com/Mermas-CC/sigeun2.0/blob/claude/microservices-architecture-plan-cufm1i/docs/01-analisis-critico-del-plan.md"><b>1. Análisis crítico</b><span>34 hallazgos con evidencia, 10 inconsistencias y brechas de ingeniería.</span></a>
      <a href="https://github.com/Mermas-CC/sigeun2.0/blob/claude/microservices-architecture-plan-cufm1i/docs/02-propuesta-tecnica-mejorada.md"><b>2. Propuesta técnica</b><span>Metodología 12207, requisitos no funcionales, pruebas, seguridad, equipo, riesgos e indicadores.</span></a>
      <a href="https://github.com/Mermas-CC/sigeun2.0/blob/claude/microservices-architecture-plan-cufm1i/docs/03-arquitectura-microservicios.md"><b>3. Arquitectura</b><span>Catálogo de servicios, eventos, datos, seguridad, CI/CD, despliegue y stack.</span></a>
      <a href="https://github.com/Mermas-CC/sigeun2.0/blob/claude/microservices-architecture-plan-cufm1i/docs/04-guia-de-estudio.md"><b>4. Guía de estudio</b><span>Qué aprender y en qué orden, uso de los equipos del plan y cómo trabajar con Claude Code.</span></a>
      <a href="https://github.com/Mermas-CC/sigeun2.0/tree/claude/microservices-architecture-plan-cufm1i/docs/adr"><b>Decisiones (ADR)</b><span>Diez decisiones de arquitectura con alternativas y consecuencias.</span></a>
    </div>
  </section>
</main>
`;

writeFileSync(OUT, html);
console.log('Escrito', OUT, (html.length / 1024).toFixed(1) + ' KB');
