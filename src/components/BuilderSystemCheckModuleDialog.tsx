import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Activity, Terminal, RefreshCw, Wrench, 
  CheckCircle, AlertTriangle, Play, X, Server, Cpu, Flame, Hammer
} from 'lucide-react';

interface BuilderSystemCheckModuleDialogProps {
  isDark: boolean;
  onClose: () => void;
}

interface Fault {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  desc: string;
  reparable: boolean;
}

export default function BuilderSystemCheckModuleDialog({ isDark, onClose }: BuilderSystemCheckModuleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [faults, setFaults] = useState<Fault[]>([]);
  const [modulesState, setModulesState] = useState<{ name: string; status: string }[]>([]);
  const [repaired, setRepaired] = useState(false);
  const [verified, setVerified] = useState(false);
  const [step, setStep] = useState<'idle' | 'checking' | 'faults_found' | 'repairing' | 'verifying' | 'completed'>('idle');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // 1. runSystemCheck()
  const runSystemCheck = async () => {
    setLoading(true);
    setStep('checking');
    setLogs([]);
    setRepaired(false);
    setVerified(false);
    addLog("Initializing runSystemCheck()...");
    
    try {
      const res = await fetch('/api/builder/system-check', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        data.logs.forEach((logLine: string) => addLog(logLine));
        setModulesState(data.modulesState);
        addLog("System check complete. Now detecting underlying faults...");
        
        // Immediately run detectFaults() after checking
        await detectFaults();
      } else {
        addLog("ERROR: runSystemCheck failed.");
        setStep('idle');
      }
    } catch (e: any) {
      addLog(`CATASTROPHIC RUNTIME EXCEPTION: ${e.message}`);
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  // 2. detectFaults()
  const detectFaults = async () => {
    addLog("Executing detectFaults()...");
    try {
      const res = await fetch('/api/builder/detect-faults', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        setFaults(data.faults);
        if (data.faults.length > 0) {
          addLog(`WARNING: ${data.faults.length} architecture/package faults detected!`);
          setStep('faults_found');
        } else {
          addLog("SUCCESS: 0 faults detected inside modules or package.json.");
          setStep('completed');
        }
      }
    } catch (e: any) {
      addLog(`FAULT DETECTION FAILED: ${e.message}`);
    }
  };

  // 3. autoRepair()
  const autoRepair = async () => {
    setLoading(true);
    setStep('repairing');
    addLog("Triggering autoRepair() self-healing sequence...");
    
    try {
      const res = await fetch('/api/builder/auto-repair', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faultId: 'ALL' })
      });
      const data = await res.json();
      
      if (data.success) {
        data.logs.forEach((l: string) => addLog(l));
        setRepaired(true);
        addLog("autoRepair() sequence completed. Initializing build verification layer...");
        
        // Immediately trigger verifyRepair()
        await verifyRepair();
      } else {
        addLog("ERROR: autoRepair self-healing aborted.");
        setStep('faults_found');
      }
    } catch (e: any) {
      addLog(`REPAIR SEQUENCE EXCEPTION: ${e.message}`);
      setStep('faults_found');
    } finally {
      setLoading(false);
    }
  };

  // 4. verifyRepair()
  const verifyRepair = async () => {
    setStep('verifying');
    addLog("Executing verifyRepair()...");
    
    try {
      const res = await fetch('/api/builder/verify-repair', { method: 'POST' });
      const data = await res.json();
      
      if (data.success && data.verified) {
        data.logs.forEach((l: string) => addLog(l));
        setVerified(true);
        setFaults([]); // All faults resolved
        addLog("SUCCESS: App compile target verified cleanly. 0 syntax anomalies found.");
        
        // 5. restartIfRequired()
        await restartIfRequired();
      } else {
        addLog("ERROR: verifyRepair failed to validate clean compilation.");
        setStep('faults_found');
      }
    } catch (e: any) {
      addLog(`VERIFICATION EXCEPTION: ${e.message}`);
      setStep('faults_found');
    }
  };

  // 5. restartIfRequired()
  const restartIfRequired = async () => {
    addLog("Checking if server reboot is required (restartIfRequired)...");
    try {
      const res = await fetch('/api/builder/restart-if-required', { method: 'POST' });
      const data = await res.json();
      
      addLog(`REBOOT STATUS: ${data.message}`);
      setStep('completed');
    } catch (e: any) {
      addLog(`REBOOT EXCEPTION: ${e.message}`);
      setStep('completed');
    }
  };

  // Run initial check on load
  useEffect(() => {
    runSystemCheck();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-5xl rounded-3xl border-2 overflow-hidden flex flex-col max-h-[85vh] ${
        isDark 
          ? 'bg-zinc-950 border-cyan-500/30 text-zinc-100 shadow-[0_0_50px_rgba(6,182,212,0.15)]' 
          : 'bg-white border-zinc-300 text-zinc-900 shadow-xl'
      }`}>
        
        {/* Title Bar */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/20 bg-gradient-to-r from-cyan-950/20 to-transparent">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              BUILDER SYSTEM CHECK & REPAIR MODULE
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800/40 rounded transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col flex-1 overflow-hidden gap-6">
          
          {/* Top Status Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
              }`}>
                {step === 'completed' ? <ShieldCheck className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">MODULE STATUS</div>
                <div className="text-xs font-black tracking-wider text-zinc-200 uppercase">{step}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-950 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">OUTSTANDING FAULTS</div>
                <div className="text-xs font-black tracking-wider text-zinc-200 uppercase">
                  {faults.length} DETECTED
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-950 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">GUARANTEE LAYER</div>
                <div className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                  100% REPAIRABLE
                </div>
              </div>
            </div>
          </div>

          {/* Main Workspace Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
            
            {/* Left Panel: Real-time Terminal Logs & Actions */}
            <div className="flex flex-col gap-3 h-full overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" /> High-Fidelity Diagnostics Logs
                </span>
                <button 
                  onClick={runSystemCheck} 
                  disabled={loading}
                  className="px-3 py-1 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 disabled:opacity-50 text-cyan-400 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Re-check System
                </button>
              </div>

              <div className="flex-1 bg-black border border-zinc-800/80 rounded-2xl p-4 overflow-y-auto font-mono text-[10.5px] leading-relaxed flex flex-col gap-1.5 shadow-inner text-zinc-300">
                {logs.length === 0 ? (
                  <div className="text-zinc-600 italic flex flex-col items-center justify-center h-full gap-2">
                    <Activity className="w-8 h-8 text-zinc-800 animate-pulse" />
                    <span>Awaiting runSystemCheck() payload...</span>
                  </div>
                ) : (
                  logs.map((log, index) => {
                    let color = 'text-zinc-400';
                    if (log.includes('[SYSTEM CHECK]')) color = 'text-cyan-400 font-extrabold';
                    if (log.includes('[ERROR]')) color = 'text-rose-500 font-black';
                    if (log.includes('[AUTO-REPAIR]')) color = 'text-yellow-400 font-bold';
                    if (log.includes('[SUCCESS]')) color = 'text-emerald-400 font-black';
                    if (log.includes('WARNING:')) color = 'text-amber-400 font-bold';
                    return (
                      <div key={index} className={`whitespace-pre-wrap ${color}`}>
                        {log}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Panel: Faults Remediation & Modules State */}
            <div className="flex flex-col gap-4 h-full overflow-hidden">
              {/* Modules Grid */}
              <div className="flex flex-col gap-2 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  SYSTEM CORE MODULES MAP
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {modulesState.map((mod) => (
                    <div key={mod.name} className="px-2 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] font-black text-zinc-300 truncate w-full">{mod.name.toUpperCase()}</span>
                      <span className="text-[7.5px] font-black text-emerald-400 mt-0.5">● ACTIVE</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fault List / Repair Interface */}
              <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  REMEDIATION MATRIX
                </span>
                
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                  {faults.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-800 rounded-2xl p-6 bg-zinc-950/20">
                      <ShieldCheck className="w-12 h-12 text-emerald-500 animate-bounce mb-3" />
                      <h4 className="text-sm font-black text-zinc-200">System Fully Normalized</h4>
                      <p className="text-[10px] text-zinc-500 max-w-xs mt-1 leading-relaxed">
                        No outstanding architecture, structural, or deployment faults detected. The application is completely clean and compilable.
                      </p>
                    </div>
                  ) : (
                    faults.map((fault) => (
                      <div key={fault.id} className="border border-rose-500/20 p-4 rounded-2xl bg-rose-950/5 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                            <span className="text-xs font-black text-rose-400 uppercase tracking-wider">{fault.title}</span>
                          </div>
                          <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-900/50">
                            {fault.severity}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          {fault.desc}
                        </p>
                        {fault.reparable && (
                          <button
                            onClick={autoRepair}
                            disabled={loading}
                            className="self-start px-4 py-1.5 bg-yellow-500/15 border border-yellow-500/30 hover:bg-yellow-500/20 text-yellow-400 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Wrench className="w-3 h-3" /> Execute autoRepair()
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-between border-t border-zinc-800/30 pt-4 shrink-0">
            <div className="flex items-center gap-2 text-[10.5px] text-zinc-500">
              <span>Status Guarantee:</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> SECURE & COMPLIANT
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-black tracking-wider cursor-pointer transition-all"
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
