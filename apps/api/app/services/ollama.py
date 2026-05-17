from dataclasses import dataclass
import json
import urllib.error
import urllib.request

from app.core.config import Settings, get_settings


@dataclass(frozen=True)
class OllamaResult:
    available: bool
    text: str
    model: str
    message: str

    def to_dict(self) -> dict[str, str | bool]:
        return {
            "available": self.available,
            "model": self.model,
            "message": self.message,
        }


def list_ollama_models(settings: Settings | None = None) -> dict:
    active_settings = settings or get_settings()
    request = urllib.request.Request(
        f"{active_settings.ollama_base_url}/api/tags",
        headers={"Content-Type": "application/json"},
        method="GET",
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=min(active_settings.ollama_timeout_seconds, 10),
        ) as response:
            body = response.read().decode("utf-8")
            data = json.loads(body)
    except urllib.error.HTTPError as exc:
        return {
            "available": False,
            "baseUrl": active_settings.ollama_base_url,
            "defaultModel": active_settings.ollama_model,
            "models": [],
            "message": _http_error_detail(exc),
        }
    except (TimeoutError, urllib.error.URLError, json.JSONDecodeError) as exc:
        return {
            "available": False,
            "baseUrl": active_settings.ollama_base_url,
            "defaultModel": active_settings.ollama_model,
            "models": [],
            "message": f"Ollama is not reachable at {active_settings.ollama_base_url}: {exc}",
        }

    models = []
    for item in data.get("models", []):
        name = str(item.get("name") or item.get("model") or "").strip()
        if not name:
            continue
        models.append(
            {
                "name": name,
                "model": str(item.get("model") or name),
                "modifiedAt": item.get("modified_at"),
                "size": item.get("size"),
                "digest": item.get("digest"),
            }
        )

    recommended_model = _recommended_model_name(models, active_settings.ollama_model)

    return {
        "available": True,
        "baseUrl": active_settings.ollama_base_url,
        "defaultModel": recommended_model,
        "models": models,
        "message": "Ollama models detected." if models else "Ollama is running, but no models are downloaded.",
    }


def generate_with_ollama(
    prompt: str,
    settings: Settings | None = None,
    model: str | None = None,
) -> OllamaResult:
    active_settings = settings or get_settings()
    active_model = model or active_settings.ollama_model
    models_info = list_ollama_models(active_settings)

    if not models_info.get("available"):
        return OllamaResult(
            available=False,
            text="",
            model=active_model,
            message=str(models_info.get("message") or "Ollama is not reachable."),
        )

    models = models_info.get("models", [])
    if not models:
        return OllamaResult(
            available=False,
            text="",
            model=active_model,
            message="Ollama is running, but no models are downloaded.",
        )

    available_names = {str(item.get("name") or "") for item in models}
    if available_names and active_model not in available_names:
        fallback_model = _recommended_model_name(models, active_settings.ollama_model)
        if fallback_model and fallback_model in available_names:
            active_model = fallback_model
        else:
            return OllamaResult(
                available=False,
                text="",
                model=active_model,
                message=f"Ollama model `{active_model}` is not available locally.",
            )

    result = _generate_once(prompt, active_settings, active_model)
    if result.text or not _should_try_fallback(result.message):
        return result

    fallback_model = _fallback_chat_model(active_settings, active_model)
    if not fallback_model:
        return result

    fallback_result = _generate_once(prompt, active_settings, fallback_model)
    if fallback_result.text:
        return OllamaResult(
            available=True,
            text=fallback_result.text,
            model=fallback_model,
            message=f"{fallback_result.message} Fallback from {active_model}: {result.message}",
        )

    return OllamaResult(
        available=False,
        text="",
        model=fallback_model,
        message=f"{fallback_result.message}. Initial model {active_model} failed: {result.message}",
    )


def _generate_once(prompt: str, settings: Settings, model: str) -> OllamaResult:
    num_predict = 1200 if _needs_larger_completion_budget(model) else 500
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are DevFlow AI, a concise repository assistant. Answer directly with file citations.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "stream": False,
        "think": False,
        "options": {
            "temperature": 0.1,
            "num_ctx": 8192,
            "num_predict": num_predict,
        },
    }
    request = urllib.request.Request(
        f"{settings.ollama_base_url}/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=min(settings.ollama_timeout_seconds, 30),
        ) as response:
            body = response.read().decode("utf-8")
            data = json.loads(body)
    except urllib.error.HTTPError as exc:
        detail = _http_error_detail(exc)
        return OllamaResult(
            available=False,
            text="",
            model=model,
            message=detail,
        )
    except (TimeoutError, urllib.error.URLError, json.JSONDecodeError) as exc:
        return OllamaResult(
            available=False,
            text="",
            model=model,
            message=f"Ollama unavailable: {exc}",
        )

    message = data.get("message") if isinstance(data.get("message"), dict) else {}
    text = str(message.get("content") or data.get("response") or "").strip()
    if not text:
        return OllamaResult(
            available=False,
            text="",
            model=model,
            message="Ollama returned an empty response.",
        )

    return OllamaResult(
        available=True,
        text=text,
        model=model,
        message="Ollama analysis complete.",
    )


def _needs_larger_completion_budget(model: str) -> bool:
    lowered = model.lower()
    return "gpt-oss" in lowered or ":cloud" in lowered


def _should_try_fallback(message: str) -> bool:
    lowered = message.lower()
    return any(
        marker in lowered
        for marker in [
            "requires a subscription",
            "model is missing",
            "model not found",
            "404",
            "403",
        ]
    )


def _fallback_chat_model(settings: Settings, current_model: str) -> str | None:
    models_info = list_ollama_models(settings)
    models = models_info.get("models", [])
    recommended = _recommended_model_name(models, settings.ollama_model)
    if recommended and recommended != current_model:
        return recommended
    for item in models:
        name = str(item.get("name") or "").strip()
        if name and name != current_model and _chat_model_score(name) > 0:
            return name
    return None


def _recommended_model_name(models: list[dict], configured_default: str) -> str:
    if configured_default and any(item.get("name") == configured_default for item in models):
        configured_score = _chat_model_score(configured_default)
        if configured_score > 0:
            return configured_default

    scored = [
        (_chat_model_score(str(item.get("name") or "")), index, str(item.get("name") or ""))
        for index, item in enumerate(models)
    ]
    scored = [item for item in scored if item[0] > 0 and item[2]]
    if not scored:
        return configured_default
    return sorted(scored, key=lambda item: (-item[0], item[1]))[0][2]


def _chat_model_score(name: str) -> int:
    lowered = name.lower()
    if not lowered or ":cloud" in lowered or "embed" in lowered or lowered.startswith("bge-"):
        return 0

    priorities = [
        ("qwen3.5", 120),
        ("qwen3", 115),
        ("gemma", 100),
        ("gpt-oss", 90),
        ("llama", 85),
        ("mistral", 80),
        ("devstral", 78),
        ("deepseek", 76),
        ("nemotron", 70),
        ("glm", 68),
    ]
    for marker, score in priorities:
        if marker in lowered:
            return score
    return 40


def _http_error_detail(exc: urllib.error.HTTPError) -> str:
    try:
        body = exc.read().decode("utf-8")
        data = json.loads(body)
        error = str(data.get("error", "")).strip()
    except (OSError, json.JSONDecodeError, UnicodeDecodeError):
        error = ""

    if exc.code == 404 and "model" in error.lower():
        return "Ollama model is missing. Pull the configured model, then rerun analysis."
    if error:
        return f"Ollama unavailable: {error}"
    return f"Ollama unavailable: HTTP {exc.code}"
