#!/usr/bin/env sh
set -eu

corepack enable
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm contracts:deploy
