import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import { useThemeStore } from './stores/themeStore';
import { useAuthStore } from './stores/authStore';
import AuthPage from './pages/AuthPage';
import SetupPage from './pages/SetupPage';
import MainPage from './pages/MainPage';
import ScoringPage from './pages/ScoringPage';
import ConfirmationPage from './pages/ConfirmationPage';

function App() {
  const gameSession = useGameStore((state) => state.session);
  const loadGameSession = useGameStore((state) => state.loadSession);
  const { theme, loadTheme } = useThemeStore();
  const { user, isLoading: authLoading, initialize: initAuth } = useAuthStore();

  useEffect(() => {
    loadTheme();
    initAuth();
  }, [loadTheme, initAuth]);

  useEffect(() => {
    // Only load game session if user is authenticated
    if (user) {
      loadGameSession();
    }
  }, [user, loadGameSession]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  // Not authenticated - show auth page
  if (!user) {
    return <AuthPage />;
  }

  // Authenticated - show app
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={gameSession ? <Navigate to="/main" replace /> : <SetupPage />}
        />
        <Route path="/main" element={<MainPage />} />
        <Route path="/scoring" element={<ScoringPage />} />
        <Route path="/confirm" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
