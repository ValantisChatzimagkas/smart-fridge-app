from datetime import date
from enum import StrEnum

from beanie import Document
from pydantic import BaseModel, Field


class IngredientStatusOptions(StrEnum):
    EXPIRED = "expired"
    NOT_EXPIRED = "not_expired"
    CLOSE_TO_EXPIRE = "close_to_expire"


class QuantityUnitOptions(StrEnum):
    PIECES = "PIECES"
    KG = "KG"


class Quantity(BaseModel):
    value: float | int
    unit: QuantityUnitOptions


class IngredientsDocument(Document):
    name: str
    quantity: Quantity
    openedDate: date | None
    expiryDate: date
    status: IngredientStatusOptions | None = None
    tags: list[str] = Field(default_factory=list)
