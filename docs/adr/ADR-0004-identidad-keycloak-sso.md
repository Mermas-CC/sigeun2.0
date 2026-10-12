# ADR-0004: Identidad con Keycloak, SSO y federación con Microsoft Entra ID

- Estado: Propuesto
- Fecha: 2026-10-12
- Decisores: autoridad de diseño SIGEUN 2.0

## Contexto

Estudiantes, docentes y personal usan varias aplicaciones (portales, backoffice, Moodle, tableros). La universidad ya tiene un tenant de Microsoft 365 con cuentas institucionales. Hay roles con acceso a datos sensibles (notas, pagos) que requieren MFA, y permisos que dependen del ámbito (facultad, escuela, sede).

## Decisión

- **Keycloak** como proveedor de identidad central (OIDC/OAuth 2.0 y SAML para aplicaciones que lo necesiten).
- **Federación con Microsoft Entra ID** para cuentas institucionales; cuentas locales solo para postulantes y público externo.
- **MFA obligatorio** para roles administrativos y de registro de notas.
- Patrón **BFF**: los tokens se quedan en el servidor y el navegador recibe una cookie `HttpOnly`, `Secure`, `SameSite`.
- Autorización **RBAC + ABAC**: el token lleva rol y atributos de ámbito (`facultad_id`, `escuela_id`, `sede`, `nivel`) y cada servicio aplica las políticas con una librería común.
- Comunicación entre servicios con *client credentials* y, opcionalmente, mTLS.

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| Solo Entra ID | No cubre bien a postulantes y público externo, ni atributos de ámbito académicos sin licencias adicionales |
| Autenticación propia en cada módulo | Contraseñas repetidas, sin SSO ni MFA uniforme; es la situación que se quiere superar |

## Consecuencias

- (+) Un solo inicio de sesión para todo el ecosistema, incluido Moodle.
- (+) Altas y bajas centralizadas (por ejemplo, al egresar o al cesar un contrato).
- (−) Keycloak se vuelve crítico: se despliega en alta disponibilidad y con respaldo de su base de datos.
