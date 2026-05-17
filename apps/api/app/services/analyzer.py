from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
import re
import tomllib

from app.core.config import Settings


IGNORED_DIRS = {
    ".git",
    ".hg",
    ".svn",
    ".next",
    ".nuxt",
    ".turbo",
    ".venv",
    "venv",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "target",
    "out",
    ".idea",
    ".ibm-bob",
}

GENERATED_FILE_NAMES = {
    "DEVFLOW_ANALYSIS.md",
    "DEVFLOW_DEBUG_REPORT.md",
}

TEXT_EXTENSIONS = {
    ".c",
    ".cc",
    ".cfg",
    ".conf",
    ".cpp",
    ".cs",
    ".css",
    ".env",
    ".go",
    ".gradle",
    ".h",
    ".html",
    ".java",
    ".js",
    ".json",
    ".jsx",
    ".kt",
    ".md",
    ".mjs",
    ".php",
    ".properties",
    ".py",
    ".rb",
    ".rs",
    ".sh",
    ".sql",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".vue",
    ".xml",
    ".yaml",
    ".yml",
}

PRIORITY_FILE_NAMES = {
    ".env.example",
    "README.md",
    "package.json",
    "pyproject.toml",
    "requirements.txt",
    "go.mod",
    "Cargo.toml",
    "pom.xml",
    "build.gradle",
    "docker-compose.yml",
    "Dockerfile",
    "next.config.ts",
    "next.config.js",
    "tailwind.config.ts",
    "main.py",
    "app.py",
    "index.ts",
    "index.tsx",
    "index.js",
    "server.ts",
    "server.js",
}


@dataclass(frozen=True)
class RepoInspection:
    root: Path
    repo_name: str
    repo_url: str
    repo_tree: list[str]
    files: list[str]
    entry_points: list[str]
    tech_stack: list[str]
    architecture: list[str]
    dependency_map: list[dict]
    test_plan: list[str]
    bug_findings: list[str]
    context: str


def inspect_repository(root: Path, repo_name: str, repo_url: str, settings: Settings) -> RepoInspection:
    files = _collect_files(root)
    repo_tree = _build_tree(root, settings.max_tree_entries)
    dependency_map = _dependency_map(root)
    tech_stack = _detect_tech_stack(files, dependency_map)
    entry_points = _entry_points(files, dependency_map)
    architecture = _architecture_notes(root, files, tech_stack)
    bug_findings = _bug_findings(root, files)
    test_plan = _test_plan(tech_stack, dependency_map)
    context = _build_context(
        root=root,
        repo_name=repo_name,
        repo_url=repo_url,
        settings=settings,
        repo_tree=repo_tree,
        files=files,
        dependency_map=dependency_map,
        tech_stack=tech_stack,
        entry_points=entry_points,
        bug_findings=bug_findings,
    )

    return RepoInspection(
        root=root,
        repo_name=repo_name,
        repo_url=repo_url,
        repo_tree=repo_tree,
        files=files,
        entry_points=entry_points,
        tech_stack=tech_stack,
        architecture=architecture,
        dependency_map=dependency_map,
        test_plan=test_plan,
        bug_findings=bug_findings,
        context=context,
    )


def build_analysis_prompt(inspection: RepoInspection, repo_name: str) -> str:
    return f"""You are DevFlow AI, a senior repository onboarding and debugging assistant.
Analyze this repository for a developer who needs to understand it in 60 seconds.
Keep the whole answer under 550 words.

Return concise markdown with these exact sections:
## 60 Second Explanation
## Architecture Map
## Dependency Map
## Generated README Notes
## Test Plan
## Debugging Risks

Repository: {repo_name}

{inspection.context}
"""


def build_question_prompt(inspection: RepoInspection, question: str, repo_name: str) -> str:
    focused_context = _question_focused_context(inspection, question)
    compact_context = _compact_repo_context(inspection)
    return f"""You are DevFlow AI answering a repository question.
You are working from a real local git clone on disk, not from the GitHub link and not from the DevFlow app source code.
Answer using ONLY the downloaded repository files shown below.
Do not invent source files, folders, APIs, or implementation details that are not present in the clone.
For every important claim, cite the file path that supports it, for example `README.md` or `requirements.md`.
Format the answer as clean markdown with a short title, clear section headings, short paragraphs, and bullet lists.
Use markdown tables only when comparing 3-8 compact items. Do not use raw HTML such as <br>.
Prefer sections such as Overview, How It Works, Important Files, Run Commands, Configuration, Risks, and Next Steps when they fit the question.
If the clone only contains documentation and no runnable source code, say that clearly.
If the user asks for debugging and there is no implementation code, explain what can be debugged from the docs and what file is missing.
Do not treat generated files like DEVFLOW_ANALYSIS.md, DEVFLOW_DEBUG_REPORT.md, or .ibm-bob/devflow-ai.json as source files.
Keep the answer under 450 words.

Repository: {repo_name}
Downloaded local folder: {inspection.root}
Question: {question}
Files in this clone: {", ".join(inspection.files) or "none"}

Downloaded repo metadata:
{compact_context}

Question-focused excerpts from the downloaded repo:
{focused_context}
"""


def build_debug_prompt(
    inspection: RepoInspection,
    repo_name: str,
    error_log: str | None,
) -> str:
    error_section = error_log.strip() if error_log and error_log.strip() else "No runtime log was supplied. Use static repository signals."
    return f"""You are DevFlow AI debugging a downloaded local repository.
You must reason only from the cloned repository files shown below.
Keep the report under 650 words.
Provide a practical markdown debug report with:
1. Most likely root cause
2. Files to open first
3. Concrete fix plan based on files that actually exist
4. Commands to run in the IBM Bob terminal
5. Tests to add or run
6. Missing implementation files, if the clone only contains documentation

Repository: {repo_name}
Downloaded local folder: {inspection.root}
Error log:
{error_section}

Static signals:
{inspection.context}
"""


def fallback_analysis(inspection: RepoInspection, repo_name: str) -> str:
    tech = ", ".join(inspection.tech_stack[:6]) or "the detected source files"
    architecture = "\n".join(f"- {item}" for item in inspection.architecture[:5])
    dependencies = "\n".join(
        f"- {item['ecosystem']}: {', '.join(item.get('dependencies', [])[:8]) or 'no dependencies listed'}"
        for item in inspection.dependency_map[:5]
    )
    findings = "\n".join(f"- {item}" for item in inspection.bug_findings[:5])
    tests = "\n".join(f"- {item}" for item in inspection.test_plan[:5])
    return f"""## 60 Second Explanation
{repo_name} appears to be built with {tech}. The repository has {len(inspection.files)} tracked source/config files in the analyzed context.

## Architecture Map
{architecture or "- No strong architectural directories were detected from the sampled files."}

## Dependency Map
{dependencies or "- No package manifest was detected in the sampled repository."}

## Generated README Notes
- Add setup prerequisites, environment variables, local run commands, test commands, and a short architecture overview.
- Link the main entry points: {", ".join(inspection.entry_points[:5]) or "no obvious entry points detected"}.

## Test Plan
{tests or "- Add smoke tests around the main entry point and critical user workflows."}

## Debugging Risks
{findings or "- No obvious static bug markers were found in the sampled files."}
"""


def _collect_files(root: Path) -> list[str]:
    files: list[str] = []
    for path in root.rglob("*"):
        if not path.is_file() or _has_ignored_part(path.relative_to(root)):
            continue
        if path.name in GENERATED_FILE_NAMES:
            continue
        if path.suffix in TEXT_EXTENSIONS or path.name in PRIORITY_FILE_NAMES:
            files.append(path.relative_to(root).as_posix())
    return sorted(files)


def _build_tree(root: Path, max_entries: int) -> list[str]:
    lines: list[str] = []
    entries = 0

    def walk(directory: Path, depth: int) -> None:
        nonlocal entries
        if entries >= max_entries or depth > 4:
            return
        children = sorted(
            [child for child in directory.iterdir() if not _has_ignored_part(child.relative_to(root))],
            key=lambda item: (item.is_file(), item.name.lower()),
        )
        for child in children:
            if entries >= max_entries:
                return
            relative = child.relative_to(root)
            if child.is_file() and child.name in GENERATED_FILE_NAMES:
                continue
            indent = "  " * depth
            marker = "/" if child.is_dir() else ""
            lines.append(f"{indent}{child.name}{marker}")
            entries += 1
            if child.is_dir():
                walk(child, depth + 1)

    walk(root, 0)
    if entries >= max_entries:
        lines.append("...")
    return lines


def _dependency_map(root: Path) -> list[dict]:
    maps: list[dict] = []
    package_json = root / "package.json"
    if package_json.exists():
        try:
            data = json.loads(package_json.read_text(encoding="utf-8"))
            dependencies = _dependency_names(data.get("dependencies", {}))
            dev_dependencies = _dependency_names(data.get("devDependencies", {}))
            maps.append(
                {
                    "ecosystem": "npm",
                    "file": "package.json",
                    "dependencies": dependencies,
                    "devDependencies": dev_dependencies,
                    "scripts": sorted((data.get("scripts") or {}).keys()),
                }
            )
        except (json.JSONDecodeError, OSError):
            maps.append({"ecosystem": "npm", "file": "package.json", "dependencies": []})

    pyproject = root / "pyproject.toml"
    if pyproject.exists():
        try:
            data = tomllib.loads(pyproject.read_text(encoding="utf-8"))
            project = data.get("project", {})
            dependencies = [str(item).split(";", 1)[0].strip() for item in project.get("dependencies", [])]
            maps.append(
                {
                    "ecosystem": "python",
                    "file": "pyproject.toml",
                    "dependencies": dependencies,
                    "scripts": sorted((project.get("scripts") or {}).keys()),
                }
            )
        except (tomllib.TOMLDecodeError, OSError):
            maps.append({"ecosystem": "python", "file": "pyproject.toml", "dependencies": []})

    requirements = root / "requirements.txt"
    if requirements.exists():
        dependencies = []
        for line in _read_text(requirements, 12000).splitlines():
            cleaned = line.strip()
            if cleaned and not cleaned.startswith("#"):
                dependencies.append(cleaned)
        maps.append({"ecosystem": "python", "file": "requirements.txt", "dependencies": dependencies})

    go_mod = root / "go.mod"
    if go_mod.exists():
        text = _read_text(go_mod, 20000)
        dependencies = re.findall(r"^\s*require\s+([^\s]+)", text, flags=re.MULTILINE)
        maps.append({"ecosystem": "go", "file": "go.mod", "dependencies": dependencies})

    cargo = root / "Cargo.toml"
    if cargo.exists():
        try:
            data = tomllib.loads(cargo.read_text(encoding="utf-8"))
            dependencies = sorted((data.get("dependencies") or {}).keys())
            maps.append({"ecosystem": "rust", "file": "Cargo.toml", "dependencies": dependencies})
        except (tomllib.TOMLDecodeError, OSError):
            maps.append({"ecosystem": "rust", "file": "Cargo.toml", "dependencies": []})

    return maps


def _dependency_names(group: dict) -> list[str]:
    return [f"{name}@{version}" for name, version in sorted(group.items())][:40]


def _detect_tech_stack(files: list[str], dependency_map: list[dict]) -> list[str]:
    stack: set[str] = set()
    file_set = set(files)
    dependency_text = " ".join(
        " ".join(item.get("dependencies", []) + item.get("devDependencies", []))
        for item in dependency_map
    ).lower()

    if any(path.endswith((".ts", ".tsx")) for path in file_set):
        stack.add("TypeScript")
    if any(path.endswith((".js", ".jsx", ".mjs")) for path in file_set):
        stack.add("JavaScript")
    if any(path.endswith(".py") for path in file_set):
        stack.add("Python")
    if "next" in dependency_text or any("next.config" in path for path in file_set):
        stack.add("Next.js")
    if "react" in dependency_text or any(path.endswith(".tsx") for path in file_set):
        stack.add("React")
    if "tailwind" in dependency_text or any("tailwind.config" in path for path in file_set):
        stack.add("Tailwind CSS")
    if "fastapi" in dependency_text:
        stack.add("FastAPI")
    if any(path == "docker-compose.yml" or path.endswith("/Dockerfile") for path in file_set):
        stack.add("Docker")
    if any(path.endswith(".go") for path in file_set):
        stack.add("Go")
    if any(path.endswith(".rs") for path in file_set):
        stack.add("Rust")
    if any(path.endswith(".java") for path in file_set):
        stack.add("Java")

    return sorted(stack)


def _entry_points(files: list[str], dependency_map: list[dict]) -> list[str]:
    candidates = [
        "app/main.py",
        "main.py",
        "app.py",
        "src/main.py",
        "src/index.ts",
        "src/index.tsx",
        "src/main.ts",
        "src/main.tsx",
        "app/page.tsx",
        "pages/index.tsx",
        "server.js",
        "server.ts",
        "index.js",
        "index.ts",
    ]
    found = [item for item in candidates if item in files]
    for item in dependency_map:
        if item.get("file") == "package.json" and item.get("scripts"):
            found.extend(f"package.json script: {script}" for script in item["scripts"][:8])
    return _unique(found)[:14]


def _architecture_notes(root: Path, files: list[str], tech_stack: list[str]) -> list[str]:
    notes: list[str] = []
    top_dirs = {path.split("/", 1)[0] for path in files if "/" in path}

    if "app" in top_dirs and "Next.js" in tech_stack:
        notes.append("Next.js App Router style UI is organized under app/ route segments.")
    if "components" in top_dirs:
        notes.append("Reusable UI or feature components are grouped under components/.")
    if "src" in top_dirs:
        notes.append("Core application code is centered in src/.")
    if "api" in top_dirs or any("/api/" in path for path in files):
        notes.append("API routes or backend boundary files are present.")
    if "services" in top_dirs or any("/services/" in path for path in files):
        notes.append("Service modules suggest a separate business-logic layer.")
    if "models" in top_dirs or any("/models/" in path for path in files):
        notes.append("Model modules suggest explicit domain or persistence objects.")
    if "tests" in top_dirs or any(path.startswith("test") or "/test" in path for path in files):
        notes.append("Automated tests are already part of the repository layout.")
    if (root / "docker-compose.yml").exists():
        notes.append("Docker Compose is available for local multi-service orchestration.")

    return notes[:8]


def _bug_findings(root: Path, files: list[str]) -> list[str]:
    markers = {"TODO": 0, "FIXME": 0, "HACK": 0, "console.log": 0, "except:": 0}
    risky_files: list[str] = []
    for relative in files[:220]:
        path = root / relative
        text = _read_text(path, 25000)
        if not text:
            continue
        for marker in markers:
            markers[marker] += text.count(marker)
        if "process.env" in text and ".env.example" not in files:
            risky_files.append(relative)

    findings = [
        f"{count} `{marker}` marker(s) found in sampled files."
        for marker, count in markers.items()
        if count
    ]
    if risky_files:
        findings.append(
            "Environment variables are referenced but `.env.example` was not found in the sampled repository."
        )
    if not findings:
        findings.append("No obvious static bug markers were found in the sampled files.")
    return findings[:7]


def _test_plan(tech_stack: list[str], dependency_map: list[dict]) -> list[str]:
    plan: list[str] = []
    npm_scripts: set[str] = set()
    for item in dependency_map:
        npm_scripts.update(item.get("scripts", []))

    if npm_scripts:
        for script in ["lint", "typecheck", "test", "build"]:
            if script in npm_scripts:
                plan.append(f"Run `npm run {script}` and capture failures in DevFlow AI debugging.")
    if "FastAPI" in tech_stack or "Python" in tech_stack:
        plan.append("Add or run pytest coverage for API routes, service functions, and error paths.")
    if "Next.js" in tech_stack or "React" in tech_stack:
        plan.append("Add component smoke tests for route screens, forms, and async loading states.")
    if not plan:
        plan.append("Add smoke tests around the main entry point and critical repository workflows.")
    return _unique(plan)[:8]


def _build_context(
    root: Path,
    repo_name: str,
    repo_url: str,
    settings: Settings,
    repo_tree: list[str],
    files: list[str],
    dependency_map: list[dict],
    tech_stack: list[str],
    entry_points: list[str],
    bug_findings: list[str],
) -> str:
    sections = [
        f"Repository name: {repo_name}",
        f"Repository URL: {repo_url}",
        f"Downloaded local folder: {root}",
        f"Tech stack: {', '.join(tech_stack) or 'unknown'}",
        f"Entry points: {', '.join(entry_points) or 'unknown'}",
        "Repository tree:",
        "\n".join(repo_tree),
        "Dependency map:",
        json.dumps(dependency_map, indent=2),
        "Static bug/debug signals:",
        "\n".join(f"- {item}" for item in bug_findings),
        "Key files:",
    ]

    total_chars = sum(len(section) for section in sections)
    for relative in _prioritized_files(files)[: settings.max_context_files]:
        path = root / relative
        text = _read_text(path, settings.max_file_chars)
        if not text:
            continue
        chunk = f"\n--- {relative} ---\n{text}\n"
        if total_chars + len(chunk) > settings.max_total_context_chars:
            break
        sections.append(chunk)
        total_chars += len(chunk)

    return "\n".join(sections)


def _question_focused_context(inspection: RepoInspection, question: str) -> str:
    ranked_files = _rank_files_for_question(inspection, question)
    if not ranked_files:
        return "No question-specific file matches were found. Use the full downloaded repo context below."

    sections: list[str] = []
    total_chars = 0
    for relative in ranked_files[:4]:
        path = inspection.root / relative
        text = _read_text(path, 4500)
        if not text:
            continue
        chunk = f"\n--- {relative} ---\n{text}\n"
        if total_chars + len(chunk) > 15000:
            break
        sections.append(chunk)
        total_chars += len(chunk)

    return "\n".join(sections) if sections else "No readable question-specific file excerpts were found."


def _compact_repo_context(inspection: RepoInspection) -> str:
    dependency_map = json.dumps(inspection.dependency_map, indent=2)
    return "\n".join(
        [
            f"Repository name: {inspection.repo_name}",
            f"Repository URL: {inspection.repo_url}",
            f"Downloaded local folder: {inspection.root}",
            f"Tech stack: {', '.join(inspection.tech_stack) or 'unknown'}",
            f"Entry points: {', '.join(inspection.entry_points) or 'unknown'}",
            "Repository tree:",
            "\n".join(inspection.repo_tree),
            "Dependency map:",
            dependency_map,
            "Static bug/debug signals:",
            "\n".join(f"- {item}" for item in inspection.bug_findings),
        ]
    )


def _rank_files_for_question(inspection: RepoInspection, question: str) -> list[str]:
    terms = _search_terms(question)
    if not terms:
        return _prioritized_files(inspection.files)[:10]

    scored: list[tuple[int, int, str]] = []
    for relative in inspection.files:
        path_score = 0
        lower_path = relative.lower()
        for term in terms:
            if term in lower_path:
                path_score += 18
            if Path(lower_path).name == term:
                path_score += 30

        text = _read_text(inspection.root / relative, 30000).lower()
        content_score = 0
        for term in terms:
            content_score += min(text.count(term), 8)

        score = path_score + content_score
        if score:
            scored.append((score, -len(relative), relative))

    if not scored:
        return _prioritized_files(inspection.files)[:10]

    return [relative for _, _, relative in sorted(scored, reverse=True)]


def _search_terms(question: str) -> list[str]:
    ignored = {
        "about",
        "after",
        "answer",
        "based",
        "code",
        "does",
        "file",
        "from",
        "give",
        "help",
        "how",
        "into",
        "issue",
        "make",
        "repo",
        "repository",
        "show",
        "tell",
        "that",
        "the",
        "this",
        "what",
        "when",
        "where",
        "which",
        "with",
    }
    terms = []
    for term in re.findall(r"[A-Za-z0-9_.-]{3,}", question.lower()):
        cleaned = term.strip("._-")
        if cleaned and cleaned not in ignored:
            terms.append(cleaned)
    return _unique(terms)[:16]


def _prioritized_files(files: list[str]) -> list[str]:
    def score(path: str) -> tuple[int, int, str]:
        name = Path(path).name
        if name in PRIORITY_FILE_NAMES:
            return (0, len(path), path)
        if "/app/" in f"/{path}" or "/src/" in f"/{path}":
            return (1, len(path), path)
        return (2, len(path), path)

    return sorted(files, key=score)


def _read_text(path: Path, max_chars: int) -> str:
    try:
        data = path.read_bytes()
    except OSError:
        return ""
    if b"\x00" in data:
        return ""
    text = data[: max_chars * 2].decode("utf-8", errors="ignore")
    return text[:max_chars]


def _has_ignored_part(relative: Path) -> bool:
    return any(part in IGNORED_DIRS for part in relative.parts)


def _unique(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            result.append(item)
    return result
