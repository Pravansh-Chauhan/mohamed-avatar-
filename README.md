# Sawt Atlas (Darija-inspired TTS)

Original full-stack Next.js application with a dark RTL Moroccan Arabic interface, credits workflow, generation history, provider adapters, and demo-safe fallback mode.

## Stack
- Next.js App Router + TypeScript + Tailwind
- Prisma + PostgreSQL schema
- Zod validation
- Adapter boundaries for auth, TTS, storage, and Stripe payments

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. For persistent DB mode, run PostgreSQL and execute:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   npm run prisma:seed
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

## Demo mode behavior
When `AUTH_PROVIDER=demo` and `TTS_PROVIDER=mock` (default):
- Dashboard is protected by a safe local auth fallback user.
- Generation uses a mock TTS provider and saves local WAV files in `public/generated`.
- Stripe billing remains disabled and explicitly marked as configuration boundary.

## Scripts
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Production notes
- Configure real auth provider through headers/session wiring (Auth.js/Clerk boundary in `lib/auth.ts`).
- Implement real provider in `lib/tts/provider.ts` and set `TTS_PROVIDER` + credentials.
- Replace local storage adapter with S3-compatible adapter in `lib/storage/adapter.ts`.
- Activate Stripe by setting `STRIPE_SECRET_KEY` and webhook handling.
- Add distributed rate limiting (Redis/Upstash/etc.) replacing in-memory placeholder in `lib/rate-limit.ts`.
