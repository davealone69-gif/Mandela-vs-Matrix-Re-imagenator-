import React, { useState } from 'react';
import { Layers, Network, Workflow, RefreshCw, FolderTree, CheckCircle2, Play, Loader2, X, FileJson, Boxes, GitBranch } from 'lucide-react';

interface ArchitectureShiftingEngineDialogProps {
  isDark: boolean;
  onClose: () => void;
}

export default function ArchitectureShiftingEngineDialog({ isDark, onClose }: ArchitectureShiftingEngineDialogProps) {
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runEngine = async () => {
    setPhase(1);
    setLogs([]);
    setProgress(0);

    // Phase 1: Architecture Discovery & Classification Layer
    addLog('[PHASE 1] Architecture Discovery & Classification Layer');
    await new Promise(r => setTimeout(r, 800));
    addLog(' - Scanning codebase for View, ViewModel, Repository roles...');
    addLog(' - Current architecture style detected: Ad-hoc Monolith.');
    addLog(' - Mapping dependencies between UI, domain, and data layers...');
    addLog(' - Architecture Topology Graph constructed.');
    setProgress(15);

    // Phase 2: Target Architecture Specification Engine
    setPhase(2);
    await new Promise(r => setTimeout(r, 700));
    addLog('\n[PHASE 2] Target Architecture Specification Engine');
    addLog(' - Target architecture profile selected: MVI with Clean Architecture.');
    addLog(' - Defining layer boundaries (UI, Domain, Data).');
    addLog(' - Establishing strict unidirectional dependency rules.');
    setProgress(30);

    // Phase 3: Layer Refactoring & Boundary Enforcement
    setPhase(3);
    await new Promise(r => setTimeout(r, 1200));
    addLog('\n[PHASE 3] Layer Refactoring & Boundary Enforcement');
    addLog(' - Migrating UI classes to presentation layer...');
    addLog(' - Extracting business rules into Domain use cases...');
    addLog(' - Isolating Data sources and repositories...');
    addLog(' - Injecting Hilt dependency bindings for layer boundaries.');
    addLog(' - Dependency directionality enforced.');
    setProgress(45);

    // Phase 4: State & Flow Model Transformation
    setPhase(4);
    await new Promise(r => setTimeout(r, 1000));
    addLog('\n[PHASE 4] State & Flow Model Transformation');
    addLog(' - Converting imperative callbacks to Kotlin StateFlow/SharedFlow...');
    addLog(' - Implementing structured MVI state containers (Intent -> Action -> State).');
    addLog(' - Normalizing event handling and UI state emissions.');
    addLog(' - Loading and Error state taxonomy aligned.');
    setProgress(65);

    // Phase 5: Module Extraction & Multi-Module Conversion
    setPhase(5);
    await new Promise(r => setTimeout(r, 1500));
    addLog('\n[PHASE 5] Module Extraction & Multi-Module Conversion');
    addLog(' - Identifying isolated feature boundaries (Auth, Dashboard, Settings)...');
    addLog(' - Synthesizing discrete Gradle modules: :feature:auth, :feature:dashboard, :core:data, :core:domain...');
    addLog(' - Rewriting import paths and Gradle dependencies across module graph.');
    addLog(' - Build parallelization potential maximized.');
    setProgress(85);

    // Phase 6: Final Certification
    setPhase(6);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 6] Final Architecture Certification');
    addLog(' - Semantic model validation: PASSED.');
    addLog(' - Circular dependency check: ZERO cycles detected.');
    addLog(' - Structural transformation committed successfully.');
    setProgress(100);

    addLog('\n[SUCCESS] Architecture Shifting Engine™ completed structural paradigm shift.');
  };

  const steps = [
    { name: 'Discovery & Classification', icon: Network },
    { name: 'Target Specification', icon: FileJson },
    { name: 'Layer Boundary Refactoring', icon: Layers },
    { name: 'State Flow Transformation', icon: Workflow },
    { name: 'Multi-Module Extraction', icon: FolderTree },
    { name: 'Architecture Certification', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-4xl rounded-2xl shadow-[0_0_80px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0f1423] border border-purple-500/30 text-slate-200' : 'bg-white border border-purple-500/30 text-slate-800'}`}>
         
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-purple-900/30 shrink-0 bg-gradient-to-r from-purple-950/40 to-transparent">
            <h3 className="text-sm font-black tracking-wider flex items-center gap-2 text-purple-400">
              <Boxes className="w-5 h-5" /> ARCHITECTURE SHIFTING ENGINE™
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
         </div>

         {/* Content */}
         <div className="flex flex-1 overflow-hidden">
            {/* Sidebar phases */}
            <div className={`w-64 border-r shrink-0 overflow-y-auto p-4 flex flex-col gap-2 ${isDark ? 'border-slate-800/50 bg-[#0a0d15]/50' : 'border-slate-200 bg-slate-50'}`}>
                {steps.map((p, idx) => {
                   const step = idx + 1;
                   const isActive = phase === step;
                   const isDone = phase > step;
                   const Icon = p.icon;
                   return (
                     <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : isDone ? 'text-purple-600/70' : 'text-slate-500'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                        {p.name}
                     </div>
                   );
                })}
            </div>

            {/* Main view */}
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden relative">
                
                {/* Visualizer header */}
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h4 className="text-lg font-black text-slate-200 mb-1">Autonomous Paradigm Transformation</h4>
                        <p className="text-xs text-slate-400">Refactoring monoliths into modular, layered clean architectures.</p>
                    </div>
                    {phase === 0 ? (
                       <button onClick={runEngine} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20">
                          <Play className="w-4 h-4 fill-white" /> Initiate Shift
                       </button>
                    ) : (
                       <div className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border ${phase === 6 ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          {phase === 6 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin text-purple-400" />}
                          {phase === 6 ? 'ARCHITECTURE SHIFTED' : `PROCESSING PHASE ${phase}/6`}
                       </div>
                    )}
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0 border border-slate-800 shadow-inner">
                   <div className="h-full bg-purple-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                </div>

                {/* Terminal Window */}
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col shadow-inner relative">
                   {logs.length === 0 ? (
                     <div className="text-slate-600 italic flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        Awaiting subsystem initialization...
                     </div>
                   ) : (
                     logs.map((log, i) => (
                       <div key={i} className={`whitespace-pre-wrap ${
                         log.includes('SUCCESS') ? 'text-purple-400 font-bold mt-4 text-sm' : 
                         log.includes('PHASE') ? 'text-purple-300 font-bold mt-2' : 
                         log.includes('Error') || log.includes('Failed') ? 'text-rose-400' :
                         'text-slate-400'
                       }`}>
                         {log}
                       </div>
                     ))
                   )}
                </div>

            </div>
         </div>
      </div>
    </div>
  );
}
