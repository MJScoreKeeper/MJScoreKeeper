import type { ScoringCategory } from '../types/scoring.types';

export const SCORING_CATEGORIES: ScoringCategory[] = [
  {
    name: 'Win Actions 食糊加番',
    criteria: [
      { id: 'discarded-tile', name: '打出 (Discarded Tile)', points: 0, category: 'win-actions' },
      { id: 'self-drawn', name: '自摸 (Self-Drawn)', points: 1, category: 'win-actions' },
      { id: 'robbing-kong', name: '搶槓 (Robbing the Kong)', points: 1, category: 'win-actions' },
      { id: 'last-tile', name: '海底撈月 (Last Tile Draw)', points: 1, category: 'win-actions' },
      { id: 'win-by-kong', name: '槓上自摸 (Win by Kong)', points: 2, category: 'win-actions' },
      { id: 'win-by-double-kong', name: '槓上槓自摸 (Win by Double Kong)', points: 8, category: 'win-actions' },
    ],
  },
  {
    name: 'Common Hands 常見糊牌',
    criteria: [
      { id: 'all-sequences', name: '平糊 (All Sequences)', points: 1, category: 'common' },
      { id: 'all-triplets', name: '對對糊 (All Triplets)', points: 3, category: 'common' },
      { id: 'mixed-one-suit', name: '混一色 (Mixed One Suit)', points: 3, category: 'common' },
      { id: 'pure-one-suit', name: '清一色 (Pure One Suit)', points: 7, category: 'common' },
    ],
  },
  {
    name: 'Additions 加番牌',
    criteria: [
      { id: 'concealed-hand', name: '門前清 (Concealed Hand)', points: 1, category: 'additions' },
      { id: 'red-dragon', name: '紅中 (Red Dragon)', points: 1, category: 'additions' },
      { id: 'green-dragon', name: '發財 (Green Dragon)', points: 1, category: 'additions' },
      { id: 'white-dragon', name: '白板 (White Dragon)', points: 1, category: 'additions' },
      { id: 'prevailing-wind', name: '圈風牌 (Prevailing Wind)', points: 1, category: 'additions' },
      { id: 'seat-wind', name: '門風牌 (Seat Wind)', points: 1, category: 'additions' },
    ],
  },
  {
    name: 'Special Hands 特別糊牌',
    collapsible: true,
    defaultCollapsed: true,
    criteria: [
      { id: 'mixed-terminals', name: '花幺九 (Mixed Terminals)', points: 4, category: 'special' },
      { id: 'small-three-dragons', name: '小三元 (Small Three Dragons)', points: 5, category: 'special' },
      { id: 'small-four-winds', name: '小四喜 (Small Four Winds)', points: 6, category: 'special' },
      { id: 'all-triplets-self-drawn', name: '坎坎胡 (All Triplets Self-Drawn)', points: 8, category: 'special' },
      { id: 'big-three-dragons', name: '大三元 (Big Three Dragons)', points: 8, category: 'special' },
      { id: 'all-honors', name: '字一色 (All Honors)', points: 10, category: 'special' },
      { id: 'nine-gates', name: '九子連環 (Nine Gates)', points: 10, category: 'special' },
      { id: 'big-four-winds', name: '大四喜 (Big Four Winds)', points: 13, category: 'special' },
      { id: 'eighteen-arhats', name: '十八羅漢 (Eighteen Arhats)', points: 13, category: 'special' },
      { id: 'heavenly-hand', name: '天糊 (Heavenly Hand)', points: 13, category: 'special' },
      { id: 'earthly-hand', name: '地糊 (Earthly Hand)', points: 13, category: 'special' },
      { id: 'manly-hand', name: '人糊 (Manly Hand)', points: 13, category: 'special' },
    ],
  },
  {
    name: 'Other',
    criteria: [
      { id: 'other', name: '其他 (Other)', points: 0, category: 'other' },
    ],
  },
];
