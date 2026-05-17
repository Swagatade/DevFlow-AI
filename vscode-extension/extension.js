const vscode = require("vscode");

async function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("devflowAI.debugWorkspace", debugWorkspace),
    vscode.commands.registerCommand("devflowAI.askWorkspace", askWorkspace),
    vscode.commands.registerCommand("devflowAI.openAnalysis", openAnalysis),
  );
}

async function debugWorkspace() {
  const handoff = await readHandoff();
  if (!handoff) {
    return;
  }

  const errorLog =
    (await vscode.window.showInputBox({
      title: "DevFlow AI Debug",
      prompt: "Paste an error or leave blank for a static debug pass",
      ignoreFocusOut: true,
    })) ?? "";

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "DevFlow AI is generating a debug report",
    },
    async () => {
      const response = await postJson(
        `${handoff.apiBaseUrl}/repositories/${handoff.repositoryId}/debug`,
        { errorLog },
      );
      await openFile(response.reportPath);
      vscode.window.showInformationMessage("DevFlow AI debug report is ready.");
    },
  );
}

async function askWorkspace() {
  const handoff = await readHandoff();
  if (!handoff) {
    return;
  }

  const question = await vscode.window.showInputBox({
    title: "DevFlow AI Ask",
    prompt: "Ask about this repository",
    ignoreFocusOut: true,
  });
  if (!question) {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "DevFlow AI is answering",
    },
    async () => {
      const response = await postJson(
        `${handoff.apiBaseUrl}/repositories/${handoff.repositoryId}/ask`,
        { question },
      );
      const workspaceFolder = activeWorkspaceFolder();
      const answerPath = vscode.Uri.joinPath(workspaceFolder.uri, ".vscode", "devflow-ai-answer.md");
      const markdown = `# DevFlow AI Answer\n\n**Question:** ${question}\n\n${response.answer}\n`;
      await vscode.workspace.fs.writeFile(answerPath, Buffer.from(markdown, "utf8"));
      await vscode.window.showTextDocument(answerPath);
    },
  );
}

async function openAnalysis() {
  const handoff = await readHandoff();
  if (!handoff) {
    return;
  }
  await openFile(handoff.analysisPath);
}

async function readHandoff() {
  const workspaceFolder = activeWorkspaceFolder();
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("Open a DevFlow AI downloaded repository first.");
    return null;
  }

  const handoffUri = vscode.Uri.joinPath(workspaceFolder.uri, ".vscode", "devflow-ai.json");
  try {
    const bytes = await vscode.workspace.fs.readFile(handoffUri);
    return JSON.parse(Buffer.from(bytes).toString("utf8"));
  } catch {
    vscode.window.showErrorMessage("This workspace is not linked to DevFlow AI yet.");
    return null;
  }
}

function activeWorkspaceFolder() {
  return vscode.workspace.workspaceFolders?.[0] ?? null;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = `DevFlow AI request failed with ${response.status}`;
    try {
      const data = await response.json();
      detail = data.detail ?? detail;
    } catch {
      // Keep status-based detail.
    }
    throw new Error(detail);
  }

  return response.json();
}

async function openFile(filePath) {
  if (!filePath) {
    vscode.window.showWarningMessage("DevFlow AI has not generated that file yet.");
    return;
  }
  const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
  await vscode.window.showTextDocument(document);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
