<div align="center">

# EduChain Exchange

**A full-stack crypto exchange simulator built for learning — from KYC to on-chain token flows.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22-FFF100?logo=hardhat&logoColor=black)](https://hardhat.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?logo=opensourceinitiative&logoColor=white)](./LICENSE)

[![GitHub last commit](https://img.shields.io/github/last-commit/FernandoZnga/blockchain?logo=github)](https://github.com/FernandoZnga/blockchain/commits/main)
[![GitHub stars](https://img.shields.io/github/stars/FernandoZnga/blockchain?style=social)](https://github.com/FernandoZnga/blockchain)
[![GitHub issues](https://img.shields.io/github/issues/FernandoZnga/blockchain)](https://github.com/FernandoZnga/blockchain/issues)
[![GitHub repo size](https://img.shields.io/github/repo-size/FernandoZnga/blockchain)](https://github.com/FernandoZnga/blockchain)

</div>

---

## Overview

EduChain Exchange is an educational full-stack demo that simulates a modern crypto exchange experience on a private/local blockchain. It includes simulated KYC, demo fiat deposits, internal wallet balances, on-chain token flows, admin review tooling, and a minimal professional UI.

> [!WARNING]
> **Educational project only.** Does not connect to real banks, payment processors, or public blockchains. KYC/AML checks are simulated. Not for production use.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router) · React 19 · Tailwind CSS · React Hook Form · Zod · TanStack Query · ethers.js |
| **Backend** | NestJS 11 · Prisma · PostgreSQL · JWT · Swagger · bcrypt · class-validator |
| **Blockchain** | Hardhat · Solidity · OpenZeppelin · ERC-20 demo token · Transaction registry |
| **Infrastructure** | Docker Compose · PostgreSQL 16 · Adminer · Hardhat JSON-RPC node |
| **Tooling** | pnpm workspaces · TypeScript · Prettier · ESLint |

---

## Architecture

```text
educhain-exchange/
├── apps/
│   ├── web/            # Next.js — user & admin interface
│   └── api/            # NestJS — auth, KYC, deposits, transfers, admin
├── packages/
│   ├── contracts/      # Solidity contracts, Hardhat config, deploy scripts
│   ├── ui/             # Shared UI primitives
│   └── config/         # Shared config placeholders
└── infrastructure/     # Docker Compose, scripts, operational helpers
```

### System Flow

```text
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Browser  │────>│  Next.js │────>│  NestJS API  │────>│  PostgreSQL  │
│  (React)  │<────│  (SSR)   │<────│  (REST/JWT)  │<────│  (Prisma)    │
└──────────┘     └──────────┘     └──────┬───────┘     └──────────────┘
                                         │
                                         v
                                  ┌──────────────┐
                                  │ Hardhat Node  │
                                  │ (ERC-20 +     │
                                  │  Registry)    │
                                  └──────────────┘
```

1. User registers through the web app
2. API creates user, wallet, and initial KYC profile
3. Simulated KYC runs through local rules + admin review
4. Approved users submit demo deposits
5. Approved deposits update the internal ledger and mint demo tokens on-chain
6. Transfers are recorded in PostgreSQL and optionally mirrored on-chain

---

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) + Docker Compose
- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 10+

### 1. Clone & configure

```bash
git clone https://github.com/FernandoZnga/blockchain.git
cd blockchain
cp .env.example .env
```

> The API reads additional variables from `apps/api/.env.example` and the web app from `apps/web/.env.example`.

### 2. Run with Docker (recommended)

```bash
docker compose -f infrastructure/docker-compose.yml up --build
```

Once running:

| Service | URL |
|---|---|
| Web | [http://localhost:3000](http://localhost:3000) |
| API | [http://localhost:4000](http://localhost:4000) |
| Swagger Docs | [http://localhost:4000/docs](http://localhost:4000/docs) |
| Hardhat RPC | [http://localhost:8545](http://localhost:8545) |
| Adminer (DB UI) | [http://localhost:8080](http://localhost:8080) |
| PostgreSQL | `localhost:5432` |

### 3. Local Development (without Docker)

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm contracts:deploy
pnpm dev
```

---

## Demo Accounts

The seed script creates the following accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@educhain.local` | `AdminPass123!` |
| Compliance | `compliance@educhain.local` | `CompliancePass123!` |
| User | `ava@educhain.local` | `UserPass123!` |
| User | `liam@educhain.local` | `UserPass123!` |
| User | `sofia@educhain.local` | `UserPass123!` |

---

## Features

- **Auth** — Registration, login, logout, JWT refresh tokens, simulated email verification
- **Wallets** — Automatic wallet creation with encrypted private keys
- **KYC** — Simulated identity verification with personal data, documents, selfie, compliance checks, and admin review
- **Deposits** — Simulated bank/card deposits with approval and failure rules
- **Transfers** — Internal ledger + full transfer history
- **Blockchain** — Local-chain demo ERC-20 token and on-chain transaction registry
- **Learn** — Educational pages covering wallets, keys, gas, KYC, AML, and internal ledger vs blockchain
- **Admin** — Dashboard for managing users, wallets, KYC cases, deposits, and transfers

---

## Database & Contracts

### Prisma

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:migrate    # Run migrations
pnpm db:seed       # Seed demo data
```

### Smart Contracts

```bash
pnpm --filter @educhain/contracts test    # Run contract tests
pnpm --filter @educhain/contracts deploy  # Deploy to local Hardhat node
```

The deploy script writes ABI/address metadata consumed by the API and web app.

---

## Security Notes

- Passwords hashed with **bcrypt**
- **JWT** access + refresh token authentication
- Sensitive deposit and banking values **masked** before persistence
- Private keys **encrypted** using a master key from environment variables
- KYC uploads stored locally and served only through **protected endpoints**

---

## Limitations

> This is a demo — here's what it does **not** include:

- No real compliance or identity verification
- No production-grade key management or custody
- Demo blockchain assumptions only (local Hardhat network)
- Minimal background processing; deposits are processed synchronously

---

## Roadmap

- [ ] Redis-backed background jobs
- [ ] Observability & structured logging
- [ ] Stronger test coverage (unit + e2e)
- [ ] Multi-network contract support
- [ ] Object storage abstraction for demo assets

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
  <sub>Built for learning by <a href="https://github.com/FernandoZnga">Fernando Zuniga</a></sub>
</div>
