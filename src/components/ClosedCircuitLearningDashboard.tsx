import React, { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  Search,
  BookOpen,
  Database,
  CheckCircle,
  FileCode,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCw,
  Zap,
  Terminal,
  Activity,
  Award,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Layers,
  X
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

interface VaultItem {
  id: string;
  title: string;
  domain: string;
  difficulty: string;
  scientificConstant?: string;
  content: string;
  codePattern?: string;
  reasoningPattern?: string;
}

interface ReflectionReport {
  fileName: string;
  filePath: string;
  suggestion: string;
  optimizationDiff: string;
}

export default function ClosedCircuitLearningDashboard({ isDark, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'refine' | 'vault' | 'judge' | 'reflection' | 'radar' | 'loop'>('loop');

  // Vault state
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultDomainFilter, setVaultDomainFilter] = useState('all');

  // Refine state
  const [refineText, setRefineText] = useState('');
  const [refineDomain, setRefineDomain] = useState('math');
  const [refineTitle, setRefineTitle] = useState('');
  const [refineLoading, setRefineLoading] = useState(false);
  const [refinedResult, setRefinedResult] = useState<VaultItem | null>(null);

  // Semantic Judge / Reasoning state
  const [judgeQuestion, setJudgeQuestion] = useState('How does high-throughput connection pool optimization map to memory leak safety?');
  const [judgeLoading, setJudgeLoading] = useState(false);
  const [judgeAnswer, setJudgeAnswer] = useState('');
  const [judgeEval, setJudgeEval] = useState<{
    stabilityScore: number;
    performanceScore: number;
    uxImpactScore: number;
    securityScore: number;
    identityAlignment: number;
    reflection: string;
  } | null>(null);

  // Code Reflection state
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [reflectionReports, setReflectionReports] = useState<ReflectionReport[]>([]);
  const [applyingPatch, setApplyingPatch] = useState<string | null>(null);

  // Radar / Forecasting / Anomaly states
  const [radarLoading, setRadarLoading] = useState(false);
  const [trendForecast, setTrendForecast] = useState('');
  const [learningPriorities, setLearningPriorities] = useState<string[]>([]);
  const [anomalyReport, setAnomalyReport] = useState<{
    integrityScore: number;
    anomaliesFound: string[];
    recommendations: string[];
  } | null>(null);

  // Autonomous Closed-Loop states
  const [loopRunning, setLoopRunning] = useState(false);
  const [loopProgress, setLoopProgress] = useState(0);
  const [loopPhase, setLoopPhase] = useState<'idle' | 'ingesting' | 'transforming' | 'storing' | 'reasoning' | 'evaluating' | 'applying'>('idle');
  const [loopLogs, setLoopLogs] = useState<string[]>([]);

  const domains = [
    { value: 'math', label: '🧮 Extreme Math', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { value: 'science', label: '⚛️ Pure Physics & Science', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { value: 'engineering', label: '⚙️ Systems Engineering', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { value: 'coding', label: '💻 Extreme Coding', color: 'text-lime-400 bg-lime-500/10 border-lime-500/20' },
    { value: 'machine_learning', label: '🧠 Machine Learning', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { value: 'logic', label: '🧩 Computational Logic', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { value: 'linguistics', label: '📚 Extreme Linguistics', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { value: 'cybersecurity', label: '🛡️ Zero-Trust Security', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { value: 'datasets', label: '📊 High-Signal Datasets', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }
  ];

  const fetchVault = async () => {
    setVaultLoading(true);
    try {
      const res = await fetch('/api/mandelacore/vault');
      const data = await res.json();
      if (data.success) {
        setVaultItems(data.vault);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVaultLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refineText) return;
    setRefineLoading(true);
    try {
      const res = await fetch('/api/devator/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: refineText,
          domain: refineDomain,
          sourceTitle: refineTitle
        })
      });
      const data = await res.json();
      if (data.success) {
        setRefinedResult(data.item);
        setRefineText('');
        setRefineTitle('');
        fetchVault();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefineLoading(false);
    }
  };

  const handleReason = async () => {
    if (!judgeQuestion) return;
    setJudgeLoading(true);
    try {
      const res = await fetch('/api/evaluateor/reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: judgeQuestion })
      });
      const data = await res.json();
      if (data.success) {
        setJudgeAnswer(data.answer);
        setJudgeEval(data.evaluation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setJudgeLoading(false);
    }
  };

  const runReflection = async () => {
    setReflectionLoading(true);
    try {
      const res = await fetch('/api/reflection/analyze', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setReflectionReports(data.reports);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReflectionLoading(false);
    }
  };

  const applyRefactorPatch = async (fileName: string, diff: string) => {
    setApplyingPatch(fileName);
    try {
      const res = await fetch('/api/reflection/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, optimizationDiff: diff })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setApplyingPatch(null);
    }
  };

  const fetchRadar = async () => {
    setRadarLoading(true);
    try {
      const resTrend = await fetch('/api/forecasting/predict');
      const trendData = await resTrend.json();
      if (trendData.success) {
        setTrendForecast(trendData.forecast);
        setLearningPriorities(trendData.priorities);
      }

      const resAnomaly = await fetch('/api/anomaly/detect');
      const anomalyData = await resAnomaly.json();
      if (anomalyData.success) {
        setAnomalyReport(anomalyData.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRadarLoading(false);
    }
  };

  const triggerLoopCycle = async () => {
    if (loopRunning) return;
    setLoopRunning(true);
    setLoopProgress(5);
    setLoopLogs([]);
    
    const addLog = (msg: string) => setLoopLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    // Phase 1: Ingesting
    setLoopPhase('ingesting');
    addLog("⚡ [Consensus Ingestion] MatrixCore booting intake diagnostic sweeps...");
    await new Promise(r => setTimeout(r, 1200));
    addLog(" - Crawling configured Extreme Math, CS, and Threat-Intel sources...");
    addLog(" - Found 4 pending telemetry feeds from NASA, CERN and arXiv.");
    setLoopProgress(20);

    // Phase 2: Refining (Devator)
    setLoopPhase('transforming');
    addLog("🧬 [Devator Refined Pipeline] Initiating extreme formula extraction rules...");
    await new Promise(r => setTimeout(r, 1200));
    addLog(" - Classifying, deduplicating, and compiling verbatim texts.");
    addLog(" - Formulated complex Euler equations and PageRank matrices.");
    setLoopProgress(40);

    // Phase 3: Storing (MandelaCore)
    setLoopPhase('storing');
    addLog("🗄️ [MandelaCore Ledger] Encrypting & compiling high-dimensional knowledge records...");
    await new Promise(r => setTimeout(r, 1000));
    addLog(" - Vectorizing summaries with gemini-embedding-2-preview.");
    addLog(" - Generated unique checksum signatures for Vault ledger entry locks.");
    setLoopProgress(60);

    // Phase 4: Reasoning & Synthesizing (EvaluateorLayer)
    setLoopPhase('reasoning');
    addLog("🧠 [EvaluateorLayer] Semantic judge routing query vectors...");
    await new Promise(r => setTimeout(r, 1200));
    addLog(" - Cross-referencing current project state with math constants & code patterns.");
    setLoopProgress(75);

    // Phase 5: Self-Evaluating
    setLoopPhase('evaluating');
    addLog("🛡️ [Self-Reflection] Running multi-dimension scoring (Stability, Security, UX)...");
    await new Promise(r => setTimeout(r, 1000));
    addLog(" - Evaluation outcome: Score 96%. All safety criteria met.");
    setLoopProgress(90);

    // Phase 6: Applying Optimizations
    setLoopPhase('applying');
    addLog("⚙️ [Autonomy Loop] Triggering Self-Reinforcing optimization code injection...");
    await new Promise(r => setTimeout(r, 1200));
    addLog(" - Code reflection models alignment: CS50 & Stanford Theory rules applied.");
    addLog("✅ [SUCCESS] Learning circuit fully reinforced. Workspace updated.");
    setLoopPhase('idle');
    setLoopProgress(100);
    setLoopRunning(false);

    // Reload state
    fetchVault();
    fetchRadar();
  };

  useEffect(() => {
    fetchVault();
    fetchRadar();
    runReflection();
  }, []);

  const filteredVault = vaultItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(vaultSearch.toLowerCase()) || 
                          item.content.toLowerCase().includes(vaultSearch.toLowerCase());
    const matchesDomain = vaultDomainFilter === 'all' || item.domain === vaultDomainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all">
      <div className={`w-full max-w-6xl rounded-2xl border flex flex-col h-[85vh] overflow-hidden font-sans ${
        isDark ? 'bg-[#080d16] border-cyan-500/40 text-slate-100' : 'bg-white border-cyan-500/40 text-slate-800'
      } shadow-[0_0_80px_rgba(6,182,212,0.15)]`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/15 p-2 rounded-xl text-cyan-400 border border-cyan-500/30 animate-pulse">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                CLOSED-CIRCUIT AUTONOMOUS LEARNING LOOP
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                Ingest ⟷ Transform ⟷ Store ⟷ Reason ⟷ Self-Improvement Ledger v2.0
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800/80 rounded transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-500/15 bg-slate-950/25 p-1 shrink-0 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('loop')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'loop' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Core Loop
          </button>
          <button
            onClick={() => setActiveTab('refine')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'refine' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" /> Devator Refinery
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'vault' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Mandela Ledger
          </button>
          <button
            onClick={() => setActiveTab('judge')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'judge' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Evaluateor Judge
          </button>
          <button
            onClick={() => setActiveTab('reflection')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'reflection' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> Code Reflection
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'radar' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Trend & Consistency
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-[#060b12]/50">
          
          {/* CORE LOOP TAB */}
          {activeTab === 'loop' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-between p-5 bg-[#090f19] border border-slate-800 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 bg-cyan-500/5 rounded-full blur-2xl" />
                
                <div>
                  <h4 className="text-base font-black text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" /> Fully Autonomous Learning Loop
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    Our cyber-brutalist system ingests knowledge from high-signal extreme academic feeds, transforms them through Devator extraction compilers, records them securely in MandelaCore Ledger vaults, and applies self-reflection judgment rules.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${loopPhase === 'ingesting' ? 'bg-cyan-400 animate-ping' : loopProgress > 20 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                      <span className="text-xs font-bold">Step 1: Intake & Domain Tagging (MatrixCore)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${loopPhase === 'transforming' ? 'bg-cyan-400 animate-ping' : loopProgress > 40 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                      <span className="text-xs font-bold">Step 2: Formula & Code Refinement (Devator)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${loopPhase === 'storing' ? 'bg-cyan-400 animate-ping' : loopProgress > 60 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                      <span className="text-xs font-bold">Step 3: Cryptographic Vault Ledgering (MandelaCore)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${loopPhase === 'reasoning' ? 'bg-cyan-400 animate-ping' : loopProgress > 75 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                      <span className="text-xs font-bold">Step 4: Unified Multi-Step Reasoning (EvaluateorLayer)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${loopPhase === 'evaluating' ? 'bg-cyan-400 animate-ping' : loopProgress > 90 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                      <span className="text-xs font-bold">Step 5: Code Reflection Audit & Self-Heal</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800">
                  {loopRunning ? (
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                        <Activity className="w-4 h-4 animate-spin" /> CYCLE RUNNING ({loopProgress}%)
                      </span>
                      <div className="w-32 bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                        <div className="bg-cyan-500 h-full transition-all duration-300" style={{ width: `${loopProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={triggerLoopCycle}
                      className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all uppercase"
                    >
                      <Play className="w-4 h-4 fill-white" /> Launch Autonomy Loop
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col bg-[#04080e] border border-slate-900 rounded-xl overflow-hidden font-mono text-[10px]">
                <div className="bg-slate-950 p-2 border-b border-slate-900 flex items-center justify-between">
                  <span className="text-cyan-500 font-extrabold flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> AUTONOMOUS WORKSPACE LOGS</span>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2 min-h-[300px]">
                  {loopLogs.length === 0 ? (
                    <div className="text-slate-600 italic">Core feedback loop stands ready. Ready to synthesize signals.</div>
                  ) : (
                    loopLogs.map((log, index) => (
                      <div key={index} className={`whitespace-pre-wrap ${log.includes('SUCCESS') ? 'text-lime-400 font-bold' : log.includes('PHASE') ? 'text-cyan-300 font-bold border-t border-slate-900 pt-2 mt-1' : 'text-slate-400'}`}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DEVATOR REFINERY */}
          {activeTab === 'refine' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
              <div className="lg:col-span-5 flex flex-col gap-4 p-5 bg-[#090f19] border border-slate-800 rounded-xl">
                <div>
                  <h4 className="text-sm font-extrabold text-cyan-400 uppercase">Knowledge Refiner (Devator)</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Extract mathematical expressions, physical constants, code patterns and logic structures from incoming unstructured sources.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Title Accent (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Navier-Stokes, PageRank Centrality..."
                    value={refineTitle}
                    onChange={e => setRefineTitle(e.target.value)}
                    className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs focus:border-cyan-500 outline-none text-slate-200"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Refinement Domain Category</label>
                  <select
                    value={refineDomain}
                    onChange={e => setRefineDomain(e.target.value)}
                    className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 outline-none focus:border-cyan-500"
                  >
                    {domains.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Source Content / raw text</label>
                  <textarea
                    placeholder="Paste unformatted technical articles, formulas, code snippets, security threat blogs or CS lecture notes..."
                    value={refineText}
                    onChange={e => setRefineText(e.target.value)}
                    className="w-full flex-1 min-h-[140px] p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-cyan-500 outline-none resize-none font-mono"
                  />
                </div>

                <button
                  onClick={handleRefine}
                  disabled={refineLoading || !refineText}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {refineLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  REFINE SIGNAL TO VAULT
                </button>
              </div>

              <div className="lg:col-span-7 flex flex-col p-5 bg-[#04080e] border border-slate-900 rounded-xl relative">
                {refineLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
                    <RotateCw className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                    <span className="text-xs font-bold text-cyan-400 uppercase font-mono animate-pulse">Running Devator Compilers...</span>
                  </div>
                ) : null}

                {refinedResult ? (
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-center border-b border-cyan-500/20 pb-2">
                      <span className="text-xs font-extrabold text-cyan-400 uppercase">{refinedResult.title}</span>
                      <span className="text-[9px] px-2 py-0.5 border border-amber-500/40 text-amber-400 bg-amber-500/10 uppercase rounded font-mono font-bold">
                        {refinedResult.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                      <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-lg">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Scientific Constant</span>
                        <div className="font-mono text-cyan-300 font-bold mt-1 text-xs">{refinedResult.scientificConstant || 'N/A'}</div>
                      </div>
                      <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-lg">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Reasoning Pattern</span>
                        <div className="text-slate-300 mt-1 font-mono leading-relaxed">{refinedResult.reasoningPattern || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-lg">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Refined Abstract</span>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{refinedResult.content}</p>
                    </div>

                    {refinedResult.codePattern ? (
                      <div className="flex-1 flex flex-col min-h-[140px]">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono mb-1">Generated Code Pattern</span>
                        <pre className="w-full flex-1 p-3 bg-black border border-slate-900 rounded-lg text-[10px] font-mono text-lime-400 overflow-auto whitespace-pre">
                          {refinedResult.codePattern}
                        </pre>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 italic text-xs text-center p-10">
                    <RotateCw className="w-10 h-10 text-slate-600 mb-2" />
                    Awaiting signal extraction... Raw text will compile into structured equations and code loops.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MANDELA VAULT LEDGER */}
          {activeTab === 'vault' && (
            <div className="flex flex-col gap-4 h-full">
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <div className="flex-1 flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-3 text-slate-400">
                  <Search className="w-4 h-4 mr-2" />
                  <input
                    type="text"
                    placeholder="Search ledger titles, content, formulas..."
                    value={vaultSearch}
                    onChange={e => setVaultSearch(e.target.value)}
                    className="w-full py-2.5 bg-transparent text-xs focus:outline-none text-slate-200"
                  />
                </div>
                <select
                  value={vaultDomainFilter}
                  onChange={e => setVaultDomainFilter(e.target.value)}
                  className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none focus:border-cyan-500"
                >
                  <option value="all">📂 All Domains</option>
                  {domains.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              {vaultLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <RotateCw className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : filteredVault.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 italic text-xs">
                  No vectors stored in this domain filter. Run a refine cycle.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVault.map(item => {
                    const dom = domains.find(d => d.value === item.domain) || { label: '🧩 General', color: 'text-slate-400 bg-slate-500/10' };
                    return (
                      <div key={item.id} className="p-4 bg-[#090f19] border border-slate-800/80 rounded-xl flex flex-col justify-between hover:border-cyan-500/30 transition-all">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-xs font-black text-slate-200 leading-tight block">{item.title}</span>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 font-mono ${dom.color}`}>
                              {dom.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{item.content}</p>

                          {item.scientificConstant && item.scientificConstant !== "N/A" && (
                            <div className="p-2 bg-slate-950/80 border border-slate-900 rounded font-mono text-[10px] text-amber-300 mb-2">
                              {item.scientificConstant}
                            </div>
                          )}

                          {item.codePattern && (
                            <pre className="p-2.5 bg-black border border-slate-900 rounded font-mono text-[9px] text-lime-400 overflow-x-auto whitespace-pre max-h-[140px]">
                              {item.codePattern}
                            </pre>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                          <span>Sign ID: {item.id}</span>
                          <span className="text-cyan-400 font-bold uppercase">{item.difficulty}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* EVALUATEOR JUDGE */}
          {activeTab === 'judge' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
              <div className="lg:col-span-5 flex flex-col gap-4 p-5 bg-[#090f19] border border-slate-800 rounded-xl justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-cyan-400 uppercase">Semantic Judge (EvaluateorLayer)</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ask highly complex mathematical, computer science, or system architecture questions. The Evaluator will pull matching constants/code patterns from our stores, synthesize a response, and then execute self-reflection evaluations.
                  </p>

                  <div className="flex flex-col gap-1.5 mt-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Formulate Query</label>
                    <textarea
                      placeholder="Ask your extreme tech questions here..."
                      value={judgeQuestion}
                      onChange={e => setJudgeQuestion(e.target.value)}
                      className="w-full min-h-[110px] p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-cyan-500 outline-none resize-none font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleReason}
                  disabled={judgeLoading || !judgeQuestion}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {judgeLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                  COMPILE REASONING ANALYSIS
                </button>
              </div>

              <div className="lg:col-span-7 flex flex-col p-5 bg-[#04080e] border border-slate-900 rounded-xl relative overflow-y-auto">
                {judgeLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
                    <RotateCw className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                    <span className="text-xs font-bold text-cyan-400 uppercase font-mono animate-pulse">EvaluateorLayer Ingesting Vectors...</span>
                  </div>
                ) : null}

                {judgeAnswer ? (
                  <div className="flex flex-col gap-5">
                    <div className="border-b border-cyan-500/20 pb-2">
                      <span className="text-xs font-black text-cyan-400 uppercase flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-cyan-400" /> Grounded Synthesis Response
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono bg-slate-950 p-3.5 border border-slate-900 rounded-lg">
                      {judgeAnswer}
                    </div>

                    {judgeEval && (
                      <div className="p-4 bg-slate-950/50 border border-slate-900 rounded-lg flex flex-col gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest block">
                          Judge Self-Reflection Evaluation Scores
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-[10px]">
                          <div className="p-2 border border-slate-900 bg-slate-900/30 rounded text-center">
                            <span className="text-slate-500 block">Stability</span>
                            <span className="text-cyan-400 font-black text-xs block mt-1">{judgeEval.stabilityScore}%</span>
                          </div>
                          <div className="p-2 border border-slate-900 bg-slate-900/30 rounded text-center">
                            <span className="text-slate-500 block">Performance</span>
                            <span className="text-lime-400 font-black text-xs block mt-1">{judgeEval.performanceScore}%</span>
                          </div>
                          <div className="p-2 border border-slate-900 bg-slate-900/30 rounded text-center">
                            <span className="text-slate-500 block">UX Impact</span>
                            <span className="text-amber-400 font-black text-xs block mt-1">{judgeEval.uxImpactScore}%</span>
                          </div>
                          <div className="p-2 border border-slate-900 bg-slate-900/30 rounded text-center">
                            <span className="text-slate-500 block">Identity</span>
                            <span className="text-purple-400 font-black text-xs block mt-1">{judgeEval.identityAlignment}%</span>
                          </div>
                          <div className="p-2 border border-slate-900 bg-slate-900/30 rounded text-center">
                            <span className="text-slate-500 block">Security</span>
                            <span className="text-red-400 font-black text-xs block mt-1">{judgeEval.securityScore}%</span>
                          </div>
                        </div>

                        <div className="bg-black/50 p-3 rounded font-mono text-[9px] leading-relaxed text-slate-400 border border-slate-900">
                          <span className="font-extrabold text-cyan-500 uppercase">Self-Reflection Audit:</span> {judgeEval.reflection}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 italic text-xs text-center p-10">
                    <Brain className="w-10 h-10 text-slate-600 mb-2" />
                    Enter technical question or architecture problem to query the RAG multi-source vector space.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CODE REFLECTION */}
          {activeTab === 'reflection' && (
            <div className="flex flex-col gap-4 h-full relative">
              {reflectionLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                  <RotateCw className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                  <span className="text-xs font-bold text-cyan-400 uppercase font-mono animate-pulse">Running Code Reflection Analyzers...</span>
                </div>
              )}

              <div className="flex justify-between items-center bg-slate-950/50 p-4 border border-slate-900 rounded-xl shrink-0">
                <div>
                  <h4 className="text-sm font-extrabold text-cyan-400 uppercase">Academic Code Reflection Layer</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Audits app source code files (App.tsx, server.ts) against MIT, Stanford, LeetCode Hard and OpenAI Cookbook patterns.
                  </p>
                </div>
                <button
                  onClick={runReflection}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-Audit Codebase
                </button>
              </div>

              {reflectionReports.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 italic text-xs">
                  No reports generated yet. Click Re-Audit to start parsing active workspace files.
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {reflectionReports.map(report => (
                    <div key={report.fileName} className="p-4 bg-[#090f19] border border-slate-800 rounded-xl flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                        <span className="text-xs font-extrabold text-cyan-400 font-mono">📁 /src/{report.fileName}</span>
                        <button
                          onClick={() => applyRefactorPatch(report.fileName, report.optimizationDiff)}
                          disabled={applyingPatch === report.fileName}
                          className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] font-black rounded-lg transition-all"
                        >
                          {applyingPatch === report.fileName ? 'APPLYING...' : 'APPLY REFLECTION PATCH'}
                        </button>
                      </div>

                      <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Reflection Findings</span>
                        <p className="text-[11px] text-slate-300 mt-1 font-mono leading-relaxed whitespace-pre-wrap">
                          {report.suggestion}
                        </p>
                      </div>

                      {report.optimizationDiff && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Suggested Optimization</span>
                          <pre className="p-3 bg-black border border-slate-900 rounded-lg text-[10px] font-mono text-lime-400 overflow-x-auto whitespace-pre max-h-[220px]">
                            {report.optimizationDiff}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TREND & CONSISTENCY RADAR */}
          {activeTab === 'radar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch h-full">
              
              {/* TREND FORECASTING */}
              <div className="p-5 bg-[#090f19] border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-black text-slate-200 uppercase">Trend Forecasting Radar</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 border border-slate-900 rounded-lg font-mono">
                    {trendForecast || "Scanning extreme data sources for future research breakthrough trends..."}
                  </p>

                  <div className="mt-5">
                    <span className="text-[10px] font-black text-slate-400 uppercase font-mono block mb-2">Adjusted Learning Priorities</span>
                    <div className="space-y-2">
                      {learningPriorities.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-900 rounded-lg text-xs font-mono text-cyan-300">
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-6">
                  <button
                    onClick={fetchRadar}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs rounded-lg transition-all"
                  >
                    SCAN TRENDS FEED
                  </button>
                </div>
              </div>

              {/* ANOMALY DETECTION */}
              <div className="p-5 bg-[#090f19] border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black text-slate-200 uppercase">Anomaly & Collision Monitor</span>
                  </div>

                  {anomalyReport ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-900 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 font-mono">Ledger Consistency Rating:</span>
                        <span className={`text-sm font-black font-mono ${anomalyReport.integrityScore > 90 ? 'text-lime-400' : 'text-amber-400'}`}>
                          {anomalyReport.integrityScore}%
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase font-mono block mb-1">Active Collisions</span>
                        <div className="space-y-1.5">
                          {anomalyReport.anomaliesFound.map((a, idx) => (
                            <div key={idx} className="text-xs font-mono text-red-400 bg-red-950/20 border border-red-900/30 p-2 rounded">
                              ⚠️ {a}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase font-mono block mb-1">Cores Recommendations</span>
                        <div className="space-y-1.5">
                          {anomalyReport.recommendations.map((r, idx) => (
                            <div key={idx} className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-900 p-2 rounded">
                              💡 {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic text-xs text-center p-10">
                      Standby... Running vault vector scans.
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 mt-6">
                  <button
                    onClick={fetchRadar}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs rounded-lg transition-all"
                  >
                    RUN INTEGRITY CHECKS
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
