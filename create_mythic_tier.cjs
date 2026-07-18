const fs = require('fs');

const createDialog = (name, title, iconName, color, iconComp, desc) => {
  return `import React, { useState } from 'react';
import { ${iconComp}, CheckCircle2, Play, Loader2, X } from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

export default function ${name}({ isDark, onClose }: Props) {
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runEngine = async () => {
    setPhase(1); setLogs([]); setProgress(0);

    addLog('[PHASE 1] Subsystem Initialization');
    await new Promise(r => setTimeout(r, 600));
    addLog(' - Mapping deep context structures...');
    setProgress(25);

    setPhase(2);
    await new Promise(r => setTimeout(r, 700));
    addLog('\\n[PHASE 2] Knowledge Base Synchronization');
    addLog(' - Aligning heuristics...');
    setProgress(50);

    setPhase(3);
    await new Promise(r => setTimeout(r, 800));
    addLog('\\n[PHASE 3] Autonomous Synthesis');
    addLog(' - Generating high-level constructs...');
    setProgress(75);

    setPhase(4);
    await new Promise(r => setTimeout(r, 800));
    addLog('\\n[PHASE 4] Final Certification');
    addLog(' - Architecture finalized.');
    setProgress(100);

    addLog('\\n[SUCCESS] ${title}™ activated.');
  };

  const steps = [
    { name: 'Initialization', icon: ${iconComp} },
    { name: 'Sync', icon: ${iconComp} },
    { name: 'Synthesis', icon: ${iconComp} },
    { name: 'Certification', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={\`w-full max-w-4xl rounded-2xl shadow-[0_0_80px_rgba(var(--${color}-500-rgb),0.15)] overflow-hidden flex flex-col max-h-[90vh] \${isDark ? 'bg-[#0f1423] border border-${color}-500/30 text-slate-200' : 'bg-white border border-${color}-500/30 text-slate-800'}\`}>
         <div className={\`flex items-center justify-between p-4 border-b border-${color}-900/30 shrink-0 bg-gradient-to-r from-${color}-950/40 to-transparent\`}>
            <h3 className={\`text-sm font-black tracking-wider flex items-center gap-2 text-${color}-400\`}>
              <${iconComp} className="w-5 h-5" /> ${title}™
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400"><X className="w-5 h-5" /></button>
         </div>
         <div className="flex flex-1 overflow-hidden">
            <div className={\`w-64 border-r shrink-0 overflow-y-auto p-4 flex flex-col gap-2 \${isDark ? 'border-slate-800/50 bg-[#0a0d15]/50' : 'border-slate-200 bg-slate-50'}\`}>
                {steps.map((p, idx) => {
                   const isActive = phase === idx + 1;
                   const isDone = phase > idx + 1;
                   const Icon = p.icon;
                   return (
                     <div key={idx} className={\`flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition-all \${isActive ? 'bg-${color}-500/20 text-${color}-400 border border-${color}-500/30' : isDone ? 'text-${color}-600/70' : 'text-slate-500'}\`}>
                        <Icon className={\`w-4 h-4 \${isActive ? 'animate-pulse' : ''}\`} />{p.name}
                     </div>
                   );
                })}
            </div>
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden relative">
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h4 className="text-lg font-black text-slate-200 mb-1">${title}</h4>
                        <p className="text-xs text-slate-400">${desc}</p>
                    </div>
                    {phase === 0 ? (
                       <button onClick={runEngine} className={\`px-5 py-2.5 bg-${color}-600 hover:bg-${color}-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2\`}>
                          <Play className="w-4 h-4 fill-white" /> Activate
                       </button>
                    ) : (
                       <div className={\`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border \${phase === 4 ? 'bg-${color}-500/20 border-${color}-500/50 text-${color}-400' : 'bg-slate-800 border-slate-700 text-slate-300'}\`}>
                          {phase === 4 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className={\`w-4 h-4 animate-spin text-${color}-400\`} />}
                          {phase === 4 ? 'SYSTEM ONLINE' : \`PHASE \${phase}/4\`}
                       </div>
                    )}
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0 border border-slate-800"><div className={\`h-full bg-${color}-500 transition-all duration-700\`} style={{ width: \`\${progress}%\` }} /></div>
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col">
                   {logs.length === 0 ? <div className="text-slate-600 italic">Awaiting subsystem initialization...</div> : logs.map((log, i) => <div key={i} className={\`whitespace-pre-wrap \${log.includes('SUCCESS') ? 'text-${color}-400 font-bold mt-4 text-sm' : log.includes('PHASE') ? 'text-${color}-300 font-bold mt-2' : 'text-slate-400'}\`}>{log}</div>)}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`;
}

fs.writeFileSync('src/components/EcosystemConsciousnessSimulatorDialog.tsx', createDialog('EcosystemConsciousnessSimulatorDialog', 'ECOSYSTEM CONSCIOUSNESS SIMULATOR', 'Eye', 'rose', 'Eye', 'Unified Awareness Modeling & Emergent Behavior Simulation.'));
fs.writeFileSync('src/components/MythicIntelligenceCodexDialog.tsx', createDialog('MythicIntelligenceCodexDialog', 'MYTHIC INTELLIGENCE CODEX', 'BookOpen', 'amber', 'BookOpen', 'Foundational Lore, System Canon & Meta-Intelligence Doctrine.'));
fs.writeFileSync('src/components/PrimeDirectiveGovernanceLayerDialog.tsx', createDialog('PrimeDirectiveGovernanceLayerDialog', 'PRIME DIRECTIVE GOVERNANCE LAYER', 'Shield', 'red', 'Shield', 'Global Safety Doctrine & Ecosystem-Wide Ethical Control.'));

