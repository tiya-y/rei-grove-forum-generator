"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, RotateCcw, Trash2, Loader2, Copy, Check, Send } from "lucide-react";
import type { ForumPost } from "@prisma/client";
import { postTypeLabel } from "@/lib/constants";

export function PostCard({ post }: { post: ForumPost }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dirty = title !== post.title || body !== post.body;

  async function callAction(action: string, path: string, options?: RequestInit) {
    setBusy(action);
    try {
      const res = await fetch(path, { method: "POST", ...options });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json;
    } catch (err) {
      toast.error(`Failed to ${action} post. Try again.`);
      console.error(err);
      throw err;
    } finally {
      setBusy(null);
    }
  }

  async function handleSave() {
    setBusy("save");
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Post updated.");
      setEditing(false);
      router.refresh();
    } catch (err) {
      toast.error("Failed to save changes. Try again.");
      console.error(err);
    } finally {
      setBusy(null);
    }
  }

  async function handleRegenerate() {
    if (dirty && !confirm("Regenerate? Your edits will be lost.")) return;
    try {
      await callAction("regenerate", `/api/posts/${post.id}/regenerate`);
      router.refresh();
    } catch {
      // toast already shown
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this item?")) return;
    try {
      await callAction("delete", `/api/posts/${post.id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      // toast already shown
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${post.title}\n\n${post.body}`);
      setCopied(true);
      toast.success("Copied to clipboard.");
    } catch (err) {
      toast.error("Couldn't copy to clipboard. Try again.");
      console.error(err);
    }
  }

  async function handleMarkPosted() {
    setBusy("posted");
    try {
      await callAction("mark posted", `/api/posts/${post.id}/mark-posted`);
      toast.success("Posted to REI Grove — moved to History.");
      router.refresh();
    } catch {
      // toast already shown
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{post.category}</span>
          <span>&middot;</span>
          <span>{postTypeLabel(post.postType)}</span>
          {post.sourceRef && (
            <>
              <span>&middot;</span>
              <span className="truncate max-w-[220px]">{post.sourceRef}</span>
            </>
          )}
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          AI draft
        </span>
      </div>

      {editing ? (
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={busy === "save"}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {busy === "save" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold text-gray-900">{post.title}</p>
          <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{post.body}</p>
        </div>
      )}

      {!editing && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleRegenerate}
              disabled={busy === "regenerate"}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              title="Regenerate"
            >
              {busy === "regenerate" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={busy === "delete"}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Delete"
            >
              {busy === "delete" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy the post text"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? "bg-gray-100 text-gray-600"
                  : "bg-gray-800 text-white hover:bg-gray-900"
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handleMarkPosted}
              disabled={!copied || busy === "posted"}
              title={copied ? "Mark as posted and move to History" : "Copy the text first"}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:hover:bg-green-600"
            >
              {busy === "posted" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Posted to REI Grove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
