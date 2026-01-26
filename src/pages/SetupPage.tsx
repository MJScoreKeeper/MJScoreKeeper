import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { THEMES } from '../constants/themes';
import type { ThemeId } from '../constants/themes';

export default function SetupPage() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const createSession = useGameStore((state) => state.createSession);
  const { theme, setTheme, loadTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
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

  const handleThemeChange = (themeId: ThemeId) => {
    setTheme(themeId);
    setShowSettings(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        background: `linear-gradient(to bottom, ${theme.primary}, ${theme.primaryHover})`,
      }}
    >
      {/* Top Bar - User Info & Settings */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="bg-white/20 px-3 py-2 rounded-lg">
            <span className="text-white text-sm">Hi, {displayName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition text-white text-sm"
          >
            Sign Out
          </button>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

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
