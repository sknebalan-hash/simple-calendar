import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Chore, ChoreInstance, RecurrenceRule } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/id';
import { formatDateISO } from '../utils/date';

type ChoreAction =
  | { type: 'ADD_CHORE'; payload: Omit<Chore, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_CHORE'; payload: Chore }
  | { type: 'DELETE_CHORE'; payload: string }
  | { type: 'TOGGLE_INSTANCE'; payload: { choreId: string; instanceDate: string; completedBy?: string } }
  | { type: 'LOAD_STATE'; payload: { chores: Chore[]; instances: ChoreInstance[] } };

interface ChoreState {
  chores: Chore[];
  choreInstances: ChoreInstance[];
}

interface ChoreContextType extends ChoreState {
  addChore: (chore: Omit<Chore, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateChore: (chore: Chore) => void;
  deleteChore: (id: string) => void;
  toggleInstance: (choreId: string, instanceDate: Date, completedBy?: string) => void;
  getInstanceStatus: (choreId: string, instanceDate: string) => ChoreInstance | undefined;
  getChoreById: (id: string) => Chore | undefined;
}

const ChoreContext = createContext<ChoreContextType | undefined>(undefined);

const choreReducer = (state: ChoreState, action: ChoreAction): ChoreState => {
  switch (action.type) {
    case 'ADD_CHORE': {
      const now = new Date().toISOString();
      const newChore: Chore = {
        id: generateId(),
        ...action.payload,
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, chores: [...state.chores, newChore] };
    }
    case 'UPDATE_CHORE':
      return {
        ...state,
        chores: state.chores.map((c) =>
          c.id === action.payload.id
            ? { ...action.payload, updatedAt: new Date().toISOString() }
            : c
        ),
      };
    case 'DELETE_CHORE':
      return {
        ...state,
        chores: state.chores.map((c) =>
          c.id === action.payload ? { ...c, deletedAt: new Date().toISOString() } : c
        ),
      };
    case 'TOGGLE_INSTANCE': {
      const { choreId, instanceDate, completedBy } = action.payload;
      const existingInstance = state.choreInstances.find(
        (i) => i.choreId === choreId && i.instanceDate === instanceDate
      );

      if (existingInstance) {
        return {
          ...state,
          choreInstances: state.choreInstances.map((i) =>
            i.choreId === choreId && i.instanceDate === instanceDate
              ? {
                  ...i,
                  isCompleted: !i.isCompleted,
                  completedAt: !i.isCompleted ? new Date().toISOString() : undefined,
                  completedBy: !i.isCompleted ? completedBy : undefined,
                }
              : i
          ),
        };
      }

      const newInstance: ChoreInstance = {
        choreId,
        instanceDate,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        completedBy,
      };
      return { ...state, choreInstances: [...state.choreInstances, newInstance] };
    }
    case 'LOAD_STATE':
      return { chores: action.payload.chores, choreInstances: action.payload.instances };
    default:
      return state;
  }
};

export function ChoreProvider({ children }: { children: ReactNode }) {
  const [storedChores, setStoredChores] = useLocalStorage<Chore[]>('chores', []);
  const [storedInstances, setStoredInstances] = useLocalStorage<ChoreInstance[]>('chore-instances', []);
  const [state, dispatch] = useReducer(choreReducer, {
    chores: storedChores,
    choreInstances: storedInstances,
  });

  useEffect(() => {
    setStoredChores(state.chores);
  }, [state.chores, setStoredChores]);

  useEffect(() => {
    setStoredInstances(state.choreInstances);
  }, [state.choreInstances, setStoredInstances]);

  const addChore = (chore: Omit<Chore, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_CHORE', payload: chore });
  };

  const updateChore = (chore: Chore) => {
    dispatch({ type: 'UPDATE_CHORE', payload: chore });
  };

  const deleteChore = (id: string) => {
    dispatch({ type: 'DELETE_CHORE', payload: id });
  };

  const toggleInstance = (choreId: string, instanceDate: Date, completedBy?: string) => {
    dispatch({
      type: 'TOGGLE_INSTANCE',
      payload: { choreId, instanceDate: formatDateISO(instanceDate), completedBy },
    });
  };

  const getInstanceStatus = (choreId: string, instanceDate: string) => {
    return state.choreInstances.find(
      (i) => i.choreId === choreId && i.instanceDate === instanceDate
    );
  };

  const getChoreById = (id: string) => {
    return state.chores.find((c) => c.id === id);
  };

  const activeChores = state.chores.filter((c) => !c.deletedAt);

  return (
    <ChoreContext.Provider
      value={{
        chores: activeChores,
        choreInstances: state.choreInstances,
        addChore,
        updateChore,
        deleteChore,
        toggleInstance,
        getInstanceStatus,
        getChoreById,
      }}
    >
      {children}
    </ChoreContext.Provider>
  );
}

export function useChores() {
  const context = useContext(ChoreContext);
  if (context === undefined) {
    throw new Error('useChores must be used within a ChoreProvider');
  }
  return context;
}
