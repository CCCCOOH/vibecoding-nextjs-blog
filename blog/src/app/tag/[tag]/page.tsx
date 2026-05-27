import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ tag: tagSlug }, sp] = await Promise.all([params, searchParams]);
  const page = parseInt(sp.page || "1");
  const pageSize = 10;

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
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
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

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath={`/tag/${tagSlug}`}
        />
      </main>
    </div>
  );
}
