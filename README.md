# Neighborhood Exchange

Your local market place: furniture and household items, exchanged between neighbors.
Mobile web app built with React + Vite.

## Run locally

```bash
npm install
npm run dev -- --host
```

Open the **Local** link on your computer, or the **Network** link on a phone in the same Wi-Fi.

## Checks

```bash
npm test         # unit tests (vitest)
npm run lint
npm run build
```

## Live version

Every push to `main` is built and published to GitHub Pages automatically
(see `.github/workflows/deploy.yml`):
https://darkillexxx.github.io/neighborhood-exchange/

To check the production build locally:

```bash
npm run build
npm run preview
```

## Project structure

```
public/items/         item photos used by the mock data
src/
  main.jsx            app entry, router
  App.jsx             routes + bottom navigation
  index.css           design tokens (colors, radius) and global styles
  data/items.js       mock items until we have a backend
  assets/icons/       SVG icons exported from Figma, drawn with <Icon>
  components/         reusable UI pieces (BottomNav, ItemCard, SearchBar, ...)
  pages/              one file per screen (Home, ItemDetails, ...)
```

## Branches

- `main`: stable, only updated through pull requests
- `dev`: day-to-day work
