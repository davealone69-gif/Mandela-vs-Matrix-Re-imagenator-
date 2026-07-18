const fs = require('fs');

const file = 'src/components/OmniSystemSingularityCoreDialog.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');
code = code.replace(/\\\\n/g, '\\n');
fs.writeFileSync(file, code);

