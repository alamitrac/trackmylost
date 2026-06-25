# Frontend ↔ Laravel API integration

The React app talks to the Laravel API using **Sanctum bearer tokens**. All
config and field-mapping lives in `src/api/` so a backend mismatch is a
one-file fix.

## Configuration

- Base URL: `VITE_API_URL` in `.env` (default `http://127.0.0.1:8000/api`).
- Token: stored in `localStorage` under `tml_token`, sent as
  `Authorization: Bearer <token>` on every request (`src/api/client.js`).
- On `401` (except login/register and the session-restore probe) the token is
  cleared and the user is redirected to `/login`.

## Where to adjust if your API differs

| Concern | File |
| --- | --- |
| Endpoint paths | `src/api/endpoints.js` |
| Field names / response shapes (snake_case → UI) | `src/api/normalize.js` |
| Token / user extraction from auth responses | `src/api/auth.js` |

## Assumed endpoints (standard Sanctum conventions)

| Method | Path | Used by |
| --- | --- | --- |
| POST | `/register` | Register page |
| POST | `/login` | Login + Admin login |
| POST | `/logout` | Logout (MonCompte, Admin) |
| GET | `/user` | Session restore (current user) |
| GET | `/items` | Home feed, ItemDetails related, MonCompte, Admin |
| GET | `/items/{id}` | ItemDetails |
| POST | `/items` | Signalement (create, multipart) |
| GET | `/users` | Admin user table |
| GET | `/conversations` | Messages |
| POST | `/conversations/{id}/messages` | Send a message |
| GET | `/notifications` | Alerts page (`/alerte`) |
| POST | `/notifications/{id}/read` | Mark one read |
| POST | `/notifications/read-all` | Mark all read |

## Expected shapes (defensively normalized — variants are tolerated)

**Login / Register response** — token is read from `token`, `access_token`,
`plainTextToken`, or a nested `data.*`; user from `user` or the body:

```json
{ "token": "1|abc...", "user": { "id": 1, "name": "...", "email": "...", "role": "user" } }
```

**Register request** sends: `name`, `first_name`, `last_name`, `email`,
`password`, `password_confirmation`, `gender`, `birth_date`.

**Item / signalement** — snake_case is mapped to the UI shape. Recognized keys
include: `title|name`, `description|details`, `type` (`lost|found`),
`kind`, `urgency|priority`, `category{.name}`, `location|quartier|address`,
`city|ville`, `image|image_url|photo|images[]`, `tags` (array or CSV),
`status` (`actif|resolu|attente`), `contact_phone|phone`, `created_at`,
and `author|user` (`{ id, name|full_name, avatar }`).

**Roles**: `admin`, `administrator`, or `moderateur` grant admin access
(adjust in `src/context/AuthContext.jsx`).

## Notes

- Home and Admin **stat counters are derived from the fetched items** (no stats
  endpoint is required).
- Categories (with icons) and feed filter chips remain static UI config in
  `src/data/categories.js` — they are not API data.
- Protected routes: `/signalement`, `/mon-compte`, `/messages`, `/alerte`
  (+ `/alertes`, `/notifications`) require login; `/admin` requires an admin role.
