# Changelog

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
