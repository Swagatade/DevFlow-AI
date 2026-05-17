from dataclasses import dataclass
from functools import lru_cache
import os
from pathlib import Path


def _csv(value: str | None, default: list[str]) -> list[str]:
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


def _download_root() -> Path:
    configured = os.getenv("DEVFLOW_DOWNLOAD_DIR")
    if configured:
        return Path(configured).expanduser()
    return Path.home() / "Downloads" / "DevFlow AI"


@dataclass(frozen=True)
class Settings:
    app_name: str = "DevFlow AI API"
    cors_origins: list[str] = None  # type: ignore[assignment]
    download_dir: Path = None  # type: ignore[assignment]
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1:8b"
    ollama_timeout_seconds: int = 45
    clone_timeout_seconds: int = 180
    max_tree_entries: int = 180
    max_context_files: int = 28
    max_file_chars: int = 7000
    max_total_context_chars: int = 70000

    def __post_init__(self) -> None:
        object.__setattr__(
            self,
            "cors_origins",
            _csv(
                os.getenv("CORS_ORIGINS"),
                [
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                    "http://localhost:3001",
                    "http://127.0.0.1:3001",
                ],
            ),
        )
        object.__setattr__(self, "download_dir", _download_root())
        object.__setattr__(
            self,
            "ollama_base_url",
            os.getenv("OLLAMA_BASE_URL", self.ollama_base_url).rstrip("/"),
        )
        object.__setattr__(
            self,
            "ollama_model",
            os.getenv("OLLAMA_MODEL", self.ollama_model),
        )
        object.__setattr__(
            self,
            "ollama_timeout_seconds",
            int(os.getenv("OLLAMA_TIMEOUT_SECONDS", str(self.ollama_timeout_seconds))),
        )
        object.__setattr__(
            self,
            "clone_timeout_seconds",
            int(os.getenv("DEVFLOW_CLONE_TIMEOUT_SECONDS", str(self.clone_timeout_seconds))),
        )

    @property
    def index_file(self) -> Path:
        return self.download_dir / ".devflow-index.json"


@lru_cache
def get_settings() -> Settings:
    return Settings()
