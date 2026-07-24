import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.forumPost.update({
      where: { id },
      data: { status: "APPROVED", approvedAt: new Date() },
    });
    return NextResponse.json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to approve post. Try again." },
      { status: 500 },
    );
  }
}
