from fastapi import APIRouter

from app.api.v1.routes import health, ollama, repositories


api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(ollama.router, prefix="/ollama", tags=["ollama"])
api_router.include_router(repositories.router, prefix="/repositories", tags=["repositories"])
