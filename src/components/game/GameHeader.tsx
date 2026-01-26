interface GameHeaderProps {
  gameNumber: number;
}

export default function GameHeader({ gameNumber }: GameHeaderProps) {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-gray-600 mb-1">Current Game</p>
      <h3 className="text-3xl font-bold text-gray-900">
        Game <span className="text-[#1B5E20]">#{gameNumber}</span>
      </h3>
    </div>
  );
}
