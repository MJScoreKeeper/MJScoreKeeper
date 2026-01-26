import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import PlayerCard from '../components/game/PlayerCard';
import GameHeader from '../components/game/GameHeader';
import RecordWinButton from '../components/game/RecordWinButton';

export default function MainPage() {
  const session = useGameStore((state) => state.session);
  const loadSession = useGameStore((state) => state.loadSession);
  const startOver = useGameStore((state) => state.startOver);
  const resetGame = useGameStore((state) => state.resetGame);
  const navigate = useNavigate();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (!session) {
    return null; // Will redirect to setup page
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
      <div className="bg-[#1B5E20] text-white py-4 px-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Mahjong KS</h1>
          <button
            onClick={handleResetGame}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Game Number */}
        <GameHeader gameNumber={session.current_game_number} />

        {/* Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="pt-4">
          <RecordWinButton onClick={handleRecordWin} />
        </div>

        {/* Start Over Button */}
        <div className="pt-2">
          <button
            onClick={handleStartOver}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition-all duration-200"
            style={{ minHeight: '48px' }}
          >
            Start Over (Reset Scores)
          </button>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 pt-2">
          <p>Started: {new Date(session.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
