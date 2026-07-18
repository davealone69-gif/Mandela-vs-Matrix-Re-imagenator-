const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = [
  "import PerformanceTortureTestDialog from './components/PerformanceTortureTestDialog';",
  "import UXStabilityGauntletDialog from './components/UXStabilityGauntletDialog';",
  "import StandaloneApkGeneratorDialog from './components/StandaloneApkGeneratorDialog';"
].join('\n');

if (!code.includes('import PerformanceTortureTestDialog')) {
  code = code.replace(
    "import PlayStorePublishOrchestratorDialog from './components/PlayStorePublishOrchestratorDialog';",
    `import PlayStorePublishOrchestratorDialog from './components/PlayStorePublishOrchestratorDialog';\n${newImports}`
  );
}

code = code.replace(
  "| 'ecoSim' | 'mythicCodex' | 'primeDir' | 'playStore' | null>(null);",
  "| 'ecoSim' | 'mythicCodex' | 'primeDir' | 'playStore' | 'torture' | 'uxGauntlet' | 'standaloneApk' | null>(null);"
);

// We'll add Torture and UX Gauntlet near Performance / UI Test
const targetPerfMenu = `<span className="flex items-center gap-2"><Gauge className="w-4 h-4" /> Performance Optimization</span>
                  </button>`;

const replacementPerfMenu = `<span className="flex items-center gap-2"><Gauge className="w-4 h-4" /> Performance Optimization</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('torture'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-red-950/30 text-red-400 hover:bg-red-900/60' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Flame className="w-4 h-4" /> Performance Torture Test</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('uxGauntlet'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-orange-950/30 text-orange-400 hover:bg-orange-900/60' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> UX Stability Gauntlet</span>
                  </button>`;

if (code.includes(targetPerfMenu) && !code.includes('Performance Torture Test')) {
  code = code.replace(targetPerfMenu, replacementPerfMenu);
}

// Add Standalone APK to the build section
const targetBuildMenu = `<span className="flex items-center gap-2"><PlaySquare className="w-4 h-4" /> Publish to Play Store</span>
                  </button>`;

const replacementBuildMenu = `<span className="flex items-center gap-2"><PlaySquare className="w-4 h-4" /> Publish to Play Store</span>
                  </button>
                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('standaloneApk'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark 
                        ? 'bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/60' 
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Generate Standalone APK</span>
                  </button>`;

if (code.includes(targetBuildMenu) && !code.includes('Generate Standalone APK')) {
  code = code.replace(targetBuildMenu, replacementBuildMenu);
}

if (!code.includes('Flame') && code.includes('import {')) {
  code = code.replace(
    "PlaySquare } from 'lucide-react';",
    "PlaySquare, Flame, ShieldAlert, Package } from 'lucide-react';"
  );
}

const targetDialog = `{activeDialog === 'playStore' && <PlayStorePublishOrchestratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

const dialogReplacement = `{activeDialog === 'playStore' && <PlayStorePublishOrchestratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'torture' && <PerformanceTortureTestDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'uxGauntlet' && <UXStabilityGauntletDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'standaloneApk' && <StandaloneApkGeneratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(targetDialog) && !code.includes('PerformanceTortureTestDialog isDark')) {
  code = code.replace(targetDialog, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Torture and Standalone APK features added.');
