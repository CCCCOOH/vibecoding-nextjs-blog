import { prisma } from "@/lib/prisma";
import { TagManager } from "./TagManager";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { posts: true } },
      parent: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Tags</h1>
      <TagManager tags={tags} />
    </div>
  );
}
