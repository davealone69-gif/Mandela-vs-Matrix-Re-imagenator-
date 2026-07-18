const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// First replace appAutopsy state
code = code.replace(
  "{activeDialog === 'appAutopsy' && (",
  "{activeDialog === 'integritySweep' && <IntegritySweepDialog isDark={isDark} onClose={() => setActiveDialog(null)} files={files} />}\n\n      {activeDialog === 'appAutopsy' && ("
);

fs.writeFileSync('src/App.tsx', code);
