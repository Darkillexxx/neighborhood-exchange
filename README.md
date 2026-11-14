# Neighborhood Exchange

Your local market place: furniture and household items, exchanged between neighbors.
Mobile web app built with React + Vite.

## Run locally

```bash
npm install
npm run dev -- --host
```

Open the **Local** link on your computer, or the **Network** link on a phone in the same Wi-Fi.

## Project structure

```
src/
  main.jsx            app entry, router
  App.jsx             routes + bottom navigation
  index.css           design tokens (colors, radius) and global styles
  data/items.js       mock items until we have a backend
  components/         reusable UI pieces (BottomNav, ItemCard, SearchBar, ...)
  pages/              one file per screen (Home, ItemDetails, ...)
```

## Branches

- `main`: stable, only updated through pull requests
- `dev`: day-to-day work
