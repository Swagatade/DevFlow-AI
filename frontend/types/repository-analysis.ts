export type OllamaStatus = {
  available: boolean;
  model: string;
  message: string;
};

export type DependencyMapItem = {
  ecosystem: string;
  file: string;
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: string[];
};

export type RepositoryAnalysis = {
  summary: string;
  aiExplanation: string;
  architecture: string[];
  dependencyMap: DependencyMapItem[];
  entryPoints: string[];
  techStack: string[];
  repoTree: string[];
  testPlan: string[];
  bugFindings: string[];
  ollama: OllamaStatus;
};

export type RepositoryRecord = {
  id: string;
  name: string;
  owner: string;
  repoUrl: string;
  downloadPath: string;
  createdAt: string;
  status: "Analyzed" | "Debugging Ready" | string;
  analysis: RepositoryAnalysis;
  analysisPath: string;
  selectedModel?: string;
  debugReportPath?: string | null;
  lastDebugAt?: string;
};

export type RepositoryWorkspaceInfo = {
  downloadRoot: string;
  repositoryCount: number;
  indexPath: string;
  ibmBobInstalled: boolean;
  ibmBobPath?: string | null;
  ibmBobInstallUrl: string;
};

export type AskRepositoryResponse = {
  repositoryId: string;
  question: string;
  answer: string;
  downloadPath: string;
  sourceFiles: string[];
  ollama: OllamaStatus;
};

export type DebugRepositoryResponse = {
  repositoryId: string;
  report: string;
  reportPath: string;
  downloadPath?: string;
  sourceFiles?: string[];
  ollama: OllamaStatus;
};

export type OpenVSCodeResponse = {
  opened: boolean;
  downloadPath: string;
  message: string;
  command?: string;
  installUrl?: string;
};

export type OllamaModel = {
  name: string;
  model: string;
  modifiedAt?: string;
  size?: number;
  digest?: string;
};

export type OllamaModelsResponse = {
  available: boolean;
  baseUrl: string;
  defaultModel: string;
  models: OllamaModel[];
  message: string;
};
