import { useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Modal } from '../ui';
import { TeamMemberList } from '../team';

export function Header() {
  const [showTeamModal, setShowTeamModal] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Office Chores</h1>
            </div>
            <button
              onClick={() => setShowTeamModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <UserGroupIcon className="w-5 h-5" />
              <span>Team</span>
            </button>
          </div>
        </div>
      </header>

      <Modal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title="Manage Team"
      >
        <TeamMemberList />
      </Modal>
    </>
  );
}
