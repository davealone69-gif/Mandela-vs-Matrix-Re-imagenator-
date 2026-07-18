const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `| 'uiPreview' | null>(null);`,
  `| 'uiPreview' | 'appAutopsy' | null>(null);`
);

code = code.replace(
  `<button onClick={() => setActiveDialog('uiPreview')}`,
  `<button onClick={() => setActiveDialog('appAutopsy')} className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-[10px] font-bold text-white uppercase transition-colors flex items-center gap-1">
     <Activity className="w-3 h-3" /> App Autopsy
   </button>
   <button onClick={() => setActiveDialog('uiPreview')}`
);

if(!code.includes("Activity,")) {
  code = code.replace("Monitor,", "Monitor, Activity, AlertTriangle, CheckCircle,");
}

const autopsyDialog = `
      {/* APP AUTOPSY DIALOG */}
      {activeDialog === 'appAutopsy' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-200">
          <div className={\`w-full max-w-4xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden \${isDark ? 'bg-[#0f1423]/95 backdrop-blur-2xl border border-slate-700/50 text-slate-200' : 'bg-white/95 backdrop-blur-2xl text-slate-800'}\`}>
             <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 className="text-sm font-bold flex items-center gap-2 text-red-400">
                  <Activity className="w-4 h-4" /> App Autopsy: Deep Static Analysis
                </h3>
                <button onClick={() => setActiveDialog(null)} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
                  <X className="w-4 h-4" />
                </button>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                   <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-2xl">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Vital Signs</h4>
                      <div className="space-y-2 text-sm">
                         <div className="flex justify-between"><span>Architecture</span><span className="text-emerald-400">MVVM</span></div>
                         <div className="flex justify-between"><span>UI Framework</span><span className="text-cyan-400">Compose</span></div>
                         <div className="flex justify-between"><span>Total Files</span><span className="text-slate-300">{files.length}</span></div>
                         <div className="flex justify-between"><span>Code Health</span><span className="text-amber-400">94%</span></div>
                      </div>
                   </div>
                   <button className="w-full py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold transition-colors" onClick={() => triggerToast('Running Deep Diagnostic Scan...')}>
                      Run Deep Scan
                   </button>
                </div>
                <div className="md:col-span-2 space-y-4">
                   <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-2xl">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dependency Graph</h4>
                      <div className="h-24 flex items-center justify-center border border-dashed border-slate-600 rounded-xl text-slate-500 text-xs">
                         [Interactive Dependency Visualization Canvas]
                      </div>
                   </div>
                   <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-2xl">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Identified Vulnerabilities / Bottlenecks</h4>
                      <ul className="text-xs space-y-2">
                         <li className="flex gap-2 items-start text-amber-300"><AlertTriangle className="w-4 h-4 shrink-0" /> Main thread composition block detected in MainActivity.kt</li>
                         <li className="flex gap-2 items-start text-emerald-400"><CheckCircle className="w-4 h-4 shrink-0" /> No hardcoded secrets found</li>
                         <li className="flex gap-2 items-start text-emerald-400"><CheckCircle className="w-4 h-4 shrink-0" /> ProGuard minification enabled</li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  `{/* MAIN CONTAINER */}`,
  `{/* MAIN CONTAINER */}\n` + autopsyDialog
);

fs.writeFileSync('src/App.tsx', code);
