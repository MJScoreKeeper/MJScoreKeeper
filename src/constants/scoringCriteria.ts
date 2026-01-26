import type { ScoringCategory } from '../types/scoring.types';

export const SCORING_CATEGORIES: ScoringCategory[] = [
  {
    name: 'Basic Scoring (1 番)',
    criteria: [
      { id: 'self-drawn', name: '自摸 (Self-Drawn)', points: 1, category: 'basic' },
      { id: 'concealed-hand', name: '門前清 (Concealed Hand)', points: 1, category: 'basic' },
    ],
  },
  {
    name: 'Common Hands (3 番)',
    criteria: [
      { id: 'all-pungs', name: '對對和 (All Pungs)', points: 3, category: 'common' },
      { id: 'mixed-one-suit', name: '混一色 (Mixed One Suit)', points: 3, category: 'common' },
    ],
  },
  {
    name: 'High Value Hands',
    criteria: [
      { id: 'small-three-dragons', name: '小三元 (Small Three Dragons)', points: 5, category: 'high' },
      { id: 'small-four-winds', name: '小四喜 (Small Four Winds)', points: 6, category: 'high' },
      { id: 'pure-one-suit', name: '清一色 (Pure One Suit)', points: 7, category: 'high' },
      { id: 'all-pungs-self-drawn', name: '坎坎胡 (All Pungs Self-Drawn)', points: 8, category: 'high' },
      { id: 'big-three-dragons', name: '大三元 (Big Three Dragons)', points: 8, category: 'high' },
    ],
  },
  {
    name: 'Special Hands (10+ 番)',
    criteria: [
      { id: 'all-honors', name: '字一色 (All Honors)', points: 10, category: 'special' },
      { id: 'big-four-winds', name: '大四喜 (Big Four Winds)', points: 13, category: 'special' },
      { id: 'heavenly-hand', name: '天糊 (Heavenly Hand)', points: 13, category: 'special' },
      { id: 'earthly-hand', name: '地糊 (Earthly Hand)', points: 13, category: 'special' },
    ],
  },
  {
    name: 'Other',
    criteria: [
      { id: 'other', name: '其他 (Other)', points: 0, category: 'other' },
    ],
  },
];
