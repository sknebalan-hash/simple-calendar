import { useState, type FormEvent } from 'react';

interface TeamMemberFormProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function TeamMemberForm({
  initialName = '',
  onSubmit,
  onCancel,
  submitLabel = 'Add',
}: TeamMemberFormProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
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
    </form>
  );
}
