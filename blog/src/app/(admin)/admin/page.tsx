import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "./DashboardCharts";
import { DeployButton } from "@/components/admin/DeployButton";

export default async function AdminDashboard() {
  const [postCount, publishedCount, tagCount] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.tag.count(),
  ]);

  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
  });

  const posts = await prisma.post.findMany({
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const tagData = tags.map((t) => ({ name: t.name, count: t._count.posts }));

  const monthlyData: Record<string, number> = {};
  posts.forEach((p) => {
    const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, "0")}`;
    monthlyData[key] = (monthlyData[key] || 0) + 1;
  });
  const monthlyPosts = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{postCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Posts</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{publishedCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Published</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tagCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tags</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
        >
          New Post
        </Link>
        <Link
          href="/admin/posts"
          className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
        >
          Manage Posts
        </Link>
        <Link
          href="/admin/tags"
          className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
        >
          Manage Tags
        </Link>
        <DeployButton />
      </div>

      <DashboardCharts
        tagData={tagData}
        monthlyPosts={monthlyPosts}
      />
    </div>
  );
}
