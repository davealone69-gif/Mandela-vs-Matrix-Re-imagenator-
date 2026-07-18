import React, { useState, useEffect } from 'react';
import { 
  X, Brain, ShieldAlert, Cpu, Terminal, Play, PlayCircle, 
  Loader2, RefreshCw, ArrowRight, Activity, Code2, CheckCircle2, 
  AlertTriangle, Bug, Zap, ShieldCheck, Flame, Sliders, 
  ChevronRight, MessageSquare, Layers
} from 'lucide-react';

interface AICoTestingArenaDialogProps {
  isDark: boolean;
  onClose: () => void;
}

interface TestScenario {
  id: string;
  title: string;
  description: string;
  originalCode: string;
  testSuiteCode: string;
  repairedCode: string;
  vulnerabilities: string[];
}

const SCENARIOS: TestScenario[] = [
  {
    id: 'compose_recomp',
    title: 'Compose Recomposition Loop',
    description: 'Creator AI writes an un-memoized mutable state list inside a Canvas draw loop, triggering infinite redraws. Red-Team AI tests for frame rates and CPU thermal bounds.',
    originalCode: `// Creator AI: V1 Draft (Faulty)
@Composable
fun TransactionHistory(transactions: List<Transaction>) {
    // BUG: State redefined inside the render body without remember {}
    val activeFilter = mutableStateOf("ALL")
    
    LazyColumn {
        items(transactions.filter { 
            // Triggering massive re-allocations on every single render
            activeFilter.value == "ALL" || it.type == activeFilter.value 
        }) { item ->
            TransactionRow(item)
        }
    }
}`,
    testSuiteCode: `// Red-Team Tester AI: Dynamic Stress Test Suite
class ComposePerformanceGauntlet {
    @Test
    fun testRecompositionFidelity() {
        val recompositionCount = mutableStateOf(0)
        composeTestRule.setContent {
            TransactionHistory(mockTransactions)
            recompositionCount.value += 1
        }
        
        // Assert no recursive feedback loop is triggered
        composeTestRule.waitForIdle()
        assert(recompositionCount.value < 5) {
            "CRITICAL EXPLOIT: Infinite recomposition loop detected! Count: \${recompositionCount.value}"
        }
    }
}`,
    repairedCode: `// Creator AI: Final Repaired Code (Post-Debate)
@Composable
fun TransactionHistory(transactions: List<Transaction>) {
    // FIX: State hoisted & stabilized using rememberSaveable
    var activeFilter by rememberSaveable { mutableStateOf("ALL") }
    
    // FIX: Filtering memoized to avoid allocations during recomposition
    val filteredTransactions = remember(transactions, activeFilter) {
        transactions.filter { activeFilter == "ALL" || it.type == activeFilter }
    }
    
    LazyColumn {
        items(filteredTransactions, key = { it.id }) { item ->
            TransactionRow(item)
        }
    }
}`,
    vulnerabilities: [
        'Infinite state allocation inside draw cycles',
        'LazyColumn items re-rendered without stable key binds',
        'Zero-caching of heavy sub-list filtration algorithms'
    ]
  },
  {
    id: 'sqlite_inject',
    title: 'Room Database & SQL Exploitation',
    description: 'Creator AI builds dynamic raw queries for search functionality. Red-Team AI exploits this using database drop statements and unescaped comment markers.',
    originalCode: `// Creator AI: V1 Draft (Faulty)
@Dao
interface AccountDao {
    // BUG: Raw string concatenation vulnerable to malicious injection
    @RawQuery
    fun searchAccountsRaw(query: String): List<Account> {
        val sql = "SELECT * FROM accounts WHERE name LIKE '%" + query + "%'"
        return db.compileStatement(sql).executeAndReturnList()
    }
}`,
    testSuiteCode: `// Red-Team Tester AI: Security Penetration Test Suite
class DatabaseInjectionHarness {
    @Test
    fun testSqlInjectionResilience() {
        val attackQuery = "admin' OR '1'='1' --"
        val compromisedList = accountDao.searchAccountsRaw(attackQuery)
        
        // Assert secret administrator rows are never leaked to arbitrary queries
        assert(compromisedList.none { it.isAdmin }) {
            "CRITICAL SECURITY HOLE: RedTeam successfully bypassed auth queries!"
        }
    }
}`,
    repairedCode: `// Creator AI: Final Repaired Code (Post-Debate)
@Dao
interface AccountDao {
    // FIX: Use compiled Room pre-compiled query declarations
    // Room safely compiles statements with secure positional placeholders
    @Query("SELECT * FROM accounts WHERE name LIKE :searchQuery")
    fun searchAccountsSecure(searchQuery: String): List<Account>
    
    // Alternative for flexible queries using SupportSQLiteQuery parameter
    @RawQuery
    fun searchAccountsSafely(query: SupportSQLiteQuery): List<Account>
}`,
    vulnerabilities: [
        'Dynamic RawQuery string concatenation',
        'Absence of SQL query parameter binding or placeholders',
        'Unauthorized elevation of database read permissions'
    ]
  },
  {
    id: 'coroutine_leak',
    title: 'Asynchronous Memory Leak',
    description: 'Creator AI launches a persistent network polling sequence inside a global daemon scope. Red-Team AI stress tests component lifecycle destructions to trigger memory exhaustion.',
    originalCode: `// Creator AI: V1 Draft (Faulty)
class TransactionViewModel : ViewModel() {
    init {
        // BUG: Coroutine launched in GlobalScope instead of viewModelScope
        GlobalScope.launch(Dispatchers.IO) {
            while(true) {
                pollNetworkData()
                delay(3000)
            }
        }
    }
}`,
    testSuiteCode: `// Red-Team Tester AI: Heap Allocation Guard
class LifecycleLeakEvaluator {
    @Test
    fun testViewModelScopeDestruction() {
        var activeLeaksCount = 0
        val leakTracker = LeakCanary.getTracker()
        
        repeat(100) {
            val vm = TransactionViewModel()
            vm.onCleared() // Simulate activity destruction
        }
        
        System.gc()
        activeLeaksCount = leakTracker.findLeakedInstances(TransactionViewModel::class.java)
        
        assert(activeLeaksCount == 0) {
            "HEAVY MEMORY EXHAUSTION: Found \${activeLeaksCount} stale active background tasks!"
        }
    }
}`,
    repairedCode: `// Creator AI: Final Repaired Code (Post-Debate)
class TransactionViewModel : ViewModel() {
    init {
        // FIX: Bound execution directly to the UI-bounded life cycle
        viewModelScope.launch(Dispatchers.IO) {
            while(isActive) { // Safe cancellation hook
                pollNetworkData()
                delay(3000)
            }
        }
    }
}`,
    vulnerabilities: [
        'Unbounded GlobalScope daemon job instantiation',
        'Absence of active cancellation checks (isActive) inside loops',
        'Stale references prevented from Garbage Collector cleanup'
    ]
  }
];

export default function AICoTestingArenaDialog({ isDark, onClose }: AICoTestingArenaDialogProps) {
  const [selectedScenario, setSelectedScenario] = useState<TestScenario>(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [debateRigor, setDebateRigor] = useState<'STANDARD' | 'HARDCORE' | 'CHAOS_MONKEY'>('HARDCORE');
  const [activeTab, setActiveTab] = useState<'debate' | 'codeCompare' | 'vulnerabilities'>('debate');
  
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<{ sender: 'ALPHA' | 'BETA' | 'SYSTEM'; message: string; timestamp: string }[]>([]);
  const [leakRate, setLeakRate] = useState<number>(0);
  const [cpuLoad, setCpuLoad] = useState<number>(12);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState<number>(3);
  const [resolvedStatus, setResolvedStatus] = useState<boolean>(false);

  // Helper for formatted timestamps
  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setLogs([]);
    setProgress(0);
    setResolvedStatus(false);
    setLeakRate(12);
    setCpuLoad(45);
    setVulnerabilitiesFound(selectedScenario.vulnerabilities.length);

    const logList: { sender: 'ALPHA' | 'BETA' | 'SYSTEM'; message: string; timestamp: string }[] = [];
    const triggerLog = (sender: 'ALPHA' | 'BETA' | 'SYSTEM', message: string) => {
      logList.push({ sender, message, timestamp: getTimestamp() });
      setLogs([...logList]);
    };

    // Rigor multiplier
    const speedMultiplier = debateRigor === 'STANDARD' ? 1.0 : debateRigor === 'HARDCORE' ? 0.7 : 0.4;

    // Step 1: Initialize code parsing
    triggerLog('SYSTEM', `⚙️ Initializing Adversarial Testing Loop (Mode: ${debateRigor})`);
    await new Promise(r => setTimeout(r, 600 * speedMultiplier));
    triggerLog('ALPHA', `🟢 Code Base Draft uploaded. Deploying original module: "${selectedScenario.title}" to target VM virtual staging container.`);
    setProgress(15);
    setCpuLoad(55);

    // Step 2: Red Team scan
    await new Promise(r => setTimeout(r, 900 * speedMultiplier));
    triggerLog('BETA', `🛡️ Red-Team Tester initialized. Compiling target code block under intensive automated code-coverage rules.`);
    triggerLog('BETA', `🔍 Parsing structural bounds. Injecting adversarial parameters & boundary test inputs.`);
    setProgress(30);

    // Step 3: Exploit results
    await new Promise(r => setTimeout(r, 1200 * speedMultiplier));
    setCpuLoad(debateRigor === 'CHAOS_MONKEY' ? 98 : 82);
    setLeakRate(85);
    triggerLog('SYSTEM', `⚠️ THREAT ALARM: Exploit test suite has triggered a fatal container reaction.`);
    triggerLog('BETA', `💥 EXPLOIT DETECTED! Test assertions failed. Generated ${selectedScenario.vulnerabilities.length} failure traces.`);
    selectedScenario.vulnerabilities.forEach((vuln, idx) => {
      triggerLog('BETA', `   ↳ EXPLOIT #${idx + 1}: ${vuln}`);
    });
    setProgress(55);

    // Step 4: Alpha repairs
    await new Promise(r => setTimeout(r, 1400 * speedMultiplier));
    triggerLog('ALPHA', `🧠 Reviewing crash reports & stack traces generated by Red-Team AI...`);
    triggerLog('ALPHA', `🔧 Re-architecting structural logic. Re-scoping memory bindings and applying secure pre-compiled parameters.`);
    setProgress(75);
    setCpuLoad(60);

    // Step 5: Red Team re-run
    await new Promise(r => setTimeout(r, 1100 * speedMultiplier));
    triggerLog('BETA', `🔄 Repaired module compiled successfully. Deploying modified build to test VM container.`);
    triggerLog('BETA', `🧪 Re-running full adversarial test assertions...`);
    setProgress(90);

    // Step 6: Final evaluation
    await new Promise(r => setTimeout(r, 1000 * speedMultiplier));
    setCpuLoad(14);
    setLeakRate(0);
    setVulnerabilitiesFound(0);
    setResolvedStatus(true);
    triggerLog('SYSTEM', `✨ SANITIZED: AI debate completed successfully. Zero exploitable paths remaining.`);
    triggerLog('ALPHA', `✅ Optimized production code has been verified and stamped into active codebase metadata.`);
    triggerLog('BETA', `👑 CODE QUALITY CONFIRMED. Excellent response to adversarial feedback loops.`);
    setProgress(100);
    setIsRunning(false);
  };

  useEffect(() => {
    // Reset status when scenario changes
    setLogs([]);
    setProgress(0);
    setResolvedStatus(false);
    setCpuLoad(12);
    setLeakRate(0);
    setVulnerabilitiesFound(selectedScenario.vulnerabilities.length);
  }, [selectedScenario]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl rounded-2xl shadow-[0_0_85px_rgba(168,85,247,0.25)] overflow-hidden flex flex-col max-h-[92vh] ${
        isDark ? 'bg-[#0b0f19] border border-purple-500/35 text-slate-100' : 'bg-white border border-purple-500/30 text-slate-800'
      }`}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-purple-900/30 bg-gradient-to-r from-purple-950/40 via-blue-950/15 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/30 text-purple-400">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wider text-purple-400 uppercase flex items-center gap-2">
                AI-To-AI Multi-Agent Testing Arena & Debugger
              </h3>
              <p className="text-[11px] text-slate-400">Run autonomous feedback loops where AI Creators and AI Attackers refine app fidelity</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-800/60 rounded-lg transition-colors text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WORKSPACE FRAME */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* SIDEBAR SELECTOR */}
          <div className={`w-72 border-r shrink-0 overflow-y-auto p-4 flex flex-col gap-3 ${
            isDark ? 'border-slate-800/60 bg-[#070b13]/60' : 'border-slate-200 bg-slate-50'
          }`}>
            <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase px-1">Testing Target</span>
            
            <div className="flex flex-col gap-2">
              {SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      if (!isRunning) {
                        setSelectedScenario(sc);
                      }
                    }}
                    disabled={isRunning}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                        : 'border-transparent hover:bg-slate-800/20 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-purple-400" /> {sc.title}
                    </span>
                    <span className="text-[9.5px] text-slate-500 line-clamp-2 leading-snug">{sc.description}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-slate-800/50 my-2" />

            <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase px-1">Adversarial Rigor</span>
            <div className="grid grid-cols-3 gap-1">
              {(['STANDARD', 'HARDCORE', 'CHAOS_MONKEY'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => !isRunning && setDebateRigor(r)}
                  disabled={isRunning}
                  className={`py-1.5 px-1 rounded-lg border text-[9px] font-bold text-center transition-all ${
                    debateRigor === r 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                      : 'border-slate-800 text-slate-500 hover:bg-slate-800/20'
                  }`}
                >
                  {r === 'CHAOS_MONKEY' ? '💥 CHAOS' : r === 'HARDCORE' ? '⚡ HARDCORE' : '🛡️ NORMAL'}
                </button>
              ))}
            </div>

            {/* REAL-TIME SIMULATION METRICS */}
            <div className="mt-auto p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Staging Container Status
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-black/40 p-1.5 rounded border border-slate-900">
                  <span className="text-slate-500 block uppercase text-[8px]">CPU Usage</span>
                  <span className={`font-bold ${cpuLoad > 80 ? 'text-rose-400' : cpuLoad > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{cpuLoad}%</span>
                </div>
                <div className="bg-black/40 p-1.5 rounded border border-slate-900">
                  <span className="text-slate-500 block uppercase text-[8px]">Leak Hazard</span>
                  <span className={`font-bold ${leakRate > 50 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>{leakRate}%</span>
                </div>
                <div className="bg-black/40 p-1.5 rounded border border-slate-900">
                  <span className="text-slate-500 block uppercase text-[8px]">Exploits Found</span>
                  <span className={`font-bold ${vulnerabilitiesFound > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{vulnerabilitiesFound}</span>
                </div>
                <div className="bg-black/40 p-1.5 rounded border border-slate-900">
                  <span className="text-slate-500 block uppercase text-[8px]">Fidelity Code</span>
                  <span className={`font-bold ${resolvedStatus ? 'text-emerald-400' : 'text-yellow-400'}`}>{resolvedStatus ? 'SANITIZED' : 'DRAFT_V1'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE CONTENT WORKSPACE */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
            
            {/* STAGE DESCRIPTION & ACTION HEADERS */}
            <div className="flex items-center justify-between shrink-0 bg-slate-950/20 p-4 border border-slate-800/30 rounded-xl">
              <div>
                <h4 className="text-base font-black text-slate-100 mb-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" /> Interactive Multi-Agent Simulator
                </h4>
                <p className="text-xs text-slate-400">Watch the AIs audit logic bugs, compose unit tests, and compile clean patched releases.</p>
              </div>

              <div className="flex items-center gap-2">
                {!isRunning ? (
                  <button 
                    onClick={runSimulation}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-950/45 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 text-white" /> Start Adversarial Battle
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-lg border bg-purple-950/20 border-purple-500/40 text-purple-400 text-xs font-bold flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Adversaries Active...
                  </div>
                )}
              </div>
            </div>

            {/* PROGRESS VISUAL */}
            <div className="h-1.5 bg-slate-950 border border-slate-850 rounded-full overflow-hidden shrink-0 shadow-inner">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            {/* INTERNAL TABS */}
            <div className="flex gap-2 border-b border-slate-800/80 pb-px">
              <button 
                onClick={() => setActiveTab('debate')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'debate' ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                💥 Active Multi-Agent Live Logs
              </button>
              <button 
                onClick={() => setActiveTab('codeCompare')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'codeCompare' ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                📂 Side-by-Side Code Compare
              </button>
              <button 
                onClick={() => setActiveTab('vulnerabilities')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'vulnerabilities' ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                🛡️ Tracked Vulnerability Catalog ({vulnerabilitiesFound})
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-hidden min-h-[300px] flex flex-col">
              
              {/* TAB 1: DEBATE LOGS */}
              {activeTab === 'debate' && (
                <div className="flex-1 bg-black border border-slate-800/80 rounded-xl p-4 overflow-y-auto font-mono text-[11.5px] leading-relaxed flex flex-col gap-2 shadow-inner">
                  {logs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic gap-2 text-center p-8">
                      <Brain className="w-12 h-12 text-slate-800 mb-2 animate-pulse" />
                      <div>The battleground is set. Click "Start Adversarial Battle" to watch Agent Alpha & Agent Beta run dynamic security unit tests on each other's code.</div>
                    </div>
                  ) : (
                    logs.map((log, idx) => {
                      const isAlpha = log.sender === 'ALPHA';
                      const isBeta = log.sender === 'BETA';
                      const isSys = log.sender === 'SYSTEM';

                      return (
                        <div key={idx} className={`p-3 rounded-xl border flex flex-col gap-1 ${
                          isAlpha ? 'bg-indigo-950/20 border-indigo-500/20 text-indigo-200' :
                          isBeta ? 'bg-purple-950/20 border-purple-500/20 text-purple-200' :
                          'bg-slate-900/40 border-slate-800/40 text-slate-400'
                        }`}>
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase select-none opacity-80">
                            <span className="flex items-center gap-1.5">
                              {isAlpha && <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />}
                              {isBeta && <ShieldAlert className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                              {isSys && <Terminal className="w-3.5 h-3.5 text-slate-400" />}
                              {isAlpha ? '🤖 Creator AI (Agent Alpha)' : isBeta ? '💀 Adversarial Red-Team (Agent Beta)' : '⚙️ Automated Test Engine'}
                            </span>
                            <span className="text-[9px] opacity-60 font-mono">{log.timestamp}</span>
                          </div>
                          <div className="whitespace-pre-wrap mt-1 text-slate-300 font-mono">
                            {log.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: CODE COMPARE */}
              {activeTab === 'codeCompare' && (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto pr-1">
                  
                  {/* ORIGINAL DRAFT */}
                  <div className="flex flex-col border border-slate-800/80 bg-slate-950/90 rounded-xl overflow-hidden font-mono text-[11px] h-full min-h-[250px]">
                    <div className="bg-[#111625] px-3 py-2 border-b border-slate-800 text-slate-400 flex justify-between items-center select-none">
                      <span className="font-bold flex items-center gap-1"><Bug className="w-3.5 h-3.5 text-rose-400" /> ALPHA Draft V1</span>
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/25 px-1 rounded text-[9px] font-black">BUGGY</span>
                    </div>
                    <pre className="p-3 text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                      {selectedScenario.originalCode}
                    </pre>
                  </div>

                  {/* ADVERSARIAL TEST SUITE */}
                  <div className="flex flex-col border border-slate-800/85 bg-slate-950/90 rounded-xl overflow-hidden font-mono text-[11px] h-full min-h-[250px]">
                    <div className="bg-[#111625] px-3 py-2 border-b border-slate-800 text-slate-400 flex justify-between items-center select-none">
                      <span className="font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> BETA Exploit Unit Tests</span>
                      <span className="bg-purple-500/10 text-purple-400 border border-purple-500/25 px-1 rounded text-[9px] font-black">ADVERSARIAL</span>
                    </div>
                    <pre className="p-3 text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                      {selectedScenario.testSuiteCode}
                    </pre>
                  </div>

                  {/* REPAIRED CODE */}
                  <div className="flex flex-col border border-slate-800/80 bg-slate-950/90 rounded-xl overflow-hidden font-mono text-[11px] h-full min-h-[250px]">
                    <div className="bg-[#111625] px-3 py-2 border-b border-slate-800 text-slate-400 flex justify-between items-center select-none">
                      <span className="font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Repaired Patch V2</span>
                      <span className={`px-1 rounded text-[9px] font-black border ${
                        resolvedStatus 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse' 
                          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      }`}>
                        {resolvedStatus ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                    <pre className={`p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed transition-all duration-500 ${
                      resolvedStatus ? 'text-slate-300' : 'text-slate-600 italic select-none'
                    }`}>
                      {resolvedStatus ? selectedScenario.repairedCode : '// Repaired build will be generated here once the debate and adversarial execution starts.'}
                    </pre>
                  </div>

                </div>
              )}

              {/* TAB 3: VULNERABILITIES */}
              {activeTab === 'vulnerabilities' && (
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                  {selectedScenario.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/5 flex items-start gap-3.5">
                      <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/30 text-rose-400 mt-0.5 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-xs font-bold text-rose-300">Exploitation Vector #{idx + 1}: {vuln}</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Red-Team AI (Agent Beta) generates static code security assertions targeting this exact memory location or logical gate.
                          During standard code runs, this vulnerability triggers performance degradation, stack overflows, or database exposure.
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[10px]">
                          <span className="text-slate-500">Status:</span>
                          <span className={`font-bold ${resolvedStatus ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                            {resolvedStatus ? '✓ Resolved (Validated by secure Unit Test Assertions)' : '✗ Vulnerable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
