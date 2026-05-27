import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPostList } from "./AdminPostList";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
          <Link
            href="/admin/posts/new"
            className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <AdminPostList posts={posts} />
      )}
    </div>
  );
}
