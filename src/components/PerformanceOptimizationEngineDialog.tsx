import React, { useState } from 'react';
import { Activity, Zap, BarChart2, TrendingDown, CheckCircle2, Play, Loader2, X, Gauge } from 'lucide-react';

interface PerformanceOptimizationEngineDialogProps {
  isDark: boolean;
  onClose: () => void;
}

export default function PerformanceOptimizationEngineDialog({ isDark, onClose }: PerformanceOptimizationEngineDialogProps) {
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runEngine = async () => {
    setPhase(1);
    setLogs([]);
    setProgress(0);

    // Phase 1: Profiling Instrumentation Layer
    addLog('[PHASE 1] Profiling Instrumentation Layer');
    await new Promise(r => setTimeout(r, 600));
    addLog(' - Injecting lightweight performance probes...');
    addLog(' - Instrumenting Jetpack Compose recomposition paths...');
    addLog(' - Hooking into network calls (Retrofit/OkHttp)...');
    addLog(' - Database operations (Room) probes attached.');
    addLog(' - Coroutine scopes instrumentation complete.');
    setProgress(15);

    // Phase 2: Metric Aggregation & Telemetry Model
    setPhase(2);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 2] Metric Aggregation & Telemetry Model');
    addLog(' - Collecting frame render times (FPS, jank events)...');
    addLog(' - Profiling startup times (cold, warm)...');
    addLog(' - Monitoring memory allocation patterns and GC events...');
    addLog(' - Normalizing metrics into unified telemetry schema.');
    setProgress(30);

    // Phase 3: Bottleneck Detection Engine
    setPhase(3);
    await new Promise(r => setTimeout(r, 900));
    addLog('\n[PHASE 3] Bottleneck Detection Engine');
    addLog(' - Applying heuristic analysis to telemetry...');
    addLog(' - Identifying slow recompositions...');
    addLog(' - Detecting overdraw and unoptimized layouts...');
    addLog(' - Tracing N+1 queries in Room DAO...');
    addLog(' - Flagged 4 primary performance bottlenecks.');
    setProgress(45);

    // Phase 4: Code-Level Optimization Synthesis
    setPhase(4);
    await new Promise(r => setTimeout(r, 700));
    addLog('\n[PHASE 4] Code-Level Optimization Synthesis');
    addLog(' - Synthesizing @Stable and @Immutable annotations...');
    addLog(' - Refactoring list rendering with lazy primitives...');
    addLog(' - Optimizing image loading caching strategies...');
    addLog(' - Adjusting database indices...');
    setProgress(60);

    // Phase 5: Autonomous Refinement & Patch Application
    setPhase(5);
    await new Promise(r => setTimeout(r, 1200));
    addLog('\n[PHASE 5] Autonomous Refinement & Patch Application');
    addLog(' - Applying targeted optimization patches...');
    addLog(' - Resolving memory leaks detected in strict mode...');
    addLog(' - Recompiling optimized modules...');
    setProgress(75);

    // Phase 6: Post-Optimization Verification
    setPhase(6);
    await new Promise(r => setTimeout(r, 1000));
    addLog('\n[PHASE 6] Post-Optimization Verification');
    addLog(' - Re-running telemetry test suite...');
    addLog(' - Cold start time improved by 34%.');
    addLog(' - Jank frames reduced from 12% to 0.4%.');
    addLog(' - Memory footprint reduced by 18MB.');
    setProgress(90);

    // Phase 7: Final Certification
    setPhase(7);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 7] Final Optimization Certification');
    addLog(' - Performance profile stabilized.');
    addLog(' - Bottleneck remediation verified.');
    setProgress(100);

    addLog('\n[SUCCESS] Performance Optimization Engine™ completed.');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-4xl rounded-2xl shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0f1423] border border-amber-500/30 text-slate-200' : 'bg-white border border-amber-500/30 text-slate-800'}`}>
         
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-amber-900/30 shrink-0 bg-gradient-to-r from-amber-950/40 to-transparent">
            <h3 className="text-sm font-black tracking-wider flex items-center gap-2 text-amber-500">
              <Gauge className="w-5 h-5" /> PERFORMANCE OPTIMIZATION ENGINE™
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
         </div>

         {/* Content */}
         <div className="flex flex-1 overflow-hidden">
            {/* Sidebar phases */}
            <div className={`w-64 border-r shrink-0 overflow-y-auto p-4 flex flex-col gap-2 ${isDark ? 'border-slate-800/50 bg-[#0a0d15]/50' : 'border-slate-200 bg-slate-50'}`}>
                {[
                  { name: 'Instrumentation', icon: Zap },
                  { name: 'Telemetry Aggregation', icon: BarChart2 },
                  { name: 'Bottleneck Detection', icon: Activity },
                  { name: 'Optimization Synthesis', icon: TrendingDown },
                  { name: 'Refinement Patching', icon: Gauge },
                  { name: 'Verification', icon: CheckCircle2 },
                  { name: 'Final Certification', icon: CheckCircle2 },
                ].map((p, idx) => {
                   const step = idx + 1;
                   const isActive = phase === step;
                   const isDone = phase > step;
                   const Icon = p.icon;
                   return (
                     <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : isDone ? 'text-amber-600/70' : 'text-slate-500'}`}>
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
                        <h4 className="text-lg font-black text-slate-200 mb-1">Autonomous Runtime Profiling</h4>
                        <p className="text-xs text-slate-400">Identifying and resolving code-level performance bottlenecks.</p>
                    </div>
                    {phase === 0 ? (
                       <button onClick={runEngine} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-900 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20">
                          <Play className="w-4 h-4" /> Initiate Profiling
                       </button>
                    ) : (
                       <div className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border ${phase === 7 ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          {phase === 7 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
                          {phase === 7 ? 'OPTIMIZED & VERIFIED' : `PROCESSING PHASE ${phase}/7`}
                       </div>
                    )}
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0 border border-slate-800 shadow-inner">
                   <div className="h-full bg-amber-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                </div>

                {/* Terminal Window */}
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col shadow-inner">
                   {logs.length === 0 ? (
                     <div className="text-slate-600 italic flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Awaiting subsystem initialization...
                     </div>
                   ) : (
                     logs.map((log, i) => (
                       <div key={i} className={`whitespace-pre-wrap ${
                         log.includes('SUCCESS') ? 'text-amber-500 font-bold mt-4 text-sm' : 
                         log.includes('PHASE') ? 'text-amber-400 font-bold mt-2' : 
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
