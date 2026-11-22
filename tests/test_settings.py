from app.settings import Settings


def make(**overrides) -> Settings:
    return Settings(_env_file=None, mongo_username="u", mongo_password="p", **overrides)


def test_mongo_uri_built_from_parts():
    s = make(mongo_host="mongo", mongo_port=27018)
    assert s.mongo_uri == "mongodb://u:p@mongo:27018/?authSource=admin"


def test_cors_origins_are_split_and_trimmed():
    s = make(cors_origins="http://a.test, http://b.test ,")
    assert s.cors_origin_list == ["http://a.test", "http://b.test"]
