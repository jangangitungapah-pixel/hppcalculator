export const REPORT_PERIODS = {
  DAYS_7: '7d',
  DAYS_30: '30d',
  ALL_TIME: 'all'
};

export const getPeriodStartDate = (period) => {
  if (period === REPORT_PERIODS.ALL_TIME) return null;
  
  const now = new Date();
  const days = period === REPORT_PERIODS.DAYS_7 ? 7 : 30;
  
  // Set to start of day X days ago
  const startDate = new Date(now.setDate(now.getDate() - days));
  startDate.setHours(0, 0, 0, 0);
  
  return startDate;
};

export const isWithinPeriod = (dateString, period) => {
  if (period === REPORT_PERIODS.ALL_TIME) return true;
  if (!dateString) return false;
  
  const itemDate = new Date(dateString);
  if (isNaN(itemDate.getTime())) return false;
  
  const startDate = getPeriodStartDate(period);
  return itemDate >= startDate;
};

export const filterByPeriod = (items, period, dateField = "createdAt") => {
  if (!Array.isArray(items)) return [];
  if (period === REPORT_PERIODS.ALL_TIME) return [...items];
  
  return items.filter(item => {
    // If the item doesn't have the date field, we could exclude or include it.
    // Usually it's better to exclude it if it doesn't have a valid date and we are filtering by period.
    if (!item || !item[dateField]) return false;
    return isWithinPeriod(item[dateField], period);
  });
};

export const sortByDateDesc = (items, dateField = "createdAt") => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const dateA = a[dateField] ? new Date(a[dateField]).getTime() : 0;
    const dateB = b[dateField] ? new Date(b[dateField]).getTime() : 0;
    return dateB - dateA;
  });
};
