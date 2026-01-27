import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore, type MatchHistory } from '../stores/historyStore';
import { useThemeStore } from '../stores/themeStore';
import MahjongBackground from '../components/MahjongBackground';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface MatchCardProps {
  match: MatchHistory;
  onDelete: (id: string) => void;
}

function MatchCard({ match, onDelete }: MatchCardProps) {
  const { theme } = useThemeStore();

  const handleDelete = () => {
    if (window.confirm('Delete this match from history?')) {
      onDelete(match.id);
    }
  };

  const isDraw = !match.winner_name;
  const player1Won = match.winner_name === match.player1_name;
  const player2Won = match.winner_name === match.player2_name;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
      {/* Date and Time */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{formatDate(match.ended_at)}</span>
        <span>{formatTime(match.ended_at)}</span>
      </div>

      {/* Players and Scores */}
      <div className="flex items-center justify-between">
        <div className={`flex-1 text-center p-2 rounded-lg ${player1Won ? 'bg-green-50' : ''}`}>
          <div className={`font-semibold ${player1Won ? 'text-green-700' : 'text-gray-700'}`}>
            {match.player1_name}
            {player1Won && ' 🏆'}
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: player1Won ? theme.primary : '#6B7280' }}
          >
            {match.player1_total_points}
          </div>
        </div>

        <div className="px-4 text-gray-400 font-semibold">vs</div>

        <div className={`flex-1 text-center p-2 rounded-lg ${player2Won ? 'bg-green-50' : ''}`}>
          <div className={`font-semibold ${player2Won ? 'text-green-700' : 'text-gray-700'}`}>
            {match.player2_name}
            {player2Won && ' 🏆'}
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: player2Won ? theme.primary : '#6B7280' }}
          >
            {match.player2_total_points}
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          {match.total_games} {match.total_games === 1 ? 'game' : 'games'} played
          {match.draw_count && match.draw_count > 0 && (
            <span className="ml-1 text-gray-400">
              • {match.draw_count} {match.draw_count === 1 ? 'draw' : 'draws'}
            </span>
          )}
          {isDraw && <span className="ml-2 text-amber-600 font-medium">• Tied</span>}
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { matches, isLoading, error, fetchMatches, deleteMatch } = useHistoryStore();
  const { theme, loadTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadTheme();
    fetchMatches();
  }, [loadTheme, fetchMatches]);

  const handleBack = () => {
    navigate('/');
  };

  const handleDeleteMatch = async (id: string) => {
    await deleteMatch(id);
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
          <button
            onClick={handleBack}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold">Match History</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 relative z-10">
        {isLoading && (
          <div className="text-center py-8 text-gray-500">
            Loading matches...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && matches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No matches yet</h2>
            <p className="text-gray-500">
              Your completed matches will appear here.
            </p>
          </div>
        )}

        {!isLoading && matches.length > 0 && (
          <div className="space-y-3">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onDelete={handleDeleteMatch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
