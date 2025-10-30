import { Calculation } from '@/hooks/useCalculation';
import { FilterState } from '@/components/HistoryFilters';

export const applyFilters = (history: Calculation[], filters: FilterState): Calculation[] => {
  let filtered = [...history];

  if (filters.scoreFilter !== 'all') {
    const scoreValue = parseInt(filters.scoreFilter);
    filtered = filtered.filter(calc => calc.score === scoreValue);
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter(calc => {
      const calcDate = new Date(calc.date.split(',')[0].split('.').reverse().join('-'));
      return calcDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(calc => {
      const calcDate = new Date(calc.date.split(',')[0].split('.').reverse().join('-'));
      return calcDate <= toDate;
    });
  }

  if (filters.percentageMin) {
    const minPercent = parseFloat(filters.percentageMin);
    filtered = filtered.filter(calc => {
      const percent = calc.finalPercentage || calc.percentage;
      return percent >= minPercent;
    });
  }

  if (filters.percentageMax) {
    const maxPercent = parseFloat(filters.percentageMax);
    filtered = filtered.filter(calc => {
      const percent = calc.finalPercentage || calc.percentage;
      return percent <= maxPercent;
    });
  }

  return filtered;
};
