"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SiteConfigFormProps {
  configs: Record<string, string>;
  keys: { key: string; label: string; type?: string }[];
}

export function SiteConfigForm({ configs, keys }: SiteConfigFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(configs);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileUpload(key: string, file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setValues((prev) => ({ ...prev, [key]: data.url }));
      toast.success("Icon uploaded successfully.");
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to upload.");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      toast.success("Saved successfully.");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to save.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {keys.map(({ key, label, type }) => (
        <div key={key}>
          <label
            htmlFor={key}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
          {type === "textarea" ? (
            <textarea
              id={key}
              value={values[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : type === "file" ? (
            <div>
              <input
                id={key}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/x-icon"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(key, file);
                }}
                className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 cursor-pointer"
                disabled={uploading}
              />
              {values[key] && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={values[key]}
                    alt="Site icon preview"
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{values[key]}</span>
                </div>
              )}
            </div>
          ) : (
            <input
              id={key}
              type="text"
              value={values[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
