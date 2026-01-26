import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGameStore } from './stores/gameStore';
import SetupPage from './pages/SetupPage';
import MainPage from './pages/MainPage';
import ScoringPage from './pages/ScoringPage';
import ConfirmationPage from './pages/ConfirmationPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const session = useGameStore((state) => state.session);
  const loadSession = useGameStore((state) => state.loadSession);

  useEffect(() => {
    loadSession();
    setIsLoading(false);
  }, [loadSession]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1B5E20]">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={session ? <Navigate to="/main" replace /> : <SetupPage />}
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
