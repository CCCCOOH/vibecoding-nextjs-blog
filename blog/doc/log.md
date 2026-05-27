# Changelog

## 2026-05-27 (Update 3)

### Added

- **Dark/Light theme toggle**: Added theme switching with three modes: light, dark, and system (auto). A theme toggle button with sun/moon icon sits in the global navigation bar.
  - `package.json` — added `next-themes` dependency
  - `src/components/ThemeProvider.tsx` — new client component wrapping `next-themes` ThemeProvider (class-based, system default, no transition flash)
  - `src/components/ThemeToggle.tsx` — new client component with sun/moon/system icons and three-mode cycling
  - `src/components/Navbar.tsx` — new global sticky top navigation bar with site title link and ThemeToggle
  - `src/app/layout.tsx` — added `suppressHydrationWarning`, `<ThemeProvider>`, and `<Navbar />`
  - `src/app/globals.css` — added `@custom-variant dark (&:where(.dark, .dark *))` and `.dark` CSS variable overrides
  - All components (~20 files) — added `dark:` variant classes for backgrounds, text, borders, and hover states

- **One-click Deploy to Vercel**: Admin dashboard now has a "Deploy to Vercel" button that runs git add/commit/push to trigger Vercel auto-deployment.
  - `src/app/api/deploy/route.ts` — new POST API (auth-gated, runs `git add -A && git commit && git push`)
  - `src/components/admin/DeployButton.tsx` — new client component with loading state and sonner toast feedback
  - `src/app/(admin)/admin/page.tsx` — added `<DeployButton />` to the action buttons row

### Changed

- **Edit button on public post pages**: Edit button now checks real NextAuth session (was hardcoded `false`). Clicking it navigates to `/admin/posts/[id]/edit` instead of inline editing.
  - `src/app/posts/[slug]/page.tsx` — added `auth()` call, removed hardcoded `isLoggedIn={false}`, removed `allTags` fetch
  - `src/components/ArticleContent.tsx` — removed entire inline editor (120+ lines: `isEditing` state, EasyMDE form, tag selector, save/cancel handlers); replaced Edit button with `<Link>` to admin edit page; removed `allTags` prop

### Fixed

- **Auth route `force-static`**: Removed `export const dynamic = "force-static"` from all API routes and pages. This was breaking login, logout, and session checks because Next.js was serving cached static responses instead of running the handlers dynamically. Also added `force-dynamic` to admin layout.
  - All 11 files in `src/app/api/` and `src/app/` — removed `force-static` declarations
  - `src/app/(admin)/admin/layout.tsx` — added `force-dynamic`

---

## 2026-05-27 (Update 2)

### Removed

- **Posts per Year chart**: Removed the bar chart from the admin dashboard.
  - `src/app/(admin)/admin/DashboardCharts.tsx` — removed `BarChart`, `Bar` imports and the entire "Posts per Year" chart block
  - `src/app/(admin)/admin/page.tsx` — removed `yearlyData` aggregation and `yearlyPosts` prop

### Added

- **Static export for Vercel deployment**: The blog now supports static site generation via `npm run build:export`. Public pages are statically generated from the SQLite database at build time; admin panel is available only in dev mode.
  - `next.config.ts` — changed `output` from `"standalone"` to `"export"`
  - `package.json` — added `build:export` script
  - `src/app/posts/[slug]/page.tsx` — added `generateStaticParams` for all published post slugs; removed `auth()` call
  - `src/app/tag/[tag]/page.tsx` — added `generateStaticParams` for all tag slugs; removed pagination
  - `src/app/page.tsx` — removed `searchParams`-based pagination and tag filtering; removed `auth()`; shows all published posts
  - `src/app/(admin)/admin/layout.tsx` — detects `NEXT_EXPORT` env var and renders placeholder instead of calling `auth()`
  - `src/app/(admin)/admin/posts/[id]/edit/page.tsx` — added `generateStaticParams` returning `[]`

- **Hierarchical tags (directory management)**: Tags now support parent-child relationships, enabling folder-like organization. Tags can be edited and deleted from the admin panel.
  - `prisma/schema.prisma` — added `parentId` and self-referencing `TagHierarchy` relation to the `Tag` model
  - `prisma/seed.ts` — updated seed data with sample hierarchical tags (Math > Algebra, Calculus; Programming > TypeScript)
  - `src/app/api/tags/route.ts` — `POST` now accepts optional `parentId`; `GET` includes parent info and children count
  - `src/app/api/tags/[id]/route.ts` — new `PUT` (rename, change parent) and `DELETE` (with child-safety check) routes
  - `src/app/(admin)/admin/tags/TagManager.tsx` — redesigned with tree view (expand/collapse), inline edit (name + parent selector), and delete (gated by child count)
  - `src/app/(admin)/admin/tags/page.tsx` — updated query to include parent info
  - `src/app/page.tsx` — sidebar tag list now renders with hierarchical indentation

- **Toast notifications for config save**: Replaced inline message bar with floating toast notifications via `sonner`.
  - `package.json` — added `sonner` dependency
  - `src/app/(admin)/admin/layout.tsx` — added `<Toaster>` component
  - `src/app/(admin)/admin/config/SiteConfigForm.tsx` — replaced `message` state bar with `toast.success()` / `toast.error()` calls

- **Footer**: Site footer displaying `footer_text` from site config.
  - `src/components/Footer.tsx` — new async server component reading `footer_text` from database
  - `src/app/layout.tsx` — renders `<Footer />` after `{children}` in the root layout
  - `src/app/page.tsx`, `src/app/tag/[tag]/page.tsx`, `src/components/ArticleContent.tsx` — changed outer wrapper from `min-h-screen` to `flex-1` to accommodate the footer

### Changed

- `src/app/page.tsx` — removed admin link in header (not applicable in static export)
- `src/app/posts/[slug]/page.tsx` — `isLoggedIn` is now always `false` (static export has no auth)
- `doc/USAGE.md` — added sections for static export / Vercel deployment, updated tag management docs for hierarchical tags, updated project structure and scripts table

---

## 2026-05-27

### Added

- **Code syntax highlighting**: Fenced code blocks now render with GitHub-style syntax coloring via `rehype-highlight` + `highlight.js`. Theme: `github-dark.css`.
  - `src/app/globals.css` — imported `highlight.js/styles/github-dark.css`
  - `src/components/MarkdownRenderer.tsx` — added `rehypeHighlight` plugin, updated `pre`/`code` component styles

- **Inline article editing**: Authenticated users can edit articles directly from the public article page without navigating to the admin panel.
  - `src/components/ArticleContent.tsx` — new client component with view/edit mode toggle; renders article view with Edit button (login-gated), switches to inline editor (EasyMDE + tag selector + publish control) on click
  - `src/app/posts/[slug]/page.tsx` — refactored to use `ArticleContent`, passes post data, all tags, and session state

- **Admin link on homepage**: Logged-in users see an "Admin" link in the homepage header.
  - `src/app/page.tsx` — added `auth()` check and conditional "Admin" link

- **Site configuration system**: Site metadata is now stored in the database and editable via the admin panel.
  - `prisma/schema.prisma` — added `SiteConfig` model (key-value with unique key)
  - `prisma/seed.ts` — added 9 default config entries (site_title, site_description, site_subtitle, site_keywords, site_icon, author_name, author_avatar, author_bio, footer_text)
  - `src/lib/siteConfig.ts` — new helper: `getSiteConfig(key)`, `getAllSiteConfig()`
  - `src/app/api/config/route.ts` — new API: `GET` (public), `PUT` (auth, batch upsert)
  - `src/app/(admin)/admin/config/page.tsx` — new admin config page (server component)
  - `src/app/(admin)/admin/config/SiteConfigForm.tsx` — new config form (client component)
  - `src/components/admin/AdminSidebar.tsx` — added "Config" navigation link
  - `src/app/layout.tsx` — replaced static `metadata` with `generateMetadata()` reading from DB configs (including site_icon)

- **Site icon upload**: Admins can upload a custom favicon via the config page.
  - `src/app/api/upload/route.ts` — new API: `POST` (auth, accepts image file, saves to `public/uploads/`)
  - `src/app/(admin)/admin/config/SiteConfigForm.tsx` — added file input with upload and live preview
  - `src/app/layout.tsx` — `generateMetadata()` now reads `site_icon` and sets the `icons` metadata

- **Admin top navigation bar**: Top bar with "Admin Panel" title and "View Site" link to return to the public homepage.
  - `src/app/(admin)/admin/layout.tsx` — added `<header>` with return link above the sidebar + main layout

- **Dashboard charts**: Visual analytics on the admin dashboard using recharts.
  - `src/app/(admin)/admin/DashboardCharts.tsx` — new client component with pie chart (posts by tag), line chart (posts per month), and bar chart (posts per year)
  - `src/app/(admin)/admin/page.tsx` — fetches chart data from DB and passes to `DashboardCharts`

- **Author sidebar on homepage**: Right sidebar displays author avatar, name, and bio above the tag list.
  - `src/app/page.tsx` — fetches `author_name`, `author_avatar`, `author_bio` from config and renders a sidebar card

### Changed

- **Code highlighting theme**: Switched from `github.css` (light) to `github-dark.css` for better visibility.
  - `src/app/globals.css` — changed import from `github.css` to `github-dark.css`

- `src/app/posts/[slug]/page.tsx` — refactored from inline JSX to `ArticleContent` component delegation
- `src/app/page.tsx` — header layout changed from centered to flex (title left, admin link right); sidebar expanded with author card
- `prisma/seed.ts` — added `site_icon` to default config entries
- `doc/REQUIREMENTS.md` — updated with new features, data model, routes, and directory structure
- `doc/USAGE.md` — added sections for code highlighting, inline editing, and site configuration; updated TOC and project structure
