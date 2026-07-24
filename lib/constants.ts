// Real REI Grove forum categories, from the forum's actual import data.
export const DEFAULT_CATEGORIES = [
  "New Member Introductions",
  "Multifamily",
  "Market Trends & Current Events",
  "Maintenance",
  "House Flipping",
  "General Advice",
  "Self-storage",
  "Flipping/Rehabbing",
  "Miscellaneous",
];

export const POST_TYPES = [
  { value: "QUESTION", label: "Question" },
  { value: "POLL", label: "Poll" },
  { value: "SHARE_YOUR_STORY", label: "Share Your Story" },
  { value: "DISCUSSION", label: "Discussion" },
  { value: "TIPS_THREAD", label: "Tips Thread" },
] as const;

export const SOURCE_TYPES = [
  { value: "RESOURCE", label: "Tied to REI Grove content" },
  { value: "GENERAL", label: "General investing topic" },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: "Needs Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  POSTED: "Posted",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING_REVIEW: "bg-yellow-50 text-yellow-700",
  APPROVED: "bg-blue-50 text-blue-700",
  REJECTED: "bg-red-50 text-red-600",
  POSTED: "bg-green-50 text-green-700",
};

export function postTypeLabel(value: string) {
  return POST_TYPES.find((t) => t.value === value)?.label ?? value;
}
