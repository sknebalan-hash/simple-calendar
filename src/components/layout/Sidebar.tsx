import { useTeam } from '../../contexts/TeamContext';
import { TeamMemberBadge } from '../team/TeamMemberBadge';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export function Sidebar() {
  const { members } = useTeam();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-700">
          <UserGroupIcon className="w-5 h-5" />
          <h2 className="font-semibold">Team Members</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">No team members yet</p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TeamMemberBadge name={member.name} color={member.color} size="md" />
                <span className="text-sm text-gray-700 truncate">{member.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </p>
      </div>
    </aside>
  );
}
