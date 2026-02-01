import {
  addDays,
  addWeeks,
  addMonths,
  isBefore,
  isAfter,
  isSameDay,
  parseISO,
  getDay,
  setDate,
  endOfMonth,
  getDaysInMonth,
  startOfDay,
} from 'date-fns';
import type { Chore, RecurrenceRule, CalendarEvent, ChoreInstance, TeamMember } from '../types';
import { formatDateISO } from '../utils/date';

export function getNextOccurrence(currentDate: Date, rule: RecurrenceRule): Date {
  switch (rule.pattern) {
    case 'daily':
      return addDays(currentDate, rule.interval);
    case 'weekly':
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        let nextDate = addDays(currentDate, 1);
        for (let i = 0; i < 7 * rule.interval; i++) {
          if (rule.daysOfWeek.includes(getDay(nextDate))) {
            return nextDate;
          }
          nextDate = addDays(nextDate, 1);
        }
        return addWeeks(currentDate, rule.interval);
      }
      return addWeeks(currentDate, rule.interval);
    case 'monthly':
      const nextMonth = addMonths(currentDate, rule.interval);
      if (rule.dayOfMonth) {
        const day = Math.min(rule.dayOfMonth, getDaysInMonth(nextMonth));
        return setDate(nextMonth, day);
      }
      return nextMonth;
    default:
      return currentDate;
  }
}

export function generateInstances(
  chore: Chore,
  rangeStart: Date,
  rangeEnd: Date,
  choreInstances: ChoreInstance[],
  teamMembers: TeamMember[]
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const assignee = teamMembers.find((m) => m.id === chore.assigneeId);
  const choreStartDate = startOfDay(parseISO(chore.date));

  if (chore.recurrence.pattern === 'none') {
    if (!isBefore(choreStartDate, rangeStart) || isSameDay(choreStartDate, rangeStart)) {
      if (isBefore(choreStartDate, rangeEnd) || isSameDay(choreStartDate, rangeEnd)) {
        const instanceDate = formatDateISO(choreStartDate);
        const instance = choreInstances.find(
          (i) => i.choreId === chore.id && i.instanceDate === instanceDate
        );
        events.push(createEvent(chore, choreStartDate, instance, assignee));
      }
    }
    return events;
  }

  let currentDate = choreStartDate;
  const endDate = chore.recurrence.endDate ? parseISO(chore.recurrence.endDate) : null;

  while (isBefore(currentDate, rangeStart) && (!endDate || isBefore(currentDate, endDate))) {
    currentDate = getNextOccurrence(currentDate, chore.recurrence);
  }

  while (
    (isBefore(currentDate, rangeEnd) || isSameDay(currentDate, rangeEnd)) &&
    (!endDate || isBefore(currentDate, endDate) || isSameDay(currentDate, endDate))
  ) {
    if (isAfter(currentDate, rangeStart) || isSameDay(currentDate, rangeStart)) {
      const instanceDate = formatDateISO(currentDate);
      const instance = choreInstances.find(
        (i) => i.choreId === chore.id && i.instanceDate === instanceDate
      );
      events.push(createEvent(chore, currentDate, instance, assignee));
    }
    currentDate = getNextOccurrence(currentDate, chore.recurrence);
  }

  return events;
}

function createEvent(
  chore: Chore,
  date: Date,
  instance: ChoreInstance | undefined,
  assignee: TeamMember | undefined
): CalendarEvent {
  const instanceDate = formatDateISO(date);
  return {
    id: `${chore.id}_${instanceDate}`,
    title: chore.title,
    start: date,
    end: date,
    resource: {
      chore,
      instance,
      assignee,
      instanceDate,
    },
  };
}

export function generateAllEvents(
  chores: Chore[],
  choreInstances: ChoreInstance[],
  teamMembers: TeamMember[],
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  return chores.flatMap((chore) =>
    generateInstances(chore, rangeStart, rangeEnd, choreInstances, teamMembers)
  );
}
