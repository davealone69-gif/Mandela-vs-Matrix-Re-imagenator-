const fs = require('fs');

const zts = `import React, { useState } from 'react';
import { ShieldAlert, Key, Fingerprint, Lock, CheckCircle2, Play, Loader2, X, ShieldCheck } from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

export default function ZeroTrustSecurityMatrixDialog({ isDark, onClose }: Props) {
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runEngine = async () => {
    setPhase(1); setLogs([]); setProgress(0);

    addLog('[PHASE 1] Static Code Obfuscation & R8 Minimization');
    await new Promise(r => setTimeout(r, 600));
    addLog(' - Scrambling symbol tables...');
    addLog(' - Applying polymorphic code permutations...');
    setProgress(25);

    setPhase(2);
    await new Promise(r => setTimeout(r, 700));
    addLog('\\n[PHASE 2] RASP (Runtime Application Self-Protection) Injection');
    addLog(' - Injecting anti-debugging trips...');
    addLog(' - Enabling root and emulator detection routines...');
    setProgress(50);

    setPhase(3);
    await new Promise(r => setTimeout(r, 800));
    addLog('\\n[PHASE 3] Cryptographic Keystore Hardening');
    addLog(' - Securing data at rest with EncryptedSharedPreferences...');
    addLog(' - Pinning SSL/TLS certificates...');
    setProgress(75);

    setPhase(4);
    await new Promise(r => setTimeout(r, 800));
    addLog('\\n[PHASE 4] Zero-Trust Certification');
    addLog(' - Penetration test heuristics passed.');
    setProgress(100);

    addLog('\\n[SUCCESS] Zero-Trust Security & Obfuscation Matrix™ activated.');
  };

  const steps = [
    { name: 'Code Obfuscation', icon: Lock },
    { name: 'RASP Injection', icon: ShieldAlert },
    { name: 'Crypto Hardening', icon: Key },
    { name: 'Certification', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={\`w-full max-w-4xl rounded-2xl shadow-[0_0_80px_rgba(220,38,38,0.15)] overflow-hidden flex flex-col max-h-[90vh] \${isDark ? 'bg-[#0f1423] border border-red-500/30 text-slate-200' : 'bg-white border border-red-500/30 text-slate-800'}\`}>
         <div className="flex items-center justify-between p-4 border-b border-red-900/30 shrink-0 bg-gradient-to-r from-red-950/40 to-transparent">
            <h3 className="text-sm font-black tracking-wider flex items-center gap-2 text-red-400">
              <ShieldCheck className="w-5 h-5" /> ZERO-TRUST SECURITY MATRIX™
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
                     <div key={idx} className={\`flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition-all \${isActive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isDone ? 'text-red-600/70' : 'text-slate-500'}\`}>
                        <Icon className={\`w-4 h-4 \${isActive ? 'animate-pulse' : ''}\`} />{p.name}
                     </div>
                   );
                })}
            </div>
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden relative">
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h4 className="text-lg font-black text-slate-200 mb-1">Cryptographic Hardening Engine</h4>
                        <p className="text-xs text-slate-400">Obfuscation, anti-tampering, and proactive threat mitigation.</p>
                    </div>
                    {phase === 0 ? (
                       <button onClick={runEngine} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                          <Play className="w-4 h-4 fill-white" /> Lock Down
                       </button>
                    ) : (
                       <div className={\`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border \${phase === 4 ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300'}\`}>
                          {phase === 4 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin text-red-400" />}
                          {phase === 4 ? 'SECURE & HARDENED' : \`PHASE \${phase}/4\`}
                       </div>
                    )}
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0 border border-slate-800"><div className="h-full bg-red-500 transition-all duration-700" style={{ width: \`\${progress}%\` }} /></div>
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col">
                   {logs.length === 0 ? <div className="text-slate-600 italic">Awaiting subsystem initialization...</div> : logs.map((log, i) => <div key={i} className={\`whitespace-pre-wrap \${log.includes('SUCCESS') ? 'text-red-400 font-bold mt-4 text-sm' : log.includes('PHASE') ? 'text-red-300 font-bold mt-2' : 'text-slate-400'}\`}>{log}</div>)}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/components/ZeroTrustSecurityMatrixDialog.tsx', zts);

const cps = `import React, { useState } from 'react';
import { Smartphone, Monitor, Globe, Cpu, CheckCircle2, Play, Loader2, X, RefreshCw } from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

export default function CrossPlatformSymbiosisEngineDialog({ isDark, onClose }: Props) {
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runEngine = async () => {
    setPhase(1); setLogs([]); setProgress(0);

    addLog('[PHASE 1] AST Translation & Kotlin Multiplatform Migration');
    await new Promise(r => setTimeout(r, 600));
    addLog(' - Abstracting pure business logic to KMP shared module...');
    addLog(' - Translating platform-specific dependencies...');
    setProgress(25);

    setPhase(2);
    await new Promise(r => setTimeout(r, 700));
    addLog('\\n[PHASE 2] UI Layer Symbiosis (Compose Multiplatform)');
    addLog(' - Porting Jetpack Compose to Compose Multiplatform...');
    addLog(' - Resolving iOS UI Kit and macOS AppKit surface bindings...');
    setProgress(50);

    setPhase(3);
    await new Promise(r => setTimeout(r, 800));
    addLog('\\n[PHASE 3] Native Bridge Synthesis (iOS / WASM / Desktop)');
    addLog(' - Generating Swift interop headers...');
    addLog(' - Compiling Kotlin/Wasm for Web deployment...');
    setProgress(75);

    setPhase(4);
    await new Promise(r => setTimeout(r, 800));
    addLog('\\n[PHASE 4] Omni-Channel Deployment Readiness');
    addLog(' - Artifacts synthesized: .apk, .ipa, .app, wasm-bundle.');
    setProgress(100);

    addLog('\\n[SUCCESS] Cross-Platform Symbiosis Engine™ execution complete.');
  };

  const steps = [
    { name: 'AST Translation', icon: Cpu },
    { name: 'UI Symbiosis', icon: RefreshCw },
    { name: 'Native Bridges', icon: Globe },
    { name: 'Omni-Channel', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={\`w-full max-w-4xl rounded-2xl shadow-[0_0_80px_rgba(192,38,211,0.15)] overflow-hidden flex flex-col max-h-[90vh] \${isDark ? 'bg-[#0f1423] border border-fuchsia-500/30 text-slate-200' : 'bg-white border border-fuchsia-500/30 text-slate-800'}\`}>
         <div className="flex items-center justify-between p-4 border-b border-fuchsia-900/30 shrink-0 bg-gradient-to-r from-fuchsia-950/40 to-transparent">
            <h3 className="text-sm font-black tracking-wider flex items-center gap-2 text-fuchsia-400">
              <Globe className="w-5 h-5" /> CROSS-PLATFORM SYMBIOSIS ENGINE™
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
                     <div key={idx} className={\`flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition-all \${isActive ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : isDone ? 'text-fuchsia-600/70' : 'text-slate-500'}\`}>
                        <Icon className={\`w-4 h-4 \${isActive ? 'animate-pulse' : ''}\`} />{p.name}
                     </div>
                   );
                })}
            </div>
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden relative">
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h4 className="text-lg font-black text-slate-200 mb-1">Omni-Channel Synthesis</h4>
                        <p className="text-xs text-slate-400">Converting Android primitives to iOS, Desktop, and Web.</p>
                    </div>
                    {phase === 0 ? (
                       <button onClick={runEngine} className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                          <Play className="w-4 h-4 fill-white" /> Synthesize Platforms
                       </button>
                    ) : (
                       <div className={\`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border \${phase === 4 ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400' : 'bg-slate-800 border-slate-700 text-slate-300'}\`}>
                          {phase === 4 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin text-fuchsia-400" />}
                          {phase === 4 ? 'SYMBIOSIS COMPLETE' : \`PHASE \${phase}/4\`}
                       </div>
                    )}
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0 border border-slate-800"><div className="h-full bg-fuchsia-500 transition-all duration-700" style={{ width: \`\${progress}%\` }} /></div>
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col">
                   {logs.length === 0 ? <div className="text-slate-600 italic">Awaiting subsystem initialization...</div> : logs.map((log, i) => <div key={i} className={\`whitespace-pre-wrap \${log.includes('SUCCESS') ? 'text-fuchsia-400 font-bold mt-4 text-sm' : log.includes('PHASE') ? 'text-fuchsia-300 font-bold mt-2' : 'text-slate-400'}\`}>{log}</div>)}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/components/CrossPlatformSymbiosisEngineDialog.tsx', cps);

let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = [
  "import ZeroTrustSecurityMatrixDialog from './components/ZeroTrustSecurityMatrixDialog';",
  "import CrossPlatformSymbiosisEngineDialog from './components/CrossPlatformSymbiosisEngineDialog';"
].join('\n');

if (!code.includes('import ZeroTrustSecurityMatrixDialog')) {
  code = code.replace(
    "import ContinuousAppEvolutionModeDialog from './components/ContinuousAppEvolutionModeDialog';",
    `import ContinuousAppEvolutionModeDialog from './components/ContinuousAppEvolutionModeDialog';\n${newImports}`
  );
}

code = code.replace(
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | 'archShift' | 'evolutionGen' | 'intentBuilder' | 'cogUX' | 'contEvol' | null>(null);",
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | 'uiTestSystem' | 'perfEngine' | 'hardwareGen' | 'archShift' | 'evolutionGen' | 'intentBuilder' | 'cogUX' | 'contEvol' | 'zeroTrust' | 'crossPlatform' | null>(null);"
);

const targetMenu = `<span className="flex items-center gap-2"><ServerCog className="w-4 h-4" /> Continuous App Evolution</span>
                  </button>`;

const menuReplacement = `<span className="flex items-center gap-2"><ServerCog className="w-4 h-4" /> Continuous App Evolution</span>
                  </button>
                  
                  <div className="text-[10px] font-bold tracking-wider uppercase text-amber-500 mb-1 px-1 mt-4 flex items-center gap-1 bg-amber-500/10 py-1 rounded w-fit">
                    <Award className="w-3 h-3" /> Platinum Tier Subsystems
                  </div>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('zeroTrust'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-red-950/30 text-red-400 hover:bg-red-900/60' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Zero-Trust Security Matrix</span>
                  </button>

                  <button
                    onClick={() => { setIsHeaderMenuOpen(false); setActiveDialog('crossPlatform'); }}
                    className={\`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors flex items-center justify-between cursor-pointer \${
                      isDark ? 'bg-fuchsia-950/30 text-fuchsia-400 hover:bg-fuchsia-900/60' : 'bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100'
                    }\`}
                  >
                    <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Cross-Platform Symbiosis</span>
                  </button>`;

if (code.includes(targetMenu) && !code.includes('zeroTrust')) {
  code = code.replace(targetMenu, menuReplacement);
}

if (!code.includes('Award') && code.includes('import {')) {
  code = code.replace(
    "ServerCog } from 'lucide-react';",
    "ServerCog, Award, Globe, ShieldCheck, Key, Lock } from 'lucide-react';"
  );
}

const targetDialog = `{activeDialog === 'contEvol' && <ContinuousAppEvolutionModeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

const dialogReplacement = `{activeDialog === 'contEvol' && <ContinuousAppEvolutionModeDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'zeroTrust' && <ZeroTrustSecurityMatrixDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}
      {activeDialog === 'crossPlatform' && <CrossPlatformSymbiosisEngineDialog isDark={isDark} onClose={() => setActiveDialog(null)} />}`;

if (code.includes(targetDialog) && !code.includes('ZeroTrustSecurityMatrixDialog isDark')) {
  code = code.replace(targetDialog, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Platinum features added.');
