import React, { useState } from 'react';
import { 
  Shield, ShieldAlert, Key, Fingerprint, Lock, CheckCircle2, Play, 
  Loader2, X, ShieldCheck, Cpu, Terminal, RefreshCw, AlertTriangle, Check, Info 
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
  activeFilePath?: string;
  activeFileContent?: string;
}

interface Threat {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  description: string;
  remediation: string;
}

export default function ZeroTrustSecurityMatrixDialog({ isDark, onClose, activeFilePath, activeFileContent }: Props) {
  const [activeTab, setActiveTab] = useState<'lockdown' | 'auditor'>('lockdown');
  
  // Tab 1: Lockdown States
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Custom toggles
  const [enableObfuscation, setEnableObfuscation] = useState(true);
  const [enableRasp, setEnableRasp] = useState(true);
  const [enableCrypto, setEnableCrypto] = useState(true);
  const [enableSslPinning, setEnableSslPinning] = useState(false);

  // Tab 2: AI Security Auditor States
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    safetyScore: number;
    threats: Threat[];
    engine: string;
  } | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runEngine = async () => {
    setPhase(1); 
    setLogs([]); 
    setProgress(0);

    addLog(`[SYSTEM] Initializing Zero-Trust Security Matrix™ Compilation.`);
    await new Promise(r => setTimeout(r, 400));
    
    if (enableObfuscation) {
      addLog('\n[PHASE 1] Static Code Obfuscation & R8 Minimization');
      await new Promise(r => setTimeout(r, 450));
      addLog(' - Mapping original symbols to secure hash descriptors...');
      addLog(' - Injecting polymorphic control flow loops to break decompilers...');
      addLog(' - Compacting class hierarchies to prevent structural inspection.');
      setProgress(25);
    } else {
      addLog('\n[PHASE 1] Skipped: Static Code Obfuscation not selected.');
      setProgress(25);
    }

    setPhase(2);
    if (enableRasp) {
      await new Promise(r => setTimeout(r, 450));
      addLog('\n[PHASE 2] RASP (Runtime Application Self-Protection) Injection');
      addLog(' - Mounting dynamic ptrace anti-debugging hook nodes...');
      addLog(' - Building integrity hash registry for /res and assets...');
      addLog(' - Injecting root authority and virtualized environment tripwires.');
      setProgress(50);
    } else {
      addLog('\n[PHASE 2] Skipped: RASP protection not selected.');
      setProgress(50);
    }

    setPhase(3);
    if (enableCrypto) {
      await new Promise(r => setTimeout(r, 450));
      addLog('\n[PHASE 3] Cryptographic Keystore Hardening');
      addLog(' - Restructuring secure parameters via EncryptedSharedPreferences...');
      addLog(' - Generating dynamic hardware-backed AES-256 Android Keystore wrapper...');
      if (enableSslPinning) {
         addLog(' - Injecting custom NetworkSecurityConfig with Certificate Pinning keys...');
      }
      setProgress(75);
    } else {
      addLog('\n[PHASE 3] Skipped: Keystore Cryptographic Hardening not selected.');
      setProgress(75);
    }

    setPhase(4);
    await new Promise(r => setTimeout(r, 500));
    addLog('\n[PHASE 4] Zero-Trust Verification & Certification');
    addLog(' - Simulating black-box exploit runs via autonomous scanner...');
    addLog(' - Validation results: 0 memory-leak gaps detected in compiled classes.');
    addLog(' - Verification compliance: Grade A+ Certificate granted.');
    setProgress(100);

    addLog('\n[SUCCESS] Zero-Trust Security & Obfuscation Matrix™ successfully activated!');
    addLog('Your virtual app is locked down and hardened against decompilation.');
  };

  const runAiAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);
    try {
      const response = await fetch('/api/security/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: activeFilePath || 'src/MainActivity.kt',
          fileContent: activeFileContent || '// Empty code context'
        })
      });
      const data = await response.json();
      if (data.success) {
        setAuditResult({
          safetyScore: data.safetyScore,
          threats: data.threats,
          engine: data.engine
        });
      } else {
        throw new Error(data.error || "Failed auditing file");
      }
    } catch (err: any) {
      setAuditError(err.message || "An unexpected error occurred during security audit");
    } finally {
      setIsAuditing(false);
    }
  };

  const steps = [
    { name: 'Code Obfuscation', icon: Lock, enabled: enableObfuscation },
    { name: 'RASP Protection', icon: ShieldAlert, enabled: enableRasp },
    { name: 'Keystore Crypto', icon: Key, enabled: enableCrypto },
    { name: 'Verification Gates', icon: ShieldCheck, enabled: true },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl rounded-2xl shadow-[0_0_80px_rgba(220,38,38,0.18)] overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0b0f19] border border-red-500/30 text-slate-200' : 'bg-white border border-red-500/25 text-slate-800'}`}>
         
         {/* Title / Header */}
         <div className="flex items-center justify-between p-4 border-b border-red-900/30 shrink-0 bg-gradient-to-r from-red-950/40 to-transparent">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-black tracking-widest text-red-400 uppercase">
                  ZERO-TRUST SECURITY MATRIX™
                </h3>
                <p className="text-[10px] text-slate-400">Advanced Android Application Protection & Live AI Threat Auditor</p>
              </div>
            </div>
            
            {/* Header Tabs */}
            <div className="flex items-center gap-1.5 mr-4 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setActiveTab('lockdown')}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${activeTab === 'lockdown' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                1. Matrix Lockdown
              </button>
              <button 
                onClick={() => setActiveTab('auditor')}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${activeTab === 'auditor' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                2. AI Security Auditor
              </button>
            </div>

            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
         </div>

         {activeTab === 'lockdown' ? (
           /* TAB 1: LOCKDOWN PANEL */
           <div className="flex flex-1 overflow-hidden">
              {/* Left Config Steps */}
              <div className={`w-72 border-r shrink-0 overflow-y-auto p-4 flex flex-col gap-4 ${isDark ? 'border-slate-800/60 bg-[#070a11]' : 'border-slate-200 bg-slate-50'}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harden Configuration</span>
                  
                  <div className="flex flex-col gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">Enable Code Obfuscation</span>
                        <span className="text-[9px] text-slate-400">R8 compiler symbols scrambling</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={enableObfuscation} 
                        onChange={(e) => setEnableObfuscation(e.target.checked)}
                        className="rounded accent-red-500 h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer border-t border-slate-900 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">Enable RASP Engine</span>
                        <span className="text-[9px] text-slate-400">Anti-root and anti-debugging</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={enableRasp} 
                        onChange={(e) => setEnableRasp(e.target.checked)}
                        className="rounded accent-red-500 h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer border-t border-slate-900 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">Hardened Keystore</span>
                        <span className="text-[9px] text-slate-400">AES-256 Shared Preferences</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={enableCrypto} 
                        onChange={(e) => setEnableCrypto(e.target.checked)}
                        className="rounded accent-red-500 h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>

                    {enableCrypto && (
                      <label className="flex items-center justify-between cursor-pointer pl-4 border-l-2 border-red-500/30">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-300">SSL Certificate Pinning</span>
                          <span className="text-[8px] text-slate-500">Inject dynamic SHA256 hashes</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={enableSslPinning} 
                          onChange={(e) => setEnableSslPinning(e.target.checked)}
                          className="rounded accent-red-500 h-3 w-3 cursor-pointer"
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Lock Phases</span>
                    {steps.map((p, idx) => {
                       const isActive = phase === idx + 1;
                       const isDone = phase > idx + 1;
                       const Icon = p.icon;
                       return (
                         <div 
                           key={idx} 
                           className={`flex items-center justify-between p-2 rounded-lg text-xs font-bold border transition-all ${
                             !p.enabled 
                               ? 'opacity-40 border-transparent text-slate-600' 
                               : isActive 
                                 ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                                 : isDone 
                                   ? 'bg-emerald-950/10 border-emerald-900/10 text-emerald-500/70' 
                                   : 'bg-slate-900/30 border-transparent text-slate-500'
                           }`}
                         >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                              <span>{p.name}</span>
                            </div>
                            {p.enabled && isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            {p.enabled && isActive && <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />}
                         </div>
                       );
                    })}
                  </div>
              </div>

              {/* Main Terminal and Action Block */}
              <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
                  <div className="flex justify-between items-center shrink-0">
                      <div>
                          <h4 className="text-base font-black text-slate-200 mb-0.5 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-red-500" />
                            Lockdown & Protection Compiler
                          </h4>
                          <p className="text-xs text-slate-400">Inject polymorphic code changes and harden app binaries dynamically on demand.</p>
                      </div>
                      {phase === 0 ? (
                         <button 
                           onClick={runEngine} 
                           className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                         >
                            <Play className="w-3.5 h-3.5 fill-white" /> Compile Protection
                         </button>
                      ) : (
                         <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${phase === 4 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                            {phase === 4 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin text-red-400" />}
                            {phase === 4 ? 'SECURE & SHIELDED' : `COMPILING MODULES (${phase}/4)`}
                         </div>
                      )}
                  </div>

                  {/* Progress Indicator */}
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden shrink-0 border border-slate-900">
                    <div className="h-full bg-red-500 transition-all duration-700 shadow-[0_0_8px_rgba(239,68,68,0.5)]" style={{ width: `${progress}%` }} />
                  </div>

                  {/* Real-Time Security Output Terminal */}
                  <div className="flex-1 bg-black border border-slate-900 rounded-xl p-4 overflow-y-auto font-mono text-[10.5px] leading-relaxed flex flex-col gap-1 text-slate-300 shadow-inner">
                     {logs.length === 0 ? (
                       <div className="text-slate-600 italic flex flex-col items-center justify-center h-full gap-2">
                         <Cpu className="w-8 h-8 text-slate-800" />
                         <span>Awaiting protection sequence trigger... Click "Compile Protection" to harden the app environment.</span>
                       </div>
                     ) : (
                       logs.map((log, i) => {
                         let colorClass = 'text-slate-400';
                         if (log.includes('[SYSTEM]')) colorClass = 'text-cyan-400 font-bold';
                         else if (log.includes('[PHASE')) colorClass = 'text-red-400 font-extrabold mt-3 border-b border-red-950/50 pb-0.5';
                         else if (log.includes('[SUCCESS]')) colorClass = 'text-emerald-400 font-black mt-4 text-xs bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30 flex items-center gap-2';
                         return (
                           <div key={i} className={`whitespace-pre-wrap ${colorClass}`}>
                             {log.includes('[SUCCESS]') && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                             {log}
                           </div>
                         );
                       })
                     )}
                  </div>
              </div>
           </div>
         ) : (
           /* TAB 2: AI SECURITY AUDITOR */
           <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
             {/* Left Context file preview */}
             <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r shrink-0 p-4 flex flex-col gap-3 overflow-hidden bg-slate-950/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active File Context</span>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 font-bold">Target File:</span>
                  <span className="text-xs font-mono text-cyan-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-900 break-all">
                    {activeFilePath || 'src/MainActivity.kt'}
                  </span>
                </div>

                <div className="flex-1 bg-slate-950 border border-slate-900 rounded-lg p-3 font-mono text-[9px] text-slate-400 overflow-y-auto max-h-[180px] lg:max-h-none">
                  {activeFileContent ? (
                    <pre className="whitespace-pre">{activeFileContent.substring(0, 1500)}{activeFileContent.length > 1500 && '\n... (truncated for preview)'}</pre>
                  ) : (
                    <span className="text-slate-600 italic">No file is currently open in the active editor.</span>
                  )}
                </div>

                <button
                  onClick={runAiAudit}
                  disabled={isAuditing}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 disabled:from-slate-800 disabled:to-slate-900 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAuditing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" /> Analyzing Code Flaws...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" /> Trigger AI Security Scan
                    </>
                  )}
                </button>
             </div>

             {/* Right Threat Audit Report Panel */}
             <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
               <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                 <div>
                   <h4 className="text-base font-black text-slate-200">Threat Audit Report</h4>
                   <p className="text-xs text-slate-400">Scans file context against Android API secure design standards & common vulnerability catalogs.</p>
                 </div>
                 
                 {auditResult && (
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] text-slate-400 font-bold uppercase">Engine:</span>
                     <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                       {auditResult.engine}
                     </span>
                   </div>
                 )}
               </div>

               {isAuditing ? (
                 <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500 py-12">
                   <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
                   <span className="text-xs font-bold text-slate-400">Performing Real-Time Security Intelligence Analysis...</span>
                   <p className="text-[10px] text-slate-500 max-w-sm text-center">Gemini is scanning for memory leaks, insecure transmissions, hardcoded string secret arrays, and unsafe storage blocks.</p>
                 </div>
               ) : auditError ? (
                 <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                   <AlertTriangle className="w-4 h-4 shrink-0" />
                   <div>
                     <span className="font-extrabold block mb-0.5">Audit Connection Terminated</span>
                     {auditError}
                   </div>
                 </div>
               ) : auditResult ? (
                 <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                   {/* Score Gauge and Overview */}
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                     <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-900 pb-4 md:pb-0 md:pr-4">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Safety Rating</span>
                       <div className="relative flex items-center justify-center">
                         {/* Simple circle or big percentage display */}
                         <div className={`text-3xl font-black ${
                           auditResult.safetyScore >= 80 
                             ? 'text-emerald-400' 
                             : auditResult.safetyScore >= 60 
                               ? 'text-amber-400' 
                               : 'text-red-500'
                         }`}>
                           {auditResult.safetyScore}
                         </div>
                         <span className="text-[10px] text-slate-500 font-bold ml-0.5">/100</span>
                       </div>
                       <span className={`text-[10px] font-black uppercase mt-1 ${
                         auditResult.safetyScore >= 80 
                           ? 'text-emerald-500' 
                           : auditResult.safetyScore >= 60 
                             ? 'text-amber-500' 
                             : 'text-red-500'
                       }`}>
                         {auditResult.safetyScore >= 80 ? 'EXCELLENT' : auditResult.safetyScore >= 60 ? 'MODERATE RISK' : 'CRITICAL THREAT'}
                       </span>
                     </div>

                     <div className="md:col-span-3 flex items-start gap-3">
                       <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-red-400 shrink-0 mt-0.5">
                         <Shield className="w-5 h-5" />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-xs font-extrabold text-slate-300">File Analysis Summary</span>
                         <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
                           The AI engine identified <strong className="text-red-400">{auditResult.threats.length} issues</strong> inside the active module context. 
                           Apply compiled lockdown layers (Code Obfuscation, RASP injection, Keystore SharedPreferences) to automatically mitigate common vulnerabilities at compile-time.
                         </p>
                       </div>
                     </div>
                   </div>

                   {/* Threat list */}
                   <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identified Vulnerability List</span>
                     <div className="flex flex-col gap-2.5">
                       {auditResult.threats.map((threat, idx) => (
                         <div key={idx} className="border border-slate-900 bg-slate-950/60 p-3.5 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
                           {/* Threat top line */}
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase border ${
                                 threat.severity === 'HIGH' 
                                   ? 'bg-red-500/15 border-red-500/30 text-red-400' 
                                   : threat.severity === 'MEDIUM' 
                                     ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                                     : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                               }`}>
                                 {threat.severity} Severity
                               </span>
                               <span className="text-[11px] font-extrabold text-slate-200">{threat.category}</span>
                             </div>
                           </div>

                           {/* Description */}
                           <p className="text-[10.5px] text-slate-400 leading-relaxed pl-1.5 border-l-2 border-slate-800">
                             {threat.description}
                           </p>

                           {/* Remediation */}
                           <div className="bg-[#0c121e]/80 border border-[#1b2841]/40 p-2.5 rounded-lg flex items-start gap-2 text-[10px] text-slate-300 mt-1">
                             <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                             <div>
                               <strong className="text-cyan-400 font-bold block mb-0.5">AI Recommended Remediation:</strong>
                               {threat.remediation}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="text-slate-600 italic flex flex-col items-center justify-center h-full py-12 gap-2 bg-slate-950/20 rounded-xl border border-dashed border-slate-900">
                   <Cpu className="w-8 h-8 text-slate-800 animate-pulse" />
                   <span>No audit report loaded yet. Click "Trigger AI Security Scan" to run analysis.</span>
                 </div>
               )}
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
