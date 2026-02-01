import type { RecurrenceRule, RecurrencePattern } from '../../types';
import { RECURRENCE_PATTERNS, DAYS_OF_WEEK } from '../../constants/recurrence';
import { Select } from '../ui';

interface RecurrenceSelectorProps {
  value: RecurrenceRule;
  onChange: (rule: RecurrenceRule) => void;
}

export function RecurrenceSelector({ value, onChange }: RecurrenceSelectorProps) {
  const handlePatternChange = (pattern: RecurrencePattern) => {
    const newRule: RecurrenceRule = {
      pattern,
      interval: 1,
    };

    if (pattern === 'weekly') {
      newRule.daysOfWeek = [new Date().getDay()];
    }

    onChange(newRule);
  };

  const handleIntervalChange = (interval: number) => {
    onChange({ ...value, interval });
  };

  const handleDaysOfWeekChange = (day: number) => {
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort();

    if (newDays.length > 0) {
      onChange({ ...value, daysOfWeek: newDays });
    }
  };

  const handleEndDateChange = (endDate: string) => {
    onChange({ ...value, endDate: endDate || undefined });
  };

  return (
    <div className="space-y-3">
      <Select
        label="Repeats"
        value={value.pattern}
        onChange={(e) => handlePatternChange(e.target.value as RecurrencePattern)}
        options={RECURRENCE_PATTERNS}
      />

      {value.pattern !== 'none' && (
        <>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Every
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={value.interval}
                onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600">
                {value.pattern === 'daily' && (value.interval === 1 ? 'day' : 'days')}
                {value.pattern === 'weekly' && (value.interval === 1 ? 'week' : 'weeks')}
                {value.pattern === 'monthly' && (value.interval === 1 ? 'month' : 'months')}
              </span>
            </div>
          </div>

          {value.pattern === 'weekly' && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                On
              </label>
              <div className="flex flex-wrap gap-1">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDaysOfWeekChange(day.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      value.daysOfWeek?.includes(day.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              End date (optional)
            </label>
            <input
              type="date"
              value={value.endDate || ''}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      )}
    </div>
  );
}
