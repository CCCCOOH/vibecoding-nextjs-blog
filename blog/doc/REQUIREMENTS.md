# Blog Website with LaTeX & Admin - Requirements Document

## Overview

A self-hosted blog website built with Next.js, supporting LaTeX/math formula rendering in posts and a full admin management backend.

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 (App Router) | Latest stable |
| Database | SQLite via Prisma 7 ORM | Uses @prisma/adapter-libsql |
| Auth | NextAuth.js v5 (Credentials provider) | Server-side auth check in admin layout |
| LaTeX | KaTeX | Client-side rendering |
| Markdown | react-markdown + remark-math + rehype-katex + rehype-highlight | |
| Code Highlighting | highlight.js (GitHub theme) via rehype-highlight | |
| Editor | ReactSimpleMDE (EasyMDE) | Markdown editor with toolbar |
| Styling | Tailwind CSS 4 + @tailwindcss/typography | |
| Deployment | Docker (multi-stage build) | Standalone output mode |

## Data Model (Prisma)

```
User        id, name, email, password(hashed), createdAt
Post        id, title, slug, content(markdown), excerpt, published(bool), createdAt, updatedAt
Tag         id, name, slug
PostTag     postId, tagId  (composite PK)
SiteConfig  id, key(unique), value, updatedAt
```

## Routes

### Public
- `/` — Post list with pagination and tag filters
- `/posts/[slug]` — Post detail with rendered LaTeX
- `/tag/[tag]` — Posts filtered by tag

### Admin (auth-protected via layout)
- `/admin` — Dashboard
- `/admin/login` — Login page (route group, no auth required)
- `/admin/posts` — Post CRUD list
- `/admin/posts/new` — Create post
- `/admin/posts/[id]/edit` — Edit post
- `/admin/tags` — Tag management
- `/admin/config` — Site configuration (title, SEO, author info, footer, etc.)

### API
- `GET /api/posts` — List posts (public)
- `POST /api/posts` — Create post (auth required)
- `PUT /api/posts/[id]` — Update post (auth required)
- `DELETE /api/posts/[id]` — Delete post (auth required)
- `GET /api/tags` — List tags
- `POST /api/tags` — Create tag (auth required)
- `GET /api/config` — List all site configs (public)
- `PUT /api/config` — Batch update site configs (auth required)

## Directory Structure

```
/
├── Dockerfile
├── docker-compose.yml
├── docker-entrypoint.sh
├── next.config.ts              # output: "standalone"
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css          # KaTeX + Tailwind imports
│   │   ├── page.tsx             # Post list
│   │   ├── posts/[slug]/page.tsx
│   │   ├── tag/[tag]/page.tsx
│   │   ├── admin/
│   │   │   └── login/           # Login (no admin layout)
│   │   ├── (admin)/
│   │   │   └── admin/           # Auth-protected admin pages
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── MarkdownRenderer.tsx
│   │   ├── ArticleContent.tsx   # Inline article view/edit toggle
│   │   ├── PostCard.tsx
│   │   ├── TagBadge.tsx
│   │   ├── Pagination.tsx
│   │   └── admin/
│   │       ├── AdminSidebar.tsx
│   │       ├── PostEditor.tsx
│   │       └── PostForm.tsx
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client with libsql adapter
│   │   ├── auth.ts              # NextAuth config
│   │   ├── siteConfig.ts        # Site config DB helpers
│   │   └── slug.ts
│   └── generated/prisma/        # Generated Prisma client
```

## LaTeX Support

Inline: `$E = mc^2$`
Block: `$$\int_0^\infty f(x)dx$$`

Rendered via remark-math + rehype-katex plugins in react-markdown. KaTeX CSS loaded globally in `globals.css`.

## Code Syntax Highlighting

Fenced code blocks are highlighted using `rehype-highlight` (highlight.js) with the GitHub theme. Supports all languages recognized by highlight.js.

## Inline Editing

Authenticated users can edit articles directly from the public article page (`/posts/[slug]`). An "Edit" button appears in the header when logged in, toggling the page between view mode and an inline editor (EasyMDE with tag selector and publish control).

## Site Configuration

Site metadata is stored in the database (`SiteConfig` model) and managed via the admin panel at `/admin/config`. Configurable keys include:
- `site_title`, `site_subtitle`, `site_description` — Page title and SEO description
- `site_keywords` — SEO keywords
- `author_name`, `author_avatar`, `author_bio` — Author profile
- `footer_text` — Footer content

The root layout and homepage read these values dynamically, with hardcoded fallbacks if keys are missing.

## Getting Started

```bash
# Install dependencies
npm install

# Set up database and seed
npm run db:setup

# Run development server
npm run dev

# Production build
npm run build
npm start
```

## Docker

```bash
# Build and start
docker-compose up -d

# First-time setup (database + seed)
docker-compose exec blog npx prisma db push
docker-compose exec blog npx tsx prisma/seed.ts
```

Default admin: `admin@blog.com` / `admin123`

## Implementation Status

- [x] Step 1: Project Scaffolding
- [x] Step 2: Prisma Schema & Seed
- [x] Step 3: Auth Setup (NextAuth v5)
- [x] Step 4: API Routes (CRUD posts + tags)
- [x] Step 5: Public Pages (home, post detail, tag filter)
- [x] Step 6: Admin Pages (dashboard, posts CRUD, tags)
- [x] Step 7: Docker Setup (Dockerfile + compose)
- [x] Step 8: Build verification (clean build, no errors)
- [x] Step 9: Code syntax highlighting (rehype-highlight + highlight.js)
- [x] Step 10: Inline article editing (ArticleContent view/edit toggle)
- [x] Step 11: Site configuration (SiteConfig model, admin page, dynamic metadata)
