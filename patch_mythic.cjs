const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = [
  "import EcosystemConsciousnessSimulatorDialog from './components/EcosystemConsciousnessSimulatorDialog';",
  "import MythicIntelligenceCodexDialog from './components/MythicIntelligenceCodexDialog';",
  "import PrimeDirectiveGovernanceLayerDialog from './components/PrimeDirectiveGovernanceLayerDialog';"
].join('\n');

if (!code.includes('import EcosystemConsciousnessSimulatorDialog')) {
  code = code.replace(
    "import AutonomousProductDesignerModeDialog from './components/AutonomousProductDesignerModeDialog';",
    `import AutonomousProductDesignerModeDialog from './components/AutonomousProductDesignerModeDialog';\n${newImports}`
  );
}

code = code.replace(
  "| 'autoProd' | null>(null);",
  "| 'autoProd' | 'ecoSim' | 'mythicCodex' | 'primeDir' | null>(null);"
);

const targetMenu = `<span className="flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Auto Product Designer</span>
                  </button>`;

const menuReplacement = `<span className="flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Auto Product Designer</span>
                  </button>

                  <div className="text-[10px] font-bold tracking-wider uppercase text-rose-400 mb-1 px-1 mt-4 flex items-center gap-1 bg-rose-500/10 py-1 rounded w-fit">
                    <Sparkles className="w-3 h-3" /> Mythic Tier Subsystems
                  </div>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('ecoSim'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-rose-950/30 text-rose-400 hover:bg-rose-900/60' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> Ecosystem Consciousness</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('mythicCodex'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-amber-950/30 text-amber-400 hover:bg-amber-900/60' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Mythic Intelligence Codex</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('primeDir'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-red-950/30 text-red-400 hover:bg-red-900/60' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Prime Directive Governance</span>
                  </button>`;

if (code.includes(targetMenu) && !code.includes('ecoSim')) {
  code = code.replace(targetMenu, menuReplacement);
}

if (!code.includes('BookOpen') && code.includes('import {')) {
  code = code.replace(
    "Lightbulb } from 'lucide-react';",
    "Lightbulb, Sparkles, Eye, BookOpen, Shield } from 'lucide-react';"
  );
}

const targetDialog = `{activeDialog === 'autoProd' && <AutonomousProductDesignerModeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

const dialogReplacement = `{activeDialog === 'autoProd' && <AutonomousProductDesignerModeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'ecoSim' && <EcosystemConsciousnessSimulatorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'mythicCodex' && <MythicIntelligenceCodexDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'primeDir' && <PrimeDirectiveGovernanceLayerDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(targetDialog) && !code.includes('EcosystemConsciousnessSimulatorDialog isDark')) {
  code = code.replace(targetDialog, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Mythic features added.');
