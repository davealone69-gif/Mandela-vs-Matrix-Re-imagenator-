import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Shield, Terminal, Zap, ShieldAlert, ShieldCheck, 
  Cpu, RotateCw, Hourglass, RefreshCw, AlertTriangle, CheckCircle, Flame
} from 'lucide-react';

interface BuilderVisualOpsDialogProps {
  isDark: boolean;
  onClose: () => void;
}

type BuilderState = 
  | 'idle'
  | 'runSystemCheck'
  | 'detectFaults'
  | 'autoRepair'
  | 'verifyRepair'
  | 'restartIfRequired'
  | 'workflowTrace'
  | 'workflowCheckpoint'
  | 'workflowRecover'
  | 'workflowSummary'
  | 'workflowReport'
  | 'workflowSwarmSync'
  | 'workflowPreAPKCheck';

export default function BuilderVisualOpsDialog({ isDark, onClose }: BuilderVisualOpsDialogProps) {
  const [activeState, setActiveState] = useState<BuilderState>('idle');
  const [isFrozen, setIsFrozen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCharge, setUploadCharge] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Sync state from server on component load
  const syncWithServer = async () => {
    try {
      const res = await fetch('/api/builder/ops-state');
      const data = await res.json();
      if (data.success) {
        setIsFrozen(data.isFrozen);
        setActiveState(data.state as BuilderState);
        if (data.state !== 'idle') {
          const elapsed = Math.floor((Date.now() - data.buildActiveStartTime) / 1000);
          setTimerSeconds(elapsed > 0 ? elapsed : 0);
        } else {
          setTimerSeconds(0);
        }
      }
    } catch (e) {
      console.error("Ops State sync failed:", e);
    }
  };

  useEffect(() => {
    syncWithServer();
    const interval = setInterval(syncWithServer, 4000);
    return () => clearInterval(interval);
  }, []);

  // buildTimer() logic
  useEffect(() => {
    if (activeState !== 'idle' && !isFrozen) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeState, isFrozen]);

  // formatTimer helper
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Triggering visual state sync simulator
  const changeState = async (newState: BuilderState) => {
    if (isFrozen && newState !== 'idle') {
      addLog("WARNING: Builder is currently frozen. Unfreeze to launch process cycles.");
      return;
    }
    try {
      setActiveState(newState);
      if (newState === 'idle') {
        setTimerSeconds(0);
      } else {
        setTimerSeconds(0); // reset on new build cycle
      }

      await fetch('/api/builder/set-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState })
      });
      addLog(`VisualStateSync -> Transitioned to state: ${newState.toUpperCase()}`);
    } catch (e) {
      console.error(e);
    }
  };

  // builderFreeze() handler via STOP button
  const toggleFreeze = async () => {
    try {
      const res = await fetch('/api/builder/freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ freeze: !isFrozen })
      });
      const data = await res.json();
      if (data.success) {
        setIsFrozen(data.isFrozen);
        addLog(data.message);
      }
    } catch (e: any) {
      addLog(`Freeze action failed: ${e.message}`);
    }
  };

  // Spinner Primary check helper
  const isSpinnerPrimaryActive = () => {
    if (isFrozen) return false;
    const primaryStates: BuilderState[] = [
      'runSystemCheck', 'autoRepair', 'verifyRepair', 'restartIfRequired', 'workflowPreAPKCheck'
    ];
    return primaryStates.includes(activeState);
  };

  // Spinner Secondary check helper
  const isSpinnerSecondaryActive = () => {
    if (isFrozen) return false;
    const secondaryStates: BuilderState[] = [
      'detectFaults', 'workflowTrace', 'workflowCheckpoint', 'workflowRecover', 'workflowSummary', 'workflowReport', 'workflowSwarmSync'
    ];
    return secondaryStates.includes(activeState);
  };

  // Simulate complete chain flow
  const runVisualDemo = async () => {
    if (isFrozen) {
      addLog("Cannot initiate demo. Builder is frozen.");
      return;
    }
    const demoSteps: BuilderState[] = [
      'runSystemCheck',
      'detectFaults',
      'autoRepair',
      'verifyRepair',
      'workflowTrace',
      'workflowCheckpoint',
      'workflowPreAPKCheck',
      'idle'
    ];

    addLog("--- LAUNCHING BULLET-PROOF DEMO BUILD CHAIN ---");
    for (const step of demoSteps) {
      if (isFrozen) break;
      await changeState(step);
      addLog(`Executing: ${step}...`);
      await new Promise(r => setTimeout(r, 3000));
    }
    addLog("--- DEMO BUILD CHAIN COMPLETE ---");
  };

  // Triggering the charge-up simulation for bottom spinner/upload indicator
  const triggerChargeUpload = () => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadCharge(0);
    addLog("Initiating Upload -> Charge -> Spin sequence...");
    
    const interval = setInterval(() => {
      setUploadCharge(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          addLog("Charge Complete. Spin Sequence stabilized.");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-250">
      <div className={`w-full max-w-6xl rounded-3xl border-2 overflow-hidden flex flex-col max-h-[90vh] ${
        isDark 
          ? 'bg-zinc-950 border-cyan-500/30 text-zinc-100 shadow-[0_0_60px_rgba(6,182,212,0.2)]' 
          : 'bg-white border-zinc-300 text-zinc-900 shadow-xl'
      }`}>
        
        {/* Title / Neon Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/20 bg-gradient-to-r from-cyan-950/20 to-transparent">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              BUILDER VISUAL OPS & CONTROL PORTAL
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800/40 rounded transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Console Content */}
        <div className="p-6 flex flex-col flex-1 overflow-hidden gap-6">
          
          {/* Dashboard Metrics Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
            {/* Build Timer Block */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">BUILD TIMER</div>
                <div className="text-xl font-mono font-black text-cyan-400 tracking-wider">
                  {formatTimer(timerSeconds)}
                </div>
              </div>
              <Hourglass className={`w-5 h-5 ${activeState !== 'idle' && !isFrozen ? 'animate-bounce text-cyan-400' : 'text-zinc-600'}`} />
            </div>

            {/* Frozen Status Block */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              isFrozen 
                ? 'bg-red-950/20 border-red-500/40 text-red-400' 
                : 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">EXECUTION STATUS</div>
                <div className="text-xs font-black tracking-widest uppercase">
                  {isFrozen ? 'PAUSED / FROZEN' : 'WARM STANDBY'}
                </div>
              </div>
              {isFrozen ? <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            </div>

            {/* Current Active Core State */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-center col-span-2">
              <div className="text-[10px] text-zinc-500 font-bold uppercase">CURRENT OPSCORE LAYER</div>
              <div className="text-xs font-mono font-black tracking-wider text-zinc-200 uppercase truncate mt-0.5">
                {activeState === 'idle' ? 'IDLE' : activeState}
              </div>
            </div>
          </div>

          {/* Core Interactive Layout Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
            
            {/* Left Column: Cyber-Brutalist Dynamic Spinners Console */}
            <div className="border border-zinc-800/80 bg-black/40 rounded-3xl p-5 flex flex-col gap-6 justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" /> SPIN CONTROL PANEL
              </span>

              {/* SPINNER PRIMARY (TOP) */}
              <div className="flex items-center justify-between border border-zinc-850 p-4 rounded-2xl bg-zinc-950/50">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-zinc-200">PRIMARY SPINNER</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">System Checks / Repairs / APK Gates</span>
                </div>
                <div className={`relative w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                  isSpinnerPrimaryActive() 
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 animate-spin' 
                    : 'border-zinc-800 text-zinc-600'
                }`} style={{ animationDuration: '2s' }}>
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              {/* SPINNER SECONDARY (MIDDLE) */}
              <div className="flex items-center justify-between border border-zinc-850 p-4 rounded-2xl bg-zinc-950/50">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-zinc-200">SECONDARY SPINNER</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">Traces / Forecasting / Anomaly</span>
                </div>
                <div className={`relative w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                  isSpinnerSecondaryActive() 
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400 animate-spin' 
                    : 'border-zinc-800 text-zinc-600'
                }`} style={{ animationDuration: '4s' }}>
                  <RefreshCw className="w-5 h-5" />
                </div>
              </div>

              {/* SPINNER BOTTOM (UPLOADER / MANUAL STOP TRIGGER) */}
              <div className="border border-zinc-850 p-4 rounded-2xl bg-zinc-950/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-zinc-200">BOTTOM TRIGGER SPINNER</span>
                    <span className="text-[9px] text-zinc-500">Upload → Charge → Spin / STOP</span>
                  </div>

                  {activeState !== 'idle' ? (
                    // Transitions into STOP freeze button when actively building
                    <button
                      onClick={toggleFreeze}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                        isFrozen 
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900' 
                          : 'bg-rose-950 border border-rose-800 text-rose-400 hover:bg-rose-900 animate-pulse'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      {isFrozen ? 'UNFREEZE' : 'STOP / FREEZE'}
                    </button>
                  ) : (
                    // Upload indicator
                    <button
                      onClick={triggerChargeUpload}
                      disabled={isUploading}
                      className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-400 text-[10px] font-black uppercase rounded-lg cursor-pointer"
                    >
                      {isUploading ? `${uploadCharge}%` : 'CHARGE'}
                    </button>
                  )}
                </div>

                {/* Progress Visualizer for charge upload */}
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-rose-500 h-full transition-all duration-100" 
                    style={{ width: `${activeState !== 'idle' ? 100 : uploadCharge}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Middle Column: VisualStateSync Core State Controls */}
            <div className="border border-zinc-800/80 bg-black/40 rounded-3xl p-5 flex flex-col gap-4 overflow-y-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-400" /> STATE SYNC SELECTOR
              </span>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'runSystemCheck', label: '1. runSystemCheck()' },
                  { id: 'detectFaults', label: '2. detectFaults()' },
                  { id: 'autoRepair', label: '3. autoRepair()' },
                  { id: 'verifyRepair', label: '4. verifyRepair()' },
                  { id: 'restartIfRequired', label: '5. restartIfRequired()' },
                  { id: 'workflowTrace', label: '6. workflowTrace()' },
                  { id: 'workflowCheckpoint', label: '7. workflowCheckpoint()' },
                  { id: 'workflowRecover', label: '8. workflowRecover()' },
                  { id: 'workflowSummary', label: '9. workflowSummary()' },
                  { id: 'workflowReport', label: '10. workflowReport()' },
                  { id: 'workflowSwarmSync', label: '11. workflowSwarmSync()' },
                  { id: 'workflowPreAPKCheck', label: '12. workflowPreAPKCheck()' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => changeState(s.id as BuilderState)}
                    disabled={isFrozen}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center justify-between cursor-pointer ${
                      activeState === s.id 
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-black shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'bg-zinc-950/40 border-zinc-900/60 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>{s.label}</span>
                    {activeState === s.id && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Terminal Trace log viewer */}
            <div className="border border-zinc-800/80 bg-black/40 rounded-3xl p-5 flex flex-col gap-3 h-full overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" /> STABILITY DIAGNOSTICS
                </span>
                <button
                  onClick={runVisualDemo}
                  disabled={isFrozen}
                  className="px-3 py-1 bg-rose-950 border border-rose-800 text-rose-400 text-[9px] font-black uppercase rounded-lg cursor-pointer hover:bg-rose-900"
                >
                  RUN COMPILE DEMO
                </button>
              </div>

              <div className="flex-1 bg-black border border-zinc-900 rounded-2xl p-4 overflow-y-auto font-mono text-[10px] leading-relaxed text-zinc-400 flex flex-col gap-1.5">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 italic gap-2 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-zinc-800" />
                    <span>Diagnostics interface online.<br/>Transition state to generate logs.</span>
                  </div>
                ) : (
                  logs.map((log, index) => {
                    let color = 'text-zinc-500';
                    if (log.includes('Transitioned')) color = 'text-cyan-400 font-extrabold';
                    if (log.includes('WARNING')) color = 'text-amber-400 font-bold';
                    if (log.includes('Frozen') || log.includes('paused')) color = 'text-rose-500 font-extrabold';
                    return <div key={index} className={color}>{log}</div>;
                  })
                )}
              </div>
            </div>

          </div>

          {/* Bottom Actions Footer */}
          <div className="flex items-center justify-between border-t border-zinc-800/30 pt-4 shrink-0">
            <div className="flex items-center gap-2 text-[10.5px] text-zinc-500 font-mono">
              <span>Execution Guarantee:</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> STABILIZED REALITY CHECKPOINT
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => changeState('idle')}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-black tracking-wider cursor-pointer transition-all"
              >
                Reset State
              </button>
              <button 
                onClick={onClose}
                className="px-5 py-2.5 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-400 rounded-xl text-xs font-black tracking-wider cursor-pointer transition-all"
              >
                Dismiss Suite
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
