# Sovereign Counsel Backend

Production-ready NestJS + Prisma backend for matter-centric legal SaaS.

## Quick start

1. Copy envs:
   - `cp .env.example .env` (Windows PowerShell: `Copy-Item .env.example .env`)
2. Configure PostgreSQL in `.env`.
3. Generate Prisma client and run migrations:
   - `npm run prisma:generate`
   - `npm run prisma:migrate -- --name init`
4. Start API:
   - `npm run start:dev`

Base URL: `http://localhost:4000/api/v1`

## Implemented core endpoints

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /users`
- `POST /users`
- `GET /matters`
- `POST /matters`
- `GET /matters/:id`
- `PATCH /matters/:id`
- `POST /tasks`
- `GET /tasks`
- `POST /documents/upload`
- `GET /documents`
- `POST /billing`
- `GET /billing`
- `GET /dashboard/stats`
- `GET /notifications`
- `GET /audit-logs`
