FROM node:22-alpine

WORKDIR /app

COPY . .

RUN corepack enable

EXPOSE 8545

CMD ["sh", "-c", "pnpm install && pnpm --filter @educhain/contracts exec hardhat node --hostname 0.0.0.0"]
