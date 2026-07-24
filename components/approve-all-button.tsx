"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, CheckCheck } from "lucide-react";

export function ApproveAllButton({ count }: { count: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApproveAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/approve-all", { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(`${json.data.count} posts approved.`);
      router.refresh();
    } catch (err) {
      toast.error("Failed to approve all posts. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleApproveAll}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
      Approve All ({count})
    </button>
  );
}
