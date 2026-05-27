import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";

export async function GET() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { posts: true, children: true } },
      parent: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_EXPORT === "true") return NextResponse.json({});

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, parentId } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (parentId) {
    const parent = await prisma.tag.findUnique({ where: { id: parentId } });
    if (!parent) {
      return NextResponse.json({ error: "Parent tag not found" }, { status: 400 });
    }
  }

  const slug = generateSlug(name);
  const tag = await prisma.tag.create({
    data: { name, slug, parentId: parentId || null },
    include: {
      parent: { select: { id: true, name: true } },
      children: { select: { id: true } },
      _count: { select: { posts: true } },
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
