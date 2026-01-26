import type { ScoringCriterion } from '../types/game.types';

export const calculateTotalPoints = (criteria: ScoringCriterion[]): number => {
  return criteria.reduce((total, criterion) => total + criterion.points, 0);
};
