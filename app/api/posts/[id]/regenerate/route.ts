import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePosts } from "@/lib/generator";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.forumPost.findUniqueOrThrow({ where: { id } });

    const [regenerated] = await generatePosts({
      category: existing.category,
      postType: existing.postType,
      sourceMode: existing.sourceType,
      count: 1,
      focusResource: existing.sourceRef ?? undefined,
    });

    const post = await prisma.forumPost.update({
      where: { id },
      data: {
        title: regenerated.title,
        body: regenerated.body,
        sourceRef: regenerated.sourceRef,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to regenerate post. Try again." },
      { status: 500 },
    );
  }
}
