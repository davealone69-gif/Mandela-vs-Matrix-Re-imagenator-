const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
if (!code.includes('import ArchitectureShiftingEngineDialog')) {
  code = code.replace(
    "import HardwareCapabilityModuleGeneratorDialog from './components/HardwareCapabilityModuleGeneratorDialog';",
    "import HardwareCapabilityModuleGeneratorDialog from './components/HardwareCapabilityModuleGeneratorDialog';\nimport ArchitectureShiftingEngineDialog from './components/ArchitectureShiftingEngineDialog';"
  );
}

// 2. Modify activeDialog type
code = code.replace(
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | null>(null);",
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | 'archShift' | null>(null);"
);

// 3. Add to Diagnostic Tools menu
const diagnosticTarget = `<span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Hardware Capability Gen</span>
                  </button>`;
const diagnosticReplacement = `<span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Hardware Capability Gen</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('archShift'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark 
                        ? 'bg-purple-950/30 text-purple-400 hover:bg-purple-900/60' 
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Boxes className="w-4 h-4" /> Architecture Shifting</span>
                  </button>`;

if (code.includes(diagnosticTarget) && !code.includes('archShift')) {
  code = code.replace(diagnosticTarget, diagnosticReplacement);
}

// Ensure Boxes is imported
if (!code.includes('Boxes') && code.includes('import {')) {
  code = code.replace(
    "TestTube2, Gauge } from 'lucide-react';",
    "TestTube2, Gauge, Boxes } from 'lucide-react';"
  );
}

// 4. Render the dialog
const dialogTarget = `{activeDialog === 'hardwareGen' && <HardwareCapabilityModuleGeneratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;
const dialogReplacement = `{activeDialog === 'hardwareGen' && <HardwareCapabilityModuleGeneratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}

      {activeDialog === 'archShift' && <ArchitectureShiftingEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(dialogTarget) && !code.includes('ArchitectureShiftingEngineDialog isDark')) {
  code = code.replace(dialogTarget, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for ArchitectureShiftingEngineDialog");
