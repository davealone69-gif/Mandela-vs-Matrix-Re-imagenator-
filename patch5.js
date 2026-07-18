import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "  import { WebSocketServer } from 'ws';",
  ""
);

code = code.replace(
  "import { GoogleGenAI, Modality } from '@google/genai';",
  "import { GoogleGenAI, Modality } from '@google/genai';\nimport { WebSocketServer } from 'ws';"
);

fs.writeFileSync('server.ts', code);
