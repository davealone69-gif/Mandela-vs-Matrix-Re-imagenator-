const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImport = "import OmniSystemSingularityCoreDialog from './components/OmniSystemSingularityCoreDialog';";

if (!code.includes('import OmniSystemSingularityCoreDialog')) {
  code = code.replace(
    "import CapacitorShellWrapperDialog from './components/CapacitorShellWrapperDialog';",
    `import CapacitorShellWrapperDialog from './components/CapacitorShellWrapperDialog';\n${newImport}`
  );
}

code = code.replace(
  "| 'playStore' | 'torture' | 'uxGauntlet' | 'standaloneApk' | 'nativeBridge' | 'shellWrapper' | null>(null);",
  "| 'playStore' | 'torture' | 'uxGauntlet' | 'standaloneApk' | 'nativeBridge' | 'shellWrapper' | 'omniCore' | null>(null);"
);

// We will add it at the very top of the Sidebar as the ultimate section.
// Wait, we can add it to the AI Studio "Advanced Architecture" or create a "God Mode" section.
const targetGodMode = `              <div className="pt-2">
                <p className={\`text-[10px] font-black uppercase tracking-widest mb-2 px-1 \${isDark ? 'text-slate-500' : 'text-slate-400'}\`}>Intelligence Core</p>`;

const replacementGodMode = `              <div className="pt-2 pb-4">
                <p className={\`text-[10px] font-black uppercase tracking-widest mb-2 px-1 \${isDark ? 'text-fuchsia-500' : 'text-fuchsia-600'}\`}>Singularity Core</p>
                <div className="space-y-1">
                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('omniCore'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-all flex items-center justify-between cursor-pointer animate-pulse \${
                      isDark ? 'bg-fuchsia-950/30 text-fuchsia-400 hover:bg-fuchsia-900/60 shadow-[0_0_15px_rgba(217,70,239,0.2)]' : 'bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100 shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Atom className="w-4 h-4" /> Omni-System Singularity</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <p className={\`text-[10px] font-black uppercase tracking-widest mb-2 px-1 \${isDark ? 'text-slate-500' : 'text-slate-400'}\`}>Intelligence Core</p>`;

if (code.includes(targetGodMode) && !code.includes('Omni-System Singularity')) {
  code = code.replace(targetGodMode, replacementGodMode);
}

if (!code.includes('Atom') && code.includes('import {')) {
  code = code.replace(
    "Layers } from 'lucide-react';",
    "Layers, Atom } from 'lucide-react';"
  );
}

const targetDialog = `{activeDialog === 'shellWrapper' && <CapacitorShellWrapperDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

const dialogReplacement = `{activeDialog === 'shellWrapper' && <CapacitorShellWrapperDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'omniCore' && <OmniSystemSingularityCoreDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(targetDialog) && !code.includes('OmniSystemSingularityCoreDialog isDark')) {
  code = code.replace(targetDialog, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Omni Core added.');
