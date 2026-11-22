from datetime import date
from typing import Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, Query, Response, status

from app.db import db_ingredients
from app.expiry import expiry_status
from app.models.ingredients import (
    IngredientCreate,
    IngredientOut,
    IngredientsDocument,
    IngredientStatusOptions,
    IngredientUpdate,
)
from app.settings import Settings, get_settings

router = APIRouter(prefix="/ingredients", tags=["ingredients"])

SettingsDep = Annotated[Settings, Depends(get_settings)]


def to_out(doc: IngredientsDocument, settings: Settings) -> IngredientOut:
    return IngredientOut(
        _id=doc.id,
        name=doc.name,
        quantity=doc.quantity,
        openedDate=doc.openedDate,
        expiryDate=doc.expiryDate,
        tags=doc.tags,
        status=expiry_status(doc.expiryDate, date.today(), settings.expiry_warn_days),
    )


@router.post("", response_model=IngredientOut, status_code=status.HTTP_201_CREATED)
async def create_ingredient(data: IngredientCreate, settings: SettingsDep):
    doc = await db_ingredients.insert_ingredient(data)
    return to_out(doc, settings)


@router.get("", response_model=list[IngredientOut])
async def list_ingredients(
    settings: SettingsDep,
    ingredient_status: Annotated[
        list[IngredientStatusOptions] | None,
        Query(description="Only return ingredients with one of these statuses"),
    ] = None,
):
    # Status depends on today's date, so it is computed here rather than queried.
    items = [to_out(d, settings) for d in await db_ingredients.get_all_ingredients()]
    if ingredient_status:
        items = [i for i in items if i.status in ingredient_status]
    return items


@router.get("/{ingredient_id}", response_model=IngredientOut)
async def get_ingredient(ingredient_id: PydanticObjectId, settings: SettingsDep):
    return to_out(await db_ingredients.get_ingredient_by_id(ingredient_id), settings)


@router.patch("/{ingredient_id}", response_model=IngredientOut)
async def update_ingredient(
    ingredient_id: PydanticObjectId, data: IngredientUpdate, settings: SettingsDep
):
    doc = await db_ingredients.update_ingredient(data.model_dump(), ingredient_id)
    return to_out(doc, settings)


@router.delete("/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ingredient(ingredient_id: PydanticObjectId):
    await db_ingredients.delete_ingredient_by_id(ingredient_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
