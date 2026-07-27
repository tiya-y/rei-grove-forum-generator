"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ChevronRight } from "lucide-react";
import { POST_TYPES } from "@/lib/constants";

const SOURCE_MODES = [
  { value: "MIX", label: "Mix of both" },
  { value: "RESOURCE", label: "Tied to REI Grove content" },
  { value: "GENERAL", label: "General investing topic" },
];

export function InputForm({ categories }: { categories: string[] }) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
  const [sourceMode, setSourceMode] = useState("MIX");
  const [focusResource, setFocusResource] = useState("");
  const [postType, setPostType] = useState("MIX");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const allSelected = selectedCategories.length === categories.length;

  function toggleCategory(name: string) {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  }

  function toggleAll() {
    setSelectedCategories(allSelected ? [] : categories);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      toast.error("Pick at least one forum category.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: selectedCategories,
          sourceMode,
          focusResource: focusResource.trim() || undefined,
          postType,
          count,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success(`${json.data.count} posts generated. Review them below.`);
      router.push("/approve");
    } catch (err) {
      toast.error("Failed to generate posts. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Where should these post?</h2>
          <button
            type="button"
            onClick={toggleAll}
            disabled={loading}
            className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Forum Categories <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mt-1 mb-2">
            Pick one or more. Posts are spread evenly across everything you select.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c)}
                  onChange={() => toggleCategory(c)}
                  disabled={loading}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {c}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">What should they be about?</h2>

        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Content Source
          </label>
          <select
            value={sourceMode}
            onChange={(e) => setSourceMode(e.target.value)}
            disabled={loading}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {SOURCE_MODES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Optional: point posts at a specific resource instead of letting the topic vary.
          </p>
        </div>

        {sourceMode !== "GENERAL" && (
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Focus Resource
            </label>
            <input
              type="text"
              value={focusResource}
              onChange={(e) => setFocusResource(e.target.value)}
              disabled={loading}
              placeholder="e.g. BRRRR Analysis Spreadsheet, leave blank to let the topic vary"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Post Type
          </label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            disabled={loading}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <option value="MIX">Mix of types</option>
            {POST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            How Many Posts?
          </label>
          <input
            type="number"
            min={1}
            max={40}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            disabled={loading}
            className="mt-1 w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-1">
            Total across all selected categories, split as evenly as possible.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || selectedCategories.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating {count} posts...
            </>
          ) : (
            <>
              Generate
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
