import Link from "next/link";
import { Plus, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import { formatWhen } from "@/lib/format-date";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [needsReview, approved, postedThisMonth, totalPosted, recentNeedsReview, recentOther] =
    await Promise.all([
      prisma.forumPost.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.forumPost.count({ where: { status: "APPROVED" } }),
      prisma.forumPost.count({ where: { status: "POSTED", postedAt: { gte: startOfMonth } } }),
      prisma.forumPost.count({ where: { status: "POSTED" } }),
      prisma.forumPost.findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { updatedAt: "desc" },
        take: 8,
      }),
      prisma.forumPost.findMany({
        where: { status: { notIn: ["PENDING_REVIEW", "APPROVED", "POSTED"] } },
        orderBy: { updatedAt: "desc" },
        take: 8,
      }),
    ]);

  const recent = [...recentNeedsReview, ...recentOther].slice(0, 8);

  return { needsReview, approved, postedThisMonth, totalPosted, recent };
}

export default async function DashboardPage() {
  const { needsReview, approved, postedThisMonth, totalPosted, recent } = await getDashboardData();

  const stats = [
    { label: "Needs Review", value: needsReview },
    { label: "Approved, Ready to Post", value: approved },
    { label: "Posted This Month", value: postedThisMonth },
    { label: "Total Posted", value: totalPosted },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate discussion-starter posts for the REI Grove forums.
          </p>
        </div>
        <Link
          href="/input"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Batch
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No posts yet</p>
            <Link href="/input" className="text-sm text-blue-600 font-medium mt-2 hover:underline">
              Generate your first batch
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recent.map((post) => (
              <li key={post.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50">
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 truncate">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {post.category} &middot; {formatWhen(post.updatedAt)}
                  </p>
                </div>
                <StatusBadge status={post.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
