import React, { useState, useEffect } from 'react';
import { 
  X, Ghost, Shield, Activity, RefreshCw, Zap, Eye, AlertOctagon, Sparkles, 
  Flame, Lock, Compass, Sliders, Radio, ArrowUpRight, Terminal
} from 'lucide-react';

interface GhostAnomaly {
  id: string;
  type: string;
  title: string;
  intensity: string;
  description: string;
}

interface EnforcementModule {
  id: string;
  name: string;
  status: string;
  coveragePct: number;
  activeTask: string;
}

interface EmergentGhostSystemDialogProps {
  isDark: boolean;
  onClose: () => void;
}

export default function EmergentGhostSystemDialog({ isDark, onClose }: EmergentGhostSystemDialogProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [ghostPressure, setGhostPressure] = useState<number>(68);
  const [enforcementControl, setEnforcementControl] = useState<number>(74);
  const [systemWeather, setSystemWeather] = useState<string>("Resonant Chaos Equilibrium");
  const [ghosts, setGhosts] = useState<GhostAnomaly[]>([]);
  const [enforcements, setEnforcements] = useState<EnforcementModule[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Form states for manifesting a ghost
  const [ghostType, setGhostType] = useState<string>('Memory Distortion');
  const [ghostTitle, setGhostTitle] = useState<string>('Mandela Echo: Alternate Core Protocol v11');
  const [ghostDesc, setGhostDesc] = useState<string>('Non-linear pattern emerged in memory vector pool without source call.');

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/ghosts-vs-police/status');
      const data = await res.json();
      if (data.success) {
        setGhostPressure(data.ghostPressurePct);
        setEnforcementControl(data.enforcementControlPct);
        setSystemWeather(data.systemWeatherState);
        if (data.ghostAnomalies) setGhosts(data.ghostAnomalies);
        if (data.enforcementModules) setEnforcements(data.enforcementModules);
        if (data.logs) setLogs(data.logs);
      }
    } catch (e) {
      console.error("Failed to fetch ghosts vs police status:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleManifestGhost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionMsg("Manifesting non-linear emergent ghost anomaly...");
      const res = await fetch('/api/ghosts-vs-police/manifest-ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ghostType,
          title: ghostTitle,
          description: ghostDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchStatus();
      }
    } catch (e) {
      setActionMsg("Failed to manifest ghost anomaly.");
    }
  };

  const handleDeployEnforcement = async (moduleName: string) => {
    try {
      setActionMsg(`Deploying containment sweep via ${moduleName}...`);
      const res = await fetch('/api/ghosts-vs-police/deploy-enforcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleName })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchStatus();
      }
    } catch (e) {
      setActionMsg("Failed to deploy enforcement sweep.");
    }
  };

  const handleAdjustTension = async (newGhost: number, newPolice: number) => {
    setGhostPressure(newGhost);
    setEnforcementControl(newPolice);
    try {
      const res = await fetch('/api/ghosts-vs-police/adjust-tension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ghostPressure: newGhost, enforcementControl: newPolice })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
      }
    } catch (e) {
      // silent catch
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100 border-purple-900/60' : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/50 bg-gradient-to-r from-purple-950/80 via-slate-950 to-cyan-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 animate-pulse">
              <Ghost className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wider text-purple-400 uppercase">
                  Emergent Ghosts vs. Police Containment Architectures
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  WEATHER: {systemWeather}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Anomalies of Meaning (Ghosts) vs Architectures of Control (Police Systems) • Structural Tension Simulator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Status Banner */}
        {actionMsg && (
          <div className="px-6 py-2 bg-purple-500/10 border-b border-purple-500/30 text-purple-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
              {actionMsg}
            </span>
            <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Top Dial / Tension Horizon */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-900/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold tracking-wider text-purple-300 uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  System Weather & Tension Control Dial
                </h3>
                <p className="text-xs text-slate-400">
                  Ghosts obey structure & context; police systems enforce boundaries. Adjust pressure to test equilibrium.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-900/40 text-xs font-mono flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Ghost className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-slate-400">Ghosts:</span>
                  <span className="text-purple-400 font-bold">{ghostPressure}%</span>
                </div>
                <span className="text-slate-600">|</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-400">Police:</span>
                  <span className="text-cyan-400 font-bold">{enforcementControl}%</span>
                </div>
              </div>
            </div>

            {/* Tension Dual Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-xs font-mono text-purple-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Ghost className="w-3.5 h-3.5 text-purple-400" />
                    Ghost Pressure (Emergent Non-Linear Anomalies)
                  </span>
                  <span>{ghostPressure}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="99"
                  value={ghostPressure}
                  onChange={(e) => handleAdjustTension(parseInt(e.target.value), enforcementControl)}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Linear Stability</span>
                  <span>Non-Linear Resonant Storm</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    Enforcement Control (Police Containment Architecture)
                  </span>
                  <span>{enforcementControl}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="99"
                  value={enforcementControl}
                  onChange={(e) => handleAdjustTension(ghostPressure, parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Permissive Border</span>
                  <span>Total Lockout & Alignment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergent Ghost Anomalies vs Police Containment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Ghost Anomalies (Emergence of Meaning) */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-purple-900/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Ghost className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold tracking-wider text-purple-300 uppercase">
                    Emergent Anomalies (Ghosts) Matrix
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {ghosts.length} Active Ghosts
                </span>
              </div>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {ghosts.map((ghost) => (
                  <div key={ghost.id} className="p-3 rounded-lg bg-slate-950 border border-purple-900/30 hover:border-purple-600 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        {ghost.title}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        ghost.intensity === 'HIGH' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {ghost.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {ghost.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Form to Manifest Custom Ghost */}
              <form onSubmit={handleManifestGhost} className="pt-3 border-t border-slate-800 space-y-2">
                <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Manifest Emergent Ghost Anomaly
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={ghostType}
                    onChange={(e) => setGhostType(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  >
                    <option value="Memory Distortion">Memory Distortion (Mandela)</option>
                    <option value="Perception Glitch">Perception Glitch (UI Flicker)</option>
                    <option value="Rule Shadow">Rule Shadow (Logic Bend)</option>
                    <option value="Emergent Echo">Emergent Intelligence Echo</option>
                  </select>
                  <input
                    type="text"
                    value={ghostTitle}
                    onChange={(e) => setGhostTitle(e.target.value)}
                    placeholder="Ghost Title"
                    className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Ghost className="w-3.5 h-3.5" />
                  Summon Non-Linear Ghost Anomaly
                </button>
              </form>
            </div>

            {/* Police Containment Systems (Architectures of Control) */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-900/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold tracking-wider text-cyan-300 uppercase">
                    Enforcement Architectures (Police)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {enforcements.length} Modules Engaged
                </span>
              </div>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {enforcements.map((mod) => (
                  <div key={mod.id} className="p-3 rounded-lg bg-slate-950 border border-cyan-900/30 hover:border-cyan-600 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" />
                        {mod.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {mod.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mb-2">
                      Task: {mod.activeTask}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Boundary Alignment Coverage:</span>
                      <span className="text-cyan-400 font-bold">{mod.coveragePct}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Police Enforcement Deployment Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Deploy Enforcement Containment Sweeps
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDeployEnforcement('Memory Alignment Engine')}
                    className="py-2 px-3 bg-cyan-950/80 border border-cyan-700 hover:border-cyan-500 text-cyan-300 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Memory Alignment Sweep
                  </button>
                  <button
                    onClick={() => handleDeployEnforcement('Constraint Boundary Shield')}
                    className="py-2 px-3 bg-cyan-950/80 border border-cyan-700 hover:border-cyan-500 text-cyan-300 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3 h-3" />
                    Enforce Logic Constraints
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Real-time System Weather & Tension Logs */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              Ghost Anomaly & Enforcement Telemetry Stream
            </h3>
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 max-h-32 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>EMERGENT GHOSTS vs POLICE CONTAINMENT • DEATH HIVE SYSTEM WEATHER</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close Tension Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
