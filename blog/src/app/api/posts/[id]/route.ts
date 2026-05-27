import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";


export function generateStaticParams() {
  return [{ id: "_" }];
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (process.env.NEXT_EXPORT === "true") {
    return NextResponse.json({});
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const { title, content, excerpt, published, tagIds } = body;

  const data: Record<string, unknown> = {};
  if (title !== undefined) {
    data.title = title;
    data.slug = generateSlug(title);
  }
  if (content !== undefined) data.content = content;
  if (excerpt !== undefined) data.excerpt = excerpt;
  if (published !== undefined) data.published = published;

  if (tagIds !== undefined) {
    await prisma.postTag.deleteMany({ where: { postId: id } });
    if (tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId: string) => ({ postId: id, tagId })),
      });
    }
  }

  const post = await prisma.post.update({
    where: { id },
    data,
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (process.env.NEXT_EXPORT === "true") {
    return NextResponse.json({ success: true });
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
