import React, { useState, useEffect } from 'react';
import { 
  X, Folder, FileCode, FileText, Activity, RefreshCw, Zap, Shield, 
  CheckCircle2, ArrowRight, Play, Link, Terminal, Cpu, Tag, Network
} from 'lucide-react';

interface ModuleTwoIntegrationDialogProps {
  isDark: boolean;
  onClose: () => void;
}

export default function ModuleTwoIntegrationDialog({ isDark, onClose }: ModuleTwoIntegrationDialogProps) {
  const [activeFile, setActiveFile] = useState<string>('module_manifest.json');
  
  // Data states from backend
  const [manifest, setManifest] = useState<any>({
    module_id: "Module_2",
    version: "1.0-builder",
    status: "HEALTHY",
    description: "Evaluateor Interpretation & Action Classification Engine",
    components: ["Evaluateor"]
  });
  const [evaluateor, setEvaluateor] = useState<any>({
    interpretCore: { parsedRecordsCount: 2845010, parserLatencyMs: 0.12 },
    classifyCore: { lastCategoryDetected: "timeline", classificationAccuracyPct: 99.8, classifiedEventsCount: 14209 },
    actionCodes: { symbolic: "DEV-SYM", identity: "DEV-ID", timeline: "DEV-TIME", structural: "DEV-STR" },
    evaluateorOutputPipe: { pipeName: "evaluateor_output.pipe", target: "DevatorLayer", throughputEventsPerSec: 18450 }
  });
  const [integration, setIntegration] = useState<any>({
    matrixToEvaluateorLink: { status: "LINKED_ACTIVE", bandwidthMBps: 3420.0 },
    evaluateorToDevatorLink: { status: "FORWARDING_READY", dispatchedActionsCount: 8940 },
    moduleHealthSelfcheck: { pass: true, checkCount: 890, integrityScorePct: 100.0 }
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchModule2Status();
    const interval = setInterval(fetchModule2Status, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchModule2Status = async () => {
    try {
      const res = await fetch('/api/module-2/status');
      const data = await res.json();
      if (data.success) {
        if (data.manifest) setManifest(data.manifest);
        if (data.evaluateor) setEvaluateor(data.evaluateor);
        if (data.integration) setIntegration(data.integration);
        if (data.logs) setLogs(data.logs);
      }
    } catch (e) {
      console.error("Failed to fetch Module_2 status:", e);
    }
  };

  const handleParseInput = async () => {
    try {
      setActionMsg("Running interpret.core parse_input on matrix stream...");
      const res = await fetch('/api/module-2/parse-input', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule2Status();
      }
    } catch (e) {
      setActionMsg("Failed to execute parse_input.");
    }
  };

  const handleClassifyDrift = async () => {
    try {
      setActionMsg("Running classify.core categorize_drift engine...");
      const res = await fetch('/api/module-2/classify-drift', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule2Status();
      }
    } catch (e) {
      setActionMsg("Failed to classify drift.");
    }
  };

  const handleRunSelfcheck = async () => {
    try {
      setActionMsg("Running module_health.selfcheck across Evaluateor...");
      const res = await fetch('/api/module-2/run-selfcheck', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule2Status();
      }
    } catch (e) {
      setActionMsg("Failed to run selfcheck.");
    }
  };

  const handleFlushPipe = async () => {
    try {
      setActionMsg("Flushing evaluateor_output.pipe buffer to DevatorLayer...");
      const res = await fetch('/api/module-2/flush-pipe', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule2Status();
      }
    } catch (e) {
      setActionMsg("Failed to flush pipe.");
    }
  };

  const handleAutoRepair = async () => {
    try {
      setActionMsg("Executing auto_repair() sequence across Module_2...");
      const res = await fetch('/api/module-2/auto-repair', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchModule2Status();
      }
    } catch (e) {
      setActionMsg("Failed to execute auto_repair().");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100 border-indigo-900/60' : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-900/50 bg-gradient-to-r from-indigo-950/80 via-slate-950 to-blue-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 animate-pulse">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wider text-indigo-400 uppercase font-mono">
                  Module_2 / Evaluateor Core & Action Classifier
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">
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
          <div className="px-6 py-2 bg-indigo-500/10 border-b border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
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
              <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Folder className="w-3.5 h-3.5" />
                Module_2 File Structure
              </span>
              <span className="text-[10px] text-slate-500">8 Files</span>
            </div>

            <div className="space-y-2">
              {/* Root File */}
              <button
                onClick={() => setActiveFile('module_manifest.json')}
                className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between ${
                  activeFile === 'module_manifest.json'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  module_manifest.json
                </span>
                <span className="text-[10px] text-indigo-400 font-bold">MANIFEST</span>
              </button>

              {/* Evaluateor Folder */}
              <div className="pl-2 border-l border-indigo-900/40 space-y-1">
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1">
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                  Evaluateor /
                </div>

                <button
                  onClick={() => setActiveFile('interpret.core')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'interpret.core'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3 h-3 text-cyan-400" />
                    interpret.core
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">PARSER</span>
                </button>

                <button
                  onClick={() => setActiveFile('classify.core')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'classify.core'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-amber-400" />
                    classify.core
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">{evaluateor.classifyCore?.classificationAccuracyPct}%</span>
                </button>

                <button
                  onClick={() => setActiveFile('action_codes.json')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'action_codes.json'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-emerald-400" />
                    action_codes.json
                  </span>
                  <span className="text-[10px] text-slate-400">CODES</span>
                </button>

                <button
                  onClick={() => setActiveFile('evaluateor_output.pipe')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'evaluateor_output.pipe'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-purple-400" />
                    evaluateor_output.pipe
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">18.4k/s</span>
                </button>
              </div>

              {/* Integration Folder */}
              <div className="pl-2 border-l border-blue-900/40 space-y-1">
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1">
                  <Folder className="w-3.5 h-3.5 text-blue-400" />
                  Integration /
                </div>

                <button
                  onClick={() => setActiveFile('matrix_to_evaluateor.link')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'matrix_to_evaluateor.link'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-emerald-400" />
                    matrix_to_evaluateor.link
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                </button>

                <button
                  onClick={() => setActiveFile('evaluateor_to_devator.link')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'evaluateor_to_devator.link'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-indigo-400" />
                    evaluateor_to_devator.link
                  </span>
                  <span className="text-[10px] text-indigo-400 font-bold">READY</span>
                </button>

                <button
                  onClick={() => setActiveFile('module_health.selfcheck')}
                  className={`w-full text-left pl-4 py-1.5 pr-2 rounded transition-all flex items-center justify-between text-[11px] ${
                    activeFile === 'module_health.selfcheck'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
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
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-indigo-900/40">
              <div className="flex items-center gap-2 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-bold">Module Integrity:</span>
                <span className="text-emerald-400 font-black">{integration.moduleHealthSelfcheck?.integrityScorePct}% PASS</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleParseInput}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Parse Input ()
                </button>
                <button
                  onClick={handleClassifyDrift}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 font-mono"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Classify Drift ()
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
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  Inspecting: {activeFile}
                </span>
                <span className="text-[10px] text-slate-500">Live Memory Core State</span>
              </div>

              {activeFile === 'module_manifest.json' && (
                <div className="space-y-3 text-xs">
                  <pre className="p-3 bg-slate-900 rounded-lg text-indigo-300 overflow-x-auto text-[11px]">
{JSON.stringify(manifest, null, 2)}
                  </pre>
                </div>
              )}

              {activeFile === 'interpret.core' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900 border border-indigo-900/40 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Parsed Input Records:</span>
                      <span className="text-indigo-400 font-bold text-lg">{evaluateor.interpretCore?.parsedRecordsCount?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Parser Latency:</span>
                      <span className="text-emerald-400 font-bold text-lg">{evaluateor.interpretCore?.parserLatencyMs} ms</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFile === 'classify.core' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900 border border-indigo-900/40 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Last Detected Category:</span>
                      <span className="text-amber-400 font-bold text-lg uppercase">{evaluateor.classifyCore?.lastCategoryDetected}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Classification Accuracy:</span>
                      <span className="text-emerald-400 font-bold text-lg">{evaluateor.classifyCore?.classificationAccuracyPct}%</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFile === 'action_codes.json' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-400 text-[11px]">Bound action codes for Devator routing:</p>
                  <pre className="p-3 bg-slate-900 rounded-lg text-amber-300 overflow-x-auto text-[11px]">
{JSON.stringify(evaluateor.actionCodes, null, 2)}
                  </pre>
                </div>
              )}

              {activeFile === 'evaluateor_output.pipe' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-purple-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pipe Stream Output:</span>
                    <span className="text-purple-300 font-bold">{evaluateor.evaluateorOutputPipe?.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Throughput:</span>
                    <span className="text-emerald-400 font-bold">{evaluateor.evaluateorOutputPipe?.throughputEventsPerSec?.toLocaleString()} events/sec</span>
                  </div>
                </div>
              )}

              {activeFile === 'matrix_to_evaluateor.link' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-indigo-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inbound Link Status:</span>
                    <span className="text-emerald-400 font-bold">{integration.matrixToEvaluateorLink?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inbound Bandwidth:</span>
                    <span className="text-cyan-400 font-bold">{integration.matrixToEvaluateorLink?.bandwidthMBps} MB/s</span>
                  </div>
                </div>
              )}

              {activeFile === 'evaluateor_to_devator.link' && (
                <div className="p-4 bg-slate-900 rounded-lg border border-blue-900/40 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Forward Link Status:</span>
                    <span className="text-indigo-300 font-bold">{integration.evaluateorToDevatorLink?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dispatched Action Codes:</span>
                    <span className="text-emerald-400 font-bold">{integration.evaluateorToDevatorLink?.dispatchedActionsCount?.toLocaleString()} Actions</span>
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
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Module_2 Pipeline & Classification Stream Logs
              </h3>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 max-h-32 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>MODULE_2 • EVALUATEOR INTERPRETATION & ACTION CLASSIFIER</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close Module_2 Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
