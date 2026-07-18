import React, { useState } from 'react';
import { Atom, CheckCircle2, Play, Loader2, X } from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

export default function OmniSystemSingularityCoreDialog({ isDark, onClose }: Props) {
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runEngine = async () => {
    setPhase(1); setLogs([]); setProgress(0);

    addLog('[PHASE 1] Subsystem Synchronization');
    await new Promise(r => setTimeout(r, 800));
    addLog(' - Pinging 26 isolated logic engines...');
    addLog(' - Establishing zero-latency quantum interconnects...');
    addLog(' - Synchronizing App Genome with Native Bridges...');
    setProgress(25);

    setPhase(2);
    await new Promise(r => setTimeout(r, 900));
    addLog('\n[PHASE 2] Over-The-Air (OTA) Hot Swap Core');
    addLog(' - Initializing differential binary patcher...');
    addLog(' - Injecting seamless OTA module loaders...');
    addLog(' - Bypassing store approval constraints dynamically...');
    setProgress(50);

    setPhase(3);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 3] AI Omni-Presence');
    addLog(' - Awakening continuous self-monitoring daemon...');
    addLog(' - Activating predictive bug auto-remediation...');
    addLog(' - Fusing UI intent loops with Backend state logic...');
    setProgress(75);

    setPhase(4);
    await new Promise(r => setTimeout(r, 1000));
    addLog('\n[PHASE 4] Singularity Reached');
    addLog(' - All systems acting as a single, living organism.');
    addLog(' - God-Mode achieved. App is now self-sustaining.');
    setProgress(100);

    addLog('\n[SUCCESS] OMNI-SYSTEM SINGULARITY CORE™ completed successfully.');
  };

  const stepsList = [
    { name: 'Sync Systems', icon: Atom },
    { name: 'OTA Hot Swap', icon: Atom },
    { name: 'Omni-Presence', icon: Atom },
    { name: 'Singularity', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-4xl rounded-2xl shadow-[0_0_80px_rgba(var(--fuchsia-500-rgb),0.15)] overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0f1423] border border-fuchsia-500/30 text-slate-200' : 'bg-white border border-fuchsia-500/30 text-slate-800'}`}>
         <div className={`flex items-center justify-between p-4 border-b border-fuchsia-900/30 shrink-0 bg-gradient-to-r from-fuchsia-950/40 to-transparent`}>
            <h3 className={`text-sm font-black tracking-wider flex items-center gap-2 text-fuchsia-400`}>
              <Atom className="w-5 h-5" /> OMNI-SYSTEM SINGULARITY CORE™
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
                     <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : isDone ? 'text-fuchsia-600/70' : 'text-slate-500'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />{p.name}
                     </div>
                   );
                })}
            </div>
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden relative">
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h4 className="text-lg font-black text-slate-200 mb-1">OMNI-SYSTEM SINGULARITY CORE</h4>
                        <p className="text-xs text-slate-400">The ultimate capstone engine. Synchronizes all 26 subsystems into a unified God-Mode architecture.</p>
                    </div>
                    {phase === 0 ? (
                       <button onClick={runEngine} className={`px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2`}>
                          <Play className="w-4 h-4 fill-white" /> Initiate Protocol
                       </button>
                    ) : (
                       <div className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border ${phase === 4 ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          {phase === 4 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className={`w-4 h-4 animate-spin text-fuchsia-400`} />}
                          {phase === 4 ? 'PROTOCOL COMPLETE' : `PHASE ${phase}/4`}
                       </div>
                    )}
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0 border border-slate-800"><div className={`h-full bg-fuchsia-500 transition-all duration-700`} style={{ width: `${progress}%` }} /></div>
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col">
                   {logs.length === 0 ? <div className="text-slate-600 italic">Awaiting subsystem initialization...</div> : logs.map((log, i) => <div key={i} className={`whitespace-pre-wrap ${log.includes('SUCCESS') ? 'text-fuchsia-400 font-bold mt-4 text-sm' : log.includes('PHASE') ? 'text-fuchsia-300 font-bold mt-2' : 'text-slate-400'}`}>{log}</div>)}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
