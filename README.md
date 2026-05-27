# Blog with LaTeX

基于 Next.js 16 (App Router) 的个人博客，支持 Markdown 编辑、LaTeX 数学公式渲染、代码语法高亮、SQLite 数据库。支持明暗主题切换和一键 Vercel 部署。

所有源代码在 `blog/` 目录下。

## 功能特性

- **Markdown + LaTeX**: 支持行内公式 `$...$` 和块级公式 `$$...$$`（KaTeX 渲染）
- **代码高亮**: GitHub 风格代码块语法高亮（highlight.js）
- **明暗主题**: 三模式主题切换（亮色/暗色/跟随系统），localStorage 持久化
- **标签层级**: 标签支持父子目录结构
- **管理后台**: 文章和标签的完整增删改查，站点配置，数据统计图表
- **编辑跳转**: 登录后在公开文章页显示 Edit 按钮，点击跳转到后台编辑页面
- **一键部署**: 管理后台「Deploy to Vercel」按钮自动 git push 触发部署
- **静态导出**: 支持生成纯静态 HTML 文件用于 Vercel/静态托管
- **Docker 支持**: 多阶段 Docker 构建，独立部署

## 快速开始

```bash
cd blog
npm install
npm run db:setup    # 初始化数据库 + 种子数据
npm run dev         # 启动开发服务器 http://localhost:3000
```

默认管理员账号: `admin@blog.com` / `admin123`

## 文档

完整文档请查看 [blog/doc/USAGE.md](blog/doc/USAGE.md)，涵盖：
- 写作指南（Markdown、LaTeX、图片）
- 管理后台使用（文章、标签、站点配置）
- 明暗主题切换
- 一键 Vercel 部署
- 静态导出与 Vercel 部署
- Docker 部署
- 环境变量配置

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run build:export` | 构建静态文件用于 Vercel 部署 |
| `npm run db:setup` | 数据库初始化 + 种子数据 |
| `npm run lint` | 运行 ESLint |

## 技术栈

- **框架**: Next.js 16 (App Router)
- **数据库**: SQLite + Prisma 7 + libsql 适配器
- **认证**: NextAuth v5 (Credentials 提供者, JWT 会话)
- **样式**: Tailwind CSS v4 + @tailwindcss/typography
- **主题**: next-themes (class-based 暗色模式)
- **编辑器**: EasyMDE (react-simplemde-editor)
- **渲染**: react-markdown + remark-math + rehype-katex + rehype-highlight
- **图表**: Recharts
- **Toast 通知**: Sonner
