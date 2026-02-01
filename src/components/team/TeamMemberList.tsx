import { useState } from 'react';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTeam } from '../../contexts/TeamContext';
import { TeamMemberBadge } from './TeamMemberBadge';
import { TeamMemberForm } from './TeamMemberForm';

export function TeamMemberList() {
  const { members, addMember, updateMember, deleteMember } = useTeam();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (name: string, color: string) => {
    addMember(name, color);
    setIsAdding(false);
  };

  const handleUpdate = (id: string, name: string, color: string) => {
    updateMember(id, name, color);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      deleteMember(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
          >
            <PlusIcon className="w-4 h-4" />
            Add Member
          </button>
        )}
      </div>

      {isAdding && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <TeamMemberForm onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />
        </div>
      )}

      {members.length === 0 && !isAdding ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No team members yet. Add your first team member to get started.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {members.map((member) => (
            <li key={member.id} className="py-3">
              {editingId === member.id ? (
                <TeamMemberForm
                  initialName={member.name}
                  initialColor={member.color}
                  onSubmit={(name, color) => handleUpdate(member.id, name, color)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="Save"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TeamMemberBadge name={member.name} color={member.color} size="md" />
                    <span className="text-sm font-medium text-gray-900">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingId(member.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Remove"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
