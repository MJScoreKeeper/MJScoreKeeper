export interface GameSession {
  player1_name: string;
  player1_total_points: number;
  player1_win_count: number;
  player2_name: string;
  player2_total_points: number;
  player2_win_count: number;
  current_game_number: number;
  created_at: string;
  updated_at: string;
}

export interface GameResult {
  id: string;
  game_number: number;
  winner_player_number: 1 | 2;
  winner_name: string;
  points: number;
  scoring_criteria: ScoringCriterion[];
  timestamp: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

export interface ScoringCriterion {
  id: string;
  name: string;
  points: number;
  category: string;
}
