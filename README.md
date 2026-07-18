# Web Tools Hub

A collection of fast, privacy-friendly web utilities. Built with [Astro](https://astro.build) and deployed to Cloudflare Pages with SSR support via `@astrojs/cloudflare`. All tool logic runs locally in the browser — files and input never leave the device.

## Tools

| Route        | Tool                   | Description                                                     |
| :----------- | :--------------------- | :------------------------------------------------------------- |
| `/`          | Hub                    | Landing page listing all tools.                                |
| `/base64`    | Base64 Encoder/Decoder | Encode/decode UTF-8 strings.                                   |
| `/uuid`      | UUID Generator         | Generate v4 UUIDs via the Web Crypto API.                     |
| `/sing-box`  | Proxy Config Studio    | Visually edit Sing-box (JSON) and Clash (YAML) config files.  |
| `/api/ping`  | Health check           | Returns `pong`; optionally protected by an API key (see below).|

## Requirements

- **Node.js >= 24** (pinned in `.node-version`).
- Astro is locked to `^5.0.0` because `@astrojs/cloudflare` peer-depends on it. Avoid upgrading blindly — the Cloudflare CI `npm install` will fail with `ERESOLVE` otherwise.

## Commands

All commands run from the project root:

| Command             | Action                                            |
| :------------------ | :------------------------------------------------ |
| `npm install`       | Install dependencies                              |
| `npm run dev`       | Start the dev server at `localhost:4321`          |
| `npm run build`     | Build the production site to `./dist/`            |
| `npm run preview`   | Preview the production build locally              |
| `npm run release`   | Bump version and push a git tag via `release-it`  |

## Project Structure

```text
/
├── public/               # Static assets & global styles
│   ├── style.css         # Global design tokens + layout
│   └── base64-style.css  # Shared tool components (.panel, .btn, ...)
├── src/
│   └── pages/
│       ├── index.astro   # Hub
│       ├── base64.astro
│       ├── uuid.astro
│       ├── sing-box.astro
│       └── api/
│           └── ping.ts   # Example protected API route
├── astro.config.mjs      # Astro + Cloudflare adapter (output: 'server')
├── AGENTS.md             # Contributor / agent conventions
└── CLAUDE.md             # Imports AGENTS.md for Claude Code
```

Each `.astro` file in `src/pages/` maps to a route by filename. New tools should follow the design conventions in [AGENTS.md](./AGENTS.md): a minimal text-only `<header>`, a `<main class="tool-interface">` wrapper, `.panel` cards, and the standard `.btn` / `.icon-btn` styles.

## API Key Protection

The `/api/ping` route demonstrates optional Bearer / `X-API-Key` auth. Set `API_KEY`:

- **Local:** create a `.env` file with `API_KEY=your-secret`.
- **Production:** add `API_KEY` under Cloudflare Pages → Settings → Environment variables (encrypt it), then **Retry deployment** for it to take effect.

If `API_KEY` is unset, the endpoint is open. See [AGENTS.md](./AGENTS.md) for full details.

## Releasing

The project is not published to npm. Version bumps and git tags are managed with `release-it`:

```sh
npx release-it patch --ci --npm.publish=false
```

Keep the `version` in `package.json` in sync — the hub footer (`index.astro`) reads it directly.
