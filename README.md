# Mahjong KS

A mobile-first Hong Kong Mahjong scoring tracker app for two players.

**Live App:** https://garylchan.github.io/Mahjong-KS/

## Features

- Track scores for two players
- Hong Kong Mahjong scoring criteria (1-13 番)
- Win count tracking per player
- Custom "Other" option for additional 番
- Data persists in browser localStorage
- Works offline once loaded

## Scoring Criteria

### Basic (1 番)
- 自摸 (Self-Drawn)
- 門前清 (Concealed Hand)

### Common (3 番)
- 對對和 (All Pungs)
- 混一色 (Mixed One Suit)

### High Value (5-8 番)
- 小三元 (Small Three Dragons) - 5 番
- 小四喜 (Small Four Winds) - 6 番
- 清一色 (Pure One Suit) - 7 番
- 坎坎胡 (All Pungs Self-Drawn) - 8 番
- 大三元 (Big Three Dragons) - 8 番

### Special (10+ 番)
- 字一色 (All Honors) - 10 番
- 大四喜 (Big Four Winds) - 13 番
- 天糊 (Heavenly Hand) - 13 番
- 地糊 (Earthly Hand) - 13 番

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router (HashRouter for GitHub Pages)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Automatically deployed to GitHub Pages via GitHub Actions on push to main branch.
