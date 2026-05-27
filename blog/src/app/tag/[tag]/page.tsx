import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";


export async function generateStaticParams() {
  const tags = await prisma.tag.findMany({ select: { slug: true } });
  return tags.map((t) => ({ tag: t.slug }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: tagSlug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug: tagSlug },
  });

  if (!tag) {
    notFound();
  }

  const where = {
    published: true,
    tags: { some: { tagId: tag.id } },
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  return (
    <div className="flex-1 bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline mb-4 inline-block"
          >
            &larr; Back to posts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Tag: {tag.name}
          </h1>
          <p className="text-gray-500 mt-1">{total} posts</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No posts found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
