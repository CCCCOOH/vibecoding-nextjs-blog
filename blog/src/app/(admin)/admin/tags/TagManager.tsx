"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagBadge } from "@/components/TagBadge";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

export function TagManager({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    setError("");

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create tag");
      setLoading(false);
      return;
    }

    setNewName("");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="flex gap-3 max-w-md">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New tag name"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !newName.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {tags.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No tags yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Posts
                </th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr
                  key={tag.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <TagBadge name={tag.name} slug={tag.slug} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{tag.slug}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {tag._count.posts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
