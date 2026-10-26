# Agent instructions — tic-tac-toe repo

## Deployment

- Hosted on **Netlify free tier**: `https://nkunal-tic-tac-toe.netlify.app`
  (site id `37a675f3-2f37-4afd-b621-f18362cc4b82`, account `nkunal1992`).
- Auto-deploy: `.github/workflows/deploy.yml` runs on every push to `main` —
  `npm ci` → lint → test → build → `netlify deploy --prod --dir=dist`.
- Required GitHub secrets: `NETLIFY_AUTH_TOKEN` (user's Netlify PAT — if
  rotated, update via `gh secret set NETLIFY_AUTH_TOKEN`), `NETLIFY_SITE_ID`.
- `.netlify/state.json` (local site link) is gitignored — do not commit.
- Free-tier ceilings: 100GB/mo Netlify bandwidth; builds run in Actions
  (unlimited on public repos) so Netlify build credits are not consumed.

## Development

- `npm run dev` / `npm run test` (Vitest) / `npm run lint` (oxlint) /
  `npm run build` (`tsc -b && vite build`) — all must stay green.
- Game rules live as pure functions in `src/game/` — keep them React-free
  and unit-tested.
