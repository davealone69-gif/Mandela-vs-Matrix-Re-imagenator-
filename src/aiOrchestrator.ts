import { GoogleGenAI } from "@google/genai";

export type BuildLog = string;
export type PatchPlan = {
  summary: string;
  files: { path: string; diff: string }[];
};

export async function generatePatchPlan(
  ai: GoogleGenAI,
  buildLog: BuildLog, 
  repoSnapshot: string,
  prompt: string
): Promise<PatchPlan> {
  const systemArchitectPrompt = `
You are an elite Android build architect. Analyze the following build log and repository snapshot for an app built from the prompt: "${prompt}".
Identify root causes of build failures, propose a minimal, safe patch plan, and explain your reasoning.
Return JSON with { summary, files: [{ path, diff }] }.
NOTE: "diff" should be the FULL updated content of the file. Do not use partial patch diffs.
`;

  const architectResponse = await ai.models.generateContent({
    model: 'gemini-3.1-pro',
    contents: `Build Log:\n${buildLog}\n\nRepository Snapshot:\n${repoSnapshot}`,
    config: {
      systemInstruction: systemArchitectPrompt,
      responseMimeType: "application/json"
    }
  });

  const architectPlan = architectResponse.text;

  const fixerPrompt = `
You are a precise code fixer. Given the architect's plan, refine diffs to be syntactically valid,
Gradle-safe, and compatible with modern Android tooling. Do NOT introduce breaking changes.
Output ONLY raw JSON with { summary, files: [{ path, diff }] } where diff is the FULL replacement file content.
`;

  const fixerResponse = await ai.models.generateContent({
    model: 'gemini-3.1-pro',
    contents: `Architect Plan:\n${architectPlan}`,
    config: {
      systemInstruction: fixerPrompt,
      responseMimeType: "application/json"
    }
  });

  let text = fixerResponse.text || "{}";
  text = text.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
  
  const patchPlan: PatchPlan = JSON.parse(text);
  return patchPlan;
}
