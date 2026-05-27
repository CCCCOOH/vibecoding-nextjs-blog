# 更新日志

## 2026-05-27

### 新增

- **代码语法高亮**：代码块通过 `rehype-highlight` + `highlight.js` 实现 GitHub 风格语法着色。主题：`github-dark.css`。
  - `src/app/globals.css` — 导入 `highlight.js/styles/github-dark.css`
  - `src/components/MarkdownRenderer.tsx` — 添加 `rehypeHighlight` 插件，更新 `pre`/`code` 组件样式

- **行内文章编辑**：已登录用户可以直接在公开文章页面编辑文章，无需跳转到管理后台。
  - `src/components/ArticleContent.tsx` — 新增客户端组件，支持查看/编辑模式切换；显示文章视图和编辑按钮（需登录），点击后切换到行内编辑器（EasyMDE + 标签选择器 + 发布控制）
  - `src/app/posts/[slug]/page.tsx` — 重构为使用 `ArticleContent`，传递文章数据、所有标签和会话状态

- **主页管理链接**：已登录用户可在主页头部看到「Admin」链接。
  - `src/app/page.tsx` — 添加 `auth()` 检查和条件渲染的「Admin」链接

- **站点配置系统**：站点元数据存储在数据库中，可通过管理后台编辑。
  - `prisma/schema.prisma` — 添加 `SiteConfig` 模型（键值对，唯一键）
  - `prisma/seed.ts` — 添加 9 个默认配置项（site_title、site_description、site_subtitle、site_keywords、site_icon、author_name、author_avatar、author_bio、footer_text）
  - `src/lib/siteConfig.ts` — 新增辅助函数：`getSiteConfig(key)`、`getAllSiteConfig()`
  - `src/app/api/config/route.ts` — 新增 API：`GET`（公开）、`PUT`（需认证，批量 upsert）
  - `src/app/(admin)/admin/config/page.tsx` — 新增管理配置页面（服务端组件）
  - `src/app/(admin)/admin/config/SiteConfigForm.tsx` — 新增配置表单（客户端组件）
  - `src/components/admin/AdminSidebar.tsx` — 添加「Config」导航链接
  - `src/app/layout.tsx` — 将静态 `metadata` 替换为从数据库读取配置的 `generateMetadata()`（含 site_icon）

- **站点图标上传**：管理员可通过配置页面上传自定义 favicon。
  - `src/app/api/upload/route.ts` — 新增 API：`POST`（需认证，接受图片文件，保存到 `public/uploads/`）
  - `src/app/(admin)/admin/config/SiteConfigForm.tsx` — 添加文件上传输入框、上传功能和实时预览
  - `src/app/layout.tsx` — `generateMetadata()` 读取 `site_icon` 并设置 `icons` 元数据

- **管理后台顶部导航栏**：顶部栏显示「Admin Panel」标题和「← View Site」返回站点主页链接。
  - `src/app/(admin)/admin/layout.tsx` — 在侧边栏 + 主内容区上方添加 `<header>`，包含返回链接

- **Dashboard 图表**：使用 recharts 在管理仪表盘展示可视化数据分析。
  - `src/app/(admin)/admin/DashboardCharts.tsx` — 新增客户端组件，包含饼图（文章按标签分布）、折线图（每月文章数）、柱状图（每年文章数）
  - `src/app/(admin)/admin/page.tsx` — 从数据库获取图表数据并传递给 `DashboardCharts`

- **主页作者信息侧边栏**：右侧边栏在标签列表上方显示作者头像、昵称和简介。
  - `src/app/page.tsx` — 从配置中获取 `author_name`、`author_avatar`、`author_bio` 并渲染侧边栏卡片

### 变更

- **代码高亮主题**：从 `github.css`（亮色）切换为 `github-dark.css`（暗色），提升代码可见性。
  - `src/app/globals.css` — 将导入从 `github.css` 改为 `github-dark.css`

- `src/app/posts/[slug]/page.tsx` — 从内联 JSX 重构为 `ArticleContent` 组件委托
- `src/app/page.tsx` — 头部布局从居中改为 flex（标题居左，管理链接居右）；侧边栏扩展为包含作者卡片
- `prisma/seed.ts` — 在默认配置项中添加 `site_icon`
- `doc/REQUIREMENTS.md` — 更新新功能、数据模型、路由和目录结构
- `doc/USAGE.md` — 添加代码高亮、行内编辑和站点配置相关章节；更新目录和项目结构
