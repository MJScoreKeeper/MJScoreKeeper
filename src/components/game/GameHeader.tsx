import { useThemeStore } from '../../stores/themeStore';

interface GameHeaderProps {
  gameNumber: number;
}

export default function GameHeader({ gameNumber }: GameHeaderProps) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="text-center py-4">
      <p className="text-sm text-gray-600 mb-1">Current Game</p>
      <h3 className="text-3xl font-bold text-gray-900">
        Game <span style={{ color: theme.primary }}>#{gameNumber}</span>
      </h3>
    </div>
  );
}
