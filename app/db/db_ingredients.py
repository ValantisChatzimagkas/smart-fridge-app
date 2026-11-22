from beanie import PydanticObjectId
from fastapi import status
from fastapi.exceptions import HTTPException

from app.models.ingredients import IngredientCreate, IngredientsDocument


async def insert_ingredient(data: IngredientCreate) -> IngredientsDocument:
    return await IngredientsDocument(**data.model_dump()).create()


async def get_all_ingredients():
    ingredients = await IngredientsDocument.find_all().to_list()
    return ingredients


async def get_ingredient_by_id(ingredient_id: PydanticObjectId):
    ingredient = await IngredientsDocument.get(ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
    return ingredient


def apply_update(ingredient, update_data: dict) -> None:
    """Apply a partial update in place; None values are ignored and quantity is merged."""
    for field, value in update_data.items():
        if field == "quantity" and value:
            for q_field, q_val in value.items():
                if q_val is not None:
                    setattr(ingredient.quantity, q_field, q_val)
        elif value is not None:
            setattr(ingredient, field, value)


async def update_ingredient(update_data: dict, ingredient_id: PydanticObjectId):
    ingredient = await IngredientsDocument.get(ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")

    apply_update(ingredient, update_data)

    await ingredient.save()
    return ingredient


async def delete_ingredient_by_id(ingredient_id: PydanticObjectId):
    ingredient = await IngredientsDocument.get(ingredient_id)

    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")

    await ingredient.delete()
