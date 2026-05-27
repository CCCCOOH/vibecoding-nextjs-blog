"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { TagBadge } from "./TagBadge";
import { PostEditor } from "./admin/PostEditor";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface PostData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  tags: { tagId: string; tag: Tag }[];
}

export function ArticleContent({
  post,
  allTags,
  isLoggedIn,
}: {
  post: PostData;
  allTags: Tag[];
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [published, setPublished] = useState(post.published);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post.tags.map((t) => t.tagId)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentTags = allTags.filter((t) => selectedTags.includes(t.id));

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        excerpt,
        published,
        tagIds: selectedTags,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setIsEditing(false);
    router.refresh();
  }

  function handleCancel() {
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt);
    setPublished(post.published);
    setSelectedTags(post.tags.map((t) => t.tagId));
    setError("");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSave} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Excerpt
                </label>
                <input
                  id="excerpt"
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short description of the post"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (Markdown with LaTeX support)
                </label>
                <PostEditor value={content} onChange={setContent} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                        selectedTags.includes(tag.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm text-gray-700">
                  Published
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <a
              href="/"
              className="text-sm text-blue-600 hover:underline inline-block"
            >
              &larr; Back to posts
            </a>
            {isLoggedIn && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:underline border border-blue-300 rounded px-3 py-1 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex gap-1.5">
              {currentTags.map((tag) => (
                <TagBadge key={tag.id} name={tag.name} slug={tag.slug} />
              ))}
            </div>
            <time className="text-sm text-gray-400">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          {post.excerpt && (
            <p className="text-gray-500 mt-3 text-lg">{post.excerpt}</p>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <MarkdownRenderer content={post.content} />
        </div>
      </main>
    </div>
  );
}
