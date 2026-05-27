# Blog with LaTeX

A personal blog built with Next.js 16 (App Router), featuring Markdown editing, LaTeX math rendering via KaTeX, code syntax highlighting, and a SQLite database. Supports light/dark/system theme switching and one-click Vercel deployment.

## Features

- **Markdown + LaTeX**: Write posts with full LaTeX math support (inline `$...$` and block `$$...$$`)
- **Code syntax highlighting**: GitHub-style code blocks via highlight.js
- **Dark/Light theme**: Three-mode theme toggle (light, dark, system) with localStorage persistence
- **Tag hierarchy**: Organize tags with parent-child directory structure
- **Admin panel**: Full CRUD for posts and tags, site configuration, dashboard with charts
- **Inline editing**: One-click Edit button on post pages (log in to see it)
- **One-click deploy**: "Deploy to Vercel" button in admin dashboard pushes to GitHub and triggers deployment
- **Static export**: Generate fully static HTML for Vercel/static hosting
- **Docker support**: Multi-stage Docker build for standalone deployment

## Quick Start

```bash
cd blog
npm install
npm run db:setup    # Initialize database + seed data
npm run dev         # Start at http://localhost:3000
```

Default admin login: `admin@blog.com` / `admin123`

## Documentation

Full documentation in [doc/USAGE.md](doc/USAGE.md) (Chinese). Covers:
- Writing guides (Markdown, LaTeX, images)
- Admin panel usage (posts, tags, config)
- Theme switching (light/dark/system)
- One-click Vercel deployment
- Static export and Vercel deployment
- Docker deployment
- Environment variables

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run build:export` | Build static files for Vercel |
| `npm run db:setup` | Initialize database + seed |
| `npm run lint` | Run ESLint |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite via Prisma 7 + libsql adapter
- **Auth**: NextAuth v5 (Credentials provider, JWT sessions)
- **Styling**: Tailwind CSS v4 + @tailwindcss/typography
- **Theme**: next-themes (class-based dark mode)
- **Editor**: EasyMDE (react-simplemde-editor)
- **Rendering**: react-markdown + remark-math + rehype-katex + rehype-highlight
- **Charts**: Recharts
- **Toast**: Sonner
