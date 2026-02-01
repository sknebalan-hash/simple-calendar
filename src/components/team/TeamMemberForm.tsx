import { useState, type FormEvent } from 'react';
import { TEAM_COLORS, getNextColor, getContrastColor } from '../../utils/colors';

interface TeamMemberFormProps {
  initialName?: string;
  initialColor?: string;
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function TeamMemberForm({
  initialName = '',
  initialColor,
  onSubmit,
  onCancel,
  submitLabel = 'Add',
}: TeamMemberFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor ?? getNextColor());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), color);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team member name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Color:</span>
        <div className="flex gap-1">
          {TEAM_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                color === c ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            >
              {color === c && (
                <span style={{ color: getContrastColor(c) }} className="text-xs font-bold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
