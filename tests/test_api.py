from datetime import date, timedelta
from types import SimpleNamespace

from beanie import PydanticObjectId
from fastapi.testclient import TestClient

from app.db import db_ingredients
from app.main import app

# Not used as a context manager, so the lifespan (and the Mongo connection) is skipped.
client = TestClient(app)


def fake_doc(name: str, days_ahead: int):
    return SimpleNamespace(
        id=PydanticObjectId(),
        name=name,
        quantity={"value": 1, "unit": "KG"},
        openedDate=None,
        expiryDate=date.today() + timedelta(days=days_ahead),
        tags=[],
    )


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_list_computes_status_and_filters(monkeypatch):
    docs = [fake_doc("old", -2), fake_doc("soon", 1), fake_doc("fresh", 30)]

    async def all_docs():
        return docs

    monkeypatch.setattr(db_ingredients, "get_all_ingredients", all_docs)

    everything = client.get("/ingredients").json()
    assert {i["name"]: i["status"] for i in everything} == {
        "old": "expired",
        "soon": "close_to_expire",
        "fresh": "not_expired",
    }
    assert "_id" in everything[0]

    filtered = client.get(
        "/ingredients",
        params=[("ingredient_status", "expired"), ("ingredient_status", "close_to_expire")],
    ).json()
    assert {i["name"] for i in filtered} == {"old", "soon"}


def test_create_returns_computed_status(monkeypatch):
    async def insert(data):
        return SimpleNamespace(id=PydanticObjectId(), **data.model_dump())

    monkeypatch.setattr(db_ingredients, "insert_ingredient", insert)
    expiry = (date.today() + timedelta(days=1)).isoformat()
    response = client.post(
        "/ingredients",
        json={"name": "milk", "quantity": {"value": 2, "unit": "PIECES"}, "expiryDate": expiry},
    )
    assert response.status_code == 201
    assert response.json()["status"] == "close_to_expire"


def test_client_supplied_status_is_ignored(monkeypatch):
    async def insert(data):
        return SimpleNamespace(id=PydanticObjectId(), **data.model_dump())

    monkeypatch.setattr(db_ingredients, "insert_ingredient", insert)
    response = client.post(
        "/ingredients",
        json={
            "name": "milk",
            "quantity": {"value": 2, "unit": "PIECES"},
            "expiryDate": (date.today() + timedelta(days=90)).isoformat(),
            "status": "expired",
        },
    )
    assert response.json()["status"] == "not_expired"


def test_invalid_id_is_rejected():
    assert client.get("/ingredients/not-an-object-id").status_code == 422


def test_unknown_status_filter_is_rejected():
    assert client.get("/ingredients", params={"ingredient_status": "rotten"}).status_code == 422


def test_create_validates_payload():
    assert client.post("/ingredients", json={"name": "milk"}).status_code == 422


def test_cors_allows_configured_origin():
    response = client.get("/health", headers={"Origin": "http://localhost:5173"})
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
