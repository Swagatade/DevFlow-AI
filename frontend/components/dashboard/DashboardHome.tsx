"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Download,
  ExternalLink,
  FolderOpen,
  GitBranch,
  LoaderCircle,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  analyzeRepository,
  askRepository,
  clearRepositoryHistory,
  debugRepository,
  getRepositoryWorkspace,
  listOllamaModels,
  listRepositories,
  openRepositoryInIbmBob,
} from "@/lib/devflow-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type {
  DebugRepositoryResponse,
  OllamaModelsResponse,
  RepositoryRecord,
  RepositoryWorkspaceInfo,
} from "@/types/repository-analysis";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Send a GitHub repo link to download and analyze it. After that, ask anything about the repo and I will answer using your selected Ollama model.",
};

export function DashboardHome() {
  const [records, setRecords] = useState<RepositoryRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [workspaceInfo, setWorkspaceInfo] = useState<RepositoryWorkspaceInfo | null>(null);
  const [modelsInfo, setModelsInfo] = useState<OllamaModelsResponse | null>(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [input, setInput] = useState("");
  const [repoInput, setRepoInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [debugReport, setDebugReport] = useState<DebugRepositoryResponse | null>(null);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [loadingModels, setLoadingModels] = useState(true);
  const [working, setWorking] = useState(false);
  const [debugging, setDebugging] = useState(false);
  const [opening, setOpening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      const [repositoryResult, modelsResult, workspaceResult] = await Promise.allSettled([
        listRepositories(),
        listOllamaModels(),
        getRepositoryWorkspace(),
      ]);

      if (!mounted) {
        return;
      }

      if (repositoryResult.status === "fulfilled") {
        setRecords(repositoryResult.value);
        setActiveId(repositoryResult.value[0]?.id ?? null);
      } else {
        pushAssistant(`Could not load repo history: ${errorMessage(repositoryResult.reason)}`);
      }
      setLoadingRecords(false);

      if (modelsResult.status === "fulfilled") {
        applyModels(modelsResult.value);
      } else {
        setModelsInfo({
          available: false,
          baseUrl: "http://localhost:11434",
          defaultModel: "llama3.1:8b",
          models: [],
          message: `Could not reach Ollama: ${errorMessage(modelsResult.reason)}`,
        });
      }
      setLoadingModels(false);

      if (workspaceResult.status === "fulfilled") {
        setWorkspaceInfo(workspaceResult.value);
      } else {
        pushAssistant(`Could not load workspace folder: ${errorMessage(workspaceResult.reason)}`);
      }
    }

    void loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, working]);

  const activeRecord = useMemo(
    () => records.find((record) => record.id === activeId) ?? records[0] ?? null,
    [activeId, records],
  );

  function applyModels(info: OllamaModelsResponse) {
    setModelsInfo(info);
    setSelectedModel((current) => {
      if (current) {
        return current;
      }
      return info.defaultModel || info.models[0]?.name || "";
    });
  }

  async function refreshModels() {
    setLoadingModels(true);
    try {
      applyModels(await listOllamaModels());
    } catch (err) {
      setModelsInfo({
        available: false,
        baseUrl: "http://localhost:11434",
        defaultModel: selectedModel || "llama3.1:8b",
        models: [],
        message: errorMessage(err),
      });
    } finally {
      setLoadingModels(false);
    }
  }

  async function refreshWorkspaceInfo() {
    try {
      setWorkspaceInfo(await getRepositoryWorkspace());
    } catch {
      // Workspace metadata is helpful, but repo chat can continue without it.
    }
  }

  async function handleComposerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || working) {
      return;
    }

    setInput("");
    pushUser(content);

    if (isGitHubRepoUrl(content)) {
      await analyzeRepo(content);
      return;
    }

    if (!activeRecord) {
      pushAssistant("Paste a GitHub repo link first, then ask questions about that repo.");
      return;
    }

    setWorking(true);
    try {
      const response = await askRepository(activeRecord.id, content, selectedModel);
      pushAssistant(response.answer);
    } catch (err) {
      pushAssistant(`I could not answer that yet: ${errorMessage(err)}`);
    } finally {
      setWorking(false);
    }
  }

  async function handleRepoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = repoInput.trim();
    if (!url || working) {
      return;
    }
    setRepoInput("");
    pushUser(url);
    await analyzeRepo(url);
  }

  async function analyzeRepo(repoUrl: string) {
    setWorking(true);
    setDebugReport(null);
    pushAssistant("Downloading the repo and indexing the downloaded files for chat...");

    try {
      const record = await analyzeRepository(repoUrl, selectedModel);
      setRecords((current) => [
        record,
        ...current.filter((item) => item.id !== record.id),
      ]);
      setActiveId(record.id);
      void refreshWorkspaceInfo();
      pushAssistant(
        [
          `Repo analyzed: ${record.owner}/${record.name}`,
          "",
          record.analysis.summary,
          "",
          `Downloaded to: ${record.downloadPath}`,
          `Chat model: ${record.selectedModel ?? selectedModel}`,
          "",
          "Now every question uses that downloaded folder as the source.",
        ].join("\n"),
      );
    } catch (err) {
      pushAssistant(`Repo analysis failed: ${errorMessage(err)}`);
    } finally {
      setWorking(false);
    }
  }

  async function handleDebugRepo() {
    if (!activeRecord || debugging) {
      return;
    }

    setDebugging(true);
    try {
      const response = await debugRepository(activeRecord.id, "", selectedModel);
      setDebugReport(response);
      pushAssistant(
        `Debug report created for ${activeRecord.owner}/${activeRecord.name}.\n\n${response.report}`,
      );
      setRecords((current) =>
        current.map((record) =>
          record.id === activeRecord.id
            ? { ...record, status: "Debugging Ready", debugReportPath: response.reportPath }
            : record,
        ),
      );
    } catch (err) {
      pushAssistant(`Debug report failed: ${errorMessage(err)}`);
    } finally {
      setDebugging(false);
    }
  }

  async function handleOpenIbmBob() {
    if (!activeRecord || opening) {
      return;
    }

    setOpening(true);
    try {
      const response = await openRepositoryInIbmBob(activeRecord.id);
      if (!response.opened && response.installUrl) {
        window.open(response.installUrl, "_blank", "noopener,noreferrer");
      }
      pushAssistant(response.command ? `${response.message}\n${response.command}` : response.message);
    } catch (err) {
      pushAssistant(`Could not open IBM Bob: ${errorMessage(err)}`);
    } finally {
      setOpening(false);
    }
  }

  function handleNewRepo() {
    setActiveId(null);
    setDebugReport(null);
    setMessages([
      {
        ...welcomeMessage,
        id: crypto.randomUUID(),
        content: "Paste a GitHub repository link and I will download, analyze, and prepare it for chat.",
      },
    ]);
    window.setTimeout(() => composerRef.current?.focus(), 50);
  }

  async function handleClearHistory() {
    try {
      const response = await clearRepositoryHistory();
      setRecords([]);
      setActiveId(null);
      void refreshWorkspaceInfo();
      setDebugReport(null);
      setMessages([
        welcomeMessage,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
        },
      ]);
    } catch (err) {
      pushAssistant(`Could not clear history: ${errorMessage(err)}`);
    }
  }

  function selectRecord(record: RepositoryRecord) {
    setActiveId(record.id);
    setDebugReport(null);
    setMessages([
      welcomeMessage,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: [
          `Selected repo: ${record.owner}/${record.name}`,
          "",
          record.analysis.summary,
          "",
          "Ask me anything about this repository.",
        ].join("\n"),
      },
    ]);
  }

  function pushUser(content: string) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content },
    ]);
  }

  function pushAssistant(content: string) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "assistant", content },
    ]);
  }

  return (
    <div className="grid h-screen min-h-0 grid-cols-1 overflow-hidden text-white lg:grid-cols-[18rem_minmax(0,1fr)_21rem]">
      <HistoryPanel
        records={records}
        activeId={activeRecord?.id ?? null}
        loading={loadingRecords}
        onSelect={selectRecord}
        onNewRepo={handleNewRepo}
        onClearHistory={handleClearHistory}
      />

      <section className="flex min-h-0 min-w-0 flex-col border-x border-white/10 bg-background/36 backdrop-blur-xl">
        <ChatHeader
          modelsInfo={modelsInfo}
          selectedModel={selectedModel}
          loadingModels={loadingModels}
          onModelChange={setSelectedModel}
          onRefreshModels={refreshModels}
        />
        <ActiveRepoBar
          activeRecord={activeRecord}
          workspaceInfo={workspaceInfo}
          opening={opening}
          onOpenIbmBob={handleOpenIbmBob}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {working ? <ThinkingBubble /> : null}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-white/10 bg-background/82 p-3 backdrop-blur-2xl sm:p-4">
          <form
            className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.065] p-2 shadow-inner-line"
            onSubmit={handleComposerSubmit}
          >
            <textarea
              ref={composerRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                activeRecord
                  ? "Ask about this repo, or paste another GitHub link"
                  : "Paste a GitHub repo link to start"
              }
              rows={1}
              className="max-h-40 min-h-11 flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm leading-6 text-white placeholder:text-white/36 focus:ring-0"
              disabled={working}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || working}>
              <Send aria-hidden="true" className="size-4" />
            </Button>
          </form>
        </div>
      </section>

      <DownloadsPanel
        records={records}
        activeRecord={activeRecord}
        activeId={activeRecord?.id ?? null}
        workspaceInfo={workspaceInfo}
        repoInput={repoInput}
        working={working}
        debugging={debugging}
        opening={opening}
        debugReport={debugReport}
        onRepoInputChange={setRepoInput}
        onRepoSubmit={handleRepoSubmit}
        onSelect={selectRecord}
        onDebug={handleDebugRepo}
        onOpenIbmBob={handleOpenIbmBob}
      />
    </div>
  );
}

function ActiveRepoBar({
  activeRecord,
  workspaceInfo,
  opening,
  onOpenIbmBob,
}: {
  activeRecord: RepositoryRecord | null;
  workspaceInfo: RepositoryWorkspaceInfo | null;
  opening: boolean;
  onOpenIbmBob: () => void;
}) {
  if (!activeRecord) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-black/18 px-4 py-3 sm:px-5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {activeRecord.owner}/{activeRecord.name}
        </p>
        <p className="truncate font-mono text-xs text-white/42">
          {activeRecord.downloadPath}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          isLoading={opening}
          onClick={onOpenIbmBob}
        >
          {workspaceInfo?.ibmBobInstalled ? (
            <ExternalLink aria-hidden="true" className="size-4" />
          ) : (
            <Download aria-hidden="true" className="size-4" />
          )}
          {workspaceInfo?.ibmBobInstalled ? "IBM Bob" : "Install IBM Bob"}
        </Button>
      </div>
    </div>
  );
}

function HistoryPanel({
  records,
  activeId,
  loading,
  onSelect,
  onNewRepo,
  onClearHistory,
}: {
  records: RepositoryRecord[];
  activeId: string | null;
  loading: boolean;
  onSelect: (record: RepositoryRecord) => void;
  onNewRepo: () => void;
  onClearHistory: () => void;
}) {
  return (
    <aside className="hidden min-h-0 border-r border-white/10 bg-black/24 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/12 shadow-glow">
              <Sparkles aria-hidden="true" className="size-4 text-primary" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-semibold">DevFlow AI</h1>
              <p className="truncate text-xs text-white/42">Repo chat history</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Add GitHub repo"
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/12 text-primary transition hover:bg-primary hover:text-primary-foreground"
            onClick={onNewRepo}
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>
        {records.length ? (
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 text-xs text-white/44 transition hover:text-rose-100"
            onClick={onClearHistory}
          >
            <Trash2 aria-hidden="true" className="size-3.5" />
            Clear history
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] p-3 text-sm text-white/52">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-primary" />
            Loading history
          </div>
        ) : records.length ? (
          <div className="space-y-2">
            {records.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => onSelect(record)}
                className="w-full rounded-md border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-primary/30 hover:bg-primary/10 data-[active=true]:border-primary/35 data-[active=true]:bg-primary/12"
                data-active={record.id === activeId}
              >
                <p className="truncate text-sm font-medium">{record.name}</p>
                <p className="mt-1 truncate text-xs text-white/42">{record.owner}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-white/10 bg-white/[0.045] p-3 text-sm leading-6 text-white/52">
            No repo history yet. Paste a GitHub link in chat.
          </p>
        )}
      </div>
    </aside>
  );
}

function ChatHeader({
  modelsInfo,
  selectedModel,
  loadingModels,
  onModelChange,
  onRefreshModels,
}: {
  modelsInfo: OllamaModelsResponse | null;
  selectedModel: string;
  loadingModels: boolean;
  onModelChange: (model: string) => void;
  onRefreshModels: () => void;
}) {
  const models = modelsInfo?.models ?? [];

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-background/78 px-4 py-3 backdrop-blur-2xl sm:px-5">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
          Chat with your repo
        </p>
        <h2 className="truncate font-display text-lg font-semibold">
          GitHub repository assistant
        </h2>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <StatusBadge tone={modelsInfo?.available ? "success" : "warning"}>
          {modelsInfo?.available ? `${models.length} model${models.length === 1 ? "" : "s"}` : "Ollama offline"}
        </StatusBadge>
        <select
          value={selectedModel}
          onChange={(event) => onModelChange(event.target.value)}
          className="h-10 max-w-[13rem] rounded-md border border-white/10 bg-white/[0.08] px-3 text-sm text-white shadow-inner-line focus:border-primary/55 focus:ring-primary/30"
          disabled={loadingModels}
        >
          {models.length ? (
            models.map((model) => (
              <option key={model.name} value={model.name} className="bg-slate-950">
                {model.name}
              </option>
            ))
          ) : (
            <option value={selectedModel || modelsInfo?.defaultModel || ""} className="bg-slate-950">
              {selectedModel || modelsInfo?.defaultModel || "No model detected"}
            </option>
          )}
        </select>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          isLoading={loadingModels}
          onClick={onRefreshModels}
          aria-label="Refresh Ollama models"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </header>
  );
}

function DownloadsPanel({
  records,
  activeRecord,
  activeId,
  workspaceInfo,
  repoInput,
  working,
  debugging,
  opening,
  debugReport,
  onRepoInputChange,
  onRepoSubmit,
  onSelect,
  onDebug,
  onOpenIbmBob,
}: {
  records: RepositoryRecord[];
  activeRecord: RepositoryRecord | null;
  activeId: string | null;
  workspaceInfo: RepositoryWorkspaceInfo | null;
  repoInput: string;
  working: boolean;
  debugging: boolean;
  opening: boolean;
  debugReport: DebugRepositoryResponse | null;
  onRepoInputChange: (value: string) => void;
  onRepoSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelect: (record: RepositoryRecord) => void;
  onDebug: () => void;
  onOpenIbmBob: () => void;
}) {
  return (
    <aside className="hidden min-h-0 bg-black/20 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="border-b border-white/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
          Repo download
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold">Workspace</h2>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <form className="space-y-3 rounded-card border border-white/10 bg-white/[0.045] p-4" onSubmit={onRepoSubmit}>
          <Input
            value={repoInput}
            onChange={(event) => onRepoInputChange(event.target.value)}
            placeholder="https://github.com/owner/repo"
            disabled={working}
          />
          <Button type="submit" className="w-full" isLoading={working} disabled={!repoInput.trim()}>
            <Download aria-hidden="true" className="size-4" />
            Download and Analyze
          </Button>
        </form>

        <div className="rounded-card border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center gap-2">
            <FolderOpen aria-hidden="true" className="size-4 text-primary" />
            <h3 className="font-display text-sm font-semibold">Repo selection</h3>
          </div>
          <p className="mt-3 break-all font-mono text-xs leading-5 text-white/44">
            {workspaceInfo?.downloadRoot ?? "~/Downloads/DevFlow AI"}
          </p>
          <p className="mt-2 text-xs leading-5 text-white/48">
            IBM Bob:{" "}
            <span className={workspaceInfo?.ibmBobInstalled ? "text-emerald-200" : "text-amber-200"}>
              {workspaceInfo?.ibmBobInstalled ? "Installed" : "Not installed"}
            </span>
          </p>
          {workspaceInfo?.ibmBobPath ? (
            <p className="mt-1 break-all font-mono text-[0.7rem] leading-4 text-white/34">
              {workspaceInfo.ibmBobPath}
            </p>
          ) : null}
          <select
            value={activeId ?? ""}
            onChange={(event) => {
              const record = records.find((item) => item.id === event.target.value);
              if (record) {
                onSelect(record);
              }
            }}
            className="mt-3 h-10 w-full rounded-md border border-white/10 bg-white/[0.08] px-3 text-sm text-white shadow-inner-line focus:border-primary/55 focus:ring-primary/30"
            disabled={!records.length || working}
          >
            {records.length ? (
              records.map((record) => (
                <option key={record.id} value={record.id} className="bg-slate-950">
                  {record.owner}/{record.name}
                </option>
              ))
            ) : (
              <option value="" className="bg-slate-950">
                Download a GitHub repo first
              </option>
            )}
          </select>
        </div>

        <div className="rounded-card border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center gap-2">
            <GitBranch aria-hidden="true" className="size-4 text-primary" />
            <h3 className="font-display text-sm font-semibold">Selected repo</h3>
          </div>
          {activeRecord ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="truncate text-sm font-medium">
                  {activeRecord.owner}/{activeRecord.name}
                </p>
                <p className="mt-1 break-all font-mono text-xs leading-5 text-white/44">
                  {activeRecord.downloadPath}
                </p>
              </div>
              <p className="text-sm leading-6 text-white/58">{activeRecord.analysis.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={opening}
                  onClick={onOpenIbmBob}
                >
                  {workspaceInfo?.ibmBobInstalled ? (
                    <ExternalLink aria-hidden="true" className="size-4" />
                  ) : (
                    <Download aria-hidden="true" className="size-4" />
                  )}
                  {workspaceInfo?.ibmBobInstalled ? "IBM Bob" : "Install IBM Bob"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={debugging}
                  onClick={onDebug}
                >
                  Report only
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-white/52">
              No repo selected. Paste a GitHub link in chat or use the download box.
            </p>
          )}
        </div>

        <div className="rounded-card border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
            <h3 className="font-display text-sm font-semibold">Generated files</h3>
          </div>
          <div className="mt-3 space-y-2 text-sm leading-6 text-white/54">
            <p>Analysis: {activeRecord?.analysisPath ?? "Not generated yet"}</p>
            <p>Debug: {debugReport?.reportPath ?? activeRecord?.debugReportPath ?? "Not generated yet"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const Icon = isUser ? UserRound : Bot;

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-primary">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      ) : null}
      <div
        className={
          isUser
            ? "max-w-[82%] rounded-2xl bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground"
            : "max-w-[86%] rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-white/72 shadow-inner-line"
        }
      >
        {isUser ? (
          <pre className="whitespace-pre-wrap break-words font-sans">{message.content}</pre>
        ) : (
          <MarkdownMessage content={message.content} />
        )}
      </div>
      {isUser ? (
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white/70">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      ) : null}
    </div>
  );
}

function MarkdownMessage({ content }: { content: string }) {
  const normalized = content.replace(/<br\s*\/?>/gi, "\n");
  const lines = normalized.split(/\r?\n/);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={`code-${index}`} className="overflow-x-auto rounded-md border border-white/10 bg-black/28 p-3 font-mono text-xs leading-5 text-cyan-50/78">
          {codeLines.join("\n")}
        </pre>,
      );
      continue;
    }

    if (isTableStart(lines, index)) {
      const tableLines = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      blocks.push(<MarkdownTable key={`table-${index}`} lines={tableLines} />);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = stripBold(heading[2]);
      const className =
        level <= 2
          ? "mt-4 font-display text-base font-semibold leading-6 text-white first:mt-0"
          : "mt-3 text-sm font-semibold leading-6 text-white/90";
      blocks.push(
        <div key={`heading-${index}`} className={className}>
          {renderInline(text)}
        </div>,
      );
      index += 1;
      continue;
    }

    if (isListLine(line)) {
      const items = [];
      const ordered = /^\s*\d+\.\s+/.test(line);
      while (index < lines.length && isListLine(lines[index])) {
        items.push(lines[index].replace(/^\s*(?:[-*•]|\d+\.)\s+/, ""));
        index += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag
          key={`list-${index}`}
          className={ordered ? "my-2 list-decimal space-y-1 pl-5" : "my-2 list-disc space-y-1 pl-5"}
        >
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("```") &&
      !lines[index].match(/^(#{1,4})\s+/) &&
      !isListLine(lines[index]) &&
      !isTableStart(lines, index)
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${index}`} className="my-2 leading-6">
        {renderInline(paragraph.join(" "))}
      </p>,
    );
  }

  return <div className="space-y-2">{blocks}</div>;
}

function MarkdownTable({ lines }: { lines: string[] }) {
  const rows = lines
    .filter((line) => !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line))
    .map(parseTableRow);

  const [headings = [], ...body] = rows;

  return (
    <div className="my-3 overflow-x-auto rounded-md border border-white/10">
      <table className="min-w-full border-collapse text-left text-xs">
        <thead className="bg-white/[0.08] text-white">
          <tr>
            {headings.map((heading, index) => (
              <th key={`${heading}-${index}`} className="border-b border-white/10 px-3 py-2 font-semibold">
                {renderInline(stripBold(heading))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="odd:bg-white/[0.025]">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="border-t border-white/10 px-3 py-2 align-top leading-5 text-white/68">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function isTableStart(lines: string[], index: number) {
  const current = lines[index]?.trim() ?? "";
  const next = lines[index + 1]?.trim() ?? "";
  return current.startsWith("|") && next.startsWith("|") && /(?:^|\|)\s*:?-{3,}:?\s*(?=\||$)/.test(next);
}

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isListLine(line: string) {
  return /^\s*(?:[-*•]|\d+\.)\s+/.test(line);
}

function stripBold(value: string) {
  return value.replace(/\*\*(.*?)\*\*/g, "$1").trim();
}

function renderInline(value: string) {
  const parts = value.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${part}-${index}`} className="rounded bg-black/24 px-1.5 py-0.5 font-mono text-[0.84em] text-cyan-100">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3">
      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-primary">
        <Bot aria-hidden="true" className="size-4" />
      </span>
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/58">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-primary" />
        Thinking with Ollama
      </div>
    </div>
  );
}

function isGitHubRepoUrl(value: string) {
  return /^https?:\/\/(www\.)?github\.com\/[^/\s]+\/[^/\s]+/i.test(value.trim());
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}
