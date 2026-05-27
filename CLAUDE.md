# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A personal blog built with Next.js 16 (App Router), featuring Markdown editing, LaTeX math rendering via KaTeX, and a SQLite database. The app runs standalone in Docker and uses Prisma with the libsql adapter (Turso-compatible).

All source code lives under `blog/`.

## Commands

```bash
cd blog

npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build (output: standalone)
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to SQLite (no migrations)
npm run db:seed      # Seed admin user, sample posts, and site config
npm run db:setup     # db:push + db:seed
npx prisma generate  # Regenerate Prisma client after schema changes
```

Docker:

```bash
cd blog
docker compose up -d          # Build and start
docker compose down -v        # Tear down (removes volume/database)
```

## Architecture

### Database (SQLite via libsql + Prisma)

- **Provider**: SQLite via `@prisma/adapter-libsql` — uses `@libsql/client` under the hood
- **Schema**: `prisma/schema.prisma` — models: `User`, `Post`, `Tag`, `PostTag` (many-to-many), `SiteConfig` (key-value store)
- **Generated client**: Custom output path `src/generated/prisma/` (not the default `node_modules` location)
- **DB file**: `data.db` at repo root in dev; `/app/data/blog.db` inside the Docker container
- **Singleton pattern**: `src/lib/prisma.ts` caches the client on `globalThis` in dev to survive hot reloads

### Auth (NextAuth v5 beta)

- `src/lib/auth.ts` — NextAuth configured with the Credentials provider (email + password, bcrypt-hashed)
- JWT session strategy; session carries `user.id`
- Route handler at `src/app/api/auth/[...nextauth]/route.ts`
- Admin layout at `src/app/(admin)/admin/layout.tsx` checks the session server-side and redirects to `/admin/login` if unauthenticated

### Routing (App Router)

**Public pages:**
- `/` — post list with pagination, tag filter, and tag sidebar (`src/app/page.tsx`)
- `/posts/[slug]` — single post view
- `/tag/[tag]` — posts filtered by tag slug

**Admin pages** (route group `(admin)`, protected by layout):
- `/admin` — dashboard
- `/admin/posts` — post list with edit/delete
- `/admin/posts/new` — create post (Markdown editor)
- `/admin/posts/[id]/edit` — edit post
- `/admin/tags` — manage tags
- `/admin/config` — site config (title, description, etc.)

**Login:**
- `/admin/login` — login form (public, uses NextAuth `signIn`)

### API routes

All routes are under `src/app/api/`:

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /api/posts` | No | List published posts (paginated, filterable by tag) |
| `POST /api/posts` | Yes | Create post |
| `PUT /api/posts/[id]` | Yes | Update post |
| `DELETE /api/posts/[id]` | Yes | Delete post |
| `GET /api/tags` | No | List all tags |
| `POST /api/tags` | Yes | Create tag |
| `GET /api/config` | No | Get all site config |
| `PUT /api/config` | Yes | Upsert site config entries |

### Key libraries

- **Markdown editing**: `easymde` + `react-simplemde-editor` (dynamically imported, no SSR) in `PostEditor`
- **Markdown rendering**: `react-markdown` with `remark-math` + `rehype-katex` + `rehype-highlight` in `MarkdownRenderer`
- **Styling**: Tailwind CSS v4 with `@tailwindcss/typography` for prose content

### Slug generation

`src/lib/slug.ts` — converts a title to a URL-safe slug (lowercase, replace non-word chars with hyphens). Used when creating posts and tags. On slug collision when creating a post, a timestamp suffix is appended.

### Site configuration

`src/lib/siteConfig.ts` — reads key-value pairs from the `SiteConfig` table. Used by the root layout to generate `<meta>` tags and by the homepage to render the site title/subtitle. Seeded with defaults in `prisma/seed.ts`.

### Docker

Multi-stage build producing a standalone Node.js image. Entrypoint script (`docker-entrypoint.sh`) runs `prisma db push` and seeds the database before starting the server.

## Working style

When you need to ask the user questions or confirm requirements, **always use the `AskUserQuestion` tool** instead of embedding questions in plain text responses. **Always ask questions in Chinese (中文).**
