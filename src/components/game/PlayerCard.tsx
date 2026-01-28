import { useThemeStore } from '../../stores/themeStore';

interface PlayerCardProps {
  name: string;
  totalPoints: number;
  winCount: number;
  netAmount: number;
  playerNumber: 1 | 2;
  isLeading?: boolean;
}

export default function PlayerCard({ name, totalPoints, winCount, netAmount, playerNumber, isLeading }: PlayerCardProps) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-4 border-2 transition-all duration-300 ${
        isLeading ? 'scale-[1.02]' : 'border-gray-100'
      }`}
      style={isLeading ? { borderColor: theme.primary, boxShadow: `0 4px 20px ${theme.primary}40` } : {}}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-medium text-gray-500">Player {playerNumber}</span>
        {isLeading && (
          <span className="text-2xl" role="img" aria-label="Leading">
            👏
          </span>
        )}
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-3">{name}</h2>
      {/* Net Amount - Prominent display */}
      <div className={`text-center py-2 px-3 rounded-lg mb-3 ${netAmount >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
        <span className={`text-3xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {netAmount >= 0 ? '+' : ''}${Math.abs(netAmount).toLocaleString()}
        </span>
      </div>
      {/* Stats row */}
      <div className="flex justify-between items-baseline">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold" style={{ color: theme.primary }}>{totalPoints}</span>
          <span className="ml-1 text-gray-500 text-sm">番</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold" style={{ color: theme.primary }}>{winCount}</span>
          <span className="ml-1 text-gray-500 text-sm">Wins</span>
        </div>
      </div>
    </div>
  );
}
