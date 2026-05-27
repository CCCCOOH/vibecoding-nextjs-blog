"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Post, Tag, PostTag } from "@/generated/prisma/client";

type PostWithTags = Post & {
  tags: (PostTag & { tag: Tag })[];
};

export function AdminPostList({ posts }: { posts: PostWithTags[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeleting(id);
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete post");
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Title
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Tags
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Date
            </th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    post.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {post.tags.map((pt) => (
                    <span
                      key={pt.tagId}
                      className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded"
                    >
                      {pt.tag.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    {deleting === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
