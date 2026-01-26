import { create } from 'zustand';
import type { GameSession, GameResult } from '../types/game.types';
import { storage } from '../utils/storage.utils';
import { formatDate, formatTime } from '../utils/date.utils';
import { v4 as uuidv4 } from 'uuid';

interface GameStore {
  session: GameSession | null;
  results: GameResult[];

  // Actions
  loadSession: () => void;
  createSession: (player1Name: string, player2Name: string) => void;
  recordWin: (winnerId: 1 | 2, points: number, scoringCriteria: any[]) => void;
  startOver: () => void; // Reset scores but keep player names
  resetGame: () => void; // Clear everything and go back to setup
}

export const useGameStore = create<GameStore>((set, get) => ({
  session: null,
  results: [],

  loadSession: () => {
    const session = storage.getGameSession();
    const results = storage.getGameResults();
    set({ session, results });
  },

  createSession: (player1Name: string, player2Name: string) => {
    const now = new Date().toISOString();
    const session: GameSession = {
      player1_name: player1Name,
      player1_total_points: 0,
      player1_win_count: 0,
      player2_name: player2Name,
      player2_total_points: 0,
      player2_win_count: 0,
      current_game_number: 1,
      created_at: now,
      updated_at: now,
    };

    storage.saveGameSession(session);
    storage.clearGameResults();
    set({ session, results: [] });
  },

  recordWin: (winnerId: 1 | 2, points: number, scoringCriteria: any[]) => {
    const { session } = get();
    if (!session) return;

    const now = new Date();
    const winnerName = winnerId === 1 ? session.player1_name : session.player2_name;

    // Create game result
    const result: GameResult = {
      id: uuidv4(),
      game_number: session.current_game_number,
      winner_player_number: winnerId,
      winner_name: winnerName,
      points,
      scoring_criteria: scoringCriteria,
      timestamp: now.toISOString(),
      date: formatDate(now),
      time: formatTime(now),
    };

    // Update session
    const updatedSession: GameSession = {
      ...session,
      player1_total_points:
        winnerId === 1 ? session.player1_total_points + points : session.player1_total_points,
      player1_win_count:
        winnerId === 1 ? (session.player1_win_count || 0) + 1 : (session.player1_win_count || 0),
      player2_total_points:
        winnerId === 2 ? session.player2_total_points + points : session.player2_total_points,
      player2_win_count:
        winnerId === 2 ? (session.player2_win_count || 0) + 1 : (session.player2_win_count || 0),
      current_game_number: session.current_game_number + 1,
      updated_at: now.toISOString(),
    };

    // Save to localStorage
    storage.saveGameResult(result);
    storage.saveGameSession(updatedSession);

    // Update state
    set({
      session: updatedSession,
      results: [...get().results, result]
    });
  },

  startOver: () => {
    const { session } = get();
    if (!session) return;

    const now = new Date().toISOString();
    const newSession: GameSession = {
      player1_name: session.player1_name,
      player1_total_points: 0,
      player1_win_count: 0,
      player2_name: session.player2_name,
      player2_total_points: 0,
      player2_win_count: 0,
      current_game_number: 1,
      created_at: now,
      updated_at: now,
    };

    storage.saveGameSession(newSession);
    storage.clearGameResults();
    set({ session: newSession, results: [] });
  },

  resetGame: () => {
    storage.clearAll();
    set({ session: null, results: [] });
  },
}));
