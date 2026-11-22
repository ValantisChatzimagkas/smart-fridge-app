from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    mongo_username: str
    mongo_password: str
    mongo_host: str = "localhost"
    mongo_port: int = 27017
    mongo_db_name: str = "ingredients_db"
    # Comma-separated list of origins allowed by CORS.
    cors_origins: str = "http://localhost:5173"

    @property
    def mongo_uri(self) -> str:
        return (
            f"mongodb://{self.mongo_username}:{self.mongo_password}"
            f"@{self.mongo_host}:{self.mongo_port}/?authSource=admin"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


def get_settings() -> Settings:
    return Settings()
