import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePosts } from "@/lib/generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, postType, sourceMode, count, focusResource } = body;

    if (!category || !postType || !sourceMode || !count) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 },
      );
    }

    const posts = await generatePosts({
      category,
      postType,
      sourceMode,
      count: Math.min(Number(count), 20),
      focusResource,
    });

    const batchId = crypto.randomUUID();
    await prisma.forumPost.createMany({
      data: posts.map((p) => ({
        category: p.category,
        sourceType: p.sourceType,
        sourceRef: p.sourceRef,
        postType: p.postType,
        title: p.title,
        body: p.body,
        batchId,
      })),
    });

    return NextResponse.json({ success: true, data: { batchId, count: posts.length } });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to generate posts. Try again." },
      { status: 500 },
    );
  }
}
