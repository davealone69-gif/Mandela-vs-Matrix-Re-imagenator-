const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    return {
      fontSize: 13,
      fontFamily: 'JetBrains Mono',
      wordWrap: true,
      tabSize: 4,
      showLineNumbers: true
    };`;

const newCode = `    return {
      fontSize: 13,
      fontFamily: 'JetBrains Mono',
      wordWrap: true,
      tabSize: 4,
      showLineNumbers: true,
      evolutionMode: false
    };`;

code = code.replace(target, newCode);
fs.writeFileSync('src/App.tsx', code);
