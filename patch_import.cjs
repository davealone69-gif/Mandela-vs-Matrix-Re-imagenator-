const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import IntegritySweepDialog')) {
  code = code.replace(
    "import SettingsPanel from './components/SettingsPanel';",
    "import SettingsPanel from './components/SettingsPanel';\nimport IntegritySweepDialog from './components/IntegritySweepDialog';"
  );
  fs.writeFileSync('src/App.tsx', code);
  console.log("Imported IntegritySweepDialog");
} else {
  console.log("Already imported");
}
