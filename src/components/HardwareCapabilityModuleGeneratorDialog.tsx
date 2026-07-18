import React, { useState } from 'react';
import { Cpu, SmartphoneNfc, Fingerprint, MapPin, Camera, Bluetooth, ShieldCheck, Zap, Server, Settings2, Play, Loader2, X, CheckCircle2 } from 'lucide-react';

interface HardwareCapabilityModuleGeneratorDialogProps {
  isDark: boolean;
  onClose: () => void;
}

export default function HardwareCapabilityModuleGeneratorDialog({ isDark, onClose }: HardwareCapabilityModuleGeneratorDialogProps) {
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  const runGenerator = async () => {
    setPhase(1);
    setLogs([]);
    setProgress(0);

    // Phase 1: Hardware Capability Discovery Layer
    addLog('[PHASE 1] Hardware Capability Discovery Layer');
    await new Promise(r => setTimeout(r, 600));
    addLog(' - Enumerating Android hardware APIs...');
    addLog(' - Camera2, Bluetooth, NFC, GPS, Biometric, Sensors detected.');
    addLog(' - Mapping capabilities to required permissions.');
    setProgress(10);

    // Phase 2: Module Synthesis Engine
    setPhase(2);
    await new Promise(r => setTimeout(r, 700));
    addLog('\n[PHASE 2] Module Synthesis Engine');
    addLog(' - Generating isolated hardware modules: camera/, bluetooth/, location/, sensors/, biometrics/');
    addLog(' - Synthesizing Kotlin-based API wrappers and Hilt service layers.');
    setProgress(20);

    // Phase 3: Permission & Manifest Orchestration
    setPhase(3);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 3] Permission & Manifest Orchestration');
    addLog(' - Injecting manifest entries (CAMERA, ACCESS_FINE_LOCATION, BLUETOOTH_CONNECT).');
    addLog(' - Generating runtime permission request flows.');
    addLog(' - Aligning capabilities with minSdk constraints.');
    setProgress(30);

    // Phase 4: Hardware Interaction Contract Modeling
    setPhase(4);
    await new Promise(r => setTimeout(r, 700));
    addLog('\n[PHASE 4] Hardware Interaction Contract Modeling');
    addLog(' - Defining interaction contracts for Camera, Bluetooth, NFC, Location.');
    addLog(' - Establishing deterministic, testable specifications.');
    setProgress(40);

    // Phase 5: Capability Abstraction Layer
    setPhase(5);
    await new Promise(r => setTimeout(r, 900));
    addLog('\n[PHASE 5] Capability Abstraction Layer');
    addLog(' - Wrapping low-level APIs behind Repository interfaces.');
    addLog(' - Exposing ViewModel-safe event channels (Flow).');
    addLog(' - Normalizing OEM fragmentation.');
    setProgress(50);

    // Phase 6: Autonomous Error & Edge Case Handling
    setPhase(6);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 6] Autonomous Error & Edge Case Handling');
    addLog(' - Synthesizing fallback strategies for hardware unavailability.');
    addLog(' - Generating graceful degradation paths for sensor precision variance.');
    setProgress(60);

    // Phase 7: Integration with UI & Navigation Systems
    setPhase(7);
    await new Promise(r => setTimeout(r, 1000));
    addLog('\n[PHASE 7] Integration with UI & Navigation Systems');
    addLog(' - Producing UI scaffolds: Camera preview, Bluetooth lists, Maps.');
    addLog(' - Injecting navigation routes and ViewModel bindings.');
    setProgress(70);

    // Phase 8: Hardware Test Suite Generator
    setPhase(8);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 8] Hardware Test Suite Generator');
    addLog(' - Generating mock sensor feeds and fake location providers.');
    addLog(' - Connecting with Automated UI Test System™.');
    setProgress(80);

    // Phase 9: Performance & Power Optimization Layer
    setPhase(9);
    await new Promise(r => setTimeout(r, 900));
    addLog('\n[PHASE 9] Performance & Power Optimization Layer');
    addLog(' - Profiling sensor sampling rates and GPS power consumption.');
    addLog(' - Synthesizing battery impact optimization patches.');
    setProgress(90);

    // Phase 10: Final Capability Certification
    setPhase(10);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 10] Final Capability Certification');
    addLog(' - Hardware Capability Ledger: COMPILED.');
    addLog(' - Device Feature Compatibility Matrix: VERIFIED.');
    setProgress(100);

    addLog('\n[SUCCESS] Hardware Capability Module Generator™ completed.');
  };

  const steps = [
    { name: 'Discovery Layer', icon: Cpu },
    { name: 'Module Synthesis', icon: Server },
    { name: 'Permission Manifest', icon: ShieldCheck },
    { name: 'Contract Modeling', icon: Fingerprint },
    { name: 'Abstraction Layer', icon: Settings2 },
    { name: 'Error Handling', icon: Zap },
    { name: 'UI Integration', icon: SmartphoneNfc },
    { name: 'Test Generator', icon: CheckCircle2 },
    { name: 'Power Optimization', icon: Zap },
    { name: 'Certification', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-4xl rounded-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0f1423] border border-blue-500/30 text-slate-200' : 'bg-white border border-blue-500/30 text-slate-800'}`}>
         
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-blue-900/30 shrink-0 bg-gradient-to-r from-blue-950/40 to-transparent">
            <h3 className="text-sm font-black tracking-wider flex items-center gap-2 text-blue-400">
              <Cpu className="w-5 h-5" /> HARDWARE CAPABILITY MODULE GENERATOR™
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
                     <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg text-[11px] font-bold transition-all ${isActive ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : isDone ? 'text-blue-600/70' : 'text-slate-500'}`}>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
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
                        <h4 className="text-lg font-black text-slate-200 mb-1">Hardware Integration Layer</h4>
                        <p className="text-xs text-slate-400">Synthesizing modular wrappers for device peripherals and sensors.</p>
                    </div>
                    {phase === 0 ? (
                       <button onClick={runGenerator} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                          <Play className="w-4 h-4 fill-white" /> Initiate Synthesis
                       </button>
                    ) : (
                       <div className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border ${phase === 10 ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          {phase === 10 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                          {phase === 10 ? 'CERTIFIED & READY' : `PROCESSING PHASE ${phase}/10`}
                       </div>
                    )}
                </div>

                {/* Hardware Grid Preview */}
                <div className="grid grid-cols-4 gap-3 shrink-0">
                   <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${phase >= 2 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-slate-900/50 border-slate-800 text-slate-600'}`}>
                     <Camera className="w-6 h-6" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">Camera2</span>
                   </div>
                   <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${phase >= 3 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-slate-900/50 border-slate-800 text-slate-600'}`}>
                     <Bluetooth className="w-6 h-6" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">Bluetooth</span>
                   </div>
                   <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${phase >= 4 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-slate-900/50 border-slate-800 text-slate-600'}`}>
                     <SmartphoneNfc className="w-6 h-6" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">NFC</span>
                   </div>
                   <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${phase >= 5 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-slate-900/50 border-slate-800 text-slate-600'}`}>
                     <MapPin className="w-6 h-6" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
                   </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0 border border-slate-800 shadow-inner">
                   <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                </div>

                {/* Terminal Window */}
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-5 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col shadow-inner relative">
                   {logs.length === 0 ? (
                     <div className="text-slate-600 italic flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Awaiting subsystem initialization...
                     </div>
                   ) : (
                     logs.map((log, i) => (
                       <div key={i} className={`whitespace-pre-wrap ${
                         log.includes('SUCCESS') ? 'text-blue-400 font-bold mt-4 text-sm' : 
                         log.includes('PHASE') ? 'text-blue-300 font-bold mt-2' : 
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
