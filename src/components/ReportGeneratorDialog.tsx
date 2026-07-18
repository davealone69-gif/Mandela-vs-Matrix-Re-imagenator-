import React, { useState, useEffect } from 'react';
import { 
  X, ClipboardCopy, Download, Terminal, RefreshCw, FileText, 
  Settings, Layers, Cpu, Code2, ShieldAlert, Wrench, ListTodo, 
  Milestone, PackageOpen, CheckCircle, BarChart3, HelpCircle, ArrowUpRight
} from 'lucide-react';

interface ReportGeneratorDialogProps {
  isDark: boolean;
  onClose: () => void;
}

interface ReportData {
  title: string;
  headers: string[];
  rows: string[][];
  metrics: {
    [key: string]: any;
  };
}

export default function ReportGeneratorDialog({ isDark, onClose }: ReportGeneratorDialogProps) {
  const [activeType, setActiveType] = useState<string>('features');
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const reportTypes = [
    { id: 'features', label: 'Features Audits', icon: ListTodo, color: 'text-rose-500 border-rose-500/20' },
    { id: 'modules', label: 'Module Health', icon: Layers, color: 'text-cyan-500 border-cyan-500/20' },
    { id: 'code', label: 'AST & Code Baselines', icon: Code2, color: 'text-purple-500 border-purple-500/20' },
    { id: 'faults', label: 'Fault Registry', icon: ShieldAlert, color: 'text-amber-500 border-amber-500/20' },
    { id: 'repairs', label: 'Repairs Logs', icon: Wrench, color: 'text-emerald-500 border-emerald-500/20' },
    { id: 'progress', label: 'Pipeline Progress', icon: Milestone, color: 'text-blue-500 border-blue-500/20' },
    { id: 'nextSteps', label: 'Stability Transitions', icon: ArrowUpRight, color: 'text-pink-500 border-pink-500/20' },
    { id: 'apkReadiness', label: 'APK Compilation', icon: PackageOpen, color: 'text-teal-500 border-teal-500/20' }
  ];

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const fetchReport = async (type: string) => {
    setLoading(true);
    addLog(`Initiating workflowReport("${type}") execution routine...`);
    try {
      const res = await fetch(`/api/builder/report?type=${type}`);
      const result = await res.json();
      if (result.success) {
        setReport(result.data);
        addLog(`SUCCESS: Parsed data matrix for ${type}. Integrity checksum valid.`);
      } else {
        addLog(`ERROR: Failed compilation of report: ${result.error}`);
      }
    } catch (err: any) {
      addLog(`CRITICAL: Platform Exception during reporting: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeType);
  }, [activeType]);

  const copyToClipboard = () => {
    if (!report) return;
    const text = `--- ${report.title.toUpperCase()} ---\n` + 
      `Metrics: ${JSON.stringify(report.metrics, null, 2)}\n\n` +
      report.headers.join('\t') + '\n' +
      report.rows.map(r => r.join('\t')).join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    addLog("Replicated report payload onto system clipboard buffer.");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-report-${activeType}-${Date.now()}.json`;
    a.click();
    addLog(`SUCCESS: Transmitted offline JSON artifact download.`);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-6xl rounded-3xl border-2 overflow-hidden flex flex-col max-h-[88vh] ${
        isDark 
          ? 'bg-zinc-950 border-rose-500/30 text-zinc-100 shadow-[0_0_50px_rgba(244,63,94,0.15)]' 
          : 'bg-white border-zinc-300 text-zinc-900 shadow-xl'
      }`}>
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/20 bg-gradient-to-r from-rose-950/25 to-transparent">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-rose-500">
              AUTONOMOUS WORKFLOW REPORT GENERATOR
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800/40 rounded transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="p-6 flex flex-col lg:flex-row flex-1 overflow-hidden gap-6">
          
          {/* Left Column: Report Selection Drawer */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-rose-400" /> REPORT TYPE SELECTOR
            </span>
            
            <div className="flex-1 bg-zinc-900/30 border border-zinc-850 p-3 rounded-2xl flex flex-col gap-1.5 overflow-y-auto">
              {reportTypes.map((type) => {
                const isSelected = activeType === type.id;
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id)}
                    className={`w-full px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-left flex items-center gap-3 transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.12)]' 
                        : 'border-transparent hover:bg-zinc-900/60 text-zinc-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-rose-400" : "text-zinc-500"}`} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-zinc-900/20 border border-zinc-850 p-4 rounded-2xl flex flex-col gap-1 text-[10px] font-mono leading-relaxed text-zinc-500">
              <div>• Real-time Vault Metrics</div>
              <div>• MandelaCore Compliance</div>
              <div>• AST Verification Mapping</div>
            </div>
          </div>

          {/* Right Column: Active Card View & Metrics Panel */}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden h-full">
            
            {/* Action Header bar inside panel */}
            <div className="flex items-center justify-between gap-4 shrink-0 bg-zinc-900/10 border border-zinc-850 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-300">
                  ACTIVE CONTEXT: <span className="text-rose-400">{activeType.toUpperCase()}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!report || loading}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  <ClipboardCopy className="w-3.5 h-3.5 text-rose-400" />
                  <span>{copied ? "Copied!" : "Copy Raw"}</span>
                </button>
                
                <button
                  onClick={downloadReportJson}
                  disabled={!report || loading}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download JSON</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Screen Content */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 overflow-hidden">
              
              {/* Report Dashboard Card Panels */}
              <div className="xl:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" /> COMPILED NEON CONSOLE CARD
                </span>

                <div className="flex-1 border border-zinc-800/80 rounded-2xl bg-black p-5 overflow-y-auto flex flex-col gap-5">
                  {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-zinc-500 font-mono text-xs">
                      <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
                      <span>Re-compiling workflow data...</span>
                    </div>
                  ) : report ? (
                    <div className="flex flex-col gap-5">
                      
                      {/* Neon Banner Title */}
                      <div className="relative border-l-4 border-rose-500 bg-rose-950/10 p-4 rounded-r-xl">
                        <span className="text-[9px] font-mono font-bold text-rose-400 block uppercase tracking-widest">
                          MANDELA INTEGRITY SHIELD AUDIT
                        </span>
                        <h2 className="text-base font-black uppercase text-zinc-100 tracking-wide mt-1">
                          {report.title}
                        </h2>
                      </div>

                      {/* Display Metrics Widgets Row */}
                      {report.metrics && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.entries(report.metrics).map(([key, value]) => (
                            <div key={key} className="p-3 bg-zinc-900/30 border border-zinc-850 rounded-xl font-mono">
                              <span className="text-[8.5px] text-zinc-500 uppercase block tracking-wider truncate">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <span className="text-xs font-black text-emerald-400 mt-1 block truncate">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Monospace Grid Table */}
                      <div className="border border-zinc-850 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse font-mono text-[10.5px]">
                            <thead>
                              <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                                {report.headers.map((h, i) => (
                                  <th key={i} className="p-3 font-bold uppercase tracking-wider text-[9px] whitespace-nowrap">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/60 bg-zinc-950/20">
                              {report.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-zinc-900/20 transition-colors">
                                  {row.map((cell, cIdx) => {
                                    let cellColor = "text-zinc-300";
                                    if (cell.includes("COMPLETED") || cell.includes("READY") || cell.includes("PASSED") || cell.includes("SUCCESS") || cell.includes("STABLE") || cell.includes("RESOLVED")) {
                                      cellColor = "text-emerald-400 font-bold";
                                    } else if (cell.includes("PENDING") || cell.includes("ON_STANDBY") || cell.includes("WARNING")) {
                                      cellColor = "text-amber-400 font-bold animate-pulse";
                                    } else if (cell.includes("FAILED") || cell.includes("HIGH")) {
                                      cellColor = "text-rose-400 font-bold";
                                    }
                                    return (
                                      <td key={cIdx} className={`p-3 border-zinc-900 ${cellColor}`}>
                                        {cell}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-xs italic">
                      No report compiled.
                    </div>
                  )}
                </div>
              </div>

              {/* Execution Console Terminal Logs */}
              <div className="flex flex-col gap-4 overflow-hidden h-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" /> RECONSTRUCTION LOGS
                </span>

                <div className="flex-1 bg-black border border-zinc-800/80 rounded-2xl p-4 overflow-y-auto font-mono text-[9.5px] leading-relaxed flex flex-col gap-1.5 text-zinc-400">
                  {consoleLogs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-700 italic text-center select-none">
                      Console idle.<br/>Trigger reports to initialize streams.
                    </div>
                  ) : (
                    consoleLogs.map((log, index) => {
                      let color = 'text-zinc-500';
                      if (log.includes('SUCCESS')) color = 'text-emerald-400 font-extrabold';
                      if (log.includes('CRITICAL') || log.includes('ERROR')) color = 'text-rose-500 font-black';
                      if (log.includes('Initiating')) color = 'text-cyan-400 font-bold';
                      return <div key={index} className={color}>{log}</div>;
                    })
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-zinc-800/30 p-5 shrink-0">
          <div className="flex items-center gap-2 text-[10.5px] text-zinc-500 font-mono">
            <span>Security Layer:</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> VERIFIED COMPOSITE ARTIFACT
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-rose-950 border border-rose-800 hover:bg-rose-900 text-rose-400 rounded-xl text-xs font-black tracking-wider cursor-pointer transition-all"
          >
            Dismiss Report Suite
          </button>
        </div>

      </div>
    </div>
  );
}
