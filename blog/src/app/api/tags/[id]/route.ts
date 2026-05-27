import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";


export function generateStaticParams() {
  return [{ id: "_" }];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (process.env.NEXT_EXPORT === "true") {
    return NextResponse.json({});
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, parentId } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = generateSlug(name);
  }
  if (parentId !== undefined) {
    if (parentId === id) {
      return NextResponse.json(
        { error: "Cannot set parent to self" },
        { status: 400 }
      );
    }
    if (parentId !== null) {
      const parent = await prisma.tag.findUnique({ where: { id: parentId } });
      if (!parent) {
        return NextResponse.json(
          { error: "Parent not found" },
          { status: 400 }
        );
      }
    }
    data.parentId = parentId;
  }

  const tag = await prisma.tag.update({
    where: { id },
    data,
    include: {
      parent: { select: { id: true, name: true } },
      children: { select: { id: true } },
      _count: { select: { posts: true } },
    },
  });

  return NextResponse.json(tag);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (process.env.NEXT_EXPORT === "true") {
    return NextResponse.json({ success: true });
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const children = await prisma.tag.count({ where: { parentId: id } });
  if (children > 0) {
    return NextResponse.json(
      { error: "Cannot delete tag with child tags. Remove children first." },
      { status: 400 }
    );
  }

  await prisma.tag.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
