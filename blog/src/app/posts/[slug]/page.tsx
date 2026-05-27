import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ArticleContent } from "@/components/ArticleContent";


export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, session] = await Promise.all([
    prisma.post.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    }),
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
      isLoggedIn={!!session}
    />
  );
}
