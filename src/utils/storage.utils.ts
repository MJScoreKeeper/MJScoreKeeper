import type { GameSession, GameResult } from '../types/game.types';

const STORAGE_KEYS = {
  GAME_SESSION: 'mahjong-game-session',
  GAME_RESULTS: 'mahjong-game-results',
} as const;

export const storage = {
  // Game Session
  saveGameSession(session: GameSession): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save game session:', error);
    }
  },

  getGameSession(): GameSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get game session:', error);
      return null;
    }
  },

  clearGameSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_SESSION);
    } catch (error) {
      console.error('Failed to clear game session:', error);
    }
  },

  // Game Results
  saveGameResult(result: GameResult): void {
    try {
      const results = this.getGameResults();
      results.push(result);
      localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(results));
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  },

  getGameResults(): GameResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get game results:', error);
      return [];
    }
  },

  clearGameResults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_RESULTS);
    } catch (error) {
      console.error('Failed to clear game results:', error);
    }
  },

  clearAll(): void {
    this.clearGameSession();
    this.clearGameResults();
  },
};
