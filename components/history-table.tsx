"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import type { ForumPost } from "@prisma/client";
import { StatusBadge } from "@/components/status-badge";
import { formatWhen } from "@/lib/format-date";
import { MessageSquare } from "lucide-react";

export function HistoryTable({ posts }: { posts: ForumPost[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No posts match these filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 text-left">
              Title
            </th>
            <th className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 text-left">
              Category
            </th>
            <th className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 text-left">
              Status
            </th>
            <th className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 text-left">
              Date
            </th>
            <th className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 text-left">
              &nbsp;
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <HistoryRow
              key={post.id}
              post={post}
              expanded={expandedId === post.id}
              onToggle={() => setExpandedId(expandedId === post.id ? null : post.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistoryRow({
  post,
  expanded,
  onToggle,
}: {
  post: ForumPost;
  expanded: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"markPosted" | "delete" | null>(null);

  async function handleMarkPosted() {
    setBusy("markPosted");
    try {
      const res = await fetch(`/api/posts/${post.id}/mark-posted`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Marked as posted.");
      router.refresh();
    } catch (err) {
      toast.error("Failed to mark post as posted. Try again.");
      console.error(err);
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post permanently? This cannot be undone.")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/posts/${post.id}/permanent-delete`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Post deleted.");
      router.refresh();
    } catch (err) {
      toast.error("Failed to delete post. Try again.");
      console.error(err);
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50/50">
        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{post.title}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{post.category}</td>
        <td className="px-4 py-3 text-sm">
          <StatusBadge status={post.status} />
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">{formatWhen(post.updatedAt)}</td>
        <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
          <button onClick={onToggle} className="text-blue-600 font-medium hover:underline mr-3">
            View
          </button>
          {post.status === "APPROVED" && (
            <button
              onClick={handleMarkPosted}
              disabled={busy !== null}
              className="text-green-600 font-medium hover:underline disabled:opacity-50 inline-flex items-center gap-1 mr-3"
            >
              {busy === "markPosted" && <Loader2 className="w-3 h-3 animate-spin" />}
              Mark Posted
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={busy !== null}
            title="Delete permanently"
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 inline-flex align-middle"
          >
            {busy === "delete" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-50 bg-gray-50/50">
          <td colSpan={5} className="px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
            {post.body}
          </td>
        </tr>
      )}
    </>
  );
}
