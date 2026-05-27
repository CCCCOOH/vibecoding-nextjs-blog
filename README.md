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
9. [Docker 部署](#docker-部署)
10. [环境变量](#环境变量)
11. [常见问题](#常见问题)

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
| `npm run build` | 生产构建 |
| `npm start` | 运行生产版本 |
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
│   │   ├── Pagination.tsx        # 分页组件
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

### Dashboard

登录后进入 Dashboard，显示文章总数、已发布数量和标签数量。点击快捷按钮进入对应管理页面。

### 文章管理

- **列表页** `/admin/posts`：查看所有文章，按创建时间倒序排列
  - 点击文章标题查看公开页面
  - 点击「Edit」编辑文章
  - 点击「Delete」删除文章（有确认弹窗）
- **新建文章** `/admin/posts/new`：使用 Markdown 编辑器撰写
- **编辑文章** `/admin/posts/[id]/edit`：修改已有文章

### 标签管理

- **标签页** `/admin/tags`：创建新标签，查看已有标签及关联文章数
- 创建文章时可以为文章选择多个标签
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

修改后点击「Save」保存，首页和浏览器标签页会立即反映更改。

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
