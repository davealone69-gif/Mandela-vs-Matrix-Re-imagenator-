const fs = require('fs');
let code = fs.readFileSync('src/components/ApkBuildOrchestratorDialog.tsx', 'utf8');

code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');
code = code.replace(/\\\\n/g, '\\n');

fs.writeFileSync('src/components/ApkBuildOrchestratorDialog.tsx', code);
