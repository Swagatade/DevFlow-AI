import asyncio

from fastapi import APIRouter, HTTPException

from app.schemas.repository import AskRequest, DebugRequest, RepositoryAnalyzeRequest
from app.services.repo_workspace import RepositoryWorkspace, RepositoryWorkspaceError


router = APIRouter()
workspace = RepositoryWorkspace()


@router.get("")
def list_repositories() -> list[dict]:
    return workspace.list_records()


@router.delete("")
def clear_repositories() -> dict:
    return workspace.clear_records()


@router.get("/workspace")
def get_workspace_info() -> dict:
    return workspace.workspace_info()


@router.post("/analyze")
async def analyze_repository(request: RepositoryAnalyzeRequest) -> dict:
    try:
        return await asyncio.to_thread(
            workspace.download_and_analyze,
            request.repo_url,
            request.model,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RepositoryWorkspaceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/{repository_id}")
def get_repository(repository_id: str) -> dict:
    record = workspace.get_record(repository_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Repository analysis not found")
    return record


@router.post("/{repository_id}/ask")
async def ask_repository(repository_id: str, request: AskRequest) -> dict:
    try:
        return await asyncio.to_thread(
            workspace.ask_repository,
            repository_id,
            request.question,
            request.model,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RepositoryWorkspaceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/{repository_id}/debug")
async def debug_repository(repository_id: str, request: DebugRequest) -> dict:
    try:
        return await asyncio.to_thread(
            workspace.debug_repository,
            repository_id,
            request.error_log,
            request.model,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RepositoryWorkspaceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/{repository_id}/debug-open-ibm-bob")
async def debug_and_open_repository_in_ibm_bob(
    repository_id: str,
    request: DebugRequest,
) -> dict:
    try:
        return await asyncio.to_thread(
            workspace.debug_and_open_in_ibm_bob,
            repository_id,
            request.error_log,
            request.model,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RepositoryWorkspaceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/{repository_id}/open-ibm-bob")
def open_repository_in_ibm_bob(repository_id: str) -> dict:
    try:
        return workspace.open_in_ibm_bob(repository_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RepositoryWorkspaceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
