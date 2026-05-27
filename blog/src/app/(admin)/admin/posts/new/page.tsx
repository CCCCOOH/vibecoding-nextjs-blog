import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const allTags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">New Post</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <PostForm allTags={allTags} />
      </div>
    </div>
  );
}
