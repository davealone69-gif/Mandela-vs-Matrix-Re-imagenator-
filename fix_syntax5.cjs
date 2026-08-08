const fs = require('fs');

const files = [
  'src/components/ZeroTrustSecurityMatrixDialog.tsx',
  'src/components/CrossPlatformSymbiosisEngineDialog.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\\`/g, '`');
  code = code.replace(/\\\$/g, '$');
  code = code.replace(/\\\\n/g, '\\n');
  fs.writeFileSync(file, code);
});
