import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/siteConfig";
import { PostCard } from "@/components/PostCard";
import { TagBadge } from "@/components/TagBadge";

export const dynamic = "force-dynamic";

function buildTagDisplayList(tags: { id: string; name: string; slug: string; parentId: string | null }[]) {
  const result: { id: string; name: string; slug: string; depth: number }[] = [];
  const sorted = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  function addChildren(parentId: string | null, depth: number) {
    for (const tag of sorted) {
      if (tag.parentId === parentId) {
        result.push({ id: tag.id, name: tag.name, slug: tag.slug, depth });
        addChildren(tag.id, depth + 1);
      }
    }
  }

  addChildren(null, 0);
  return result;
}

export default async function HomePage() {
  const where = { published: true };

  const [posts, allTags, siteTitle, siteSubtitle, authorName, authorAvatar, authorBio] =
    await Promise.all([
      prisma.post.findMany({
        where,
        include: { tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tag.findMany({
        select: { id: true, name: true, slug: true, parentId: true },
      }),
      getSiteConfig("site_title"),
      getSiteConfig("site_subtitle"),
      getSiteConfig("author_name"),
      getSiteConfig("author_avatar"),
      getSiteConfig("author_bio"),
    ]);

  const tagDisplayList = buildTagDisplayList(allTags);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              <Link href="/">{siteTitle || "Blog with LaTeX"}</Link>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {siteSubtitle || "Thoughts on math, programming, and more."}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <main className="flex-1 space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-12">No posts found.</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </main>

          <aside className="w-56 hidden lg:block space-y-6">
            {(authorName || authorAvatar || authorBio) && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                {authorAvatar && (
                  <img
                    src={authorAvatar}
                    alt={authorName || "Author"}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                )}
                {authorName && (
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{authorName}</p>
                )}
                {authorBio && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{authorBio}</p>
                )}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {tagDisplayList.map((tag) => (
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
