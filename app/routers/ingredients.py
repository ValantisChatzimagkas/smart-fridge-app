from typing import List, Union, Optional
from beanie import PydanticObjectId
from fastapi import APIRouter, Query
from app.models.ingredients import IngredientsDocument, IngredientUpdate
from app.db import db_ingredients
from app.models.ingredients import IngredientStatusOptions
from fastapi.exceptions import HTTPException

router = APIRouter(
    prefix="/ingredient", tags=["ingredient"]
)


@router.post("/new")
async def insert_ingredient(ingredient_data: IngredientsDocument):
    await db_ingredients.insert_ingredient(ingredient_data)
    return {"message": "Ingredient added successfully"}


@router.get("/all", response_model=List[IngredientsDocument])
async def get_all_ingredients(
    ingredient_status: Optional[List[IngredientStatusOptions]] = Query(
        default=None,
        description="Filter by one or more statuses (e.g., expired, not_expired)"
    )
):
    if ingredient_status is None:
        ingredients = await db_ingredients.get_all_ingredients()
    else:
        ingredients = await  db_ingredients.get_all_ingredients_by_ingredient_status(ingredient_status)
    return ingredients


@router.get("/{id}", response_model=IngredientsDocument)
async def get_all_ingredients(id: PydanticObjectId):
    ingredient = await db_ingredients.get_ingredient_by_id(id)
    return ingredient


@router.delete("/{ingredient_id}")
async def delete_ingredient(ingredient_id: PydanticObjectId):
    await db_ingredients.delete_ingredient_by_id(ingredient_id)
    return "ok"


@router.patch("/ingredients/{ingredient_id}")
async def update_ingredient(ingredient_id: PydanticObjectId, update_data: dict):
    res = await db_ingredients.update_ingredient(update_data, ingredient_id)
    return res
