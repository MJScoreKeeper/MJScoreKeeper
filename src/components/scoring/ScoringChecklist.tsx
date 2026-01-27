import { useState } from 'react';
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
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(() => {
    const initialCollapsed = new Set<string>();
    categories.forEach((cat) => {
      if (cat.collapsible && cat.defaultCollapsed) {
        initialCollapsed.add(cat.name);
      }
    });
    return initialCollapsed;
  });

  const isSelected = (criterion: ScoringCriterion) =>
    selectedCriteria.some((c) => c.id === criterion.id);

  const toggleCollapse = (categoryName: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  const getSelectedCountInCategory = (category: ScoringCategory) => {
    return category.criteria.filter((c) => isSelected(c)).length;
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const isCollapsed = collapsedCategories.has(category.name);
        const selectedCount = getSelectedCountInCategory(category);

        return (
          <div key={category.name}>
            {category.collapsible ? (
              <button
                onClick={() => toggleCollapse(category.name)}
                className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-3 py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <span className="flex items-center gap-2">
                  {category.name}
                  {selectedCount > 0 && (
                    <span className="text-sm font-medium text-white bg-green-500 px-2 py-0.5 rounded-full">
                      {selectedCount}
                    </span>
                  )}
                </span>
                <span className="text-xl text-gray-500">
                  {isCollapsed ? '+' : '−'}
                </span>
              </button>
            ) : (
              <h3 className="text-lg font-bold text-gray-900 mb-3">{category.name}</h3>
            )}
            {(!category.collapsible || !isCollapsed) && (
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
            )}
          </div>
        );
      })}
    </div>
  );
}
