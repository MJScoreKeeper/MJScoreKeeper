import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useThemeStore } from '../stores/themeStore';
import { useHistoryStore } from '../stores/historyStore';
import PlayerCard from '../components/game/PlayerCard';
import GameHeader from '../components/game/GameHeader';
import RecordWinButton from '../components/game/RecordWinButton';
import MahjongBackground from '../components/MahjongBackground';

export default function MainPage() {
  const [isSaving, setIsSaving] = useState(false);
  const session = useGameStore((state) => state.session);
  const loadSession = useGameStore((state) => state.loadSession);
  const startOver = useGameStore((state) => state.startOver);
  const resetGame = useGameStore((state) => state.resetGame);
  const recordDraw = useGameStore((state) => state.recordDraw);
  const { theme, loadTheme } = useThemeStore();
  const saveMatch = useHistoryStore((state) => state.saveMatch);
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

  // Determine who is leading
  const player1Leading = session.player1_total_points > session.player2_total_points;
  const player2Leading = session.player2_total_points > session.player1_total_points;

  const handleRecordWin = () => {
    navigate('/scoring');
  };

  const handleDraw = () => {
    if (window.confirm('Record this game as a draw? No points will be awarded.')) {
      recordDraw();
    }
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

  const handleEndMatch = async () => {
    if (!session) return;

    const totalGames = session.current_game_number - 1;
    if (totalGames === 0) {
      window.alert('No games have been played yet.');
      return;
    }

    // Determine winner
    let winnerName: string | null = null;
    if (session.player1_total_points > session.player2_total_points) {
      winnerName = session.player1_name;
    } else if (session.player2_total_points > session.player1_total_points) {
      winnerName = session.player2_name;
    }
    // If tied, winner_name stays null

    const confirmMessage = winnerName
      ? `End match? ${winnerName} wins!\n\nThis will save the match to history and start a new match.`
      : `End match? It's a tie!\n\nThis will save the match to history and start a new match.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSaving(true);
    const result = await saveMatch({
      player1_name: session.player1_name,
      player2_name: session.player2_name,
      player1_total_points: session.player1_total_points,
      player2_total_points: session.player2_total_points,
      total_games: totalGames,
      winner_name: winnerName,
    });
    setIsSaving(false);

    if (result.success) {
      resetGame();
      navigate('/');
    } else {
      window.alert(`Failed to save match: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      {/* Mahjong Background */}
      <MahjongBackground opacity={0.08} color="#9CA3AF" />

      {/* Header */}
      <div
        className="text-white py-4 px-4 shadow-lg relative z-10"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">MJ ScoreKeeper</h1>
          <button
            onClick={handleResetGame}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
          >
            New Match
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 relative z-10">
        {/* Game Number */}
        <GameHeader gameNumber={session.current_game_number} />

        {/* Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PlayerCard
            name={session.player1_name}
            totalPoints={session.player1_total_points}
            winCount={session.player1_win_count || 0}
            playerNumber={1}
            isLeading={player1Leading}
          />
          <PlayerCard
            name={session.player2_name}
            totalPoints={session.player2_total_points}
            winCount={session.player2_win_count || 0}
            playerNumber={2}
            isLeading={player2Leading}
          />
        </div>

        {/* Record Win Button */}
        <RecordWinButton onClick={handleRecordWin} />

        {/* Draw Button */}
        <button
          onClick={handleDraw}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow transition-all duration-200"
          style={{ minHeight: '48px' }}
        >
          Draw (No Winner)
        </button>

        {/* Start Over Button */}
        <button
          onClick={handleStartOver}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition-all duration-200"
          style={{ minHeight: '48px' }}
        >
          Start Over (Reset Scores)
        </button>

        {/* End Match Button */}
        <button
          onClick={handleEndMatch}
          disabled={isSaving}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: '48px' }}
        >
          {isSaving ? 'Saving...' : 'End Match & Save to History'}
        </button>
      </div>
    </div>
  );
}
