from types import SimpleNamespace

from app.db.db_ingredients import apply_update
from app.models.ingredients import IngredientStatusOptions, Quantity, QuantityUnitOptions


def make_ingredient():
    return SimpleNamespace(
        name="milk",
        status=IngredientStatusOptions.NOT_EXPIRED,
        quantity=Quantity(value=2, unit=QuantityUnitOptions.PIECES),
    )


def test_none_values_are_ignored():
    ingredient = make_ingredient()
    apply_update(ingredient, {"name": None, "status": IngredientStatusOptions.EXPIRED})
    assert ingredient.name == "milk"
    assert ingredient.status == IngredientStatusOptions.EXPIRED


def test_quantity_is_merged_not_replaced():
    ingredient = make_ingredient()
    apply_update(ingredient, {"quantity": {"value": 5, "unit": None}})
    assert ingredient.quantity.value == 5
    assert ingredient.quantity.unit == QuantityUnitOptions.PIECES
