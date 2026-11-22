from fastapi.testclient import TestClient

from app.main import app

# Not used as a context manager, so the lifespan (and the Mongo connection) is skipped.
client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_invalid_ingredient_id_is_rejected_before_touching_the_db():
    assert client.get("/ingredient/not-an-object-id").status_code == 422


def test_unknown_status_filter_is_rejected():
    assert client.get("/ingredient/all", params={"ingredient_status": "rotten"}).status_code == 422


def test_new_ingredient_validates_payload():
    response = client.post("/ingredient/new", json={"name": "milk"})
    assert response.status_code == 422


def test_cors_allows_configured_origin():
    response = client.get("/health", headers={"Origin": "http://localhost:5173"})
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
