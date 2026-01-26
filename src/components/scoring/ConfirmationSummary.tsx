import type { ScoringCriterion } from '../../types/game.types';
import { useScoringStore } from '../../stores/scoringStore';
import { useThemeStore } from '../../stores/themeStore';

interface ConfirmationSummaryProps {
  winnerName: string;
  criteria: ScoringCriterion[];
  totalPoints: number;
}

export default function ConfirmationSummary({
  winnerName,
  criteria,
  totalPoints,
}: ConfirmationSummaryProps) {
  const otherPoints = useScoringStore((state) => state.otherPoints);
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Winner */}
      <div className="text-center mb-6 pb-6 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Winner</p>
        <h2 className="text-3xl font-bold" style={{ color: theme.primary }}>{winnerName}</h2>
      </div>

      {/* Scoring Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Scoring Breakdown</h3>
        {criteria.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No scoring criteria selected</p>
        ) : (
          <div className="space-y-2">
            {criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{criterion.name}</span>
                <span className="font-semibold" style={{ color: theme.primary }}>
                  {criterion.id === 'other' ? otherPoints : criterion.points} 番
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div
        className="text-white rounded-lg p-6 text-center"
        style={{ backgroundColor: theme.primary }}
      >
        <p className="text-sm opacity-90 mb-1">Total Points</p>
        <p className="text-5xl font-bold">{totalPoints}</p>
        <p className="text-sm opacity-90 mt-1">番</p>
      </div>
    </div>
  );
}
