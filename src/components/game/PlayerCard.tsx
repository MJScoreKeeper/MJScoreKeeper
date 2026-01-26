interface PlayerCardProps {
  name: string;
  totalPoints: number;
  winCount: number;
  playerNumber: 1 | 2;
}

export default function PlayerCard({ name, totalPoints, winCount, playerNumber }: PlayerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-500">Player {playerNumber}</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{name}</h2>
      <div className="flex items-baseline mb-2">
        <span className="text-4xl font-bold text-[#1B5E20]">{totalPoints}</span>
        <span className="ml-2 text-gray-500">番</span>
      </div>
      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
        Wins: <span className="font-semibold text-[#1B5E20]">{winCount}</span>
      </div>
    </div>
  );
}
