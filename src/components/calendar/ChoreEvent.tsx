import { type EventProps } from 'react-big-calendar';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { CalendarEvent } from '../../types';
import { TeamMemberBadge } from '../team';

type ChoreEventProps = EventProps<CalendarEvent>;

export function ChoreEvent({ event }: ChoreEventProps) {
  const { chore, instance, assignee } = event.resource;
  const isCompleted = instance?.isCompleted ?? chore.isCompleted;

  return (
    <div className="flex items-center gap-1 px-1 py-0.5 overflow-hidden">
      {isCompleted && (
        <CheckCircleIcon className="w-3 h-3 flex-shrink-0 text-white/80" />
      )}
      <span className={`text-xs truncate ${isCompleted ? 'line-through opacity-70' : ''}`}>
        {event.title}
      </span>
      {assignee && (
        <div className="flex-shrink-0 ml-auto">
          <TeamMemberBadge name={assignee.name} color="rgba(255,255,255,0.3)" size="sm" />
        </div>
      )}
    </div>
  );
}
