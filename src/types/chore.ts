export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'monthly';

export interface RecurrenceRule {
  pattern: RecurrencePattern;
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export interface Chore {
  id: string;
  title: string;
  assigneeId: string | null;
  date: string;
  isCompleted: boolean;
  recurrence: RecurrenceRule;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ChoreInstance {
  choreId: string;
  instanceDate: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
}
