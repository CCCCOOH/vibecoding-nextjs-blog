"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TagData {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  children?: { id: string }[];
  _count: { posts: number; children?: number };
}

function buildTree(allTags: TagData[]): TagData[] {
  const roots: TagData[] = [];
  const childrenMap = new Map<string, TagData[]>();
  for (const tag of allTags) {
    const pid = tag.parentId || "__root__";
    if (!childrenMap.has(pid)) childrenMap.set(pid, []);
    childrenMap.get(pid)!.push(tag);
  }
  for (const tag of allTags) {
    if (!tag.parentId) roots.push(tag);
  }
  return roots;
}

function getChildren(parentId: string, allTags: TagData[]): TagData[] {
  return allTags.filter((t) => t.parentId === parentId);
}

export function TagManager({ tags }: { tags: TagData[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newParentId, setNewParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editParentId, setEditParentId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const roots = buildTree(tags);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startEdit(tag: TagData) {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditParentId(tag.parentId);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditParentId(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    setError("");

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), parentId: newParentId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create tag");
      setLoading(false);
      return;
    }

    setNewName("");
    setNewParentId(null);
    setLoading(false);
    router.refresh();
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editName.trim()) return;

    setEditLoading(true);
    setError("");

    const res = await fetch(`/api/tags/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim(), parentId: editParentId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update tag");
      setEditLoading(false);
      return;
    }

    setEditingId(null);
    setEditLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    setError("");
    const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete tag");
      return;
    }

    router.refresh();
  }

  const childCount = (tag: TagData) =>
    tag._count?.children ?? tags.filter((t) => t.parentId === tag.id).length;

  function renderTagRow(tag: TagData, depth: number) {
    const children = getChildren(tag.id, tags);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(tag.id);
    const isEditing = editingId === tag.id;

    return (
      <div key={tag.id}>
        <div
          className={`flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 hover:bg-gray-50 ${
            depth > 0 ? "ml-6 border-l-2 border-gray-100" : ""
          }`}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(tag.id)}
              className="text-gray-400 hover:text-gray-600 w-5 text-sm cursor-pointer"
            >
              {isExpanded ? "▾" : "▸"}
            </button>
          ) : (
            <span className="w-5" />
          )}

          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <select
                value={editParentId || ""}
                onChange={(e) =>
                  setEditParentId(e.target.value || null)
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">(root)</option>
                {tags
                  .filter((t) => t.id !== tag.id)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleEdit}
                disabled={editLoading}
                className="text-green-600 hover:text-green-700 text-xs font-medium cursor-pointer disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-sm text-gray-900 font-medium">
                {tag.name}
              </span>
              <span className="text-xs text-gray-400 w-20 text-right">
                {tag._count.posts} posts
              </span>
              <button
                onClick={() => startEdit(tag)}
                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Edit
              </button>
              {childCount(tag) === 0 && (
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Delete
                </button>
              )}
              {childCount(tag) > 0 && (
                <span className="text-xs text-gray-300 w-10 text-right">
                  --
                </span>
              )}
            </>
          )}
        </div>

        {hasChildren && isExpanded &&
          children.map((child) => renderTagRow(child, depth + 1))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="flex gap-3 max-w-lg items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Tag Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Linear Algebra"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent
          </label>
          <select
            value={newParentId || ""}
            onChange={(e) => setNewParentId(e.target.value || null)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">(root)</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
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
          <div>
            {roots.map((root) => renderTagRow(root, 0))}
            {roots.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No root-level tags.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
