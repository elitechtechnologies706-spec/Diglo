# Diglo Ventures

Branding and printing website for growing businesses in Kampala, Uganda.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

- Preview only. Do not deploy or suggest publishing unless the user changes this instruction.
- English only; no Luganda or slang.
- The strict brand palette and orange-use restrictions in the supplied brief take precedence over generic design guidance.
- Offer exactly six services: Brand Identity, Business Printing, Large Format, Apparel, Packaging, and Brand Refresh. Do not add social media services or social links.
- Differentiate mobile navigation from desktop navigation; desktop links have no dropdown icons.
- Exact testimonial quotes and FAQ answers from the referenced earlier brief were not available. Do not invent customer quotes.
- No WhatsApp or phone number was supplied. Do not invent contact details or imply that live order tracking is connected.
- Functionality additions must preserve the established colours and design.
- The user explicitly chose Supabase for leads, orders and admin authentication. Do not replace it with another provider.
- A queued offline quote must never display the sent confirmation until Supabase confirms receipt.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
