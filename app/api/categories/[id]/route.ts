import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.forumCategory.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to remove category. Try again." },
      { status: 500 },
    );
  }
}
