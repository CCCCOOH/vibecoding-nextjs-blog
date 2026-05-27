import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ArticleContent } from "@/components/ArticleContent";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, allTags, session] = await Promise.all([
    prisma.post.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    auth(),
  ]);

  if (!post || (!post.published && process.env.NODE_ENV === "production")) {
    notFound();
  }

  return (
    <ArticleContent
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        published: post.published,
        createdAt: post.createdAt.toISOString(),
        tags: post.tags.map((pt) => ({
          tagId: pt.tagId,
          tag: { id: pt.tag.id, name: pt.tag.name, slug: pt.tag.slug },
        })),
      }}
      allTags={allTags.map((t) => ({ id: t.id, name: t.name, slug: t.slug }))}
      isLoggedIn={!!session}
    />
  );
}
