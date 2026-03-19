# EduChain Exchange

EduChain Exchange is an educational full-stack demo that simulates a modern crypto exchange experience on a private/local blockchain. It includes simulated KYC, demo fiat deposits, internal wallet balances, on-chain token flows, admin review tooling, and a minimal professional UI.

## Educational Disclaimer

- This project is for demonstration and learning only.
- It does not connect to real banks, cards, payment processors, or public blockchains.
- KYC, AML, sanctions screening, and face verification are simulated.
- Security practices are reasonable for a demo, not production-grade compliance or custody.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, TanStack Query, ethers.js
- Backend: NestJS, Prisma, PostgreSQL, JWT auth, Swagger, bcrypt, class-validator
- Blockchain: Hardhat, Solidity, local Hardhat node, demo ERC20 token, transaction registry
- Infra: Docker Compose, PostgreSQL, API, Web, Hardhat node, Adminer
- Monorepo: pnpm workspaces

## Architecture

```text
apps/web      -> Next.js user/admin interface
apps/api      -> NestJS API, auth, KYC, deposits, transfers, history, admin
packages/contracts -> Solidity contracts, Hardhat config, deploy scripts, contract tests
packages/ui   -> Shared UI primitives
packages/config -> Shared config placeholders
infrastructure -> docker-compose, scripts, demo operational helpers
```

System flow:

1. User registers through the web app.
2. API creates the user, wallet, and initial KYC profile.
3. Simulated KYC runs through local rules and admin review.
4. Approved users can submit demo deposits.
5. Approved deposits update the internal ledger and can mint demo tokens on the local chain.
6. Transfers are recorded in PostgreSQL and optionally mirrored on-chain.

## Quick Start

### Prerequisites

- Docker + Docker Compose
- pnpm 10+
- Node.js 22+

### Environment

Copy `.env.example` to `.env` at the repo root and adjust values if needed.

The API also reads app-level variables from `apps/api/.env.example`, and the web app from `apps/web/.env.example`.

### Run with Docker

```bash
docker compose -f infrastructure/docker-compose.yml up --build
```

Services:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- Swagger: `http://localhost:4000/docs`
- PostgreSQL: `localhost:5432`
- Hardhat RPC: `http://localhost:8545`
- Adminer: `http://localhost:8080`

### Local Development

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm contracts:deploy
pnpm dev
```

## Demo Accounts

Seeded credentials:

- Admin: `admin@educhain.local` / `AdminPass123!`
- Compliance: `compliance@educhain.local` / `CompliancePass123!`
- Demo user: `ava@educhain.local` / `UserPass123!`
- Demo user: `liam@educhain.local` / `UserPass123!`
- Demo user: `sofia@educhain.local` / `UserPass123!`

## Main Features

- Registration, login, logout, refresh tokens, simulated email verification
- Automatic wallet creation with encrypted private keys
- Simulated KYC with personal data, documents, selfie, compliance checks, and admin review
- Simulated bank/card deposits with approval and failure rules
- Internal ledger + transfer history
- Local-chain demo token and transaction registry
- Learn page covering wallets, keys, gas, KYC, AML, and internal ledger vs blockchain
- Admin dashboard for users, wallets, KYC cases, deposits, and transfers

## Prisma and Migrations

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Contracts

```bash
pnpm --filter @educhain/contracts test
pnpm --filter @educhain/contracts deploy
```

The deploy script writes ABI/address metadata consumed by the API and web app.

## Ports

- `3000` web
- `4000` api
- `5432` postgres
- `8545` hardhat node
- `8080` adminer

## Security Notes

- Passwords are hashed with bcrypt.
- JWT access and refresh tokens are used.
- Sensitive deposit and banking values are masked before persistence.
- Private keys are encrypted using a master key from environment variables.
- KYC uploads are stored locally and served only through protected endpoints.

## Limitations

- No real compliance or identity verification.
- No production key management.
- Demo blockchain assumptions only.
- Minimal background processing; deposit processing is synchronous or short-delay demo logic.

## Roadmap

- Redis-backed jobs
- Better observability
- Stronger test coverage
- Multi-network contract support
- Real object storage abstraction for demo assets

## Suggested Commits

1. `chore: scaffold monorepo and docker baseline`
2. `feat(api): add auth wallet and kyc foundations`
3. `feat(contracts): add demo token and registry`
4. `feat(web): add dashboard kyc and deposit flows`
5. `docs: finalize readme and developer workflows`
