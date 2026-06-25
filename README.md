# Track My Lost 🔍

> *Together, we find.*

A modern, responsive **lost & found marketplace UI** for Morocco — inspired by Avito.
Citizens can signal lost or found items and people, browse alerts near them, chat,
and admins can moderate reports. **Frontend only** (no backend) — built with **Vite + React**.

The UI uses the brand's navy-blue + orange theme on clean white / light-gray surfaces,
and is fully responsive (mobile, tablet, desktop). All content is dummy/simulated data.

## Tech stack

- **React 18** + **Vite** (fast dev server & build)
- **React Router DOM v6** (routing)
- **Axios** (pre-configured client, ready for a future API)
- **React Icons** (Feather icon set)
- **Modern CSS** with design tokens (CSS custom properties) — no UI framework

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build into /dist
npm run preview  # preview the production build
```

## Routes / pages

| Route            | Page              | Description                                         |
| ---------------- | ----------------- | --------------------------------------------------- |
| `/`              | `Home`            | Hero, search, categories, feed grid, stats sidebar  |
| `/login`         | `Login`           | Split-screen login form                             |
| `/register`      | `Register`        | Account creation form                               |
| `/item/:id`      | `ItemDetails`     | Image, description, location, status, contact (UI)  |
| `/signalement`   | `Signalement`     | Post a lost/found item + map-picker modal           |
| `/mon-compte`    | `MonCompte`       | Profile dashboard + "Mes signalements"              |
| `/messages`      | `Messages`        | Two-pane chat UI                                    |
| `/notifications` | `Notifications`   | Notifications list with filters                     |
| `/admin`         | `Admin`           | Dashboard: stats, pending reports, users table      |

## Project structure

```
trackmylost/
├── index.html              # Vite entry HTML
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx            # React entry + BrowserRouter
    ├── App.jsx             # Routes + layout wiring
    ├── api/
    │   └── client.js       # Axios instance (for a future backend)
    ├── components/         # Reusable UI: Navbar, Footer, CardItem,
    │   │                   #   Button, Input, Sidebar, Modal, Logo, Layout
    │   └── *.jsx + *.css
    ├── pages/              # The 9 routed pages (+ co-located CSS)
    ├── data/               # Dummy JSON-like data (items, users, messages…)
    └── styles/
        └── index.css       # Global design system & tokens
```

## Notes

- This is a **UI-only** project: forms simulate submission, "contact" buttons are
  visual, and the chat / approvals update local React state only.
- The `src/api/client.js` Axios instance reads `VITE_API_URL` and is ready to wire
  up to a real backend later.
- The previous Create React App scaffold lives untouched in `src/trackmylost/`.
