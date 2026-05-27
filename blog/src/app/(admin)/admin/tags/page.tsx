import { prisma } from "@/lib/prisma";
import { TagManager } from "./TagManager";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tags</h1>
      <TagManager tags={tags} />
    </div>
  );
}
