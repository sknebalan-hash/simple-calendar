import { format, parseISO } from 'date-fns';

export const formatDateISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

export const parseDateString = (dateStr: string): Date => {
  return parseISO(dateStr);
};

export const getInstanceKey = (choreId: string, date: Date): string => {
  return `${choreId}_${formatDateISO(date)}`;
};
