# vhistory Implementation Plan

This plan details the scaffolding of `vhistory`, a Vietnamese Dialect Dictionary using Next.js 15, Hono, and Better-Auth.

## User Review Required

> [!IMPORTANT]
>
> - Confirm the PostgreSQL Docker setup matches the application formatting.
> - `unaccent` extension requires superuser privileges in Postgres to install initially.

## Proposed Changes

### Project Initialization

- Single-repo Next.js 15 application.
- Configure Tailwind CSS with the "Earth Tones" palette.
- Install Shadcn UI.

### Database (PostgreSQL + Drizzle)

- Update `docker-compose.yaml` to ensure healthy Postgres instance.
- Setup Drizzle ORM in `src/lib/db`.
- **Schema:**
  - Table `words`: `id`, `content`, `definition`, `dialect_type`, `region_id`, `usage_example`, `created_at`.
  - **Index:** GIN index on `content` using `unaccent` extension.

### Backend (Hono)

- Setup Hono server in `src/app/api/[[...route]]/route.ts`.
- **Runtime:** Configure `export const runtime = 'edge'` for Cloudflare Pages compatibility.
- Implement `GET /search` using Drizzle query with `sql` operator for `unaccent`.
- Export type-safe RPC client.

### Authentication (Better-Auth)

- Integrate Better-Auth with Drizzle adapter.
- Configure Google and Credential providers.
- Protect write actions (create/edit words).

### UI/UX

- **Fonts:** Merriweather (Headings), Inter (Body).
- **Components:**
  - Hero Search Bar (Cultural/Heritage style).
  - Interactive Map Placeholder (Nivo).
  - Word of the Day Card.

## Verification Plan

### Automated Tests

- N/A for scaffolding phase (manual verification preferred).

### Manual Verification

1.  **Start DB:** `docker-compose up -d`
2.  **Migrations:** Run `bun db:push` / `bun db:migrate`.
3.  **Dev Server:** Run `bun dev`.
4.  **Search Test:** Access `/api/search?q=Hue` and expect `Huế` results (after seeding data).
5.  **UI Check:** Visually verify the Earth Tones theme and Font usage.
