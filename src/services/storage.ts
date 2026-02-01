import type { AppState } from '../types';

const STORAGE_KEY = 'office-chore-manager';
const CURRENT_VERSION = 1;

interface StorageSchema {
  version: number;
  data: AppState;
}

export const getDefaultState = (): AppState => ({
  chores: [],
  choreInstances: [],
  teamMembers: [],
  settings: {
    defaultView: 'month',
    workWeekOnly: false,
  },
});

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();

    const stored: StorageSchema = JSON.parse(raw);
    return migrate(stored);
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return getDefaultState();
  }
};

export const saveState = (state: AppState): void => {
  try {
    const schema: StorageSchema = {
      version: CURRENT_VERSION,
      data: state,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

const migrate = (stored: StorageSchema): AppState => {
  if (stored.version === CURRENT_VERSION) {
    return stored.data;
  }
  return stored.data;
};
