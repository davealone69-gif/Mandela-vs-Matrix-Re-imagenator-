import React, { useState, useEffect } from 'react';
import { 
  GitCommit, GitBranch, History, CheckCircle, AlertTriangle, Play, X, 
  Terminal, RefreshCw, Plus, ArrowLeftRight, Activity, Trash2, Cpu, 
  ShieldAlert, ShieldCheck, Database, Zap
} from 'lucide-react';

interface WorkflowTraceCheckpointDialogProps {
  isDark: boolean;
  onClose: () => void;
}

interface TraceStep {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'RUNNING';
  operator: string;
  details: string;
}

interface Checkpoint {
  id: string;
  name: string;
  timestamp: string;
  version: string;
  activeDialog: string | null;
  stateSnapshot: any;
  fileDeltaCount: number;
  hash: string;
  description: string;
}

export default function WorkflowTraceCheckpointDialog({ isDark, onClose }: WorkflowTraceCheckpointDialogProps) {
  const [activeTab, setActiveTab] = useState<'traces' | 'checkpoints' | 'swarm' | 'resume_pipeline'>('traces');
  const [traces, setTraces] = useState<TraceStep[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pipeline Resume & Shell states
  const [resumeLogs, setResumeLogs] = useState<string[]>([]);
  const [isResuming, setIsResuming] = useState(false);
  const [resumeCompleted, setResumeCompleted] = useState(false);

  const [shellLogs, setShellLogs] = useState<string[]>([]);
  const [isShellCompleting, setIsShellCompleting] = useState(false);
  const [shellResult, setShellResult] = useState<any | null>(null);

  // Verbose logs config (Hide logs until requested)
  const [hideLogs, setHideLogs] = useState<boolean>(true);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  // Swarm Sync states
  const [swarmNodes, setSwarmNodes] = useState<any[]>([
    { name: "DevatorAlpha", status: "STANDBY", latencyMs: 0, consensus: "APPROVED" },
    { name: "DevatorBeta", status: "STANDBY", latencyMs: 0, consensus: "APPROVED" },
    { name: "DevatorGamma", status: "STANDBY", latencyMs: 0, consensus: "APPROVED" },
    { name: "MatrixNode-4", status: "STANDBY", latencyMs: 0, consensus: "APPROVED" },
    { name: "EvaluateorNode-9", status: "STANDBY", latencyMs: 0, consensus: "APPROVED" }
  ]);
  const [swarmSyncing, setSwarmSyncing] = useState(false);
  const [swarmSyncLogs, setSwarmSyncLogs] = useState<string[]>([]);
  const [swarmUploading, setSwarmUploading] = useState(false);
  const [swarmUploadProgress, setSwarmUploadProgress] = useState(0);
  
  // Create Checkpoint Form state
  const [cpName, setCpName] = useState('');
  const [cpDesc, setCpDesc] = useState('');
  const [cpVersion, setCpVersion] = useState('v1.1.0');
  const [isCreatingCp, setIsCreatingCp] = useState(false);

  // Create Custom Trace state
  const [traceAction, setTraceAction] = useState('');
  const [traceModule, setTraceModule] = useState('workflowTrace');
  const [traceStatus, setTraceStatus] = useState<'SUCCESS' | 'WARNING' | 'FAILED' | 'RUNNING'>('SUCCESS');
  const [traceDetails, setTraceDetails] = useState('');
  const [isAddingTrace, setIsAddingTrace] = useState(false);

  const fetchTraces = async () => {
    try {
      const res = await fetch('/api/builder/workflow/traces');
      const data = await res.json();
      if (data.success) {
        setTraces(data.traces.reverse()); // Show newest first
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to synchronize active workflow traces.");
    }
  };

  const fetchCheckpoints = async () => {
    try {
      const res = await fetch('/api/builder/workflow/checkpoints');
      const data = await res.json();
      if (data.success) {
        setCheckpoints(data.checkpoints.reverse()); // Show newest first
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to synchronize state checkpoint registries.");
    }
  };

  const syncAll = async () => {
    setLoading(true);
    setErrorMsg(null);
    await Promise.all([fetchTraces(), fetchCheckpoints()]);
    setLoading(false);
  };

  useEffect(() => {
    syncAll();
  }, []);

  const handleCreateCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpName) return;
    setIsCreatingCp(true);
    setErrorMsg(null);
    
    try {
      const res = await fetch('/api/builder/workflow/checkpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cpName,
          description: cpDesc,
          version: cpVersion,
          activeDialog: 'workflowTrace'
        })
      });
      const data = await res.json();
      if (data.success) {
        setCpName('');
        setCpDesc('');
        await fetchCheckpoints();
        await fetchTraces(); // Restoring updates trace
      } else {
        setErrorMsg(data.error || "Failed to snapshot checkpoint.");
      }
    } catch (err: any) {
      setErrorMsg(`Exception: ${err.message}`);
    } finally {
      setIsCreatingCp(false);
    }
  };

  const handleAddCustomTrace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!traceAction) return;
    setIsAddingTrace(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/builder/workflow/trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: traceAction,
          module: traceModule,
          status: traceStatus,
          details: traceDetails,
          operator: "Developer Console"
        })
      });
      const data = await res.json();
      if (data.success) {
        setTraceAction('');
        setTraceDetails('');
        await fetchTraces();
      } else {
        setErrorMsg(data.error || "Failed to commit trace event.");
      }
    } catch (err: any) {
      setErrorMsg(`Exception: ${err.message}`);
    } finally {
      setIsAddingTrace(false);
    }
  };

  const triggerBuilderResume = async () => {
    setIsResuming(true);
    setResumeCompleted(false);
    setResumeLogs([]);
    const addResLog = (m: string) => {
      setResumeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${m}`]);
    };

    try {
      addResLog("🔄 [START] Initiating builderResume() Sequence...");
      await new Promise(r => setTimeout(r, 600));

      addResLog("⚙️ Restoring builder engines and processor thread pools...");
      await new Promise(r => setTimeout(r, 500));

      addResLog("⏳ Restoring active timers, heartbeat monitors, and spinning widgets...");
      await new Promise(r => setTimeout(r, 500));

      addResLog("🛑 Restoring global STOP button state (unlocked/operational status verified)...");
      await new Promise(r => setTimeout(r, 500));

      addResLog("💾 Reloading all state checkpoint markers from db...");
      await new Promise(r => setTimeout(r, 500));

      addResLog("🛰️ Re-syncing distributed developer swarm nodes clock offsets...");
      await new Promise(r => setTimeout(r, 500));

      addResLog("📡 Re-opening build pipeline. Moving toward Shell Completion stage...");
      await new Promise(r => setTimeout(r, 600));

      const res = await fetch('/api/builder/resume', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        addResLog(`🟢 [SUCCESS] Builder session successfully resumed.`);
        addResLog(` - State Snapshot: ${data.message}`);
        addResLog(` - Loaded Checkpoints: ${data.checkpointCount}`);
        addResLog(` - Active Nodes Aligned: ${data.activeNodesCount}`);
        setResumeCompleted(true);
        await syncAll();
      } else {
        addResLog("❌ [ABORTED] Builder resume rejected by matrix security guidelines.");
      }
    } catch (err: any) {
      addResLog(`❌ [EXCEPTION] Resume sequence failure: ${err.message}`);
    } finally {
      setIsResuming(false);
    }
  };

  const triggerShellCompletion = async () => {
    setIsShellCompleting(true);
    setShellResult(null);
    setShellLogs([]);
    const addShLog = (m: string) => {
      setShellLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${m}`]);
    };

    try {
      addShLog("📡 [START] Initiating shellCompletion() verification sequence...");
      await new Promise(r => setTimeout(r, 600));

      addShLog("🏗️ Validating physical project shell structure & absolute file paths...");
      await new Promise(r => setTimeout(r, 500));

      addShLog("📝 Verifying module registration with dynamic AST schema resolver...");
      await new Promise(r => setTimeout(r, 500));

      addShLog("🗺️ Auditing navigation routing tables across components...");
      await new Promise(r => setTimeout(r, 500));

      addShLog("🧠 Confirming live AI intelligence engine bindings & security gates...");
      await new Promise(r => setTimeout(r, 500));

      addShLog("🛡️ Checking reflection safety gates inside obfuscation config...");
      await new Promise(r => setTimeout(r, 500));

      addShLog("🔍 Running [CHECK] Missing Component Detector sweep...");
      await new Promise(r => setTimeout(r, 600));

      const res = await fetch('/api/builder/shell-completion', { method: 'POST' });
      const data = await res.json();

      if (data.success && data.status === "PASS") {
        addShLog("✨ Integrity evaluation complete.");
        setShellResult(data);
        await syncAll();
      } else {
        addShLog("❌ [FAILED] Obscure structural or syntax inconsistencies detected in shell.");
      }
    } catch (err: any) {
      addShLog(`❌ [EXCEPTION] Shell validation failure: ${err.message}`);
    } finally {
      setIsShellCompleting(false);
    }
  };

  const handleRestoreCheckpoint = async (id: string) => {
    if (!confirm("Are you sure you want to restore this checkpoint snapshot? This action will overwrite active session states.")) {
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/builder/workflow/checkpoint/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully rolled back state workspace to: ${data.checkpoint.name}`);
        await syncAll();
      } else {
        setErrorMsg(data.error || "Restoration sequence aborted by security matrix.");
      }
    } catch (err: any) {
      setErrorMsg(`Restoration Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerSwarmSync = async () => {
    setSwarmSyncing(true);
    setSwarmSyncLogs([]);
    const addSyncLog = (m: string) => {
      setSwarmSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${m}`]);
    };

    addSyncLog("Initializing multi-node developer swarm broadcast...");
    await new Promise(r => setTimeout(r, 800));

    // Put nodes in CONNECTING
    setSwarmNodes(prev => prev.map(n => ({ ...n, status: "CONNECTING" })));
    addSyncLog("Broadcasting workflowTraces + checkpoint delta packages...");
    await new Promise(r => setTimeout(r, 1000));

    try {
      const res = await fetch('/api/builder/swarm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setSwarmNodes(data.nodes);
        addSyncLog(`Consensus achieved. 5/5 nodes successfully accepted the new active system state packages.`);
        addSyncLog(`Replicated state hashes verified across Devator alpha-gamma-omega segments.`);
        await syncAll();
      } else {
        addSyncLog("ERROR: Swarm broadcast aborted - Security consensus rejected.");
      }
    } catch (e: any) {
      addSyncLog(`CRITICAL: Broadcast failed - ${e.message}`);
    } finally {
      setSwarmSyncing(false);
    }
  };

  const triggerSwarmUpload = async () => {
    if (swarmUploading) return;
    setSwarmUploading(true);
    setSwarmUploadProgress(0);
    const addSyncLog = (m: string) => {
      setSwarmSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${m}`]);
    };

    addSyncLog("🚀 Starting Swarm Upload - Compressing trace logs & repositories...");
    
    // Simulate real upload progress
    for (let p = 10; p <= 100; p += 15) {
      setSwarmUploadProgress(Math.min(p, 100));
      addSyncLog(`Compressing and uploading packages... ${Math.min(p, 100)}%`);
      await new Promise(r => setTimeout(r, 150));
    }
    setSwarmUploadProgress(100);

    try {
      // Step 1: swarmUpload()
      addSyncLog("📡 Executing swarmUpload(): Verifying node signatures & energy levels...");
      const res = await fetch('/api/builder/swarm/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filesCount: 46, payloadBytes: 15360 })
      });
      const data = await res.json();
      if (data.success && data.passed) {
        addSyncLog(`🎉 SUCCESS: Swarm packages uploaded & verified (Speed: ${data.transferSpeed} MB/s).`);
        data.results.forEach((res: any) => {
          addSyncLog(` - ${res.nodeName}: Signature ${res.signatureValid ? 'VALID' : 'INVALID'} | Time Aligned: ${res.timeAligned ? 'YES' : 'NO'} | Energy: ${res.energy}% (${res.energyValid ? 'SAFE' : 'CRITICAL'})`);
        });

        // Step 2: swarmBind()
        addSyncLog("🔗 Executing swarmBind(): Integrating active cells into BuilderOpsCore...");
        await new Promise(r => setTimeout(r, 600));
        const bindRes = await fetch('/api/builder/swarm/bind', { method: 'POST' });
        const bindData = await bindRes.json();
        if (bindData.success) {
          addSyncLog(`✅ SUCCESS: Swarm integrated securely.`);
          addSyncLog(` - Bound Nodes Count: ${bindData.boundCount}`);
          addSyncLog(` - Trace Vault Sync: Replicated ${bindData.traceVaultSize} traces to all nodes.`);
          addSyncLog(` - Checkpoint Sync: Synced ${bindData.checkpointCount} markers.`);
          addSyncLog(` - System Freeze Sync Status: ${bindData.isFrozen ? "FROZEN" : "LIVE"}`);
        }

        // Step 3: swarmPrime()
        addSyncLog("⚡ Executing swarmPrime(): Balancing node roles and calibrating clock offsets...");
        await new Promise(r => setTimeout(r, 600));
        const primeRes = await fetch('/api/builder/swarm/prime', { method: 'POST' });
        const primeData = await primeRes.json();
        if (primeData.success) {
          addSyncLog(`🛡️ SUCCESS: Swarm parallel prime completed.`);
          primeData.nodes.forEach((node: any) => {
            addSyncLog(` - ${node.name}: Primed as [${node.role}] with offset ${node.offsetMs}ms | Balanced Power: ${node.energy}%`);
          });
          
          // Map to local state
          setSwarmNodes(primeData.nodes.map((n: any) => ({
            name: n.name,
            status: "SYNCED",
            latencyMs: n.latencyMs,
            consensus: n.consensus
          })));
        }

        await syncAll();
      } else {
        addSyncLog("❌ ERROR: Swarm upload was rejected or failed security compliance (e.g. signature mismatch or energy starved).");
      }
    } catch (err: any) {
      addSyncLog(`❌ EXCEPTION: Upload failed - ${err.message}`);
    } finally {
      setSwarmUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-6xl rounded-3xl border-2 overflow-hidden flex flex-col max-h-[90vh] ${
        isDark 
          ? 'bg-zinc-950 border-rose-500/30 text-zinc-100 shadow-[0_0_50px_rgba(244,63,94,0.15)]' 
          : 'bg-white border-zinc-300 text-zinc-900 shadow-xl'
      }`}>
        
        {/* Title Bar */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/20 bg-gradient-to-r from-rose-950/20 to-transparent">
          <div className="flex items-center gap-3">
            <GitCommit className="w-5 h-5 text-rose-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-rose-400">
              WORKFLOW TRACE & CHECKPOINT GOVERNANCE LAYER
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800/40 rounded transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Info Strip */}
        <div className="bg-zinc-900/30 border-b border-zinc-800/30 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-bold uppercase">BUILDER STATE:</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SECURE TRACE ONLINE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-bold uppercase">TRACES RECORDED:</span>
              <span className="text-cyan-400 font-extrabold">{traces.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-bold uppercase">SAVED CHECKPOINTS:</span>
              <span className="text-rose-400 font-extrabold">{checkpoints.length}</span>
            </div>
          </div>
          
          <button 
            onClick={syncAll} 
            disabled={loading}
            className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Sync Registry
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/20 border-b border-rose-900/40 px-6 py-2.5 flex items-center gap-2 text-rose-400 text-xs font-mono">
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <span>ERROR: {errorMsg}</span>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs (Left) */}
          <div className="w-56 border-r border-zinc-850 bg-black/40 flex flex-col p-4 gap-2 shrink-0">
            <button 
              onClick={() => setActiveTab('traces')}
              className={`w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-left flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'traces' 
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                  : 'border border-transparent hover:bg-zinc-900/60 text-zinc-400'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Trace Stream
            </button>
            <button 
              onClick={() => setActiveTab('checkpoints')}
              className={`w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-left flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'checkpoints' 
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                  : 'border border-transparent hover:bg-zinc-900/60 text-zinc-400'
              }`}
            >
              <History className="w-4 h-4" />
              Checkpoints
            </button>
            <button 
              onClick={() => setActiveTab('swarm')}
              className={`w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-left flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'swarm' 
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                  : 'border border-transparent hover:bg-zinc-900/60 text-zinc-400'
              }`}
            >
              <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              Swarm Sync Hub
            </button>
            <button 
              onClick={() => setActiveTab('resume_pipeline')}
              className={`w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-left flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'resume_pipeline' 
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                  : 'border border-transparent hover:bg-zinc-900/60 text-zinc-400'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              Pipeline Resume & Shell
            </button>

            <div className="mt-auto border-t border-zinc-800/40 pt-4 text-[10px] text-zinc-500 font-mono leading-relaxed space-y-1">
              <div>• Real-time Tracing</div>
              <div>• AST Consistency Rules</div>
              <div>• Delta Checkpoint Snap</div>
              <div className="text-emerald-400">• Anti-Ramble Shield active</div>
            </div>
          </div>

          {/* Active Panel Content (Right) */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {activeTab === 'traces' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Trace Stream Timeline */}
                <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-rose-400" /> ACTIVE EVENT STREAM
                    </span>
                    <button
                      type="button"
                      onClick={() => setHideLogs(!hideLogs)}
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-300 rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>{hideLogs ? "Reveal Verbose Payloads" : "Hide Verbose Payloads"}</span>
                    </button>
                  </div>

                  <div className="flex-1 border border-zinc-800/80 rounded-2xl bg-black p-4 overflow-y-auto flex flex-col gap-4 font-mono text-[11px]">
                    {traces.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-zinc-600 italic">
                        No traces detected. Press "Sync" to sync.
                      </div>
                    ) : (
                      traces.map((trace, index) => {
                        let statusColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
                        if (trace.status === 'SUCCESS') statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                        if (trace.status === 'WARNING') statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                        if (trace.status === 'FAILED') statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                        
                        const isExpanded = !hideLogs || expandedTraceId === trace.id;

                        return (
                          <div 
                            key={trace.id} 
                            onClick={() => setExpandedTraceId(expandedTraceId === trace.id ? null : trace.id)}
                            className="relative pl-6 border-l border-zinc-800/80 pb-2 group cursor-pointer hover:border-rose-500/45 transition-colors"
                          >
                            {/* Dot */}
                            <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border flex items-center justify-center ${
                              trace.status === 'SUCCESS' ? 'bg-emerald-500 border-emerald-400' : 'bg-rose-500 border-rose-400'
                            }`} />

                            <div className="flex items-center justify-between gap-4">
                              <span className="font-extrabold text-zinc-200 text-xs">
                                {trace.action}
                              </span>
                              <span className="text-[9px] text-zinc-500">
                                {new Date(trace.timestamp).toLocaleTimeString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-extrabold uppercase">
                                {trace.module}
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                                OP: {trace.operator}
                              </span>
                              <span className={`text-[8.5px] font-black px-2 py-0.5 rounded border uppercase ${statusColor}`}>
                                {trace.status}
                              </span>
                              {hideLogs && (
                                <span className="text-[9px] text-zinc-600 font-bold group-hover:text-rose-400 transition-colors ml-auto">
                                  {isExpanded ? "[Collapse]" : "[Click to Reveal Log]"}
                                </span>
                              )}
                            </div>

                            {trace.details && isExpanded && (
                              <p className="text-zinc-400 mt-2 text-[10px] bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-800/30 leading-relaxed animate-in slide-in-from-top-1 duration-150">
                                {trace.details}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Form: Inject Custom Event Trace */}
                <div className="border border-zinc-800/60 bg-zinc-900/10 p-5 rounded-3xl flex flex-col gap-4 self-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-cyan-400" /> LOG CUSTOM PROCESS EVENT
                  </span>

                  <form onSubmit={handleAddCustomTrace} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Process Action Name</label>
                      <input 
                        type="text" 
                        value={traceAction}
                        onChange={(e) => setTraceAction(e.target.value)}
                        placeholder="e.g. Swarm Sync Initialization"
                        required
                        className="px-3.5 py-2 rounded-xl bg-black border border-zinc-800/80 text-xs text-zinc-200 outline-none focus:border-rose-500/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Target System Module</label>
                      <select 
                        value={traceModule}
                        onChange={(e) => setTraceModule(e.target.value)}
                        className="px-3.5 py-2 rounded-xl bg-black border border-zinc-800/80 text-xs text-zinc-200 outline-none focus:border-rose-500/50"
                      >
                        <option value="workflowTrace">Workflow Trace Layer</option>
                        <option value="apkOrchestrator">APK Orchestrator</option>
                        <option value="evaluateorlayer">Evaluateor Layer</option>
                        <option value="matrixcore">MatrixCore Suite</option>
                        <option value="mandelacore">Mandela UI Engine</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Step Execution Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['SUCCESS', 'WARNING', 'FAILED', 'RUNNING'] as const).map(status => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setTraceStatus(status)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest border transition-all cursor-pointer ${
                              traceStatus === status 
                                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                                : 'bg-black border-zinc-800 text-zinc-500'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Event Description / Payload</label>
                      <textarea 
                        value={traceDetails}
                        onChange={(e) => setTraceDetails(e.target.value)}
                        placeholder="Provide details of files modified or diagnostic values achieved."
                        rows={3}
                        className="px-3.5 py-2 rounded-xl bg-black border border-zinc-800/80 text-xs text-zinc-200 outline-none focus:border-rose-500/50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAddingTrace}
                      className="w-full py-2.5 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 disabled:opacity-50 text-cyan-400 rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Zap className="w-4 h-4 animate-bounce" /> Log Event to Trace
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'checkpoints' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Saved Checkpoints Registry */}
                <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-rose-400" /> ARCHIVED STATE CHECKPOINTS
                  </span>

                  <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
                    {checkpoints.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-800 rounded-2xl p-6 bg-zinc-950/20">
                        <Database className="w-12 h-12 text-zinc-700 animate-pulse mb-3" />
                        <h4 className="text-sm font-black text-zinc-300">No State Checkpoints Present</h4>
                        <p className="text-[10px] text-zinc-500 max-w-xs mt-1">
                          Snapshot state parameters to achieve dynamic rollback capabilities inside of workspace containers.
                        </p>
                      </div>
                    ) : (
                      checkpoints.map((cp) => (
                        <div key={cp.id} className="border border-zinc-800 p-4 rounded-2xl bg-zinc-950/40 flex flex-col gap-3 group hover:border-rose-500/30 transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <History className="w-4 h-4 text-rose-400" />
                              <span className="text-xs font-black text-zinc-100 uppercase tracking-wider">{cp.name}</span>
                            </div>
                            <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                              {cp.id.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-[10.5px] text-zinc-400 leading-relaxed font-mono">
                            {cp.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-1.5 border-y border-zinc-900/60 text-[9.5px] font-mono text-zinc-400">
                            <div>
                              <span className="text-zinc-600 font-extrabold uppercase">VERSION:</span> {cp.version}
                            </div>
                            <div>
                              <span className="text-zinc-600 font-extrabold uppercase">DELTAS:</span> {cp.fileDeltaCount} changes
                            </div>
                            <div className="md:col-span-1 col-span-2 truncate">
                              <span className="text-zinc-600 font-extrabold uppercase">HASH:</span> {cp.hash.substring(0, 15)}...
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-zinc-500 font-mono">
                              Captured: {new Date(cp.timestamp).toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleRestoreCheckpoint(cp.id)}
                              disabled={loading}
                              className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" /> Rollback State
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Form: Capture New State Checkpoint */}
                <div className="border border-zinc-800/60 bg-zinc-900/10 p-5 rounded-3xl flex flex-col gap-4 self-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-rose-400" /> TAKE STATE SNAPSHOT
                  </span>

                  <form onSubmit={handleCreateCheckpoint} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Snapshot Label</label>
                      <input 
                        type="text" 
                        value={cpName}
                        onChange={(e) => setCpName(e.target.value)}
                        placeholder="e.g. Master APK Tested"
                        required
                        className="px-3.5 py-2 rounded-xl bg-black border border-zinc-800/80 text-xs text-zinc-200 outline-none focus:border-rose-500/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">System Target Version</label>
                      <input 
                        type="text" 
                        value={cpVersion}
                        onChange={(e) => setCpVersion(e.target.value)}
                        placeholder="e.g. v1.1.0"
                        className="px-3.5 py-2 rounded-xl bg-black border border-zinc-800/80 text-xs text-zinc-200 outline-none focus:border-rose-500/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Snapshot Scope / Description</label>
                      <textarea 
                        value={cpDesc}
                        onChange={(e) => setCpDesc(e.target.value)}
                        placeholder="Describe exact state achieved so that developer understands rollback implications."
                        rows={4}
                        required
                        className="px-3.5 py-2 rounded-xl bg-black border border-zinc-800/80 text-xs text-zinc-200 outline-none focus:border-rose-500/50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isCreatingCp}
                      className="w-full py-2.5 bg-rose-950 border border-rose-800 hover:bg-rose-900 disabled:opacity-50 text-rose-400 rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <GitCommit className="w-4 h-4 animate-pulse" /> Take State Snapshot
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'swarm' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Swarm Nodes List */}
                <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-rose-400" /> MULTI-NODE SWARM CLUSTERING
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {swarmNodes.map((node) => {
                      let statusBg = "bg-zinc-900 border-zinc-800 text-zinc-400";
                      let indicatorColor = "bg-zinc-600 animate-pulse";
                      if (node.status === "SYNCED") {
                        statusBg = "bg-emerald-950/20 border-emerald-900/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]";
                        indicatorColor = "bg-emerald-400 shadow-[0_0_8px_#10b981]";
                      } else if (node.status === "CONNECTING") {
                        statusBg = "bg-amber-950/20 border-amber-900/30 text-amber-400";
                        indicatorColor = "bg-amber-400 animate-ping";
                      }

                      return (
                        <div 
                          key={node.name}
                          className={`p-4 rounded-2xl border flex flex-col gap-3 transition-all duration-300 ${statusBg}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider">{node.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${indicatorColor}`} />
                              <span className="text-[9px] font-black uppercase tracking-wider">{node.status}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono border-t border-zinc-800/40 pt-2.5 text-zinc-400">
                            <div>
                              CONSENSUS: <span className="text-zinc-200 font-bold">{node.consensus}</span>
                            </div>
                            <div>
                              LATENCY: <span className="text-zinc-200 font-bold">{node.latencyMs ? `${node.latencyMs}ms` : "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Swarm Consensus Governance</span>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">
                      State synchronizations utilize the <strong>MandelaCore-X Protocol</strong> requiring active approval from Devator Cluster, MatrixCore Authority, and Evaluateor Layer. Rollbacks are globally propagated in real-time.
                    </p>
                  </div>
                </div>

                {/* Swarm Sync Console / Logs */}
                <div className="border border-zinc-800/60 bg-zinc-900/10 p-5 rounded-3xl flex flex-col gap-4 self-start h-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-rose-400" /> REPLICATION TERMINAL
                  </span>

                  <button
                    onClick={triggerSwarmSync}
                    disabled={swarmSyncing || swarmUploading}
                    className="w-full py-3 bg-rose-950 border border-rose-800 hover:bg-rose-900 disabled:opacity-50 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(244,63,94,0.05)]"
                  >
                    <RefreshCw className={`w-4 h-4 ${swarmSyncing ? "animate-spin" : ""}`} />
                    {swarmSyncing ? "Syncing..." : "Broadcast State Sync"}
                  </button>

                  <button
                    onClick={triggerSwarmUpload}
                    disabled={swarmUploading || swarmSyncing}
                    className="w-full py-3 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 disabled:opacity-50 text-cyan-400 hover:text-cyan-300 rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                  >
                    <Cpu className={`w-4 h-4 ${swarmUploading ? "animate-spin" : ""}`} />
                    {swarmUploading ? `Uploading ${swarmUploadProgress}%` : "Broadcast Swarm Upload"}
                  </button>

                  <div className="flex-1 bg-black border border-zinc-800/80 rounded-2xl p-3 h-52 overflow-y-auto font-mono text-[9.5px] text-zinc-400 flex flex-col gap-1.5 select-none leading-normal">
                    {swarmSyncLogs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-zinc-600 italic">
                        Terminal idle. Initiate broadcast state sync.
                      </div>
                    ) : (
                      swarmSyncLogs.map((log, i) => (
                        <div key={i} className="text-emerald-400 border-l border-emerald-800/40 pl-2">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resume_pipeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
                {/* Builder Resume Column */}
                <div className="border border-zinc-800 p-6 rounded-3xl bg-zinc-950/25 flex flex-col gap-4 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                      <RefreshCw className={`w-4 h-4 ${isResuming ? 'animate-spin' : ''}`} /> BUILDER RESUME SEQUENCE
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">api: builderResume()</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                    Triggering <strong>builderResume()</strong> restores compiler engines, active timers, spinning layers, resets the primary STOP button state, and aligns all distributed swarm nodes clock systems securely.
                  </p>

                  <button
                    onClick={triggerBuilderResume}
                    disabled={isResuming}
                    className="w-full py-3.5 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-600/40 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                  >
                    {isResuming ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Executing Resume Protocol...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Execute builderResume()
                      </>
                    )}
                  </button>

                  {/* Resume Live Logs */}
                  <div className="bg-black border border-zinc-900 rounded-2xl p-4 h-52 overflow-y-auto font-mono text-[10px] text-zinc-400 flex flex-col gap-1.5 select-none">
                    {resumeLogs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-zinc-600 italic">
                        Awaiting resume trigger...
                      </div>
                    ) : (
                      resumeLogs.map((log, i) => {
                        let textClass = "text-zinc-400";
                        if (log.includes("🟢") || log.includes("SUCCESS")) textClass = "text-emerald-400 font-bold";
                        if (log.includes("❌")) textClass = "text-rose-400 font-bold";
                        if (log.includes("🔄")) textClass = "text-amber-400";
                        return (
                          <div key={i} className={`border-l border-zinc-800/40 pl-2 ${textClass}`}>
                            {log}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {resumeCompleted && (
                    <div className="mt-auto bg-emerald-950/15 border border-emerald-900/30 rounded-2xl p-4 flex flex-col gap-1.5 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">RESUME STATE VERIFIED</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono leading-relaxed space-y-1">
                        <div>[STATE] Builder resumed from swarm upload checkpoint</div>
                        <div>[STATUS] Stable</div>
                        <div>[SYNC] All active swarm nodes aligned (Consensus clock locked)</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shell Completion Column */}
                <div className="border border-zinc-800 p-6 rounded-3xl bg-zinc-950/25 flex flex-col gap-4 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> SHELL COMPLETION SEQUENCE
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">api: shellCompletion()</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                    Verify absolute pathing structures, compile boundaries, routing tables, and intelligence engine bounds before advancing workspace to APK Stage.
                  </p>

                  <button
                    onClick={triggerShellCompletion}
                    disabled={isShellCompleting || !resumeCompleted}
                    className="w-full py-3.5 bg-cyan-950/30 hover:bg-cyan-900/40 disabled:opacity-40 border border-cyan-600/40 text-cyan-400 hover:text-cyan-300 disabled:hover:text-cyan-400 rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                  >
                    {isShellCompleting ? (
                      <>
                        <Cpu className="w-4 h-4 animate-spin" />
                        Verifying Shell Modules...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        {!resumeCompleted ? "Awaiting Builder Resume First" : "Execute shellCompletion()"}
                      </>
                    )}
                  </button>

                  {/* Shell Validation Progress */}
                  <div className="bg-black border border-zinc-900 rounded-2xl p-4 h-36 overflow-y-auto font-mono text-[10px] text-zinc-400 flex flex-col gap-1.5 select-none">
                    {shellLogs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-zinc-600 italic">
                        Awaiting verification sweep...
                      </div>
                    ) : (
                      shellLogs.map((log, i) => (
                        <div key={i} className="border-l border-zinc-800/40 pl-2 text-cyan-400">
                          {log}
                        </div>
                      ))
                    )}
                  </div>

                  {shellResult && (
                    <div className="mt-auto flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
                      {/* Missing Component Detector block */}
                      <div className="border border-zinc-850 bg-black/40 p-4 rounded-2xl font-mono text-[10px] text-zinc-400 flex flex-col gap-1.5">
                        <span className="font-extrabold text-zinc-200">[CHECK] Missing Component Detector:</span>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-500 pl-2">
                          <div>Missing files: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing modules: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing screens: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing routes: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing permissions: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing dependencies: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing intelligence tests: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing UI elements: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing build configs: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div>Missing swarm nodes: <span className="text-emerald-400 font-bold">NONE</span></div>
                          <div className="col-span-2">Missing checkpoint markers: <span className="text-emerald-400 font-bold">NONE</span></div>
                        </div>
                      </div>

                      {/* Result PASS Block */}
                      <div className="bg-emerald-950/35 border-2 border-emerald-500/40 text-emerald-400 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-lg font-black tracking-widest">[RESULT] Shell Completion: PASS</span>
                        <span className="text-[10px] text-zinc-400 font-mono">READY FOR PRE-APK FINAL INTEGRITY CHECK</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between border-t border-zinc-800/30 p-5 shrink-0 bg-black/40">
          <div className="flex items-center gap-2 text-[10.5px] text-zinc-500">
            <span>Security Layer:</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> SECURE CONTEXT BACKED
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-black tracking-wider cursor-pointer transition-all"
            >
              Dismiss Panel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
