# Application Tracker API

FastAPI backend for the Application Tracker. It serves auth, companies, job posts, and applications, and stores data in PostgreSQL.

## Prerequisites

- [Python 3.13+](https://www.python.org/downloads/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- [PostgreSQL](https://www.postgresql.org/download/)

## Setup

From the `backend` directory:

```bash
uv sync
```

Create a `.env` file in `backend` (this file is gitignored):

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/application_tracker
JWT_SECRET_KEY=replace-with-a-long-random-string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | — | SQLAlchemy URL. Use the `postgresql+psycopg` driver. |
| `JWT_SECRET_KEY` | yes | — | Secret used to sign access and refresh tokens. |
| `JWT_ALGORITHM` | no | `HS256` | JWT signing algorithm. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | no | `15` | Access token lifetime. |
| `REFRESH_TOKEN_EXPIRE_DAYS` | no | `7` | Refresh token lifetime. |

Create the database if it does not exist yet, then apply migrations:

```bash
uv run alembic upgrade head
```

To generate a new migration after model changes:

```bash
uv run alembic revision --autogenerate -m "describe the change"
```

## Start the server

```bash
uv run backend
```

The API runs with reload at [http://127.0.0.1:8000](http://127.0.0.1:8000). Stop it with `Ctrl+C`.

The frontend calls this server at `http://127.0.0.1:8000` unless `NEXT_PUBLIC_API_URL` is set. CORS allows `http://localhost:3000` and `http://127.0.0.1:3000`.

## Links

Once the server is running:

| | |
| --- | --- |
| API root | [http://127.0.0.1:8000](http://127.0.0.1:8000) |
| Health check | [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) |
| Swagger UI | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| ReDoc | [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc) |
| OpenAPI schema | [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json) |

## API

All routes are under `/api/v1`.

| Area | Prefix | Notes |
| --- | --- | --- |
| Auth | `/api/v1/auth` | `POST /signup`, `POST /login`, `POST /refresh`, `GET /me` |
| Companies | `/api/v1/companies` | Create, list, get, update, delete, and `GET /import-fields` |
| Job posts | `/api/v1/job-posts` | Requires a bearer access token |
| Applications | `/api/v1/applications` | Placeholder list endpoint |

Login and refresh return `access_token` and `refresh_token`. Send the access token as `Authorization: Bearer <token>` on protected routes. Use `/docs` to try requests against the running server.
