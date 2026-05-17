# DevFlow AI VS Code Extension

This extension connects a repository downloaded by the DevFlow AI dashboard to the local FastAPI backend.

The backend writes `.vscode/devflow-ai.json` into every downloaded repository. Open that folder in VS Code, then run:

- `DevFlow AI: Open Analysis Report`
- `DevFlow AI: Ask About Current Workspace`
- `DevFlow AI: Debug Current Workspace`

The default API endpoint is written by the backend as `http://localhost:8000/api/v1`.
