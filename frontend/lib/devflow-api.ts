import type {
  AskRepositoryResponse,
  DebugRepositoryResponse,
  OllamaModelsResponse,
  OpenVSCodeResponse,
  RepositoryRecord,
  RepositoryWorkspaceInfo,
} from "@/types/repository-analysis";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      message = data.detail ?? message;
    } catch {
      // Keep the status-based message.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function listRepositories() {
  return request<RepositoryRecord[]>("/repositories");
}

export function clearRepositoryHistory() {
  return request<{ cleared: boolean; message: string }>("/repositories", {
    method: "DELETE",
  });
}

export function getRepositoryWorkspace() {
  return request<RepositoryWorkspaceInfo>("/repositories/workspace");
}

export function listOllamaModels() {
  return request<OllamaModelsResponse>("/ollama/models");
}

export function analyzeRepository(repoUrl: string, model?: string) {
  return request<RepositoryRecord>("/repositories/analyze", {
    method: "POST",
    body: JSON.stringify({ repoUrl, model }),
  });
}

export function askRepository(repositoryId: string, question: string, model?: string) {
  return request<AskRepositoryResponse>(`/repositories/${repositoryId}/ask`, {
    method: "POST",
    body: JSON.stringify({ question, model }),
  });
}

export function debugRepository(repositoryId: string, errorLog: string, model?: string) {
  return request<DebugRepositoryResponse>(`/repositories/${repositoryId}/debug`, {
    method: "POST",
    body: JSON.stringify({ errorLog, model }),
  });
}

export function debugAndOpenRepositoryInIbmBob(
  repositoryId: string,
  errorLog: string,
  model?: string,
) {
  return request<DebugRepositoryResponse & { opened: boolean; openMessage: string; downloadPath?: string }>(
    `/repositories/${repositoryId}/debug-open-ibm-bob`,
    {
      method: "POST",
      body: JSON.stringify({ errorLog, model }),
    },
  );
}

export function openRepositoryInVSCode(repositoryId: string) {
  return request<OpenVSCodeResponse>(`/repositories/${repositoryId}/open-vscode`, {
    method: "POST",
  });
}

export function openRepositoryInIbmBob(repositoryId: string) {
  return request<OpenVSCodeResponse>(`/repositories/${repositoryId}/open-ibm-bob`, {
    method: "POST",
  });
}

export { API_BASE_URL };
