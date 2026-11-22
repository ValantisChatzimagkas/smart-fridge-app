FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:0.7.18 /uv /usr/local/bin/uv

WORKDIR /code

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY ./app ./app

ENV PATH="/code/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
