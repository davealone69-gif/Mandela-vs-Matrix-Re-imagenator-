const fs = require('fs');

const files = [
  'src/components/UniversalNativeBridgeDialog.tsx',
  'src/components/CapacitorShellWrapperDialog.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\\`/g, '`');
  code = code.replace(/\\\$/g, '$');
  code = code.replace(/\\\\n/g, '\\n');
  fs.writeFileSync(file, code);
});
