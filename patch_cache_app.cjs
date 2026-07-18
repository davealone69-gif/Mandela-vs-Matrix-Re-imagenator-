const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /contents\/\$\{path\}\?t=\$\{Date\.now\(\)\}\`, \{\n\s*method: 'PUT'/g,
  `contents/\${path}\`, {\n          method: 'PUT'`
);

fs.writeFileSync('src/App.tsx', code);
