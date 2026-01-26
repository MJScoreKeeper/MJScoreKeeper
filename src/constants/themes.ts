export type ThemeId = 'green' | 'ocean' | 'amber';

export interface Theme {
  id: ThemeId;
  name: string;
  primary: string;
  primaryHover: string;
  accent: string;
}

export const THEMES: Record<ThemeId, Theme> = {
  green: {
    id: 'green',
    name: 'Mahjong Green',
    primary: '#1B5E20',
    primaryHover: '#2E7D32',
    accent: '#4CAF50',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#0D47A1',
    primaryHover: '#1565C0',
    accent: '#2196F3',
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    primary: '#E65100',
    primaryHover: '#F57C00',
    accent: '#FF9800',
  },
};

export const DEFAULT_THEME: ThemeId = 'green';
