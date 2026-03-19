FROM node:22-alpine

WORKDIR /app

COPY . .

RUN corepack enable

EXPOSE 4000

CMD ["sh", "-c", "pnpm install && pnpm db:generate && pnpm --filter @educhain/api build && pnpm --filter @educhain/api start"]
