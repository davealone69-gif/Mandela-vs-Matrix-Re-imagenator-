const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                  <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mb-1 px-1">Project Sandbox Mode</div>`;

const newCode = `                  <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mb-1 px-1">Diagnostic Tools</div>
                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('integritySweep'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark 
                        ? 'bg-rose-950/30 text-rose-400 hover:bg-rose-900/60' 
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> System Integrity Sweep</span>
                  </button>

                  <div className={\`h-px my-1 \${isDark ? 'bg-slate-800' : 'bg-slate-200'}\`} />

                  <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mb-1 px-1">Project Sandbox Mode</div>`;

code = code.replace(target, newCode);

code = code.replace(
  "appAutopsy' | null>(null);",
  "appAutopsy' | 'integritySweep' | null>(null);"
);

fs.writeFileSync('src/App.tsx', code);
