# SQL Injection — 2-minute demo app

A tiny self-contained web app to demo SQL Injection during a presentation.
Runs **locally** with Node + Express, **and** deploys as a fully static site
to GitHub Pages (SQLite runs in the browser via `sql.js` / WebAssembly).

## What's inside

- 3 seeded users in an in-memory SQLite DB:
  - `alice / wonderland` (user)
  - `bob / builder123` (user)
  - `admin / sup3rS3cret!` (admin — the juicy target)
- Login form with two modes:
  - 🔥 **Vulnerable** — string concatenation
  - ✅ **Safe** — parameterized query
- One-click attack payload buttons (`admin' --`, `' OR '1'='1' --`)
- Shows the **actual SQL** that ran, so the audience sees *why* it broke
- Educational "What just happened?" panel that explains parameterization
- A **How it works** page with pictorial diagrams + defense checklist

## Run locally (with Node)

```powershell
npm install
npm start
```

Open http://localhost:3000

## Host on GitHub Pages

The `public/` folder is fully static — SQLite runs in the browser via `sql.js`.

1. Push this folder to a GitHub repo (e.g. `<your-username>/sql-injection-demo`).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow at `.github/workflows/deploy-pages.yml` publishes `public/` on every push to `main`.
4. The site will be available at `https://<username>.github.io/<repo>/`.

## Suggested 90-second script

1. Click **Normal login (alice)** → ✅ logs in as user.
2. Click **Login as admin `admin' --`** → 💥 BREACH banner. Point at the SQL.
3. Flip toggle to **✅ Safe (parameterized)** → click the same payload
   → ❌ login fails, and the panel explains *why* parameterization stops it.
4. (Optional) Open **How it works** for the diagram + defenses.

> ⚠️ The "vulnerable" path is intentionally insecure. It runs entirely in the
> visitor's own browser — there is no real shared database or user data.
