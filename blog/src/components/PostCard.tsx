import Link from "next/link";
import { TagBadge } from "./TagBadge";
import type { Post, Tag, PostTag } from "@/generated/prisma/client";

type PostWithTags = Post & {
  tags: (PostTag & { tag: Tag })[];
};

export function PostCard({ post }: { post: PostWithTags }) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-2">
        <Link
          href={`/posts/${post.slug}`}
          className="text-gray-900 hover:text-blue-600 transition-colors"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {post.tags.map((pt) => (
          <TagBadge key={pt.tagId} name={pt.tag.name} slug={pt.tag.slug} />
        ))}
        <time className="text-xs text-gray-400 ml-auto">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
