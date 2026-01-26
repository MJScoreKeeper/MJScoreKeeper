import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useThemeStore } from '../stores/themeStore';
import PlayerCard from '../components/game/PlayerCard';
import GameHeader from '../components/game/GameHeader';
import RecordWinButton from '../components/game/RecordWinButton';

export default function MainPage() {
  const session = useGameStore((state) => state.session);
  const loadSession = useGameStore((state) => state.loadSession);
  const startOver = useGameStore((state) => state.startOver);
  const resetGame = useGameStore((state) => state.resetGame);
  const { theme, loadTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadSession();
    loadTheme();
  }, [loadSession, loadTheme]);

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  const handleRecordWin = () => {
    navigate('/scoring');
  };

  const handleStartOver = () => {
    if (window.confirm('Start over? This will reset all scores and game number to 1.')) {
      startOver();
    }
  };

  const handleResetGame = () => {
    if (window.confirm('Reset completely? This will clear all data and return to the setup screen.')) {
      resetGame();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div
        className="text-white py-4 px-4 shadow-lg"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Mahjong KS</h1>
          <button
            onClick={handleResetGame}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
          >
            New Match
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {/* Game Number */}
        <GameHeader gameNumber={session.current_game_number} />

        {/* Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PlayerCard
            name={session.player1_name}
            totalPoints={session.player1_total_points}
            winCount={session.player1_win_count || 0}
            playerNumber={1}
          />
          <PlayerCard
            name={session.player2_name}
            totalPoints={session.player2_total_points}
            winCount={session.player2_win_count || 0}
            playerNumber={2}
          />
        </div>

        {/* Record Win Button */}
        <RecordWinButton onClick={handleRecordWin} />

        {/* Start Over Button */}
        <button
          onClick={handleStartOver}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition-all duration-200"
          style={{ minHeight: '48px' }}
        >
          Start Over (Reset Scores)
        </button>
      </div>
    </div>
  );
}
