# Blog 使用文档

## 目录

1. [环境要求](#环境要求)
2. [快速开始](#快速开始)
3. [项目结构](#项目结构)
4. [写作指南](#写作指南)
5. [代码高亮](#代码高亮)
6. [文章内联编辑](#文章内联编辑)
7. [后台管理](#后台管理)
8. [站点配置](#站点配置)
9. [静态导出与 Vercel 部署](#静态导出与-vercel-部署)
10. [Docker 部署](#docker-部署)
11. [环境变量](#环境变量)
12. [常见问题](#常见问题)

---

## 环境要求

- Node.js 18+（推荐 22）
- npm 9+

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库并写入示例数据
npm run db:setup

# 3. 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看博客首页。

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（支持热更新） |
| `npm run build` | 生产构建（静态导出） |
| `npm start` | 运行生产版本 |
| `npm run build:export` | 构建静态文件用于 Vercel 部署 |
| `npm run db:push` | 同步数据库 schema |
| `npm run db:seed` | 写入种子数据（示例文章和标签） |
| `npm run db:setup` | db:push + db:seed 一键初始化 |
| `npm run lint` | 运行 ESLint |

---

## 项目结构

```
blog/
├── prisma/
│   ├── schema.prisma          # 数据模型定义
│   └── seed.ts                # 种子数据脚本
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式（含 KaTeX）
│   │   ├── page.tsx           # 首页（文章列表）
│   │   ├── posts/[slug]/      # 文章详情页
│   │   ├── tag/[tag]/         # 标签筛选页
│   │   ├── admin/login/       # 后台登录页
│   │   ├── (admin)/admin/     # 后台管理（需要登录）
│   │   └── api/               # API 路由
│   ├── components/
│   │   ├── MarkdownRenderer.tsx  # Markdown + LaTeX + 代码高亮渲染
│   │   ├── ArticleContent.tsx    # 文章查看/编辑模式切换
│   │   ├── PostCard.tsx          # 文章卡片
│   │   ├── TagBadge.tsx          # 标签徽章
│   │   ├── Footer.tsx            # 页脚组件
│   │   └── admin/
│   │       ├── AdminSidebar.tsx   # 后台侧边栏
│   │       ├── PostEditor.tsx     # Markdown 编辑器
│   │       └── PostForm.tsx       # 文章编辑表单
│   └── lib/
│       ├── prisma.ts           # Prisma 客户端
│       ├── auth.ts             # NextAuth 认证配置
│       ├── siteConfig.ts       # 站点配置数据库查询
│       └── slug.ts             # URL 友好 slug 生成
├── Dockerfile
├── docker-compose.yml
├── docker-entrypoint.sh
├── next.config.ts
├── doc/
│   ├── REQUIREMENTS.md         # 需求文档
│   └── USAGE.md                # 本文档
└── data.db                     # SQLite 数据库文件
```

---

## 写作指南

### 创建新文章

1. 访问 `http://localhost:3000/admin` 并登录
2. 点击「New Post」
3. 填写标题、摘要、正文，选择标签，勾选「Published」发布
4. 点击「Create Post」保存

### Markdown 语法

文章使用 Markdown 格式编写，支持所有标准 Markdown 语法：

```markdown
# 一级标题
## 二级标题

**粗体** *斜体* ~~删除线~~

- 无序列表
- 无序列表

1. 有序列表
2. 有序列表

[链接](https://example.com)
![图片](https://example.com/image.png)

> 引用文字

| 表头1 | 表头2 |
|-------|-------|
| 单元格 | 单元格 |
```

### LaTeX 数学公式

使用 `$...$` 书写行内公式，使用 `$$...$$` 书写块级公式：

```markdown
行内公式：$E = mc^2$

块级公式：
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

欧拉恒等式：$e^{i\pi} + 1 = 0$

求和公式：
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

矩阵：
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$
```

### 嵌入图片

将图片放入 `public/images/` 目录，然后在文章中引用：

```markdown
![描述文字](/images/your-image.png)
```

---

---

## 代码高亮

文章中的代码块会自动进行语法高亮，使用 GitHub 风格配色。

在 ` ``` ` 后指定编程语言即可启用对应语言的高亮：

```markdown
​```typescript
function hello(name: string): string {
  return `Hello, ${name}!`;
}
​```

​```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
​```
```

行内代码使用反引号包裹，会以红色高亮显示：`` `const x = 1` ``

---

## 文章内联编辑

登录后，在文章详情页（`/posts/[slug]`）的顶部会显示「Edit」按钮。点击后页面原地切换为编辑模式，可修改：

- 文章标题
- 摘要
- 正文（Markdown 编辑器）
- 标签
- 发布状态

编辑完成后点击「Save」保存并返回阅读模式，或点击「Cancel」放弃修改。

> 注意：此功能需要登录后才可见。未登录用户不会看到编辑按钮。

---

## 后台管理

### 登录

- 访问 `http://localhost:3000/admin/login`
- 默认账号：`admin@blog.com`，密码：`admin123`

> 注意：管理后台仅在开发模式 (`npm run dev`) 下可用。静态导出后管理后台不可访问。

### Dashboard

登录后进入 Dashboard，显示文章总数、已发布数量和标签数量，以及 Posts by Tag 饼图和 Posts per Month 折线图。点击快捷按钮进入对应管理页面。

### 文章管理

- **列表页** `/admin/posts`：查看所有文章，按创建时间倒序排列
  - 点击文章标题查看公开页面
  - 点击「Edit」编辑文章
  - 点击「Delete」删除文章（有确认弹窗）
- **新建文章** `/admin/posts/new`：使用 Markdown 编辑器撰写
- **编辑文章** `/admin/posts/[id]/edit`：修改已有文章

### 标签管理（层级目录）

- **标签页** `/admin/tags`：支持创建、编辑、删除标签
- **层级结构**：标签支持父子层级关系，可以像文件夹一样将标签分组到目录中
  - 创建标签时可选择父标签
  - 已有标签可通过「Edit」按钮修改名称和所属父标签
  - 点击 ▸/▾ 图标展开/折叠子标签
  - 有子标签的标签不可删除（需先删除子标签）
- 创建文章时可以为文章选择多个标签
- 首页标签侧边栏按层级缩进显示
- 标签名称自动生成 slug 用于 URL

### 发布状态

每篇文章有「Published」开关：
- **勾选**：文章公开可见
- **不勾选**：文章保存为草稿，仅管理员可见

---

## 站点配置

后台「Config」页面（`/admin/config`）支持自定义以下站点信息：

| 配置项 | 字段名 | 说明 |
|--------|--------|------|
| 站点标题 | `site_title` | 浏览器标签页标题和首页标题 |
| 站点副标题 | `site_subtitle` | 首页标题下方的描述文字 |
| 站点描述 | `site_description` | SEO 元描述（搜索引擎展示） |
| SEO 关键词 | `site_keywords` | 页面 keywords meta 标签 |
| 作者名称 | `author_name` | 文章作者显示名 |
| 作者头像 | `author_avatar` | 头像图片 URL |
| 作者简介 | `author_bio` | 作者个人简介 |
| 页脚文字 | `footer_text` | 网站底部版权等信息 |

修改后点击「Save」保存，成功或失败会以右上角悬浮提示（Toast）的方式反馈。首页和浏览器标签页会立即反映更改。页脚文字（`footer_text`）会显示在所有公开页面的底部。

---

## 静态导出与 Vercel 部署

### 概念

项目支持将博客导出为纯静态文件（HTML/CSS/JS），一键部署到 Vercel 等静态托管平台。

- **开发模式** (`npm run dev`)：管理后台正常运行，支持编辑文章、管理标签、修改配置
- **静态导出** (`npm run build:export`)：从本地 SQLite 数据库读取内容，生成静态 HTML 文件到 `out/` 目录
- **生产部署**：静态文件部署后，管理后台不可用。内容的更新流程为：本地 `npm run dev` 编辑 → `npm run build:export` 重新构建 → 重新部署

### 构建静态文件

```bash
# 确保数据库和 Prisma 客户端已初始化
npm run db:setup

# 构建静态导出
npm run build:export
```

构建产物在 `out/` 目录中，可以直接部署到任何静态托管服务。

### 部署到 Vercel

将项目推送到 GitHub 仓库，然后在 Vercel 中导入项目：

1. 将整个项目（包括 `data.db` 数据库文件）提交到 Git
2. 在 Vercel 导入项目时，设置构建命令为：`npm run build:export`
3. 设置输出目录为：`out`
4. Vercel 会自动构建并部署静态文件

或者直接上传 `out/` 目录到 Vercel：

```bash
npm run build:export
npx vercel out --prod
```

### 注意事项

- 数据库文件 `data.db` 会被提交到 Git（确保不包含敏感信息）
- 每次内容更新后需要重新构建和部署
- 管理后台仅在 `npm run dev` 开发模式下可用
- 静态导出后所有页面均为预渲染 HTML，无需服务器运行时

---

## Docker 部署

### 构建并启动

```bash
docker-compose up -d
```

### 首次启动后的数据库初始化

```bash
# 同步数据库结构
docker-compose exec blog npx prisma db push

# 种子数据（可选）
docker-compose exec blog npx tsx prisma/seed.ts
```

### 数据持久化

SQLite 数据库文件存储在 Docker 卷 `blog-data` 中，映射到容器内的 `/app/data/blog.db`。

```bash
# 查看数据卷
docker volume ls | grep blog

# 备份数据库
docker cp $(docker-compose ps -q blog):/app/data/blog.db ./backup.db
```

### 常用管理命令

```bash
# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 停止并删除数据卷（注意：会丢失所有数据）
docker-compose down -v
```

---

## 环境变量

在项目根目录的 `.env` 文件中配置：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | SQLite 数据库文件路径 | `file:./data.db` |
| `AUTH_SECRET` | NextAuth 加密密钥（生产环境必须修改） | - |
| `ADMIN_EMAIL` | 管理员邮箱（种子数据） | `admin@blog.com` |
| `ADMIN_PASSWORD` | 管理员密码（种子数据） | `admin123` |

### 生成 AUTH_SECRET

```bash
openssl rand -base64 32
```

将生成的字符串填入 `.env` 或 `docker-compose.yml` 的 `AUTH_SECRET` 环境变量。

---

## 常见问题

### Q: 修改数据库结构后怎么办？

```bash
# 修改 prisma/schema.prisma 后
npm run db:push      # 同步到数据库
npx prisma generate  # 重新生成客户端
```

### Q: 如何重置数据库？

```bash
rm data.db           # 删除数据库文件
npm run db:setup     # 重新初始化
```

### Q: 如何修改管理员密码？

1. 先正常登录后台
2. 或者直接在数据库中修改（需要 bcrypt 加密）：

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('newpassword', 12).then(console.log)"
```

3. 使用 SQLite 客户端更新 `User` 表的 `password` 字段

### Q: 如何添加新的社交登录（GitHub/Google）？

在 `src/lib/auth.ts` 中添加对应的 Provider，并在 `.env` 中配置 OAuth 密钥。详见 [NextAuth.js 文档](https://authjs.dev/getting-started/providers)。

### Q: Docker 部署后无法上传大图片？

Markdown 编辑器不支持直接上传图片。如需图片支持，建议将图片放入 `public/images/` 目录后重新构建 Docker 镜像，或使用外部图床服务。

### Q: 如何更换端口？

开发环境：`npm run dev -- -p 8080`

Docker 环境：修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:3000"
```
