import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';

export default function SetupPage() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [error, setError] = useState('');

  const createSession = useGameStore((state) => state.createSession);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#1B5E20] to-[#145216]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1B5E20] mb-2">Mahjong KS</h1>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition"
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
              className="w-full bg-[#1B5E20] hover:bg-[#145216] text-white font-semibold py-4 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              style={{ minHeight: '44px' }}
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
