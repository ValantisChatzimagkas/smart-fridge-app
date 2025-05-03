FROM python:3.12-slim

# Install system packages (including libzbar0 for pyzbar)
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libzbar0 \
    && apt-get clean

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /code

COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --only main

COPY ./app ./app

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
