const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /'User-Agent': 'DroidCraft-IDE'\s*\n\s*\}/g,
  `'User-Agent': 'DroidCraft-IDE',\n              'If-None-Match': ''\n            }`
);

// Remove t param from PUT requests just in case it breaks github
code = code.replace(
  /contents\/\$\{file\.path\}\?t=\$\{Date\.now\(\)\}\`, \{\n\s*method: 'PUT'/g,
  `contents/\${file.path}\`, {\n            method: 'PUT'`
);

fs.writeFileSync('server.ts', code);
