# Biomedical Engineering — Department Portal

The **master website** for the Department of Biomedical Engineering, KPRIET — a public
notice / announcement / events board with an admin panel, built by BMESI. It is the
department's front door and links out to the sibling sub-sites (BioMed Hub, BMESI Platform).

- **Frontend:** React (Vite) — a static single-page app, hosted free on **GitHub Pages**.
- **Backend:** **Supabase** (hosted) — auth, Postgres database and file storage, called
  directly from the browser. No server to run.
- **Roles (v1):** one **admin** posts content; everyone else views publicly.

> Runs in **demo mode** out of the box (bundled sample data, no login) until you connect
> Supabase. A green banner at the top tells you which mode you're in.

## Quick start (local)

```bash
cd biomed-dept-portal
npm install
npm run dev          # http://localhost:5174
```

That's demo mode — good for previewing. To go live, connect Supabase below.

## Going live with Supabase (one-time, ~15 min)

1. Create a free project at <https://supabase.com>.
2. **SQL Editor → New query →** paste all of [`supabase/schema.sql`](supabase/schema.sql) → Run.
   (Creates the tables, row-level security and storage buckets.)
3. Copy `.env.local.example` to `.env.local` and fill in your **Project URL** and **anon key**
   (Supabase → Project Settings → API).
4. Restart `npm run dev`. The demo banner disappears — you're live.
5. **Become the admin:** open `/#/admin`, click *Create account*, sign up with your email.
   Then in the Supabase SQL Editor run the first `INSERT` in
   [`supabase/seed.sql`](supabase/seed.sql) with that email. (The rest of `seed.sql` is
   optional sample content.) Sign in — you now reach the dashboard.

The anon key is **safe to expose** in a static site: writes are blocked by row-level
security, not by hiding the key.

## Posting content (admin)

1. Go to `/#/admin`, sign in.
2. Pick a section on the left (Notices, Announcements, Events, Achievements, Calendar,
   Downloads, Gallery).
3. **Add** → fill the form → **Save**. It appears on the public site immediately.
   - **Upload a PDF/poster:** use the *Choose file* button in the form — it uploads to
     Supabase Storage and links automatically.
   - **Pin** a notice to keep it at the top.
   - **Emergency** announcements show as a red banner across the whole site.

## Adding more admins (self-serve)

1. The new person signs up themselves at `/#/admin` → *Create account*. Their account exists
   but can't do anything yet.
2. An existing admin opens `/#/admin/dashboard` → **Admins** (bottom of the sidebar) → enters
   their email under *Grant access*. They can sign in as an admin immediately.
3. **Revoke** works the same way — remove someone's row and their login still works, but they
   drop back to view-only. You can't revoke your own access (to avoid locking everyone out).

No SQL editor needed for this — it's backed by `grant_admin` / `revoke_admin` / `list_admins`
functions in [`supabase/schema.sql`](supabase/schema.sql), which check the caller is already an
admin before doing anything.

## Deploy to GitHub Pages

1. Push this folder to a new GitHub repo (see below).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Repo **Settings → Secrets and variables → Actions** → add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`.
4. Push to `main`. The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
   builds and publishes automatically. Your site: `https://<user>.github.io/<repo>/`.

The app uses `HashRouter`, so deep links (e.g. `.../#/notices`) work on Pages with no extra
config. `VITE_BASE` is set to the repo name automatically by the workflow.

## Project layout

```
biomed-dept-portal/
├── index.html
├── vite.config.js                # base + tailwind + react plugins
├── src/
│   ├── main.jsx / App.jsx         # entry + routes (HashRouter)
│   ├── index.css                  # bio-signal design tokens & components
│   ├── lib/                       # supabase client, api CRUD, auth, hooks, format
│   ├── data/                      # sub-site links + demo sample data
│   ├── components/                # Nav, Footer, carousels, UI primitives, icons
│   └── pages/                     # public pages + pages/admin (login, dashboard)
├── supabase/
│   ├── schema.sql                 # tables + RLS + storage buckets
│   └── seed.sql                   # admin bootstrap + sample rows
└── .github/workflows/deploy.yml   # GitHub Pages CI
```

## Not in v1 (planned next)

Parent-email broadcasting, faculty/student/parent logins, and a custom domain — deferred to
Phase 2. Editing sub-site URLs: [`src/data/subsites.js`](src/data/subsites.js).
