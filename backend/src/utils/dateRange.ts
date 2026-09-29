/**
 * Utility for parsing and generating standard MongoDB date queries across all modules.
 * Options: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thismonth' | 'custom' | 'all'
 */
export interface DateFilterRange {
  startDate?: Date;
  endDate?: Date;
}

export const getDateFilterBounds = (
  filter?: string,
  customStart?: string | Date,
  customEnd?: string | Date
): DateFilterRange => {
  if (!filter || filter === 'all' || filter === 'All' || filter === 'alltime') {
    if (customStart || customEnd) {
      const range: DateFilterRange = {};
      if (customStart) range.startDate = new Date(customStart);
      if (customEnd) {
        const e = new Date(customEnd);
        e.setHours(23, 59, 59, 999);
        range.endDate = e;
      }
      return range;
    }
    return {};
  }

  const now = new Date();
  const lower = filter.toLowerCase().replace(/\s+/g, '');

  if (lower === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }

  if (lower === 'yesterday') {
    const start = new Date(now);
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }

  if (lower === 'last7days' || lower === '7days' || lower === 'week') {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }

  if (lower === 'last30days' || lower === '30days' || lower === 'month') {
    const start = new Date(now);
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }

  if (lower === 'thismonth' || lower === 'currentmonth') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }

  if (lower === 'custom' || customStart || customEnd) {
    const range: DateFilterRange = {};
    if (customStart) {
      range.startDate = new Date(customStart);
    }
    if (customEnd) {
      const e = new Date(customEnd);
      e.setHours(23, 59, 59, 999);
      range.endDate = e;
    }
    return range;
  }

  return {};
};

export const applyDateFilterToQuery = (
  query: any,
  dateField: string,
  filter?: string,
  customStart?: string | Date,
  customEnd?: string | Date
) => {
  const { startDate, endDate } = getDateFilterBounds(filter, customStart, customEnd);
  if (startDate || endDate) {
    query[dateField] = query[dateField] || {};
    if (startDate) query[dateField].$gte = startDate;
    if (endDate) query[dateField].$lte = endDate;
  }
};
