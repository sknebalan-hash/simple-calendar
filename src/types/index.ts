export * from './team';
export * from './chore';
export * from './calendar';

export interface AppSettings {
  defaultView: 'day' | 'week' | 'month';
  workWeekOnly: boolean;
}

export interface AppState {
  chores: Chore[];
  choreInstances: ChoreInstance[];
  teamMembers: TeamMember[];
  settings: AppSettings;
}
