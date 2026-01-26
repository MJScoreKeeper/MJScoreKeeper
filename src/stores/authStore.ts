import { create } from 'zustand';
import { supabase } from '../config/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        set({ isLoading: false, error: error.message });
        return;
      }

      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Clear localStorage game data on new registration
      localStorage.removeItem('mahjong-game-session');
      localStorage.removeItem('mahjong-game-results');

      set({
        session: data.session,
        user: data.user,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Clear localStorage game data on login (fresh start)
      localStorage.removeItem('mahjong-game-session');
      localStorage.removeItem('mahjong-game-results');

      set({
        session: data.session,
        user: data.user,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  signOut: async () => {
    set({ isLoading: true });

    try {
      await supabase.auth.signOut();

      // Clear localStorage game data on logout
      localStorage.removeItem('mahjong-game-session');
      localStorage.removeItem('mahjong-game-results');

      set({
        session: null,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
