const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\`https:\/\/api\.github\.com\/repos\/\$\{trimmedUsername\}\/\$\{trimmedRepo\}\/contents\/\$\{path\}\`, \{/g,
  `\`https://api.github.com/repos/\${trimmedUsername}/\${trimmedRepo}/contents/\${path}?t=\${Date.now()}\`, {`
);

code = code.replace(
  /'Accept': 'application\/vnd\.github\.v3\+json'\s*\n\s*\}/g,
  `'Accept': 'application/vnd.github.v3+json',\n              'If-None-Match': ''\n            }`
);

fs.writeFileSync('src/App.tsx', code);
