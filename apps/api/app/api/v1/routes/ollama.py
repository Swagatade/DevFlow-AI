from fastapi import APIRouter

from app.core.config import get_settings
from app.services.ollama import list_ollama_models


router = APIRouter()


@router.get("/models")
def get_ollama_models() -> dict:
    return list_ollama_models(get_settings())
