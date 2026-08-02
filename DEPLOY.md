# Web deploy (VPS)

Push to `main` (or run **Actions → Deploy Web to VPS → Run workflow**) builds the Vite app and rsyncs `dist/` to:

`/opt/agrisense/deploy/web/` on your VPS host (configured via the `VPS_HOST` secret).

Nginx already serves that folder at `/` and proxies `/api` to Nest. No container rebuild needed for frontend-only changes.

## One-time GitHub secrets

Repo → **Settings → Secrets and variables → Actions** → add:

| Secret | Value |
|---|---|
| `VPS_HOST` | Your server's IP or hostname |
| `VPS_PORT` | SSH port (e.g. `22`) |
| `VPS_USER` | Deploy user (e.g. `deploy`) |
| `VPS_SSH_KEY` | Full private key for the deploy user (including `-----BEGIN ... PRIVATE KEY-----`) |

## Deploy key

A dedicated key `agrisense-web-deploy` should exist on the VPS in `/root/.ssh/authorized_keys`. The matching private key is what you paste into `VPS_SSH_KEY`.

## Local test of the same path

```bash
npm ci
npx vite build
# Replace the placeholders with your own values (kept in GitHub secrets, not in the repo).
rsync -az --delete -e "ssh -p ${VPS_PORT}" dist/ "${VPS_USER}@${VPS_HOST}:/opt/agrisense/deploy/web/"
```
