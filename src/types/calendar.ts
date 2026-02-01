import type { Chore, ChoreInstance } from './chore';
import type { TeamMember } from './team';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    chore: Chore;
    instance?: ChoreInstance;
    assignee?: TeamMember;
    instanceDate: string;
  };
}
