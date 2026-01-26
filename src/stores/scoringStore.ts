import { create } from 'zustand';
import type { ScoringCriterion } from '../types/game.types';

interface ScoringStore {
  selectedCriteria: ScoringCriterion[];
  winnerId: 1 | 2 | null;
  otherPoints: number;

  // Actions
  toggleCriterion: (criterion: ScoringCriterion) => void;
  setWinner: (id: 1 | 2) => void;
  setOtherPoints: (points: number) => void;
  getTotalPoints: () => number;
  reset: () => void;
}

export const useScoringStore = create<ScoringStore>((set, get) => ({
  selectedCriteria: [],
  winnerId: null,
  otherPoints: 0,

  toggleCriterion: (criterion: ScoringCriterion) => {
    set((state) => {
      const isSelected = state.selectedCriteria.some((c) => c.id === criterion.id);

      if (isSelected) {
        // Remove criterion
        // If it's the "other" criterion, also reset otherPoints
        if (criterion.id === 'other') {
          return {
            selectedCriteria: state.selectedCriteria.filter((c) => c.id !== criterion.id),
            otherPoints: 0,
          };
        }
        return {
          selectedCriteria: state.selectedCriteria.filter((c) => c.id !== criterion.id),
        };
      } else {
        // Add criterion
        return {
          selectedCriteria: [...state.selectedCriteria, criterion],
        };
      }
    });
  },

  setWinner: (id: 1 | 2) => {
    set({ winnerId: id });
  },

  setOtherPoints: (points: number) => {
    set({ otherPoints: points });
  },

  getTotalPoints: () => {
    const { selectedCriteria, otherPoints } = get();
    // Calculate sum of selected criteria points (excluding "other" which has 0 points)
    const criteriaPoints = selectedCriteria.reduce((total, criterion) => {
      // Skip "other" as we handle it separately
      if (criterion.id === 'other') return total;
      return total + criterion.points;
    }, 0);

    // Check if "other" is selected
    const isOtherSelected = selectedCriteria.some(c => c.id === 'other');

    return criteriaPoints + (isOtherSelected ? otherPoints : 0);
  },

  reset: () => {
    set({ selectedCriteria: [], winnerId: null, otherPoints: 0 });
  },
}));
