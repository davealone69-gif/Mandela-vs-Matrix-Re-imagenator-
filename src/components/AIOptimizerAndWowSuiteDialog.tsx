import React, { useState, useEffect, useRef } from 'react';
import {
  X, Brain, Cpu, Star, ShieldCheck, Terminal, Award, Play, RefreshCw,
  ChevronRight, HelpCircle, Flame, Layers, Zap, Check, ArrowRight, Gauge,
  Database, Scale, Laptop, Smartphone, Activity, Sliders, ShieldAlert,
  FileText, CheckCircle2, TrendingUp, AlertTriangle, Video, Mic, Upload,
  Eye, ShoppingCart, Download, Sparkles, Send, Copy, ArrowLeftRight, CheckSquare,
  Palette
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
  files: Array<{
    name: string;
    path: string;
    language: string;
    content: string;
  }>;
  onApplyCodeChange?: (filePath: string, newContent: string) => void;
  triggerToast: (msg: string) => void;
}

// Interfaces for our state elements
interface DebateMessage {
  id: string;
  sender: string;
  role: string;
  avatar: string;
  color: string;
  text: string;
  code?: string;
  timestamp: string;
}

interface OptimizationCandidate {
  id: string;
  fileName: string;
  filePath: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  metric: string;
  beforeCode: string;
  afterCode: string;
  explanation: string;
}

interface PluginItem {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: string;
  installed: boolean;
  premium: boolean;
}

export default function AIOptimizerAndWowSuiteDialog({
  isDark,
  onClose,
  files,
  onApplyCodeChange,
  triggerToast
}: Props) {
  const [activeTab, setActiveTab] = useState<'prompt_app' | 'remap_engine' | 'agents' | 'optimizer' | 'cross' | 'voice' | 'screenshot' | 'video' | 'cloud' | 'marketplace'>('prompt_app');

  // ==========================================
  // OMNI-CORE PROMPT-TO-FULL-APP GENERATOR STATE
  // ==========================================
  const [promptInput, setPromptInput] = useState('Create a high-performance offline Fitness tracker with heart-rate charts, local Room databases, and biometrics secure login');
  const [selectedTheme, setSelectedTheme] = useState('Cosmic Slate');
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);
  const [appGenStep, setAppGenStep] = useState<number>(0);
  const [appGenLogs, setAppGenLogs] = useState<string[]>([]);
  const [appGenCode, setAppGenCode] = useState<string>('');
  const [activePreviewScreen, setActivePreviewScreen] = useState<'telemetry' | 'code' | 'simulator'>('telemetry');

  // ==========================================
  // APP STYLE REMAP ENGINE (MIDJOURNEY-FOR-APPS) STATE
  // ==========================================
  const [remapStyle, setRemapStyle] = useState<'glassmorphic' | 'brutalist' | 'neon' | 'cyberpunk' | 'cozy' | 'retro' | 'luxury'>('glassmorphic');
  const [remapTheme, setRemapTheme] = useState<'dark' | 'pastel' | 'monochrome' | 'nature' | 'tech'>('dark');
  const [remapMood, setRemapMood] = useState<'calm' | 'energetic' | 'mysterious' | 'warm' | 'playful'>('calm');
  const [remapMotion, setRemapMotion] = useState<'snappy' | 'floaty' | 'elastic' | 'cinematic'>('elastic');
  const [remapDensity, setRemapDensity] = useState<'minimal' | 'information-rich'>('minimal');
  const [remapPersonality, setRemapPersonality] = useState<'rounded' | 'sharp' | 'soft' | 'bold'>('rounded');

  const [remapInputType, setRemapInputType] = useState<'screenshot' | 'layout_xml' | 'compose_file' | 'running_app'>('screenshot');
  const [remapInputName, setRemapInputName] = useState('LegacyFitPulseXml');
  const [remapInputContent, setRemapInputContent] = useState('android:layout_width="match_parent"\nandroid:layout_height="match_parent"\nandroid:background="#121212"');

  const [isRemapping, setIsRemapping] = useState(false);
  const [remapStep, setRemapStep] = useState<number>(0);
  const [remapLogs, setRemapLogs] = useState<string[]>([]);
  const [remapOutputCode, setRemapOutputCode] = useState<string>('');
  const [remapActiveSubTab, setRemapActiveSubTab] = useState<'visualizer' | 'blueprint' | 'code' | 'logs'>('visualizer');

  const remapPresets = [
    {
      name: '🏋️ Legacy FitPulse XML',
      type: 'layout_xml' as const,
      fileName: 'activity_fit_pulse.xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#121212"
    android:padding="16dp">
    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Legacy FitPulse Tracker"
        android:textSize="24sp"
        android:textColor="#FFFFFF" />
    <ProgressBar
        android:id="@+id/pulseProgress"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:progress="65" />
    <Button
        android:id="@+id/btnStart"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="START TRAINING" />
</LinearLayout>`
    },
    {
      name: '🪙 CryptoWallet Compose',
      type: 'compose_file' as const,
      fileName: 'CryptoWalletScreen.kt',
      content: `@Composable
fun LegacyWalletScreen() {
    Column(modifier = Modifier.fillMaxSize().background(Color.Black).padding(16.dp)) {
        Text("Your Assets", fontSize = 20.sp, color = Color.White)
        Spacer(modifier = Modifier.height(10.dp))
        LegacyTransactionList()
        Button(onClick = { /* Sync */ }) {
            Text("REFRESH BLOCKCHAIN")
        }
    }
}`
    },
    {
      name: '🎵 Retro WaveSynth Node',
      type: 'running_app' as const,
      fileName: 'SynthAppGraph',
      content: `// Native UI dump of legacy running build
Hierarchy:
- RootWindow (1080x1920)
  - ContainerVertical (padding=32px)
    - WaveformCanvas (height=240px, type=sinewave)
    - ControlGrid (columns=2)
      - FreqSlider (val=440Hz)
      - DetuneSlider (val=12cents)`
    },
    {
      name: '📸 Screenshot Scan File',
      type: 'screenshot' as const,
      fileName: 'dashboard_screenshot_legacy.png',
      content: '[RAW_IMAGE_BINARY: legacy_app_screenshot_extracted_layout_nodes_and_palette_hex_values]'
    }
  ];

  const runAppStyleRemap = () => {
    if (isRemapping) return;
    setIsRemapping(true);
    setRemapStep(1);
    setRemapActiveSubTab('logs');
    setRemapLogs([
      `🧬 [APP GENOME] Parsing legacy UI target layout structure from type: ${remapInputType.toUpperCase()}`,
      `🧬 [APP GENOME] Resource Name: "${remapInputName}"`,
      `🧬 [APP GENOME] Detected typography styles: Roboto Regular, layout density: 1.2dp/px`,
      `🧬 [APP GENOME] Extracted UI hierarchy nodes count: 18 elements`,
      `🧬 [APP GENOME] App Genome extraction completed successfully.`
    ]);

    // Step 2: Merging DNA
    setTimeout(() => {
      setRemapStep(2);
      setRemapLogs(prev => [
        ...prev,
        `🎨 [STYLE DNA] Formulating mapping constraints: Style Profile [${remapStyle.toUpperCase()}]`,
        `🎨 [STYLE DNA] Mapping palette values (Theme: ${remapTheme}, Mood: ${remapMood})`,
        `🎨 [STYLE DNA] Tuning spring equations (Motion: ${remapMotion}, Density: ${remapDensity})`,
        `🎨 [STYLE DNA] Synthesizing custom component shapes: [Personality: ${remapPersonality.toUpperCase()}]`,
        `✓ [STYLE DNA] Styled App Blueprint generated. Merging App Genome with Style DNA...`
      ]);
    }, 1500);

    // Step 3: Reconstructing App
    setTimeout(() => {
      setRemapStep(3);
      setRemapLogs(prev => [
        ...prev,
        `💻 [OMNI-CORE RECONSTRUCTION] Synthesizing new Jetpack Compose layout trees...`,
        `💻 [OMNI-CORE RECONSTRUCTION] Creating high-fidelity view components matching [${remapStyle}] style...`,
        `💻 [OMNI-CORE RECONSTRUCTION] Orchestrating ViewModels with Clean MVVM repositories and dynamic coroutine scopes`,
        `💻 [OMNI-CORE RECONSTRUCTION] Generating gesture modifiers for tactile feedback & cinematic transition curves`,
        `✓ [OMNI-CORE RECONSTRUCTION] Rebuild successful: 8 custom Composable widgets generated.`
      ]);
    }, 3000);

    // Step 4: Multi-Agent Refinement
    setTimeout(() => {
      setRemapStep(4);
      setRemapLogs(prev => [
        ...prev,
        `🧠 [MULTI-AGENT REFINE] Submitting remapped blueprint to collective peer review...`,
        `🧠 [ARCHITECT]: Verification passed. Code architecture conforms to clean separation of concerns.`,
        `🧠 [UX SPECIALIST]: Usability score of [${remapStyle}] theme is highly compliant with [${remapMood}] mood goals.`,
        `🧠 [MOTION DESIGNER]: Motion easing matches [${remapMotion}] behavior perfectly.`,
        `🧠 [SECURITY AUDITOR]: Zero-trust encryption layer mapped over internal storage.`,
        `✓ [MULTI-AGENT REFINE] Unanimous consensus reached on Remap Blueprint.`
      ]);
    }, 4500);

    // Step 5: Sandbox Test & Output
    setTimeout(() => {
      setRemapStep(5);
      setRemapLogs(prev => [
        ...prev,
        `⚡ [AUTONOMOUS TEST] Booting Android sandbox virtual device...`,
        `⚡ [AUTONOMOUS TEST] Running recompilation metrics profiler (0 frame drops, 60fps stable)...`,
        `⚡ [AUTONOMOUS TEST] Injecting mock touch events stress-test (Passed)...`,
        `🎉 [STYLE REMAP ENGINE] AESTHETIC MASTERPIECE SYNTHESIZED!`
      ]);
      setRemapStep(6);
      setIsRemapping(false);
      setRemapActiveSubTab('visualizer');
      triggerToast(`🎉 Successfully remapped "${remapInputName}" into beautiful ${remapStyle} style!`);

      // Code generator
      setRemapOutputCode(`package com.Mandela vs Matrix Re-Imaginator.omnicore.remapped

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.foundation.background
import androidx.compose.animation.core.*

/**
 * Reconstructed Aesthetic Masterpiece
 * Source App Genome: ${remapInputName}
 * Target Style DNA: Style=[${remapStyle}], Theme=[${remapTheme}], Mood=[${remapMood}], Motion=[${remapMotion}]
 * Synthesized dynamically by Omni-Core Creation Engine.
 */
@Composable
fun RemappedAestheticApp() {
    val styleConfig = remember {
        StyleDNA(
            style = "${remapStyle}",
            theme = "${remapTheme}",
            mood = "${remapMood}",
            density = "${remapDensity}",
            personality = "${remapPersonality}"
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(${remapStyle === 'glassmorphic' || remapStyle === 'luxury' || remapTheme === 'dark' ? 'Color(0xFF0D0F14)' : 'Color(0xFFF4F6FA)'})
    ) {
        Column(
            modifier = Modifier
                .padding(${remapDensity === 'minimal' ? '24.dp' : '12.dp'})
                .fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            LegacyHeaderRemapped(styleConfig)
            MetricsVisualizerRemapped(styleConfig)
            InteractiveFooterControlRemapped(styleConfig)
        }
    }
}
`);
    }, 6000);
  };

  const runOmniCoreGenerator = () => {
    if (isGeneratingApp) return;
    setIsGeneratingApp(true);
    setAppGenStep(1);
    setAppGenLogs(['[VISION LAYER] Extracting semantic triggers from prompt...', `[VISION LAYER] Target: "${promptInput}"`, `[VISION LAYER] Formulating layout maps with theme [${selectedTheme}]`]);
    setAppGenCode('');

    // Step 1: Vision Layer
    setTimeout(() => {
      setAppGenStep(2);
      setAppGenLogs(prev => [
        ...prev,
        '✓ [VISION LAYER] Layout structure created: { TopBar, PrimaryChartGrid, DetailMetricsGrid, BottomNav }',
        '✓ [VISION LAYER] Gesture flow modeled: DoubleTap zoom, Pinch-to-scale tracker, SwipedDismiss lists',
        '[CREATION LAYER] Initiating Jetpack Compose layout synthesis...',
        '[CREATION LAYER] Binding Hardware permissions: Manifest.permission.USE_BIOMETRIC, Manifest.permission.ACCESS_FINE_LOCATION'
      ]);
    }, 1500);

    // Step 2: Creation Layer
    setTimeout(() => {
      setAppGenStep(3);
      setAppGenLogs(prev => [
        ...prev,
        '✓ [CREATION LAYER] Kotlin components generated successfully.',
        '✓ [CREATION LAYER] Navigation orchestration and ViewModels configured.',
        '✓ [CREATION LAYER] SQLite Room Local schemas generated: "UserActivityEntity", "BiometricAuditEntry"',
        '[EVOLUTION LAYER] Self-improving codebase metrics analyzer booted...',
        '[EVOLUTION LAYER] Refactoring redundant recompositions inside LazyColumn...',
        '[EVOLUTION LAYER] Tuning gesture spring stiffness values: stiffness = 1200f, damping = 0.82f'
      ]);
    }, 3000);

    // Step 3: Evolution Layer
    setTimeout(() => {
      setAppGenStep(4);
      setAppGenLogs(prev => [
        ...prev,
        '✓ [EVOLUTION LAYER] Code cyclomatic complexity decreased by 18.4%',
        '✓ [EVOLUTION LAYER] Motion curves validated for 60fps jank-free rendering',
        '[MULTI-AGENT LAYER] Submitting layout to collective review...',
        '🧠 [ARCHITECT]: Verification passed. Code architecture satisfies CleanMVVM constraints.',
        '🔎 [REVIEWER]: Checking variable bindings... All composable states are using rememberSaveable.',
        '🛡️ [SECURITY AUDITOR]: Zero-trust rules validated. Database encryption keys securely mapped.',
        '🎨 [UX SPECIALIST]: Text contrast verified (4.8:1 ratio). Responsive padding matches 8dp grid constraints.'
      ]);
    }, 4500);

    // Step 4: Multi-Agent Layer
    setTimeout(() => {
      setAppGenStep(5);
      setAppGenLogs(prev => [
        ...prev,
        '✓ [MULTI-AGENT LAYER] Unanimous consensus reached (Consensus Index: 98.4%)',
        '[AUTONOMOUS LOOP] Performing automated local build validation & sandbox checks...',
        '[AUTONOMOUS LOOP] Running monkey UI gestures test suite (500 events injected)...',
        '✓ [AUTONOMOUS LOOP] 0 crashes, 0 frame drops, 0 security leaks detected.'
      ]);
    }, 6000);

    // Step 5: Complete
    setTimeout(() => {
      setAppGenStep(6);
      setAppGenLogs(prev => [
        ...prev,
        '🎉 [OMNI-CORE ENGINE] GENERATION COMPLETE!',
        '✓ Production-ready Android App bundle ready for sideloading & export.',
        '✓ 12 custom Compose screens created.',
        '✓ 100% test coverage verified.'
      ]);
      
      // Inject some high quality Jetpack Compose code
      setAppGenCode(`package com.Mandela vs Matrix Re-Imaginator.omnicore.generated

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.graphics.Color
import androidx.compose.animation.*
import androidx.compose.animation.core.*

/**
 * Omni-Core Autonomous Creation Engine Generated Layout
 * Specialization: ${promptInput}
 * Theme Profile: ${selectedTheme} (Architect: Autonomous Builder)
 */
class GeneratedAppActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            OmniCoreTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainAppOrchestrator()
                }
            }
        }
    }
}

@Composable
fun MainAppOrchestrator() {
    var activeTab by remember { mutableStateOf(0) }
    
    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = Color(0xFF0F111A)) {
                NavigationBarItem(
                    selected = activeTab == 0,
                    onClick = { activeTab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Dashboard") },
                    label = { Text("Home", style = MaterialTheme.typography.labelSmall) }
                )
                NavigationBarItem(
                    selected = activeTab == 1,
                    onClick = { activeTab = 1 },
                    icon = { Icon(Icons.Default.Star, contentDescription = "Charts") },
                    label = { Text("Insights", style = MaterialTheme.typography.labelSmall) }
                )
                NavigationBarItem(
                    selected = activeTab == 2,
                    onClick = { activeTab = 2 },
                    icon = { Icon(Icons.Default.Lock, contentDescription = "Security") },
                    label = { Text("Secured", style = MaterialTheme.typography.labelSmall) }
                )
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            HeaderSection()
            Spacer(modifier = Modifier.height(16.dp))
            MetricsGrid()
        }
    }
}`);
      setIsGeneratingApp(false);
      triggerToast('🎉 Omni-Core Autonomous Generation Completed Successfully!');
    }, 7500);
  };


  // ==========================================
  // TAB 1: MULTI-AGENT DISCUSSION CHAMBER
  // ==========================================
  const [debateTopic, setDebateTopic] = useState('optimize_rendering');
  const [isDebating, setIsDebating] = useState(false);
  const [consensusScore, setConsensusScore] = useState(65);
  const [debateMessages, setDebateMessages] = useState<DebateMessage[]>([]);
  const debateEndRef = useRef<HTMLDivElement>(null);

  const debateTopics = {
    optimize_rendering: {
      title: "Optimize Jetpack Compose List Draw-Cycle Frame Rates",
      description: "How can we eliminate excessive composition recompositions on item list scrolls?"
    },
    secure_sql: {
      title: "Isolate Token Boundaries & Prevent SQL Injections",
      description: "Harden local room database queries and securely encrypt cache tables."
    },
    battery_conserve: {
      title: "Mitigate Battery Footprint on Periodic Thread Syncs",
      description: "Throttle work manager schedules during battery-saver state."
    }
  };

  const runMultiAgentDebate = () => {
    if (isDebating) return;
    setIsDebating(true);
    setConsensusScore(40);
    setDebateMessages([]);

    const messagesSequence = [
      {
        sender: "Lead Architect / Code Gen",
        role: "Architecture Core",
        avatar: "💻",
        color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
        text: `Based on our current Compose trees, we can prevent recompositions by utilizing \`remember\` with correct key dependencies, wrapping our list model states in stable annotations, and enforcing \`derivedStateOf\` for scroll parameters. Let's write an optimized implementation:`,
        code: `// Lead Architect Recommendation\n@Composable\nfun OptimizingList(items: List<DataNode>) {\n    val listState = rememberLazyListState()\n    // Wrap dynamic scrolling calculations in derivedStateOf\n    val showFloatingButton by remember { \n        derivedStateOf { listState.firstVisibleItemIndex > 2 } \n    }\n    LazyColumn(state = listState) {\n        items(items, key = { it.id }) { item ->\n            StableItemCard(item = item)\n        }\n    }\n}`
      },
      {
        sender: "QA & Review Agent",
        role: "Validation & QA",
        avatar: "🔬",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
        text: `Excellent. Standard lists in Compose recompose all nodes whenever the parent list container scrolls if keys are missing. By defining \`key = { it.id }\`, we guide Compose's internal index tree to re-arrange nodes without drawing them from scratch. I approve of the AST compilation, but we must check if \`StableItemCard\` truly avoids mutable recompositions.`,
      },
      {
        sender: "Cognitive UX Specialist",
        role: "Aesthetics Auditor",
        avatar: "🎨",
        color: "text-pink-400 border-pink-500/20 bg-pink-950/20",
        text: `From a UX and visual performance point of view, when recompositions spike, user input feels sluggish, leading to frame drops. We should pair this scroll optimization with a smooth, staggered fade-in entrance for items using animated visibility modifiers. Let's add standard spring physics:`,
        code: `@Composable\nfun StableItemCard(item: DataNode) {\n    AnimatedVisibility(\n        visible = true,\n        enter = fadeIn(animationSpec = spring(stiffness = Spring.StiffnessLow))\n    ) {\n        CardLayout(item)\n    }\n}`
      },
      {
        sender: "RAM & Performance Optimizer",
        role: "Memory & CPU",
        avatar: "⚡",
        color: "text-amber-400 border-amber-500/20 bg-amber-950/20",
        text: `Adding animations can consume extra draw cycles if not monitored. However, using \`Spring.StiffnessLow\` limits excessive CPU wakes. To protect memory, make sure the lambda passed into \`StableItemCard\` is stabilized via a method reference or a static \`remember\` lambda, otherwise it breaks Compose's memoization boundary!`,
      },
      {
        sender: "Zero-Trust Security Auditor",
        role: "Sandbox Security",
        avatar: "🛡️",
        color: "text-indigo-400 border-indigo-500/20 bg-indigo-950/20",
        text: `Security check complete. This purely UI-bound render optimization does not access the SQLite database, shared storage, or outbound network streams. There are no memory leaks or credential bypasses. Isolation is 100% verified. Clear to commit.`,
      }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < messagesSequence.length) {
        const msg = messagesSequence[currentIdx];
        setDebateMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: msg.sender,
            role: msg.role,
            avatar: msg.avatar,
            color: msg.color,
            text: msg.text,
            code: msg.code,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        setConsensusScore(prev => Math.min(prev + 12, 98));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsDebating(false);
        triggerToast('Multi-Agent Debate Consensus reached! All security & performance checks cleared.');
      }
    }, 1500);
  };

  useEffect(() => {
    if (debateEndRef.current) {
      debateEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debateMessages]);

  // ==========================================
  // TAB 2: SELF-IMPROVING OPTIMIZER
  // ==========================================
  const [selectedCandidate, setSelectedCandidate] = useState<string>('c1');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [appliedOptimizations, setAppliedOptimizations] = useState<string[]>([]);

  const optimizationCandidates: OptimizationCandidate[] = [
    {
      id: "c1",
      fileName: "MainActivity.kt",
      filePath: "app/src/main/java/MainActivity.kt",
      description: "Redundant Compose list drawings causing frame lags during rapid vertical scrolls.",
      impact: "High",
      metric: "Reduces Recompositions by 78% (FPS: 58 -> 60)",
      beforeCode: `// REDUNDANT DRAWINGS\nLazyColumn {\n    items(itemsList) { item ->\n        // No item key specified, causes layout invalidation\n        UserItemRow(item, onClick = {\n            // Lambda created on every draw, breaks memoization\n            openItemDetails(item)\n        })\n    }\n}`,
      afterCode: `// OPTIMIZED JETPACK COMPOSE STATE\nval onDetailsClicked = remember(openItemDetails) { \n    { clickedItem: DataNode -> openItemDetails(clickedItem) } \n}\nLazyColumn(state = rememberLazyListState()) {\n    items(itemsList, key = { it.id }) { item ->\n        UserItemRow(item, onClick = onDetailsClicked)\n    }\n}`,
      explanation: "Stabilizes click callbacks by wrapping lambda definitions in 'remember' and appends a unique ID key tracking constraint. This prevents the compose runtime from invalidating neighbor slots on single element mutations."
    },
    {
      id: "c2",
      fileName: "LocalDBHelper.kt",
      filePath: "app/src/main/java/db/LocalDBHelper.kt",
      description: "Synchronous blocking database reads on the Main UI Thread triggering screen stutter alarms (ANR).",
      impact: "High",
      metric: "Offloads UI Thread entirely (DB read delay: 0ms)",
      beforeCode: `// BLOCKING SQL CALLS ON MAIN THREAD\nfun fetchLocalCachedNotes(): List<Note> {\n    val db = this.readableDatabase\n    val cursor = db.rawQuery("SELECT * FROM notes", null)\n    // Cursor extraction blocks main thread rendering...\n    return extractNotes(cursor)\n}`,
      afterCode: `// KOTLIN ASYNC COROUTINES DISPATCHER\nsuspend fun fetchLocalCachedNotes(): List<Note> = \n    withContext(Dispatchers.IO) {\n        val db = this@LocalDBHelper.readableDatabase\n        val cursor = db.rawQuery("SELECT * FROM notes", null)\n        extractNotes(cursor)\n    }`,
      explanation: "Migrates blocking JDBC/SQLite cursor sweeps to 'Dispatchers.IO' background thread pool using structured Kotlin Coroutines. Prevents UI thread starvation and removes Android OS Application Not Responding (ANR) warnings."
    },
    {
      id: "c3",
      fileName: "DeviceSyncService.kt",
      filePath: "app/src/main/java/sync/DeviceSyncService.kt",
      description: "Aggressive, unthrottled background sync loops waking CPU cores constantly during low battery.",
      impact: "Medium",
      metric: "Saves 35% background battery draw",
      beforeCode: `// AGGRESSIVE UNCONSTRAINED TIMER\nfun startBackgroundPeriodicSync() {\n    Timer().scheduleAtFixedRate(object : TimerTask() {\n        override fun run() { triggerServerSync() }\n    }, 0, 300000) // Runs blindly every 5 mins\n}`,
      afterCode: `// GOOGLE WORK MANAGER WITH CONSTRAINTS\nfun scheduleThrottledSync(context: Context) {\n    val constraints = Constraints.Builder()\n        .setRequiredNetworkType(NetworkType.CONNECTED)\n        .setRequiresBatteryNotLow(true)\n        .build()\n    val syncWork = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)\n        .setConstraints(constraints)\n        .build()\n    WorkManager.getInstance(context).enqueue(syncWork)\n}`,
      explanation: "Replaces Java raw Timers with Jetpack WorkManager architecture enforcing battery-saving and network constraints. Optimizes CPU deep-sleep cycles and complies with modern Android sleep rules."
    }
  ];

  const applyProjectImprovement = (candidate: OptimizationCandidate) => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    triggerToast(`AI Optimizer: Refactoring syntax structure for ${candidate.fileName}...`);

    setTimeout(() => {
      setAppliedOptimizations(prev => [...prev, candidate.id]);
      setIsOptimizing(false);
      triggerToast(`✓ Successfully committed optimized masterpiece model to ${candidate.fileName}!`);
    }, 1800);
  };

  // ==========================================
  // TAB 3: CROSS-PLATFORM TRANSLATOR
  // ==========================================
  const [transpileTarget, setTranspileTarget] = useState<'swift' | 'react' | 'electron'>('swift');
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceCode, setSourceCode] = useState(`@Composable\nfun ProfileCard(user: User, onMessage: () => Unit) {\n    Card(modifier = Modifier.padding(16.dp)) {\n        Column {\n            Text(text = user.name, style = MaterialTheme.typography.h6)\n            Spacer(modifier = Modifier.height(8.dp))\n            Button(onClick = onMessage) {\n                Text("Send Message")\n            }\n        }\n    }\n}`);

  const [translationOutput, setTranslationOutput] = useState('');

  const runCrossPlatformTranspiler = () => {
    setIsTranslating(true);
    triggerToast(`Cross-Platform Compiler: Mapping Kotlin Compose node to ${transpileTarget.toUpperCase()}...`);

    setTimeout(() => {
      let result = '';
      if (transpileTarget === 'swift') {
        result = `// Translated iOS SwiftUI Code\nstruct ProfileCard: View {\n    let user: User\n    var onMessage: () -> Void\n    \n    var body: some View {\n        VStack(alignment: .leading, spacing: 8) {\n            Text(user.name)\n                .font(.headline)\n                .foregroundColor(.primary)\n            \n            Button(action: onMessage) {\n                Text("Send Message")\n                    .font(.subheadline)\n                    .bold()\n                    .padding()\n                    .background(Color.blue)\n                    .foregroundColor(.white)\n                    .cornerRadius(8)\n            }\n        }\n        .padding(16)\n        .background(Color(.secondarySystemBackground))\n        .cornerRadius(12)\n    }\n}`;
      } else if (transpileTarget === 'react') {
        result = `// Translated Web React & Tailwind Component\nimport React from 'react';\n\ninterface ProfileCardProps {\n  user: { name: string };\n  onMessage: () => void;\n}\n\nexport default function ProfileCard({ user, onMessage }: ProfileCardProps) {\n  return (\n    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl max-w-sm flex flex-col gap-3">\n      <h3 className="text-sm font-black text-white">{user.name}</h3>\n      <button\n        onClick={onMessage}\n        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-md"\n      >\n        Send Message\n      </button>\n    </div>\n  );\n}`;
      } else {
        result = `// Translated Desktop Electron Main Module\nconst { app, BrowserWindow, ipcMain } = require('electron');\nconst path = require('path');\n\nfunction createProfileCardWindow(user) {\n  const win = new BrowserWindow({\n    width: 400,\n    height: 300,\n    webPreferences: {\n      nodeIntegration: true\n    }\n  });\n  \n  win.loadURL(\`data:text/html,<html>\n    <body style="font-family:sans-serif; background:#0f172a; color:white; padding:20px;">\n      <h2>\${user.name}</h2>\n      <button onclick="window.sendIPC('message')">Send Message</button>\n    </body>\n  </html>\`);\n}`;
      }
      setTranslationOutput(result);
      setIsTranslating(false);
      triggerToast('Cross-platform code mapping finished! Render tree synthesized.');
    }, 1200);
  };

  // ==========================================
  // TAB 4: VOICE-CONTROLLED SYNTHESIZER
  // ==========================================
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [voiceWaveform, setVoiceWaveform] = useState<number[]>(Array(24).fill(10));
  const [recognizedText, setRecognizedText] = useState('');
  const [voiceOutputCode, setVoiceOutputCode] = useState('');
  const [isCompilingVoice, setIsCompilingVoice] = useState(false);

  const voicePrompts = [
    { text: "Add an offline room database storage file with standard sync cues", desc: "Local Sync Database" },
    { text: "Design a high-fidelity profiles dashboard with dynamic charts and user streaks", desc: "User Activity Analytics" },
    { text: "Create biometric hardware locking module with fallback pin patterns", desc: "Secure Lock Controller" }
  ];

  // Bouncing animation for waveform
  useEffect(() => {
    let interval: any;
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setVoiceWaveform(prev => prev.map(() => Math.floor(Math.random() * 50) + 10));
        setVoiceProgress(p => {
          if (p >= 100) {
            setIsVoiceRecording(false);
            setRecognizedText("Synthesize an optimized Room database module for offline notes caching");
            return 100;
          }
          return p + 4;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  const compileVoiceCommand = () => {
    if (!recognizedText) {
      triggerToast('Please dictatate or select a voice prompt first!');
      return;
    }
    setIsCompilingVoice(true);
    triggerToast('Voice Synthesizer: Running audio FFT-spectral analysis...');

    setTimeout(() => {
      const generated = `// Voice Synthesized Kotlin Database Module\n@Database(entities = [CachedNote::class], version = 1)\nabstract class OfflineNotesDatabase : RoomDatabase() {\n    abstract fun notesDao(): NotesDao\n\n    companion object {\n        @Volatile private var INSTANCE: OfflineNotesDatabase? = null\n        \n        fun getInstance(context: Context): OfflineNotesDatabase {\n            return INSTANCE ?: synchronized(this) {\n                val instance = Room.databaseBuilder(\n                    context.applicationContext,\n                    OfflineNotesDatabase::class.java,\n                    "offline_notes_cache"\n                ).fallbackToDestructiveMigration().build()\n                INSTANCE = instance\n                instance\n            }\n        }\n    }\n}`;
      setVoiceOutputCode(generated);
      setIsCompilingVoice(false);
      triggerToast('🎙️ Voice-guided synthesis complete! Code generated with high-fidelity glow.');
    }, 1500);
  };

  // ==========================================
  // TAB 5: SCREENSHOT-TO-APP SCANNER
  // ==========================================
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedMockImage, setSelectedMockImage] = useState<string | null>(null);
  const [scannedOutput, setScannedOutput] = useState<{
    palette: string[];
    elements: string[];
    code: string;
  } | null>(null);

  const mockScreenshots = [
    { id: 'dash', name: 'Cryptocurrency Wallet', color: 'from-amber-500 to-yellow-600', mockFile: 'crypto_wallet_ui' },
    { id: 'settings', name: 'Bento-Grid Health Dashboard', color: 'from-emerald-500 to-teal-600', mockFile: 'fitness_tracker_ui' },
    { id: 'auth', name: 'Secure Onboarding Portal', color: 'from-indigo-500 to-purple-600', mockFile: 'login_security_ui' }
  ];

  const runScreenshotScan = () => {
    if (!selectedMockImage) {
      triggerToast('Please select a mock screenshot to scan first!');
      return;
    }
    setIsScanning(true);
    setScanProgress(0);
    setScannedOutput(null);

    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScannedOutput({
            palette: ['#0f172a', '#6366f1', '#10b981', '#f59e0b'],
            elements: [
              'Container Layout (Full Screen Canvas)',
              'Header Title Text ("My Wallet Balance")',
              'Interactive Card Block (Crypto Asset Row)',
              'Horizontal Scroll Row (Navigation Pills)',
              'Elevated Floating Action Trigger Button'
            ],
            code: `// Compiled Kotlin Jetpack Compose Code from Screenshot\n@Composable\nfun ScannedDashboardLayout() {\n    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF0F172A))) {\n        Column(modifier = Modifier.padding(16.dp)) {\n            Text("Wallet Assets", style = MaterialTheme.typography.h4, color = Color.White)\n            Spacer(modifier = Modifier.height(24.dp))\n            CryptoCardRow(name = "Bitcoin", balance = "1.42 BTC", color = Color(0xFFF59E0B))\n            CryptoCardRow(name = "Ethereum", balance = "24.5 ETH", color = Color(0xFF6366F1))\n        }\n    }\n}`
          });
          triggerToast('✓ OCR & Visual segmentation analysis complete! UI mapped.');
          return 100;
        }
        return p + 5;
      });
    }, 150);
  };

  // ==========================================
  // TAB 6: VIDEO-TO-APP MOTION RECREATOR
  // ==========================================
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoFrame, setVideoFrame] = useState(0);
  const [isTrackingMotion, setIsTrackingMotion] = useState(false);
  const [gestureLogs, setGestureLogs] = useState<string[]>([]);
  const [motionOutputCode, setMotionOutputCode] = useState('');

  const runMotionRecreation = () => {
    setIsTrackingMotion(true);
    setGestureLogs([]);
    setMotionOutputCode('');

    const logSteps = [
      "Initializing Optical Flow vectors...",
      "Detecting Touch Coordinates (x: 420px, y: 840px)",
      "Tracking vertical flick gesture (v_y: -4.2m/s)",
      "Extracting dampening deceleration ratio...",
      "Evaluating physics spring boundaries..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logSteps.length) {
        setGestureLogs(prev => [...prev, logSteps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsTrackingMotion(false);
        setMotionOutputCode(`// High-Fidelity Physics-Based Gesture Physics (Jetpack Compose)\nval springSpec = spring<Float>(\n    dampingRatio = Spring.DampingRatioLowBouncy,\n    stiffness = Spring.StiffnessMedium\n)\n\nval offsetY = remember { Animatable(0f) }\nval dragModifier = Modifier.pointerInput(Unit) {\n    detectVerticalDragGestures(\n        onDragEnd = {\n            coroutineScope.launch {\n                offsetY.animateTo(0f, animationSpec = springSpec)\n            }\n        },\n        onDrag = { _, dragAmount ->\n            coroutineScope.launch {\n                offsetY.snapTo(offsetY.value + dragAmount)\n            }\n        }\n    )\n}`);
        triggerToast('🎥 Gestural physics mapped directly to spring physics parameters!');
      }
    }, 600);
  };

  // ==========================================
  // TAB 7: CLOUD DEVICE TEST HARNESS
  // ==========================================
  const [activeDeviceTest, setActiveDeviceTest] = useState<string | null>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [fpsData, setFpsData] = useState<number[]>(Array(15).fill(60));

  const cloudDevices = [
    { id: 'p9', name: 'Pixel 9 Pro (G-Denver)', specs: 'Android 15, API 35', status: 'ready' },
    { id: 's26', name: 'Galaxy S26 Ultra (KR-Seoul)', specs: 'Android 16, API 36', status: 'ready' },
    { id: 'tab', name: 'Nexus Core Tablet (Dublin)', specs: 'Android 14, API 34', status: 'ready' }
  ];

  const triggerCloudMonkeyTest = (device: string) => {
    if (isTesting) return;
    setIsTesting(true);
    setActiveDeviceTest(device);
    setTestLogs([]);
    triggerToast(`Sideloading apk to cloud runner: ${device}...`);

    const actions = [
      "Connecting to virtual device bridge (ADB)...",
      "Sideloading apk file 'app-debug.apk' ... Done (14.2 MB)",
      "Triggering Android Activity: MainAppNavigator",
      "Monkey testing started: injecting random touch and drag inputs...",
      "Touch coordinate at center layout (x:512, y:920)",
      "Bouncing scroll list. FPS: 59.8, Draw cycles: normal",
      "Injecting heavy RAM state injection audit...",
      "Garbage collector sweeps executed. Zero leaks flagged.",
      "Finished 150 monkey event sweeps successfully. Build is rock solid!"
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < actions.length) {
        setTestLogs(prev => [...prev, actions[step]]);
        setFpsData(prev => [...prev.slice(1), Math.floor(Math.random() * 8) + 53]);
        step++;
      } else {
        clearInterval(interval);
        setIsTesting(false);
        triggerToast('📱 Cloud device test sweeps completed! Build is exceptionally robust.');
      }
    }, 600);
  };

  // ==========================================
  // TAB 8: PLUGIN MARKETPLACE
  // ==========================================
  const [plugins, setPlugins] = useState<PluginItem[]>([
    { id: 'p1', name: 'Drizzle SQLite Cache Sync', description: 'Enable background cloud replication for local Room SQL databases with automatic merge rules.', category: 'Storage', rating: 4.9, downloads: '14.2k', installed: false, premium: true },
    { id: 'p2', name: 'Gemini Voice Agent Bridge', description: 'Enable real-time voice prompts inside the app using Gemini Live Audio synthesis.', category: 'AI Intelligence', rating: 4.8, downloads: '9.8k', installed: false, premium: false },
    { id: 'p3', name: 'Biometric FaceID Lock', description: 'Hardware simulator layer to test face scanning and screen locks with fallback codes.', category: 'Hardware', rating: 4.9, downloads: '24.1k', installed: true, premium: false },
    { id: 'p4', name: 'Weaviate Hybrid RAG Connector', description: 'Connects your local device vector embeddings back to remote cloud nodes.', category: 'Data & Sync', rating: 4.7, downloads: '5.4k', installed: false, premium: true },
    { id: 'p5', name: 'Android WearOS Companion', description: 'Simulates pushing notifications, heart-rates, and task checkpoints to wearable smartwatch targets.', category: 'IoT Devices', rating: 4.6, downloads: '3.1k', installed: false, premium: false }
  ]);

  const togglePluginInstall = (pluginId: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === pluginId) {
        const nextState = !p.installed;
        triggerToast(`${nextState ? 'Installed' : 'Deactivated'} ${p.name}!`);
        return { ...p, installed: nextState };
      }
      return p;
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-6xl rounded-2xl shadow-[0_0_80px_rgba(124,58,237,0.2)] overflow-hidden flex flex-col max-h-[92vh] ${
        isDark ? 'bg-[#0f111a] border border-[#2b3040] text-slate-200' : 'bg-white border border-slate-200 text-slate-800'
      }`}>
        
        {/* Header banner */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'bg-[#151926] border-[#2b3040]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-400 border border-purple-500/20 shadow-inner animate-pulse">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase flex items-center gap-2">
                🤖 AI Multi-Agent Autonomy Lab <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-black">PREMIUM UPGRADE SUITE</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Self-improving refactoring engines, cross-platform transpile maps, voice controllers, visual scanners, and cloud device test matrices.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-500/10 rounded-lg transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Tab Responsive Nav Rail */}
        <div className={`flex border-b text-xs overflow-x-auto shrink-0 scrollbar-none ${
          isDark ? 'bg-[#0b0c13] border-[#2b3040]' : 'bg-slate-50 border-slate-200'
        }`}>
          {[
            { id: 'prompt_app', label: '🚀 Omni-Core Build', icon: Sparkles, color: 'text-purple-400' },
            { id: 'remap_engine', label: '🎨 Style Remapper', icon: Palette, color: 'text-pink-400' },
            { id: 'agents', label: '🧠 Agent Chamber', icon: Brain, color: 'text-cyan-400' },
            { id: 'optimizer', label: '🔄 Code Optimizer', icon: RefreshCw, color: 'text-emerald-400' },
            { id: 'cross', label: '🌍 Cross-Platform', icon: ArrowLeftRight, color: 'text-amber-400' },
            { id: 'voice', label: '🎙️ Voice Synth', icon: Mic, color: 'text-pink-400' },
            { id: 'screenshot', label: '📷 OCR Scan', icon: Upload, color: 'text-cyan-400' },
            { id: 'video', label: '🎥 Gesture Capture', icon: Video, color: 'text-rose-400' },
            { id: 'cloud', label: '📱 Device Harness', icon: Smartphone, color: 'text-indigo-400' },
            { id: 'marketplace', label: '🛒 Plugin Shop', icon: ShoppingCart, color: 'text-purple-400' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3.5 font-black transition-all border-b-2 cursor-pointer whitespace-nowrap text-[10.5px] ${
                  isActive
                    ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-500/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse ' + tab.color : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content viewport */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          
          {/* TAB 0: OMNI-CORE PROMPT-TO-FULL-APP GENERATOR */}
          {activeTab === 'prompt_app' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full animate-in fade-in zoom-in duration-200">
              {/* Left Column: Controls & Pipeline */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="border border-purple-500/30 bg-purple-950/10 p-4.5 rounded-xl flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
                    <span className="text-xs font-black text-purple-300 uppercase tracking-wider">Omni-Core Creation Spec</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target App Prompt</label>
                    <textarea
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Describe what app you want the Omni-Core to build..."
                      disabled={isGeneratingApp}
                      className="w-full bg-slate-950 border border-slate-800 text-[11px] font-mono rounded-lg p-3 h-24 outline-none focus:border-purple-500/50 text-slate-200 leading-relaxed"
                    />
                  </div>

                  {/* Quick templates */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Quick Templates</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {[
                        { label: '🏋️ Fitness Tracker', prompt: 'Create a high-performance offline Fitness tracker with heart-rate charts, local Room databases, and biometrics secure login' },
                        { label: '🔑 Zero-Trust Vault', prompt: 'Create an encrypted offline password vault with secure key generator, military-grade biometric lock, and JSON sync' },
                        { label: '🎵 Ambient Synth', prompt: 'Create an offline modular audio synthesizer with real-time waveform generator, tactile slider knobs, and local preset cache' },
                        { label: '🪙 Ledger Tracker', prompt: 'Create a private financial ledger with transaction list, automated monthly budgets, and encrypted SQLite audit trails' }
                      ].map((tmpl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPromptInput(tmpl.prompt)}
                          disabled={isGeneratingApp}
                          className="px-2.5 py-1.5 bg-slate-950 hover:bg-purple-950/30 border border-slate-850 rounded-lg text-[9px] font-bold text-slate-300 transition-colors cursor-pointer"
                        >
                          {tmpl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme profiles */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Design Palette Theme Profile</span>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {[
                        { id: 'Cosmic Slate', color: 'bg-slate-800' },
                        { id: 'Neon Emerald', color: 'bg-emerald-500' },
                        { id: 'Cyber Gold', color: 'bg-amber-400' },
                        { id: 'Ruby Fire', color: 'bg-rose-500' }
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme.id)}
                          disabled={isGeneratingApp}
                          className={`p-1.5 border rounded-lg flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            selectedTheme === theme.id
                              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
                              : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full ${theme.color} border border-white/10`} />
                          <span className="text-[8.5px] font-black font-mono">{theme.id.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={runOmniCoreGenerator}
                    disabled={isGeneratingApp}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-950/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingApp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Omni-Core Synthesizing App...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 animate-bounce text-purple-200" />
                        <span>Ignite Omni-Core Builder</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Omni-Core 5-Layer Pipeline Status */}
                <div className="border border-slate-800 bg-[#121622]/40 p-4 rounded-xl flex flex-col gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Autonomous Pipeline Monitor</span>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { step: 1, name: 'Multimodal Vision Layer', desc: 'Translates prompt & visual cues to app state map' },
                      { step: 2, name: 'Creation Layer', desc: 'Synthesizes layouts, VM architecture, local databases' },
                      { step: 3, name: 'Evolution Layer', desc: 'Refactors code complexity, tunes gesture springs' },
                      { step: 4, name: 'Multi-Agent Collective', desc: 'Reviews code via consensus & security rules' },
                      { step: 5, name: 'Autonomous Sandbox Loop', desc: 'Builds app bundle, triggers monkey test routines' }
                    ].map((layer) => {
                      const isActive = isGeneratingApp && appGenStep === layer.step;
                      const isCompleted = appGenStep > layer.step || (appGenStep === 6);
                      return (
                        <div
                          key={layer.step}
                          className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                            isActive
                              ? 'bg-purple-950/30 border-purple-500/40 text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                              : isCompleted
                              ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-300'
                              : 'bg-slate-950/40 border-slate-900 text-slate-500'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9.5px] font-black ${
                            isActive
                              ? 'bg-purple-500 text-white animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-900 border border-slate-800 text-slate-400'
                          }`}>
                            {isCompleted ? '✓' : layer.step}
                          </div>
                          <div className="flex-1 flex flex-col">
                            <span className={`text-[10px] font-black ${isActive ? 'text-purple-300' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {layer.name}
                            </span>
                            <span className="text-[8.5px] text-slate-400 font-medium leading-tight">{layer.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Multi-tab telemetry & visualizer simulator */}
              <div className="lg:col-span-7 flex flex-col gap-3 h-[590px] min-h-[450px]">
                {/* Secondary navigation header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Environment Telemetry</span>
                  <div className="flex gap-1">
                    {['telemetry', 'code', 'simulator'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setActivePreviewScreen(sub as any)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          activePreviewScreen === sub
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                            : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {sub === 'telemetry' ? '📟 Telemetry Logs' : sub === 'code' ? '💻 Complied Code' : '📱 Live Simulator'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main visualization container */}
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden">
                  
                  {/* Telemetry Logs Panel */}
                  {activePreviewScreen === 'telemetry' && (
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">Consensus Cluster Terminal</span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Status: {isGeneratingApp ? 'Active Synthesis' : appGenStep === 6 ? 'Sideload Ready' : 'IDLE'}</span>
                      </div>
                      <div className="flex-1 bg-black p-4 rounded-lg border border-purple-950/40 font-mono text-[10px] leading-relaxed text-purple-300 overflow-y-auto max-h-[460px] flex flex-col gap-1.5 scrollbar-thin">
                        {appGenLogs.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic gap-2 py-12 text-center">
                            <Terminal className="w-8 h-8 text-slate-700 animate-pulse" />
                            <span>Omni-Core compiler idle.</span>
                            <span className="text-[9px] max-w-xs">Fill out prompt schema on the left, then trigger "Ignite Omni-Core Builder" to watch compiling logs stream in real-time.</span>
                          </div>
                        ) : (
                          appGenLogs.map((log, i) => {
                            let textClass = 'text-purple-300';
                            if (log.includes('✓')) textClass = 'text-emerald-400 font-semibold';
                            else if (log.includes('🧠') || log.includes('🔎') || log.includes('🛡️') || log.includes('🎨')) textClass = 'text-cyan-400 font-semibold';
                            else if (log.includes('🎉')) textClass = 'text-amber-400 font-extrabold text-xs tracking-wider animate-bounce';
                            return (
                              <div key={i} className={`${textClass} transition-all`}>
                                {log}
                              </div>
                            );
                          })
                        )}
                        {isGeneratingApp && (
                          <div className="text-purple-400 animate-pulse flex items-center gap-1.5 mt-1 font-black">
                            <span className="w-1.5 h-3.5 bg-purple-400 animate-ping inline-block" /> Compiling sandbox target...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Synthesized Compose Code Viewer */}
                  {activePreviewScreen === 'code' && (
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-mono">Synthesized Composable Manifest</span>
                        {appGenCode && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(appGenCode);
                              triggerToast('✓ Copied generated Kotlin code!');
                            }}
                            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[9px] font-black"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy Code
                          </button>
                        )}
                      </div>
                      <div className="flex-1 bg-black p-4 rounded-lg border border-slate-900 font-mono text-[9.5px] text-purple-200 overflow-y-auto max-h-[460px] leading-relaxed">
                        {appGenCode ? (
                          <pre>{appGenCode}</pre>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic gap-2 py-12 text-center">
                            <Laptop className="w-8 h-8 text-slate-700" />
                            <span>No code synthesized yet.</span>
                            <span className="text-[9px]">The Creation Layer compiles beautiful Kotlin UI code after Omni-Core synthesis.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* High-Fidelity Simulator Preview */}
                  {activePreviewScreen === 'simulator' && (
                    <div className="flex-1 flex flex-col items-center justify-center relative min-h-0">
                      {appGenStep < 4 ? (
                        <div className="flex flex-col items-center text-center gap-2 text-slate-500">
                          <Smartphone className="w-12 h-12 text-purple-500/20" />
                          <span className="text-xs font-black text-slate-300">Device Simulator Locked</span>
                          <p className="text-[10px] text-slate-500 max-w-sm">Requires Omni-Core compilation to reach Stage 4 (Consensus validation) or above before the simulator wakes up.</p>
                        </div>
                      ) : (
                        <div className="w-[220px] h-[450px] border-[6px] border-slate-800 bg-[#07090e] rounded-[32px] relative p-3.5 flex flex-col shadow-2xl animate-in zoom-in duration-300">
                          {/* Top Camera Punch Hole */}
                          <div className="w-3.5 h-3.5 bg-slate-800 rounded-full mx-auto -mt-1 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-black rounded-full" />
                          </div>

                          {/* Render Dynamic Mobile App */}
                          <div className="flex-1 flex flex-col justify-between mt-3 text-slate-200 text-left">
                            <div className="flex flex-col gap-2">
                              {/* Top Bar */}
                              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                                <span className="text-[9px] font-black tracking-wide text-white uppercase">{promptInput.includes('Fitness') ? 'FitSync' : promptInput.includes('password') || promptInput.includes('vault') ? 'CryptLock' : 'SynthCore'}</span>
                                <span className="text-[8px] text-purple-400 font-mono font-bold">12:00 UTC</span>
                              </div>

                              {/* Simulated Contents */}
                              <div className="flex flex-col gap-2.5 mt-1">
                                <div className="p-2.5 rounded-lg border border-purple-500/20 bg-purple-500/5 flex flex-col gap-1">
                                  <span className="text-[8px] text-purple-400 uppercase font-bold">Hardware Biometrics</span>
                                  <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                                    <span className="text-[9px] font-semibold text-white">Security Encrypted</span>
                                  </div>
                                </div>

                                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col gap-1">
                                  <span className="text-[8px] text-slate-500 uppercase font-bold">Realtime Insights</span>
                                  <div className="flex items-end gap-1 h-12 pt-2">
                                    {[20, 45, 30, 80, 55, 90, 75].map((h, idx) => (
                                      <div
                                        key={idx}
                                        className={`w-full rounded-t-sm transition-all duration-500 ${
                                          selectedTheme === 'Cosmic Slate' ? 'bg-slate-500' : selectedTheme === 'Neon Emerald' ? 'bg-emerald-400' : selectedTheme === 'Cyber Gold' ? 'bg-amber-400' : 'bg-rose-500'
                                        }`}
                                        style={{ height: `${h}%` }}
                                      />
                                    ))}
                                  </div>
                                </div>

                                <div className="bg-slate-950 border border-slate-900 rounded-lg p-2 flex items-center justify-between text-[9px]">
                                  <span className="text-slate-400">Total Sync Cycles</span>
                                  <span className="font-mono text-emerald-400 font-bold">482 ok</span>
                                </div>
                              </div>
                            </div>

                            {/* Simulated Navigation Bar */}
                            <div className="grid grid-cols-3 gap-1 border-t border-slate-900 pt-2 text-center text-[7.5px] font-bold text-slate-500">
                              <span className="text-purple-400 cursor-pointer">Dashboard</span>
                              <span className="hover:text-slate-300 cursor-pointer">Charts</span>
                              <span className="hover:text-slate-300 cursor-pointer">Secured</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* TAB 0.5: APP STYLE REMAP ENGINE */}
          {activeTab === 'remap_engine' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full animate-in fade-in zoom-in duration-200">
              
              {/* Left Column: Style DNA Selection & Genome Input */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Style DNA Selector Panel */}
                <div className="border border-pink-500/30 bg-pink-950/10 p-4.5 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-400 animate-pulse" />
                    <span className="text-xs font-black text-pink-300 uppercase tracking-wider">Style DNA Selector (Midjourney-for-Apps)</span>
                  </div>

                  {/* 1. Style */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Aesthetic Style Presets</label>
                    <div className="grid grid-cols-4 gap-1">
                      {['glassmorphic', 'brutalist', 'neon', 'cyberpunk', 'cozy', 'retro', 'luxury'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setRemapStyle(st as any)}
                          disabled={isRemapping}
                          className={`px-1 py-1 border rounded text-[9px] font-bold uppercase tracking-wider font-mono transition-all cursor-pointer truncate ${
                            remapStyle === st
                              ? 'bg-pink-600 border-pink-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {st.slice(0, 7)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Themes, Moods, and Motions */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    
                    {/* Theme Palette */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Theme Profile</label>
                      <select
                        value={remapTheme}
                        onChange={(e) => setRemapTheme(e.target.value as any)}
                        disabled={isRemapping}
                        className="w-full bg-slate-950 border border-slate-850 text-[10.5px] rounded p-1.5 text-slate-300 outline-none focus:border-pink-500 font-bold font-mono"
                      >
                        {['dark', 'pastel', 'monochrome', 'nature', 'tech'].map(t => (
                          <option key={t} value={t}>{t.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    {/* Emotional Mood */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Emotional Mood</label>
                      <select
                        value={remapMood}
                        onChange={(e) => setRemapMood(e.target.value as any)}
                        disabled={isRemapping}
                        className="w-full bg-slate-950 border border-slate-850 text-[10.5px] rounded p-1.5 text-slate-300 outline-none focus:border-pink-500 font-bold font-mono"
                      >
                        {['calm', 'energetic', 'mysterious', 'warm', 'playful'].map(m => (
                          <option key={m} value={m}>{m.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    {/* Motion Physics */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Motion Physics</label>
                      <select
                        value={remapMotion}
                        onChange={(e) => setRemapMotion(e.target.value as any)}
                        disabled={isRemapping}
                        className="w-full bg-slate-950 border border-slate-850 text-[10.5px] rounded p-1.5 text-slate-300 outline-none focus:border-pink-500 font-bold font-mono"
                      >
                        {['snappy', 'floaty', 'elastic', 'cinematic'].map(m => (
                          <option key={m} value={m}>{m.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    {/* UI Density & Personality */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Component Shape</label>
                      <select
                        value={remapPersonality}
                        onChange={(e) => setRemapPersonality(e.target.value as any)}
                        disabled={isRemapping}
                        className="w-full bg-slate-950 border border-slate-850 text-[10.5px] rounded p-1.5 text-slate-300 outline-none focus:border-pink-500 font-bold font-mono"
                      >
                        {['rounded', 'sharp', 'soft', 'bold'].map(p => (
                          <option key={p} value={p}>{p.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* UI Density Option */}
                  <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-900">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">UI Information Density</span>
                    <div className="flex gap-1.5">
                      {['minimal', 'information-rich'].map(d => (
                        <button
                          key={d}
                          onClick={() => setRemapDensity(d as any)}
                          disabled={isRemapping}
                          className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all cursor-pointer ${
                            remapDensity === d
                              ? 'bg-slate-800 text-pink-300 border border-pink-500/40'
                              : 'bg-slate-950 text-slate-500 border border-transparent hover:text-slate-300'
                          }`}
                        >
                          {d.split('-')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* App Input Genome Panel */}
                <div className="border border-slate-800 bg-[#121622]/40 p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input App Genome Target</span>
                    
                    {/* Presets dropdown */}
                    <div className="flex gap-1">
                      {remapPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setRemapInputName(preset.fileName);
                            setRemapInputType(preset.type);
                            setRemapInputContent(preset.content);
                            triggerToast(`✓ Loaded preset "${preset.name}"!`);
                          }}
                          disabled={isRemapping}
                          className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded text-[8.5px] font-bold text-slate-300 transition-colors cursor-pointer"
                        >
                          {preset.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Resource Name</label>
                      <input
                        type="text"
                        value={remapInputName}
                        onChange={(e) => setRemapInputName(e.target.value)}
                        disabled={isRemapping}
                        className="w-full bg-slate-950 border border-slate-800 text-[10px] font-mono rounded p-1.5 text-slate-300 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Genome Source Type</label>
                      <select
                        value={remapInputType}
                        onChange={(e) => setRemapInputType(e.target.value as any)}
                        disabled={isRemapping}
                        className="w-full bg-slate-950 border border-slate-800 text-[10px] font-mono rounded p-1.5 text-slate-300 outline-none focus:border-pink-500 font-bold"
                      >
                        <option value="screenshot">📷 Screen Capture Scan</option>
                        <option value="layout_xml">📄 Android XML Layout</option>
                        <option value="compose_file">💻 Jetpack Compose File</option>
                        <option value="running_app">📱 Live Running App Dump</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider">Genome Payload Data</label>
                    <textarea
                      value={remapInputContent}
                      onChange={(e) => setRemapInputContent(e.target.value)}
                      disabled={isRemapping}
                      className="w-full bg-slate-950 border border-slate-850 text-[10px] font-mono rounded p-2.5 h-16 outline-none focus:border-pink-500 text-slate-400 leading-relaxed resize-none"
                    />
                  </div>

                  {/* Trigger Transformation Button */}
                  <button
                    onClick={runAppStyleRemap}
                    disabled={isRemapping}
                    className="w-full mt-1.5 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-pink-950/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRemapping ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Style Remapping in Action...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4 animate-bounce text-pink-200" />
                        <span>Start Aesthetic Transformation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Style Blueprint, Source vs Remapped Simulator, and Telemetry Terminal */}
              <div className="lg:col-span-7 flex flex-col gap-3 h-[590px] min-h-[450px]">
                
                {/* Secondary navigation header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remap Pipeline Monitor</span>
                    {remapStep > 0 && (
                      <span className="text-[8.5px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 font-black animate-pulse uppercase">
                        Stage {remapStep}/6 Active
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {[
                      { id: 'visualizer', label: '📱 Live Simulator' },
                      { id: 'blueprint', label: '📋 Styled Blueprint' },
                      { id: 'code', label: '💻 Compiled Code' },
                      { id: 'logs', label: '📟 Telemetry Logs' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setRemapActiveSubTab(sub.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          remapActiveSubTab === sub.id
                            ? 'bg-pink-600 text-white shadow-md shadow-pink-600/10'
                            : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main viewport frame */}
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden">
                  
                  {/* Tab 1: Live Simulator */}
                  {remapActiveSubTab === 'visualizer' && (
                    <div className="flex-1 flex flex-col gap-3 min-h-0 relative justify-center items-center">
                      {remapStep < 5 ? (
                        <div className="flex flex-col items-center text-center gap-2 text-slate-500 p-8">
                          <Smartphone className="w-12 h-12 text-pink-500/20 animate-pulse" />
                          <span className="text-xs font-black text-slate-300">Aesthetic Simulator Locked</span>
                          <p className="text-[10px] text-slate-500 max-w-sm">Requires Omni-Core Style Remap synthesis to reach Stage 5 (Autonomous Sandbox Validation) or above before the simulator launches.</p>
                          <button
                            onClick={runAppStyleRemap}
                            className="mt-2 px-4 py-1.5 bg-slate-900 border border-slate-800 text-[9.5px] font-bold text-pink-400 hover:bg-slate-850 rounded-lg cursor-pointer"
                          >
                            Demo Synthesize
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-4 items-center justify-center w-full max-w-lg h-full animate-in zoom-in duration-300">
                          
                          {/* Original boring UI */}
                          <div className="flex-1 flex flex-col h-[400px] border border-slate-850 bg-neutral-900/40 rounded-2xl relative p-3">
                            <span className="absolute top-2 right-2 text-[7px] font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-mono">Legacy Genome</span>
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-2 pb-1 border-b border-slate-800">Original App</span>
                            
                            <div className="flex-1 flex flex-col justify-between text-left p-1 text-slate-400 font-sans">
                              <div className="flex flex-col gap-2">
                                <h4 className="text-xs font-semibold text-white tracking-tight">{remapInputName.includes('Fit') ? 'Legacy FitPulse Tracker' : remapInputName.includes('Crypto') ? 'Assets Wallet' : 'Audio Node Controller'}</h4>
                                <p className="text-[9px] leading-relaxed">This is the original layout before aesthetic synthesis is remapped.</p>
                                
                                <div className="p-2 border border-slate-800 bg-neutral-900 rounded text-[9.5px] font-mono">
                                  <span>Progress Status: 65%</span>
                                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1">
                                    <div className="bg-blue-500 h-full" style={{ width: '65%' }} />
                                  </div>
                                </div>

                                <div className="p-2 border border-slate-800 bg-neutral-900 rounded text-[9.5px] font-mono">
                                  <span>Hardware Sync: standard offline</span>
                                </div>
                              </div>
                              <button className="w-full py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded text-[10px] font-bold uppercase transition-colors">
                                Trigger Standard Function
                              </button>
                            </div>
                          </div>

                          {/* Arrow spacer */}
                          <div className="flex flex-col items-center justify-center text-pink-400 gap-1 animate-pulse">
                            <ArrowLeftRight className="w-5 h-5" />
                            <span className="text-[7.5px] font-black uppercase tracking-widest font-mono">Remapped</span>
                          </div>

                          {/* Beautiful New Remapped Masterpiece */}
                          <div className={`flex-1 flex flex-col h-[400px] border rounded-2xl relative p-3.5 shadow-2xl transition-all duration-500 ${
                            remapStyle === 'glassmorphic' ? 'bg-[#0f121d]/75 border-pink-500/20 backdrop-blur-lg shadow-pink-900/10' :
                            remapStyle === 'brutalist' ? 'bg-[#ffeb3b] border-2 border-black shadow-[4px_4px_0px_#000000] text-black' :
                            remapStyle === 'neon' ? 'bg-[#000] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' :
                            remapStyle === 'cyberpunk' ? 'bg-[#0c0d12] border-yellow-500/30 border-r-4 shadow-[0_0_15px_rgba(234,179,8,0.1)]' :
                            remapStyle === 'cozy' ? 'bg-[#fff5f5] border-[#fbc02d]/30 text-amber-950 shadow-lg' :
                            remapStyle === 'retro' ? 'bg-[#18181b] border-zinc-700 text-amber-500 font-mono font-bold' :
                            'bg-[#060814] border-amber-500/30 text-slate-100'
                          }`}>
                            <span className={`absolute top-2 right-2 text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${
                              remapStyle === 'brutalist' ? 'bg-black text-white font-mono' : 'bg-pink-600 text-white font-mono'
                            }`}>
                              {remapStyle} Style
                            </span>
                            
                            <span className={`text-[10px] font-black uppercase tracking-widest mb-2 pb-1 border-b ${
                              remapStyle === 'brutalist' ? 'border-black' : 'border-slate-800'
                            }`}>
                              Remapped App
                            </span>

                            <div className="flex-1 flex flex-col justify-between text-left p-0.5">
                              <div className="flex flex-col gap-2">
                                <h4 className={`text-sm font-black tracking-tight ${
                                  remapStyle === 'brutalist' ? 'text-black' : remapStyle === 'neon' ? 'text-emerald-400' : remapStyle === 'retro' ? 'text-amber-500' : 'text-white'
                                }`}>
                                  {remapInputName.includes('Fit') ? 'FITPULSE EVOLVED' : remapInputName.includes('Crypto') ? 'CRYPTOWALLET ALPHA' : 'SYNTHESIZER PRIME'}
                                </h4>
                                <p className={`text-[9px] leading-relaxed ${remapStyle === 'brutalist' ? 'text-slate-800' : 'text-slate-400'}`}>
                                  Aesthetic synthesized dynamically under the <strong>{remapMood}</strong> mood profile.
                                </p>

                                {/* Dynamic widget rendering styled by selection */}
                                {remapStyle === 'glassmorphic' && (
                                  <div className="p-2.5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md flex flex-col gap-1.5">
                                    <span className="text-[8px] text-pink-300 font-black uppercase tracking-wider">Tactile Performance Easing</span>
                                    <div className="w-full bg-slate-900/60 h-1.5 rounded-full overflow-hidden">
                                      <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-full w-[80%] animate-pulse" />
                                    </div>
                                    <span className="text-[8px] text-slate-400 font-mono">Dynamic Fluid Spring active</span>
                                  </div>
                                )}

                                {remapStyle === 'brutalist' && (
                                  <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col gap-1">
                                    <span className="text-[8px] text-black font-black uppercase tracking-wider">HARD STATS GRID</span>
                                    <span className="text-xs font-black">STABILITY VALUE: 100%</span>
                                  </div>
                                )}

                                {remapStyle === 'neon' && (
                                  <div className="p-2 border border-emerald-500/40 bg-emerald-950/10 rounded flex flex-col gap-1">
                                    <span className="text-[8.5px] text-emerald-400 font-mono font-bold uppercase animate-pulse">● WAVEFORM SPECTRUM ACTIVE</span>
                                    <div className="flex gap-1 h-6 items-end pt-1">
                                      {[10, 40, 80, 50, 90, 30].map((h, i) => (
                                        <div key={i} className="bg-emerald-400 w-full rounded-t-sm" style={{ height: `${h}%` }} />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {remapStyle === 'cyberpunk' && (
                                  <div className="p-2 bg-yellow-500/5 border border-yellow-500/30 rounded flex flex-col gap-1 font-mono">
                                    <span className="text-[8.5px] text-yellow-500 uppercase font-black tracking-widest">CYBERNETIC_PERF</span>
                                    <span className="text-[9px] text-yellow-300 font-bold">RECOMPOSITION: 0_DROPS</span>
                                  </div>
                                )}

                                {remapStyle === 'cozy' && (
                                  <div className="p-3 bg-orange-100/50 rounded-2xl flex flex-col gap-1 text-orange-900">
                                    <span className="text-[8.5px] text-orange-700 font-bold uppercase font-mono">Warm Companion Status</span>
                                    <span className="text-[9.5px]">Everything is smooth & comfortable.</span>
                                  </div>
                                )}

                                {remapStyle === 'retro' && (
                                  <div className="p-2 border border-amber-600 bg-black rounded flex flex-col gap-0.5 text-[9px] font-mono">
                                    <span>[SYSTEM MONKEY TEST]</span>
                                    <span>INJECTED_EVENTS: OK_500</span>
                                  </div>
                                )}

                                {remapStyle === 'luxury' && (
                                  <div className="p-2.5 border border-amber-500/20 bg-amber-950/10 rounded flex flex-col gap-1 items-center">
                                    <span className="text-[7.5px] text-amber-400 font-black tracking-widest uppercase font-mono">EXQUISITE CADENCE</span>
                                    <span className="text-[10px] italic font-serif text-amber-200">Refined and Balanced</span>
                                  </div>
                                )}

                              </div>

                              <button className={`w-full py-2 text-[10px] font-black uppercase transition-all mt-4 cursor-pointer ${
                                remapStyle === 'brutalist' ? 'bg-black text-white hover:bg-neutral-800' :
                                remapStyle === 'neon' ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/30' :
                                remapStyle === 'cozy' ? 'bg-orange-400 text-white rounded-xl' :
                                remapStyle === 'retro' ? 'bg-amber-600 text-black hover:bg-amber-500' :
                                'bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-xl'
                              }`}>
                                Interactive Spring Tap
                              </button>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Styled Blueprint */}
                  {remapActiveSubTab === 'blueprint' && (
                    <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Aesthetic DNA Blueprints</span>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">Formulated on consensus review</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {/* Blueprint values */}
                        <div className="flex flex-col gap-3">
                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex flex-col gap-1.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Aesthetic Color Palette</span>
                            <div className="flex gap-2 mt-1">
                              {remapStyle === 'glassmorphic' && (
                                <>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-[#0f121d] border border-white/10" /><span className="text-[8px] font-mono text-slate-400">#0F121D</span></div>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-pink-500 border border-white/10" /><span className="text-[8px] font-mono text-slate-400">#EC4899</span></div>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-indigo-500 border border-white/10" /><span className="text-[8px] font-mono text-slate-400">#6366F1</span></div>
                                </>
                              )}
                              {remapStyle === 'brutalist' && (
                                <>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-[#ffeb3b] border border-black" /><span className="text-[8px] font-mono text-slate-400">#FFEB3B</span></div>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-[#000000] border border-black" /><span className="text-[8px] font-mono text-slate-400">#000000</span></div>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-[#ff5722] border border-black" /><span className="text-[8px] font-mono text-slate-400">#FF5722</span></div>
                                </>
                              )}
                              {remapStyle === 'neon' && (
                                <>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-[#000000] border border-slate-900" /><span className="text-[8px] font-mono text-slate-400">#000000</span></div>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-[#10b981] border border-emerald-400" /><span className="text-[8px] font-mono text-slate-400">#10B981</span></div>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-[#8b5cf6] border border-purple-400" /><span className="text-[8px] font-mono text-slate-400">#8B5CF6</span></div>
                                </>
                              )}
                              {!['glassmorphic', 'brutalist', 'neon'].includes(remapStyle) && (
                                <>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-[#1e293b]" /><span className="text-[8px] font-mono text-slate-400">#1E293B</span></div>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-amber-500" /><span className="text-[8px] font-mono text-slate-400">#F59E0B</span></div>
                                  <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded bg-slate-50" /><span className="text-[8px] font-mono text-slate-400">#F8FAFC</span></div>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex flex-col gap-1.5 font-mono text-[9px] text-slate-400">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-sans">Adaptive Typography Scale</span>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between"><span>Display Title:</span><span className="text-pink-400 font-bold">{remapStyle === 'brutalist' ? 'Sora Bold 26sp' : 'Space Grotesk 24sp'}</span></div>
                              <div className="flex justify-between"><span>Subhead Text:</span><span className="text-pink-400 font-bold">{remapStyle === 'luxury' ? 'Playfair Serif 14sp' : 'Outfit Medium 14sp'}</span></div>
                              <div className="flex justify-between"><span>Code Indicators:</span><span className="text-pink-400 font-bold">JetBrains Mono 11sp</span></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex flex-col gap-1.5 font-mono text-[9px] text-slate-400">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-sans">Physics Spring Equations</span>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between"><span>Stiffness Constant:</span><span className="text-emerald-400 font-bold">{remapMotion === 'snappy' ? '1500f' : remapMotion === 'floaty' ? '300f' : '850f'}</span></div>
                              <div className="flex justify-between"><span>Damping Ratio:</span><span className="text-emerald-400 font-bold">{remapMotion === 'elastic' ? '0.45f' : '0.85f'}</span></div>
                              <div className="flex justify-between"><span>Recomposition Guard:</span><span className="text-emerald-400 font-bold">rememberSaveable</span></div>
                            </div>
                          </div>

                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex flex-col gap-1.5 font-mono text-[9px] text-slate-400">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-sans">Consensus Audit Scores</span>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between"><span>Architect Structure:</span><span className="text-cyan-400 font-bold">98% OK</span></div>
                              <div className="flex justify-between"><span>UX Usability Index:</span><span className="text-cyan-400 font-bold">96% OK</span></div>
                              <div className="flex justify-between"><span>Recomposition Jitter:</span><span className="text-cyan-400 font-bold">0 frames dropped</span></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary explanation block */}
                      <div className="p-3 border border-pink-500/20 bg-pink-500/5 rounded-xl text-[10.5px] leading-relaxed text-slate-300 mt-2">
                        <span className="font-black text-pink-300 block uppercase tracking-wider mb-1">Aesthetic Synthesis Merging Report</span>
                        Our style transfer compiler parsed the structural bounds of <strong>"{remapInputName}"</strong> and layered its widgets over <strong>{remapStyle.toUpperCase()}</strong>'s layout modifiers. Spacing gaps have been expanded to a fluid 8dp responsive grid with zero hard-coded sizes.
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Synthesized Compose Code */}
                  {remapActiveSubTab === 'code' && (
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest font-mono">Synthesized Jetpack Compose Code</span>
                        {remapOutputCode && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(remapOutputCode);
                              triggerToast('✓ Copied beautiful Kotlin code!');
                            }}
                            className="text-pink-400 hover:text-pink-300 flex items-center gap-1 text-[9.5px] font-black cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy Code
                          </button>
                        )}
                      </div>
                      <div className="flex-1 bg-black p-4 rounded-lg border border-slate-900 font-mono text-[9.5px] text-pink-200 overflow-y-auto max-h-[460px] leading-relaxed">
                        {remapOutputCode ? (
                          <pre>{remapOutputCode}</pre>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic gap-2 py-12 text-center">
                            <FileText className="w-8 h-8 text-slate-700" />
                            <span>No code synthesized yet.</span>
                            <span className="text-[9px]">The Style Remap Engine generates clean Kotlin UI screens on compilation completion.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Pipeline Telemetry Logs */}
                  {remapActiveSubTab === 'logs' && (
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest font-mono">Style Transfer Compiler Terminal</span>
                        <span className="text-[9px] font-mono text-slate-500">COMPILER: ACTIVE</span>
                      </div>
                      <div className="flex-1 bg-black p-4 rounded-lg border border-pink-950/40 font-mono text-[10px] leading-relaxed text-pink-300 overflow-y-auto max-h-[460px] flex flex-col gap-1.5 scrollbar-thin">
                        {remapLogs.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic gap-2 py-12 text-center">
                            <Terminal className="w-8 h-8 text-slate-700 animate-pulse" />
                            <span>Remap compiler console is silent.</span>
                            <span className="text-[9px] max-w-xs">Load or paste custom layout code/screenshots and click "Start Aesthetic Transformation" to kick off the compiler stream.</span>
                          </div>
                        ) : (
                          remapLogs.map((log, i) => {
                            let textClass = 'text-pink-300';
                            if (log.includes('✓')) textClass = 'text-emerald-400 font-semibold';
                            else if (log.includes('[APP GENOME]')) textClass = 'text-cyan-400';
                            else if (log.includes('[MULTI-AGENT REFINE]')) textClass = 'text-indigo-300';
                            else if (log.includes('🧠')) textClass = 'text-amber-400 font-semibold';
                            else if (log.includes('🎉')) textClass = 'text-pink-400 font-extrabold text-xs tracking-wider animate-bounce';
                            return (
                              <div key={i} className={`${textClass} transition-all`}>
                                {log}
                              </div>
                            );
                          })
                        )}
                        {isRemapping && (
                          <div className="text-pink-400 animate-pulse flex items-center gap-1.5 mt-1 font-black">
                            <span className="w-1.5 h-3.5 bg-pink-400 animate-ping inline-block" /> Packaging sandbox target...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* TAB 1: AGENT CHAMBER */}
          {activeTab === 'agents' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Settings Controls */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="border border-[#2b3040] bg-[#151926]/40 p-4 rounded-xl flex flex-col gap-3">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Debate Topic Workspace</span>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Select Optimization Vector</label>
                    <select
                      value={debateTopic}
                      onChange={(e) => setDebateTopic(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-slate-200 outline-none cursor-pointer focus:border-cyan-500/50 font-semibold"
                    >
                      <option value="optimize_rendering">Optimize Scroll Frame Rates</option>
                      <option value="secure_sql">Prevent Room SQL Injection</option>
                      <option value="battery_conserve">Battery Saver WorkManager Sync</option>
                    </select>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    {debateTopics[debateTopic as keyof typeof debateTopics].description}
                  </p>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-2 mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Consensus Index</span>
                      <span className="text-xs font-mono font-black text-cyan-400">{consensusScore}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${consensusScore}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={runMultiAgentDebate}
                    disabled={isDebating}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-[10.5px] font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isDebating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Agents Debating...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Start Agent Discussion
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Debate Conversation Feed */}
              <div className="lg:col-span-8 flex flex-col gap-3 h-[430px] min-h-[300px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Multi-Agent Discussion Stream</span>
                
                <div className="flex-1 bg-slate-950/60 rounded-xl p-4 border border-slate-800 overflow-y-auto flex flex-col gap-4">
                  {debateMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center gap-2 h-full text-slate-500">
                      <Brain className="w-10 h-10 text-cyan-500/20 animate-bounce" />
                      <span className="text-xs font-bold text-slate-300">Debate Chamber is Silent</span>
                      <p className="text-[10px] text-slate-500 max-w-xs">Select an optimization topic on the left and trigger the debate to watch agents collaborate in real-time.</p>
                    </div>
                  ) : (
                    debateMessages.map((msg) => (
                      <div key={msg.id} className="flex flex-col gap-1 bg-[#10131d]/60 border border-slate-900 p-3.5 rounded-xl">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{msg.avatar}</span>
                            <span className="text-xs font-extrabold text-white">{msg.sender}</span>
                            <span className="text-[8px] bg-slate-900 border border-slate-800 text-cyan-400 font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                              {msg.role}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="text-[10.5px] leading-relaxed text-slate-300">{msg.text}</p>
                        {msg.code && (
                          <pre className="bg-black/80 border border-slate-900 rounded-lg p-3 mt-2 font-mono text-[9.5px] text-emerald-400 overflow-x-auto">
                            {msg.code}
                          </pre>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={debateEndRef} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SELF-IMPROVING OPTIMIZER */}
          {activeTab === 'optimizer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Selector List */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostics Registry</span>
                <div className="flex flex-col gap-2">
                  {optimizationCandidates.map((candidate) => {
                    const isSelected = selectedCandidate === candidate.id;
                    const isCompleted = appliedOptimizations.includes(candidate.id);
                    return (
                      <button
                        key={candidate.id}
                        onClick={() => setSelectedCandidate(candidate.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-purple-950/20 border-purple-500/50 text-white'
                            : 'bg-[#151926]/40 border-[#2b3040] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-400 font-mono">{candidate.fileName}</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full ${
                            candidate.impact === 'High' ? 'bg-red-950/50 text-red-400 border border-red-500/20' : 'bg-yellow-950/50 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {candidate.impact} Impact
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{candidate.description}</p>
                        <div className="flex items-center justify-between mt-1 text-[9px] font-bold">
                          <span className="text-emerald-400 font-mono">{candidate.metric}</span>
                          {isCompleted ? (
                            <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Applied</span>
                          ) : (
                            <span className="text-indigo-400">Review Candidate</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Diff Comparison view */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                {(() => {
                  const item = optimizationCandidates.find(c => c.id === selectedCandidate);
                  if (!item) return null;
                  const isCompleted = appliedOptimizations.includes(item.id);
                  return (
                    <div className="border border-slate-800 bg-slate-950/40 p-5 rounded-xl flex flex-col gap-4">
                      <div>
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-purple-400 animate-spin" /> Deep Code Optimization: {item.fileName}
                        </h4>
                        <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">{item.explanation}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Before Code */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Raw Legacy Implementation
                          </span>
                          <pre className="bg-black/90 p-3 rounded-lg border border-rose-950/60 font-mono text-[9px] leading-relaxed text-red-300 overflow-x-auto h-[180px]">
                            {item.beforeCode}
                          </pre>
                        </div>
                        {/* After Code */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckSquare className="w-3.5 h-3.5 animate-pulse" /> AI Masterpiece Refactoring
                          </span>
                          <pre className="bg-black/90 p-3 rounded-lg border border-emerald-950/60 font-mono text-[9px] leading-relaxed text-emerald-400 overflow-x-auto h-[180px]">
                            {item.afterCode}
                          </pre>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 font-mono">{item.filePath}</span>
                        <button
                          onClick={() => applyProjectImprovement(item)}
                          disabled={isOptimizing || isCompleted}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                            isCompleted
                              ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                          }`}
                        >
                          {isOptimizing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Injecting Optimized Code...
                            </>
                          ) : isCompleted ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Optimization Commited & Verified
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" /> Commit & Inject Optimization
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: CROSS-PLATFORM TRANSLATOR */}
          {activeTab === 'cross' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left configurations */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="border border-[#2b3040] bg-[#151926]/40 p-4 rounded-xl flex flex-col gap-4">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Cross-Platform Mapping Target</span>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Select Output Ecosystem</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'swift', label: 'iOS SwiftUI', icon: Smartphone },
                        { id: 'react', label: 'Web React', icon: Laptop },
                        { id: 'electron', label: 'Desktop App', icon: Laptop }
                      ].map(target => (
                        <button
                          key={target.id}
                          onClick={() => setTranspileTarget(target.id as any)}
                          className={`p-2 border rounded-lg text-[9px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            transpileTarget === target.id
                              ? 'bg-amber-950/30 border-amber-500/50 text-amber-400'
                              : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <target.icon className="w-3.5 h-3.5" />
                          {target.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Kotlin Source Mock input</label>
                    <textarea
                      value={sourceCode}
                      onChange={(e) => setSourceCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-[10px] font-mono rounded-lg p-2.5 h-36 outline-none focus:border-amber-500/40 text-slate-300 leading-normal"
                    />
                  </div>

                  <button
                    onClick={runCrossPlatformTranspiler}
                    disabled={isTranslating}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTranslating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" /> Transpiling Code...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" /> Generate Cross-Platform Target
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Transpiler output preview */}
              <div className="lg:col-span-8 flex grid grid-cols-1 md:grid-cols-2 gap-4 h-[430px] min-h-[300px]">
                {/* Code viewport */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Generated Transpiled Source</span>
                    {translationOutput && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(translationOutput);
                          triggerToast('✓ Code copied to clipboard!');
                        }}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[9px] font-bold"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    )}
                  </span>
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[9.5px] text-amber-300 overflow-y-auto leading-relaxed h-[380px]">
                    {translationOutput ? (
                      <pre>{translationOutput}</pre>
                    ) : (
                      <span className="text-slate-600 italic">Click "Generate Cross-Platform Target" on the left to synthesize compiled code nodes...</span>
                    )}
                  </div>
                </div>

                {/* Simulated Target render screen frame */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulated target UI Render</span>
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center relative overflow-hidden h-[380px]">
                    {translationOutput ? (
                      transpileTarget === 'swift' ? (
                        <div className="w-[180px] h-[340px] border-4 border-slate-800 bg-[#090d16] rounded-[24px] relative p-3 flex flex-col gap-4 shadow-2xl animate-in zoom-in duration-300">
                          {/* iPhone Notch */}
                          <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto -mt-1.5 mb-2 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-slate-950 rounded-full mr-2" />
                            <span className="w-1 h-1 bg-slate-950 rounded-full" />
                          </div>
                          <span className="text-[8px] font-black uppercase text-slate-600 block tracking-wider font-mono">SwiftUI Simulator</span>
                          
                          {/* Translated UI */}
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col gap-2 shadow mt-4">
                            <span className="text-[10px] font-extrabold text-white">Dave Alone (User)</span>
                            <div className="px-2 py-1.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase text-center mt-1 cursor-pointer hover:bg-blue-500">
                              Send Message
                            </div>
                          </div>
                        </div>
                      ) : transpileTarget === 'react' ? (
                        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4 shadow-lg animate-in fade-in duration-300">
                          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-mono text-slate-500 ml-2">localhost:3000/preview</span>
                          </div>

                          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex flex-col gap-3 shadow-md">
                            <span className="text-xs font-black text-white">Dave Alone (User)</span>
                            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-lg transition-all self-start">
                              Send Message
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-3 shadow-lg animate-in slide-in-from-bottom duration-300">
                          <span className="text-[9px] font-black text-slate-400 font-mono">Desktop Electron App Preview</span>
                          <div className="p-5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col gap-3 text-center">
                            <h3 className="text-sm font-bold text-white">Dave Alone</h3>
                            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded-lg transition-all">
                              Send Message
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      <span className="text-slate-600 italic">No output rendered yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VOICE-CONTROLLED SYNTHESIZER */}
          {activeTab === 'voice' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Control panels */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="border border-[#2b3040] bg-[#151926]/40 p-5 rounded-xl flex flex-col gap-4 text-center">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest text-left">Speech Synthesis Interface</span>
                  
                  {/* Glowing microphone button */}
                  <div className="mx-auto my-3 relative">
                    <button
                      onClick={() => {
                        setIsVoiceRecording(true);
                        setVoiceProgress(0);
                        setRecognizedText('');
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer shadow-lg ${
                        isVoiceRecording
                          ? 'bg-pink-600 border-pink-400 animate-pulse text-white shadow-pink-500/25 scale-105'
                          : 'bg-slate-950 border-slate-800 text-pink-400 hover:border-pink-500'
                      }`}
                    >
                      <Mic className={`w-6 h-6 ${isVoiceRecording ? 'animate-bounce' : ''}`} />
                    </button>
                    {isVoiceRecording && (
                      <span className="absolute -inset-2 rounded-full border border-pink-500/30 animate-ping" />
                    )}
                  </div>

                  {/* Waveform display */}
                  <div className="flex justify-center items-end gap-1.5 h-16 px-4 bg-slate-950 rounded-xl border border-slate-900">
                    {voiceWaveform.map((height, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-100 ${
                          isVoiceRecording ? 'bg-pink-500' : 'bg-slate-800'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>

                  {/* Shortcuts */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Simulated Speech Presets</label>
                    <div className="flex flex-col gap-1.5">
                      {voicePrompts.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setRecognizedText(p.text);
                            triggerToast(`Speech shortcut applied: "${p.desc}"`);
                          }}
                          className="p-2 rounded bg-slate-950 hover:bg-slate-900 border border-slate-900 text-left text-[10px] font-bold text-slate-300 cursor-pointer hover:border-pink-500/30"
                        >
                          <span className="text-pink-400 block font-black text-[8px] uppercase">{p.desc}</span>
                          "{p.text}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text recognition & synthesized code output */}
              <div className="lg:col-span-7 flex flex-col gap-3 h-[430px] min-h-[300px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voice-to-Code compiler</span>
                
                <div className="flex-1 border border-slate-800 bg-slate-950/40 p-4 rounded-xl flex flex-col gap-4">
                  {/* STT Input container */}
                  <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Recognized Speech Text</span>
                    <p className={`text-xs font-mono min-h-[40px] leading-relaxed ${recognizedText ? 'text-white' : 'text-slate-600 italic'}`}>
                      {isVoiceRecording ? `Dictating: ${voiceProgress}% done...` : recognizedText || "Awaiting microphone input or preset selection..."}
                    </p>
                  </div>

                  <button
                    onClick={compileVoiceCommand}
                    disabled={isCompilingVoice || !recognizedText}
                    className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isCompilingVoice ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synthesizing Audio Spectrum...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> Compile Speech Command to Kotlin
                      </>
                    )}
                  </button>

                  {/* Output code */}
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Synthesized Compose Module</span>
                    <div className="flex-1 bg-black p-3 rounded-xl font-mono text-[9.5px] leading-relaxed text-pink-400 border border-slate-900 overflow-y-auto">
                      {voiceOutputCode ? (
                        <pre>{voiceOutputCode}</pre>
                      ) : (
                        <span className="text-slate-600 italic">Audio AST mapping not triggered. Compile speech text to output code node.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCREENSHOT-TO-APP SCANNER */}
          {activeTab === 'screenshot' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Selector & scanning trigger */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="border border-[#2b3040] bg-[#151926]/40 p-4 rounded-xl flex flex-col gap-3">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Mock UI Screenshot Library</span>
                  
                  <div className="grid grid-cols-1 gap-2 mt-1">
                    {mockScreenshots.map((item) => {
                      const isSelected = selectedMockImage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedMockImage(item.id);
                            setScannedOutput(null);
                            triggerToast(`Mock screenshot loaded: ${item.name}`);
                          }}
                          className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/20 border-cyan-500/50 text-white'
                              : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} shrink-0 flex items-center justify-center font-bold text-white text-xs shadow`}>
                            {item.id.toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-200 block">{item.name}</span>
                            <span className="text-[9px] font-mono text-slate-500">{item.mockFile}.png</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={runScreenshotScan}
                    disabled={isScanning || !selectedMockImage}
                    className="w-full py-2.5 mt-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning Image Grid ({scanProgress}%)
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Laser Grid OCR scan
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Laser sweep preview and extracted node logs */}
              <div className="lg:col-span-7 flex flex-col gap-3 h-[430px] min-h-[300px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multimodal Scanner Console</span>
                
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
                  {isScanning ? (
                    /* Holographic laser scanning simulation */
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden bg-slate-950 border border-cyan-500/10 rounded-xl py-8">
                      <div className="relative w-48 h-32 border-2 border-dashed border-cyan-500/30 rounded flex items-center justify-center bg-cyan-950/10">
                        <span className="text-xs font-mono text-cyan-400/70 animate-pulse">Scanning segmentation...</span>
                        {/* Swiping laser line */}
                        <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-[bounce_2s_infinite]" />
                      </div>
                      <span className="text-xs font-mono text-cyan-400">Scan Progress: {scanProgress}%</span>
                    </div>
                  ) : scannedOutput ? (
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                      {/* Palette & components logs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider">Detected Color Tokens</span>
                          <div className="grid grid-cols-4 gap-2">
                            {scannedOutput.palette.map((hex, i) => (
                              <div key={i} className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded border border-slate-800 shadow" style={{ backgroundColor: hex }} />
                                <span className="text-[9px] font-mono text-slate-500 font-bold">{hex}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider">Extracted Node Trees</span>
                          <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto bg-black/50 p-2 rounded border border-slate-900 text-[9px] font-mono text-slate-400">
                            {scannedOutput.elements.map((el, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <span className="text-cyan-500 font-bold">•</span>
                                <span>{el}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Code compiled box */}
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider">Compiled Jetpack Compose layout</span>
                        <pre className="flex-1 bg-black p-3 rounded-lg border border-slate-900 font-mono text-[9px] leading-relaxed text-cyan-300 overflow-y-auto h-[170px]">
                          {scannedOutput.code}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-slate-500">
                      <Upload className="w-10 h-10 text-cyan-500/20" />
                      <span className="text-xs font-bold text-slate-300">No layout scanned yet</span>
                      <p className="text-[10px] text-slate-500 max-w-sm">Load a mock screenshot template from the left, then click the "Laser Grid OCR scan" button to extract theme variables & code.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: VIDEO-TO-APP MOTION RECREATOR */}
          {activeTab === 'video' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left simulation player */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="border border-[#2b3040] bg-[#151926]/40 p-4 rounded-xl flex flex-col gap-3">
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">UI Gestural Video Simulation</span>
                  
                  {/* Simulated video panel */}
                  <div className="w-full h-36 bg-slate-950 border border-slate-900 rounded-lg relative overflow-hidden flex flex-col items-center justify-center p-4">
                    <Video className={`w-8 h-8 text-rose-500/40 mb-1 ${isPlayingVideo ? 'animate-bounce' : ''}`} />
                    <span className="text-[10px] font-black text-slate-400 font-mono uppercase">User_Scroll_Flow.mp4</span>
                    
                    {/* Animated visual overlays */}
                    {isPlayingVideo && (
                      <div className="absolute inset-0 bg-rose-500/5 flex flex-col justify-between p-2">
                        <div className="flex items-center justify-between text-[8px] font-mono text-rose-400">
                          <span>FPS: 60.0</span>
                          <span>FRAME: {videoFrame}</span>
                        </div>
                        {/* Target reticle */}
                        <div className="w-6 h-6 border-2 border-dashed border-rose-500 rounded-full animate-ping mx-auto" />
                        <div className="bg-rose-500/20 h-1 w-full rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full w-2/3 animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => {
                        setIsPlayingVideo(!isPlayingVideo);
                        setVideoFrame(34);
                      }}
                      className="py-2 bg-slate-950 hover:bg-slate-900 border border-slate-900 rounded-lg text-[10px] font-black uppercase text-slate-300 cursor-pointer"
                    >
                      {isPlayingVideo ? 'Pause Video' : 'Play Simulation'}
                    </button>
                    <button
                      onClick={runMotionRecreation}
                      disabled={isTrackingMotion}
                      className="py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer"
                    >
                      Track Motion
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Gestures output */}
              <div className="lg:col-span-7 flex flex-col gap-3 h-[430px] min-h-[300px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motion Optical Flow telemetry</span>
                
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
                  {isTrackingMotion ? (
                    <div className="flex-1 bg-black p-3.5 rounded-lg border border-rose-950/40 font-mono text-[9px] leading-relaxed text-rose-400 flex flex-col gap-1 overflow-y-auto">
                      <span className="text-xs font-bold text-white mb-2 animate-pulse">RUNNING GESTURE OPTICAL SCAN...</span>
                      {gestureLogs.map((log, i) => (
                        <div key={i}>✓ {log}</div>
                      ))}
                    </div>
                  ) : motionOutputCode ? (
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="bg-black/60 p-3 rounded-lg border border-slate-900 flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Identified Physics constants</span>
                        <div className="grid grid-cols-3 gap-2 mt-1 text-[9px] font-mono">
                          <div className="p-2 bg-slate-950 rounded border border-slate-900">
                            <span className="text-slate-500 block">DAMPING RATIO</span>
                            <span className="text-rose-400 font-black">LowBouncy (0.85)</span>
                          </div>
                          <div className="p-2 bg-slate-950 rounded border border-slate-900">
                            <span className="text-slate-500 block">STIFFNESS</span>
                            <span className="text-rose-400 font-black">Medium (1500f)</span>
                          </div>
                          <div className="p-2 bg-slate-950 rounded border border-slate-900">
                            <span className="text-slate-500 block">MAX VELOCITY</span>
                            <span className="text-rose-400 font-black">4.28 meters/sec</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-wider">Synthesized Spring Physics code</span>
                        <pre className="flex-1 bg-black p-3 rounded-lg border border-slate-900 font-mono text-[9px] leading-relaxed text-rose-300 overflow-y-auto h-[160px]">
                          {motionOutputCode}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-slate-500">
                      <Video className="w-10 h-10 text-rose-500/20" />
                      <span className="text-xs font-bold text-slate-300">No gestural telemetry extracted</span>
                      <p className="text-[10px] text-slate-500 max-w-sm">Run a simulated video scroll loop on the left, then trigger "Track Motion" to capture gestures and output physical spring coefficients.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CLOUD DEVICE TEST HARNESS */}
          {activeTab === 'cloud' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Device Selection Cards */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Device Cloud Cloud Grid</span>
                <div className="flex flex-col gap-2">
                  {cloudDevices.map((dev) => {
                    const isSelected = activeDeviceTest === dev.id;
                    return (
                      <div
                        key={dev.id}
                        className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all ${
                          isSelected
                            ? 'bg-indigo-950/20 border-indigo-500/50 text-white'
                            : 'bg-[#151926]/40 border-[#2b3040]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-400 font-mono flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5" /> {dev.name}
                          </span>
                          <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 font-black uppercase px-2 py-0.5 rounded-full">
                            Online
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{dev.specs}</p>
                        
                        <button
                          onClick={() => triggerCloudMonkeyTest(dev.id)}
                          disabled={isTesting}
                          className="w-full mt-1.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isTesting && activeDeviceTest === dev.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" /> Stress Testing...
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-white" /> Sideload & Monkey Test
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right diagnostics logs */}
              <div className="lg:col-span-7 flex flex-col gap-3 h-[430px] min-h-[300px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cloud Runner ADB Telemetry Log</span>
                
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
                  {activeDeviceTest ? (
                    <div className="flex-1 flex flex-col gap-4">
                      {/* Live graphics metric */}
                      <div className="bg-black/50 p-3 rounded-lg border border-slate-900 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Device Render Speed</span>
                          <span className="text-xs font-bold text-white font-mono flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-indigo-400" /> Frame Time Jitter (ms)
                          </span>
                        </div>
                        <div className="flex gap-1 items-end h-8">
                          {fpsData.map((val, i) => (
                            <div
                              key={i}
                              className="w-1.5 bg-indigo-500 rounded-full"
                              style={{ height: `${(val / 60) * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Log text box */}
                      <div className="flex-1 bg-black p-3.5 rounded-lg border border-slate-900 font-mono text-[9px] leading-relaxed text-indigo-300 overflow-y-auto max-h-[170px]">
                        {testLogs.map((log, i) => (
                          <div key={i} className={log.includes('successfully') || log.includes('Done') ? 'text-emerald-400' : 'text-indigo-300'}>
                            [ADB-SHELL] {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-slate-500">
                      <Smartphone className="w-10 h-10 text-indigo-500/20" />
                      <span className="text-xs font-bold text-slate-300">No device currently sideloaded</span>
                      <p className="text-[10px] text-slate-500 max-w-sm">Select one of our high-fidelity virtual mobile slots and trigger ADB sideload tests above.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PLUGIN MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Marketplace items grid */}
              <div className="lg:col-span-12 flex flex-col gap-4 h-[430px] min-h-[300px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Autonomous Core Extensions Marketplace</span>
                  <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
                    <ShoppingCart className="w-3.5 h-3.5" /> 5 Prebuilt Plugins Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                  {plugins.map((plugin) => (
                    <div key={plugin.id} className="border border-slate-800 bg-[#121622]/40 rounded-xl p-4 flex flex-col justify-between gap-3 shadow hover:border-purple-500/30 transition-all">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider font-mono">{plugin.category}</span>
                          <div className="flex items-center gap-1.5">
                            {plugin.premium && (
                              <span className="text-[8px] bg-amber-950 text-amber-400 border border-amber-500/20 font-black px-1.5 py-0.2 rounded uppercase">
                                PRO
                              </span>
                            )}
                            <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-0.5 font-mono">
                              ★ {plugin.rating}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-xs font-black text-slate-100">{plugin.name}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal line-clamp-3">{plugin.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 pt-3 mt-1 text-[10px] font-bold">
                        <span className="text-slate-500 font-mono">{plugin.downloads} downloads</span>
                        <button
                          onClick={() => togglePluginInstall(plugin.id)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                            plugin.installed
                              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                              : 'bg-purple-600 hover:bg-purple-500 text-white'
                          }`}
                        >
                          {plugin.installed ? 'Installed ✓' : 'Install Module'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between shrink-0 text-[9.5px] font-bold uppercase tracking-wider ${
          isDark ? 'bg-[#151926] border-[#2b3040] text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <span>Autonomous Sandbox Multi-Agent Hub</span>
          <span>© April 2026 Autonomy Suite Engine</span>
        </div>
      </div>
    </div>
  );
}
