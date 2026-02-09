# Gym Management Platform

Full-stack gym management and payment processing platform built on Stripe, targeting 24-hour gyms, PT studios, and functional fitness facilities in the US market.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm dev:web` | Start web dashboard only |
| `pnpm test` | Run all tests |
| `pnpm test:unit` | Unit tests only |
| `pnpm test:e2e` | End-to-end tests (Playwright) |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed development data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm stripe:listen` | Start Stripe webhook listener |

## Architecture

- **Monorepo**: Turborepo with pnpm workspaces
- **Frontend**: Next.js 14 App Router, React Native (Expo)
- **API**: tRPC for type-safe client-server communication
- **Database**: PostgreSQL via Prisma ORM (hosted on Supabase)
- **Payments**: Stripe Connect + Billing (NEVER store card data locally)
- **Auth**: NextAuth.js with database sessions
- **Styling**: TailwindCSS + Shadcn/ui (dark theme default)
- **Testing**: Vitest (unit) + Playwright (E2E)

## Key Directories

- `apps/web/` - Next.js dashboard and marketing site
- `packages/api/` - tRPC routers and business logic
- `packages/db/` - Prisma schema, migrations, seeds
- `packages/shared-kernel/` - Result types, branded IDs, value objects
- `packages/ui/` - Shared UI components (Shadcn/ui re-exports)
- `packages/eslint-config/` - Shared ESLint configuration
- `tests/` - E2E, integration, and fixture files

## Code Standards

- TypeScript strict mode everywhere - no `any` types
- Named exports only (no default exports except pages/layouts)
- Functional components with hooks
- Use `unknown` instead of `any`
- Error boundaries around payment flows
- Zod for all runtime validation
- All API mutations must be idempotent

## Domain Terms

| Term | Definition |
|------|------------|
| Gym | A single physical location (can be part of a franchise) |
| Member | End user with active membership |
| Staff | Trainers, front desk, managers |
| Owner | Gym business owner (platform customer) |
| Plan | Membership type (e.g., "24/7 Access", "PT Package") |
| Subscription | Active Stripe subscription for a member |
| Check-in | Member entry event (door access or manual) |

## Critical Rules

### NEVER

- Store payment card data outside Stripe
- Commit .env files or API keys
- Skip webhook signature validation
- Auto-bill after cancellation is confirmed
- Deploy without running `pnpm typecheck && pnpm test`
- Use `any` type - use `unknown` and narrow with type guards
- Push directly to main branch

### ALWAYS

- Use Stripe idempotency keys for payment operations
- Log payment events before AND after Stripe API calls
- Handle Stripe webhook retries gracefully (check if already processed)
- Test payment flows in Stripe test mode first
- Add explicit error messages for billing failures
- Run typecheck after modifying TypeScript files
- Create feature branches for all changes

## Stripe Webhook Handler

Location: `/apps/web/app/api/webhooks/stripe/route.ts`

```typescript
// MUST validate signatures
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

// MUST check for duplicate processing
const existing = await db.webhookEvent.findUnique({ where: { id: event.id } });
if (existing) return new Response('Already processed');
```

## Database Conventions

- All tables have `id`, `created_at`, `updated_at`
- Soft deletes via `deleted_at` for member/subscription data
- Use transactions for multi-table billing operations
- Foreign keys use `_id` suffix (e.g., `member_id`, `gym_id`)
- See `packages/db/prisma/schema.prisma` for current schema

## Testing Requirements

- Unit tests for all billing calculation logic
- Integration tests for Stripe webhook handlers
- E2E tests for member signup and payment flows
- Mock Stripe in tests using fixtures in `tests/fixtures/stripe/`
- Run single tests during development: `pnpm test -- path/to/test.ts`

## File Naming

- Components: PascalCase (`MemberList.tsx`)
- Utilities: camelCase (`formatCurrency.ts`)
- Types: PascalCase with `.types.ts` suffix (`member.types.ts`)
- Tests: Same name with `.test.ts` suffix (`formatCurrency.test.ts`)
- API routes: lowercase with hyphens (`webhook-stripe/`)

## Import Order

1. External dependencies (`react`, `next`, etc.)
2. Internal packages (`@gym/...`)
3. Local imports (`./`, `../`)
4. Types (last, with `type` keyword)

## Error Handling

```typescript
// Use Result pattern from @gym/shared-kernel
import { ok, err, type Result } from "@gym/shared-kernel";

// Billing errors must be specific
class PaymentDeclinedError extends Error { /* ... */ }
class SubscriptionNotFoundError extends Error { /* ... */ }
```

## When Uncertain

- **Payment logic**: Ask clarifying questions before implementing
- **Schema changes**: Create migration, don't modify existing migrations
- **Third-party integrations**: Check `/docs/integrations/` first
- **Security concerns**: Flag and discuss before proceeding

## Current Sprint Focus

- [x] Phase 0: Foundation Setup
- [ ] Phase 1: Core Data Models & Auth
