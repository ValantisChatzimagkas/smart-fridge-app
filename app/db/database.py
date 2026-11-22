from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.models.ingredients import IngredientsDocument
from app.settings import Settings


async def init_db(settings: Settings) -> None:
    client = AsyncIOMotorClient(settings.mongo_uri)
    await init_beanie(
        database=client[settings.mongo_db_name], document_models=[IngredientsDocument]
    )
