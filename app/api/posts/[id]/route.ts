import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, body } = await req.json();

    const post = await prisma.forumPost.update({
      where: { id },
      data: { title, body },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to save changes. Try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.forumPost.update({
      where: { id },
      data: { status: "REJECTED", rejectedAt: new Date() },
    });
    return NextResponse.json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to delete post. Try again." },
      { status: 500 },
    );
  }
}
