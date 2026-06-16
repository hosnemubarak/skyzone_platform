# Sky Zone Platform — Environment Configuration Guide

This document describes how configuration values and environment variables (`.env`) are loaded, validated, and managed across the Sky Zone platform. 

---

## 1. Centralized Configuration Pattern

To prevent hardcoded secrets, API endpoints, or environment-specific values in the code, the platform uses a centralized configuration pattern:

### A. Django Backend (`config/env.py`)
All environment variables are parsed, cast to correct Python types (boolean, integer, list), validated, and loaded centrally in [config/env.py](file:///D:/personal/skyzone_platform/backend/config/env.py).
Other backend settings import directly from this file (e.g. `from config import env`) rather than invoking `os.getenv` directly.

**Production Safeguard**: If `DEBUG` is set to `False` (Production mode) and the `SECRET_KEY` environment variable is not defined, the manager immediately throws a `ImproperlyConfigured` exception to block insecure container deployments.

### B. Next.js Frontend (`src/config/env.ts`)
The frontend environment variables are loaded and validated in [src/config/env.ts](file:///D:/personal/skyzone_platform/frontend/src/config/env.ts).
- `NEXT_PUBLIC_API_URL` determines the API base URL. It has built-in context-aware fallbacks that distinguish between server-side rendering (SSR), local browser sessions (`localhost`), and production deployments.

---

## 2. Environment Variables Directory

| Variable Name | Component | Purpose | Status | Default Value | Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SECRET_KEY` | Backend | Cryptographic signing key for Django sessions, tokens, etc. | **Required** (Prod) | Insecure Dev Default | `d98b...` |
| `DEBUG` | Backend | Enables verbose error pages and debugging logs. | Optional | `False` | `True` |
| `ALLOWED_HOSTS` | Backend | List of hostnames Django is allowed to serve. | Optional | `localhost,127.0.0.1` | `api.skyzoneintl.com` |
| `CORS_ALLOWED_ORIGINS` | Backend | List of origins allowed to execute cross-site HTTP requests. | Optional | `http://localhost:3000` | `https://skyzoneintl.com` |
| `CSRF_TRUSTED_ORIGINS` | Backend | Trusted origins list for secure POST request verification. | Optional | `https://api.skyzoneintl.com` | `https://skyzoneintl.com` |
| `DATABASE_URL` | Backend | Database connection string. Precedes separate settings. | Optional | None | `postgres://user:pass@db:5432/db` |
| `DB_NAME` | Backend | PostgreSQL database name (when DATABASE_URL is not used). | Optional | `skyzone_db` | `skyzone_prod` |
| `DB_USER` | Backend | PostgreSQL username. | Optional | `skyzone_user` | `skyzone_admin` |
| `DB_PASSWORD` | Backend | PostgreSQL user password. | Optional | `super_secure...` | `p@ssword123` |
| `DB_HOST` | Backend | Database hostname within Docker or external. | Optional | `db` | `127.0.0.1` |
| `DB_PORT` | Backend | Database port. | Optional | `5432` | `5432` |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | Backend | Lifetime duration for SimpleJWT access tokens. | Optional | `15` | `30` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | Backend | Lifetime duration for SimpleJWT refresh tokens. | Optional | `7` | `14` |
| `RECAPTCHA_ENABLED` | Backend | Enables Google reCAPTCHA v3 verification for admin login. | Optional | `False` | `True` |
| `RECAPTCHA_SITE_KEY` | Backend | Google reCAPTCHA v3 public site key (for backend validation). | Optional | `""` | `6Ld...` |
| `RECAPTCHA_SECRET_KEY` | Backend | Google reCAPTCHA v3 private secret key. | Optional | `""` | `6Ld...` |
| `AXES_ENABLED` | Backend | Toggles brute-force protection middleware. | Optional | `True` | `False` |
| `AXES_FAILURE_LIMIT` | Backend | Failed attempts allowed before triggering lockout. | Optional | `5` | `3` |
| `AXES_COOLOFF_TIME_HOURS` | Backend | Lockout duration period. | Optional | `1` | `24` |
| `AXES_RESET_ON_SUCCESS` | Backend | Resets failure counters upon a successful login. | Optional | `True` | `False` |
| `NEXT_PUBLIC_API_URL` | Frontend | API URL pointing to the Django REST backend. | **Required** | Context Fallbacks | `https://api.skyzoneintl.com/api` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Frontend | Google reCAPTCHA public site key loaded in browser. | Optional | `""` | `6Ld...` |
| `TZ` | Mail / Ops | Operating system timezone for Poste.io mail container. | Optional | `Asia/Dhaka` | `Asia/Dhaka` |
| `MAIL_PORT` | Mail / Ops | Host port mapped to proxy unexposed Poste.io admin page. | **Required** | `8080` | `8010` |

---

## 3. Environment Integration & Best Practices

### Local Development
1. Copy the master [.env.example](file:///D:/personal/skyzone_platform/.env.example) to `.env` in the root workspace.
2. In local environments, the backend `dotenv` package will automatically load this file when starting via `python manage.py runserver`.
3. If running Next.js locally, it will read `NEXT_PUBLIC_*` settings from the root `.env` or you can configure a local `.env.local` inside the `frontend` folder.

### Staging & Production VPS
In a production deployment, the Docker Compose orchestrator handles injecting these variables into the containers:
1. Copy `.env.example` to `.env` on your VPS.
2. In [docker-compose.yml](file:///D:/personal/skyzone_platform/docker-compose.yml), the `env_file: .env` configuration maps variables into the containers.
3. For Next.js environment variables (which must be baked in during container build time since it compiles statically), variables like `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` are passed as **Build Arguments** (`args`) during `docker compose build`.

---

## 4. Docker Compose Environment Reference

```yaml
  backend:
    build: ./backend
    env_file: .env  # Inject env variables at runtime
    ...

  frontend:
    build:
      context: ./frontend
      args:
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://api.skyzoneintl.com/api}
        - NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY:-}
    env_file: .env
    ...
```
