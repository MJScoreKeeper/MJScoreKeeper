interface PlayerCardProps {
  name: string;
  totalPoints: number;
  winCount: number;
  playerNumber: 1 | 2;
}

export default function PlayerCard({ name, totalPoints, winCount, playerNumber }: PlayerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100">
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-medium text-gray-500">Player {playerNumber}</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{name}</h2>
      <div className="flex justify-between items-baseline">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#1B5E20]">{totalPoints}</span>
          <span className="ml-1 text-gray-500">番</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#1B5E20]">{winCount}</span>
          <span className="ml-1 text-gray-500">Wins</span>
        </div>
      </div>
    </div>
  );
}
