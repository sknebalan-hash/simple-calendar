import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, type View, type SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addDays, subDays } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import type { CalendarEvent, Chore } from '../../types';
import { useChores } from '../../contexts/ChoreContext';
import { useTeam } from '../../contexts/TeamContext';
import { generateAllEvents } from '../../services/recurrence';
import { CalendarToolbar } from './CalendarToolbar';
import { ChoreEvent } from './ChoreEvent';
import { Modal } from '../ui';
import { ChoreForm } from '../chores';
import { formatDateISO } from '../../utils/date';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export function ChoreCalendar() {
  const { chores, choreInstances, addChore, updateChore, deleteChore, toggleInstance } = useChores();
  const { members } = useTeam();

  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newChoreDate, setNewChoreDate] = useState<Date | null>(null);

  const { rangeStart, rangeEnd } = useMemo(() => {
    const buffer = view === 'month' ? 7 : view === 'week' ? 1 : 0;
    let start: Date, end: Date;

    if (view === 'month') {
      start = subDays(startOfMonth(date), buffer);
      end = addDays(endOfMonth(date), buffer);
    } else if (view === 'week') {
      start = subDays(startOfWeek(date, { weekStartsOn: 0 }), buffer);
      end = addDays(start, 7 + buffer * 2);
    } else {
      start = subDays(date, buffer);
      end = addDays(date, buffer + 1);
    }

    return { rangeStart: start, rangeEnd: end };
  }, [date, view]);

  const events = useMemo(
    () => generateAllEvents(chores, choreInstances, members, rangeStart, rangeEnd),
    [chores, choreInstances, members, rangeStart, rangeEnd]
  );

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setNewChoreDate(slotInfo.start);
  }, []);

  const handleAddChore = (choreData: Omit<Chore, 'id' | 'createdAt' | 'updatedAt'>) => {
    addChore(choreData);
    setNewChoreDate(null);
  };

  const handleUpdateChore = (choreData: Omit<Chore, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedEvent) {
      updateChore({
        ...selectedEvent.resource.chore,
        ...choreData,
      });
      setSelectedEvent(null);
    }
  };

  const handleDeleteChore = () => {
    if (selectedEvent) {
      if (confirm('Are you sure you want to delete this chore?')) {
        deleteChore(selectedEvent.resource.chore.id);
        setSelectedEvent(null);
      }
    }
  };

  const handleToggleComplete = () => {
    if (selectedEvent) {
      toggleInstance(
        selectedEvent.resource.chore.id,
        selectedEvent.start
      );
      setSelectedEvent(null);
    }
  };

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const { assignee, instance, chore } = event.resource;
    const isCompleted = instance?.isCompleted ?? chore.isCompleted;

    return {
      style: {
        backgroundColor: assignee?.color ?? '#6B7280',
        borderRadius: '4px',
        opacity: isCompleted ? 0.6 : 1,
        border: 'none',
        color: 'white',
      },
    };
  }, []);

  const isCompleted = selectedEvent
    ? selectedEvent.resource.instance?.isCompleted ?? selectedEvent.resource.chore.isCompleted
    : false;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      <Calendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectEvent={handleSelectEvent}
        selectable
        onSelectSlot={handleSelectSlot}
        components={{
          toolbar: CalendarToolbar,
          event: ChoreEvent,
        }}
        eventPropGetter={eventStyleGetter}
        style={{ flex: 1 }}
        popup
      />

      <Modal
        isOpen={newChoreDate !== null}
        onClose={() => setNewChoreDate(null)}
        title="Add Chore"
      >
        <ChoreForm
          initialDate={newChoreDate ?? undefined}
          onSubmit={handleAddChore}
          onCancel={() => setNewChoreDate(null)}
        />
      </Modal>

      <Modal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title="Edit Chore"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleComplete}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  isCompleted
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
            </div>
            <hr className="border-gray-200" />
            <ChoreForm
              chore={selectedEvent.resource.chore}
              onSubmit={handleUpdateChore}
              onCancel={() => setSelectedEvent(null)}
              onDelete={handleDeleteChore}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
