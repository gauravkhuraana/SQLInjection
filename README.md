# SQL Injection — 2-minute demo app

A tiny self-contained **static** web app to demo SQL Injection (and its fix) during a
presentation. SQLite runs entirely in the visitor's browser via `sql.js` /
WebAssembly — no server, no install, no database to set up. Just open `public/index.html`.

## What's inside

- 3 seeded users in an in-browser SQLite DB:
  - `alice / wonderland` (user)
  - `bob / builder123` (user)
  - `admin / sup3rS3cret!` (admin — the juicy target)
- Login form with two modes:
  - 🔥 **Vulnerable** — string concatenation
  - ✅ **Safe** — parameterized query
- One-click attack payloads covering the four shapes of SQLi:
  - **Auth bypass** — `' OR '1'='1' --`
  - **Login as admin** — `admin' --`
  - **Data exfiltration** — `' UNION SELECT id, username, password, secret FROM users --`
  - **Data tampering** — `'; UPDATE users SET password='pwn3d' WHERE username='admin'; --`
- Shows the **actual SQL** that ran, the rows returned, and a live view of the
  `users` table so tampering attacks are visible
- Educational "What just happened?" panel that adapts to which attack you ran
- A **How it works** page with pictorial diagrams + defense checklist
- **Reset demo** button restores the DB between attacks
- **Copy SQL** button to grab the executed query for slides

## Run locally

Any static file server works. The simplest:

```powershell
npm start
```

(That just runs `npx http-server public -c-1 -p 3000` — no dependencies to install.)

Or open `public/index.html` directly in a browser. Or use Python:

```powershell
python -m http.server -d public 3000
```

Then open <http://localhost:3000>.

## Host on GitHub Pages

The `public/` folder is fully static.

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow at `.github/workflows/deploy-pages.yml` publishes `public/` on
   every push to `main`.
4. The site will be available at `https://<username>.github.io/<repo>/`.

## Suggested 2-minute script

1. Click **Normal login (alice)** → ✅ logs in as user.
2. Click **Login as admin `admin' --`** → 💥 BREACH banner. Point at the SQL.
3. Click **💀 Steal all passwords** → multi-row data leak. Now show the audience
   the passwords appearing in the username column.
4. Click **🔧 Tamper data** → look at the *Current state of the users table*
   panel: admin's password just changed to `pwn3d`. Hit **Reset demo**.
5. Flip toggle to **✅ Safe (parameterized)** → click the same payloads → all
   fail. The explainer panel says why.
6. (Optional) Open **How it works** for the diagrams + full defense checklist.

## Security notes

- The "vulnerable" path is intentionally insecure. It runs entirely in the
  visitor's own browser — there is no real shared database or user data.
- Passwords are stored in plaintext **on purpose** so the UNION attack visibly
  leaks them. Real apps must hash with `bcrypt` / `argon2` — see the defense
  checklist on the **How it works** page.
- The `sql.js` script is loaded from cdnjs with an SRI (Subresource Integrity)
  hash so a compromised CDN can't silently swap the payload.

## Credits

Made by [gauravkhurana.com](https://gauravkhurana.com) for the community.
MIT licensed — fork it, present it, improve it.
