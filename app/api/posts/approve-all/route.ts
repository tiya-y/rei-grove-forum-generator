import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const result = await prisma.forumPost.updateMany({
      where: { status: "PENDING_REVIEW" },
      data: { status: "APPROVED", approvedAt: new Date() },
    });
    return NextResponse.json({ success: true, data: { count: result.count } });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to approve all posts. Try again." },
      { status: 500 },
    );
  }
}
