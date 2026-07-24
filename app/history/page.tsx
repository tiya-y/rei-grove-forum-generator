import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/categories";
import { HistoryTable } from "@/components/history-table";
import { buildHistoryWhere, HISTORY_STATUSES, type HistorySearchParams } from "@/lib/history-filters";

export const dynamic = "force-dynamic";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<HistorySearchParams>;
}) {
  const params = await searchParams;
  const where = buildHistoryWhere(params);

  const [posts, total, thisMonth, categories] = await Promise.all([
    prisma.forumPost.findMany({ where, orderBy: { updatedAt: "desc" } }),
    prisma.forumPost.count({ where: { status: { in: HISTORY_STATUSES } } }),
    prisma.forumPost.count({
      where: {
        status: { in: HISTORY_STATUSES },
        updatedAt: { gte: new Date(new Date().setDate(1)) },
      },
    }),
    getCategories(),
  ]);

  const exportParams = new URLSearchParams(params as Record<string, string>).toString();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <Link
          href={`/api/history/export${exportParams ? `?${exportParams}` : ""}`}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {total} total &middot; {thisMonth} this month
      </p>

      <form method="get" className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Search title or body..."
          className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <option value="">All statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="POSTED">Posted</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Filter
        </button>
      </form>

      <HistoryTable posts={posts} />
    </div>
  );
}
