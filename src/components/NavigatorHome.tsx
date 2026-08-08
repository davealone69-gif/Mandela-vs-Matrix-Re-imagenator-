import React, { useState } from 'react';
import {
  Atom,
  Code2,
  Code,
  Loader2,
  Sparkles,
  Smartphone,
  Terminal,
  Activity,
  TestTube2,
  Gauge,
  ShieldAlert,
  Cpu,
  Boxes,
  Dna,
  Target,
  Brain,
  Award,
  ShieldCheck,
  Globe,
  SmartphoneNfc,
  Layers,
  BrainCircuit,
  RefreshCw,
  Share2,
  Lightbulb,
  Eye,
  BookOpen,
  Shield,
  ArrowRight,
  Flame,
  FolderPlus,
  Download,
  FolderOpen,
  Grid,
  Zap,
  Info,
  ServerCog,
  Network,
  Ghost,
  Folder,
  PlaySquare,
  Trash2,
  Search,
  Plus,
  Edit2,
  Github,
  Wand2,
  GitCommit,
  Heart,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileItem, SavedApp } from '../types';
import FileTree from './FileTree';
import { CyberCrossTechDashboard } from './CyberCrossTechDashboard';

interface NavigatorHomeProps {
  isDark: boolean;
  onNavigate: (page: 'navigation' | 'sandbox' | 'copilot' | 'emulator' | 'console') => void;
  setActiveDialog: (dialog: string | null) => void;
  projectType: 'compose' | 'xml';
  handleSwitchProject: (type: 'compose' | 'xml') => void;
  isCompiling: boolean;
  handleBuildApk: () => void;
  handleSaveApp: () => void;
  handleExportZip: () => void;
  triggerToast: (msg: string) => void;

  // Projects list
  savedApps: SavedApp[];
  handleLoadApp: (app: SavedApp) => void;
  handleDeleteApp?: (id: string) => void;
  handleCreateProject?: () => void;

  // File tree
  files: FileItem[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (name: string, dir: string) => void;
  onRenameFile: (oldPath: string, newName: string) => void;
  onDeleteFile: (path: string) => void;
}

export const NavigatorHome: React.FC<NavigatorHomeProps> = ({
  isDark,
  onNavigate,
  setActiveDialog,
  projectType,
  handleSwitchProject,
  isCompiling,
  handleBuildApk,
  handleSaveApp,
  handleExportZip,
  triggerToast,

  savedApps,
  handleLoadApp,
  handleDeleteApp,
  handleCreateProject,

  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile
}) => {
  const [viewMode, setViewMode] = useState<'circular' | 'bento' | 'cyber'>('cyber');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [hoveredGroupIndex, setHoveredGroupIndex] = useState<number | null>(null);

  // Mandela Reality Shifts & Customizer state overrides
  const [customizerRadius, setCustomizerRadius] = useState(12);
  const [customizerGlow, setCustomizerGlow] = useState(40);
  const [customizerScale, setCustomizerScale] = useState(100);
  const [customizerTheme, setCustomizerTheme] = useState<'neon' | 'matrix' | 'warm' | 'minimal'>('neon');
  const [personaSelected, setPersonaSelected] = useState<'architect' | 'dreamer' | 'reviewer'>('architect');
  const [personaLanguage, setPersonaLanguage] = useState<'formal' | 'poetic' | 'sarcastic'>('formal');

  const [activeGlitch, setActiveGlitch] = useState(false);
  const [matrixRain, setMatrixRain] = useState(false);
  const [uiDistortion, setUiDistortion] = useState(0); // 0 to 10
  const [activeMatrixRoute, setActiveMatrixRoute] = useState('MAIN_ENTRY');
  const [coreRegisters, setCoreRegisters] = useState({
    EVAL_SCORE: 96,
    STABILITY: 99.98,
    UX_IMPACT: 94,
    SECURITY_RATING: 100,
    MATRIX_CORE_HEALTH: 98.7
  });

  const [simulatedLog, setSimulatedLog] = useState<string>('MatrixCore standby. Consensus active.');
  const [activeSubmenuItem, setActiveSubmenuItem] = useState<string | null>(null);

  const [isShowingLatestFeature, setIsShowingLatestFeature] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('Task Manager with Focus Timer');
  const [synthStyleGoal, setSynthStyleGoal] = useState('High-contrast cyberpunk glassmorphism');
  const [synthesizedPromptResult, setSynthesizedPromptResult] = useState('');
  const [isSynthesizingPrompt, setIsSynthesizingPrompt] = useState(false);

  // Local helper handlers for File Explorer buttons
  const handleCreateFileBtn = () => {
    const filename = prompt('Enter new file name (e.g. AppConfig.kt):');
    if (filename) {
      let dir = '';
      if (activeFilePath) {
        const parts = activeFilePath.split('/');
        parts.pop(); // remove file name
        dir = parts.join('/');
      }
      onCreateFile(filename, dir);
      triggerToast(`Created file: ${filename}`);
    }
  };

  const handleRenameFileBtn = () => {
    if (!activeFilePath) {
      triggerToast('Please select a file from the file explorer first!');
      return;
    }
    const currentName = activeFilePath.split('/').pop() || '';
    const newName = prompt(`Rename "${currentName}" to:`, currentName);
    if (newName && newName !== currentName) {
      onRenameFile(activeFilePath, newName);
      triggerToast(`Renamed file to: ${newName}`);
    }
  };

  const handleDeleteFileBtn = () => {
    if (!activeFilePath) {
      triggerToast('Please select a file from the file explorer first!');
      return;
    }
    const currentName = activeFilePath.split('/').pop() || '';
    if (window.confirm(`Are you sure you want to delete "${currentName}"?`)) {
      onDeleteFile(activeFilePath);
      triggerToast(`Deleted file: ${currentName}`);
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter(f =>
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigation Group Configuration for the Circular Orbital Menu (Aligned with Android Menu Hierarchy)
  const navigationGroups = [
    {
      title: 'MatrixCore Console',
      desc: 'Monitor deterministic flows, map compile-time logic routes, and inspect environment variables.',
      icon: Cpu,
      color: 'from-cyan-400 to-blue-500',
      textColor: 'text-cyan-400',
      borderColorHex: '#06b6d4',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      glowColor: 'rgba(6,182,212,0.35)',
      actions: [
        { 
          label: 'State Map', 
          desc: 'Simulate and render current Kotlin FSM finite state transition flow.', 
          action: () => { 
            setActiveSubmenuItem('State Map');
            const routes = ['INITIAL', 'BOOTSTRAP', 'MANDELA_GLITCH', 'DEVATOR_MUTATION', 'EVALUATED_SECURE'];
            const randRoute = routes[Math.floor(Math.random() * routes.length)];
            setActiveMatrixRoute(randRoute);
            setSimulatedLog(`[MatrixCore State Map] Transitioned to state: ${randRoute}`);
            triggerToast(`State Map shifted to ${randRoute}`);
          } 
        },
        { 
          label: 'Logic Routes', 
          desc: 'Map compile-time pathways and safe entry points for compilation.', 
          action: () => { 
            setActiveSubmenuItem('Logic Routes');
            setSimulatedLog('[MatrixCore Logic Routes] Active routes:\n  - /main/entry\n  - /mandela/render\n  - /devator/hot_swap\n  - /evaluateor/audit');
            triggerToast('MatrixCore logic routes loaded.');
          } 
        },
        { 
          label: 'Deterministic Flow', 
          desc: 'Enforce mathematical certainty within execution layers to eliminate race conditions.', 
          action: () => { 
            setActiveSubmenuItem('Deterministic Flow');
            setSimulatedLog('[MatrixCore Flow] Executed deterministic state safety verification logic: 100% SUCCESS.');
            triggerToast('Deterministic execution cycle verified.');
          } 
        },
        { 
          label: 'Core Variables', 
          desc: 'Read dynamic heap parameters, environment flags, and compile parameters.', 
          action: () => { 
            setActiveSubmenuItem('Core Variables');
            setSimulatedLog(`[MatrixCore Registers] Registers:\n  - EVAL_SCORE: ${coreRegisters.EVAL_SCORE}%\n  - STABILITY: ${coreRegisters.STABILITY}%\n  - UX_IMPACT: ${coreRegisters.UX_IMPACT}%\n  - HEALTH: ${coreRegisters.MATRIX_CORE_HEALTH}%`);
            triggerToast('Core memory registers read successfully.');
          } 
        }
      ]
    },
    {
      title: 'Mandela Reality Layer',
      desc: 'Control active scene transitions, test glitch rendering matrices, and calibrate UI distortion bounds.',
      icon: Atom,
      color: 'from-fuchsia-400 to-pink-500',
      textColor: 'text-fuchsia-400',
      borderColorHex: '#ec4899',
      bgColor: 'bg-fuchsia-500/10',
      borderColor: 'border-fuchsia-500/30',
      glowColor: 'rgba(236,72,153,0.35)',
      actions: [
        { 
          label: 'Reality Layers', 
          desc: 'Alternate between standard viewport and multi-scene cyber rendering panels.', 
          action: () => { 
            setActiveSubmenuItem('Reality Layers');
            setSimulatedLog('[MandelaCore Reality] Loading multi-scene depth layer. Matrix active.');
            triggerToast('Switched Mandela Reality view mode.');
          } 
        },
        { 
          label: 'Glitch Effects', 
          desc: 'Inject real-time CRT screen aberrations, matrix code rain, and frame buffer distortion.', 
          action: () => { 
            setActiveSubmenuItem('Glitch Effects');
            setActiveGlitch(true);
            setMatrixRain(prev => !prev);
            setSimulatedLog('[MandelaCore Glitch] CRT Framebuffer glitch signal injected! Auto-healing in 1.5s...');
            triggerToast('Reality shifted! Mandela Glitch injected.');
            setTimeout(() => {
              setActiveGlitch(false);
            }, 1500);
          } 
        },
        { 
          label: 'Scene Shifts', 
          desc: 'Alternate global layout perspectives with dynamic structural scaling.', 
          action: () => { 
            setActiveSubmenuItem('Scene Shifts');
            setSimulatedLog('[MandelaCore Scene] Rotated workspace coordinate nodes to standard perspective.');
            triggerToast('Mandela scene coordinates rotated.');
          } 
        },
        { 
          label: 'UI Distortion Controls', 
          desc: 'Calibrate the flex limits and pixel boundaries for visual glitch elements.', 
          action: () => { 
            setActiveSubmenuItem('UI Distortion Controls');
            const nextDist = (uiDistortion + 3) % 11;
            setUiDistortion(nextDist);
            setSimulatedLog(`[MandelaCore UI] Distortion skew matrix set to coefficient: ${nextDist}`);
            triggerToast(`UI Distortion level set to: ${nextDist}`);
          } 
        }
      ]
    },
    {
      title: 'Devator Mutation Engine',
      desc: 'Define evolutionary code-mod rules, monitor hot-swappable Kotlin structures, and invoke the Refactor compiler.',
      icon: Dna,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-400',
      borderColorHex: '#a855f7',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      glowColor: 'rgba(168,85,247,0.35)',
      actions: [
        { 
          label: 'Mutation Rules', 
          desc: 'Define semantic and syntax boundaries for safe self-healing code generation.', 
          action: () => { 
            setActiveSubmenuItem('Mutation Rules');
            setSimulatedLog('[Devator Mutation] Rules loaded. Prohibit: global singletons, un-audited external APIs, raw SQL injection.');
            triggerToast('Mutation compliance boundaries active.');
          } 
        },
        { 
          label: 'Adaptive Evolution', 
          desc: 'Generate evolutionary prompts and observe the self-modifying code optimizer output.', 
          action: () => { 
            setActiveSubmenuItem('Adaptive Evolution');
            setSimulatedLog('[Devator Evolution] Core is currently parsing Kotlin AST modules to optimize layout memory allocation...');
            triggerToast('Devator adaptive optimization running...');
          } 
        },
        { 
          label: 'Hot‑Swap Modules', 
          desc: 'Instantly swap UI backends from XML layout assets to modern Jetpack Compose.', 
          action: () => { 
            setActiveSubmenuItem('Hot‑Swap Modules');
            const target = projectType === 'compose' ? 'xml' : 'compose';
            handleSwitchProject(target);
            setSimulatedLog(`[Devator Hot-Swap] Successfully hot-swapped runtime UI context to: ${target.toUpperCase()}`);
            triggerToast(`Hot-swapped compiler to ${target.toUpperCase()}`);
          } 
        },
        { 
          label: 'Refactor Engine', 
          desc: 'Decompile local modules and apply modern clean architecture design patterns.', 
          action: () => { 
            setActiveSubmenuItem('Refactor Engine');
            setSimulatedLog('[Devator Refactor] Decompiled AST tree: Removed 12 unused imports, stabilized 3 state loops.');
            triggerToast('Refactor completed successfully.');
          } 
        }
      ]
    },
    {
      title: 'Evaluateor Scoring Panel',
      desc: 'Inspect real-time stability metrics, audit UX performance density, and scan workspace safety vectors.',
      icon: Gauge,
      color: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-400',
      borderColorHex: '#10b981',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      glowColor: 'rgba(16,185,129,0.35)',
      actions: [
        { 
          label: 'Performance Scores', 
          desc: 'Calculate heap garbage collection delays and thread rendering latency.', 
          action: () => { 
            setActiveSubmenuItem('Performance Scores');
            const newScore = Math.floor(Math.random() * 5) + 95; 
            setCoreRegisters(prev => ({ ...prev, EVAL_SCORE: newScore }));
            setSimulatedLog(`[Evaluateor Performance] Calculated score: ${newScore}/100. Memory GC latency: 12ms.`);
            triggerToast(`Performance score recalculated: ${newScore}%`);
          } 
        },
        { 
          label: 'Stability Index', 
          desc: 'Inspect deterministic safety coefficients and uptime ratios.', 
          action: () => { 
            setActiveSubmenuItem('Stability Index');
            setSimulatedLog(`[Evaluateor Stability] Score: ${coreRegisters.STABILITY}% uptime guarantee. 0 unhandled thread terminations.`);
            triggerToast('Stability compliance audit complete.');
          } 
        },
        { 
          label: 'UX Impact', 
          desc: 'Audit viewport element density, typography scales, and accessibility compliance.', 
          action: () => { 
            setActiveSubmenuItem('UX Impact');
            setSimulatedLog(`[Evaluateor UX] Score: ${coreRegisters.UX_IMPACT}%. Touch targets: 100% compliant. Contrast ratios: 10.4:1.`);
            triggerToast('UX Impact metrics active.');
          } 
        },
        { 
          label: 'Security Rating', 
          desc: 'Scan current configurations for sensitive credentials exposure.', 
          action: () => { 
            setActiveSubmenuItem('Security Rating');
            setSimulatedLog('[Evaluateor Security] Scan outcome: 100% SECURE. All credentials successfully encapsulated server-side.');
            triggerToast('Security scanner cleared without warnings.');
          } 
        }
      ]
    },
    {
      title: 'Swarm Intelligence Hub',
      desc: 'Oversee autonomous consensus voting nodes, monitor background micro-agents, and run safety audits.',
      icon: Boxes,
      color: 'from-amber-400 to-orange-500',
      textColor: 'text-amber-400',
      borderColorHex: '#f59e0b',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      glowColor: 'rgba(245,158,11,0.35)',
      actions: [
        { 
          label: 'Agent List', 
          desc: 'Enumerate lightweight, active parallel coroutine agents optimized for task solving.', 
          action: () => { 
            setActiveSubmenuItem('Agent List');
            setSimulatedLog('[Swarm Agents] Active workers:\n  - Swarm_worker_01: Idle\n  - Swarm_worker_02: Auditing rules\n  - Swarm_worker_03: Tracking memory');
            triggerToast('Swarm worker thread list read.');
          } 
        },
        { 
          label: 'Auditor Guilds', 
          desc: 'Review parallel safety constraints from specialized compilation overseers.', 
          action: () => { 
            setActiveSubmenuItem('Auditor Guilds');
            setSimulatedLog('[Swarm Auditors] Security, performance, and UI reality auditors report perfect alignment.');
            triggerToast('Auditor guilds report status: GREEN.');
          } 
        },
        { 
          label: 'Consensus Engine', 
          desc: 'Monitor multi-agent consensus validation and agreement metrics.', 
          action: () => { 
            setActiveSubmenuItem('Consensus Engine');
            setSimulatedLog('[Swarm Consensus] Agreement consensus score: 100% quorum on last 5 layout mutations.');
            triggerToast('Consensus engine quorum certified.');
          } 
        },
        { 
          label: 'Swarm Activity Monitor', 
          desc: 'Track and render real-time communication messages between worker coroutines.', 
          action: () => { 
            setActiveSubmenuItem('Swarm Activity Monitor');
            setSimulatedLog('[Swarm Activity] Processing mesh queue... 14 messages broadcasted per second.');
            triggerToast('Swarm activity monitor initiated.');
          } 
        }
      ]
    },
    {
      title: 'Identity & Theme Engine',
      desc: 'Synthesize highly polished vector branding logos, alter global styling matrices, and align layout typography.',
      icon: Sparkles,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-400',
      borderColorHex: '#f43f5e',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      glowColor: 'rgba(244,63,94,0.35)',
      actions: [
        { 
          label: 'Logo Engine', 
          desc: 'Compile vector design elements for the launcher app icons.', 
          action: () => { 
            setActiveSubmenuItem('Logo Engine');
            setSimulatedLog('[Theme Logo] SVG Launcher icon updated: Cyber-brutalist dual neon vector active.');
            triggerToast('New launcher icon updated in resources.');
          } 
        },
        { 
          label: 'Color Matrix', 
          desc: 'Cycle through distinctive, high-contrast, eye-safe color palettes.', 
          action: () => { 
            setActiveSubmenuItem('Color Matrix');
            const themes: Array<'neon' | 'matrix' | 'warm' | 'minimal'> = ['neon', 'matrix', 'warm', 'minimal'];
            const currentIndex = themes.indexOf(customizerTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            setCustomizerTheme(nextTheme);
            if (nextTheme === 'neon') {
              setCustomizerRadius(12);
              setCustomizerGlow(60);
            } else if (nextTheme === 'matrix') {
              setCustomizerRadius(0);
              setCustomizerGlow(80);
            } else if (nextTheme === 'warm') {
              setCustomizerRadius(24);
              setCustomizerGlow(40);
            } else {
              setCustomizerRadius(4);
              setCustomizerGlow(0);
            }
            setSimulatedLog(`[Theme Matrix] Activated layout paradigm preset: ${nextTheme.toUpperCase()}`);
            triggerToast(`Shifting Color Matrix to: ${nextTheme.toUpperCase()}`);
          } 
        },
        { 
          label: 'Typography Grid', 
          desc: 'Re-align and scale font pairings (Space Grotesk, Inter, JetBrains Mono).', 
          action: () => { 
            setActiveSubmenuItem('Typography Grid');
            setSimulatedLog('[Theme Typography] Calibrated layout bounds. Primary: Inter, Display: Space Grotesk, Mono: JetBrains Mono.');
            triggerToast('Typography grid pairs loaded.');
          } 
        },
        { 
          label: 'Reality‑Adaptive Theme', 
          desc: 'Shift UI colors dynamically based on system clock states.', 
          action: () => { 
            setActiveSubmenuItem('Reality‑Adaptive Theme');
            setSimulatedLog('[Theme Adaptive] Theme shifts active: Morning (Clean Minimal) -> Evening (Cyberpunk Neon).');
            triggerToast('Reality-adaptive styling active.');
          } 
        }
      ]
    },
    {
      title: 'System Diagnostics',
      desc: 'Decompile runtime stack traces, trace memory heap allocations, and monitor ADB server endpoints.',
      icon: Activity,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-400',
      borderColorHex: '#3b82f6',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      glowColor: 'rgba(59,130,246,0.35)',
      actions: [
        { 
          label: 'Crash Logs', 
          desc: 'Monitor system crash reports and run intelligent thread-repair logic.', 
          action: () => { 
            setActiveSubmenuItem('Crash Logs');
            setSimulatedLog('[Diagnostics Logs] No unhandled exceptions. Main thread is completely healthy.');
            triggerToast('Crash log scanner reports: 0 crashes.');
          } 
        },
        { 
          label: 'Module Health', 
          desc: 'Audit dependencies, configuration matrices, and build files.', 
          action: () => { 
            setActiveSubmenuItem('Module Health');
            setSimulatedLog('[Diagnostics Health] Verified 14 local modules: All report 100% green status.');
            triggerToast('Module health verification complete.');
          } 
        },
        { 
          label: 'Memory Map', 
          desc: 'Measure memory allocations, analyzing heap usage and G1 garbage collections.', 
          action: () => { 
            setActiveSubmenuItem('Memory Map');
            setSimulatedLog('[Diagnostics Memory] Heap snapshot:\n  - Allocated: 142MB\n  - Max Heap: 512MB\n  - Active GC: G1 (Idle)');
            triggerToast('Heap memory snapshot acquired.');
          } 
        },
        { 
          label: 'Network Monitor', 
          desc: 'Analyze outbound developer API endpoints and pings.', 
          action: () => { 
            setActiveSubmenuItem('Network Monitor');
            setSimulatedLog('[Diagnostics Network] Active endpoints:\n  - /api/health: 24ms\n  - /api/copilot: 42ms\n  - ADB stream: Online');
            triggerToast('Network endpoint monitor refreshed.');
          } 
        }
      ]
    },
    {
      title: 'Developer Tools',
      desc: 'Execute diagnostic ADB commands, inspect layout coordinate maps, and manage ProGuard release configurations.',
      icon: Terminal,
      color: 'from-slate-400 to-slate-500',
      textColor: 'text-slate-300',
      borderColorHex: '#94a3b8',
      bgColor: 'bg-slate-400/10',
      borderColor: 'border-slate-400/30',
      glowColor: 'rgba(148,163,184,0.35)',
      actions: [
        { 
          label: 'Debug Console', 
          desc: 'Inject real-time diagnostics to test Android system components.', 
          action: () => { 
            setActiveSubmenuItem('Debug Console');
            setSimulatedLog('[ADB Shell] adb shell dumpsys battery...\n  - Status: Discharging\n  - Level: 100%\n  - Health: Good');
            triggerToast('ADB diagnostics executed.');
          } 
        },
        { 
          label: 'Live Layout Inspector', 
          desc: 'Enable layout outline bounding boxes directly on visual controls.', 
          action: () => { 
            setActiveSubmenuItem('Live Layout Inspector');
            setSimulatedLog('[Inspector] Highlighted 16 view components with red bounding markers.');
            triggerToast('Layout bounds overlay toggled.');
          } 
        },
        { 
          label: 'API Test Bench', 
          desc: 'Query mock backends with customized JSON headers and request payloads.', 
          action: () => { 
            setActiveSubmenuItem('API Test Bench');
            setSimulatedLog('[Test Bench] GET /api/health -> 200 OK\n{\n  "status": "healthy",\n  "api_level": 34\n}');
            triggerToast('Mock API route verification completed.');
          } 
        },
        { 
          label: 'Build Configs', 
          desc: 'Edit Gradle configuration files, ProGuard shrinker rules, and key signatures.', 
          action: () => { 
            setActiveSubmenuItem('Build Configs');
            setSimulatedLog('[Gradle Config] R8 shrinking enabled, ProGuard optimizations applied to release package.');
            triggerToast('Build configuration settings parsed.');
          } 
        }
      ]
    },
    {
      title: 'Settings',
      desc: 'Adjust system-level security permissions, toggle persistent local storage, and configure backup snapshots.',
      icon: ServerCog,
      color: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-400',
      borderColorHex: '#14b8a6',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/30',
      glowColor: 'rgba(20,184,166,0.35)',
      actions: [
        { 
          label: 'Permissions', 
          desc: 'Request and audit essential Android runtime app permissions.', 
          action: () => { 
            setActiveSubmenuItem('Permissions');
            setSimulatedLog('[Settings Permissions] Granted: CAMERA, ACCESS_FINE_LOCATION, READ_MEDIA_IMAGES.');
            triggerToast('Permissions audit complete.');
          } 
        },
        { 
          label: 'Data Storage', 
          desc: 'Configure storage modes between secure client-side SQLite and Cloud Firestore.', 
          action: () => { 
            setActiveSubmenuItem('Data Storage');
            setSimulatedLog('[Settings Storage] Active mode: Encrypted Room Database (SQLite) synchronized with Cloud Firestore.');
            triggerToast('Storage engine is online.');
          } 
        },
        { 
          label: 'Notifications', 
          desc: 'Configure background service notification levels and priority channels.', 
          action: () => { 
            setActiveSubmenuItem('Notifications');
            setSimulatedLog('[Settings Notifications] Channels active: Swarm_alerts (High), Build_completions (Default).');
            triggerToast('Notification channels updated.');
          } 
        },
        { 
          label: 'Backup & Restore', 
          desc: 'Store encrypted code backups to persistent local state tables.', 
          action: () => { 
            setActiveSubmenuItem('Backup & Restore');
            handleSaveApp();
            setSimulatedLog('[Settings Backup] Encrypted backup snapshot stored inside local storage database.');
            triggerToast('Project backup successfully encrypted.');
          } 
        },
        { 
          label: 'About', 
          desc: 'Review developer coordinates, engine versions, and legal documentation.', 
          action: () => { 
            setActiveSubmenuItem('About');
            setSimulatedLog('MATRIX ARCHITECTURE v4.2.0-CYBER\nDesigned for highly responsive cyber-brutalist platforms.');
            triggerToast('System about information loaded.');
          } 
        }
      ]
    }
  ];

  const currentActiveGroup = navigationGroups[activeGroupIndex];
  const displayedGroup = hoveredGroupIndex !== null ? navigationGroups[hoveredGroupIndex] : currentActiveGroup;

  return (
    <section
      id="navigator-home"
      className={`page active h-full w-full overflow-y-auto p-4 md:p-8 flex flex-col gap-6 select-none ${
        isDark ? 'bg-[#000000] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Welcome & System Status Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/40 pb-5 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 flex items-center gap-2">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" /> Orchestrator Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Access active platform runtimes, trigger automated UI sweeps, manage persistent files, or invoke advanced cognitive diagnostic suites.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <button
              onClick={() => {
                setViewMode('cyber');
                triggerToast('Activated Cyber-Cross-Tech Wheel/List Mode');
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cyber'
                  ? 'bg-gradient-to-r from-[#06b6d4] to-indigo-600 text-white shadow shadow-[#06b6d4]/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cyber Tech</span>
            </button>
            <button
              onClick={() => {
                setViewMode('circular');
                triggerToast('Activated circular menu hub');
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'circular'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Circular Menu</span>
            </button>
            <button
              onClick={() => {
                setViewMode('bento');
                triggerToast('Activated standard bento panel');
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'bento'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Bento Grid</span>
            </button>
          </div>

          <div className={`flex items-center gap-2 border rounded-2xl px-4 py-2 text-xs ${
            isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Android API Level 34 • Connected</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'cyber' ? (
          <motion.div
            key="cyber-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <CyberCrossTechDashboard
              isDark={isDark}
              onNavigate={onNavigate}
              setActiveDialog={setActiveDialog}
              triggerToast={triggerToast}
            />
          </motion.div>
        ) : viewMode === 'circular' ? (
          /* CIRCULAR / ORBITAL MENU INTERFACE */
          <motion.div
            key="circular-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            style={{
              transform: `scale(${customizerScale / 100})`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Left/Middle Column: Orbital Circular Dial or Latest Feature Overlay */}
            <div 
              className="lg:col-span-7 flex flex-col items-center justify-center p-6 relative min-h-[480px] rounded-3xl bg-slate-950/20 border border-slate-900/60 overflow-hidden"
              style={{
                borderRadius: `${customizerRadius}px`,
                boxShadow: `0 0 ${customizerGlow / 2}px ${customizerTheme === 'matrix' ? 'rgba(34,197,94,0.1)' : customizerTheme === 'warm' ? 'rgba(245,158,11,0.1)' : 'rgba(6,182,212,0.1)'}`
              }}
            >
              <AnimatePresence mode="wait">
                {!isShowingLatestFeature ? (
                  <motion.div
                    key="wheel-active"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full h-full flex flex-col items-center justify-center min-h-[420px]"
                  >
                    {/* Pulsing Orbit Background Circle SVG */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg className="w-[340px] h-[340px] md:w-[400px] md:h-[400px] opacity-20 text-slate-700 animate-[spin_100s_linear_infinite]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                        <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 6" />
                      </svg>
                    </div>

                    {/* Central Core Singularity Orb (Latest Feature Center Trigger) */}
                    <motion.div 
                      onClick={() => {
                        setIsShowingLatestFeature(true);
                        triggerToast("Loading Universal App Customizer Core...");
                      }}
                      className="w-48 h-48 rounded-full border flex flex-col items-center justify-center text-center p-5 z-10 transition-all duration-300 relative shadow-2xl cursor-pointer group hover:scale-105"
                      style={{
                        background: isDark ? 'radial-gradient(circle, #080c14 30%, #030509 100%)' : '#ffffff',
                        borderColor: displayedGroup ? displayedGroup.borderColorHex : 'rgba(148, 163, 184, 0.4)',
                        boxShadow: `0 0 ${customizerGlow}px ${displayedGroup ? displayedGroup.glowColor : 'rgba(0,0,0,0.5)'}, inset 0 0 20px ${displayedGroup ? displayedGroup.glowColor : 'transparent'}`,
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Pulse Ring */}
                      <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-25 pointer-events-none" />

                      <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase flex items-center gap-1 animate-pulse mb-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> LATEST MODULE
                      </span>
                      
                      <h3 className="text-xs font-black uppercase text-slate-100 max-w-[150px] truncate mt-0.5">
                        App Customizer
                      </h3>
                      
                      <p className="text-[8px] text-slate-400 mt-1 max-w-[140px] leading-tight font-mono">
                        & Prompt Synthesizer
                      </p>

                      <div className="mt-4 text-[8px] font-black tracking-widest uppercase bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full transition-colors border border-cyan-500/30">
                        ACTIVATE CORE
                      </div>
                    </motion.div>

                    {/* Orbiting Navigation Nodes */}
                    {navigationGroups.map((group, idx) => {
                      const angle = (idx * (360 / navigationGroups.length)) * (Math.PI / 180);
                      // Radius differs for desktop vs mobile
                      const radius = window.innerWidth < 768 ? 100 : 138;
                      const tx = Math.cos(angle) * radius;
                      const ty = Math.sin(angle) * radius;
                      const IconComponent = group.icon;
                      const isActive = activeGroupIndex === idx;
                      const isHovered = hoveredGroupIndex === idx;

                      return (
                        <motion.button
                          key={idx}
                          onClick={() => {
                            setActiveGroupIndex(idx);
                            triggerToast(`Selected: ${group.title}`);
                          }}
                          onMouseEnter={() => setHoveredGroupIndex(idx)}
                          onMouseLeave={() => setHoveredGroupIndex(null)}
                          style={{
                            transform: `translate(${tx}px, ${ty}px)`
                          }}
                          className={`absolute w-12 h-12 md:w-13 md:h-13 rounded-full border z-20 flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 ${
                            isActive 
                              ? `bg-slate-950 border-cyan-500/50 scale-110 ring-2 ring-cyan-500/20`
                              : isHovered
                                ? `bg-slate-900 border-slate-700 scale-105`
                                : `bg-[#04060b]/90 border-slate-800/80`
                          }`}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className={`p-1.5 rounded-full ${isActive ? 'bg-cyan-500/10' : ''}`}>
                            <IconComponent className={`w-5 h-5 transition-colors ${
                              isActive 
                                ? 'text-cyan-400' 
                                : isHovered 
                                  ? 'text-slate-200' 
                                  : 'text-slate-400'
                            }`} />
                          </span>

                          {/* Outer active dot indicator */}
                          {isActive && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-slate-950 animate-pulse" />
                          )}

                          {/* Orbiting node label */}
                          <span 
                            className={`absolute hidden md:block text-[8px] font-black uppercase tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/95 border border-slate-800/60 text-slate-300 transition-opacity duration-300 pointer-events-none ${
                              isHovered || isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                              transform: `translate(${tx > 0 ? 50 : -50}px, 0)`
                            }}
                          >
                            {group.title}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                ) : (
                  /* THE DYNAMIC LATEST FEATURE: APP CUSTOMIZER & PROMPT SYNTHESIZER */
                  <motion.div
                    key="customizer-active"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full flex flex-col gap-4 text-slate-100 z-10"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                        <div>
                          <span className="text-[8px] font-black tracking-widest text-cyan-400 uppercase block">ACTIVE MANDELA MODULE</span>
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 mt-0.5">
                            Universal Customizer & Persona Engine
                          </h3>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsShowingLatestFeature(false)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        ← BACK TO WHEEL
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left: Customizer Sliders & Theme */}
                      <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Sliders & Presets</span>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">Corner Radius:</span>
                            <span className="text-cyan-400 font-bold font-mono">{customizerRadius}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="24" 
                            value={customizerRadius}
                            onChange={(e) => setCustomizerRadius(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">Glow Intensity:</span>
                            <span className="text-cyan-400 font-bold font-mono">{customizerGlow}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={customizerGlow}
                            onChange={(e) => setCustomizerGlow(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">Scaling & Density:</span>
                            <span className="text-cyan-400 font-bold font-mono">{customizerScale}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="80" 
                            max="120" 
                            value={customizerScale}
                            onChange={(e) => setCustomizerScale(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Theme preset selector buttons */}
                        <div className="mt-2">
                          <span className="text-[9px] text-slate-400 block mb-1.5">Preset Paradigms:</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {(['neon', 'matrix', 'warm', 'minimal'] as const).map(th => (
                              <button
                                key={th}
                                onClick={() => {
                                  setCustomizerTheme(th);
                                  if (th === 'neon') {
                                    setCustomizerRadius(12);
                                    setCustomizerGlow(60);
                                  } else if (th === 'matrix') {
                                    setCustomizerRadius(0);
                                    setCustomizerGlow(80);
                                  } else if (th === 'warm') {
                                    setCustomizerRadius(24);
                                    setCustomizerGlow(40);
                                  } else {
                                    setCustomizerRadius(4);
                                    setCustomizerGlow(10);
                                  }
                                  triggerToast(`Switched theme to: ${th.toUpperCase()}`);
                                }}
                                className={`py-1.5 px-2 rounded-lg text-[9px] font-bold border transition-all uppercase cursor-pointer ${
                                  customizerTheme === th
                                    ? 'bg-slate-900 border-cyan-400/50 text-cyan-400 shadow shadow-cyan-400/10'
                                    : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {th}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Zero-Shot Prompt Synthesizer & Persona Simulator */}
                      <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Customizer Prompt Synthesizer</span>
                        
                        <div className="flex flex-col gap-1 text-[10px]">
                          <span className="text-slate-400 font-mono">Goal / App Feature:</span>
                          <input 
                            type="text"
                            value={customPromptText}
                            onChange={(e) => setCustomPromptText(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-[10px]">
                          <span className="text-slate-400 font-mono">Aesthetic Target:</span>
                          <select 
                            value={synthStyleGoal}
                            onChange={(e) => setSynthStyleGoal(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                          >
                            <option>High-contrast cyberpunk glassmorphism</option>
                            <option>Brutalist high-density monospaced grid</option>
                            <option>Minimalist slate with subtle neon green piping</option>
                            <option>Rich twilight dark mode with gold accents</option>
                          </select>
                        </div>

                        <button
                          onClick={() => {
                            setIsSynthesizingPrompt(true);
                            triggerToast("Synthesizing customizer instructions...");
                            setTimeout(() => {
                              setIsSynthesizingPrompt(false);
                              setSynthesizedPromptResult(
                                `{\n  "mode": "PROMPT_SYNTHESIS",\n  "system": "MANDELA_CORE_v4.2",\n  "instructions": "Inject styling attributes to match '${customPromptText}' with styling goals: '${synthStyleGoal}'. Set Corner Radius to ${customizerRadius}px, Glow to ${customizerGlow}%."\n}`
                              );
                              triggerToast("Prompt instructions synthesized!");
                            }, 1200);
                          }}
                          disabled={isSynthesizingPrompt}
                          className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-lg text-xs font-bold hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          {isSynthesizingPrompt ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Synthesizing...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5" /> Synthesize Customizer Prompt
                            </>
                          )}
                        </button>

                        {synthesizedPromptResult && (
                          <div className="p-2.5 bg-black/80 border border-slate-900 rounded-lg max-h-[80px] overflow-y-auto">
                            <span className="text-[8px] font-mono text-cyan-400 block leading-tight whitespace-pre-wrap">
                              {synthesizedPromptResult}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Persona Simulation Row */}
                    <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col gap-3 mt-1">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">AI Persona & Language Posture</span>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-slate-950 border border-slate-900 rounded-lg p-0.5 text-[9px]">
                            {(['architect', 'dreamer', 'reviewer'] as const).map(p => (
                              <button
                                key={p}
                                onClick={() => setPersonaSelected(p)}
                                className={`px-2 py-0.5 rounded uppercase transition-colors font-bold cursor-pointer ${
                                  personaSelected === p ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1 bg-slate-950 border border-slate-900 rounded-lg p-0.5 text-[9px]">
                            {(['formal', 'poetic', 'sarcastic'] as const).map(l => (
                              <button
                                key={l}
                                onClick={() => setPersonaLanguage(l)}
                                className={`px-2 py-0.5 rounded uppercase transition-colors font-bold cursor-pointer ${
                                  personaLanguage === l ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'
                                }`}
                              >
                                {l}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-cyan-400">
                          {personaSelected === 'architect' ? 'A' : personaSelected === 'dreamer' ? 'D' : 'R'}
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 block">
                            Persona: {personaSelected.toUpperCase()} ({personaLanguage.toUpperCase()})
                          </span>
                          <p className="text-[11px] text-cyan-300/90 leading-relaxed italic mt-0.5">
                            {personaSelected === 'architect' && personaLanguage === 'formal' && "“The current design radius and structural boundaries have been successfully calibrated to comply with structural integrity requirements.”"}
                            {personaSelected === 'architect' && personaLanguage === 'poetic' && "“A perfect circle of pixels, held in rigid geometric suspension, tracing code onto the dark canvas of space.”"}
                            {personaSelected === 'architect' && personaLanguage === 'sarcastic' && "“Oh sure, let's keep rounding those corners. Pretty soon, the whole application will slide right off the viewport.”"}
                            
                            {personaSelected === 'dreamer' && personaLanguage === 'formal' && "“I propose setting the glow matrix to 100% to simulate an immersive twilight nebular environment.”"}
                            {personaSelected === 'dreamer' && personaLanguage === 'poetic' && "“Behold, the core breaths in waves of violet glow, a silent heart whispering promises to the compiler.”"}
                            {personaSelected === 'dreamer' && personaLanguage === 'sarcastic' && "“I had a dream about 100% test coverage. Then I woke up and realized we're still writing JavaScript.”"}

                            {personaSelected === 'reviewer' && personaLanguage === 'formal' && "“The touch-target density meets the strict 44dp guidelines. However, security protocols require further validation.”"}
                            {personaSelected === 'reviewer' && personaLanguage === 'poetic' && "“Your code is like autumn leaves—graceful on the surface, but pile too many up and the drain gets clogged.”"}
                            {personaSelected === 'reviewer' && personaLanguage === 'sarcastic' && "“Nice glow effect! It does a fantastic job of distracting us from the fact that the actual back-end doesn't exist.”"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right/Control Column: Interactive Color-Coded Panel */}
            <div className="lg:col-span-5 flex flex-col gap-4 h-full justify-between">
              <div 
                className="p-5 border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 transition-all duration-300"
                style={{
                  borderRadius: `${customizerRadius}px`,
                  boxShadow: `0 0 ${customizerGlow / 3}px rgba(6,182,212,0.08)`
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Active Control Module</span>
                    <h2 className="text-xs font-black text-slate-100 flex items-center gap-1.5 uppercase mt-0.5">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentActiveGroup.color}`} />
                      {currentActiveGroup.title}
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">GROUP {activeGroupIndex + 1}/{navigationGroups.length}</span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  {currentActiveGroup.desc}
                </p>

                {/* List of clean, clearly labeled, color-coded interactive actions */}
                <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {currentActiveGroup.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={act.action}
                      className="w-full text-left p-2.5 text-[11px] bg-slate-950/60 border border-slate-900/80 hover:border-slate-800 hover:bg-slate-900/30 rounded-xl transition-all cursor-pointer group flex flex-col gap-0.5 hover:translate-x-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-200 group-hover:text-cyan-400 transition-colors">
                          {act.label}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <span className="text-[9px] text-slate-500 leading-tight">
                        {act.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LIVE METRICS / MATRIXCORE TELEMETRY LOGS */}
              <div 
                className="p-4 bg-[#020408]/90 border border-slate-900 rounded-2xl flex flex-col gap-3"
                style={{
                  borderRadius: `${customizerRadius}px`
                }}
              >
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <h3 className="text-[9px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> MATRIXCORE REAL-TIME TELEMETRY
                  </h3>
                  <span className="text-[8px] font-mono text-slate-500">ROUTE: {activeMatrixRoute}</span>
                </div>

                {/* Progress bars for core registers */}
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-slate-400">
                      <span>STABILITY:</span>
                      <span className="text-cyan-400 font-bold">{coreRegisters.STABILITY}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${coreRegisters.STABILITY}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-slate-400">
                      <span>EVAL SCORE:</span>
                      <span className="text-emerald-400 font-bold">{coreRegisters.EVAL_SCORE}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${coreRegisters.EVAL_SCORE}%` }} />
                    </div>
                  </div>
                </div>

                {/* Dynamic simulated terminal log */}
                <div className="p-2.5 bg-black rounded-lg border border-slate-900/80 font-mono text-[9px] text-cyan-400 min-h-[50px] overflow-y-auto leading-tight flex flex-col gap-1 select-text">
                  <div className="flex items-center gap-1 text-slate-500 text-[8px] border-b border-slate-900 pb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>SYSTEM SHELL FEED</span>
                  </div>
                  <p className="whitespace-pre-wrap">{simulatedLog}</p>
                </div>
              </div>

              {/* Projects Quick Access Panel inside Circular view */}
              <div 
                className="p-3 bg-slate-950/30 border border-slate-900 rounded-2xl flex flex-col gap-2"
                style={{
                  borderRadius: `${customizerRadius}px`
                }}
              >
                <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                  <h3 className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-indigo-400" /> ACTIVE PROJECTS ({savedApps.length})
                  </h3>
                  <button
                    onClick={handleCreateProject || (() => triggerToast('Create project triggered'))}
                    className="p-1 hover:bg-slate-800 text-indigo-400 rounded-md transition-colors cursor-pointer"
                    title="Create New Project"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {savedApps.length === 0 ? (
                    <span className="text-[9px] text-slate-500 italic">No saved projects yet. Click Save inside sandbox.</span>
                  ) : (
                    savedApps.map(app => (
                      <button
                        key={app.id}
                        onClick={() => {
                          handleLoadApp(app);
                          triggerToast(`Loaded project: ${app.name}`);
                        }}
                        className="px-2.5 py-1.5 bg-slate-900/50 border border-slate-800 rounded-xl text-left shrink-0 min-w-[110px] hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        <h4 className="font-bold text-slate-200 text-[9px] truncate">{app.name}</h4>
                        <span className="text-[8px] text-slate-500 block font-mono">
                          {app.projectType.toUpperCase()}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* STANDARD BENTO GRID LAYOUT */
          <motion.div
            key="bento-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* BLOCK 1: PROJECTS */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Projects
                </h2>
                <button
                  onClick={handleCreateProject || (() => triggerToast('Create project triggered'))}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Project
                </button>
              </div>
              
              <div id="saved-apps-list" className="flex-1 flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {savedApps.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-4 text-center bg-slate-950/30 rounded-xl border border-slate-900">
                    No saved projects found. Save your code from the run pipeline!
                  </div>
                ) : (
                  savedApps.map(app => (
                    <div
                      key={app.id}
                      className="p-3 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between group hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-200 text-xs truncate">{app.name}</h4>
                        <span className="text-[9px] text-slate-500 font-mono block">
                          {app.projectType.toUpperCase()} • {new Date(app.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            handleLoadApp(app);
                            triggerToast(`Loaded app: ${app.name}`);
                          }}
                          className="px-2 py-1 bg-indigo-950/40 text-indigo-400 hover:bg-indigo-900/40 border border-indigo-500/20 rounded text-[10px] font-bold"
                        >
                          Load
                        </button>
                        {handleDeleteApp && (
                          <button
                            onClick={() => handleDeleteApp(app.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* BLOCK 2: FILE EXPLORER */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-3 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all md:col-span-2 lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> File Explorer
                </h2>
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div
                id="file-tree"
                className="flex-1 min-h-[140px] max-h-[220px] overflow-y-auto bg-slate-950/50 border border-slate-900/80 rounded-xl p-3"
              >
                <FileTree
                  files={filteredFiles}
                  activeFilePath={activeFilePath}
                  onSelectFile={(path) => {
                    onSelectFile(path);
                    triggerToast(`Selected: ${path.split('/').pop()}`);
                  }}
                  onCreateFile={onCreateFile}
                  onRenameFile={onRenameFile}
                  onMoveFile={() => {}}
                  onDeleteFile={onDeleteFile}
                  theme={isDark ? 'dark' : 'light'}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 shrink-0">
                <button
                  onClick={handleCreateFileBtn}
                  className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] font-black text-slate-300 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" /> Create File
                </button>
                <button
                  onClick={handleRenameFileBtn}
                  className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] font-black text-slate-300 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-indigo-400" /> Rename File
                </button>
                <button
                  onClick={handleDeleteFileBtn}
                  className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] font-black text-slate-300 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" /> Delete File
                </button>
              </div>
            </section>

            {/* BLOCK 3: BUILD & ACTIONS */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Build & Actions
              </h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onNavigate('sandbox');
                    triggerToast('Loaded Live Workspace Editor!');
                  }}
                  className="w-full text-left p-3 text-xs font-black bg-indigo-950/30 hover:bg-indigo-900/30 text-indigo-300 border border-indigo-500/15 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Code className="w-4 h-4 text-indigo-400" /> Run App
                </button>
                <button
                  onClick={handleBuildApk}
                  disabled={isCompiling}
                  className="w-full text-left p-3 text-xs font-black bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-300 border border-emerald-500/15 rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCompiling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-emerald-400" />}
                  Build APK
                </button>
                <button
                  onClick={handleExportZip}
                  className="w-full text-left p-3 text-xs font-black bg-slate-900/60 hover:bg-slate-800/60 text-slate-300 border border-slate-800 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" /> Export ZIP
                </button>
                <button
                  onClick={() => setActiveDialog('playStore')}
                  className="w-full text-left p-3 text-xs font-black bg-blue-950/30 hover:bg-blue-900/30 text-blue-300 border border-blue-500/15 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <PlaySquare className="w-4 h-4 text-blue-400" /> Publish to Play Store
                </button>
                <button
                  onClick={() => setActiveDialog('standaloneApk')}
                  className="w-full text-left p-3 text-xs font-black bg-teal-950/30 hover:bg-teal-900/30 text-teal-300 border border-teal-500/15 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-teal-400" /> Generate Standalone APK
                </button>
              </div>
            </section>

            {/* BLOCK 4: SANDBOX MODES */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Sandbox Modes
              </h2>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    handleSwitchProject('compose');
                    triggerToast('Activated Jetpack Compose Mode!');
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    projectType === 'compose'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-extrabold shadow'
                      : 'bg-transparent border-slate-800/40 text-slate-400 hover:bg-slate-800/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4.5 h-4.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black">Jetpack Compose (Kotlin)</span>
                      <span className="text-[8px] text-slate-500">Declarative components UI compiler</span>
                    </div>
                  </div>
                  {projectType === 'compose' && <span className="text-[8px] bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-black">ACTIVE</span>}
                </button>

                <button
                  onClick={() => {
                    handleSwitchProject('xml');
                    triggerToast('Activated XML Layout Mode!');
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    projectType === 'xml'
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 font-extrabold shadow'
                      : 'bg-transparent border-slate-800/40 text-slate-400 hover:bg-slate-800/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Grid className="w-4.5 h-4.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black">Classic Layout (XML)</span>
                      <span className="text-[8px] text-slate-500">Classic Android view rendering nodes</span>
                    </div>
                  </div>
                  {projectType === 'xml' && <span className="text-[8px] bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-black">ACTIVE</span>}
                </button>
              </div>
            </section>

            {/* BLOCK 5: DIAGNOSTICS */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Diagnostics
              </h2>
              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {[
                  { label: 'Pre-APK Quality Validator', icon: Shield, dialog: 'preApkValidator', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                  { label: 'Recovery & Stability Summary', icon: Heart, dialog: 'recoverySummary', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { label: 'Interactive Report Generator', icon: FileText, dialog: 'reportGenerator', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { label: 'Builder Activity Spinner (Visual Ops)', icon: Cpu, dialog: 'builderVisualOps', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                  { label: 'Builder System Check', icon: ShieldCheck, dialog: 'builderSystemCheck', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                  { label: 'Workflow Trace & Checkpoint', icon: GitCommit, dialog: 'workflowTrace', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { label: 'System Integrity Sweep', icon: Activity, dialog: 'integritySweep', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { label: 'App Autopsy Engine', icon: Activity, dialog: 'appAutopsy', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                  { label: 'Automated UI Test System', icon: TestTube2, dialog: 'uiTestSystem', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                  { label: 'Performance Optimization (RAM Engine)', icon: Gauge, dialog: 'perfEngine', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Performance Torture Test', icon: Flame, dialog: 'torture', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                  { label: 'UX Stability Gauntlet', icon: ShieldAlert, dialog: 'uxGauntlet', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                  { label: 'Hardware Capability Gen', icon: Cpu, dialog: 'hardwareGen', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  { label: 'Architecture Shifting', icon: Boxes, dialog: 'archShift', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { label: 'Evolutionary Generator', icon: Dna, dialog: 'evolutionGen', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                  { label: 'Intent Feature Builder', icon: Target, dialog: 'intentBuilder', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Cognitive UX Analyzer', icon: Brain, dialog: 'cogUX', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                  { label: 'Continuous App Evolution', icon: ServerCog, dialog: 'contEvol', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }
                ].map((suite, i) => {
                  const IconComp = suite.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveDialog(suite.dialog)}
                      className="p-2 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[9px] font-bold rounded-lg text-left text-slate-300 hover:scale-[1.02] transition-transform cursor-pointer flex flex-col gap-1.5"
                    >
                      <span className={`p-1 rounded w-fit ${suite.color}`}>
                        <IconComp className="w-3 h-3" />
                      </span>
                      <span className="leading-tight line-clamp-2">{suite.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* BLOCK 6: PLATINUM TIER */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Platinum Tier
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Zero-Trust Security Matrix', dialog: 'zeroTrust' },
                  { label: 'Cross-Platform Symbiosis', dialog: 'crossPlatform' },
                  { label: 'Universal Native Bridge', dialog: 'nativeBridge' },
                  { label: 'Native Shell Wrapper', dialog: 'shellWrapper' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDialog(item.dialog)}
                    className="p-2 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-amber-400/90 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* BLOCK 7: DIAMOND TIER */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Diamond Tier
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Self-Architecting Core', dialog: 'selfArch' },
                  { label: 'Generative App Genome', dialog: 'genGenome' },
                  { label: 'Recursive Feature Evolution', dialog: 'recurEvol' },
                  { label: 'Cross-App Intelligence', dialog: 'crossApp' },
                  { label: 'Auto Product Designer', dialog: 'autoProd' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDialog(item.dialog)}
                    className={`p-2 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-cyan-400/90 cursor-pointer ${
                      i === 4 ? 'col-span-2 text-center' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* BLOCK 8: MYTHIC TIER */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Mythic Tier
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Ecosystem Consciousness', dialog: 'ecoSim' },
                  { label: 'Mythic Intelligence Codex', dialog: 'mythicCodex' },
                  { label: 'Prime Directive Governance', dialog: 'primeDir' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDialog(item.dialog)}
                    className={`p-2 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-rose-400/90 cursor-pointer ${
                      i === 2 ? 'col-span-2 text-center' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* BLOCK 9: AI SYSTEMS */}
            <section className="block p-5 rounded-2xl border flex flex-col gap-4 bg-gradient-to-br from-slate-900/40 to-slate-950/60 border-slate-800/80 hover:border-slate-700/80 transition-all md:col-span-2 lg:col-span-1">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> AI Systems
              </h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveDialog('aiLearning')}
                  className="p-3 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-pink-400 flex items-center justify-between cursor-pointer"
                >
                  <span>AI Academy & ML Sandbox</span>
                  <Award className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveDialog('aiCoTesting')}
                  className="p-3 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-purple-400 flex items-center justify-between cursor-pointer"
                >
                  <span>AI-to-AI Testing Arena</span>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveDialog('llmTiers')}
                  className="p-3 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-cyan-400 flex items-center justify-between cursor-pointer animate-pulse"
                >
                  <span>LLM Tier List (2026 Edition)</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  onClick={() => setActiveDialog('githubMetadata')}
                  className="p-3 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-indigo-400 flex items-center justify-between cursor-pointer"
                >
                  <span>GitHub Repository & README Generator</span>
                  <Github className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveDialog('omniCore')}
                  className="p-3 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-fuchsia-400 flex items-center justify-between cursor-pointer"
                >
                  <span>Omni-System Singularity Core™</span>
                  <Atom className="w-3.5 h-3.5 text-fuchsia-400" />
                </button>
                <button
                  onClick={() => setActiveDialog('aiRoster')}
                  className="p-3 bg-slate-950/50 border border-slate-900 hover:border-slate-800 text-[10px] font-bold rounded-lg text-left text-rose-400 flex items-center justify-between cursor-pointer"
                >
                  <span>🐓 AI Training Roster & Governance</span>
                  <BrainCircuit className="w-3.5 h-3.5 text-rose-400" />
                </button>
                <button
                  onClick={() => setActiveDialog('aiOptimizerWow')}
                  className="p-3 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-900 hover:border-purple-800 text-[10px] font-black rounded-lg text-left text-purple-400 flex items-center justify-between cursor-pointer animate-pulse"
                >
                  <span>🧠 AI Multi-Agent Autonomy Lab</span>
                  <Brain className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                </button>
                <button
                  onClick={() => setActiveDialog('decentralizedSwarm')}
                  className="p-3 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-900 hover:border-cyan-800 text-[10px] font-black rounded-lg text-left text-cyan-400 flex items-center justify-between cursor-pointer"
                >
                  <span>🐝 Decentralized Swarm Simulator</span>
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                </button>
                <button
                  onClick={() => setActiveDialog('rundownManager')}
                  className="p-3 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-900 hover:border-emerald-800 text-[10px] font-black rounded-lg text-left text-emerald-400 flex items-center justify-between cursor-pointer"
                >
                  <span>📰 Rundown Ingest & Trend Analyzer</span>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                </button>
                <button
                  onClick={() => setActiveDialog('closedLearningLoop')}
                  className="p-3 bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border border-cyan-800 hover:border-cyan-700 text-[10px] font-black rounded-lg text-left text-cyan-400 flex items-center justify-between cursor-pointer"
                >
                  <span>🧠 Closed-Circuit Autonomous Learning Loop</span>
                  <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                </button>
                <button
                  onClick={() => setActiveDialog('highThroughputStorage')}
                  className="p-3 bg-gradient-to-r from-amber-950/50 to-emerald-950/50 border border-amber-800 hover:border-amber-700 text-[10px] font-black rounded-lg text-left text-amber-400 flex items-center justify-between cursor-pointer"
                >
                  <span>⚡ High-Throughput 100 GB/s Storage Engine (WEKA / VAST / DDN)</span>
                  <ServerCog className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </button>
                <button
                  onClick={() => setActiveDialog('distributedHiveOrganism')}
                  className="p-3 bg-gradient-to-r from-red-950/60 via-amber-950/60 to-purple-950/60 border border-amber-600 hover:border-amber-500 text-[10px] font-black rounded-lg text-left text-amber-300 flex items-center justify-between cursor-pointer"
                >
                  <span>🐝 Death Hive: Distributed Intelligence Colony Organism</span>
                  <Network className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </button>
                <button
                  onClick={() => setActiveDialog('emergentGhosts')}
                  className="p-3 bg-gradient-to-r from-purple-950/70 via-slate-950/70 to-cyan-950/70 border border-purple-500 hover:border-purple-400 text-[10px] font-black rounded-lg text-left text-purple-300 flex items-center justify-between cursor-pointer"
                >
                  <span>🜁 Emergent Ghosts vs Police Containment Architectures</span>
                  <Ghost className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                </button>
                <button
                  onClick={() => setActiveDialog('moduleOne')}
                  className="p-3 bg-gradient-to-r from-emerald-950/70 via-slate-950/70 to-cyan-950/70 border border-emerald-500 hover:border-emerald-400 text-[10px] font-black rounded-lg text-left text-emerald-300 flex items-center justify-between cursor-pointer"
                >
                  <span>📁 Module_1: Mandela / Matrix / Integration Pipeline</span>
                  <Folder className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                </button>
                <button
                  onClick={() => setActiveDialog('moduleTwo')}
                  className="p-3 bg-gradient-to-r from-indigo-950/70 via-slate-950/70 to-blue-950/70 border border-indigo-500 hover:border-indigo-400 text-[10px] font-black rounded-lg text-left text-indigo-300 flex items-center justify-between cursor-pointer"
                >
                  <span>🏷️ Module_2: Evaluateor / Action Classification Engine</span>
                  <Folder className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                </button>
                <button
                  onClick={() => setActiveDialog('moduleThree')}
                  className="p-3 bg-gradient-to-r from-amber-950/70 via-slate-950/70 to-orange-950/70 border border-amber-500 hover:border-amber-400 text-[10px] font-black rounded-lg text-left text-amber-300 flex items-center justify-between cursor-pointer"
                >
                  <span>🛠️ Module_3: Devator / System-Change Executor Engine</span>
                  <Folder className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Info Note */}
      <div className={`mt-auto p-4 border rounded-2xl text-left flex items-start gap-3 shrink-0 ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Navigation Tip</span>
          <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
            Toggle the pages using the Top Bar tabs, or use the bottom navigation drawer for speedy transitions! Open AI Copilot on the right to assist with sandbox edits instantly.
          </p>
        </div>
      </div>
    </section>
  );
};
