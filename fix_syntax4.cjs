const fs = require('fs');

const files = [
  'src/components/EvolutionaryCodeGeneratorDialog.tsx',
  'src/components/IntentDrivenFeatureBuilderDialog.tsx',
  'src/components/CognitiveUXAnalyzerDialog.tsx',
  'src/components/ContinuousAppEvolutionModeDialog.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\\`/g, '`');
  code = code.replace(/\\\$/g, '$');
  code = code.replace(/\\\\n/g, '\\n');
  fs.writeFileSync(file, code);
});
