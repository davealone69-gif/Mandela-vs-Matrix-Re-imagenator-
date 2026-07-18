const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dialogs = `
      {/* MARKETPLACE DIALOG */}
      {activeDialog === 'marketplace' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className={\`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden \${isDark ? 'bg-[#0f1423] border border-slate-700/50 text-slate-300' : 'bg-white text-slate-800'}\`}>
             <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                  <Box className="w-4 h-4" /> Plugin Marketplace
                </h3>
                <button onClick={() => setActiveDialog(null)} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
                  <X className="w-4 h-4" />
                </button>
             </div>
             <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Retrofit Auto-Gen", desc: "AI module to generate network clients instantly." },
                  { name: "Room DB Visualizer", desc: "Inspect local Room databases directly in the IDE." },
                  { name: "Compose Animation Studio", desc: "Keyframe editor for Compose UI." },
                  { name: "Firebase Remote Config", desc: "Easily manage parameters without leaving IDE." }
                ].map((plugin, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-700 p-3 rounded-xl">
                     <h4 className="font-bold text-sm text-slate-200">{plugin.name}</h4>
                     <p className="text-xs text-slate-400 mt-1 mb-3">{plugin.desc}</p>
                     <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded w-full transition-colors" onClick={() => triggerToast(\`Installing \${plugin.name}... (Simulated)\`)}>
                        Install Module
                     </button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* AI UI PREVIEW DIALOG */}
      {activeDialog === 'uiPreview' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className={\`w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden \${isDark ? 'bg-[#0f1423] border border-slate-700/50 text-slate-300' : 'bg-white text-slate-800'}\`}>
             <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 className="text-sm font-bold flex items-center gap-2 text-orange-400">
                  <Monitor className="w-4 h-4" /> AI-Driven Compose Preview
                </h3>
                <button onClick={() => setActiveDialog(null)} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
                  <X className="w-4 h-4" />
                </button>
             </div>
             <div className="p-4 flex flex-col gap-4">
                <p className="text-xs text-slate-400">
                   Gemini is analyzing your active Compose code and rendering a live web-based approximation...
                </p>
                <div className="h-64 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                   {/* Simulated Rendering */}
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10 animate-pulse">
                      <span className="text-orange-400 font-bold flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Rendering UI...</span>
                   </div>
                   <div className="w-64 h-[80%] bg-white rounded-3xl shadow-xl border-4 border-slate-800 overflow-hidden opacity-50">
                     {/* Mock App Screen */}
                     <div className="bg-blue-600 text-white p-3 font-bold text-sm">App Bar</div>
                     <div className="p-4 flex flex-col gap-3">
                        <div className="h-20 bg-slate-200 rounded-xl"></div>
                        <div className="h-10 bg-blue-500 rounded-full w-2/3 mx-auto mt-4"></div>
                     </div>
                   </div>
                </div>
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-xl text-sm w-full transition-colors" onClick={() => triggerToast('Refreshing AI Preview...')}>
                   Refresh Preview
                </button>
             </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  `{/* MAIN CONTAINER */}`,
  `{/* MAIN CONTAINER */}\n` + dialogs
);

fs.writeFileSync('src/App.tsx', code);
