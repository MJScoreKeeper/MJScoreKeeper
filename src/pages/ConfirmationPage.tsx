import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useScoringStore } from '../stores/scoringStore';
import { useThemeStore } from '../stores/themeStore';
import ConfirmationSummary from '../components/scoring/ConfirmationSummary';
import MahjongBackground from '../components/MahjongBackground';

export default function ConfirmationPage() {
  const session = useGameStore((state) => state.session);
  const recordWin = useGameStore((state) => state.recordWin);
  const selectedCriteria = useScoringStore((state) => state.selectedCriteria);
  const winnerId = useScoringStore((state) => state.winnerId);
  const getTotalPoints = useScoringStore((state) => state.getTotalPoints);
  const resetScoring = useScoringStore((state) => state.reset);
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || winnerId === null) {
      navigate('/');
    }
  }, [session, winnerId, navigate]);

  if (!session || winnerId === null) {
    return null;
  }

  const totalPoints = getTotalPoints();
  const winnerName = winnerId === 1 ? session.player1_name : session.player2_name;

  const handleConfirm = () => {
    // Record the win
    recordWin(winnerId, totalPoints, selectedCriteria);

    // Reset scoring store
    resetScoring();

    // Navigate back to main page
    navigate('/main');
  };

  const handleBack = () => {
    navigate('/scoring');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Mahjong Background */}
      <MahjongBackground opacity={0.04} color="#9CA3AF" />

      {/* Header */}
      <div
        className="text-white py-4 px-4 shadow-lg relative z-10"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded mb-2 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Confirm Results</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <ConfirmationSummary
          winnerName={winnerName}
          criteria={selectedCriteria}
          totalPoints={totalPoints}
        />

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            style={{
              minHeight: '56px',
              backgroundColor: theme.primary,
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.primary}
          >
            Confirm & Save
          </button>
          <button
            onClick={handleBack}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            style={{ minHeight: '48px' }}
          >
            Edit Scoring
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Game #{session.current_game_number}</p>
        </div>
      </div>
    </div>
  );
}
