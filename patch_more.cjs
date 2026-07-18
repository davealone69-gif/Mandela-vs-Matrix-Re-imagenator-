const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports
const imports = [
  "import EvolutionaryCodeGeneratorDialog from './components/EvolutionaryCodeGeneratorDialog';",
  "import IntentDrivenFeatureBuilderDialog from './components/IntentDrivenFeatureBuilderDialog';",
  "import CognitiveUXAnalyzerDialog from './components/CognitiveUXAnalyzerDialog';",
  "import ContinuousAppEvolutionModeDialog from './components/ContinuousAppEvolutionModeDialog';"
].join('\n');

if (!code.includes('import EvolutionaryCodeGeneratorDialog')) {
  code = code.replace(
    "import ArchitectureShiftingEngineDialog from './components/ArchitectureShiftingEngineDialog';",
    `import ArchitectureShiftingEngineDialog from './components/ArchitectureShiftingEngineDialog';\n${imports}`
  );
}

// 2. Modify activeDialog type
code = code.replace(
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | 'archShift' | null>(null);",
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | 'archShift' | 'evolutionGen' | 'intentBuilder' | 'cogUX' | 'contEvol' | null>(null);"
);

// 3. Add to Diagnostic Tools menu
const diagnosticTarget = `<span className="flex items-center gap-2"><Boxes className="w-4 h-4" /> Architecture Shifting</span>
                  </button>`;
const diagnosticReplacement = `<span className="flex items-center gap-2"><Boxes className="w-4 h-4" /> Architecture Shifting</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('evolutionGen'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-teal-950/30 text-teal-400 hover:bg-teal-900/60' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Dna className="w-4 h-4" /> Evolutionary Generator</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('intentBuilder'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-pink-950/30 text-pink-400 hover:bg-pink-900/60' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Target className="w-4 h-4" /> Intent Feature Builder</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('cogUX'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-orange-950/30 text-orange-400 hover:bg-orange-900/60' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Brain className="w-4 h-4" /> Cognitive UX Analyzer</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('contEvol'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-sky-950/30 text-sky-400 hover:bg-sky-900/60' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><ServerCog className="w-4 h-4" /> Continuous App Evolution</span>
                  </button>`;

if (code.includes(diagnosticTarget) && !code.includes('evolutionGen')) {
  code = code.replace(diagnosticTarget, diagnosticReplacement);
}

// Ensure Icons are imported
if (!code.includes('Dna') && code.includes('import {')) {
  code = code.replace(
    "TestTube2, Gauge, Boxes } from 'lucide-react';",
    "TestTube2, Gauge, Boxes, Dna, Target, Brain, ServerCog } from 'lucide-react';"
  );
}

// 4. Render the dialogs
const dialogTarget = `{activeDialog === 'archShift' && <ArchitectureShiftingEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;
const dialogReplacement = `{activeDialog === 'archShift' && <ArchitectureShiftingEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}

      {activeDialog === 'evolutionGen' && <EvolutionaryCodeGeneratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'intentBuilder' && <IntentDrivenFeatureBuilderDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'cogUX' && <CognitiveUXAnalyzerDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'contEvol' && <ContinuousAppEvolutionModeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(dialogTarget) && !code.includes('EvolutionaryCodeGeneratorDialog isDark')) {
  code = code.replace(dialogTarget, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for 4 new tools");
