# IBM BOB

IBM BOB is a self-hostable AI developer operations workspace. The current DevFlow AI flow pairs a polished Next.js 15 dashboard with a FastAPI backend that downloads GitHub repositories, analyzes architecture and dependencies, writes generated docs/debug reports, and uses Ollama for local AI explanations when available.

## Stack

- Next.js 15 App Router, TypeScript strict mode, TailwindCSS, Framer Motion, Auth.js
- FastAPI backend for repository download, static inspection, debug reports, and VS Code handoff
- Local repository storage under `~/Downloads/DevFlow AI` by default
- Ollama local model provider
- Docker Compose for local self-hosting

## Quick Start

```bash
copy .env.example .env
docker compose up --build
```

Open `http://localhost:3000`, create an account, then run the workspace from the dashboard.

To run Ollama in the same Compose stack:

```bash
docker compose --profile local-llm up -d ollama
docker exec -it ibm-bob-ollama ollama pull llama3.1:8b
docker compose up --build api web
```

## Local Development

```bash
npm install
npm --prefix frontend install
python -m venv apps/api/.venv
apps/api/.venv/Scripts/activate
pip install -e apps/api[dev]
copy .env.example .env
npm run dev
```

The backend saves each downloaded repository into a unique folder under `~/Downloads/DevFlow AI`. Set `DEVFLOW_DOWNLOAD_DIR` in `.env` if you want a different location.

## Architecture

- `frontend` contains the dashboard UI, reusable primitives, local demo auth, and typed API client.
- `apps/api` contains FastAPI routes, GitHub download logic, repository inspection, Ollama calls, generated markdown reports, and VS Code handoff metadata.
- `vscode-extension` contains the VS Code command scaffold that reads `.vscode/devflow-ai.json` from downloaded repositories and calls the local DevFlow AI backend for ask/debug commands.
- `docker-compose.yml` wires the open-source runtime: Postgres, Chroma, FastAPI, Next.js, and optional Ollama. The current backend does not require Postgres or Chroma for the repo-analysis flow, but the services remain available for future persistence and retrieval work.
