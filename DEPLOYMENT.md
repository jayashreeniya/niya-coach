# Deployment

Repository: `github.com/jayashreeniya/niya-coach`

Nothing here is hosted on Azure. Older documents in this repo describe Azure
Static Web Apps and `swa deploy`; that is historical and no longer accurate.

## What runs where

| Component | Directory | Platform | Deploy trigger |
| --- | --- | --- | --- |
| Booking web app | `Niya-Web-main/` | Cloudflare Pages, project `niya-booking` | Manual build + upload |
| Backend API | `back-end/` | Render, service `niya-backend` | Push to `master` |
| Practice app | `niya-practice/` | Render, service `niya-practice` | Push to `master` |
| Triage engine | `niya-triage-engine/` | Render, created manually in the dashboard | Not in `master`'s Blueprint |

Live URLs:

- `https://book-appointment.niya.app` — CNAME to `niya-booking.pages.dev`
- `https://niya-backend-oiut.onrender.com` — the API the web and mobile apps call

## Backend API (Render)

Render reads `render.yaml` at the repo root as a Blueprint and deploys from the
`master` branch. Pushing to `master` is the whole deploy process.

```bash
git push origin master
```

Note that `master`'s `render.yaml` defines only `niya-backend` and
`niya-practice`. The triage services were created by hand in the dashboard and
are not managed by this Blueprint, so changes to their config must be made in
the dashboard.

Two things that are easy to get wrong:

- Changes to instance type (`plan:`) or other service settings require a
  **Blueprint sync**, which Render will not apply silently because it affects
  billing. Look for a pending sync under Blueprints.
- Environment variables marked `sync: false` are not in this file. They live in
  the Render dashboard and must be set there.

Working branches are often far ahead of `master` with unrelated work. To ship
only a specific fix, build the commit on top of `origin/master` in a throwaway
worktree rather than pushing a whole branch:

```bash
git worktree add ../deploy-tmp origin/master --detach
cd ../deploy-tmp
git cherry-pick <commit>
git push origin HEAD:master
cd - && git worktree remove ../deploy-tmp
```

Verify a deploy landed by calling a route that only exists in the new code. A
404 means the old build is still serving; any other status means the route
exists:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -d '{}' \
  https://niya-backend-oiut.onrender.com/bx_block_calendar/booked_slots/validate_slot
```

On a free instance the first request after ~15 minutes idle can take over two
minutes while the service wakes. Paid instance types do not spin down and also
grant shell access, which free instances lack.

## Booking web app (Cloudflare Pages)

This is **not** wired to git. It is a manual build and upload, so the deployed
site can drift from the repository unless the source is committed deliberately.

```bash
cd Niya-Web-main
npm run build
```

Then upload the **contents** of `Niya-Web-main/build` to the `niya-booking`
project. Uploading the `build` folder itself nests everything under `/build/`
and serves nothing.

The custom domain follows the deployment badged **Production**. A direct upload
can land as a **Preview** instead, in which case the site does not change until
you open Manage deployment and promote it. This is the most common reason an
upload appears to do nothing.

`public/_redirects` contains the SPA fallback and must survive into the build,
otherwise `/payment-success` and other client-side routes 404 on a direct hit:

```
/*    /index.html   200
```

### Confirming what is actually live

Every build produces a content-hashed bundle, so the hash identifies the
version precisely. Read it from the served HTML:

```bash
curl -s https://book-appointment.niya.app/ | grep -o 'main\.[a-z0-9]*\.js'
```

Compare that to `Niya-Web-main/build/index.html` locally. If they differ, the
upload did not become the production deployment. `Cache-Control` on this site is
`max-age=0, must-revalidate`, so a stale response is not a CDN caching problem.

### Recording production versions

Because deploys are manual, commit the source that produced a build and pin it
to a branch, so there is always an answer to "what is in production":

```bash
git branch production-web-<yyyymmdd>
git push -u origin production-web-<yyyymmdd>
```

Put the bundle hash in the commit message so the branch maps unambiguously to
the deployed artifact. Current example: `production-web-20260825` corresponds to
bundle `main.11ce4f3a.js`.

Such a branch is only authoritative for the directory that was deployed from
it. A branch pinned for the web app may also carry backend work that is not in
production, since the backend ships from `master` independently.

## Storage

Uploads go to Cloudflare R2 through Active Storage. The service is chosen by
`STORAGE_SERVICE`, set to `cloudflare` in `render.yaml`, and resolved in
`back-end/config/environments/production.rb`. Credentials (`R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT`) are dashboard-only.
