# Lasers & Feelings — Character Creator

A fully client-side character generator for the one-page RPG **Lasers & Feelings** by John Harper. The app runs in the browser (optimized for static hosting) and persists data locally so players can build, store, and export characters without an account.

## Features

- Guided character form covering name, style, role, number, goal, portrait, gear, and notes.
- Autosave with versioned localStorage slots plus manual **Save As** duplication.
- JSON import/export and PDF export of the character sheet (with print-friendly fallback).
- Library manager for adding custom Styles, Roles, and Goals while optionally hiding defaults.
- High-contrast theme toggle, keyboard-friendly controls, and accessible focus states.

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling and print utilities.
- Local state/context with debounced persistence to `localStorage`.
- PDF generation via `html2canvas` + `jspdf`.
- Testing with [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/).

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Run tests
npm test

# Build the production bundle
npm run build
```

The Vite dev server listens on [http://localhost:5173](http://localhost:5173). The build output is static and can be deployed to GitHub Pages or any static host.

## License & Attribution

Lasers & Feelings is created by John Harper and released under a Creative Commons Attribution license. This project is an unofficial fan-made tool.
