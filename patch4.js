import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const { WebSocketServer } = require('ws');",
  "import { WebSocketServer } from 'ws';"
);

code = code.replace(
  "const { Modality } = require('@google/genai');",
  ""
);

code = code.replace(
  "import { GoogleGenAI } from '@google/genai';",
  "import { GoogleGenAI, Modality } from '@google/genai';"
);

// If the first replace didn't work because of scope or whatever, let's just make it dynamic import or do it properly.

fs.writeFileSync('server.ts', code);
