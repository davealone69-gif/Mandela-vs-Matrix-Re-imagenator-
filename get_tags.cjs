const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');

let start = lines.findIndex(l => l.includes("sidebarTab === 'ai' && ("));
let slice = lines.slice(start, start + 300);
let indentCount = 0;
let output = [];
for (let i = 0; i < slice.length; i++) {
   const line = slice[i];
   if (line.includes('<div')) indentCount++;
   if (line.includes('</div')) indentCount--;
   output.push(`${start + i + 1}: [${indentCount}] ${line.trim()}`);
   if (start + i + 1 > 3420) break;
}
fs.writeFileSync('output.txt', output.join('\n'));
