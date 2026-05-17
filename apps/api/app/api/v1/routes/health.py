from fastapi import APIRouter

from app.core.config import get_settings


router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    settings = get_settings()
    return {
        "status": "ok",
        "downloadDir": str(settings.download_dir),
        "ollamaModel": settings.ollama_model,
    }
