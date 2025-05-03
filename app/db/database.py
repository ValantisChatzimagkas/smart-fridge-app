from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from beanie import init_beanie
import motor.motor_asyncio
from app.models.ingredients import IngredientsDocument

load_dotenv()


MONGO_USERNAME = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
# MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_HOST = os.getenv("MONGO_HOST", "mongo")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "ingredients_db")
MONGO_URI = f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}?authSource=admin"



async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(
        MONGO_URI
                    # f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@localhost:{MONGO_PORT}/{MONGO_DB_NAME}?authSource=admin"
    )

    await init_beanie(database=client[MONGO_DB_NAME], document_models=[IngredientsDocument])

