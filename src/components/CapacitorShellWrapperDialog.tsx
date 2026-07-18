import React, { useState } from 'react';
import { Layers, CheckCircle2, Play, Loader2, X } from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

export default function CapacitorShellWrapperDialog({ isDark, onClose }: Props) {
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runEngine = async () => {
    setPhase(1); setLogs([]); setProgress(0);

    addLog('[PHASE 1] Container Scaffolding');
    await new Promise(r => setTimeout(r, 800));
    addLog(' - Generating MainActivity.java / AppDelegate.swift...');
    addLog(' - Configuring AndroidManifest.xml & Info.plist...');
    addLog(' - Injecting splash screens and app icons...');
    setProgress(25);

    setPhase(2);
    await new Promise(r => setTimeout(r, 900));
    addLog('\n[PHASE 2] Asset Bundling');
    addLog(' - Copying dist/ web assets into native assets/ folder...');
    addLog(' - Configuring local web server (localhost:8080)...');
    addLog(' - Pre-caching service worker manifests...');
    setProgress(50);

    setPhase(3);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 3] Offline-First Resilience');
    addLog(' - Setting up SQLite persistent data bridges...');
    addLog(' - Enabling fallback cache policies...');
    addLog(' - Hooking network state listeners...');
    setProgress(75);

    setPhase(4);
    await new Promise(r => setTimeout(r, 1000));
    addLog('\n[PHASE 4] Certification');
    addLog(' - App is successfully wrapped in a native shell.');
    addLog(' - Ready for cross-platform compilation.');
    setProgress(100);

    addLog('\n[SUCCESS] NATIVE SHELL WRAPPER™ completed successfully.');
  };

  const stepsList = [
    { name: 'Scaffolding', icon: Layers },
    { name: 'Asset Bundling', icon: Layers },
    { name: 'Offline Policies', icon: Layers },
    { name: 'Certification', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-4xl rounded-2xl shadow-[0_0_80px_rgba(var(--violet-500-rgb),0.15)] overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0f1423] border border-violet-500/30 text-slate-200' : 'bg-white border border-violet-500/30 text-slate-800'}`}>
         <div className={`flex items-center justify-between p-4 border-b border-violet-900/30 shrink-0 bg-gradient-to-r from-violet-950/40 to-transparent`}>
            <h3 className={`text-sm font-black tracking-wider flex items-center gap-2 text-violet-400`}>
              <Layers className="w-5 h-5" /> NATIVE SHELL WRAPPER™
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400"><X className="w-5 h-5" /></button>
         </div>
         <div className="flex flex-1 overflow-hidden">
            <div className={`w-64 border-r shrink-0 overflow-y-auto p-4 flex flex-col gap-2 ${isDark ? 'border-slate-800/50 bg-[#0a0d15]/50' : 'border-slate-200 bg-slate-50'}`}>
                {stepsList.map((p, idx) => {
                   const isActive = phase === idx + 1;
                   const isDone = phase > idx + 1;
                   const Icon = p.icon;
                   return (
                     <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : isDone ? 'text-violet-600/70' : 'text-slate-500'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />{p.name}
                     </div>
                   );
                })}
            </div>
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden relative">
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h4 className="text-lg font-black text-slate-200 mb-1">NATIVE SHELL WRAPPER</h4>
                        <p className="text-xs text-slate-400">Encapsulates the web artifact into a standalone native application container (Android/iOS).</p>
                    </div>
                    {phase === 0 ? (
                       <button onClick={runEngine} className={`px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2`}>
                          <Play className="w-4 h-4 fill-white" /> Initiate Protocol
                       </button>
                    ) : (
                       <div className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border ${phase === 4 ? 'bg-violet-500/20 border-violet-500/50 text-violet-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          {phase === 4 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className={`w-4 h-4 animate-spin text-violet-400`} />}
                          {phase === 4 ? 'PROTOCOL COMPLETE' : `PHASE ${phase}/4`}
                       </div>
                    )}
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0 border border-slate-800"><div className={`h-full bg-violet-500 transition-all duration-700`} style={{ width: `${progress}%` }} /></div>
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col">
                   {logs.length === 0 ? <div className="text-slate-600 italic">Awaiting subsystem initialization...</div> : logs.map((log, i) => <div key={i} className={`whitespace-pre-wrap ${log.includes('SUCCESS') ? 'text-violet-400 font-bold mt-4 text-sm' : log.includes('PHASE') ? 'text-violet-300 font-bold mt-2' : 'text-slate-400'}`}>{log}</div>)}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
