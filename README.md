# Home Food Mobile Boilerplate

Mobile-first React (Vite) + Bootstrap 5 (prebuilt CSS) + Firebase (Auth/Firestore/Analytics) + WeChat OAuth placeholder.

> JavaScript only (no TypeScript) per requirement.

## Features

- Vite + React 18
- Bootstrap 5 via prebuilt CSS (CDN import) with lightweight custom mobile tweaks
- AuthContext integrating Firebase Auth + placeholder WeChat OAuth flow (redirect + callback handler)
- Protected routing pattern (React Router v6)
- Environment-driven configuration (`import.meta.env.*`) with `.env.example`
- Firestore + Analytics setup (analytics lazy-loaded if supported)
- Simple API fetch wrapper with base URL env variable
- Mobile-focused sizing, spacing, accessible focus states

## Project Structure (key folders)

```text
src/
  assets/           # static assets (icons, images)
  components/       # shared UI components (add as needed)
  config/           # constants, environment mappings
  context/          # React context providers (Auth)
  hooks/            # custom hooks (useAuth, etc.)
  pages/            # route pages
  routes/           # routing setup (AppRoutes, ProtectedRoute)
  services/         # firebase and other service singletons
  styles/           # CSS entry + custom overrides
  utils/            # helper utilities (fetch client)
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values. All variables exposed to client must start with `VITE_`.

| Variable | Purpose |
|----------|---------|
| VITE_APP_NAME | Branding / display name |
| VITE_FIREBASE_* | Standard Firebase web config |
| VITE_WECHAT_APP_ID | Your WeChat official account AppID |
| VITE_WECHAT_REDIRECT_URI | OAuth redirect URL (must match WeChat config) |
| VITE_API_BASE_URL | Backend base URL (used for token exchange / API) |

## WeChat OAuth Flow (Intended)

1. User clicks Continue with WeChat -> redirect to WeChat authorize endpoint.
2. WeChat redirects back to `/wechat/callback?code=...&state=...`.
3. Front-end calls backend endpoint (not implemented here) with the code.
4. Backend exchanges code for access token + openid, creates (or finds) user, returns a Firebase Custom Token.
5. Front-end uses `signInWithCustomToken` (replace placeholder code) to complete auth.

The included placeholder uses an `OAuthProvider('wechat')` attempt which will fail unless you implement a compatible provider—replace this with the custom token logic.

## Replace Placeholder Logic

In `AuthContext.jsx`:

- Remove OAuthProvider placeholder block.
- Add real fetch to your backend and call `signInWithCustomToken`.

## Running Locally

```bash
pnpm install # or npm install / yarn
pnpm run dev
```

Open: <http://localhost:5173>

## Building

```bash
pnpm run build
pnpm run preview
```

## Linting

Eslint is configured minimally. Adjust rules to your standards.

```bash
pnpm run lint
```

## Accessibility & Mobile Notes

- Custom tighter breakpoints for early layout adjustments (sm=420px, md=640px).
- Base font size slightly reduced, adjust in `_variables.scss` if needed.
- Buttons have focus-visible outline for keyboard users.

## Next Steps (Suggested Enhancements)

- Add global error boundary / toasts.
- Integrate React Query or SWR for data fetching caching.
- Add offline persistence for Firestore if required.
- Implement actual WeChat -> backend -> Firebase custom token flow.
- Add unit tests (Jest + React Testing Library) when logic grows.
- Add CI (GitHub Actions) for lint + build.

## License

MIT (add LICENSE file if open sourcing).
