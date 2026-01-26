import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useThemeStore } from '../stores/themeStore';
import { THEMES } from '../constants/themes';
import type { ThemeId } from '../constants/themes';
import PlayerCard from '../components/game/PlayerCard';
import GameHeader from '../components/game/GameHeader';
import RecordWinButton from '../components/game/RecordWinButton';

export default function MainPage() {
  const session = useGameStore((state) => state.session);
  const loadSession = useGameStore((state) => state.loadSession);
  const startOver = useGameStore((state) => state.startOver);
  const resetGame = useGameStore((state) => state.resetGame);
  const { theme, setTheme, loadTheme } = useThemeStore();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

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

  const handleThemeChange = (themeId: ThemeId) => {
    setTheme(themeId);
    setShowSettings(false);
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded transition"
              aria-label="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={handleResetGame}
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition"
            >
              New Match
            </button>
          </div>
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Theme
              </label>
              <div className="space-y-2">
                {(Object.keys(THEMES) as ThemeId[]).map((themeId) => (
                  <button
                    key={themeId}
                    onClick={() => handleThemeChange(themeId)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                      theme.id === themeId
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: THEMES[themeId].primary }}
                    />
                    <span className="font-medium text-gray-900">
                      {THEMES[themeId].name}
                    </span>
                    {theme.id === themeId && (
                      <svg className="ml-auto h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
