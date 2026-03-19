Quiero que construyas un proyecto full-stack, en modo educativo, que simule una plataforma moderna de intercambio/transferencia de criptomonedas con una blockchain privada/local. El objetivo es demostrar el flujo completo de un usuario que se registra, obtiene acceso, pasa por un proceso KYC simulado, tiene una wallet, simula depósitos desde tarjeta o cuenta bancaria con datos ficticios, recibe saldo en su wallet interna, puede transferir fondos a otra wallet/usuario, consultar historial, y ver conceptos de llaves, firmas y transacciones.

IMPORTANTE:
- Este sistema es solo para fines educativos y de demostración.
- NO debe conectarse a dinero real, bancos reales, tarjetas reales ni redes blockchain públicas.
- Todos los pagos por tarjeta/cuenta bancaria deben ser simulados.
- El proceso KYC debe ser simulado y educativo, NO real.
- La blockchain debe ser privada/local.
- El sistema debe sentirse parecido a una plataforma real, pero simplificado para evitar complejidad innecesaria.
- Quiero Docker para todos los servicios.
- Quiero una estructura limpia lista para GitHub.
- Quiero README completo con instrucciones de instalación, ejecución y arquitectura.
- Quiero diseño UX/UI limpio, minimalista, profesional, sin distracciones, inspirado en la simplicidad visual de ChatGPT.com: mucho espacio en blanco, layout sobrio, tipografía limpia, pocos colores, tarjetas suaves, navegación clara, responsive.

==================================================
1. STACK TECNOLÓGICO OBLIGATORIO
==================================================

Usa este stack:

Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- TanStack Query
- ethers.js para integración Web3 visual donde aplique

Backend:
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT auth (access + refresh)
- Swagger/OpenAPI
- bcrypt para hashing de contraseñas
- class-validator / DTOs
- crypto nativo de Node cuando aplique

Blockchain:
- Hardhat
- Solidity
- Red local privada usando Hardhat node
- Un smart contract simple para registrar transacciones educativas o emitir un token interno estilo ERC20 simplificado
- scripts de deploy automáticos

Infraestructura local:
- Docker Compose
- PostgreSQL container
- Backend container
- Frontend container
- Hardhat node container
- Opcional Redis container
- Adminer o pgAdmin opcional

Testing:
- Jest para backend
- Testing básico en frontend
- algunos e2e mínimos

Monorepo:
- pnpm workspaces
- estructura organizada por apps y packages

==================================================
2. OBJETIVO FUNCIONAL DEL SISTEMA
==================================================

Construye una aplicación llamada por ejemplo:
"EduChain Exchange"
o un nombre similar, profesional y sobrio.

Debe permitir:

A) Registro y acceso
- Un usuario se registra con:
  - firstName
  - lastName
  - email
  - password
- Confirmación de email simulada
- Login y logout
- Refresh token
- Perfil de usuario

B) KYC simulado
Implementa un flujo KYC educativo, claramente etiquetado como “Simulated KYC”.

Etapas del KYC:
1. Personal Information
- firstName
- middleName opcional
- lastName
- dateOfBirth
- country
- nationality
- phoneNumber
- addressLine1
- addressLine2 opcional
- city
- state
- postalCode

2. Identity Document
- documentType (passport, national_id, driver_license)
- documentNumber
- issuingCountry
- expirationDate
- frontImageUrl o archivo subido localmente
- backImageUrl opcional

3. Selfie / Face Verification Simulada
- selfieImageUrl o archivo subido localmente
- resultado simulado de face match

4. KYC Review Status
- NOT_STARTED
- IN_PROGRESS
- SUBMITTED
- UNDER_REVIEW
- APPROVED
- REJECTED

5. Risk & Compliance Simulation
- sanctionsScreeningStatus (CLEAR, POSSIBLE_MATCH, REJECTED)
- pepStatus simulado
- riskScore numérico
- manualReviewRequired boolean
- notes internas de reviewer

Reglas del KYC:
- NO usar proveedores reales de verificación de identidad.
- NO usar APIs reales de government ID o face recognition.
- La carga de documentos debe guardarse localmente o en almacenamiento demo.
- Se debe simular procesamiento con reglas determinísticas o semi-random.
- Ejemplo: 80% aprobado, 15% manual review, 5% rejected.
- Si el usuario no tiene KYC APPROVED:
  - puede registrarse y entrar
  - puede ver su dashboard
  - pero no puede depositar ni transferir hasta completar KYC
- Agrega banner visible cuando el KYC está pendiente.
- Agrega página dedicada:
  - /kyc/start
  - /kyc/status
  - /kyc/review

C) Wallet automática
- Al registrarse, se genera una wallet blockchain educativa automáticamente
- Guardar:
  - walletAddress
  - publicKey si aplica
  - privateKey ENCRIPTADA en base de datos solo para fines educativos
- El usuario puede ver:
  - dirección pública
  - balance interno
  - balance on-chain si aplica
- La private key NO debe mostrarse por defecto
- Debe existir una pantalla o modal educativo para “ver detalles técnicos” con advertencia, donde se explique address, public key, private key, signature, hash, nonce, gas, etc.

D) Simulación de depósitos fiat
El usuario podrá “agregar dinero” a su wallet interna por dos métodos simulados:

1. Tarjeta de crédito simulada
Formulario con:
- cardHolderName
- cardNumber
- expiryMonth
- expiryYear
- cvv
- billingZip
- amount

2. Cuenta bancaria simulada
Formulario con:
- accountHolderName
- bankName
- routingNumber
- accountNumber
- accountType
- amount

Reglas:
- NO usar APIs reales de pago
- Validar formatos localmente
- Guardar la solicitud en DB
- Simular procesamiento con estados:
  - pending
  - processing
  - approved
  - failed
- Por defecto, en entorno demo, aprobar el 90% y fallar el 10% con reglas simples o determinísticas
- Si se aprueba:
  - aumentar el balance fiat interno simulado del usuario
  - opcionalmente acuñar token demo o reflejar balance usable para transferencias
- Registrar todo en historial
- Requerir KYC APPROVED para permitir depósitos

E) Transferencias
Permitir:
1. Transferencia interna entre usuarios del sistema
- Buscar por email o wallet address
- Ingresar monto
- Confirmar transferencia
- Validar saldo suficiente
- Registrar ledger entry
- Registrar evento on-chain si el modelo lo soporta
- Requerir KYC APPROVED para permitir transferencias

2. Transferencia entre wallets educativas dentro de la red privada
- Usar address destino
- Crear transacción firmada de forma educativa
- Guardar hash, status, timestamp

F) Historial
Pantalla de historial con filtros:
- all
- deposits
- withdrawals simulados si se implementan
- transfers sent
- transfers received
- blockchain events
- kyc events
- failed operations

Cada item debe mostrar:
- type
- amount
- currency
- date/time
- status
- from
- to
- reference/hash
- details expandable

G) Dashboard
Pantalla principal con:
- saludo
- balance disponible
- wallet address
- estado KYC
- acciones rápidas:
  - Complete KYC
  - Add funds
  - Send
  - Receive
  - View history
  - Technical details
- últimas transacciones
- estado de red blockchain
- indicador si el nodo local está arriba

H) Panel admin básico
- listado de usuarios
- listado de wallets
- listado de depósitos simulados
- listado de transacciones
- ability to inspect logs
- ability to seed demo users
- ability to review KYC cases
- cambiar estado KYC manualmente
- ver documentos subidos en entorno local/demo
- NO funciones peligrosas innecesarias

==================================================
3. MODELO EDUCATIVO DE KYC / AML
==================================================

No quiero cumplimiento real. Quiero una simulación razonable inspirada en plataformas reales.

Implementa:

A) KYC policy educativa
- Un usuario debe completar KYC antes de operar.
- El sistema debe almacenar:
  - identidad declarada
  - documentos simulados
  - selfie simulada
  - resultado de screening simulado
  - risk score
  - reviewer notes

B) Screening simulado
Crear un servicio interno tipo:
ComplianceSimulationService

Este servicio debe simular:
- sanctions screening
- PEP screening
- country risk flag
- unusual behavior basic flags

Reglas sugeridas:
- coincidencias por palabras clave o reglas determinísticas
- lista local demo de nombres bloqueados o watchlist mock
- países demo de alto riesgo
- score de riesgo calculado con reglas simples

C) Resultado KYC
- APPROVED: puede depositar y transferir
- UNDER_REVIEW: acceso limitado
- REJECTED: no puede operar
- NEEDS_RESUBMISSION: debe subir documentos otra vez

D) Admin reviewer flow
- ver caso
- revisar documentos
- aprobar
- rechazar
- pedir resubmission
- dejar notas

E) Audit trail
Registrar:
- quién envió KYC
- cuándo cambió de estado
- quién revisó
- por qué fue rechazado
- historial de decisiones

==================================================
4. MODELO EDUCATIVO DE BLOCKCHAIN
==================================================

No quiero una blockchain compleja desde cero. Quiero una aproximación realista pero manejable.

Implementa:
- Hardhat local node
- Un smart contract llamado DemoToken o EduToken (ERC20 simplificado)
- Un smart contract opcional llamado TransactionRegistry para registrar metadatos educativos
- Al aprobar un depósito simulado:
  - se puede mintear saldo demo en tokens al wallet del usuario
  - o mantener ledger interno + registro on-chain
- Las transferencias deben verse reflejadas:
  - en DB
  - y cuando aplique, on-chain

Quiero que el sistema explique visualmente:
- address
- wallet
- public/private key
- signing
- hash
- block
- confirmation
- gas
- ledger interno vs blockchain
- KYC vs autenticación
- KYC vs AML screening

Agregar una sección “How it works” en la app con diagramas sencillos o bloques explicativos.

==================================================
5. ARQUITECTURA DEL SISTEMA
==================================================

Crea un monorepo con esta idea:

/apps
  /web          -> Next.js frontend
  /api          -> NestJS backend
/packages
  /contracts    -> Solidity contracts + hardhat
  /ui           -> shared UI components opcional
  /config       -> tsconfig/eslint/prettier shared
/infrastructure
  docker-compose.yml
  .env.example
  scripts/
  seed/
README.md

==================================================
6. DOCKER Y SERVICIOS
==================================================

Necesito docker-compose con servicios:

- web
- api
- db
- blockchain
- optional redis
- optional adminer or pgadmin

Requisitos:
- todo debe levantar con un solo comando
- usar variables de entorno claras
- agregar healthchecks cuando tenga sentido
- agregar volúmenes donde sea útil
- documentar puertos

Puertos sugeridos:
- web: 3000
- api: 4000
- db: 5432
- blockchain: 8545
- pgadmin/adminer: opcional

==================================================
7. DISEÑO UX/UI
==================================================

Quiero un diseño visual minimalista, sobrio y moderno.

Inspiración:
- simplicidad de ChatGPT.com
- mucho espacio en blanco
- pocos colores
- tipografía limpia
- navegación lateral simple
- tarjetas suaves con bordes sutiles
- botones discretos
- formularios claros
- experiencia muy limpia en desktop y mobile

Requisitos visuales:
- Responsive
- Mobile-first
- Layout con sidebar en desktop y bottom nav o drawer en mobile
- Modo claro por defecto
- Modo oscuro opcional
- Sin elementos recargados
- No usar gradientes fuertes
- No usar dashboards tipo crypto-casino
- Debe sentirse serio/profesional/educativo

Páginas mínimas:
- Landing
- Login
- Register
- Dashboard
- KYC Start
- KYC Status
- Add Funds
- Send
- Receive
- History
- Wallet Details
- Technical Details / Learn
- Admin

Componentes:
- Top bar minimal
- Sidebar minimal
- Balance card
- KYC status card
- Transaction list
- Status chips
- Modal for technical explanations
- Empty states elegantes
- Loaders sobrios
- Toast notifications discretas
- document upload cards
- review timeline card

==================================================
8. MODELO DE DATOS
==================================================

Diseña el schema de Prisma con entidades como:

User
- id
- firstName
- lastName
- email
- passwordHash
- emailVerified
- role (USER, ADMIN, COMPLIANCE_ADMIN)
- createdAt
- updatedAt

Wallet
- id
- userId
- address
- encryptedPrivateKey
- publicKey nullable
- blockchainNetwork
- internalBalance
- tokenBalance
- createdAt
- updatedAt

KycProfile
- id
- userId
- status (NOT_STARTED, IN_PROGRESS, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, NEEDS_RESUBMISSION)
- riskScore
- pepStatus
- sanctionsScreeningStatus
- manualReviewRequired
- submittedAt
- reviewedAt
- reviewedByUserId nullable
- rejectionReason nullable
- reviewerNotes nullable
- createdAt
- updatedAt

KycPersonalInfo
- id
- kycProfileId
- firstName
- middleName nullable
- lastName
- dateOfBirth
- country
- nationality
- phoneNumber
- addressLine1
- addressLine2 nullable
- city
- state
- postalCode

KycDocument
- id
- kycProfileId
- documentType
- documentNumberMasked
- issuingCountry
- expirationDate
- frontFilePath
- backFilePath nullable
- status
- uploadedAt

KycSelfie
- id
- kycProfileId
- filePath
- faceMatchScore nullable
- livenessStatus nullable
- uploadedAt

ComplianceCheck
- id
- userId
- kycProfileId
- sanctionsStatus
- pepStatus
- countryRiskLevel
- watchlistHit boolean
- riskScore
- rawResultJson
- createdAt

DepositRequest
- id
- userId
- walletId
- method (CARD, BANK)
- amount
- currency
- status (PENDING, PROCESSING, APPROVED, FAILED)
- externalReferenceSimulated
- rawMaskedDetailsJson
- createdAt
- updatedAt
- processedAt

Transfer
- id
- fromWalletId
- toWalletId nullable
- toAddress
- amount
- currency
- status
- type (INTERNAL, ONCHAIN)
- blockchainHash nullable
- blockNumber nullable
- createdAt
- confirmedAt nullable

LedgerEntry
- id
- walletId
- direction (CREDIT, DEBIT)
- sourceType (DEPOSIT, TRANSFER, MINT, ADJUSTMENT)
- sourceId
- amount
- balanceBefore
- balanceAfter
- createdAt

EmailVerificationToken
RefreshToken
AuditLog
SystemSetting
BlockchainEvent

Agrega índices, relaciones y campos necesarios para integridad.

==================================================
9. SEGURIDAD EDUCATIVA
==================================================

Aunque es demo, quiero buenas prácticas razonables:

- contraseñas con bcrypt
- JWT access + refresh
- rate limiting básico en auth
- validación de DTOs
- sanitización razonable
- secrets por .env
- private keys cifradas en base de datos usando una master key de entorno
- nunca retornar private key por API normal
- máscara de datos sensibles de tarjeta/cuenta bancaria en logs y DB
- máscara de PII sensible en logs
- logs de auditoría para acciones sensibles
- CORS configurable
- helmet en backend
- uploads de KYC restringidos y almacenados en carpeta controlada
- servir documentos solo a usuarios autorizados
- evitar exposición pública de archivos KYC

Pero recuerda:
- esto es demo
- no es security-grade para producción
- documenta claramente esas limitaciones en README

==================================================
10. API ENDPOINTS
==================================================

Diseña y documenta endpoints como:

Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me
- POST /auth/verify-email-demo

Users
- GET /users/profile
- PATCH /users/profile

KYC
- POST /kyc/start
- PATCH /kyc/personal-info
- POST /kyc/document
- POST /kyc/selfie
- POST /kyc/submit
- GET /kyc/status
- GET /kyc/me
- GET /kyc/history

Compliance Admin
- GET /admin/kyc/cases
- GET /admin/kyc/cases/:id
- POST /admin/kyc/cases/:id/approve
- POST /admin/kyc/cases/:id/reject
- POST /admin/kyc/cases/:id/request-resubmission

Wallets
- GET /wallets/me
- GET /wallets/:id
- GET /wallets/:id/balance
- GET /wallets/:id/technical-details

Deposits
- POST /deposits/card
- POST /deposits/bank
- GET /deposits
- GET /deposits/:id
- POST /deposits/:id/process-demo

Transfers
- POST /transfers/internal
- POST /transfers/onchain
- GET /transfers
- GET /transfers/:id

History
- GET /history

Admin
- GET /admin/users
- GET /admin/wallets
- GET /admin/deposits
- GET /admin/transfers
- POST /admin/seed-demo

System
- GET /system/health
- GET /system/blockchain-status

Genera Swagger completo.

==================================================
11. LÓGICA DE NEGOCIO
==================================================

Implementa lógica clara:

Registro:
- crear usuario
- crear wallet automáticamente
- crear KycProfile en NOT_STARTED
- cifrar private key
- asignar saldo inicial 0

KYC:
- crear/actualizar perfil
- subir documentos
- subir selfie
- calcular score de riesgo
- ejecutar screening simulado
- cambiar estado
- permitir revisión manual admin

Depósito simulado:
- verificar usuario autenticado
- verificar KYC APPROVED
- validar datos
- guardar solicitud
- simular delay o job corto
- cambiar estados
- al aprobar:
  - actualizar balance
  - crear ledger entries
  - opcionalmente mintear tokens on-chain
  - registrar audit log

Transferencia interna:
- verificar usuario autenticado
- verificar KYC APPROVED
- verificar saldo suficiente
- buscar destino por email o wallet address
- evitar self-transfer si decides
- crear debit/credit ledger entries atómicamente
- registrar transfer record

Transferencia on-chain educativa:
- verificar KYC APPROVED
- generar/simular firma
- enviar transacción al nodo local
- guardar hash
- consultar receipt
- marcar confirmación

Historial:
- consolidar depósitos, transferencias, eventos blockchain y eventos KYC en una sola respuesta paginada y filtrable

==================================================
12. EXPERIENCIA EDUCATIVA
==================================================

Quiero una sección educativa dentro de la aplicación:

Página “Learn / Technical Details” con:
- What is a blockchain?
- What is a wallet?
- What is a public address?
- What is a private key?
- What is signing?
- What is a block?
- What is gas?
- What is KYC?
- What is AML?
- What is sanctions screening?
- Diferencia entre:
  - autenticación
  - autorización
  - KYC
  - AML
  - ledger interno
  - blockchain
  - saldo fiat simulado
  - token demo

Agregar tooltips o modales explicativos en pantallas clave.

==================================================
13. SMART CONTRACTS
==================================================

Implementa al menos:

A) EduToken.sol
- Token demo, ERC20
- nombre y símbolo sobrios
- función mint restringida al backend/admin wallet
- transferencias normales

B) TransactionRegistry.sol opcional pero recomendado
- registrar metadatos educativos
- event logs con:
  - from
  - to
  - amount
  - reference
  - timestamp

Agregar:
- tests de contracts
- scripts de deploy
- export de ABI para frontend/backend

==================================================
14. SEED DATA
==================================================

Quiero seed script que cree:
- 1 admin
- 1 compliance admin
- 3 usuarios demo
- wallets demo
- algunas transacciones históricas
- algunos depósitos aprobados y fallidos
- algunos KYC cases:
  - 1 approved
  - 1 under review
  - 1 rejected

==================================================
15. README Y DOCUMENTACIÓN
==================================================

Genera un README excelente con:
- visión general
- disclaimer de uso educativo
- explicación de KYC simulado y sus límites
- stack
- arquitectura
- diagrama textual de componentes
- instrucciones de instalación
- docker commands
- variables de entorno
- cómo correr migraciones
- cómo desplegar contratos
- cómo seed data
- puertos
- credenciales demo
- roadmap
- limitaciones
- posibles mejoras futuras

Incluye también:
- .env.example para cada app si aplica
- comentarios útiles en código
- scripts npm/pnpm claros

==================================================
16. CALIDAD DE CÓDIGO
==================================================

Quiero:
- código limpio
- TypeScript estricto
- manejo de errores consistente
- estructura por módulos
- sin archivos gigantes innecesarios
- servicios bien separados
- naming profesional
- lint y format configurados
- commits sugeridos por etapas dentro de la documentación

==================================================
17. PLAN DE IMPLEMENTACIÓN
==================================================

Construye el proyecto en fases:

Fase 1:
- monorepo
- docker
- db
- auth
- user profile
- wallet generation
- kyc base models

Fase 2:
- smart contracts
- hardhat node
- deploy scripts
- blockchain integration

Fase 3:
- KYC flow frontend/backend
- uploads demo
- compliance simulation service
- admin compliance review

Fase 4:
- simulated deposits por tarjeta y banco
- internal ledger
- dashboard
- history

Fase 5:
- transfers internal + onchain
- technical details page
- admin panel general

Fase 6:
- polishing UI
- tests
- README final

==================================================
18. ENTREGABLES ESPERADOS
==================================================

Quiero que generes:
1. Estructura completa del proyecto
2. Código funcional base en frontend/backend/contracts
3. Docker Compose listo
4. Prisma schema y migraciones
5. Smart contracts + deploy
6. README completo
7. .env.example
8. Seed scripts
9. Swagger
10. UI limpia y responsive
11. Flujo KYC simulado completo

==================================================
19. REGLAS IMPORTANTES DE IMPLEMENTACIÓN
==================================================

- No uses integraciones reales de Stripe, bancos ni exchanges.
- No uses integraciones reales de KYC providers.
- Si necesitas emular pagos, crea PaymentSimulationService.
- Si necesitas emular KYC/AML, crea ComplianceSimulationService.
- Si necesitas emular email, usa logs o mailbox local falso.
- Mantén el sistema simple pero profesional.
- Siempre prioriza claridad y mantenibilidad.
- Si una función parece demasiado compleja para el objetivo educativo, implementa una versión simplificada y documenta cómo se extendería en el futuro.

==================================================
20. EXTRA
==================================================

Además del código, quiero que me dejes:
- una lista de comandos para correr todo desde cero
- pasos para subirlo a GitHub
- sugerencia de nombres de repositorio
- issues iniciales recomendados
- roadmap de mejoras futuras

Ahora empieza creando la estructura del monorepo, el docker-compose, los package.json base, los apps web/api, el package de contracts, el schema de Prisma, y el README inicial. Luego continúa con el resto hasta dejar una primera versión funcional coherente.