import type { ScoringCategory } from '../../types/scoring.types';
import type { ScoringCriterion } from '../../types/game.types';
import ScoringItem from './ScoringItem';

interface ScoringChecklistProps {
  categories: ScoringCategory[];
  selectedCriteria: ScoringCriterion[];
  onToggle: (criterion: ScoringCriterion) => void;
}

export default function ScoringChecklist({
  categories,
  selectedCriteria,
  onToggle,
}: ScoringChecklistProps) {
  const isSelected = (criterion: ScoringCriterion) =>
    selectedCriteria.some((c) => c.id === criterion.id);

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-lg font-bold text-gray-900 mb-3">{category.name}</h3>
          <div className="space-y-2">
            {category.criteria.map((criterion) => (
              <ScoringItem
                key={criterion.id}
                criterion={criterion}
                isSelected={isSelected(criterion)}
                onToggle={() => onToggle(criterion)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
