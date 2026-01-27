import type { ScoringCriterion } from './game.types';

export interface ScoringCategory {
  name: string;
  criteria: ScoringCriterion[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface TempScoring {
  selectedCriteria: ScoringCriterion[];
  totalPoints: number;
  winnerId: 1 | 2 | null;
}
