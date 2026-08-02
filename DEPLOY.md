# Web deploy (VPS)

Push to `main` (or run **Actions → Deploy Web to VPS → Run workflow**) builds the Vite app and rsyncs `dist/` to:

`/opt/agrisense/deploy/web/` on `102.202.208.198`

Nginx already serves that folder at `/` and proxies `/api` to Nest. No container rebuild needed for frontend-only changes.

## One-time GitHub secrets

Repo → **Settings → Secrets and variables → Actions** → add:

| Secret | Value |
|---|---|
| `VPS_HOST` | `102.202.208.198` |
| `VPS_PORT` | `222` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | Full private key for the deploy user (including `-----BEGIN ... PRIVATE KEY-----`) |

## Deploy key

A dedicated key `agrisense-web-deploy` should exist on the VPS in `/root/.ssh/authorized_keys`. The matching private key is what you paste into `VPS_SSH_KEY`.

## Local test of the same path

```bash
npm ci
npx vite build
rsync -az --delete -e 'ssh -p 222' dist/ root@102.202.208.198:/opt/agrisense/deploy/web/
```
