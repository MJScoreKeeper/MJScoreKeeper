import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { storage } from '../utils/storage.utils';
import { THEMES } from '../constants/themes';
import type { ThemeId } from '../constants/themes';
import MahjongBackground from '../components/MahjongBackground';

type MenuView = 'menu' | 'profile' | 'theme' | 'about';

export default function SetupPage() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('menu');

  // Profile editing state
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const createSession = useGameStore((state) => state.createSession);
  const { theme, setTheme, loadTheme } = useThemeStore();
  const { user, signOut, updateProfile, updateEmail, updatePassword } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for autoStart from navigation state (same players new match)
  useEffect(() => {
    const state = location.state as { player1?: string; player2?: string; autoStart?: boolean } | null;
    if (state?.autoStart && state.player1 && state.player2) {
      // Auto-start new match with same players
      createSession(state.player1, state.player2);
      navigate('/main', { replace: true });
    }
  }, [location.state, createSession, navigate]);

  useEffect(() => {
    loadTheme();
    // Load last used player names
    const lastNames = storage.getLastPlayerNames();
    if (lastNames) {
      setPlayer1Name(lastNames.player1);
      setPlayer2Name(lastNames.player2);
    }
  }, [loadTheme]);

  useEffect(() => {
    if (user) {
      setEditDisplayName(user.user_metadata?.display_name || '');
      setEditEmail(user.email || '');
    }
  }, [user]);

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
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setShowSettings(false);
      await signOut();
    }
  };

  const handleViewHistory = () => {
    setShowSettings(false);
    navigate('/history');
  };

  const openSettings = () => {
    setMenuView('menu');
    setProfileMessage('');
    setProfileError('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowSettings(true);
  };

  const handleUpdateDisplayName = async () => {
    if (!editDisplayName.trim()) {
      setProfileError('Display name cannot be empty');
      return;
    }
    setIsUpdating(true);
    setProfileError('');
    setProfileMessage('');
    const result = await updateProfile(editDisplayName.trim());
    setIsUpdating(false);
    if (result.success) {
      setProfileMessage('Display name updated successfully');
    } else {
      setProfileError(result.error || 'Failed to update display name');
    }
  };

  const handleUpdateEmail = async () => {
    if (!editEmail.trim()) {
      setProfileError('Email cannot be empty');
      return;
    }
    setIsUpdating(true);
    setProfileError('');
    setProfileMessage('');
    const result = await updateEmail(editEmail.trim());
    setIsUpdating(false);
    if (result.success) {
      setProfileMessage('Email update requested. Check your inbox to confirm.');
    } else {
      setProfileError(result.error || 'Failed to update email');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      setProfileError('New password cannot be empty');
      return;
    }
    if (newPassword.length < 6) {
      setProfileError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setProfileError('Passwords do not match');
      return;
    }
    setIsUpdating(true);
    setProfileError('');
    setProfileMessage('');
    const result = await updatePassword(newPassword);
    setIsUpdating(false);
    if (result.success) {
      setProfileMessage('Password updated successfully');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setProfileError(result.error || 'Failed to update password');
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
      {/* Mahjong Background */}
      <MahjongBackground opacity={0.08} />

      {/* Top Bar - User Info & Settings */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="bg-white/20 px-3 py-2 rounded-lg">
            <span className="text-white text-sm">Hi, {displayName}</span>
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={openSettings}
          className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: theme.primary }}>MJ ScoreKeeper</h1>
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
              Start Match
            </button>
          </form>
        </div>
      </div>

      {/* Menu Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 border-b">
              <div className="flex justify-between items-center">
                {menuView === 'menu' ? (
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                ) : (
                  <button
                    onClick={() => { setMenuView('menu'); setProfileMessage(''); setProfileError(''); }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">Back</span>
                  </button>
                )}
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {menuView !== 'menu' && (
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  {menuView === 'profile' && 'Profile'}
                  {menuView === 'theme' && 'Theme'}
                  {menuView === 'about' && 'About'}
                </h2>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* Menu List */}
              {menuView === 'menu' && (
                <div className="space-y-1">
                  <button
                    onClick={() => { setMenuView('profile'); setProfileMessage(''); setProfileError(''); }}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium text-gray-900">Profile</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setMenuView('theme')}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <span className="font-medium text-gray-900">Theme</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleViewHistory}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-gray-900">Match History</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setMenuView('about')}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-gray-900">About</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium text-red-600">Sign Out</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Profile Panel */}
              {menuView === 'profile' && (
                <div className="space-y-6">
                  {/* Status Messages */}
                  {profileMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                      {profileMessage}
                    </div>
                  )}
                  {profileError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                      {profileError}
                    </div>
                  )}

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter display name"
                      />
                      <button
                        onClick={handleUpdateDisplayName}
                        disabled={isUpdating}
                        className="px-3 py-2 text-white text-sm rounded-lg disabled:opacity-50"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter email"
                      />
                      <button
                        onClick={handleUpdateEmail}
                        disabled={isUpdating}
                        className="px-3 py-2 text-white text-sm rounded-lg disabled:opacity-50"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Change Password
                    </label>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="New password"
                      />
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Confirm new password"
                      />
                      <button
                        onClick={handleUpdatePassword}
                        disabled={isUpdating}
                        className="w-full px-3 py-2 text-white text-sm rounded-lg disabled:opacity-50"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme Panel */}
              {menuView === 'theme' && (
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
              )}

              {/* About Panel */}
              {menuView === 'about' && (
                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p>
                    MJ ScoreKeeper tracks scores (番), payout amounts ($), and net money total.
                  </p>

                  {/* Payout Reference */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Payout Reference (一二蚊)</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-2 text-left font-medium text-gray-600">番</th>
                            <th className="px-4 py-2 text-right font-medium text-gray-600">Payout</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">3番</td>
                            <td className="px-4 py-2 text-right font-medium">$32</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">4番</td>
                            <td className="px-4 py-2 text-right font-medium">$64</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">5番</td>
                            <td className="px-4 py-2 text-right font-medium">$128</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">6番</td>
                            <td className="px-4 py-2 text-right font-medium">$256</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">7番</td>
                            <td className="px-4 py-2 text-right font-medium">$512</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2">8+番</td>
                            <td className="px-4 py-2 text-right font-medium">$1,024 <span className="text-gray-400 text-xs">(capped)</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
