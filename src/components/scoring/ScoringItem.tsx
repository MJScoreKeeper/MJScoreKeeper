import type { ScoringCriterion } from '../../types/game.types';

interface ScoringItemProps {
  criterion: ScoringCriterion;
  isSelected: boolean;
  onToggle: () => void;
}

export default function ScoringItem({ criterion, isSelected, onToggle }: ScoringItemProps) {
  return (
    <label className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-[#1B5E20] transition-all cursor-pointer">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="w-6 h-6 accent-[#1B5E20] border-gray-300 rounded cursor-pointer"
        style={{ minWidth: '24px', minHeight: '24px' }}
      />
      <div className="ml-4 flex-1">
        <p className="font-medium text-gray-900">{criterion.name}</p>
      </div>
      <div className="text-right">
        <span className="text-lg font-bold text-[#1B5E20]">
          {criterion.id === 'other' ? '?' : criterion.points}
        </span>
        <span className="text-sm text-gray-500 ml-1">番</span>
      </div>
    </label>
  );
}
