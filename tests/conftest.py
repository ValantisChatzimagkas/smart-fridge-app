import os

# Settings are read at import time of app.main; no Mongo connection is made in unit tests.
os.environ.setdefault("MONGO_USERNAME", "test")
os.environ.setdefault("MONGO_PASSWORD", "test")
