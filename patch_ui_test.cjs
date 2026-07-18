const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
if (!code.includes('import AutoUITestSystemDialog')) {
  code = code.replace(
    "import ApkBuildOrchestratorDialog from './components/ApkBuildOrchestratorDialog';",
    "import ApkBuildOrchestratorDialog from './components/ApkBuildOrchestratorDialog';\nimport AutoUITestSystemDialog from './components/AutoUITestSystemDialog';"
  );
}

// 2. Modify activeDialog type
code = code.replace(
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | null>(null);",
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | null>(null);"
);

// 3. Add to Diagnostic Tools menu
const diagnosticTarget = `<span className="flex items-center gap-2"><Activity className="w-4 h-4" /> System Integrity Sweep</span>
                  </button>`;
const diagnosticReplacement = `<span className="flex items-center gap-2"><Activity className="w-4 h-4" /> System Integrity Sweep</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('uiTestSystem'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark 
                        ? 'bg-indigo-950/30 text-indigo-400 hover:bg-indigo-900/60' 
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><TestTube2 className="w-4 h-4" /> Automated UI Test System</span>
                  </button>`;

if (code.includes(diagnosticTarget) && !code.includes('uiTestSystem')) {
  code = code.replace(diagnosticTarget, diagnosticReplacement);
}

// Ensure TestTube2 is imported
if (!code.includes('TestTube2') && code.includes('import {')) {
  // Let's just find the lucide-react import
  code = code.replace(
    "import { FileJson, Menu, Settings, Database, Server, Smartphone, Cloud, CloudLightning, ShieldCheck, Cpu, Code, Download, Activity, Play, StopCircle, RefreshCw, SmartphoneNfc, Terminal, Layout, FileCode2, Info, Moon, Sun, Monitor, AlertTriangle, Loader2 } from 'lucide-react';",
    "import { FileJson, Menu, Settings, Database, Server, Smartphone, Cloud, CloudLightning, ShieldCheck, Cpu, Code, Download, Activity, Play, StopCircle, RefreshCw, SmartphoneNfc, Terminal, Layout, FileCode2, Info, Moon, Sun, Monitor, AlertTriangle, Loader2, TestTube2 } from 'lucide-react';"
  );
}

// 4. Render the dialog
const dialogTarget = `{activeDialog === 'apkOrchestrator' && (`;
const dialogReplacement = `{activeDialog === 'uiTestSystem' && <AutoUITestSystemDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}

      {activeDialog === 'apkOrchestrator' && (`;

if (code.includes(dialogTarget) && !code.includes('AutoUITestSystemDialog isDark')) {
  code = code.replace(dialogTarget, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for AutoUITestSystemDialog");
