# Astro Portfolio + Blog

A personal website built with [Astro](https://astro.build) — a **landing page**, a **portfolio**, and a **blog**, with analytics, blog search, a contact form, and one-command deploys built in.

| Feature | Powered by | Where |
| --- | --- | --- |
| Analytics | PostHog | `src/components/BaseHead.astro` |
| Blog search | Algolia | `src/pages/blog/index.astro` |
| Contact form | Supabase | `src/pages/index.astro` |
| Hosting / deploy | Netlify | `netlify.toml`, `npm run deploy` |

Plain, scoped CSS — no Tailwind, no UI framework.

## Pages

- `/` — landing page with intro + contact form
- `/portfolio` — project grid (`src/pages/portfolio.astro`)
- `/blog` — post list with search; posts live in `src/content/blog/`
- `/about` — about page

## Quick start

```sh
npm install
npm run dev          # http://localhost:4321
```

The site runs fine **without** any services configured — analytics no-op, the
search box is hidden, and the contact form shows a setup notice until you add
credentials.

## Configuration

Copy `.env.example` to `.env` and fill in the values for the services you want.
The file lists every variable and notes which keys are safe to expose in the
browser.

Public keys (PostHog project key, Algolia search-only key, Supabase URL + anon
key) are read at build time in `.astro` frontmatter and passed to the client.
Secret keys (Algolia admin key, Supabase service-role key, Netlify token) are
only ever used server-side.

### Per-service setup

- **PostHog** — set `POSTHOG_API_KEY` (and optionally `POSTHOG_HOST`). Analytics
  initialize on every page.
- **Supabase** — create the contact-form table once, then the form works:
  ```sh
  supabase db execute --file supabase/schema.sql
  ```
  (or paste `supabase/schema.sql` into the SQL editor). Row Level Security lets
  the anon key insert messages but not read them.
- **Algolia** — index your posts (re-run whenever posts change):
  ```sh
  npm run index
  ```
- **Netlify** — deploy the site:
  ```sh
  npm run deploy
  ```
  Or connect the repo in the Netlify UI (it reads `netlify.toml`).

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site to `dist/` |
| `npm run preview` | Preview the build locally |
| `npm run index` | Index blog posts into Algolia |
| `npm run deploy` | Build and deploy to Netlify |

## Customize

- Set your name and description in `src/consts.ts`.
- Edit the landing copy in `src/pages/index.astro`.
- Replace the projects in `src/pages/portfolio.astro`.
- Add posts as Markdown/MDX in `src/content/blog/`.
- Update nav links in `src/components/Header.astro`.

## License

MIT. Based on the Astro blog starter (MIT).
