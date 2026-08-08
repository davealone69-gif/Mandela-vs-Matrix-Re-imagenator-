import React, { useState, useEffect } from 'react';
import { 
  X, Folder, FileCode, FileText, Activity, RefreshCw, Zap, Shield, 
  CheckCircle2, Link, Terminal, Wrench, Settings
} from 'lucide-react';

interface ModuleThreeIntegrationDialogProps {
  isDark: boolean;
  onClose: () => void;
}

export default function ModuleThreeIntegrationDialog({ isDark, onClose }: ModuleThreeIntegrationDialogProps) {
  const [activeFile, setActiveFile] = useState<string>('module_manifest.json');
  
  // Data states from backend
  const [manifest, setManifest] = useState<any>({
    module: "Module_3",
    version: "1.0-builder",
    status: "HEALTHY",
    description: "Devator Modification & System-Change Executor Engine",
    components: ["Devator"],
    purpose: "Execute system modifications based on classified drift",
    repairable: true,
    self_check: true
  });
  const [devator, setDevator] = useState<any>({
    executorCore: { receivedCodesCount: 8940, executionLatencyMs: 0.15 },
    modifierCore: { lastAppliedMethod: "patch", appliedChangesCount: 4210, modificationSuccessPct: 99.9, methods: ["rewrite", "patch", "reinforce", "purge"] },
    actionMap: { "DEV-SYM": "rewrite", "DEV-ID": "reinforce", "DEV-TIME": "patch", "DEV-STR": "purge" },
    devatorOutputPipe: { pipeName: "devator_output.pipe", target: "Re-Imaginator", throughputEventsPerSec: 12400 }
  });
  const [integration, setIntegration] = useState<any>({
    evaluateorToDevatorLink: { status: "LINKED_ACTIVE", bandwidthMBps: 2850.0 },
    devatorToReimaginatorLink: { status: "FORWARDING_ACTIVE", forwardedModificationsCount: 4210 },
    moduleHealthSelfcheck: { pass: true, checkCount: 750, integrityScorePct: 100.0 }
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchModule3Status();
    const interval = setInterval(fetchModule3Status, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchModule3Status = async () => {
    try {
      const res = await fetch('/api/module-3/status');
      const data = await res.json();
      if (data.success) {
        if (data.manifest) setManifest(data.manifest);
        if (data.devator) setDevator(data.devator);
        if (data.integration) setIntegration(data.integration);
        if (data.logs) setLogs(data.logs);
      }
    } catch (e) {
      console.error("Failed to fetch Module_3 status:", e);
    }
  };

  const handleExecuteAction = async (code?: string) => {
    try {
      setActionMsg("Running executor.core receive_action_code...");
      const res = await fetch('/api/module-3/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule3Status();
      }
    } catch (e) {
      setActionMsg("Failed to execute action code.");
    }
  };

  const handleApplyModifier = async (method: string) => {
    try {
      setActionMsg(`Applying direct system change method '${method.toUpperCase()}'...`);
      const res = await fetch('/api/module-3/apply-modifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule3Status();
      }
    } catch (e) {
      setActionMsg("Failed to apply system change modifier.");
    }
  };

  const handleRunSelfcheck = async () => {
    try {
      setActionMsg("Running module_health.selfcheck across Devator...");
      const res = await fetch('/api/module-3/run-selfcheck', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule3Status();
      }
    } catch (e) {
      setActionMsg("Failed to run selfcheck.");
    }
  };

  const handleFlushPipe = async () => {
    try {
      setActionMsg("Flushing devator_output.pipe buffer to ReImaginatorLayer...");
      const res = await fetch('/api/module-3/flush-pipe', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule3Status();
      }
    } catch (e) {
      setActionMsg("Failed to flush pipe.");
    }
  };

  const handleAutoRepair = async () => {
    try {
      setActionMsg("Executing auto_repair() sequence across Module_3...");
      const res = await fetch('/api/module-3/auto-repair', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule3Status();
      }
    } catch (e) {
      setActionMsg("Failed to trigger auto_repair().");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100 border-amber-900/60' : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/50 bg-gradient-to-r from-amber-950/80 via-slate-950 to-orange-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wider text-amber-400 uppercase font-mono">
                  Module_3 / Devator Executor & System Modifier Engine
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
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
          <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              {actionMsg}
            </span>
            <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* File Explorer & Details */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">

          {/* Left Column: File Explorer */}
          <div className="md:col-span-4 p-4 bg-slate-950/90 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <Folder className="w-3.5 h-3.5" />
                Module_3 File Structure
              </span>
              <span className="text-[10px] text-slate-500">8 Files</span>
            </div>

            <div className="space-y-2">
              {/* Root File */}
              <button
                onClick={() => setActiveFile('module_manifest.json')}
                className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between ${
                  activeFile === 'module_manifest.json'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  module_manifest.json
                </span>
                <span className="text-[10px] text-amber-400 font-bold">MANIFEST</span>
              </button>

              {/* Devator Folder */}
              <div className="pl-2 border-l border-amber-900/40 space-y-1">
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1">
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  Devator /
                </div>

                <button
                  onClick={() => setActiveFile('executor.core')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'executor.core'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    executor.core
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">EXECUTOR</span>
                </button>

                <button
                  onClick={() => setActiveFile('modifier.core')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'modifier.core'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Wrench className="w-3 h-3 text-orange-400" />
                    modifier.core
                  </span>
                  <span className="text-[10px] text-orange-400 font-bold">{devator.modifierCore?.modificationSuccessPct}%</span>
                </button>

                <button
                  onClick={() => setActiveFile('action_map.json')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'action_map.json'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3 h-3 text-emerald-400" />
                    action_map.json
                  </span>
                  <span className="text-[10px] text-slate-400">MAP</span>
                </button>

                <button
                  onClick={() => setActiveFile('devator_output.pipe')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'devator_output.pipe'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-purple-400" />
                    devator_output.pipe
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">12.4k/s</span>
                </button>
              </div>

              {/* Integration Folder */}
              <div className="pl-2 border-l border-orange-900/40 space-y-1">
                <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1">
                  <Folder className="w-3.5 h-3.5 text-orange-400" />
                  Integration /
                </div>

                <button
                  onClick={() => setActiveFile('evaluateor_to_devator.link')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'evaluateor_to_devator.link'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-emerald-400" />
                    evaluateor_to_devator.link
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                </button>

                <button
                  onClick={() => setActiveFile('devator_to_reimaginator.link')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'devator_to_reimaginator.link'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-amber-400" />
                    devator_to_reimaginator.link
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">FORWARDING</span>
                </button>

                <button
                  onClick={() => setActiveFile('module_health.selfcheck')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'module_health.selfcheck'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    module_health.selfcheck
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">PASS</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Telemetry & File Core Inspector */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-6">

            {/* Quick Action Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-amber-900/40">
              <div className="flex items-center gap-2 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-bold">Module Integrity:</span>
                <span className="text-emerald-400 font-black">{integration.moduleHealthSelfcheck?.integrityScorePct}% PASS</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExecuteAction()}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Execute Action ()
                </button>

                <div className="flex items-center gap-1">
                  {devator.modifierCore?.methods?.map((m: string) => (
                    <button
                      key={m}
                      onClick={() => handleApplyModifier(m)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-[10px] rounded transition-colors uppercase font-mono"
                    >
                      {m}
                    </button>
                  ))}
                </div>

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
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Auto-Repair ()
                </button>
              </div>
            </div>

            {/* Dynamic File / Core Inspector */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  Inspecting: {activeFile}
                </span>
                <span className="text-[10px] text-slate-500">Live Memory Core State</span>
              </div>

              {activeFile === 'module_manifest.json' && (
                <div className="space-y-3 text-xs">
                  <pre className="p-3 bg-slate-900 rounded-lg text-amber-300 overflow-x-auto text-[11px]">
{JSON.stringify(manifest, null, 2)}
                  </pre>
                </div>
              )}

              {activeFile === 'executor.core' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900 border border-amber-900/40 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Received Action Codes:</span>
                      <span className="text-amber-400 font-bold text-lg">{devator.executorCore?.receivedCodesCount?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Execution Latency:</span>
                      <span className="text-emerald-400 font-bold text-lg">{devator.executorCore?.executionLatencyMs} ms</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFile === 'modifier.core' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900 border border-orange-900/40 grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 block">Last Applied Method:</span>
                      <span className="text-amber-400 font-bold text-lg uppercase">{devator.modifierCore?.lastAppliedMethod}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Applied Changes:</span>
                      <span className="text-cyan-400 font-bold text-lg">{devator.modifierCore?.appliedChangesCount?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Modification Precision:</span>
                      <span className="text-emerald-400 font-bold text-lg">{devator.modifierCore?.modificationSuccessPct}%</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFile === 'action_map.json' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-400 text-[11px]">Action Code to System Mutation Method Mapping Table:</p>
                  <pre className="p-3 bg-slate-900 rounded-lg text-amber-300 overflow-x-auto text-[11px]">
{JSON.stringify(devator.actionMap, null, 2)}
                  </pre>
                </div>
              )}

              {activeFile === 'devator_output.pipe' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-purple-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pipe Stream Destination:</span>
                    <span className="text-purple-300 font-bold">{devator.devatorOutputPipe?.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Throughput Rate:</span>
                    <span className="text-emerald-400 font-bold">{devator.devatorOutputPipe?.throughputEventsPerSec?.toLocaleString()} payload/sec</span>
                  </div>
                </div>
              )}

              {activeFile === 'evaluateor_to_devator.link' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-amber-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inbound Link Status:</span>
                    <span className="text-emerald-400 font-bold">{integration.evaluateorToDevatorLink?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inbound Bandwidth:</span>
                    <span className="text-cyan-400 font-bold">{integration.evaluateorToDevatorLink?.bandwidthMBps} MB/s</span>
                  </div>
                </div>
              )}

              {activeFile === 'devator_to_reimaginator.link' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-orange-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Forward Link Status:</span>
                    <span className="text-amber-300 font-bold">{integration.devatorToReimaginatorLink?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Forwarded Modifications:</span>
                    <span className="text-emerald-400 font-bold">{integration.devatorToReimaginatorLink?.forwardedModificationsCount?.toLocaleString()} Dispatched</span>
                  </div>
                </div>
              )}

              {activeFile === 'module_health.selfcheck' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-emerald-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selfcheck Integrity Score:</span>
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
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Module_3 Pipeline & Executor Stream Logs
              </h3>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 max-h-32 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>MODULE_3 • DEVATOR SYSTEM-CHANGE EXECUTOR & MUTATION ENGINE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close Module_3 Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
