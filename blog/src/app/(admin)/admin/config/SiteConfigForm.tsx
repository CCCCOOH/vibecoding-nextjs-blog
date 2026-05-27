"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SiteConfigFormProps {
  configs: Record<string, string>;
  keys: { key: string; label: string; type?: string }[];
}

export function SiteConfigForm({ configs, keys }: SiteConfigFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(configs);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
      setMessage("Icon uploaded successfully.");
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to upload.");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      setMessage("Saved successfully.");
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to save.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded text-sm ${
            message.includes("Failed") || message.includes("Invalid")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {message}
        </div>
      )}
      {keys.map(({ key, label, type }) => (
        <div key={key}>
          <label
            htmlFor={key}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
          {type === "textarea" ? (
            <textarea
              id={key}
              value={values[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                disabled={uploading}
              />
              {values[key] && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={values[key]}
                    alt="Site icon preview"
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-xs text-gray-500">{values[key]}</span>
                </div>
              )}
            </div>
          ) : (
            <input
              id={key}
              type="text"
              value={values[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
