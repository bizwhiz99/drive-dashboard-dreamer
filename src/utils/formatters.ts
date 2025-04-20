
/**
 * Utility functions for formatting data in charts
 */

/**
 * Format numbers with thousands separator
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Format numbers with thousands separator and k suffix for thousands
 */
export const formatNumberWithK = (value: number): string => {
  return value >= 1000 ? `${(value / 1000).toLocaleString()}k` : value.toLocaleString();
};

/**
 * Format percentage values
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format date objects to month and year
 */
export const formatDateMonthYear = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};

/**
 * Format date objects to full month and year
 */
export const formatDateFullMonthYear = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
};

/**
 * Format any date value safely
 */
export const safeFormatDate = (value: any, formatFn: (date: Date) => string): string => {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return formatFn(value);
  }
  
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return formatFn(date);
      }
    } catch (e) {
      console.error("Failed to parse date:", value);
    }
  }
  
  return String(value || '');
};
