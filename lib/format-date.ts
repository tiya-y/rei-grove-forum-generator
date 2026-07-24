import { format, formatDistanceToNow } from "date-fns";

export function formatWhen(date: Date) {
  const isRecent = Date.now() - date.getTime() < 24 * 60 * 60 * 1000;
  return isRecent ? `${formatDistanceToNow(date)} ago` : format(date, "MMM d, yyyy");
}
