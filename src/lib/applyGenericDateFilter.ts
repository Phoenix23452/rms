/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Applies a generic time range filter (today, yesterday, this_week, this_month, from/to)
 * to any Prisma model, based on the field specified in `dateField`.
 */
export function applyGenericDateFilter(
  where: Record<string, any>,
  params: Record<string, any>,
): Record<string, any> {
  const { dateRange, dateField = "createdAt", from, to } = params;

  // Copy the where so we can safely modify it
  const newWhere = { ...where };

  // 🧹 Remove non-Prisma keys
  delete newWhere.dateRange;
  delete newWhere.dateField;
  delete newWhere.from;
  delete newWhere.to;

  if (!dateRange && !from && !to) return newWhere;

  const now = new Date();
  let startDate: Date | undefined;
  let endDate: Date = now;

  if (dateRange) {
    switch (dateRange) {
      case "today":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        startDate = new Date();
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "this_week":
        const dayOfWeek = now.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate = new Date(now);
        startDate.setDate(now.getDate() - diff);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "this_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }
  }

  if (from) startDate = new Date(from);
  if (to) endDate = new Date(to);

  // ✅ Add correct Prisma filter dynamically
  newWhere[dateField] = {
    ...(startDate ? { gte: startDate } : {}),
    ...(endDate ? { lte: endDate } : {}),
  };

  return newWhere;
}
