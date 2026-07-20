# Padel Whiteboard

A mobile-friendly padel tactics board. Drag the four players and the ball
around a to-scale doubles court, draw a movement arrow from any player, and
toggle overlays like zones, borders, the "black hole", and each player's
high-percentage shot zone. Everything runs entirely in the browser — there is
no backend or account system; boards are saved to that browser's local
storage only.

## Tech stack

- [Vite](https://vitejs.dev/) + [Preact](https://preactjs.com/) + TypeScript
- Plain CSS (no framework)
- SVG for the court, tokens, and overlays
- [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) for installability (add to home screen)
- Deployed to GitHub Pages via GitHub Actions

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and produce a production build in dist/
npm run preview   # preview the production build locally
```

Open the app on your phone (or shrink your browser window) for the intended
mobile experience — the toolbar sits at the bottom for thumb reach.

## How it works

- **Library**: the home screen lists your saved boards (local storage only,
  a handful of boards is the expected scale). Create, rename, duplicate, or
  delete a board from here.
- **Editor**:
  - **Move mode** (default): drag any of the 4 player dots or the ball
    anywhere on the court.
  - **Arrow mode**: drag from a player outward to set their single
    movement arrow (dragging again replaces it); tap a player that already
    has an arrow to clear it. An arrow always starts at its player's current
    position, so moving the player in Move mode carries the arrow with it.
  - **Reset**: restores the default starting formation.
  - **Display**: a panel of toggles — ball visibility, each team's "black
    hole" (the midpoint between their two players), the attack / no-man /
    defence zones, glass vs. fence border styling, and the high-percentage
    shot zone. These are global settings shared across all boards.
  - **High-percentage shot zone**: when enabled, tap a player (in Move mode,
    without dragging) to highlight a triangle from them to two points on the
    opponent's side. At their own back wall the targets are the opponent's
    two back corners; as they move toward the net the targets slide toward
    the net line, so right at the net the highlight sweeps the full width of
    the opponent's court. See `src/lib/highPercentageZone.ts`.
- Boards autosave to local storage ~500ms after your last change (see the
  "Saved" indicator in the header). Display settings save immediately.

## Data model

All positions are stored as normalized `{ x, y }` coordinates (0..1) so the
court renders correctly at any screen size. See `src/types.ts` for the full
shape of a `Board` and `DisplaySettings`.

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the app and publishes `dist/` to GitHub Pages. `vite.config.ts`
uses a relative `base: './'` so the build works from any repository name/subpath
without extra configuration — just enable GitHub Pages for the repo (Settings
→ Pages → Source: GitHub Actions).

## Deliberately out of scope

No accounts, sync, backend, freehand drawing, undo/redo, animation/playback,
collaboration, automated tests, or data export/import — this is intentionally
a small, single-person tool. See the plan history for the full list of
decisions behind these choices.
