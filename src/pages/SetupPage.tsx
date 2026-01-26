import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useThemeStore } from '../stores/themeStore';

export default function SetupPage() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [error, setError] = useState('');

  const createSession = useGameStore((state) => state.createSession);
  const { theme, loadTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!player1Name.trim() || !player2Name.trim()) {
      setError('Both player names are required');
      return;
    }

    if (player1Name.trim() === player2Name.trim()) {
      setError('Player names must be different');
      return;
    }

    // Create session and navigate
    createSession(player1Name.trim(), player2Name.trim());
    navigate('/main');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `linear-gradient(to bottom, ${theme.primary}, ${theme.primaryHover})`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.primary }}>Mahjong KS</h1>
            <p className="text-gray-600">Hong Kong Mahjong Scorer</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="player1" className="block text-sm font-medium text-gray-700 mb-2">
                Player 1 Name
              </label>
              <input
                type="text"
                id="player1"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
                placeholder="Enter player 1 name"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="player2" className="block text-sm font-medium text-gray-700 mb-2">
                Player 2 Name
              </label>
              <input
                type="text"
                id="player2"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
                placeholder="Enter player 2 name"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full text-white font-semibold py-4 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              style={{
                minHeight: '44px',
                backgroundColor: theme.primary,
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.primary}
            >
              Start Game
            </button>
          </form>
        </div>

        <p className="text-center text-white text-sm mt-6">
          Start tracking your Mahjong games
        </p>
      </div>
    </div>
  );
}
