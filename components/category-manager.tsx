"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X, Plus, Loader2 } from "lucide-react";
import type { ForumCategory } from "@prisma/client";

export function CategoryManager({ categories }: { categories: ForumCategory[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy("add");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Category added.");
      setName("");
      router.refresh();
    } catch (err) {
      toast.error("Failed to add category. It may already exist.");
      console.error(err);
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this category?")) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Category removed.");
      router.refresh();
    } catch (err) {
      toast.error("Failed to remove category. Try again.");
      console.error(err);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700"
          >
            {c.name}
            <button
              onClick={() => handleRemove(c.id)}
              disabled={busy === c.id}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Remove"
            >
              {busy === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        />
        <button
          type="submit"
          disabled={busy === "add" || !name.trim()}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {busy === "add" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>
    </div>
  );
}
