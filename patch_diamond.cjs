const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = [
  "import SelfArchitectingIntelligenceCoreDialog from './components/SelfArchitectingIntelligenceCoreDialog';",
  "import GenerativeAppGenomeDialog from './components/GenerativeAppGenomeDialog';",
  "import RecursiveFeatureEvolutionLoopDialog from './components/RecursiveFeatureEvolutionLoopDialog';",
  "import CrossAppIntelligenceExchangeDialog from './components/CrossAppIntelligenceExchangeDialog';",
  "import AutonomousProductDesignerModeDialog from './components/AutonomousProductDesignerModeDialog';"
].join('\n');

if (!code.includes('import SelfArchitectingIntelligenceCoreDialog')) {
  code = code.replace(
    "import CrossPlatformSymbiosisEngineDialog from './components/CrossPlatformSymbiosisEngineDialog';",
    `import CrossPlatformSymbiosisEngineDialog from './components/CrossPlatformSymbiosisEngineDialog';\n${newImports}`
  );
}

code = code.replace(
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | 'archShift' | 'evolutionGen' | 'intentBuilder' | 'cogUX' | 'contEvol' | 'zeroTrust' | 'crossPlatform' | null>(null);",
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | 'archShift' | 'evolutionGen' | 'intentBuilder' | 'cogUX' | 'contEvol' | 'zeroTrust' | 'crossPlatform' | 'selfArch' | 'genGenome' | 'recurEvol' | 'crossApp' | 'autoProd' | null>(null);"
);

const targetMenu = `<span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Cross-Platform Symbiosis</span>
                  </button>`;

const menuReplacement = `<span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Cross-Platform Symbiosis</span>
                  </button>

                  <div className="text-[10px] font-bold tracking-wider uppercase text-cyan-400 mb-1 px-1 mt-4 flex items-center gap-1 bg-cyan-500/10 py-1 rounded w-fit">
                    <Gem className="w-3 h-3" /> Diamond Tier Subsystems
                  </div>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('selfArch'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/60' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> Self-Architecting Core</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('genGenome'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-indigo-950/30 text-indigo-400 hover:bg-indigo-900/60' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Dna className="w-4 h-4" /> Generative App Genome</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('recurEvol'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-violet-950/30 text-violet-400 hover:bg-violet-900/60' : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Recursive Feature Evolution</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('crossApp'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/60' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Cross-App Intelligence</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('autoProd'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-amber-950/30 text-amber-400 hover:bg-amber-900/60' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Auto Product Designer</span>
                  </button>`;

if (code.includes(targetMenu) && !code.includes('selfArch')) {
  code = code.replace(targetMenu, menuReplacement);
}

if (!code.includes('BrainCircuit') && code.includes('import {')) {
  code = code.replace(
    "Key, Lock } from 'lucide-react';",
    "Key, Lock, Gem, BrainCircuit, Share2, Lightbulb } from 'lucide-react';"
  );
}

const targetDialog = `{activeDialog === 'crossPlatform' && <CrossPlatformSymbiosisEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

const dialogReplacement = `{activeDialog === 'crossPlatform' && <CrossPlatformSymbiosisEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'selfArch' && <SelfArchitectingIntelligenceCoreDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'genGenome' && <GenerativeAppGenomeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'recurEvol' && <RecursiveFeatureEvolutionLoopDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'crossApp' && <CrossAppIntelligenceExchangeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'autoProd' && <AutonomousProductDesignerModeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(targetDialog) && !code.includes('SelfArchitectingIntelligenceCoreDialog isDark')) {
  code = code.replace(targetDialog, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Diamond features added.');
