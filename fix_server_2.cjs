const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("app.listen(PORT, '0.0.0.0', () => {", "const server = app.listen(PORT, '0.0.0.0', () => {");
fs.writeFileSync('server.ts', code);
console.log('Fixed server.ts');
