import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Category name is required." }, { status: 400 });
    }
    const count = await prisma.forumCategory.count();
    const category = await prisma.forumCategory.create({
      data: { name: name.trim(), sortOrder: count },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to add category. It may already exist." },
      { status: 500 },
    );
  }
}
