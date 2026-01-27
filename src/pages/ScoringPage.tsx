import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useScoringStore } from '../stores/scoringStore';
import { useThemeStore } from '../stores/themeStore';
import { SCORING_CATEGORIES } from '../constants/scoringCriteria';
import ScoringChecklist from '../components/scoring/ScoringChecklist';
import MahjongBackground from '../components/MahjongBackground';

export default function ScoringPage() {
  const session = useGameStore((state) => state.session);
  const selectedCriteria = useScoringStore((state) => state.selectedCriteria);
  const winnerId = useScoringStore((state) => state.winnerId);
  const toggleCriterion = useScoringStore((state) => state.toggleCriterion);
  const setWinner = useScoringStore((state) => state.setWinner);
  const getTotalPoints = useScoringStore((state) => state.getTotalPoints);
  const setOtherPoints = useScoringStore((state) => state.setOtherPoints);
  const otherPoints = useScoringStore((state) => state.otherPoints);
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();

  const [otherInputValue, setOtherInputValue] = useState(otherPoints.toString());

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  // Check if "Other" is selected
  const isOtherSelected = selectedCriteria.some(c => c.id === 'other');

  // Handle Other points input change
  const handleOtherPointsChange = (value: string) => {
    setOtherInputValue(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setOtherPoints(numValue);
    } else if (value === '') {
      setOtherPoints(0);
    }
  };

  if (!session) {
    return null;
  }

  const totalPoints = getTotalPoints();

  const handleContinue = () => {
    if (winnerId === null) {
      alert('Please select a winner');
      return;
    }
    navigate('/confirm');
  };

  const handleBack = () => {
    navigate('/main');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Mahjong Background */}
      <MahjongBackground opacity={0.04} color="#9CA3AF" />

      {/* Header */}
      <div
        className="text-white py-4 px-4 shadow-lg sticky top-0 z-20"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded mb-2 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Select Scoring Elements</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Winner Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Who won?</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setWinner(1)}
              className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                winnerId === 1
                  ? 'shadow-lg scale-105'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{
                minHeight: '60px',
                backgroundColor: winnerId === 1 ? theme.primary : undefined,
              }}
            >
              <div className={`text-xs mb-1 ${winnerId === 1 ? 'text-white/70' : 'text-gray-500'}`}>
                Player 1
              </div>
              <div className={`text-lg ${winnerId === 1 ? 'text-white' : 'text-gray-700'}`}>
                {session.player1_name}
              </div>
            </button>
            <button
              onClick={() => setWinner(2)}
              className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                winnerId === 2
                  ? 'shadow-lg scale-105'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{
                minHeight: '60px',
                backgroundColor: winnerId === 2 ? theme.primary : undefined,
              }}
            >
              <div className={`text-xs mb-1 ${winnerId === 2 ? 'text-white/70' : 'text-gray-500'}`}>
                Player 2
              </div>
              <div className={`text-lg ${winnerId === 2 ? 'text-white' : 'text-gray-700'}`}>
                {session.player2_name}
              </div>
            </button>
          </div>
        </div>

        {/* Scoring Checklist */}
        <ScoringChecklist
          categories={SCORING_CATEGORIES}
          selectedCriteria={selectedCriteria}
          onToggle={toggleCriterion}
        />

        {/* Other Points Input - show when "Other" is selected */}
        {isOtherSelected && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">其他 (Other) - Enter Points</h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                value={otherInputValue}
                onChange={(e) => handleOtherPointsChange(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg text-center focus:ring-2 focus:border-transparent outline-none"
                style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
                placeholder="Enter 番"
              />
              <span className="text-lg text-gray-600">番</span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 font-medium">Total Points:</span>
            <div className="text-right">
              <span className="text-3xl font-bold" style={{ color: theme.primary }}>{totalPoints}</span>
              <span className="text-gray-600 ml-1">番</span>
            </div>
          </div>
          <button
            onClick={handleContinue}
            disabled={winnerId === null}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg"
            style={{ minHeight: '56px' }}
          >
            {winnerId === null ? 'Select a Winner' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
