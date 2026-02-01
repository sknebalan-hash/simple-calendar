import { useState, type FormEvent } from 'react';
import type { Chore, RecurrenceRule } from '../../types';
import { useTeam } from '../../contexts/TeamContext';
import { Button, Input, Select } from '../ui';
import { RecurrenceSelector } from './RecurrenceSelector';
import { formatDateISO } from '../../utils/date';

interface ChoreFormProps {
  chore?: Chore;
  initialDate?: Date;
  onSubmit: (chore: Omit<Chore, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ChoreForm({ chore, initialDate, onSubmit, onCancel, onDelete }: ChoreFormProps) {
  const { members } = useTeam();
  const [title, setTitle] = useState(chore?.title ?? '');
  const [assigneeId, setAssigneeId] = useState(chore?.assigneeId ?? '');
  const [date, setDate] = useState(
    chore?.date ?? (initialDate ? formatDateISO(initialDate) : formatDateISO(new Date()))
  );
  const [recurrence, setRecurrence] = useState<RecurrenceRule>(
    chore?.recurrence ?? { pattern: 'none', interval: 1 }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      assigneeId: assigneeId || null,
      date,
      isCompleted: chore?.isCompleted ?? false,
      recurrence,
    });
  };

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Chore title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Clean the kitchen"
        required
        autoFocus
      />

      <Select
        label="Assignee"
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
        options={memberOptions}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <RecurrenceSelector value={recurrence} onChange={setRecurrence} />

      <div className="flex justify-between pt-4">
        <div>
          {onDelete && (
            <Button type="button" variant="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            {chore ? 'Save' : 'Add Chore'}
          </Button>
        </div>
      </div>
    </form>
  );
}
