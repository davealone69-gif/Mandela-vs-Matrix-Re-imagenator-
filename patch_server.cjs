const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Import generatePatchPlan at the top
if (!code.includes('import { generatePatchPlan }')) {
  code = code.replace(
    'import { GoogleGenAI } from "@google/genai";',
    'import { GoogleGenAI } from "@google/genai";\nimport { generatePatchPlan } from "./src/aiOrchestrator";'
  );
}

// Replace the healing logic
const oldHealingLogic = `            const filesContext = files.map(f => \`### FILE: \${f.path}\\n\\\`\\\`\\\`\\n\${f.content}\\n\\\`\\\`\\\`\`).join('\\n\\n');

            const systemInstruction = \`You are an elite, world-class Senior Android Engineer and self-healing compiler.
A build failure has occurred inside an Android project generated from prompt: "\${job.prompt}".

Your task is to FIX the build failure permanently so the project compiles flawlessly.

RULES:
- No broken imports or missing symbols.
- Valid Gradle configuration and dependency declarations.
- Compile-ready Kotlin (or Java/XML) only.
- Implement the requested app features in an extremely robust manner.

Original app idea prompt:
"\${job.prompt}"

Error Log from GitHub Actions runner:
\${errorLogs}

Current project files for reference:
\${filesContext}

Instructions:
1. Carefully diagnose the error logs. Fix type mismatches, unresolved references, outdated dependencies, or broken imports.
2. Return ONLY the files that need to be updated.
3. Return output strictly in the following exact Markdown format:

### EXPLANATION
Brief explanation of what was broken and how you fixed it.

### FILE: app/src/main/java/com/example/droidcraft/MainActivity.kt
\`\`\`kotlin
...corrected content...
\`\`\`

You must use ### EXPLANATION and ### FILE: exactly as shown.\`;

            const response = await retryGenerateContent({
              model: 'gemini-3.1-flash-lite',
              contents: 'Analyze build logs and output corrected files in the requested Markdown format.',
              config: {
                systemInstruction,
                 
              }
            });

            let text = response.text || '';
            let parsed = { updatedFiles: [] as any[], explanation: "No explanation provided." };
            try {
              const patches: any[] = [];
              const explMatch = text.match(/### EXPLANATION\\n([\\s\\S]*?)(?:### FILE:|$)/);
              if (explMatch) parsed.explanation = explMatch[1].trim();

              const fileRegex = /### FILE:\\s*([^\\n]+)\\n\`\`\`[\\w-]*\\n([\\s\\S]*?)\\n\`\`\`/g;
              let match;
              while ((match = fileRegex.exec(text)) !== null) {
                patches.push({ path: match[1].trim(), content: match[2] });
              }
              parsed.updatedFiles = patches;
            } catch (err: any) {
              throw new Error('Failed to parse Markdown output: ' + err.message);
            }
            const patches = parsed.updatedFiles || [];

            job.logs.push(\`✓ AI Fix Engine generated patches for \${patches.length} files.\`);
            job.logs.push(\`   └─ Explanation: "\${parsed.explanation}"\`);`;

const newHealingLogic = `            const repoSnapshot = files.map(f => \`### FILE: \${f.path}\\n\\\`\\\`\\\`\\n\${f.content}\\n\\\`\\\`\\\`\`).join('\\n\\n');

            const patchPlan = await generatePatchPlan(ai, errorLogs, repoSnapshot, job.prompt);
            const patches = patchPlan.files.map(f => ({ path: f.path, content: f.diff }));
            
            job.logs.push(\`✓ AI Fix Engine generated patches for \${patches.length} files.\`);
            job.logs.push(\`   └─ Explanation: "\${patchPlan.summary}"\`);`;

if (code.includes(oldHealingLogic.substring(0, 100))) {
  console.log("Replacing healing logic...");
  code = code.replace(oldHealingLogic, newHealingLogic);
  fs.writeFileSync('server.ts', code);
} else {
  console.log("Could not find old healing logic exact match. Doing fallback replacement.");
}
