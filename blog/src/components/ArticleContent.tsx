import Link from "next/link";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { TagBadge } from "./TagBadge";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface PostData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  tags: { tagId: string; tag: Tag }[];
}

export function ArticleContent({
  post,
  isLoggedIn,
}: {
  post: PostData;
  isLoggedIn: boolean;
}) {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <a
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-block"
            >
              &larr; Back to posts
            </a>
            {isLoggedIn && (
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline border border-blue-300 dark:border-blue-700 rounded px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                Edit
              </Link>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex gap-1.5">
              {post.tags.map((pt) => (
                <TagBadge key={pt.tag.id} name={pt.tag.name} slug={pt.tag.slug} />
              ))}
            </div>
            <time className="text-sm text-gray-400 dark:text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          {post.excerpt && (
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">{post.excerpt}</p>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <MarkdownRenderer content={post.content} />
        </div>
      </main>
    </div>
  );
}
