Petit projet NestJS pour appliquer mes connaissances Node.js/Express et mettre en pratique des best practices (validation, typage strict, separation controller/service, auth JWT, etc.).

## Technos

- NestJS + TypeScript
- MongoDB (local via Docker) + Mongoose (`@nestjs/mongoose`)
- Auth JWT via Passport (`passport`, `passport-jwt`, `@nestjs/passport`, `@nestjs/jwt`)
- Validation/transform des données entrantes via `class-validator` + `class-transformer`

## Principe Du Backend

- API HTTP JSON sous prefixe `api` (ex: `GET /api/...`).
- Les DTO valident/transforment les données entrantes; les services portent la logique et filtrent les ressources par `ownerId`.
- Authentification via JWT (Bearer token) + guard; les routes métier sont protegées.
- Les reponses exposent `id` (et pas `_id`) via un transform Mongoose commun.

## Project Setup

```bash
pnpm install
```

## Run

```bash
# dev
pnpm run start:dev

# prod
pnpm run build
pnpm run start:prod
```

## Tests

```bash
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```
