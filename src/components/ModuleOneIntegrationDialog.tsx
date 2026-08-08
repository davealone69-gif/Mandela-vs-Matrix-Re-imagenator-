import React, { useState, useEffect } from 'react';
import { 
  X, Folder, FileCode, FileText, Activity, RefreshCw, Zap, Shield, 
  CheckCircle2, AlertTriangle, ArrowRight, Server, Play, Link, Terminal, Cpu, Database
} from 'lucide-react';

interface AnomalyFlag {
  id: string;
  code: string;
  severity: string;
  value: string;
  location: string;
}

interface ModuleOneIntegrationDialogProps {
  isDark: boolean;
  onClose: () => void;
}

export default function ModuleOneIntegrationDialog({ isDark, onClose }: ModuleOneIntegrationDialogProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFile, setActiveFile] = useState<string>('module_manifest.json');
  
  // Data states from backend
  const [manifest, setManifest] = useState<any>({
    module_id: "Module_1",
    version: "1.4.0-DEATH-HIVE",
    status: "HEALTHY",
    description: "Mandela Anomaly Detection & Matrix Substrate Integration Pipeline",
    submodules: ["Mandela", "Matrix", "Integration"]
  });
  const [mandela, setMandela] = useState<any>({
    driftSensor: { driftIndex: 0.038, baselineFrequencyHz: 432.12, status: "STABLE_MONITORING" },
    mismatchScanner: { scannedBlocks: 1420900, scanSpeedBlocksPerSec: 285000 },
    anomalyFlags: [],
    mandelaOutputPipe: { throughputMBps: 4820.5, targetPipe: "matrix_input.pipe" }
  });
  const [matrix, setMatrix] = useState<any>({
    substrate: { status: "OPERATIONAL", nodeCount: 16, gridDensityPct: 98.4 },
    routingGrid: { activeRoutes: 256, saturationPct: 42.1, gridTopology: "16x16 Neural Mesh Grid" },
    identitySphere: { sphereId: "IDENTITY_SPHERE_ALPHA_99", coherencePct: 99.4, activeIdentities: 6 },
    matrixInputPipe: { receivedMBps: 4820.5 }
  });
  const [integration, setIntegration] = useState<any>({
    mandelaToMatrixLink: { linkStatus: "LINKED_ACTIVE", latencyMs: 0.14, bytesTransferred: 98402100000 },
    matrixToEvaluateorLink: { linkStatus: "READY_FORWARDING", forwardedRecords: 12050000 },
    moduleHealthSelfcheck: { pass: true, checkCount: 1420, integrityScorePct: 100.0 }
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchModule1Status();
    const interval = setInterval(fetchModule1Status, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchModule1Status = async () => {
    try {
      const res = await fetch('/api/module-1/status');
      const data = await res.json();
      if (data.success) {
        if (data.manifest) setManifest(data.manifest);
        if (data.mandela) setMandela(data.mandela);
        if (data.matrix) setMatrix(data.matrix);
        if (data.integration) setIntegration(data.integration);
        if (data.logs) setLogs(data.logs);
      }
    } catch (e) {
      console.error("Failed to fetch Module_1 status:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleScanMandela = async () => {
    try {
      setActionMsg("Running mismatch_scanner.core on memory blocks...");
      const res = await fetch('/api/module-1/scan-mandela', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule1Status();
      }
    } catch (e) {
      setActionMsg("Failed to execute mismatch scanner.");
    }
  };

  const handlePulseDrift = async () => {
    try {
      setActionMsg("Recalibrating drift_sensor.core baseline frequency...");
      const res = await fetch('/api/module-1/pulse-drift', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule1Status();
      }
    } catch (e) {
      setActionMsg("Failed to pulse drift sensor.");
    }
  };

  const handleRunSelfcheck = async () => {
    try {
      setActionMsg("Executing module_health.selfcheck diagnostic sweep...");
      const res = await fetch('/api/module-1/run-selfcheck', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule1Status();
      }
    } catch (e) {
      setActionMsg("Failed to run module selfcheck.");
    }
  };

  const handleFlushPipe = async () => {
    try {
      setActionMsg("Flushing mandela_output.pipe -> matrix_input.pipe buffer...");
      const res = await fetch('/api/module-1/flush-pipe', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule1Status();
      }
    } catch (e) {
      setActionMsg("Failed to flush pipeline.");
    }
  };

  const handleAutoRepair = async () => {
    try {
      setActionMsg("Executing auto_repair() sequence across Module_1...");
      const res = await fetch('/api/module-1/auto-repair', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule1Status();
      }
    } catch (e) {
      setActionMsg("Failed to trigger auto_repair().");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100 border-emerald-900/60' : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/50 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 animate-pulse">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wider text-emerald-400 uppercase font-mono">
                  Module_1 / Mandela - Matrix - Integration Pipeline
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  v{manifest.version}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {manifest.description}
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

        {/* Action Banner */}
        {actionMsg && (
          <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              {actionMsg}
            </span>
            <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Content Explorer & Details split layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">

          {/* Left Column: Interactive File Tree Inspector */}
          <div className="md:col-span-4 p-4 bg-slate-950/90 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Folder className="w-3.5 h-3.5" />
                Module_1 File Structure
              </span>
              <span className="text-[10px] text-slate-500">12 Files</span>
            </div>

            {/* Tree nodes */}
            <div className="space-y-2">
              {/* Root File */}
              <button
                onClick={() => setActiveFile('module_manifest.json')}
                className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between ${
                  activeFile === 'module_manifest.json'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  module_manifest.json
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">CONFIG</span>
              </button>

              {/* Mandela Sub-Folder */}
              <div className="pl-2 border-l border-emerald-900/40 space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1">
                  <Folder className="w-3.5 h-3.5 text-emerald-400" />
                  Mandela /
                </div>

                <button
                  onClick={() => setActiveFile('drift_sensor.core')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'drift_sensor.core'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3 h-3 text-cyan-400" />
                    drift_sensor.core
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold">{mandela.driftSensor?.driftIndex}</span>
                </button>

                <button
                  onClick={() => setActiveFile('mismatch_scanner.core')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'mismatch_scanner.core'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3 h-3 text-cyan-400" />
                    mismatch_scanner.core
                  </span>
                  <span className="text-[10px] text-slate-400">SCANNER</span>
                </button>

                <button
                  onClick={() => setActiveFile('anomaly_flags.json')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'anomaly_flags.json'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-amber-400" />
                    anomaly_flags.json
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">{mandela.anomalyFlags?.length} FLAGS</span>
                </button>

                <button
                  onClick={() => setActiveFile('mandela_output.pipe')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'mandela_output.pipe'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-purple-400" />
                    mandela_output.pipe
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">4.8 GB/s</span>
                </button>
              </div>

              {/* Matrix Sub-Folder */}
              <div className="pl-2 border-l border-cyan-900/40 space-y-1">
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1">
                  <Folder className="w-3.5 h-3.5 text-cyan-400" />
                  Matrix /
                </div>

                <button
                  onClick={() => setActiveFile('substrate.core')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'substrate.core'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    substrate.core
                  </span>
                  <span className="text-[10px] text-emerald-400">98.4%</span>
                </button>

                <button
                  onClick={() => setActiveFile('routing.grid')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'routing.grid'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Server className="w-3 h-3 text-cyan-400" />
                    routing.grid
                  </span>
                  <span className="text-[10px] text-slate-400">256 Rts</span>
                </button>

                <button
                  onClick={() => setActiveFile('identity_sphere.core')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'identity_sphere.core'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-amber-400" />
                    identity_sphere.core
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">99.4%</span>
                </button>

                <button
                  onClick={() => setActiveFile('matrix_input.pipe')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'matrix_input.pipe'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-purple-400" />
                    matrix_input.pipe
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">CONNECTED</span>
                </button>
              </div>

              {/* Integration Sub-Folder */}
              <div className="pl-2 border-l border-purple-900/40 space-y-1">
                <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1">
                  <Folder className="w-3.5 h-3.5 text-purple-400" />
                  Integration /
                </div>

                <button
                  onClick={() => setActiveFile('mandela_to_matrix.link')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'mandela_to_matrix.link'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-emerald-400" />
                    mandela_to_matrix.link
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                </button>

                <button
                  onClick={() => setActiveFile('matrix_to_evaluateor.link')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'matrix_to_evaluateor.link'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-cyan-400" />
                    matrix_to_evaluateor.link
                  </span>
                  <span className="text-[10px] text-slate-400">READY</span>
                </button>

                <button
                  onClick={() => setActiveFile('module_health.selfcheck')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'module_health.selfcheck'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    module_health.selfcheck
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">100% PASS</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Live Telemetry, File Contents & Control Dashboard */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-6">

            {/* Quick Action Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40">
              <div className="flex items-center gap-2 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-bold">Module Integrity:</span>
                <span className="text-emerald-400 font-black">{integration.moduleHealthSelfcheck?.integrityScorePct}% PASS</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleScanMandela}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Scan Mandela Mismatch
                </button>
                <button
                  onClick={handlePulseDrift}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  <Activity className="w-3.5 h-3.5" />
                  Pulse Drift Sensor
                </button>
                <button
                  onClick={handleFlushPipe}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Flush Pipe
                </button>
                <button
                  onClick={handleRunSelfcheck}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  Selfcheck
                </button>
                <button
                  onClick={handleAutoRepair}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Auto-Repair ()
                </button>
              </div>
            </div>

            {/* Dynamic File / Core Component View */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  Inspecting: {activeFile}
                </span>
                <span className="text-[10px] text-slate-500">Live Memory Core State</span>
              </div>

              {/* Conditional rendered detailed core metrics */}
              {activeFile === 'module_manifest.json' && (
                <div className="space-y-3 text-xs">
                  <pre className="p-3 bg-slate-900 rounded-lg text-emerald-300 overflow-x-auto text-[11px]">
{JSON.stringify(manifest, null, 2)}
                  </pre>
                </div>
              )}

              {activeFile === 'drift_sensor.core' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900 border border-cyan-900/40 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Drift Index Delta:</span>
                      <span className="text-cyan-400 font-bold text-lg">{mandela.driftSensor?.driftIndex}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Baseline Frequency:</span>
                      <span className="text-amber-400 font-bold text-lg">{mandela.driftSensor?.baselineFrequencyHz} Hz</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] italic">
                    `drift_sensor.core` actively monitors timeline frequency deviations and flags non-linear vector mutations.
                  </p>
                </div>
              )}

              {activeFile === 'mismatch_scanner.core' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900 border border-cyan-900/40 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Scanned Memory Blocks:</span>
                      <span className="text-cyan-400 font-bold text-lg">{mandela.mismatchScanner?.scannedBlocks?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Scan Speed:</span>
                      <span className="text-emerald-400 font-bold text-lg">{(mandela.mismatchScanner?.scanSpeedBlocksPerSec / 1000).toFixed(0)}k blk/s</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFile === 'anomaly_flags.json' && (
                <div className="space-y-2">
                  {mandela.anomalyFlags?.map((anom: AnomalyFlag) => (
                    <div key={anom.id} className="p-3 bg-slate-900 rounded-lg border border-amber-900/30 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-amber-400 block">{anom.id} • {anom.code}</span>
                        <span className="text-slate-400 text-[11px]">{anom.value} ({anom.location})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {anom.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeFile === 'mandela_output.pipe' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-purple-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pipe Stream Output:</span>
                    <span className="text-purple-300 font-bold">{mandela.mandelaOutputPipe?.targetPipe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pipe Throughput Rate:</span>
                    <span className="text-emerald-400 font-bold">{mandela.mandelaOutputPipe?.throughputMBps} MB/s (4.8 GB/s)</span>
                  </div>
                </div>
              )}

              {activeFile === 'substrate.core' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-cyan-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Substrate Status:</span>
                    <span className="text-emerald-400 font-bold">{matrix.substrate?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Substrate Nodes:</span>
                    <span className="text-cyan-400 font-bold">{matrix.substrate?.nodeCount} Active Clusters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Grid Density:</span>
                    <span className="text-amber-400 font-bold">{matrix.substrate?.gridDensityPct}%</span>
                  </div>
                </div>
              )}

              {activeFile === 'routing.grid' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-cyan-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Topology:</span>
                    <span className="text-cyan-300 font-bold">{matrix.routingGrid?.gridTopology}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Routes:</span>
                    <span className="text-emerald-400 font-bold">{matrix.routingGrid?.activeRoutes} Concurrent Paths</span>
                  </div>
                </div>
              )}

              {activeFile === 'identity_sphere.core' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-amber-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Identity Sphere ID:</span>
                    <span className="text-amber-300 font-bold">{matrix.identitySphere?.sphereId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sphere Coherence:</span>
                    <span className="text-emerald-400 font-bold">{matrix.identitySphere?.coherencePct}%</span>
                  </div>
                </div>
              )}

              {activeFile === 'matrix_input.pipe' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-purple-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Input Stream Ingestion:</span>
                    <span className="text-purple-300 font-bold">{matrix.matrixInputPipe?.receivedMBps} MB/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dropped Packets:</span>
                    <span className="text-emerald-400 font-bold">0 (ZERO_LOSS)</span>
                  </div>
                </div>
              )}

              {activeFile === 'mandela_to_matrix.link' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-emerald-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Link State:</span>
                    <span className="text-emerald-400 font-bold">{integration.mandelaToMatrixLink?.linkStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Link Latency:</span>
                    <span className="text-cyan-400 font-bold">{integration.mandelaToMatrixLink?.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Transferred:</span>
                    <span className="text-purple-300 font-bold">{(integration.mandelaToMatrixLink?.bytesTransferred / 1e9).toFixed(2)} GB</span>
                  </div>
                </div>
              )}

              {activeFile === 'matrix_to_evaluateor.link' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-cyan-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Forward Link:</span>
                    <span className="text-cyan-300 font-bold">{integration.matrixToEvaluateorLink?.linkStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Forwarded Records:</span>
                    <span className="text-emerald-400 font-bold">{integration.matrixToEvaluateorLink?.forwardedRecords?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {activeFile === 'module_health.selfcheck' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-emerald-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selfcheck Integrity Result:</span>
                    <span className="text-emerald-400 font-bold">100.0% PASS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Diagnostic Sweeps Executed:</span>
                    <span className="text-cyan-300 font-bold">{integration.moduleHealthSelfcheck?.checkCount}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Logs Stream */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Module_1 Integration Stream & Pipeline Logs
              </h3>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 max-h-32 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>MODULE_1 • MANDELA - MATRIX - INTEGRATION PIPELINE ENGINE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close Module_1 Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
