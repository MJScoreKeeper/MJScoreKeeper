import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useThemeStore } from '../stores/themeStore';
import { useHistoryStore } from '../stores/historyStore';
import PlayerCard from '../components/game/PlayerCard';
import GameHeader from '../components/game/GameHeader';
import RecordWinButton from '../components/game/RecordWinButton';
import MahjongBackground from '../components/MahjongBackground';

function CelebrationEffect({ winnerName }: { winnerName: string | null }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string; size: number; rotation: number }>>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FF69B4', '#00CED1'];
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      {/* Winner announcement */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mx-4 animate-bounce-in text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {winnerName ? `${winnerName} Wins!` : "It's a Tie!"}
          </h2>
          <p className="text-gray-600">Match saved to history</p>
        </div>
      </div>
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(1080deg) scale(0.5);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3s ease-out forwards;
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function MainPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationWinner, setCelebrationWinner] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session) {
    return null;
  }

  // Determine who is leading based on net amount
  const player1NetAmount = session.player1_net_amount || 0;
  const player2NetAmount = session.player2_net_amount || 0;
  const player1Leading = player1NetAmount > player2NetAmount;
  const player2Leading = player2NetAmount > player1NetAmount;

  // Calculate lighter/darker shades of theme color for buttons
  const buttonShades = {
    recordDraw: `${theme.primary}B3`, // 70% opacity version
    endMatch: `${theme.primary}B3`, // 70% opacity version (same as recordDraw)
  };

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
      setMenuOpen(false);
    }
  };

  const handleResetGame = () => {
    if (window.confirm('Start a new match with new players? This will clear all current data.')) {
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

    // Determine winner based on net amount
    const p1NetAmount = session.player1_net_amount || 0;
    const p2NetAmount = session.player2_net_amount || 0;
    let winnerName: string | null = null;
    if (p1NetAmount > p2NetAmount) {
      winnerName = session.player1_name;
    } else if (p2NetAmount > p1NetAmount) {
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

    // Calculate draw count
    const drawCount = totalGames - (session.player1_win_count || 0) - (session.player2_win_count || 0);

    const result = await saveMatch({
      player1_name: session.player1_name,
      player2_name: session.player2_name,
      player1_total_points: session.player1_total_points,
      player2_total_points: session.player2_total_points,
      player1_net_amount: p1NetAmount,
      player2_net_amount: p2NetAmount,
      total_games: totalGames,
      draw_count: drawCount,
      winner_name: winnerName,
    });
    setIsSaving(false);

    if (result.success) {
      // Show celebration
      setCelebrationWinner(winnerName);
      setShowCelebration(true);

      // Navigate after celebration
      setTimeout(() => {
        resetGame();
        navigate('/');
      }, 2500);
    } else {
      window.alert(`Failed to save match: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      {/* Celebration Effect */}
      {showCelebration && <CelebrationEffect winnerName={celebrationWinner} />}

      {/* Mahjong Background */}
      <MahjongBackground opacity={0.08} color="#9CA3AF" />

      {/* Header */}
      <div
        className="text-white py-4 px-4 shadow-lg relative z-30"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">MJ ScoreKeeper</h1>
          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-white/20 rounded transition"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-40">
                <button
                  onClick={handleStartOver}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition flex items-center gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div>
                    <div className="font-medium">Start Over</div>
                    <div className="text-xs text-gray-500">Reset scores to zero</div>
                  </div>
                </button>
                <button
                  onClick={handleResetGame}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition flex items-center gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <div className="font-medium">New Match</div>
                    <div className="text-xs text-gray-500">Start with new players</div>
                  </div>
                </button>
              </div>
            )}
          </div>
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
            netAmount={player1NetAmount}
            playerNumber={1}
            isLeading={player1Leading}
          />
          <PlayerCard
            name={session.player2_name}
            totalPoints={session.player2_total_points}
            winCount={session.player2_win_count || 0}
            netAmount={player2NetAmount}
            playerNumber={2}
            isLeading={player2Leading}
          />
        </div>

        {/* Record Win Button */}
        <RecordWinButton onClick={handleRecordWin} />

        {/* Record Draw Button */}
        <button
          onClick={handleDraw}
          className="w-full text-white font-semibold py-3 px-6 rounded-lg shadow transition-all duration-200"
          style={{
            minHeight: '48px',
            backgroundColor: buttonShades.recordDraw,
          }}
        >
          Record Draw
        </button>

        {/* End Match Button */}
        <button
          onClick={handleEndMatch}
          disabled={isSaving || showCelebration}
          className="w-full text-white font-semibold py-3 px-6 rounded-lg shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            minHeight: '48px',
            backgroundColor: buttonShades.endMatch,
          }}
        >
          {isSaving ? 'Saving...' : 'End Match & Save to History'}
        </button>
      </div>
    </div>
  );
}
