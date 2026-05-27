import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getSiteConfig } from "@/lib/siteConfig";
import { PostCard } from "@/components/PostCard";
import { TagBadge } from "@/components/TagBadge";
import { Pagination } from "@/components/Pagination";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const tagFilter = params.tag;
  const pageSize = 10;

  const where = {
    published: true,
    ...(tagFilter
      ? { tags: { some: { tag: { slug: tagFilter } } } }
      : {}),
  };

  const [
    posts, total, allTags, session, siteTitle, siteSubtitle,
    authorName, authorAvatar, authorBio,
  ] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    }),
    auth(),
    getSiteConfig("site_title"),
    getSiteConfig("site_subtitle"),
    getSiteConfig("author_name"),
    getSiteConfig("author_avatar"),
    getSiteConfig("author_bio"),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <Link href="/">{siteTitle || "Blog with LaTeX"}</Link>
            </h1>
            <p className="text-gray-500 mt-1">
              {siteSubtitle || "Thoughts on math, programming, and more."}
            </p>
          </div>
          {session && (
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <main className="flex-1 space-y-4">
            {tagFilter && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>Filtered by:</span>
                <TagBadge name={tagFilter} slug={tagFilter} />
                <Link
                  href="/"
                  className="text-blue-600 hover:underline ml-2"
                >
                  Clear filter
                </Link>
              </div>
            )}

            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No posts found.</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              searchParams={tagFilter ? { tag: tagFilter } : {}}
            />
          </main>

          <aside className="w-56 hidden lg:block space-y-6">
            {(authorName || authorAvatar || authorBio) && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                {authorAvatar && (
                  <img
                    src={authorAvatar}
                    alt={authorName || "Author"}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                )}
                {authorName && (
                  <p className="font-semibold text-gray-900">{authorName}</p>
                )}
                {authorBio && (
                  <p className="text-sm text-gray-500 mt-2">{authorBio}</p>
                )}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <TagBadge key={tag.id} name={tag.name} slug={tag.slug} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
