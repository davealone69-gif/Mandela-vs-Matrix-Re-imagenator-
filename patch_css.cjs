const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if(!code.includes('@import url')) {
code = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

html, body { overflow: hidden; width: 100%; height: 100%; overscroll-behavior: none; }
`
}
fs.writeFileSync('src/index.css', code);
