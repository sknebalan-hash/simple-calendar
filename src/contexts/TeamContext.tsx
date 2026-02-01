import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { TeamMember } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/id';

type TeamAction =
  | { type: 'ADD_MEMBER'; payload: Omit<TeamMember, 'id' | 'createdAt'> }
  | { type: 'UPDATE_MEMBER'; payload: { id: string; name: string; color: string } }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'LOAD_MEMBERS'; payload: TeamMember[] };

interface TeamState {
  members: TeamMember[];
}

interface TeamContextType extends TeamState {
  addMember: (name: string, color: string) => void;
  updateMember: (id: string, name: string, color: string) => void;
  deleteMember: (id: string) => void;
  getMemberById: (id: string | null) => TeamMember | undefined;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const teamReducer = (state: TeamState, action: TeamAction): TeamState => {
  switch (action.type) {
    case 'ADD_MEMBER': {
      const newMember: TeamMember = {
        id: generateId(),
        name: action.payload.name,
        color: action.payload.color,
        createdAt: new Date().toISOString(),
      };
      return { ...state, members: [...state.members, newMember] };
    }
    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.payload.id
            ? { ...m, name: action.payload.name, color: action.payload.color }
            : m
        ),
      };
    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.payload ? { ...m, deletedAt: new Date().toISOString() } : m
        ),
      };
    case 'LOAD_MEMBERS':
      return { ...state, members: action.payload };
    default:
      return state;
  }
};

export function TeamProvider({ children }: { children: ReactNode }) {
  const [storedMembers, setStoredMembers] = useLocalStorage<TeamMember[]>('team-members', []);
  const [state, dispatch] = useReducer(teamReducer, { members: storedMembers });

  useEffect(() => {
    setStoredMembers(state.members);
  }, [state.members, setStoredMembers]);

  const addMember = (name: string, color: string) => {
    dispatch({ type: 'ADD_MEMBER', payload: { name, color } });
  };

  const updateMember = (id: string, name: string, color: string) => {
    dispatch({ type: 'UPDATE_MEMBER', payload: { id, name, color } });
  };

  const deleteMember = (id: string) => {
    dispatch({ type: 'DELETE_MEMBER', payload: id });
  };

  const getMemberById = (id: string | null) => {
    if (!id) return undefined;
    return state.members.find((m) => m.id === id);
  };

  const activeMembers = state.members.filter((m) => !m.deletedAt);

  return (
    <TeamContext.Provider
      value={{
        members: activeMembers,
        addMember,
        updateMember,
        deleteMember,
        getMemberById,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
