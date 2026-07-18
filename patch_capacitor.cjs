const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = [
  "import UniversalNativeBridgeDialog from './components/UniversalNativeBridgeDialog';",
  "import CapacitorShellWrapperDialog from './components/CapacitorShellWrapperDialog';"
].join('\n');

if (!code.includes('import UniversalNativeBridgeDialog')) {
  code = code.replace(
    "import StandaloneApkGeneratorDialog from './components/StandaloneApkGeneratorDialog';",
    `import StandaloneApkGeneratorDialog from './components/StandaloneApkGeneratorDialog';\n${newImports}`
  );
}

code = code.replace(
  "| 'playStore' | 'torture' | 'uxGauntlet' | 'standaloneApk' | null>(null);",
  "| 'playStore' | 'torture' | 'uxGauntlet' | 'standaloneApk' | 'nativeBridge' | 'shellWrapper' | null>(null);"
);

// Add to the Cross-Platform section
const targetCrossPlatform = `<span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Cross-Platform Symbiosis</span>
                  </button>`;

const replacementCrossPlatform = `<span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Cross-Platform Symbiosis</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('nativeBridge'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-indigo-950/30 text-indigo-400 hover:bg-indigo-900/60' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><SmartphoneNfc className="w-4 h-4" /> Universal Native Bridge</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('shellWrapper'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-violet-950/30 text-violet-400 hover:bg-violet-900/60' : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> Native Shell Wrapper</span>
                  </button>`;

if (code.includes(targetCrossPlatform) && !code.includes('Universal Native Bridge')) {
  code = code.replace(targetCrossPlatform, replacementCrossPlatform);
}

if (!code.includes('SmartphoneNfc') && code.includes('import {')) {
  code = code.replace(
    "Package } from 'lucide-react';",
    "Package, SmartphoneNfc, Layers } from 'lucide-react';"
  );
}

const targetDialog = `{activeDialog === 'standaloneApk' && <StandaloneApkGeneratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

const dialogReplacement = `{activeDialog === 'standaloneApk' && <StandaloneApkGeneratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'nativeBridge' && <UniversalNativeBridgeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'shellWrapper' && <CapacitorShellWrapperDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(targetDialog) && !code.includes('UniversalNativeBridgeDialog isDark')) {
  code = code.replace(targetDialog, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Capacitor features added.');
