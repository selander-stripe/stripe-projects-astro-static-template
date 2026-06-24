# Astro Portfolio + Blog

A basic personal website built with [Astro](https://astro.build) — a **landing page**, a **portfolio**, and a **blog** — with four services wired in via [Stripe Projects](https://github.com/stripe/projects-template-registry):

| Service | Provider | What it powers |
| --- | --- | --- |
| Analytics | **PostHog** | Pageview analytics on every page (`src/components/BaseHead.astro`) |
| Search | **Algolia** | Search across blog posts (`src/pages/blog/index.astro`) |
| Contact form | **Supabase** | Stores messages from the landing-page form (`src/pages/index.astro`) |
| Hosting | **Netlify** | Static hosting + deploy (`netlify.toml`, `npm run deploy`) |

Built on Astro's official MIT-licensed blog starter. Styling is plain, scoped CSS — no Tailwind, no UI framework.

## Pages

- `/` — landing page with intro + contact form (`src/pages/index.astro`)
- `/portfolio` — project grid (`src/pages/portfolio.astro`)
- `/blog` — post list with search (`src/pages/blog/index.astro`)
- `/blog/<slug>/` — individual posts from `src/content/blog/`
- `/about` — about page (`src/pages/about.astro`)

## Quick start

```sh
npm install
npm run dev          # http://localhost:4321
```

The site runs fine **without** any services configured — each integration
degrades gracefully (analytics no-ops, the search box is hidden, the contact
form shows a setup notice).

## Provisioning the services

This template is designed to be built through Stripe Projects, which provisions
the services and writes credentials to a local `.env`:

```sh
stripe projects init
stripe projects add posthog/analytics
stripe projects add algolia/application
stripe projects add supabase/project
stripe projects add netlify/project
```

To configure manually instead, copy `.env.example` to `.env` and fill in the
values. See `.env.example` for the full list of variables and which are safe to
expose in the browser.

> **Env var names:** the code reads provider-standard names (e.g.
> `POSTHOG_API_KEY`, `ALGOLIA_APP_ID`, `SUPABASE_URL`, `NETLIFY_AUTH_TOKEN`).
> If the names Stripe Projects writes to your `.env` differ, reconcile them in
> `.env.example` and the matching frontmatter (`import.meta.env.*`).

### How credentials reach the browser

Public keys (PostHog project key, Algolia search-only key, Supabase URL + anon
key) are read at **build time** in `.astro` frontmatter via `import.meta.env.*`
and passed to client scripts through `data-*` attributes / `<meta>` tags. This
lets the code use the exact names Stripe Projects writes without needing a
`PUBLIC_` prefix. Secret keys (Algolia **admin** key, Supabase **service role**
key, Netlify token) are only ever used in server-side scripts.

## Per-service setup

- **PostHog** — set `POSTHOG_API_KEY` (+ optional `POSTHOG_HOST`). Analytics
  initialize automatically on every page.
- **Supabase** — create the contact-form table once:
  ```sh
  supabase db execute --file supabase/schema.sql
  ```
  (or paste `supabase/schema.sql` into the Supabase SQL editor). RLS lets the
  anon key insert messages but not read them.
- **Algolia** — push your posts to the index whenever they change:
  ```sh
  npm run index
  ```
  Uses the admin key server-side; the blog page searches with the search-only key.
- **Netlify** — deploy the built site:
  ```sh
  npm run deploy
  ```
  Builds and pushes `dist/` using `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID`. Or
  connect the repo in the Netlify UI (it reads `netlify.toml`).

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site to `dist/` |
| `npm run preview` | Preview the build locally |
| `npm run index` | Index blog posts into Algolia |
| `npm run deploy` | Build and deploy to Netlify |

## Customize

- Set your name/description in `src/consts.ts`.
- Edit the landing copy in `src/pages/index.astro`.
- Replace the projects in `src/pages/portfolio.astro`.
- Add posts as Markdown/MDX in `src/content/blog/`.
- Update nav links in `src/components/Header.astro`.

## Publishing to the registry

This repo is the template; the registry entry lives separately in
[`stripe/projects-template-registry`](https://github.com/stripe/projects-template-registry).
A ready-to-submit manifest is at
[`registry/static_site/astro-portfolio-blog.yaml`](registry/static_site/astro-portfolio-blog.yaml).
Copy it into the registry repo, set `repo` to this repo's URL, pin `ref` to a
commit, and open a PR. The in-repo `projects-template.yaml` mirrors that
manifest.

## License

MIT. Based on the Astro blog starter (MIT).
