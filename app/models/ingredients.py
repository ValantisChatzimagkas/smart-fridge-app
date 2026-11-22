from datetime import date
from enum import StrEnum

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, ConfigDict, Field


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
    """Stored ingredient. Status is derived from `expiryDate` on read, never persisted."""

    name: str
    quantity: Quantity
    openedDate: date | None = None
    expiryDate: date
    tags: list[str] = Field(default_factory=list)


class IngredientCreate(BaseModel):
    name: str = Field(min_length=1)
    quantity: Quantity
    openedDate: date | None = None
    expiryDate: date
    tags: list[str] = Field(default_factory=list)


class QuantityUpdate(BaseModel):
    value: float | int | None = None
    unit: QuantityUnitOptions | None = None


class IngredientUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    quantity: QuantityUpdate | None = None
    openedDate: date | None = None
    expiryDate: date | None = None
    tags: list[str] | None = None


class IngredientOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: PydanticObjectId = Field(alias="_id")
    name: str
    quantity: Quantity
    openedDate: date | None
    expiryDate: date
    tags: list[str]
    status: IngredientStatusOptions
