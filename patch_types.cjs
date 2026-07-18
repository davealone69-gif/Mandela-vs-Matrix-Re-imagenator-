const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  'showLineNumbers: boolean;',
  'showLineNumbers: boolean;\n  evolutionMode?: boolean;'
);
fs.writeFileSync('src/types.ts', code);
