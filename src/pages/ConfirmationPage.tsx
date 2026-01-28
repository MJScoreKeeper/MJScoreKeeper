import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useScoringStore } from '../stores/scoringStore';
import { useThemeStore } from '../stores/themeStore';
import { calculatePayout } from '../utils/payout.utils';
import ConfirmationSummary from '../components/scoring/ConfirmationSummary';
import MahjongBackground from '../components/MahjongBackground';

function CelebrationEffect() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: '-10px',
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function ConfirmationPage() {
  const [showCelebration, setShowCelebration] = useState(false);
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
  const payout = calculatePayout(totalPoints);
  const winnerName = winnerId === 1 ? session.player1_name : session.player2_name;

  const handleConfirm = () => {
    // Show celebration
    setShowCelebration(true);

    // Record the win
    recordWin(winnerId, totalPoints, selectedCriteria);

    // Reset scoring store
    resetScoring();

    // Navigate back to main page after celebration
    setTimeout(() => {
      navigate('/main');
    }, 1500);
  };

  const handleBack = () => {
    navigate('/scoring');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Celebration Effect */}
      {showCelebration && <CelebrationEffect />}

      {/* Mahjong Background */}
      <MahjongBackground opacity={0.08} color="#9CA3AF" />

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
          payout={payout}
        />

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleConfirm}
            disabled={showCelebration}
            className="w-full text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70"
            style={{
              minHeight: '56px',
              backgroundColor: theme.primary,
            }}
            onMouseOver={(e) => !showCelebration && (e.currentTarget.style.backgroundColor = theme.primaryHover)}
            onMouseOut={(e) => !showCelebration && (e.currentTarget.style.backgroundColor = theme.primary)}
          >
            {showCelebration ? 'Recorded!' : 'Confirm & Save'}
          </button>
          <button
            onClick={handleBack}
            disabled={showCelebration}
            className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
            style={{
              minHeight: '48px',
              backgroundColor: `${theme.primary}80`,
            }}
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
