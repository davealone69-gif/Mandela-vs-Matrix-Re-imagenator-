const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

const patchPlanFunc = `
async function generatePatchPlan(aiClient: any, errorLogs: string, repoSnapshot: string, prompt: string) {
  const model = aiClient.models.get({ model: 'gemini-3.5-flash' });
  const response = await model.generateContent({
    contents: [{
       role: 'user',
       parts: [{ text: \`You are an AI debug assistant. The user requested: \${prompt}.
The app failed to build or run.
Here are the error logs:
\${errorLogs}

Here is the current repository snapshot:
\${repoSnapshot}

Respond ONLY with a JSON object in the following format:
{
  "summary": "Brief explanation of what went wrong and how you fixed it",
  "files": [
    {
      "path": "path/to/file.tsx",
      "diff": "The complete new content of the file"
    }
  ]
}
\` }]
    }],
    config: {
       responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text());
}
`;

if (!serverCode.includes('async function generatePatchPlan')) {
  // Put it before `const app = express();`
  serverCode = serverCode.replace('const app = express();', `${patchPlanFunc}\nconst app = express();`);
  fs.writeFileSync('server.ts', serverCode);
}
