import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { THEMES } from '../constants/themes';
import type { ThemeId } from '../constants/themes';
import MahjongBackground from '../components/MahjongBackground';

type SettingsTab = 'theme' | 'profile';

export default function SetupPage() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('theme');

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

  useEffect(() => {
    loadTheme();
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
    setSettingsTab('theme');
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
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
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setSettingsTab('theme'); setProfileMessage(''); setProfileError(''); }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                    settingsTab === 'theme'
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={settingsTab === 'theme' ? { backgroundColor: theme.primary } : {}}
                >
                  Theme
                </button>
                <button
                  onClick={() => { setSettingsTab('profile'); setProfileMessage(''); setProfileError(''); }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                    settingsTab === 'profile'
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={settingsTab === 'profile' ? { backgroundColor: theme.primary } : {}}
                >
                  Profile
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {settingsTab === 'theme' && (
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

              {settingsTab === 'profile' && (
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
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white p-4 border-t space-y-2">
              <button
                onClick={handleViewHistory}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Match History
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
