from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db.database import init_db
from app.routers.ingredients import router as ingredients_router
from app.routers.barcode import router as barcode_router
from fastapi.middleware.cors import CORSMiddleware



@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(ingredients_router)
app.include_router(barcode_router)


origins = [
    'http://localhost:5173',
]

app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)


@app.get("/", tags=["Root"])
async def read_root() -> dict:
    return {"message": "Welcome to your beanie powered app!"}
