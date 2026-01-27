import { create } from 'zustand';
import { supabase } from '../config/supabase';
import { useAuthStore } from './authStore';

export interface MatchHistory {
  id: string;
  user_id: string;
  player1_name: string;
  player2_name: string;
  player1_total_points: number;
  player2_total_points: number;
  total_games: number;
  draw_count?: number;
  winner_name: string | null;
  created_at: string;
  ended_at: string;
}

interface HistoryState {
  matches: MatchHistory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMatches: () => Promise<void>;
  saveMatch: (match: Omit<MatchHistory, 'id' | 'user_id' | 'created_at' | 'ended_at'>) => Promise<{ success: boolean; error?: string }>;
  deleteMatch: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  matches: [],
  isLoading: false,
  error: null,

  fetchMatches: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('match_history')
        .select('*')
        .eq('user_id', user.id)
        .order('ended_at', { ascending: false });

      if (error) {
        set({ isLoading: false, error: error.message });
        return;
      }

      set({ matches: data || [], isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch matches';
      set({ isLoading: false, error: message });
    }
  },

  saveMatch: async (match) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase
        .from('match_history')
        .insert({
          user_id: user.id,
          player1_name: match.player1_name,
          player2_name: match.player2_name,
          player1_total_points: match.player1_total_points,
          player2_total_points: match.player2_total_points,
          total_games: match.total_games,
          draw_count: match.draw_count ?? 0,
          winner_name: match.winner_name,
        });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Refresh the matches list
      await get().fetchMatches();

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save match';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  deleteMatch: async (id: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase
        .from('match_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Remove from local state
      set((state) => ({
        matches: state.matches.filter((m) => m.id !== id),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete match';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));
