import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, ShieldCheck, Activity, Terminal, RefreshCw, 
  Wrench, CheckCircle, Flame, Heart, AlertTriangle, Play, HelpCircle,
  Eye, CornerDownRight, Milestone, ClipboardCheck, ArrowUpRight
} from 'lucide-react';

interface RecoverySummaryDialogProps {
  isDark: boolean;
  onClose: () => void;
}

interface RecoveryPlan {
  id: string;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  targetModule: string;
  remedyType: string;
  remedyDetails: string;
}

interface SummaryData {
  uptimeSeconds: number;
  totalTraces: number;
  totalCheckpoints: number;
  unresolvedFaultsCount: number;
  healthIndex: number;
  stabilityRating: string;
  activeBuildTime: string;
}

export default function RecoverySummaryDialog({ isDark, onClose }: RecoverySummaryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<RecoveryPlan[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // New states for interactive workflowRecover and workflowSummary
  const [activeSubTab, setActiveSubTab] = useState<'recipes' | 'recover' | 'summaryReport'>('recipes');
  const [snapshot, setSnapshot] = useState<any | null>(null);
  const [summaryReport, setSummaryReport] = useState<any | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [fetchingReport, setFetchingReport] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const fetchSummaryAndPlans = async () => {
    setLoading(true);
    try {
      const [sumRes, plansRes] = await Promise.all([
        fetch('/api/builder/recovery/summary'),
        fetch('/api/builder/recovery/plans')
      ]);
      const sumData = await sumRes.json();
      const plansData = await plansRes.json();

      if (sumData.success) setSummary(sumData.summary);
      if (plansData.success) setPlans(plansData.plans);

      addLog("Successfully retrieved stability summary and recovery matrix.");
    } catch (err: any) {
      addLog(`Failed to fetch recovery metadata: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryAndPlans();
  }, []);

  const executeRecovery = async (planId: string) => {
    setActioningId(planId);
    addLog(`Initiating compiled AST execution for: ${planId}`);
    try {
      const res = await fetch('/api/builder/recovery/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      const data = await res.json();
      if (data.success) {
        addLog(`SUCCESS: ${data.message}`);
        await fetchSummaryAndPlans();
      } else {
        addLog(`ERROR: Recovery recipe failed - ${data.error}`);
      }
    } catch (err: any) {
      addLog(`CRITICAL: Recovery exception - ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const triggerWorkflowRecover = async () => {
    setRecovering(true);
    addLog("Executing workflowRecover() stage alignment...");
    try {
      const res = await fetch('/api/builder/recovery/recover');
      const data = await res.json();
      if (data.success) {
        setSnapshot(data.snapshot);
        addLog(`SUCCESS: Determined exact build stage position -> [${data.snapshot.exactStage}]`);
      } else {
        addLog("ERROR: workflowRecover was unable to align stage baselines.");
      }
    } catch (err: any) {
      addLog(`CRITICAL: exception during workflowRecover() - ${err.message}`);
    } finally {
      setRecovering(false);
    }
  };

  const triggerWorkflowSummary = async () => {
    setFetchingReport(true);
    addLog("Executing workflowSummary() ending-cycle reporting...");
    try {
      const res = await fetch('/api/builder/recovery/trigger-summary');
      const data = await res.json();
      if (data.success) {
        setSummaryReport(data.summaryReport);
        addLog("SUCCESS: Compiled and closed active build summary report.");
      } else {
        addLog("ERROR: workflowSummary reporting routine failed.");
      }
    } catch (err: any) {
      addLog(`CRITICAL: exception during workflowSummary() - ${err.message}`);
    } finally {
      setFetchingReport(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-6xl rounded-3xl border-2 overflow-hidden flex flex-col max-h-[88vh] ${
        isDark 
          ? 'bg-zinc-950 border-rose-500/30 text-zinc-100 shadow-[0_0_50px_rgba(244,63,94,0.15)]' 
          : 'bg-white border-zinc-300 text-zinc-900 shadow-xl'
      }`}>
        
        {/* Title Bar */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/20 bg-gradient-to-r from-rose-950/20 to-transparent">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-rose-500">
              RECOVERY & STABILITY SUMMARY LAYER
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800/40 rounded transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col flex-1 overflow-hidden gap-6">
          
          {/* Top Summary Widgets */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">HEALTH INDEX</div>
                <div className="text-xl font-mono font-black text-rose-400 tracking-wider mt-0.5">
                  {summary.healthIndex}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">STABILITY RATING</div>
                <div className="text-sm font-black text-emerald-400 mt-1 uppercase tracking-widest">
                  {summary.stabilityRating}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">ACTIVE RECORDED STATE</div>
                <div className="text-xs font-mono font-black text-zinc-300 mt-1 uppercase truncate">
                  {summary.totalCheckpoints} Snapshots
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">SESSION VOLUMETRICS</div>
                <div className="text-xs font-mono font-black text-cyan-400 mt-1 uppercase">
                  {summary.totalTraces} Event Traces
                </div>
              </div>
            </div>
          )}

          {/* Tab Selection Bar */}
          <div className="flex gap-2 p-1 bg-zinc-900/60 border border-zinc-850 rounded-2xl shrink-0">
            {[
              { id: 'recipes', label: '1. Active Recovery Recipes', icon: Wrench },
              { id: 'recover', label: '2. workflowRecover() Platform', icon: Milestone },
              { id: 'summaryReport', label: '3. workflowSummary() Report', icon: ClipboardCheck }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeSubTab === t.id 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Main workspace layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
            
            {/* Left Column content based on sub-tab */}
            <div className="flex flex-col gap-3 h-full overflow-hidden">
              
              {activeSubTab === 'recipes' && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Wrench className="w-4 h-4 text-rose-500" /> ACTIVE RECOVERY PLANS & RECIPES
                  </span>

                  <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                    {plans.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center border border-zinc-800 rounded-2xl p-6">
                        <Activity className="w-10 h-10 text-zinc-850 animate-bounce mb-2" />
                        <span className="text-xs text-zinc-500">No active recovery plans populated.</span>
                      </div>
                    ) : (
                      plans.map((p) => {
                        let severityBadge = "bg-green-950 text-green-400 border-green-900";
                        if (p.severity === 'MEDIUM') severityBadge = "bg-yellow-950 text-yellow-400 border-yellow-900";
                        if (p.severity === 'HIGH') severityBadge = "bg-rose-950 text-rose-400 border-rose-900";

                        return (
                          <div key={p.id} className="border border-zinc-850 p-4 rounded-2xl bg-zinc-900/10 flex flex-col gap-3 hover:border-zinc-800 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-zinc-200">{p.name}</span>
                                <span className="text-[9px] font-mono text-zinc-500 mt-0.5 uppercase tracking-wider">
                                  TARGET: {p.targetModule} • TYPE: {p.remedyType}
                                </span>
                              </div>
                              <span className={`text-[8.5px] font-mono font-black px-2 py-0.5 rounded border ${severityBadge}`}>
                                {p.severity}
                              </span>
                            </div>
                            
                            <p className="text-[10.5px] text-zinc-400 leading-relaxed font-mono">
                              {p.remedyDetails}
                            </p>

                            <button
                              onClick={() => executeRecovery(p.id)}
                              disabled={actioningId !== null}
                              className="self-start px-4 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                            >
                              {actioningId === p.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Play className="w-3 h-3" />
                              )}
                              Execute Remedy
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}

              {activeSubTab === 'recover' && (
                <div className="flex flex-col gap-4 h-full overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Milestone className="w-4 h-4 text-cyan-400 animate-bounce" /> POSITION SNAPSHOT RECOVERY
                    </span>
                    <button
                      onClick={triggerWorkflowRecover}
                      disabled={recovering}
                      className="px-4 py-2 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-400 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${recovering ? "animate-spin" : ""}`} />
                      Run workflowRecover()
                    </button>
                  </div>

                  <div className="flex-1 bg-zinc-950/40 border border-zinc-850 p-5 rounded-2xl flex flex-col justify-between overflow-y-auto">
                    {snapshot ? (
                      <div className="flex flex-col gap-4 font-mono text-xs">
                        <div className="border-b border-zinc-800 pb-3">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">POSITION IDENTIFICATION STATUS</span>
                          <div className="text-emerald-400 font-extrabold text-sm flex items-center gap-1.5 mt-1">
                            <CheckCircle className="w-4 h-4" /> STATE POSITION ALIGNED SUCCESSFULLY
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl">
                            <span className="text-[9px] text-zinc-500 block">EXACT STAGE POSITION</span>
                            <span className="text-zinc-200 font-black truncate block mt-0.5">{snapshot.exactStage}</span>
                          </div>
                          <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl">
                            <span className="text-[9px] text-zinc-500 block">TARGET CONTEXT MODULE</span>
                            <span className="text-rose-400 font-black truncate block mt-0.5">{snapshot.targetModule.toUpperCase()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl">
                            <span className="text-[9px] text-zinc-500 block">LAST RECORDED OPERATOR</span>
                            <span className="text-cyan-400 font-black block mt-0.5">{snapshot.lastSuccessfulOperator}</span>
                          </div>
                          <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl">
                            <span className="text-[9px] text-zinc-500 block">REMAINING STAGES ESTIMATE</span>
                            <span className="text-zinc-300 font-black block mt-0.5">{snapshot.estimatedRemainingSteps} Modules</span>
                          </div>
                        </div>

                        <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl">
                          <span className="text-[9px] text-zinc-500 block">TIMESTAMP INTEGRITY LOCK</span>
                          <span className="text-zinc-400 text-[11px] block mt-0.5">{snapshot.timestamp}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-2">
                        <Milestone className="w-12 h-12 text-zinc-800 animate-pulse" />
                        <span className="text-zinc-500 text-xs">
                          No stage alignment snapshot compiled.<br/>
                          Press "Run workflowRecover()" above to extract exact positions from the trace vault.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSubTab === 'summaryReport' && (
                <div className="flex flex-col gap-4 h-full overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <ClipboardCheck className="w-4 h-4 text-emerald-400" /> END OF BUILD CYCLE REPORT
                    </span>
                    <button
                      onClick={triggerWorkflowSummary}
                      disabled={fetchingReport}
                      className="px-4 py-2 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${fetchingReport ? "animate-spin" : ""}`} />
                      Compile workflowSummary()
                    </button>
                  </div>

                  <div className="flex-1 bg-zinc-950/40 border border-zinc-850 p-5 rounded-2xl overflow-y-auto">
                    {summaryReport ? (
                      <div className="flex flex-col gap-4 font-mono text-xs">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                          <div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">BUILD CYCLE STATUS</span>
                            <div className="text-emerald-400 font-extrabold text-sm mt-0.5">
                              {summaryReport.completionStatus} ({summaryReport.completionPercentage}%)
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">TOTAL CYCLES Run</span>
                            <div className="text-zinc-200 font-extrabold text-sm mt-0.5">
                              {summaryReport.totalBuildCycles} Cycles
                            </div>
                          </div>
                        </div>

                        {/* Workaround description */}
                        <div className="p-3 bg-rose-950/10 border border-rose-950/35 rounded-xl">
                          <span className="text-[9px] text-rose-400 font-bold block uppercase tracking-widest">WORKAROUND SUMMARY (FAULTS CORRECTED)</span>
                          <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">{summaryReport.workaroundSummary}</p>
                        </div>

                        {/* Faults list */}
                        <div>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">DETECTED FAULTS & REPAIRS APPLIED</span>
                          <div className="flex flex-col gap-2">
                            {summaryReport.faultsList.map((f: any) => (
                              <div key={f.id} className="p-3 bg-black/40 border border-zinc-900 rounded-xl flex flex-col gap-1.5">
                                <div className="flex justify-between text-[10.5px]">
                                  <span className="text-rose-400 font-black">{f.id}: Mismatch Fault</span>
                                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> RESOLVED
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-zinc-400">{f.desc}</p>
                                <div className="text-[9.5px] text-zinc-500 flex items-center gap-1">
                                  <CornerDownRight className="w-3 h-3 text-cyan-400" /> Remedy: {f.fixAction}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Next recommended steps */}
                        <div className="p-3.5 bg-cyan-950/15 border border-cyan-900/30 rounded-xl flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[9px] text-cyan-400 font-bold block uppercase tracking-wider">NEXT RECOMMENDED TRANSITION STEP</span>
                            <span className="text-[11px] text-zinc-200 font-black mt-1 block">{summaryReport.nextStep}</span>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-cyan-400 shrink-0" />
                        </div>

                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-2">
                        <ClipboardCheck className="w-12 h-12 text-zinc-800 animate-pulse" />
                        <span className="text-zinc-500 text-xs">
                          No ending-cycle diagnostics report compiled.<br/>
                          Press "Compile workflowSummary()" above to close and analyze ending build metrics.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Right: Security Console Logs */}
            <div className="flex flex-col gap-3 h-full overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Terminal className="w-4 h-4 text-cyan-400" /> STABILITY SYSTEM CONSOLE LOGS
              </span>

              <div className="flex-1 bg-black border border-zinc-850 rounded-2xl p-4 overflow-y-auto font-mono text-[10px] leading-relaxed flex flex-col gap-1.5 text-zinc-400">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 italic gap-2">
                    <Activity className="w-6 h-6 animate-pulse text-zinc-800" />
                    <span>Stability logs active. Waiting for system events...</span>
                  </div>
                ) : (
                  logs.map((log, index) => {
                    let color = 'text-zinc-500';
                    if (log.includes('SUCCESS')) color = 'text-emerald-400 font-extrabold';
                    if (log.includes('CRITICAL') || log.includes('ERROR')) color = 'text-rose-500 font-black';
                    if (log.includes('Initiating') || log.includes('Executing')) color = 'text-cyan-400 font-bold';
                    return <div key={index} className={color}>{log}</div>;
                  })
                )}
              </div>
            </div>

          </div>

          {/* Bottom row actions */}
          <div className="flex items-center justify-between border-t border-zinc-800/30 pt-4 shrink-0">
            <div className="flex items-center gap-2 text-[10.5px] text-zinc-500 font-mono">
              <span>Security Guarantee:</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> SECURE CONTEXT COMPLIANT
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 bg-rose-950 border border-rose-800 hover:bg-rose-900 text-rose-400 rounded-xl text-xs font-black tracking-wider cursor-pointer transition-all"
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
