"use client";

import { useState } from "react";
import { toast } from "sonner";

export function DeployButton() {
  const [loading, setLoading] = useState(false);

  async function handleDeploy() {
    setLoading(true);
    try {
      const res = await fetch("/api/deploy", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        if (data.message === "No changes to deploy") {
          toast.info("No changes to deploy");
        } else {
          toast.success(data.message || "Deployed successfully");
        }
      } else {
        toast.error(data.error || "Deploy failed");
      }
    } catch {
      toast.error("Network error: unable to reach deploy endpoint");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDeploy}
      disabled={loading}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 cursor-pointer"
    >
      {loading ? "Deploying..." : "Deploy to Vercel"}
    </button>
  );
}
