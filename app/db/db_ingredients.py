from typing import Union, List
from app.models.ingredients import IngredientsDocument, IngredientUpdate, IngredientStatusOptions
from beanie import PydanticObjectId
from beanie.operators import In
from fastapi.exceptions import HTTPException
from fastapi import status


async def insert_ingredient(data: IngredientsDocument):
        await data.create()
        return {"message": "Ingredient added successfully"}


async def get_all_ingredients():
    ingredients = await IngredientsDocument.find_all().to_list()
    return ingredients


async def get_all_ingredients_by_ingredient_status(ingredient_status: List[IngredientStatusOptions]):

    if len(ingredient_status) == 1:
        ingredients = await IngredientsDocument.find(
            IngredientsDocument.status == ingredient_status[0]
        ).to_list()

    else:
        ingredients = await IngredientsDocument.find(
            In(IngredientsDocument.status, [status.value for status in ingredient_status])
        ).to_list()

    return ingredients


async def get_ingredient_by_id(ingredient_id: PydanticObjectId):
    ingredient = await IngredientsDocument.get(ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
    return ingredient


async def update_ingredient(update_data: dict, ingredient_id: PydanticObjectId):
    ingredient = await IngredientsDocument.get(ingredient_id)


    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")

    for field, value in update_data.items():
        if field == "quantity" and value:
            for q_field, q_val in value.items():
                if q_val is not None:
                    setattr(ingredient.quantity, q_field, q_val)
        elif value is not None:
            setattr(ingredient, field, value)

    await ingredient.save()
    return ingredient


async def delete_ingredient_by_id(ingredient_id: PydanticObjectId):
    ingredient = await IngredientsDocument.get(ingredient_id)

    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")

    await ingredient.delete()
    return {"message": f"Ingredient with id {ingredient_id} deleted successfully"}