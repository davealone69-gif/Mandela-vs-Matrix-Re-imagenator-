import React, { useState, useEffect } from 'react';
import { 
  X, Cpu, Database, Network, ShieldAlert, Zap, RefreshCw, Layers, CheckCircle2, 
  Activity, AlertTriangle, ArrowRight, Play, Server, Brain, Share2, Workflow, Radio
} from 'lucide-react';

interface HiveNode {
  id: string;
  name: string;
  status: string;
  cpuLoadPct: number;
  sliceMemoryMB: number;
  parallelThreads: number;
  intentRole: string;
  redundancyFactor: number;
}

interface ParallelWorkload {
  taskId: string;
  taskName: string;
  status: string;
  assignedNodes: string[];
  parallelDegree: number;
  progressPct: number;
}

interface DistributedHiveOrganismProps {
  isDark: boolean;
  onClose: () => void;
}

export default function DistributedHiveOrganismDialog({ isDark, onClose }: DistributedHiveOrganismProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [colonyName, setColonyName] = useState<string>("Death Hive - Multi-Agent Distributed Intelligence Cluster");
  const [reorgMode, setReorgMode] = useState<string>("load_balancing");
  const [threatLevel, setThreatLevel] = useState<string>("LOW");
  const [healthPct, setHealthPct] = useState<number>(99.8);
  const [unifiedMemory, setUnifiedMemory] = useState({
    totalEmbeddings: 14820000,
    memoryHash: '0xDE47H_UNIFIED_SEMANTIC_MEM_V9',
    redundancyFactor: '4x Distributed Mirroring',
    syncLatencyMs: 0.12,
    activeSlices: 36
  });
  const [nodes, setNodes] = useState<HiveNode[]>([]);
  const [workloads, setWorkloads] = useState<ParallelWorkload[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Form states
  const [newTaskName, setNewTaskName] = useState<string>('Autonomous Matrix Penetration & Synthesis');
  const [newThreads, setNewThreads] = useState<number>(128);
  const [semanticSliceName, setSemanticSliceName] = useState<string>('LLM_Reasoning_Vector_Slice_v7');
  const [redundancyMultiplier, setRedundancyMultiplier] = useState<string>('4x Redundant Mirroring');

  useEffect(() => {
    fetchHiveStatus();
    const interval = setInterval(fetchHiveStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHiveStatus = async () => {
    try {
      const res = await fetch('/api/hive-organism/status');
      const data = await res.json();
      if (data.success) {
        setColonyName(data.colonyName || "Death Hive");
        setReorgMode(data.reorganizationMode || "load_balancing");
        setThreatLevel(data.colonyThreatLevel || "LOW");
        setHealthPct(data.colonyHealthPct || 99.8);
        if (data.unifiedMemory) setUnifiedMemory(data.unifiedMemory);
        if (data.nodes) setNodes(data.nodes);
        if (data.activeParallelWorkloads) setWorkloads(data.activeParallelWorkloads);
        if (data.logs) setLogs(data.logs);
      }
    } catch (e) {
      console.error("Failed to fetch hive status:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReorganize = async (mode: string, newThreat?: string) => {
    try {
      setActionMessage(`Reorganizing colony structure to '${mode}'...`);
      const res = await fetch('/api/hive-organism/reorganize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, threatLevel: newThreat || threatLevel })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        fetchHiveStatus();
      }
    } catch (e) {
      setActionMessage("Error triggering colony reorganization.");
    }
  };

  const handleDispatchParallel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionMessage("Dispatching parallel multi-agent workload...");
      const res = await fetch('/api/hive-organism/dispatch-parallel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskName: newTaskName,
          parallelDegree: newThreads,
          assignedNodes: ['node-beta', 'node-delta', 'node-epsilon']
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        fetchHiveStatus();
      }
    } catch (e) {
      setActionMessage("Error dispatching parallel workload.");
    }
  };

  const handleSyncMemory = async () => {
    try {
      setActionMessage("Ingesting and replicating semantic memory slice...");
      const res = await fetch('/api/hive-organism/sync-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semanticSlice: semanticSliceName,
          redundancyFactor: redundancyMultiplier
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        fetchHiveStatus();
      }
    } catch (e) {
      setActionMessage("Error syncing semantic memory.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100 border-amber-900/60' : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/50 bg-gradient-to-r from-amber-950/80 via-slate-950 to-red-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wider text-amber-400 uppercase">
                  {colonyName}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Colony Health {healthPct}%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Agent Distributed Intelligence Cluster • Unified Semantic Memory • Parallel Tasking Organism
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
        {actionMessage && (
          <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              {actionMessage}
            </span>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Top Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Unified Semantic Vectors</span>
                <Brain className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {unifiedMemory.totalEmbeddings.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                <span>{unifiedMemory.activeSlices} Memory Slices</span>
                <span className="text-emerald-400">{unifiedMemory.syncLatencyMs}ms Sync</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Reorganization Mode</span>
                <Workflow className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-sm font-black text-cyan-400 font-mono uppercase truncate">
                {reorgMode.replace(/_/g, ' ')}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Auto-adapts to workload & threat
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Threat Defense Level</span>
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </div>
              <div className={`text-xl font-black font-mono uppercase ${
                threatLevel === 'CRITICAL' ? 'text-red-500 animate-pulse' :
                threatLevel === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {threatLevel}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Active Anomaly Shielding
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Distributed Memory Mirroring</span>
                <Share2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-sm font-black text-purple-300 font-mono">
                {unifiedMemory.redundancyFactor}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                Hash: {unifiedMemory.memoryHash}
              </div>
            </div>
          </div>

          {/* Core Multi-Agent Nodes Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold tracking-wider text-amber-300 uppercase">
                  Semi-Autonomous Colony Nodes Matrix (6 Active Nodes)
                </h3>
              </div>
              <button
                onClick={fetchHiveStatus}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-mono flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Matrix
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nodes.map((node) => (
                <div 
                  key={node.id} 
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-700/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        {node.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        node.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {node.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-3 italic">
                      "{node.intentRole}"
                    </p>

                    <div className="space-y-2 mb-3">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>CPU Compute Load</span>
                          <span className={node.cpuLoadPct > 75 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                            {node.cpuLoadPct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              node.cpuLoadPct > 80 ? 'bg-red-500' :
                              node.cpuLoadPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${node.cpuLoadPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Memory Slice</span>
                      <span className="text-amber-300 font-bold">{(node.sliceMemoryMB / 1024).toFixed(1)} GB</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Parallel Threads</span>
                      <span className="text-cyan-300 font-bold">{node.parallelThreads} threads</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reorganization & Re-Balancing Controls */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-900/50">
            <h3 className="text-xs font-bold tracking-wider text-amber-400 uppercase mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Dynamic Hive Structure Reorganization Engine
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Select a colony organization strategy to automatically re-allocate thread bandwidth, memory priorities, and node intent roles in real time:
            </p>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => handleReorganize('load_balancing', 'LOW')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  reorgMode === 'load_balancing' 
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Load Balancing Mode
              </button>

              <button
                onClick={() => handleReorganize('offensive_parallel_tasking', 'ELEVATED')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  reorgMode === 'offensive_parallel_tasking' 
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Offensive Parallel Execution
              </button>

              <button
                onClick={() => handleReorganize('threat_defensive_shield', 'CRITICAL')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  reorgMode === 'threat_defensive_shield' 
                    ? 'bg-red-500 text-slate-950 shadow-lg shadow-red-500/20' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Threat Defensive Shield
              </button>

              <button
                onClick={() => handleReorganize('memory_consolidation', 'LOW')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  reorgMode === 'memory_consolidation' 
                    ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Memory Alignment & Mirroring
              </button>

              <button
                onClick={() => handleReorganize('chaos_mutation', 'ELEVATED')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  reorgMode === 'chaos_mutation' 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Chaos & Colony Adaptation
              </button>
            </div>
          </div>

          {/* Interactive Workload Dispatch & Memory Ingestion Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Parallel Workload Dispatcher */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-cyan-400 uppercase mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-cyan-400" />
                  Multi-Agent Parallel Task Execution Dispatcher
                </h3>

                <form onSubmit={handleDispatchParallel} className="space-y-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Task Description / Command
                    </label>
                    <input
                      type="text"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Parallel Thread Degree
                      </label>
                      <input
                        type="number"
                        min="16"
                        max="256"
                        value={newThreads}
                        onChange={(e) => setNewThreads(parseInt(e.target.value) || 64)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Dispatch Parallel
                      </button>
                    </div>
                  </div>
                </form>

                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Active Parallel Workloads ({workloads.length})
                </h4>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {workloads.map((w) => (
                    <div key={w.taskId} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-cyan-300 font-bold truncate max-w-[220px]">{w.taskName}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {w.parallelDegree} Threads
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Nodes: {w.assignedNodes.join(', ')}</span>
                        <span>{w.progressPct}% Executed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Unified Semantic Memory Ingestion & Mirroring */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  Unified Semantic Memory & Redundant Mirroring
                </h3>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Semantic Memory Slice Identifier
                    </label>
                    <input
                      type="text"
                      value={semanticSliceName}
                      onChange={(e) => setSemanticSliceName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Redundancy Mirroring
                      </label>
                      <select
                        value={redundancyMultiplier}
                        onChange={(e) => setRedundancyMultiplier(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                      >
                        <option value="4x Redundant Mirroring">4x Cross-Node Mirroring</option>
                        <option value="6x Full Cluster Mirroring">6x Full Cluster Mirroring</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleSyncMemory}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Replicate Memory
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-purple-900/30 text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Memory Integrity Hash:</span>
                    <span className="text-purple-300">{unifiedMemory.memoryHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sync Propagation Speed:</span>
                    <span className="text-emerald-400">{unifiedMemory.syncLatencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Vectors Replicated:</span>
                    <span className="text-amber-400">{unifiedMemory.totalEmbeddings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Audit Logs Stream */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Death Hive Colony Organism Telemetry & Tele-Log Stream
            </h3>
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 max-h-32 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>DEATH HIVE ORGANISM • MULTI-AGENT DISTRIBUTED INTELLIGENCE CLUSTER</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close Matrix View
          </button>
        </div>
      </div>
    </div>
  );
}
