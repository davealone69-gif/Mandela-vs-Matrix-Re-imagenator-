const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
if (!code.includes('import PerformanceOptimizationEngineDialog')) {
  code = code.replace(
    "import AutoUITestSystemDialog from './components/AutoUITestSystemDialog';",
    "import AutoUITestSystemDialog from './components/AutoUITestSystemDialog';\nimport PerformanceOptimizationEngineDialog from './components/PerformanceOptimizationEngineDialog';"
  );
}

// 2. Modify activeDialog type
code = code.replace(
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | null>(null);",
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | null>(null);"
);

// 3. Add to Diagnostic Tools menu
const diagnosticTarget = `<span className="flex items-center gap-2"><TestTube2 className="w-4 h-4" /> Automated UI Test System</span>
                  </button>`;
const diagnosticReplacement = `<span className="flex items-center gap-2"><TestTube2 className="w-4 h-4" /> Automated UI Test System</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('perfEngine'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark 
                        ? 'bg-amber-950/30 text-amber-400 hover:bg-amber-900/60' 
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Gauge className="w-4 h-4" /> Performance Optimization</span>
                  </button>`;

if (code.includes(diagnosticTarget) && !code.includes('perfEngine')) {
  code = code.replace(diagnosticTarget, diagnosticReplacement);
}

// Ensure Gauge is imported
if (!code.includes('Gauge') && code.includes('import {')) {
  code = code.replace(
    "TestTube2 } from 'lucide-react';",
    "TestTube2, Gauge } from 'lucide-react';"
  );
}

// 4. Render the dialog
const dialogTarget = `{activeDialog === 'uiTestSystem' && <AutoUITestSystemDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;
const dialogReplacement = `{activeDialog === 'uiTestSystem' && <AutoUITestSystemDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}

      {activeDialog === 'perfEngine' && <PerformanceOptimizationEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(dialogTarget) && !code.includes('PerformanceOptimizationEngineDialog isDark')) {
  code = code.replace(dialogTarget, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for PerformanceOptimizationEngineDialog");
