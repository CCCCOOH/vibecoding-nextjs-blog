import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "data.db");

const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const email = process.env.ADMIN_EMAIL || "admin@blog.com";
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Admin",
      email,
      password: hashedPassword,
    },
  });
  console.log(`Admin user: ${admin.email}`);

  const math = await prisma.tag.upsert({
    where: { slug: "math" },
    update: {},
    create: { name: "Math", slug: "math" },
  });
  const algebra = await prisma.tag.upsert({
    where: { slug: "algebra" },
    update: {},
    create: { name: "Algebra", slug: "algebra", parentId: math.id },
  });
  const calculus = await prisma.tag.upsert({
    where: { slug: "calculus" },
    update: {},
    create: { name: "Calculus", slug: "calculus", parentId: math.id },
  });
  const programming = await prisma.tag.upsert({
    where: { slug: "programming" },
    update: {},
    create: { name: "Programming", slug: "programming" },
  });
  const typescript = await prisma.tag.upsert({
    where: { slug: "typescript" },
    update: {},
    create: { name: "TypeScript", slug: "typescript", parentId: programming.id },
  });
  const physics = await prisma.tag.upsert({
    where: { slug: "physics" },
    update: {},
    create: { name: "Physics", slug: "physics" },
  });

  const tags = [math, algebra, calculus, programming, typescript, physics];

  const samplePost = await prisma.post.upsert({
    where: { slug: "hello-latex" },
    update: {},
    create: {
      title: "Hello LaTeX",
      slug: "hello-latex",
      excerpt: "A demo post showing LaTeX rendering with KaTeX.",
      content: `# Welcome to the Blog with LaTeX

This post demonstrates **LaTeX** rendering support.

## Inline Math

Einstein's famous equation: $E = mc^2$

## Block Math

The Gaussian integral:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

## More Examples

Euler's identity: $e^{i\\pi} + 1 = 0$

The quadratic formula:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

A matrix:

$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$

Enjoy writing math!`,
      published: true,
      tags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[1].id }],
      },
    },
  });
  console.log(`Sample post: ${samplePost.title}`);

  const secondPost = await prisma.post.upsert({
    where: { slug: "getting-started" },
    update: {},
    create: {
      title: "Getting Started with Next.js",
      slug: "getting-started",
      excerpt: "A quick guide to building with Next.js App Router.",
      content: `# Getting Started with Next.js

Next.js is a React framework for building web applications.

## Features

- **Server Components** — Render on the server
- **App Router** — File-system based routing
- **API Routes** — Build your API alongside your UI

## Code Example

\`\`\`typescript
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
\`\`\`

Start building today!`,
      published: true,
      tags: {
        create: [{ tagId: tags[1].id }],
      },
    },
  });
  console.log(`Sample post: ${secondPost.title}`);

  // Site configuration defaults
  const configs = [
    { key: "site_title", value: "Blog with LaTeX" },
    { key: "site_description", value: "A blog built with Next.js, supporting LaTeX math formulas." },
    { key: "site_subtitle", value: "Thoughts on math, programming, and more." },
    { key: "site_keywords", value: "blog, math, programming, latex" },
    { key: "site_icon", value: "" },
    { key: "author_name", value: "Admin" },
    { key: "author_avatar", value: "" },
    { key: "author_bio", value: "A curious mind exploring math, code, and the universe." },
    { key: "footer_text", value: "Powered by Next.js & LaTeX" },
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log(`Seeded ${configs.length} site config entries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
