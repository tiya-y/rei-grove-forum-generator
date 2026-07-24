import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { ApproveAllButton } from "@/components/approve-all-button";

export const dynamic = "force-dynamic";

async function getQueue() {
  return prisma.forumPost.findMany({
    where: { status: "PENDING_REVIEW" },
    orderBy: { createdAt: "asc" },
  });
}

export default async function ApprovePage() {
  const posts = await getQueue();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approve</h1>
          <p className="text-sm text-gray-500 mt-1">
            {posts.length > 0
              ? `${posts.length} item${posts.length === 1 ? "" : "s"} need your review`
              : "Review generated posts before they go out"}
          </p>
        </div>
        {posts.length > 3 && <ApproveAllButton count={posts.length} />}
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-3">Nothing to review.</p>
          <Link
            href="/input"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate Something New
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
