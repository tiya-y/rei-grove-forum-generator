import type { Prisma, PostStatus } from "@prisma/client";

export type HistorySearchParams = { q?: string; status?: string; category?: string };

export const HISTORY_STATUSES: PostStatus[] = ["APPROVED", "POSTED", "REJECTED"];

export function buildHistoryWhere(params: HistorySearchParams): Prisma.ForumPostWhereInput {
  const where: Prisma.ForumPostWhereInput = {
    status: { in: HISTORY_STATUSES },
  };
  if (params.status && HISTORY_STATUSES.includes(params.status as PostStatus)) {
    where.status = params.status as PostStatus;
  }
  if (params.category) where.category = params.category;
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { body: { contains: params.q, mode: "insensitive" } },
    ];
  }
  return where;
}
