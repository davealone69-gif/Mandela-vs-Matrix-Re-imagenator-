import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, BookOpen, Clock, Calendar, CheckCircle, AlertTriangle, Play, 
  Search, Upload, ArrowRight, Sparkles, Database, BarChart3, TrendingUp, 
  Link as LinkIcon, RefreshCw, Send, Loader2, BrainCircuit
} from 'lucide-react';

interface RundownIssue {
  id: string;
  date: string;
  summary: string;
  metadata: {
    date: string;
    topics: string[];
    sentiment: string;
  };
  trends: string[];
  crossLinks: string[];
  timestamp: string;
}

interface IntakeSource {
  id: string;
  name: string;
  category: string;
  description: string;
  sitePattern: string;
  lastFetched: string;
  status: 'Idle' | 'Active' | 'Success' | 'Error';
  itemsCount: number;
}

interface RundownManagerDialogProps {
  isDark: boolean;
  onClose: () => void;
}

export default function RundownManagerDialog({ isDark, onClose }: RundownManagerDialogProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'explorer' | 'intakes' | 'ingest' | 'query'>('explorer');

  // Ingest Form States
  const [uploadText, setUploadText] = useState('');
  const [uploadDate, setUploadDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<any | null>(null);

  // Auto-Update States
  const [isTriggeringAuto, setIsTriggeringAuto] = useState(false);
  const [autoUpdateDate, setAutoUpdateDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Query States
  const [queryInput, setQueryInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<{
    answer: string;
    matches: Array<{
      title?: string;
      category?: string;
      source?: string;
      date?: string;
      content?: string;
      summary?: string;
      similarity: number;
      metadata?: { topics: string[]; sentiment: string };
      trends?: string[];
      crossLinks?: string[];
    }>;
  } | null>(null);

  // Database / Explorer States
  const [issues, setIssues] = useState<RundownIssue[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Intakes States
  const [intakes, setIntakes] = useState<IntakeSource[]>([]);
  const [isLoadingIntakes, setIsLoadingIntakes] = useState(false);
  const [activeIntakeId, setActiveIntakeId] = useState<string | null>(null);
  const [batchStatusText, setBatchStatusText] = useState<string | null>(null);
  const [isBatchIngesting, setIsBatchIngesting] = useState(false);
  const [selectedIntakeCategory, setSelectedIntakeCategory] = useState<string>('All');

  // Fetch all issues on mount
  const fetchIssues = async () => {
    setIsLoadingIssues(true);
    setErrorText(null);
    try {
      const res = await fetch('/api/rundown/issues');
      const data = await res.json();
      if (data.success) {
        setIssues(data.issues);
      } else {
        setErrorText(data.error || 'Failed to fetch issues');
      }
    } catch (err: any) {
      setErrorText(err.message || 'Network error fetching issues');
    } finally {
      setIsLoadingIssues(false);
    }
  };

  // Fetch intake sources
  const fetchIntakes = async () => {
    setIsLoadingIntakes(true);
    try {
      const res = await fetch('/api/intakes');
      const data = await res.json();
      if (data.success) {
        setIntakes(data.sources);
      }
    } catch (err) {
      console.error("Failed to load technical intakes:", err);
    } finally {
      setIsLoadingIntakes(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchIntakes();
  }, []);

  // Trigger manual Daily Auto-Update simulation
  const handleTriggerAutoUpdate = async () => {
    setIsTriggeringAuto(true);
    setErrorText(null);
    try {
      const res = await fetch('/api/rundown/trigger-auto-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: autoUpdateDate })
      });
      const data = await res.json();
      if (data.success) {
        await fetchIssues();
        alert(`Success! Auto-update completed for ${autoUpdateDate}.\nTopics: ${data.data.analysis.topics?.join(', ')}`);
      } else {
        setErrorText(data.error || 'Auto-update failed');
      }
    } catch (err: any) {
      setErrorText(err.message || 'Auto-update trigger failed');
    } finally {
      setIsTriggeringAuto(false);
    }
  };

  // Process manual upload
  const handleUploadPrevious = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadText.trim()) return;

    setIsUploading(true);
    setUploadSuccess(null);
    setUploadProgress([
      '📥 Ingesting raw newsletter text...',
      '🛡️ Checking copyright policy (ensuring non-verbatim storage)...'
    ]);

    try {
      await new Promise(r => setTimeout(r, 600));
      setUploadProgress(prev => [...prev, '📝 Generating high-density, copyright-safe summary...']);
      
      await new Promise(r => setTimeout(r, 800));
      setUploadProgress(prev => [...prev, '🧬 Transforming content: extracting topics and sentiments...']);
      
      await new Promise(r => setTimeout(r, 600));
      setUploadProgress(prev => [...prev, '📈 Detecting emerging tech trends & generating cross-links...']);
      
      await new Promise(r => setTimeout(r, 800));
      setUploadProgress(prev => [...prev, '🔮 Generating semantic vector embedding via gemini-embedding-2-preview...']);

      const res = await fetch('/api/rundown/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: uploadText, date: uploadDate })
      });
      
      const data = await res.json();
      await new Promise(r => setTimeout(r, 400));
      
      if (data.success) {
        setUploadProgress(prev => [...prev, '💾 Encryption complete! Storing safely inside MandelaCore...']);
        await new Promise(r => setTimeout(r, 400));
        setUploadProgress(prev => [...prev, '🎉 Synchronized with standard RAG Knowledge Base. Ingestion complete!']);
        setUploadSuccess(data.stored);
        setUploadText('');
        await fetchIssues();
      } else {
        setUploadProgress(prev => [...prev, `❌ Error: ${data.error}`]);
      }
    } catch (err: any) {
      setUploadProgress(prev => [...prev, `❌ Network exception: ${err.message}`]);
    } finally {
      setIsUploading(false);
    }
  };

  // Run Semantic query search across standard RAG (covers journals too!)
  const handleSearchQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setIsQuerying(true);
    setQueryResult(null);
    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryInput, customK: 5, customThreshold: 0.2 })
      });
      const data = await res.json();
      if (data.success) {
        setQueryResult({
          answer: data.answer,
          matches: data.matches
        });
      } else {
        setErrorText(data.error || 'Failed to query RAG');
      }
    } catch (err: any) {
      setErrorText(err.message || 'Error executing search');
    } finally {
      setIsQuerying(false);
    }
  };

  // Trigger individual intake source
  const triggerIntake = async (id: string) => {
    setActiveIntakeId(id);
    try {
      const res = await fetch('/api/intakes/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        await fetchIntakes();
        await fetchIssues(); // In case we want to reload
      } else {
        alert(`Intake failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Intake Exception: ${err.message}`);
    } finally {
      setActiveIntakeId(null);
    }
  };

  // Run all intakes sequentially (Master Batch Ingestion)
  const triggerBatchIntakes = async () => {
    setIsBatchIngesting(true);
    setBatchStatusText("Initializing system ingestion pool...");
    try {
      for (const source of intakes) {
        setBatchStatusText(`In progress: [${source.name}] - Fetching zero-ideology signal...`);
        const res = await fetch('/api/intakes/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: source.id })
        });
        const data = await res.json();
        if (data.success) {
          await fetchIntakes();
        }
      }
      setBatchStatusText("🎉 Core Multi-Source Batch Ingest Completed Successfully!");
      setTimeout(() => setBatchStatusText(null), 5000);
    } catch (err: any) {
      setBatchStatusText(`❌ Batch processing halted: ${err.message}`);
    } finally {
      setIsBatchIngesting(false);
    }
  };

  // Reset intakes
  const resetIntakeSources = async () => {
    if (!confirm("Are you sure you want to reset all technical publication intakes to system defaults?")) return;
    setIsLoadingIntakes(true);
    try {
      const res = await fetch('/api/intakes/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchIntakes();
      }
    } catch (err: any) {
      console.error("Failed to reset intakes:", err);
    } finally {
      setIsLoadingIntakes(false);
    }
  };

  // Group intakes by category
  const categories = [
    'All', 
    'Extreme Math', 
    'Extreme Science', 
    'Extreme English', 
    'Extreme Mechanical & Engineering', 
    'Extreme Coding & Logic', 
    'Extreme AI & Machine Learning', 
    'Extreme Cybersecurity & Zero-Trust', 
    'Extreme Datasets'
  ];
  const filteredIntakes = selectedIntakeCategory === 'All' 
    ? intakes 
    : intakes.filter(item => item.category === selectedIntakeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-5xl h-[90vh] bg-slate-950 border-2 border-emerald-500 rounded-none shadow-[0_0_25px_rgba(16,185,129,0.3)] flex flex-col text-slate-100 font-mono overflow-hidden"
      >
        {/* Header - Brutalist bar */}
        <div className="p-4 bg-emerald-950/40 border-b-2 border-emerald-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <h2 className="text-sm font-black tracking-widest text-emerald-400">MANDELACORE // TECHNICAL INTELLIGENCE INTAKE</h2>
              <p className="text-[10px] text-slate-400">ZERO-IDEOLOGY PURE SCIENTIFIC SIGNAL FEED & DEEP VECTOR KNOWLEDGE BASE</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 border border-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dashboard Status Sub-bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] text-slate-400">AUTO-SCHEDULER:</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 border border-emerald-900">ACTIVE [06:00 Perth]</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400">STORAGE CORES:</span>
            <span className="text-slate-200 font-bold text-[10px]">MandelaCore & RAG VectorSpace</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400">ACTIVE INTAKE CHANNELS:</span>
            <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 border border-cyan-900">{intakes.length} Sources</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex-1 py-3 text-[11px] font-black tracking-wider border-r border-slate-800 transition-all ${
              activeTab === 'explorer' 
                ? 'bg-emerald-500 text-black border-b-2 border-transparent' 
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
            }`}
          >
            📂 RUNDOWN ISSUES ({issues.length})
          </button>
          <button
            onClick={() => setActiveTab('intakes')}
            className={`flex-1 py-3 text-[11px] font-black tracking-wider border-r border-slate-800 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'intakes' 
                ? 'bg-emerald-500 text-black border-b-2 border-transparent' 
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
            }`}
          >
            📡 ZERO-IDEOLOGY INTAKES
            <span className="bg-slate-900 text-[9px] text-emerald-400 px-1.5 py-0.5 border border-slate-800">
              {intakes.filter(i => i.itemsCount > 0).length} / {intakes.length} Active
            </span>
          </button>
          <button
            onClick={() => setActiveTab('ingest')}
            className={`flex-1 py-3 text-[11px] font-black tracking-wider border-r border-slate-800 transition-all ${
              activeTab === 'ingest' 
                ? 'bg-emerald-500 text-black border-b-2 border-transparent' 
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
            }`}
          >
            📥 MANUAL BACKFILL
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`flex-1 py-3 text-[11px] font-black tracking-wider transition-all ${
              activeTab === 'query' 
                ? 'bg-emerald-500 text-black border-b-2 border-transparent' 
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
            }`}
          >
            🔍 EVALUATOR DEEP QUERY
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
          {errorText && (
            <div className="p-3 bg-rose-950/40 border border-rose-500 text-rose-400 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* TAB: ZERO-IDEOLOGY INTAKES */}
          {activeTab === 'intakes' && (
            <div className="space-y-6">
              {/* Top bar controls */}
              <div className="p-4 border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-black text-emerald-400">PURE SIGNAL INTAKE CONTROLS</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Trigger a Google Search Grounded crawl targeting exact domains. This bypasses opinion layers and extracts raw mathematical research, performance parameters, and chip blueprints to feed the RAG memory space.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={triggerBatchIntakes}
                    disabled={isBatchIngesting}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-black font-black text-xs flex items-center gap-2 transition-all cursor-pointer border border-emerald-600"
                  >
                    {isBatchIngesting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        INGESTING BATCH...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        INGEST ALL {intakes.length} SOURCES
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetIntakeSources}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition-all"
                  >
                    RESET FEEDS
                  </button>
                </div>
              </div>

              {/* Ingestion Batch Status Banner */}
              {batchStatusText && (
                <div className="p-3 bg-cyan-950/30 border border-cyan-500 text-cyan-300 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span className="font-mono text-[11px]">{batchStatusText}</span>
                </div>
              )}

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedIntakeCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-bold border transition-all ${
                      selectedIntakeCategory === cat
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Intakes Grid */}
              {isLoadingIntakes ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <span className="text-xs">Connecting to tech journal feeds...</span>
                </div>
              ) : filteredIntakes.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-800">
                  No publication intakes matching this category found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredIntakes.map((source) => {
                    const isActive = activeIntakeId === source.id;
                    return (
                      <div 
                        key={source.id}
                        className="p-4 border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Label line */}
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-900 mb-2.5">
                            <span className="text-[9px] font-black tracking-wider text-slate-400 bg-slate-950 px-1.5 py-0.5 border border-slate-900">
                              {source.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${
                                source.status === 'Success' ? 'bg-emerald-500' :
                                source.status === 'Active' ? 'bg-amber-500 animate-pulse' :
                                source.status === 'Error' ? 'bg-rose-500' : 'bg-slate-600'
                              }`} />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">
                                {source.status}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-xs font-black text-emerald-400 tracking-wider flex items-center gap-2">
                            {source.name}
                          </h4>
                          <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed font-sans min-h-[36px]">
                            {source.description}
                          </p>

                          {/* Domain target line */}
                          <div className="mt-3 py-1 px-2 bg-slate-950 border border-slate-900 text-[9px] text-cyan-400 truncate">
                            <span className="text-slate-600">QUERY:</span> {source.sitePattern}
                          </div>
                        </div>

                        {/* Action footer */}
                        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                          <div className="text-[9px] text-slate-500">
                            <div>INGESTIONS: <strong className="text-slate-300">{source.itemsCount}</strong></div>
                            <div className="truncate max-w-[200px]">LAST: {source.lastFetched}</div>
                          </div>

                          <button
                            onClick={() => triggerIntake(source.id)}
                            disabled={isActive || isBatchIngesting}
                            className={`px-3 py-1.5 text-[10px] font-black transition-all ${
                              source.status === 'Success'
                                ? 'bg-emerald-950/60 hover:bg-emerald-500 hover:text-black text-emerald-400 border border-emerald-900'
                                : 'bg-slate-900 hover:bg-emerald-500 hover:text-black text-slate-300 border border-slate-800'
                            }`}
                          >
                            {isActive ? 'INGESTING...' : source.itemsCount > 0 ? 'RE-INGEST' : 'INGEST'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: EXPLORE NEWSLETTER ISSUES */}
          {activeTab === 'explorer' && (
            <div className="space-y-6">
              {/* Trigger Section */}
              <div className="p-4 border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-black text-emerald-400">DAILY RUNDOWN AUTO-INGESTION PIPELINE</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Force a simulation of the 06:00 AM auto-ingestion pipeline for any target date. Uses Search Grounding to generate and summarize live AI news.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="date"
                    value={autoUpdateDate}
                    onChange={(e) => setAutoUpdateDate(e.target.value)}
                    className="p-1.5 bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleTriggerAutoUpdate}
                    disabled={isTriggeringAuto}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-black font-black text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isTriggeringAuto ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        RUNNING...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        RUN AUTO-UPDATE
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ingested List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black tracking-widest text-slate-300">INGESTED INTEL DIRECTORY</h3>
                  <button 
                    onClick={fetchIssues}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh Store
                  </button>
                </div>

                {isLoadingIssues ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    <span className="text-xs">Loading MandelaCore storage cell contents...</span>
                  </div>
                ) : issues.length === 0 ? (
                  <div className="py-12 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                    No newsletter summaries have been ingested yet.
                    <br />
                    Use the Ingestion panel or click Run Auto-Update above to generate the first summary!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <div 
                        key={issue.id}
                        className="border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors p-4 relative"
                      >
                        {/* Title Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-900 mb-3">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-black text-emerald-400">{issue.date}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 font-bold ${
                              issue.metadata?.sentiment === 'Positive' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900' :
                              issue.metadata?.sentiment === 'Negative' ? 'bg-rose-950/80 text-rose-400 border border-rose-950' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              SENTIMENT: {issue.metadata?.sentiment?.toUpperCase() || "NEUTRAL"}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-500">ID: {issue.id}</span>
                        </div>

                        {/* Summary Block */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Copyright-Safe Summary:</span>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 border border-slate-900">
                              {issue.summary}
                            </p>
                          </div>

                          {/* Chips */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px]">
                            {/* Topics */}
                            <div>
                              <span className="text-[9px] text-slate-500 font-bold block mb-1 uppercase">Topics:</span>
                              <div className="flex flex-wrap gap-1">
                                {issue.metadata?.topics?.map((topic, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-slate-900 text-cyan-400 border border-slate-800">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {/* Trends */}
                            <div>
                              <span className="text-[9px] text-slate-500 font-bold block mb-1 uppercase">Detected Trends:</span>
                              <div className="flex flex-wrap gap-1">
                                {issue.trends?.map((trend, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-slate-900 text-emerald-400 border border-slate-800 flex items-center gap-1">
                                    <TrendingUp className="w-2.5 h-2.5" />
                                    {trend}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {/* Crosslinks */}
                            <div>
                              <span className="text-[9px] text-slate-500 font-bold block mb-1 uppercase">Cross References:</span>
                              <div className="flex flex-wrap gap-1">
                                {issue.crossLinks?.map((link, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-slate-900 text-indigo-400 border border-slate-800 flex items-center gap-1">
                                    <LinkIcon className="w-2.5 h-2.5" />
                                    {link}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MANUAL BACKFILL & INGEST */}
          {activeTab === 'ingest' && (
            <div className="space-y-6">
              <div className="p-4 border border-emerald-900 bg-emerald-950/10">
                <h3 className="text-xs font-black text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  COPYRIGHT-SAFE POLICY VERIFICATION ENGINE
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Our system operates on **strict summary extraction**. The raw text you paste is fed into our server-side summarizer pipeline, and only non-verbatim synthesized summaries, metadata, and 768-dimensional embeddings are preserved. The actual full text is immediately discarded from memory and is never written to disk.
                </p>
              </div>

              <form onSubmit={handleUploadPrevious} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-300 block mb-1">ISSUE DATE</label>
                    <input
                      type="date"
                      required
                      value={uploadDate}
                      onChange={(e) => setUploadDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <span className="text-[10px] text-slate-500 leading-snug">
                      * Ensure the date matches the newsletter's publication date to ensure proper temporal cross-referencing.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-300 block mb-1">RAW NEWSLETTER TEXT</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Paste the raw text of the Rundown newsletter issue here... All paragraphs, lists, and segments are permitted."
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500 font-sans resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUploading || !uploadText.trim()}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-black font-black text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    INGEST OLDER ISSUE
                  </button>
                </div>
              </form>

              {/* Progress Pipeline Visualization */}
              {(isUploading || uploadProgress.length > 0) && (
                <div className="p-4 border border-slate-800 bg-slate-950 text-xs space-y-3">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                    MATRIXCORE ACTIVE PIPELINE
                  </h4>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    {uploadProgress.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-300">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                    {isUploading && (
                      <div className="flex items-center gap-2 text-emerald-400 animate-pulse mt-2 pl-5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>TRANSFORMING & VECTORIZING DATA CELL...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Success Result Summary */}
              {uploadSuccess && (
                <div className="p-4 border-2 border-emerald-500 bg-emerald-950/20 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-[10px]">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Successfully stored in MandelaCore!
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-950 p-2.5 border border-slate-900">
                    <div><strong>Date Ingested:</strong> {uploadSuccess.date}</div>
                    <div><strong>ID Generated:</strong> {uploadSuccess.id}</div>
                    <div><strong>Sentiment:</strong> {uploadSuccess.metadata?.sentiment}</div>
                    <div><strong>Topics Extracted:</strong> {uploadSuccess.metadata?.topics?.join(', ')}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: EVALUATOR DEEP QUERY */}
          {activeTab === 'query' && (
            <div className="space-y-6">
              <div className="p-4 border border-slate-800 bg-slate-900/40">
                <h3 className="text-xs font-black text-cyan-400">EVALUATEOR SEMANTIC SEARCH ENGINE</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Perform semantic search queries across our integrated vector space. Queries are embedded and compared via cosine similarity against daily newsletters AND zero-ideology technical publications (IEEE, ACM, arXiv, Krebs, and more) to extract facts without bias.
                </p>
              </div>

              <form onSubmit={handleSearchQuery} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ask about tech: e.g. 'NVIDIA inference speed improvements' or 'vulnerabilities in core packages'"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isQuerying || !queryInput.trim()}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-black font-black text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isQuerying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  QUERY VECTOR
                </button>
              </form>

              {isQuerying && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <span className="text-xs">Embedding search query & performing multi-source cross-layer synthesis...</span>
                </div>
              )}

              {queryResult && (
                <div className="space-y-5 animate-fade-in">
                  {/* Synthesis answer */}
                  <div className="border border-emerald-500 bg-emerald-950/10 p-4 relative">
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2.5 bg-emerald-500 text-black text-[8px] font-black uppercase px-1.5 py-0.5 tracking-wider">
                      EVALUATEOR SYNTHESIS
                    </div>
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-2">SYNTHESIZED SCIENTIFIC FINDINGS:</h4>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-slate-950/40 p-3 border border-slate-900">
                      {queryResult.answer}
                    </p>
                  </div>

                  {/* Matching summaries */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RETRIEVED VECTOR MATCH CONTEXTS:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {queryResult.matches.map((match, idx) => {
                        const titleText = match.title || (match.category === 'core_android' ? "Core Android Docs" : "Rundown Newsletter");
                        const dateText = match.date || "Ingested Record";
                        const sourceText = match.source ? `Source: ${match.source.toUpperCase()}` : `Rundown Summary`;
                        const mainContent = match.content || match.summary || "";

                        return (
                          <div key={idx} className="border border-slate-800 bg-slate-950 p-3 text-xs">
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-900 mb-2">
                              <span className="font-bold text-emerald-400">Match {idx + 1} - {titleText} ({dateText})</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                                SIMILARITY: {(match.similarity * 100).toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{mainContent}</p>
                            <div className="mt-2 flex flex-wrap gap-1 text-[9px] text-slate-400">
                              <span className="px-1.5 py-0.2 bg-slate-900 border border-slate-850 text-indigo-400 font-bold">{sourceText}</span>
                              {match.category && (
                                <span className="px-1.5 py-0.2 bg-slate-900 border border-slate-850 text-amber-400">CLASS: {match.category.toUpperCase()}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/80 flex items-center justify-between text-[10px] text-slate-500">
          <span>Consensus Guild System Integrity Level: stable</span>
          <span>MandelaCore Ingestion v1.1 [Zero-Ideology-Sync]</span>
        </div>
      </motion.div>
    </div>
  );
}

// Simple Icon fallback
function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
