import { create } from 'zustand';
import { User, db } from '../db/db';

interface AppState {
  currentUser: User | null;
  currentPage: string;
  themeMode: 'light' | 'dark';
  dbRevision: number;
  login: (username: string, role: 'admin' | 'manager' | 'sales' | 'accountant') => void;
  logout: () => void;
  setPage: (page: string) => void;
  toggleTheme: () => void;
  triggerDbUpdate: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: (() => {
    const saved = localStorage.getItem('dc_current_user');
    return saved ? JSON.parse(saved) : null;
  })(),
  currentPage: 'dashboard',
  themeMode: (localStorage.getItem('dc_theme_mode') as 'light' | 'dark') || 'dark',
  dbRevision: 0,

  login: (username: string, role: 'admin' | 'manager' | 'sales' | 'accountant') => {
    const user: User = {
      id: `user-${role}`,
      username,
      name: username.charAt(0).toUpperCase() + username.slice(1) + ` (${role.toUpperCase()})`,
      role
    };
    localStorage.setItem('dc_current_user', JSON.stringify(user));
    set({ currentUser: user, currentPage: 'dashboard' });
  },

  logout: () => {
    localStorage.removeItem('dc_current_user');
    set({ currentUser: null, currentPage: 'dashboard' });
  },

  setPage: (page: string) => set({ currentPage: page }),

  toggleTheme: () => set((state) => {
    const nextMode = state.themeMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('dc_theme_mode', nextMode);
    return { themeMode: nextMode };
  }),

  triggerDbUpdate: () => set((state) => ({ dbRevision: state.dbRevision + 1 }))
}));
