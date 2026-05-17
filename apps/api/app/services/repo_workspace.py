from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from uuid import uuid4
import zipfile

from app.core.config import Settings, get_settings
from app.services.analyzer import (
    build_debug_prompt,
    build_question_prompt,
    fallback_analysis,
    inspect_repository,
)
from app.services.ollama import generate_with_ollama
from app.services.ollama import OllamaResult


class RepositoryWorkspaceError(RuntimeError):
    pass


@dataclass(frozen=True)
class GitHubRepo:
    owner: str
    repo: str
    html_url: str
    clone_url: str

    @property
    def name(self) -> str:
        return self.repo

    @property
    def slug(self) -> str:
        return _safe_slug(f"{self.owner}-{self.repo}")


class RepositoryWorkspace:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.settings.download_dir.mkdir(parents=True, exist_ok=True)

    def list_records(self) -> list[dict]:
        return sorted(
            self._load_records(),
            key=lambda item: item.get("createdAt", ""),
            reverse=True,
        )

    def workspace_info(self) -> dict:
        records = self.list_records()
        ibm_bob_executable = _ibm_bob_executable()
        return {
            "downloadRoot": str(self.settings.download_dir),
            "repositoryCount": len(records),
            "indexPath": str(self.settings.index_file),
            "ibmBobInstalled": ibm_bob_executable is not None,
            "ibmBobPath": str(ibm_bob_executable) if ibm_bob_executable else None,
            "ibmBobInstallUrl": _IBM_BOB_INSTALL_URL,
        }

    def get_record(self, repository_id: str) -> dict | None:
        return self._find_record(repository_id)

    def clear_records(self) -> dict:
        self._save_records([])
        return {
            "cleared": True,
            "message": "Repository history cleared. Downloaded folders were kept on disk.",
        }

    def download_and_analyze(self, repo_url: str, model: str | None = None) -> dict:
        source = _parse_github_repo(repo_url)
        target_dir = self._unique_download_dir(source.slug)

        try:
            self._clone_or_download(source, target_dir)
            inspection = inspect_repository(
                root=target_dir,
                repo_name=source.name,
                repo_url=source.html_url,
                settings=self.settings,
            )
            ai_explanation = fallback_analysis(inspection, source.name)
            ollama_result = OllamaResult(
                available=False,
                text="",
                model=model or self.settings.ollama_model,
                message="Repository cloned and indexed locally. Chat questions are answered with Ollama from the downloaded files.",
            )
            analysis = {
                "summary": _summary_from_markdown(ai_explanation, source.name),
                "aiExplanation": ai_explanation,
                "architecture": inspection.architecture,
                "dependencyMap": inspection.dependency_map,
                "entryPoints": inspection.entry_points,
                "techStack": inspection.tech_stack,
                "repoTree": inspection.repo_tree,
                "testPlan": inspection.test_plan,
                "bugFindings": inspection.bug_findings,
                "ollama": ollama_result.to_dict(),
            }
            record = {
                "id": str(uuid4()),
                "name": source.name,
                "owner": source.owner,
                "repoUrl": source.html_url,
                "downloadPath": str(target_dir),
                "createdAt": _utc_now(),
                "status": "Analyzed",
                "analysis": analysis,
                "analysisPath": str(target_dir / "DEVFLOW_ANALYSIS.md"),
                "debugReportPath": None,
                "selectedModel": ollama_result.model,
            }
            self._write_ibm_bob_handoff(record)
            self._write_analysis_doc(record)
            self._upsert_record(record)
            return record
        except Exception:
            if target_dir.exists() and _is_within(target_dir, self.settings.download_dir):
                shutil.rmtree(target_dir, ignore_errors=True)
            raise

    def ask_repository(
        self,
        repository_id: str,
        question: str,
        model: str | None = None,
    ) -> dict:
        if not question.strip():
            raise ValueError("Question is required")

        record = self._require_record(repository_id)
        root = self._require_download(record)
        inspection = inspect_repository(root, record["name"], record["repoUrl"], self.settings)
        ollama_result = generate_with_ollama(
            build_question_prompt(inspection, question, record["name"]),
            self.settings,
            model or record.get("selectedModel"),
        )
        if not ollama_result.text:
            raise RepositoryWorkspaceError(
                f"Ollama did not return an answer. {ollama_result.message}"
            )

        return {
            "repositoryId": repository_id,
            "question": question,
            "answer": ollama_result.text,
            "downloadPath": str(root),
            "sourceFiles": inspection.files,
            "ollama": ollama_result.to_dict(),
        }

    def debug_repository(
        self,
        repository_id: str,
        error_log: str | None,
        model: str | None = None,
    ) -> dict:
        record = self._require_record(repository_id)
        root = self._require_download(record)
        inspection = inspect_repository(root, record["name"], record["repoUrl"], self.settings)
        ollama_result = generate_with_ollama(
            build_debug_prompt(inspection, record["name"], error_log),
            self.settings,
            model or record.get("selectedModel"),
        )
        report = ollama_result.text or _fallback_debug_report(record["name"], inspection, error_log)
        report_path = root / "DEVFLOW_DEBUG_REPORT.md"
        report_path.write_text(_debug_markdown(record, report), encoding="utf-8")
        record["debugReportPath"] = str(report_path)
        record["status"] = "Debugging Ready"
        record["lastDebugAt"] = _utc_now()
        self._write_ibm_bob_handoff(record)
        self._upsert_record(record)
        return {
            "repositoryId": repository_id,
            "report": report,
            "reportPath": str(report_path),
            "downloadPath": str(root),
            "sourceFiles": inspection.files,
            "ollama": ollama_result.to_dict(),
        }

    def open_in_ibm_bob(self, repository_id: str) -> dict:
        record = self._require_record(repository_id)
        root = self._require_download(record)
        self._write_ibm_bob_handoff(record)
        executable = _ibm_bob_executable()

        if executable is None:
            return {
                "opened": False,
                "downloadPath": str(root),
                "message": "IBM Bob app was not found on this system.",
                "installUrl": _IBM_BOB_INSTALL_URL,
            }

        try:
            subprocess.Popen(
                [str(executable), str(root)],
                cwd=str(executable.parent),
                env=_desktop_app_env(),
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        except OSError as exc:
            return {
                "opened": False,
                "downloadPath": str(root),
                "message": f"Could not open IBM Bob: {exc}",
            }

        return {
            "opened": True,
            "downloadPath": str(root),
            "message": "Opened downloaded repository in IBM Bob.",
        }

    def debug_and_open_in_ibm_bob(
        self,
        repository_id: str,
        error_log: str | None,
        model: str | None = None,
    ) -> dict:
        debug_result = self.debug_repository(repository_id, error_log, model)
        open_result = self.open_in_ibm_bob(repository_id)
        return {
            **debug_result,
            "opened": open_result.get("opened", False),
            "openMessage": open_result.get("message", ""),
            "downloadPath": open_result.get("downloadPath"),
        }

    def _clone_or_download(self, source: GitHubRepo, target_dir: Path) -> None:
        try:
            clone_result = subprocess.run(
                ["git", "clone", "--depth", "1", source.clone_url, str(target_dir)],
                capture_output=True,
                text=True,
                timeout=self.settings.clone_timeout_seconds,
                check=False,
            )
            if clone_result.returncode == 0:
                return
            git_error = clone_result.stderr.strip() or clone_result.stdout.strip()
        except (OSError, subprocess.TimeoutExpired) as exc:
            git_error = str(exc)

        if target_dir.exists():
            shutil.rmtree(target_dir, ignore_errors=True)

        try:
            self._download_zip(source, target_dir)
        except RepositoryWorkspaceError:
            raise RepositoryWorkspaceError(f"Could not download repository. Git said: {git_error}")

    def _download_zip(self, source: GitHubRepo, target_dir: Path) -> None:
        default_branch = self._default_branch(source)
        archive_url = f"https://codeload.github.com/{source.owner}/{source.repo}/zip/refs/heads/{default_branch}"
        request = urllib.request.Request(
            archive_url,
            headers={"User-Agent": "DevFlow-AI"},
        )
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                data = response.read()
        except (TimeoutError, urllib.error.URLError) as exc:
            raise RepositoryWorkspaceError(f"Could not fetch GitHub archive: {exc}") from exc

        target_dir.mkdir(parents=True, exist_ok=False)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as handle:
            handle.write(data)
            archive_path = Path(handle.name)

        try:
            with zipfile.ZipFile(archive_path) as archive:
                for member in archive.infolist():
                    parts = Path(member.filename).parts
                    if len(parts) <= 1:
                        continue
                    relative = Path(*parts[1:])
                    destination = target_dir / relative
                    if not _is_within(destination, target_dir):
                        continue
                    if member.is_dir():
                        destination.mkdir(parents=True, exist_ok=True)
                    else:
                        destination.parent.mkdir(parents=True, exist_ok=True)
                        with archive.open(member) as source_file, destination.open("wb") as target_file:
                            shutil.copyfileobj(source_file, target_file)
        finally:
            archive_path.unlink(missing_ok=True)

    def _default_branch(self, source: GitHubRepo) -> str:
        request = urllib.request.Request(
            f"https://api.github.com/repos/{source.owner}/{source.repo}",
            headers={"User-Agent": "DevFlow-AI"},
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8"))
            return str(data.get("default_branch") or "main")
        except (TimeoutError, urllib.error.URLError, json.JSONDecodeError):
            return "main"

    def _unique_download_dir(self, slug: str) -> Path:
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        base = self.settings.download_dir / f"{slug}-{timestamp}"
        candidate = base
        counter = 2
        while candidate.exists():
            candidate = self.settings.download_dir / f"{slug}-{timestamp}-{counter}"
            counter += 1
        return candidate

    def _write_ibm_bob_handoff(self, record: dict) -> None:
        root = Path(record["downloadPath"])
        ibm_bob_dir = root / ".ibm-bob"
        ibm_bob_dir.mkdir(parents=True, exist_ok=True)
        handoff = {
            "platform": "DevFlow AI",
            "repositoryId": record["id"],
            "repositoryName": record["name"],
            "repoUrl": record["repoUrl"],
            "apiBaseUrl": "http://localhost:8000/api/v1",
            "analysisPath": record.get("analysisPath"),
            "debugReportPath": record.get("debugReportPath"),
        }
        (ibm_bob_dir / "devflow-ai.json").write_text(
            json.dumps(handoff, indent=2),
            encoding="utf-8",
        )

    def _write_analysis_doc(self, record: dict) -> None:
        root = Path(record["downloadPath"])
        analysis = record["analysis"]
        markdown = f"""# DevFlow AI Analysis: {record["name"]}

Source: {record["repoUrl"]}
Downloaded: `{record["downloadPath"]}`

## Summary

{analysis["summary"]}

## Ollama Explanation

{analysis["aiExplanation"]}

## Entry Points

{_markdown_list(analysis["entryPoints"])}

## Tech Stack

{_markdown_list(analysis["techStack"])}

## Static Debug Signals

{_markdown_list(analysis["bugFindings"])}
"""
        (root / "DEVFLOW_ANALYSIS.md").write_text(markdown, encoding="utf-8")

    def _load_records(self) -> list[dict]:
        if not self.settings.index_file.exists():
            return []
        try:
            data = json.loads(self.settings.index_file.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []
        records = data.get("records", [])
        return records if isinstance(records, list) else []

    def _save_records(self, records: list[dict]) -> None:
        self.settings.download_dir.mkdir(parents=True, exist_ok=True)
        temp_file = self.settings.index_file.with_suffix(".json.tmp")
        temp_file.write_text(json.dumps({"records": records}, indent=2), encoding="utf-8")
        temp_file.replace(self.settings.index_file)

    def _upsert_record(self, record: dict) -> None:
        records = [item for item in self._load_records() if item.get("id") != record["id"]]
        records.append(record)
        self._save_records(records)

    def _find_record(self, repository_id: str) -> dict | None:
        return next(
            (item for item in self._load_records() if item.get("id") == repository_id),
            None,
        )

    def _require_record(self, repository_id: str) -> dict:
        record = self._find_record(repository_id)
        if record is None:
            raise KeyError("Repository analysis not found")
        return record

    def _require_download(self, record: dict) -> Path:
        path = Path(record["downloadPath"])
        if not path.exists() or not _is_within(path, self.settings.download_dir):
            raise RepositoryWorkspaceError("Downloaded repository folder is missing")
        return path


def _parse_github_repo(repo_url: str) -> GitHubRepo:
    cleaned = repo_url.strip()
    ssh_match = re.match(r"^git@github\.com:([^/\s]+)/([^/\s]+?)(?:\.git)?$", cleaned)
    if ssh_match:
        owner, repo = ssh_match.groups()
    else:
        parsed = urllib.parse.urlparse(cleaned)
        host = parsed.netloc.lower()
        if host not in {"github.com", "www.github.com"}:
            raise ValueError("Only GitHub repository links are supported right now")
        parts = [part for part in parsed.path.split("/") if part]
        if len(parts) < 2:
            raise ValueError("GitHub URL must include an owner and repository name")
        owner, repo = parts[0], parts[1]

    repo = repo.removesuffix(".git")
    if not re.match(r"^[A-Za-z0-9_.-]+$", owner) or not re.match(r"^[A-Za-z0-9_.-]+$", repo):
        raise ValueError("Repository owner or name contains unsupported characters")

    return GitHubRepo(
        owner=owner,
        repo=repo,
        html_url=f"https://github.com/{owner}/{repo}",
        clone_url=f"https://github.com/{owner}/{repo}.git",
    )


def _safe_slug(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9_.-]+", "-", value).strip("-")[:90] or "repository"


def _utc_now() -> str:
    return datetime.now(UTC).isoformat()


def _is_within(path: Path, parent: Path) -> bool:
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False


def _summary_from_markdown(markdown: str, repo_name: str) -> str:
    cleaned = re.sub(r"#+\s*", "", markdown).strip()
    lines = [line.strip("- ").strip() for line in cleaned.splitlines() if line.strip()]
    for line in lines:
        if len(line) > 28 and not line.endswith(":"):
            return line[:280]
    return f"{repo_name} was downloaded and analyzed successfully."


def _fallback_question_answer(record: dict, inspection, question: str) -> str:
    file_notes = _file_purpose_notes(inspection.files)
    dependency_notes = _dependency_notes(inspection.dependency_map)
    entry_points = _markdown_list(inspection.entry_points[:8])
    tech_stack = ", ".join(inspection.tech_stack) or "No framework confidently detected from sampled files"
    debug_signals = _markdown_list(inspection.bug_findings)
    test_plan = _markdown_list(inspection.test_plan)
    tree = "\n".join(inspection.repo_tree[:80]) or "No readable files detected."

    return f"""Ollama is not available right now, so this answer is generated from static analysis of the downloaded files.

## Repository Overview - `{record["owner"]}/{record["name"]}`

Question: {question}

This repository looks like a {tech_stack} project. The main backend entry point is probably `server.js`, and the browser UI is under `frontend/`.

## Important Files

| Path | Purpose |
|------|---------|
{file_notes}

## Runtime Structure

- `server.js` likely starts the Express server, serves static frontend files, exposes health/API routes, and connects browser requests to backend logic.
- `ai.js` likely wraps the Gemini SDK call used by the AI endpoint.
- `frontend/index.html`, `frontend/index.js`, and `frontend/styles.css` form the main client-side page.
- `frontend/ai-interface.html`, `frontend/ai-interface.js`, and `frontend/ai-styles.css` form the AI/chat-style interface.
- `package.json` defines install and run scripts for local development.

## Entry Points

{entry_points}

## Dependencies

{dependency_notes}

## Possible Bugs Or Risks

{debug_signals}

## Suggested Next Steps

1. Run `npm install` in the downloaded repo folder.
2. Check `.env.example` and create a local `.env` if the app expects API keys.
3. Run the start/dev command from `package.json`.
4. If the AI route fails, inspect `server.js`, `ai.js`, and the environment variable names used by the Gemini client.
5. Run or add tests around `/ai`, health checks, and frontend wallet/UI actions.

## Test Plan

{test_plan}

## Repository Tree

```text
{tree}
```
"""


def _file_purpose_notes(files: list[str]) -> str:
    purpose_by_name = {
        "README.md": "Project overview, setup notes, and usage instructions.",
        "package.json": "Node dependencies and runnable npm scripts.",
        "server.js": "Backend server entry point and API/static-file routing.",
        "ai.js": "AI helper or Gemini SDK integration layer.",
        ".env.example": "Template for required environment variables.",
        "SECURITY.md": "Security policy or vulnerability reporting guidance.",
        "frontend/index.html": "Main browser page markup.",
        "frontend/index.js": "Main browser-side behavior.",
        "frontend/styles.css": "Main page styling.",
        "frontend/ai-interface.html": "AI interface page markup.",
        "frontend/ai-interface.js": "AI interface browser-side behavior.",
        "frontend/ai-styles.css": "AI interface styling.",
        "frontend/wallet-utils.js": "Wallet connection or crypto helper utilities.",
    }
    rows = []
    for path in files:
        purpose = purpose_by_name.get(path)
        if purpose:
            rows.append(f"| `{path}` | {purpose} |")
        if len(rows) >= 14:
            break
    if not rows:
        return "| No priority files detected | Inspect the repository tree and README first. |"
    return "\n".join(rows)


def _dependency_notes(dependency_map: list[dict]) -> str:
    if not dependency_map:
        return "- No package manifest was detected in the sampled files."

    notes = []
    for item in dependency_map:
        ecosystem = item.get("ecosystem", "unknown")
        manifest = item.get("file", "manifest")
        dependencies = item.get("dependencies", [])
        scripts = item.get("scripts", [])
        if isinstance(dependencies, list):
            dependency_text = ", ".join(dependencies[:12]) or "none listed"
        else:
            dependency_text = str(dependencies) or "none listed"
        if isinstance(scripts, list):
            script_text = ", ".join(f"`npm run {script}`" for script in scripts[:8])
        else:
            script_text = ", ".join(f"`npm run {script}`" for script in str(scripts).split()[:8])
        notes.append(f"- `{manifest}` ({ecosystem}): {dependency_text}.")
        if script_text:
            notes.append(f"- Available scripts: {script_text}.")
    return "\n".join(notes)


def _fallback_debug_report(repo_name: str, inspection, error_log: str | None) -> str:
    signals = "\n".join(f"- {item}" for item in inspection.bug_findings)
    entry_points = ", ".join(inspection.entry_points[:5]) or "the main application entry point"
    error_context = "The supplied error log should be matched against these files." if error_log else "No error log was supplied, so this is a static debug pass."
    return f"""## Most likely root cause
{error_context}

## Files to open first
{entry_points}

## Static signals
{signals}

## Fix plan
1. Reproduce the issue from the IBM Bob terminal.
2. Open the first matching entry point and trace the failing call path.
3. Patch the smallest failing unit, then run the repository test or build command.

## Tests
{_markdown_list(inspection.test_plan)}
"""


def _debug_markdown(record: dict, report: str) -> str:
    return f"""# DevFlow AI Debug Report: {record["name"]}

Repository: {record["repoUrl"]}
Local path: `{record["downloadPath"]}`

{report}
"""


def _markdown_list(items: list[str]) -> str:
    if not items:
        return "- None detected."
    return "\n".join(f"- {item}" for item in items)


def _ibm_bob_executable() -> Path | None:
    candidates = [
        Path.home() / "AppData" / "Local" / "Programs" / "IBM Bob" / "IBM Bob.exe",
        Path.home() / "AppData" / "Roaming" / "Microsoft" / "Windows" / "Start Menu" / "Programs" / "IBM Bob" / "IBM Bob.lnk",
    ]
    for candidate in candidates:
        if candidate.exists() and candidate.suffix.lower() == ".exe":
            return candidate
        if candidate.exists() and candidate.suffix.lower() == ".lnk":
            target = _shortcut_target(candidate)
            if target and target.exists():
                return target
    return None


def _desktop_app_env() -> dict[str, str]:
    env = os.environ.copy()
    env.pop("ELECTRON_RUN_AS_NODE", None)
    return env


def _shortcut_target(shortcut: Path) -> Path | None:
    if os.name != "nt":
        return None
    command = [
        "powershell",
        "-NoProfile",
        "-Command",
        (
            "$shell = New-Object -ComObject WScript.Shell; "
            f"$link = $shell.CreateShortcut('{str(shortcut).replace("'", "''")}'); "
            "$link.TargetPath"
        ),
    ]
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired):
        return None

    target = result.stdout.strip()
    return Path(target) if target else None


_IBM_BOB_INSTALL_URL = "https://bob.ibm.com/"
