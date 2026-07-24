import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export async function getCategories() {
  const existing = await prisma.forumCategory.findMany({ orderBy: { sortOrder: "asc" } });
  if (existing.length > 0) return existing;

  await prisma.forumCategory.createMany({
    data: DEFAULT_CATEGORIES.map((name, i) => ({ name, sortOrder: i })),
  });
  return prisma.forumCategory.findMany({ orderBy: { sortOrder: "asc" } });
}
