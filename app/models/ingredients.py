from enum import Enum
from typing import Optional, List, Union
from beanie import Document
from pydantic import BaseModel, Field
from pydantic.types import date


class IngredientStatusOptions(str, Enum):
    EXPIRED = "expired"
    NOT_EXPIRED = "not_expired"
    CLOSE_TO_EXPIRE = "close_to_expire"

    def __str__(self):
        return self.value

    def __repr__(self):
        return self.value



    class FoodCategoryOptions(str, Enum):
        FRUITS = "Fruits"
        VEGETABLES = "Vegetables"
        MEAT = "Meat"
        FISH = "Fish"
        DAIRY = "Dairy"
        GRAINS = "Grains"
        LEGUMES = "Legumes"
        NUTS_SEEDS = "Nuts & Seeds"
        SWEETS = "Sweets"
        BEVERAGES = "Beverages"
        COOKED_MEALS = "Cooked Meals"
        SAUCES = "Sauces & Condiments"
        FROZEN = "Frozen"
        OTHER = "Other"

    def __str__(self):
        return self.value

    def __repr__(self):
        return self.value


class QuantityUnitOptions(str, Enum):
    PIECES = "PIECES"
    KG = "KG"

    def __str__(self):
        return self.value

    def __repr__(self):
        return self.value


class Quantity(BaseModel):
    value: float | int
    unit: QuantityUnitOptions


# CreateIngredient is just a Pydantic model
class IngredientsDocument(Document):
    name: str
    quantity: Quantity
    openedDate: Optional[date]
    expiryDate: date
    status: Union[IngredientStatusOptions, None] = None
    tags: List[str] = Field(default_factory=list)


class QuantityUpdate(BaseModel):
    value: Optional[float] = None
    unit: Optional[str] = None

class IngredientUpdate(BaseModel):
    name: Optional[str] = None
    expiryDate: Optional[str] = None
    status: Optional[Union[IngredientStatusOptions, None]] = None
    tags: Optional[list[str]] = None
    quantity: Optional[QuantityUpdate] = None