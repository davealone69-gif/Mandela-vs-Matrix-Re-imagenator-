const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /\`https:\/\/api\.github\.com\/repos\/\$\{job\.githubUsername\}\/\$\{job\.repoName\}\/contents\/\$\{file\.path\}\`, \{/g,
  `\`https://api.github.com/repos/\${job.githubUsername}/\${job.repoName}/contents/\${file.path}?t=\${Date.now()}\`, {`
);

fs.writeFileSync('server.ts', code);
