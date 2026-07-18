const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
if (!code.includes('import HardwareCapabilityModuleGeneratorDialog')) {
  code = code.replace(
    "import PerformanceOptimizationEngineDialog from './components/PerformanceOptimizationEngineDialog';",
    "import PerformanceOptimizationEngineDialog from './components/PerformanceOptimizationEngineDialog';\nimport HardwareCapabilityModuleGeneratorDialog from './components/HardwareCapabilityModuleGeneratorDialog';"
  );
}

// 2. Modify activeDialog type
code = code.replace(
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | null>(null);",
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | null>(null);"
);

// 3. Add to Diagnostic Tools menu
const diagnosticTarget = `<span className="flex items-center gap-2"><Gauge className="w-4 h-4" /> Performance Optimization</span>
                  </button>`;
const diagnosticReplacement = `<span className="flex items-center gap-2"><Gauge className="w-4 h-4" /> Performance Optimization</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('hardwareGen'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark 
                        ? 'bg-blue-950/30 text-blue-400 hover:bg-blue-900/60' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Hardware Capability Gen</span>
                  </button>`;

if (code.includes(diagnosticTarget) && !code.includes('hardwareGen')) {
  code = code.replace(diagnosticTarget, diagnosticReplacement);
}

// Cpu is already imported, so no need to change lucide-react imports for Cpu.

// 4. Render the dialog
const dialogTarget = `{activeDialog === 'perfEngine' && <PerformanceOptimizationEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;
const dialogReplacement = `{activeDialog === 'perfEngine' && <PerformanceOptimizationEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}

      {activeDialog === 'hardwareGen' && <HardwareCapabilityModuleGeneratorDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(dialogTarget) && !code.includes('HardwareCapabilityModuleGeneratorDialog isDark')) {
  code = code.replace(dialogTarget, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for HardwareCapabilityModuleGeneratorDialog");
