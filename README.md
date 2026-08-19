# Veldra Perfect Pour

A mobile-first HTML5 contest-style pour game built with React, Vite, Tailwind CSS, localStorage, and CSS/SVG-style placeholder artwork.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```

The production build is generated in `dist/`.

## Preview Production Build

```bash
npm run preview
```

## Deploy to Netlify

1. Push this project to a Git repository.
2. In Netlify, choose **Add new site** and connect the repository.
3. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy.

## Deploy to Vercel

1. Push this project to a Git repository.
2. Import the repository in Vercel.
3. Vercel should detect Vite automatically.
4. Confirm:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy.

## Replacing Placeholder Assets

The MVP uses CSS artwork for the logo mark, can, and glass so it has no external image dependency.

To use real brand assets:

1. Add files to `public/assets/`, for example:
   - `public/assets/veldra-logo.png`
   - `public/assets/sunfall-haze-can.png`
   - `public/assets/glass.png`
2. Replace the placeholder markup in:
   - `src/components/BrandMark.jsx`
   - `src/components/Glass.jsx`
3. Reference public assets with paths like `/assets/veldra-logo.png`.
4. Keep image sizes responsive and optimize files before deployment.

## Leaderboard Notes

Scores are stored locally in `localStorage` for the MVP. The save point is isolated in `src/lib/leaderboard.js`; add Firebase or Supabase writes there when a backend leaderboard is needed.

## Game Logic

Scoring and challenge data live in `src/lib/scoring.js`. The perfect target is:

- Beer: 82-88% of glass height
- Foam: 8-14% of glass height

The score combines beer accuracy, foam accuracy, time bonus, and overflow penalties.
