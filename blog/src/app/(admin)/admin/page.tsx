import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "./DashboardCharts";

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

  const yearlyData: Record<string, number> = {};
  posts.forEach((p) => {
    const key = String(p.createdAt.getFullYear());
    yearlyData[key] = (yearlyData[key] || 0) + 1;
  });
  const yearlyPosts = Object.entries(yearlyData)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-3xl font-bold text-gray-900">{postCount}</p>
          <p className="text-sm text-gray-500 mt-1">Total Posts</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Published</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-3xl font-bold text-blue-600">{tagCount}</p>
          <p className="text-sm text-gray-500 mt-1">Tags</p>
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
          className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors text-sm"
        >
          Manage Posts
        </Link>
        <Link
          href="/admin/tags"
          className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors text-sm"
        >
          Manage Tags
        </Link>
      </div>

      <DashboardCharts
        tagData={tagData}
        monthlyPosts={monthlyPosts}
        yearlyPosts={yearlyPosts}
      />
    </div>
  );
}
