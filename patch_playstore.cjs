const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = "import PlayStorePublishOrchestratorDialog from './components/PlayStorePublishOrchestratorDialog';";

if (!code.includes('import PlayStorePublishOrchestratorDialog')) {
  code = code.replace(
    "import PrimeDirectiveGovernanceLayerDialog from './components/PrimeDirectiveGovernanceLayerDialog';",
    `import PrimeDirectiveGovernanceLayerDialog from './components/PrimeDirectiveGovernanceLayerDialog';\n${newImports}`
  );
}

code = code.replace(
  "| 'ecoSim' | 'mythicCodex' | 'primeDir' | null>(null);",
  "| 'ecoSim' | 'mythicCodex' | 'primeDir' | 'playStore' | null>(null);"
);

const targetMenu = `                    <span className="flex items-center gap-2">                      {isCompiling ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Code className="w-4 h-4 text-cyan-500" />}                       Compile Release APK                    </span>                  </button>`;

const menuReplacement = `                    <span className="flex items-center gap-2">                      {isCompiling ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Code className="w-4 h-4 text-cyan-500" />}                       Compile Release APK                    </span>                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('playStore'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark 
                        ? 'bg-blue-950/30 text-blue-400 hover:bg-blue-900/60' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><PlaySquare className="w-4 h-4" /> Publish to Play Store</span>
                  </button>`;

if (code.includes(targetMenu) && !code.includes('Publish to Play Store')) {
  code = code.replace(targetMenu, menuReplacement);
} else {
    // try to match with spaces removed
    const strippedCode = code.replace(/\s+/g, '');
    const strippedTarget = targetMenu.replace(/\s+/g, '');
    if (strippedCode.includes(strippedTarget) && !code.includes('Publish to Play Store')) {
        // Fallback replacement if whitespace differs slightly
        const targetMenu2 = `<span className="flex items-center gap-2">
                      {isCompiling ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Code className="w-4 h-4 text-cyan-500" />} 
                      Compile Release APK
                    </span>
                  </button>`;
        code = code.replace(targetMenu2, menuReplacement);
    }
}

if (!code.includes('PlaySquare') && code.includes('import {')) {
  code = code.replace(
    "Shield } from 'lucide-react';",
    "Shield, PlaySquare } from 'lucide-react';"
  );
}

const targetDialog = `{activeDialog === 'primeDir' && <PrimeDirectiveGovernanceLayerDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

const dialogReplacement = `{activeDialog === 'primeDir' && <PrimeDirectiveGovernanceLayerDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'playStore' && <PlayStorePublishOrchestratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(targetDialog) && !code.includes('PlayStorePublishOrchestratorDialog isDark')) {
  code = code.replace(targetDialog, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Play Store features added.');
