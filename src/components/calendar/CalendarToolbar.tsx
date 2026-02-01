import { type ToolbarProps, type View } from 'react-big-calendar';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import type { CalendarEvent } from '../../types';

type CalendarToolbarProps = ToolbarProps<CalendarEvent, object>;

const VIEW_OPTIONS: { value: View; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export function CalendarToolbar({ label, onNavigate, onView, view }: CalendarToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Today
        </button>
        <div className="flex items-center">
          <button
            onClick={() => onNavigate('PREV')}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 ml-2">{label}</h2>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onView(option.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === option.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
