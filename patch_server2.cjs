const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Import generatePatchPlan at the top
if (!code.includes('import { generatePatchPlan }')) {
  code = code.replace(
    'import { GoogleGenAI } from "@google/genai";',
    'import { GoogleGenAI } from "@google/genai";\nimport { generatePatchPlan } from "./src/aiOrchestrator";'
  );
}

// Find the start and end of the healing logic
const startToken = "const filesContext = files.map(f => `### FILE: ${f.path}\\n\\`\\`\\`\\n${f.content}\\n\\`\\`\\``).join('\\n\\n');";
const endToken = 'const patches = parsed.updatedFiles || [];';

const startIndex = code.indexOf(startToken);
const endIndex = code.indexOf(endToken);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `            const repoSnapshot = files.map(f => \`### FILE: \${f.path}\\n\\\`\\\`\\\`\\n\${f.content}\\n\\\`\\\`\\\`\`).join('\\n\\n');
            const patchPlan = await generatePatchPlan(ai, errorLogs, repoSnapshot, job.prompt);
            const patches = patchPlan.files.map(f => ({ path: f.path, content: f.diff }));
            
            job.logs.push(\`✓ AI Fix Engine generated patches for \${patches.length} files.\`);
            job.logs.push(\`   └─ Explanation: "\${patchPlan.summary}"\`);`;
            
  // replace from startIndex to the line after endToken (where job.logs starts)
  const prefix = code.substring(0, startIndex);
  
  // Find where job.logs starts after endToken
  const endSliceIndex = code.indexOf('job.logs.push(`✓ AI Fix Engine generated patches', endIndex);
  
  // Find where the old logging ends
  const nextLineIndex = code.indexOf('// Apply patches locally to files list', endSliceIndex);
  
  const suffix = code.substring(nextLineIndex);
  
  code = prefix + replacement + '\n\n            ' + suffix;
  fs.writeFileSync('server.ts', code);
  console.log("Successfully replaced healing logic");
} else {
  console.log("Could not find start/end tokens");
}
