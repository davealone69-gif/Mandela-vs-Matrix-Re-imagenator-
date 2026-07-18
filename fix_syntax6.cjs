const fs = require('fs');

const files = [
  'src/components/SelfArchitectingIntelligenceCoreDialog.tsx',
  'src/components/GenerativeAppGenomeDialog.tsx',
  'src/components/RecursiveFeatureEvolutionLoopDialog.tsx',
  'src/components/CrossAppIntelligenceExchangeDialog.tsx',
  'src/components/AutonomousProductDesignerModeDialog.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\\`/g, '`');
  code = code.replace(/\\\$/g, '$');
  code = code.replace(/\\\\n/g, '\\n');
  fs.writeFileSync(file, code);
});
