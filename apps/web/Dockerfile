FROM node:22-alpine

WORKDIR /app

COPY . .

RUN corepack enable

EXPOSE 3000

CMD ["sh", "-c", "pnpm install && pnpm --filter @educhain/web build && pnpm --filter @educhain/web start"]
