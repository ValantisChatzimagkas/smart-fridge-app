# Smart Fridge App

[![CI](https://github.com/ValantisChatzimagkas/smart-fridge-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ValantisChatzimagkas/smart-fridge-app/actions/workflows/ci.yml)

Track the ingredients in your fridge and see which are expired or close to expiring, to reduce food waste.

## Features

- Create, edit and delete ingredients (name, quantity and unit, opened and expiry dates, category tags).
- Each ingredient carries an expiry status: `not_expired`, `close_to_expire` or `expired`.
- Filter the list by one or more statuses.
- REST API with interactive OpenAPI docs and a `/health` endpoint.

The UI currently lists, edits, deletes and filters ingredients. Creating them is only possible through the API (`POST /ingredient/new`). Status is stored as submitted; it is not yet derived from the expiry date.

## Architecture

- `app/`: FastAPI service. Routers in `app/routers`, persistence in `app/db` using Beanie (async MongoDB ODM), models in `app/models`, environment-based configuration in `app/settings.py`.
- `smart-fridge-app-ui/`: React 19, TypeScript, Vite and Tailwind single-page app that talks to the API over HTTP and is served by nginx in Docker.
- `docker-compose.yml` runs the backend, MongoDB and the UI.

## Getting started

```bash
cp .env.example .env   # set MONGO_PASSWORD
docker compose up --build
```

- UI: http://localhost:5173
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

Host ports, Mongo credentials, allowed CORS origins and the API URL used by the UI are all set in `.env`. If you change `API_PORT` or `UI_PORT`, update `VITE_API_URL` and `CORS_ORIGINS` to match.

## Running tests

Backend (requires [uv](https://docs.astral.sh/uv/)):

```bash
uv sync
uv run pytest -q
uvx ruff@0.17.6 check .
```

UI:

```bash
cd smart-fridge-app-ui
npm ci
npm run lint
npm run build
```

The backend tests do not need MongoDB. They cover settings, the partial-update logic and request validation; routes that read or write the database are not covered yet.

## Design decisions

- Async stack end to end (FastAPI, Beanie, Motor) so request handling does not block on I/O.
- Configuration comes from environment variables only; no credentials live in the repository.
- Dependencies are managed with uv and a committed lockfile; the Docker image installs from it with `--frozen`.
- The UI API base URL is fixed at build time through `VITE_API_URL`, which keeps the static bundle simple to serve.

## Roadmap

- Form in the UI to register ingredients.
- Compute ingredient status from the expiry date instead of trusting the client.
- Integration tests for the database-backed routes.
- Authentication and per-user data.
- Barcode lookup via Open Food Facts (an earlier prototype was removed because it was broken and unused).
- Expiry notifications.

## License

[MIT](LICENSE)
