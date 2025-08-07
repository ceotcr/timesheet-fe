import { create } from 'zustand';
import { AuthUser } from '@/types';

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
