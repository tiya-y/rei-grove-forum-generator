import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildHistoryWhere } from "@/lib/history-filters";
import { STATUS_LABELS, postTypeLabel } from "@/lib/constants";

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const posts = await prisma.forumPost.findMany({
    where: buildHistoryWhere(params),
    orderBy: { updatedAt: "desc" },
  });

  const header = ["Title", "Body", "Category", "Post Type", "Status", "Created", "Approved", "Posted"];
  const rows = posts.map((p) => [
    p.title,
    p.body,
    p.category,
    postTypeLabel(p.postType),
    STATUS_LABELS[p.status] ?? p.status,
    p.createdAt.toISOString(),
    p.approvedAt?.toISOString() ?? "",
    p.postedAt?.toISOString() ?? "",
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="rei-grove-forum-history.csv"`,
    },
  });
}
