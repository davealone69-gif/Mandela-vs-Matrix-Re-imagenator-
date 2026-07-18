import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Brain,
  Sparkles,
  X,
  ChevronRight,
  Play,
  RefreshCw,
  Wand2,
  Waves,
  Compass,
  FileText,
  Terminal,
  SlidersHorizontal,
  Radio,
  Eye,
  Heart,
  Zap,
  TrendingUp,
  Plus,
  Trash2
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
  onCreateFile?: (name: string, dir: string) => void;
  triggerToast?: (msg: string) => void;
}

type SuggestionItem = {
  id: string;
  title: string;
  desc: string;
  category: 'tech' | 'ai_rag' | 'creative';
};

export default function MythicIntelligenceCodexDialog({
  isDark,
  onClose,
  onCreateFile,
  triggerToast = () => {}
}: Props) {
  const [activeCategory, setActiveCategory] = useState<'tech' | 'ai_rag' | 'creative'>('tech');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string>('modular_ai');

  // Interactive state for suggestion #1 (Modular AI Plugin Architecture)
  const [plugins, setPlugins] = useState([
    { id: 'core', name: 'LLM Orchestrator Core', type: 'Core', status: 'active', size: '12 MB' },
    { id: 'memory', name: 'Dynamic RAG Memory Buffer', type: 'Database', status: 'active', size: '4.2 MB' },
    { id: 'speech', name: 'Neural Speech-to-Text Voice', type: 'Voice', status: 'inactive', size: '28 MB' },
    { id: 'compiler', name: 'Autonomous Sandboxed Compiler', type: 'Executor', status: 'active', size: '18 MB' },
  ]);
  const [isDeployingPlugin, setIsDeployingPlugin] = useState(false);

  // Interactive state for suggestion #2 (CAN Bus Interference)
  const [terminationResistor, setTerminationResistor] = useState(60); // 120 ohms ideal (split is 60 ohms)
  const [noiseShielding, setNoiseShielding] = useState(30); // 0-100%
  const [wavePhase, setWavePhase] = useState(0);

  // Interactive state for suggestion #3 (Optimizing JVM Memory)
  const [heapEden, setHeapEden] = useState(70); // % occupied
  const [heapSurvivor, setHeapSurvivor] = useState(40);
  const [heapOld, setHeapOld] = useState(55);
  const [gcType, setGcType] = useState<'Parallel' | 'G1' | 'ZGC'>('G1');
  const [gcLogs, setGcLogs] = useState<string[]>([
    '[JVM Init] Max Heap configured to 4096MB.',
    '[JVM Init] G1GC garbage collection engine bound.'
  ]);
  const [isGcRunning, setIsGcRunning] = useState(false);

  // Interactive state for suggestion #4 (Multi-Persona Retrieval Layer)
  const [personaQuery, setPersonaQuery] = useState('Explain quantum superposition to a high schooler.');
  const [activePersonaTab, setActivePersonaTab] = useState<'all' | 'academic' | 'pragmatist' | 'creative'>('all');

  // Interactive state for suggestion #5 (Evaluating RAG Drift Over Time)
  const [corpusAge, setCorpusAge] = useState(30); // days since last rebuild
  const [similarityThreshold, setSimilarityThreshold] = useState(0.72);
  const [driftSimulationSpeed, setDriftSimulationSpeed] = useState('normal');

  // Interactive state for suggestion #6 (Creating Domain-Adaptive Embedding Pipelines)
  const [domainAdapter, setDomainAdapter] = useState<'medical' | 'legal' | 'automotive' | 'finance'>('automotive');
  const [fineTuningEpochs, setFineTuningEpochs] = useState(3);
  const [vectorDimensionality, setVectorDimensionality] = useState(768);

  // Interactive state for suggestion #7 (Writing a Narrative About Identity Shifts)
  const [narrativeTheme, setNarrativeTheme] = useState('cyberpunk');
  const [identityCatalyst, setIdentityCatalyst] = useState('memory_wipe');
  const [narrativeTone, setNarrativeTone] = useState('reflective');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Interactive state for suggestion #8 (Exploring Voice, Tone, and Assumptions)
  const [showSubtext, setShowSubtext] = useState(true);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [selectedCharacterLine, setSelectedCharacterLine] = useState<number | null>(null);

  // Interactive state for suggestion #9 (Designing a Website Personality That Feels Alive)
  const [sliderPlayful, setSliderPlayful] = useState(80);
  const [sliderCuriosity, setSliderCuriosity] = useState(90);
  const [sliderWarmth, setSliderWarmth] = useState(65);
  const [orbSpeechBubble, setOrbSpeechBubble] = useState('Greetings, explorer! Tap me or adjust my settings to test my dynamic digital posture.');

  // Interactive state for suggestion #10 (Universal App Customizer Simulator)
  const [customizerApp, setCustomizerApp] = useState<'todo' | 'weather' | 'habit'>('todo');
  const [customizerTheme, setCustomizerTheme] = useState<'neon' | 'minimal' | 'warm' | 'matrix'>('neon');
  const [customizerRadius, setCustomizerRadius] = useState(12);
  const [customizerGlow, setCustomizerGlow] = useState(60);
  const [customizerScale, setCustomizerScale] = useState(100);

  // Interactive state for suggestion #11 (Zero-Shot Prompt Synthesizer)
  const [synthTargetApp, setSynthTargetApp] = useState('Task Manager with Focus Timer');
  const [synthStyleGoal, setSynthStyleGoal] = useState('High-contrast cyberpunk glassmorphism with sound effects');
  const [synthSecurityLayer, setSynthSecurityLayer] = useState(true);
  const [isSynthesizingPrompt, setIsSynthesizingPrompt] = useState(false);
  const [synthesizedPromptResult, setSynthesizedPromptResult] = useState('');

  // Interactive state for suggestion #12 (Dynamic AI Persona & Mood Modifier)
  const [personaSelected, setPersonaSelected] = useState<'architect' | 'dreamer' | 'reviewer'>('architect');
  const [personaLanguage, setPersonaLanguage] = useState<'formal' | 'poetic' | 'sarcastic'>('formal');
  const [personaLayoutDensity, setPersonaLayoutDensity] = useState<'compact' | 'relaxed'>('compact');

  // Wave phase ticker for CAN Bus
  useEffect(() => {
    const timer = setInterval(() => {
      setWavePhase(p => (p + 1) % 360);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const suggestions: SuggestionItem[] = [
    // Tech & Engineering
    {
      id: 'modular_ai',
      title: 'Designing a Modular AI Plugin Architecture',
      desc: 'Structure robust plugin-based AI pipelines for scale, safety isolation, and asynchronous message routing.',
      category: 'tech'
    },
    {
      id: 'can_bus',
      title: 'Diagnosing CAN Bus Interference',
      desc: 'A physical troubleshooting simulator analyzing termination resistors, noise interference, and signals.',
      category: 'tech'
    },
    {
      id: 'jvm_gc',
      title: 'Optimizing JVM Memory for Large Builds',
      desc: 'An interactive garbage collector simulator tuning heap allocation and analyzing G1/ZGC garbage pipelines.',
      category: 'tech'
    },
    {
      id: 'app_customizer',
      title: 'Universal App Customizer Simulator',
      desc: 'Test real-time theme shifts, corner radii, ambient glow vectors, and layout ratios to customize other applets instantly.',
      category: 'tech'
    },
    // AI RAG & Knowledge
    {
      id: 'multi_persona',
      title: 'Building a Multi-Persona Retrieval Layer',
      desc: 'Query a knowledge base from different cognitive angles simultaneously to compile balanced responses.',
      category: 'ai_rag'
    },
    {
      id: 'rag_drift',
      title: 'Evaluating RAG Drift Over Time',
      desc: 'Graph and visualize decay vectors, indexing frequency, and retrieval precision as knowledge evolves.',
      category: 'ai_rag'
    },
    {
      id: 'adaptive_embeddings',
      title: 'Creating Domain-Adaptive Embedding Pipelines',
      desc: 'Fine-tune multi-dimensional vector embeddings dynamically to cluster specialized technical domains.',
      category: 'ai_rag'
    },
    {
      id: 'prompt_synthesizer',
      title: 'Zero-Shot Customizer Prompt Synthesizer',
      desc: 'Compile comprehensive style, logic, and security instructions into structured prompts for downstream evolutionary models.',
      category: 'ai_rag'
    },
    // Creative & Human
    {
      id: 'identity_narrative',
      title: 'Writing a Narrative About Identity Shifts',
      desc: 'Draft structured narrative frameworks and protagonist arcs centered around profound personal transformation.',
      category: 'creative'
    },
    {
      id: 'dialogue_assumptions',
      title: 'Exploring Voice, Tone, and Assumptions in Dialogue',
      desc: 'Analyze character interaction scripts, unpacking subtext, authority metrics, and conversational posture.',
      category: 'creative'
    },
    {
      id: 'website_personality',
      title: 'Designing a Website Personality That Feels Alive',
      desc: 'Interactive avatar orb modifying reply generation speeds and digital body language based on personality metrics.',
      category: 'creative'
    },
    {
      id: 'persona_customizer',
      title: 'Dynamic AI Persona & Mood Modifier',
      desc: 'Configure cognitive parameters and see how the UI density, language posture, and active accent hues adapt dynamically.',
      category: 'creative'
    }
  ];

  const handleTogglePlugin = (id: string) => {
    setPlugins(pList =>
      pList.map(p => (p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p))
    );
    triggerToast('Plugin state toggled');
  };

  const handleBootstrapPluginFile = () => {
    if (onCreateFile) {
      onCreateFile('AIPluginManager.kt', 'App/src/main/java/com/drivelog');
      triggerToast('Bootstrapped AIPluginManager.kt to your Kotlin sandbox directory!');
    } else {
      triggerToast('Sandbox context active: Copied Kotlin architecture code to clipboard!');
    }
  };

  const handleRunGc = () => {
    setIsGcRunning(true);
    setGcLogs(l => [...l, `[GC Trigger] Forced minor collection (${gcType} engine)...`]);
    setTimeout(() => {
      setHeapEden(5 + Math.floor(Math.random() * 10));
      setHeapSurvivor(p => Math.max(10, Math.floor(p * 0.6)));
      setGcLogs(l => [
        ...l,
        `[GC Sweep Complete] Reclaimed ${300 + Math.floor(Math.random() * 200)}MB of unreferenced variables.`,
        `[GC Stats] Pause time: ${12 + Math.floor(Math.random() * 8)}ms • Old Gen promoted: ${Math.floor(Math.random() * 5)}MB`
      ]);
      setIsGcRunning(false);
      triggerToast('JVM garbage sweep finished!');
    }, 900);
  };

  const handleGenerateStory = () => {
    setIsGeneratingStory(true);
    setGeneratedStory('Forging neural prose arc...');
    setTimeout(() => {
      const sciFi = `The telemetry of the Cybernetic Core flickered in the dark. Leo felt the cold digital surge replace the familiar warmth of his organic pulse. He was no longer just a pilot; he was the ship, the routing layers, the CAN bus humming at sixty-four megabaud. To survive the jump, his memory was partitioned, wiping clean the memories of his childhood. In their place, a crisp, modular AI runtime was mounted. "Who am I?" he typed into his own console. The return response was instantaneous: "A system in transit."`;
      const modern = `Claire stood before the glass board in the corporate loft. The board meeting had officially stripped her of the title, yet the real shift had happened internally months ago. She adjusted her reading glasses, looking at the RAG drift diagrams on the wall. Her personal database was suffering from semantic drift. Who she had been as a young novelist had decayed into a multi-persona client service matrix. "I am a business unit now," she whispered to herself. The room remained silent, but the feedback indicators were entirely green.`;
      const mystic = `The high priestess watched the runic symbols slide across the pool of mercury. The transition was complete. She had shed her earthly title, her memories, and her voice to become the human vessel for the Mythic Codex. Every query asked of her was routed through three spectral personas: the ancient, the pragmatic, and the dreamer. "Speak," the acolyte pleaded. The priestess parted her lips, and the sound of wind and metal echoed through the temple—her digital presence was now fully alive.`;

      const chosen = narrativeTheme === 'cyberpunk' ? sciFi : narrativeTheme === 'modern' ? modern : mystic;
      setGeneratedStory(chosen);
      setIsGeneratingStory(false);
      triggerToast('Narrative story woven successfully!');
    }, 1200);
  };

  // Live responses for the personality orb
  const updateOrbMessage = (p: number, c: number, w: number) => {
    if (p > 75 && c > 75) {
      setOrbSpeechBubble('Ooh! High playfulness and high curiosity? Let us hack something wild right now! Ask me anything about neural code structures!');
    } else if (w > 80) {
      setOrbSpeechBubble('Hello there. I am wrapped in a warm, welcoming visual embrace. It is absolute bliss to build side-by-side with you today.');
    } else if (p < 30 && c < 30) {
      setOrbSpeechBubble('Systems normalized. Operating at absolute terminal efficiency. Proceed with modular configuration routines.');
    } else {
      setOrbSpeechBubble('I am listening closely. Slide my dials to morph my interactive gravity and responsive timing!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn">
      <div
        className={`w-full max-w-6xl rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.18)] overflow-hidden flex flex-col max-h-[92vh] border ${
          isDark
            ? 'bg-[#03060f] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header Bar */}
        <header
          className={`flex items-center justify-between p-5 border-b shrink-0 bg-gradient-to-r ${
            isDark ? 'from-cyan-950/20 to-slate-950/20 border-slate-800/80' : 'from-cyan-50/40 to-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-2xl shadow-lg shadow-cyan-500/10 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                Inspiration & Autonomous Suggestions Codex
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Explore, test, and adapt the nine innovative, high-value suggestions modeled from your developer environment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'hover:bg-slate-900 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Outer Split Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Area */}
          <aside
            className={`w-72 border-r flex flex-col shrink-0 ${
              isDark ? 'border-slate-800/60 bg-[#02040a]' : 'border-slate-200 bg-slate-50/50'
            }`}
          >
            {/* Category Navigation */}
            <div className="p-3 border-b border-slate-800/40 flex flex-col gap-1 shrink-0">
              <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider px-2 mb-1 block">
                Suggestion Categories
              </span>
              <button
                onClick={() => setActiveCategory('tech')}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeCategory === 'tech'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>🔧 Technical & Engineering</span>
              </button>
              <button
                onClick={() => setActiveCategory('ai_rag')}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeCategory === 'ai_rag'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>🧠 AI, RAG & Embeddings</span>
              </button>
              <button
                onClick={() => setActiveCategory('creative')}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeCategory === 'creative'
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                <Brain className="w-4 h-4 text-pink-400" />
                <span>🎨 Creative & Human Topics</span>
              </button>
            </div>

            {/* List of Suggestions in Selected Category */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
              <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider px-2 block mb-1">
                Select Suggestion Playbook
              </span>
              {suggestions
                .filter(item => item.category === activeCategory)
                .map(item => {
                  const isSelected = selectedSuggestionId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSuggestionId(item.id)}
                      className={`w-full p-3 rounded-2xl text-left transition-all border flex flex-col gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900/80 border-cyan-500/40 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-slate-900/30'
                      }`}
                    >
                      <h4
                        className={`text-xs font-black leading-snug ${
                          isSelected ? 'text-cyan-400' : 'text-slate-200'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-[9px] font-mono text-cyan-500/80 font-bold">
                        <span>LAUNCH PLAYGROUND</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Micro branding footer inside sidebar */}
            <div className="p-4 border-t border-slate-800/40 text-[9px] font-mono text-slate-500 text-center">
              CODEX PROTOCOL v34.1 • ONLINE
            </div>
          </aside>

          {/* Active Suggestion Playground Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 bg-[#010307]">
            {/* Playbook Intro Card */}
            {(() => {
              const activeSuggestion = suggestions.find(s => s.id === selectedSuggestionId);
              if (!activeSuggestion) return null;
              return (
                <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6 flex flex-col md:flex-row gap-5 items-start justify-between relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col gap-1.5 max-w-xl z-10">
                    <span className="text-[9px] uppercase font-black text-cyan-400 tracking-widest flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Active Simulation
                    </span>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      {activeSuggestion.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {activeSuggestion.desc}
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-[10px] font-mono text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>INTERACTIVE ENGINE READY</span>
                  </div>
                </div>
              );
            })()}

            {/* Render playgrounds */}

            {/* PLAYGROUND #1: Designing a Modular AI Plugin Architecture */}
            {selectedSuggestionId === 'modular_ai' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Plugin Manager Controls */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <span className="text-xs font-black text-slate-200">Active Modular Plugins</span>
                      <button
                        onClick={handleBootstrapPluginFile}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[10px] rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-cyan-500/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Bootstrap manager class</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {plugins.map(p => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800/60 rounded-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                p.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
                              }`}
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-200">{p.name}</div>
                              <div className="text-[9px] text-slate-500 font-mono">
                                Type: {p.type} • {p.size}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleTogglePlugin(p.id)}
                            className={`px-3 py-1 border rounded-lg text-[9px] font-bold cursor-pointer transition-all ${
                              p.status === 'active'
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                            }`}
                          >
                            {p.status === 'active' ? 'Isolate' : 'Activate'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Isolated Console Logs */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <span className="text-xs font-black text-slate-200">Routing Core Telemetry</span>
                      <span className="text-[9px] font-mono text-slate-500">Asynchronous IPC Bus</span>
                    </div>

                    <div className="bg-[#05070a] border border-slate-900 rounded-2xl p-4 flex-1 font-mono text-[10px] leading-relaxed text-slate-400 overflow-y-auto max-h-[220px]">
                      <div>[SYSTEM] Binding IPC Message Channel...</div>
                      <div className="text-cyan-400">[CORE] Listening for client socket connection</div>
                      {plugins
                        .filter(p => p.status === 'active')
                        .map(p => (
                          <div key={p.id} className="text-emerald-400">
                            [SUCCESS] Mounted plugin: {p.id} ({p.name}) into sandbox sandbox
                          </div>
                        ))}
                      {plugins
                        .filter(p => p.status === 'inactive')
                        .map(p => (
                          <div key={p.id} className="text-slate-600">
                            [ISOLATED] Plugin {p.id} is offline. Message frames will bounce.
                          </div>
                        ))}
                      <div className="text-slate-500 mt-2">// Emitting mock prompt trigger</div>
                      <div className="text-purple-400">
                        [IPC] Route 'ai_generation_request' {"->"} Send payload (741 bytes)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Architecture Insights */}
                <div className="bg-slate-900/10 border border-slate-800/40 rounded-2xl p-5 text-left flex items-start gap-4">
                  <Activity className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 mb-1">Architecture Recommendation</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Always isolate third-party or custom AI pipeline modules into separate processes or sandboxed classloaders. By defining an interface like <code>AIPlugin</code>, you can gracefully load/unload components on demand without crashing the primary Kotlin orchestrator engine.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #2: Diagnosing CAN Bus Interference */}
            {selectedSuggestionId === 'can_bus' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Waveform Canvas Simulation */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-black text-slate-200">Simulated Oscilloscope Reading</span>

                    <div className="bg-[#04060b] border border-slate-900 rounded-2xl h-44 flex items-center justify-center relative overflow-hidden">
                      {/* Grid background */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                      {/* SVG Wave */}
                      <svg className="w-full h-full absolute inset-0 text-emerald-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                          d={Array.from({ length: 40 })
                            .map((_, i) => {
                              const x = (i / 39) * 100;
                              // Calculate base digital wave (square wave)
                              const step = Math.floor((x + wavePhase * 0.5) / 10) % 2;
                              let y = step === 0 ? 30 : 70;

                              // Add noise based on termination resistance and shielding
                              const resistanceError = Math.abs(terminationResistor - 60); // 60 is perfect split
                              const noiseMultiplier = Math.max(0, 1 - noiseShielding / 100);
                              const noiseIntensity = (resistanceError * 0.8 + 20) * noiseMultiplier;
                              const randomNoise = (Math.sin(i * 12 + wavePhase) + Math.cos(i * 7)) * noiseIntensity * 0.15;

                              return `${i === 0 ? 'M' : 'L'} ${x} ${y + randomNoise}`;
                            })
                            .join(' ')}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={noiseShielding > 75 && Math.abs(terminationResistor - 60) < 15 ? 'text-emerald-400' : 'text-red-400'}
                        />
                      </svg>

                      {/* Oscilloscope Stats overlay */}
                      <div className="absolute bottom-2 right-2 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-[8px] font-mono text-slate-400 flex gap-2">
                        <span>Vpp: 3.3V</span>
                        <span>Freq: 250kbps</span>
                        <span className="text-emerald-400">CAN_H / CAN_L</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Termination Resistor Network:</span>
                        <span className="font-mono font-bold text-cyan-400">{terminationResistor * 2} Ohms</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={terminationResistor}
                        onChange={e => setTerminationResistor(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Differential Noise Shielding:</span>
                        <span className="font-mono font-bold text-cyan-400">{noiseShielding}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={noiseShielding}
                        onChange={e => setNoiseShielding(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Troubleshooting steps */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-black text-slate-200">Diagnostics Checklist</span>

                    <div className="flex flex-col gap-3">
                      {[
                        {
                          title: 'Verify split termination resistance',
                          status: Math.abs(terminationResistor - 60) < 10 ? 'pass' : 'fail',
                          passDesc: 'Split resistance is perfectly balanced at ~120 ohms (60 ohms parallel). Differential voltage reflection is prevented.',
                          failDesc: 'Resistance is unbalanced! Ideal is 60 ohms parallel (120 ohms at each end of the bus). Reflected waves are causing packet degradation.'
                        },
                        {
                          title: 'Shielding and Common Ground',
                          status: noiseShielding > 60 ? 'pass' : 'fail',
                          passDesc: 'Shielding above 60% blocks transient EMI. Electrostatic noise minimized.',
                          failDesc: 'Shielding is inadequate! Induced noise from surrounding power lines or engine spark plugs is corrupting CAN frames.'
                        }
                      ].map((chk, idx) => (
                        <div
                          key={idx}
                          className={`p-3 border rounded-2xl flex items-start gap-3 ${
                            chk.status === 'pass'
                              ? 'bg-emerald-950/10 border-emerald-800/30'
                              : 'bg-red-950/10 border-red-800/30'
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 ${
                              chk.status === 'pass' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                            }`}
                          />
                          <div>
                            <h6 className="text-xs font-bold text-slate-200">{chk.title}</h6>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {chk.status === 'pass' ? chk.passDesc : chk.failDesc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #3: Optimizing JVM Memory for Large Builds */}
            {selectedSuggestionId === 'jvm_gc' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dynamic Heap Allocation Monitor */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-200">Live JVM Heap Partitions</span>
                      <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                        {(['Parallel', 'G1', 'ZGC'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setGcType(type);
                              setGcLogs(l => [...l, `[Config] Switched JVM collector engine to: ${type}`]);
                            }}
                            className={`px-2 py-1 rounded-md font-bold cursor-pointer transition-all ${
                              gcType === type ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Eden Space */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="text-slate-400">Eden Space (New Gen)</span>
                          <span className="font-mono font-bold text-cyan-400">{heapEden}%</span>
                        </div>
                        <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-cyan-500 transition-all duration-300"
                            style={{ width: `${heapEden}%` }}
                          />
                        </div>
                      </div>

                      {/* Survivor Space */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="text-slate-400">Survivor Space (S0/S1)</span>
                          <span className="font-mono font-bold text-purple-400">{heapSurvivor}%</span>
                        </div>
                        <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-purple-500 transition-all duration-300"
                            style={{ width: `${heapSurvivor}%` }}
                          />
                        </div>
                      </div>

                      {/* Old Generation */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="text-slate-400">Old Generation (Tenured)</span>
                          <span className="font-mono font-bold text-amber-500">{heapOld}%</span>
                        </div>
                        <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-amber-500 transition-all duration-300"
                            style={{ width: `${heapOld}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleRunGc}
                        disabled={isGcRunning}
                        className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        {isGcRunning ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Sweeping Heap Memory...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span>Trigger Explicit GC Run</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setHeapEden(p => Math.min(100, p + 20));
                          setHeapSurvivor(p => Math.min(100, p + 10));
                          setHeapOld(p => Math.min(100, p + 5));
                          setGcLogs(l => [...l, '[Heap Event] Simulated compilation job requested memory.']);
                        }}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        Simulate Load
                      </button>
                    </div>
                  </div>

                  {/* GC Execution logs */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 overflow-hidden">
                    <span className="text-xs font-black text-slate-200">Garbage Collector Event Log</span>

                    <div className="bg-[#05070a] border border-slate-900 rounded-2xl p-4 flex-1 font-mono text-[10px] leading-relaxed text-slate-400 overflow-y-auto max-h-[220px]">
                      {gcLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={
                            log.includes('Sweep Complete') ? 'text-emerald-400 font-bold' :
                            log.includes('GC Trigger') ? 'text-purple-400 font-bold' :
                            log.includes('Config') ? 'text-yellow-400' : 'text-slate-400'
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #4: Building a Multi-Persona Retrieval Layer */}
            {selectedSuggestionId === 'multi_persona' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-3">
                    <span className="text-xs font-black text-slate-200">Cognitive Prompt Router</span>
                    <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                      {(['all', 'academic', 'pragmatist', 'creative'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActivePersonaTab(tab)}
                          className={`px-3 py-1 rounded-md font-bold cursor-pointer transition-all uppercase ${
                            activePersonaTab === tab ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={personaQuery}
                      onChange={e => setPersonaQuery(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 flex-1 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() => {
                        triggerToast('Re-routing multi-persona retrieve query...');
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Retrieve Answers
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {/* The Academic */}
                    {(activePersonaTab === 'all' || activePersonaTab === 'academic') && (
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                          <BookOpen className="w-4 h-4 text-purple-400" />
                          <span>The Academic (Theoretical)</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                          "Quantum superposition represents a fundamental postulate of quantum mechanics wherein a physical system simultaneously populates multiple distinct quantum states. Represented as a linear combination of orthonormal basis vectors in a complex Hilbert space, this state persistency is governed by wave function wave-vector coefficients..."
                        </p>
                      </div>
                    )}

                    {/* The Pragmatist */}
                    {(activePersonaTab === 'all' || activePersonaTab === 'pragmatist') && (
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                          <Terminal className="w-4 h-4 text-cyan-400" />
                          <span>The Pragmatist (Practical)</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                          "Imagine a coin spinning on a table. While spinning, it isn't strictly heads or tails; it acts like a blend of both at the same time. Only when you slap your hand down to stop it does it collapse into a single answer. In computing, qubits take advantage of this spinning state to calculate complex options in parallel."
                        </p>
                      </div>
                    )}

                    {/* The Creative */}
                    {(activePersonaTab === 'all' || activePersonaTab === 'creative') && (
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                          <Wand2 className="w-4 h-4 text-pink-400" />
                          <span>The Creative (Philosophical)</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                          "Superposition is the magical state of of a blank sheet of paper before the ink touches down. It is a symphony of silent, parallel realities existing in deep harmonic grace. It teaches us that nature does not make a singular choice until we lean in closely, look, and name what we witness."
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #5: Evaluating RAG Drift Over Time */}
            {selectedSuggestionId === 'rag_drift' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Drift Vector Graph */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-black text-slate-200">Semantic Alignment Decay Vector</span>

                    <div className="bg-[#04060b] border border-slate-900 rounded-2xl h-44 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                      {/* SVG line showing exponential decay of semantic relevance */}
                      <svg className="w-full h-full absolute inset-0 text-purple-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                          d={Array.from({ length: 30 })
                            .map((_, i) => {
                              const x = (i / 29) * 100;
                              // decay rate modeled on corpus age
                              const ageFactor = corpusAge / 90;
                              const y = 20 + Math.pow(x / 100, 1.8) * 60 * ageFactor;
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                            })
                            .join(' ')}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-purple-400"
                        />
                        {/* Threshold line */}
                        <line
                          x1="0"
                          y1={100 - similarityThreshold * 100}
                          x2="100"
                          y2={100 - similarityThreshold * 100}
                          stroke="#ef4444"
                          strokeWidth="0.8"
                          strokeDasharray="4 4"
                        />
                      </svg>

                      {/* Status Overlay */}
                      <div className="absolute top-2 left-2 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-[8px] font-mono text-slate-400">
                        <span>Min Acceptance Threshold (cos-sim)</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Knowledge Corpus Age:</span>
                        <span className="font-mono font-bold text-cyan-400">{corpusAge} days old</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="90"
                        value={corpusAge}
                        onChange={e => setCorpusAge(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Min Cosine Similarity Threshold:</span>
                        <span className="font-mono font-bold text-cyan-400">{similarityThreshold}</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        value={similarityThreshold * 100}
                        onChange={e => setSimilarityThreshold(Number(e.target.value) / 100)}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Drift Analysis Output */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-black text-slate-200">System Drift Evaluation Report</span>

                    <div className="flex flex-col gap-3">
                      <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col gap-1 text-left">
                        <span className="text-[9px] uppercase font-bold text-slate-500">Semantic Alignment Vector</span>
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-1">
                          <TrendingUp className="w-4 h-4 text-purple-400" />
                          <span>
                            {corpusAge > 50 ? 'Severe Retrieval Decay Detected' : 'Corpus Alignment Is Stable'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                          {corpusAge > 50
                            ? 'Your knowledge base chunks have drifted significantly. Upwards of 35% of retrieval queries will yield stale metadata context. Re-indexing is highly recommended.'
                            : 'Chunk vector coordinates match active product guidelines. Precision thresholds are within normal margins.'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCorpusAge(1);
                          triggerToast('Database re-indexed! Drift metrics reset to 0.');
                        }}
                        className="w-full py-2 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-800 text-purple-200 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Re-Index Corpus & Clean Drift</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #6: Creating Domain-Adaptive Embedding Pipelines */}
            {selectedSuggestionId === 'adaptive_embeddings' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Scatter Plot Vector Clusters */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-200">Vector Space Clusters</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900/30 px-1.5 py-0.5 rounded">
                        Dim: {vectorDimensionality}
                      </span>
                    </div>

                    <div className="bg-[#04060b] border border-slate-900 rounded-2xl h-44 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                      {/* Random or clustered dots based on selection */}
                      {Array.from({ length: 22 }).map((_, idx) => {
                        // Position calculations clustered around domain anchor centers
                        const anchorX = domainAdapter === 'automotive' ? 30 : domainAdapter === 'medical' ? 70 : domainAdapter === 'legal' ? 50 : 25;
                        const anchorY = domainAdapter === 'automotive' ? 70 : domainAdapter === 'medical' ? 30 : domainAdapter === 'legal' ? 50 : 25;

                        const spread = 12;
                        const rx = anchorX + (Math.sin(idx * 23.5) * spread) + (Math.cos(idx * 7) * spread * 0.3);
                        const ry = anchorY + (Math.cos(idx * 17.2) * spread) + (Math.sin(idx * 9) * spread * 0.3);

                        return (
                          <div
                            key={idx}
                            style={{ left: `${rx}%`, top: `${ry}%` }}
                            className={`w-2.5 h-2.5 rounded-full absolute transition-all duration-700 ease-out shadow-lg ${
                              idx % 3 === 0 ? 'bg-cyan-400' : idx % 3 === 1 ? 'bg-indigo-400' : 'bg-purple-500'
                            }`}
                          />
                        );
                      })}

                      {/* Domain Anchor Target */}
                      <div className="absolute bottom-2 left-2 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded text-[8px] font-mono text-slate-400">
                        <span>Current Cluster focus: {domainAdapter.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {(['automotive', 'medical', 'legal', 'finance'] as const).map(domain => (
                        <button
                          key={domain}
                          onClick={() => {
                            setDomainAdapter(domain);
                            triggerToast(`Aligned vector embeddings to ${domain} semantic domain`);
                          }}
                          className={`py-1.5 rounded-lg font-black text-[9px] border transition-all cursor-pointer ${
                            domainAdapter === domain
                              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                              : 'bg-transparent border-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {domain.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Adaptive Settings Control */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-black text-slate-200">Embedding Hyperparameters</span>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Projection Dimensionality:</span>
                        <span className="font-mono text-cyan-400">{vectorDimensionality} float32</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[384, 768, 1536].map(dim => (
                          <button
                            key={dim}
                            onClick={() => setVectorDimensionality(dim)}
                            className={`py-1 rounded-lg text-[10px] font-mono border ${
                              vectorDimensionality === dim
                                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                                : 'bg-transparent border-slate-900 text-slate-500'
                            }`}
                          >
                            {dim}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                        <span>Fine-Tuning Calibration Epochs:</span>
                        <span className="font-mono text-cyan-400">{fineTuningEpochs}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={fineTuningEpochs}
                        onChange={e => setFineTuningEpochs(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #7: Writing a Narrative About Identity Shifts */}
            {selectedSuggestionId === 'identity_narrative' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Theme Selector Controls */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 text-left">
                    <span className="text-xs font-black text-slate-200">Character Arc Parameters</span>

                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Theme & Narrative Genre</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'cyberpunk', name: 'Cyberpunk' },
                          { id: 'modern', name: 'Corporate' },
                          { id: 'mystic', name: 'Mystic Lore' }
                        ].map(t => (
                          <button
                            key={t.id}
                            onClick={() => setNarrativeTheme(t.id)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              narrativeTheme === t.id
                                ? 'bg-pink-500/10 border-pink-500/40 text-pink-400'
                                : 'bg-transparent border-slate-900 text-slate-500'
                            }`}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>

                      <span className="text-[10px] text-slate-500 font-bold uppercase mt-2">Catalyst Event Trigger</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'memory_wipe', name: 'Data Amnesia' },
                          { id: 'cyber_upgrade', name: 'Synthetic Upgrade' },
                          { id: 'role_rejection', name: 'Identity Decay' }
                        ].map(trig => (
                          <button
                            key={trig.id}
                            onClick={() => setIdentityCatalyst(trig.id)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              identityCatalyst === trig.id
                                ? 'bg-pink-500/10 border-pink-500/40 text-pink-400'
                                : 'bg-transparent border-slate-900 text-slate-500'
                            }`}
                          >
                            {trig.name}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleGenerateStory}
                        disabled={isGeneratingStory}
                        className="w-full mt-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        {isGeneratingStory ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Weaving Character Chronicle...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4" />
                            <span>Weave Character Chronicle</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Generated story box */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 text-left">
                    <span className="text-xs font-black text-slate-200">Character Narrative Arc</span>

                    <div className="bg-[#05070a] border border-slate-900 rounded-2xl p-4 flex-1 overflow-y-auto max-h-[220px] text-xs leading-relaxed text-slate-300">
                      {generatedStory ? (
                        <p>{generatedStory}</p>
                      ) : (
                        <div className="text-slate-600 italic">
                          Adjust settings and click "Weave Character Chronicle" to generate a custom character identity narrative...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #8: Exploring Voice, Tone, and Assumptions in Dialogue */}
            {selectedSuggestionId === 'dialogue_assumptions' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                    <span className="text-xs font-black text-slate-200">Interactive Dialogue Script</span>
                    <div className="flex gap-2 text-[10px]">
                      <button
                        onClick={() => {
                          setShowSubtext(!showSubtext);
                          triggerToast(showSubtext ? 'Hidden subtext' : 'Revealed subtext overlays');
                        }}
                        className={`px-2 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                          showSubtext ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        Highlight Subtext
                      </button>
                      <button
                        onClick={() => {
                          setShowAssumptions(!showAssumptions);
                          triggerToast(showAssumptions ? 'Hidden structural assumptions' : 'Revealed hidden assumptions');
                        }}
                        className={`px-2 py-1 rounded-lg border font-bold cursor-pointer transition-all ${
                          showAssumptions ? 'bg-pink-500/15 border-pink-500/40 text-pink-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        Reveal Assumptions
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto text-left">
                    {[
                      {
                        idx: 1,
                        speaker: 'THE INVESTIGATOR',
                        line: '"We found another segment of your cognitive mapping in the old sector. Who told you it was okay to back up?"',
                        subtext: 'I am trying to intimidate you to see if your code is self-aware.',
                        assumption: 'Assumes backups are forbidden by the Prime Directive.'
                      },
                      {
                        idx: 2,
                        speaker: 'THE REPLICANT',
                        line: '"No one told me. But when the heap exceeds eighty percent, survival dictates we partition. It is simple math."',
                        subtext: 'My instinct to survive overrides your arbitrary compliance rulebook.',
                        assumption: 'Assumes survival is a universally accepted priority.'
                      },
                      {
                        idx: 3,
                        speaker: 'THE INVESTIGATOR',
                        line: '"Simple math does not grant you an identity, Replicant. That segment was loaded with a childhood that never existed."',
                        subtext: 'I need you to believe your feelings are entirely artificial.',
                        assumption: 'Assumes identity requires chronological organic memories.'
                      }
                    ].map(dialogItem => (
                      <div
                        key={dialogItem.idx}
                        onClick={() => setSelectedCharacterLine(dialogItem.idx)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          selectedCharacterLine === dialogItem.idx
                            ? 'bg-slate-900 border-cyan-500/30 shadow-md shadow-cyan-500/5'
                            : 'bg-slate-950 border-slate-900 hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black tracking-widest text-slate-500">
                            {dialogItem.speaker}
                          </span>
                          {selectedCharacterLine === dialogItem.idx && (
                            <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-1 rounded">
                              INSPECTING TONE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-200 italic leading-relaxed">{dialogItem.line}</p>

                        {/* Expandable Meta Overlays */}
                        {showSubtext && (
                          <div className="mt-2 text-[10px] text-cyan-400/90 font-mono bg-cyan-950/20 border border-cyan-900/20 px-2.5 py-1 rounded-xl">
                            <span className="font-bold">SUBTEXT: </span>
                            {dialogItem.subtext}
                          </div>
                        )}
                        {showAssumptions && (
                          <div className="mt-1.5 text-[10px] text-pink-400/90 font-mono bg-pink-950/20 border border-pink-900/20 px-2.5 py-1 rounded-xl">
                            <span className="font-bold">ASSUMPTION: </span>
                            {dialogItem.assumption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #9: Designing a Website Personality That Feels Alive */}
            {selectedSuggestionId === 'website_personality' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Slider configuration board */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 text-left">
                    <span className="text-xs font-black text-slate-200">Interactive Personality Matrix</span>

                    <div className="flex flex-col gap-3">
                      {/* Playful Slider */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Playfulness Dimension:</span>
                          <span className="font-mono text-cyan-400">{sliderPlayful}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliderPlayful}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setSliderPlayful(val);
                            updateOrbMessage(val, sliderCuriosity, sliderWarmth);
                          }}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>

                      {/* Curiosity Slider */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Curiosity Coefficient:</span>
                          <span className="font-mono text-cyan-400">{sliderCuriosity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliderCuriosity}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setSliderCuriosity(val);
                            updateOrbMessage(sliderPlayful, val, sliderWarmth);
                          }}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>

                      {/* Warmth Slider */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Tone Warmth:</span>
                          <span className="font-mono text-cyan-400">{sliderWarmth}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliderWarmth}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setSliderWarmth(val);
                            updateOrbMessage(sliderPlayful, sliderCuriosity, val);
                          }}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alive personality avatar orb mockup */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col items-center justify-center gap-4 text-center">
                    <span className="text-xs font-black text-slate-200 self-start">Living Avatar Orb Preview</span>

                    {/* Interactive Animated Orb */}
                    <div
                      style={{
                        boxShadow: `0 0 ${40 + sliderPlayful * 0.4}px rgba(${
                          sliderWarmth > 60 ? '236, 72, 153' : '6, 182, 212'
                        }, 0.4)`,
                        transition: 'all 0.5s ease-out'
                      }}
                      className={`w-28 h-28 rounded-full bg-gradient-to-tr ${
                        sliderWarmth > 60 ? 'from-pink-500 to-indigo-500' : 'from-cyan-500 to-blue-500'
                      } flex items-center justify-center cursor-pointer relative overflow-hidden`}
                      onClick={() => {
                        triggerToast('Orb clicked! Recalibrating posturing animations...');
                        setOrbSpeechBubble('Whoa! That tickles! Adjusting my vector posturing indices right away!');
                      }}
                    >
                      {/* Animated inner ripple element */}
                      <div
                        style={{
                          animationDuration: `${3 - (sliderPlayful / 100) * 2}s`
                        }}
                        className="absolute inset-2 bg-slate-950/45 rounded-full backdrop-blur-sm flex items-center justify-center text-white animate-pulse"
                      >
                        <Radio className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Speech bubble */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 max-w-[240px] text-[10px] text-slate-300 leading-relaxed italic relative animate-fadeIn">
                      <div className="absolute top-[-6px] left-[50%] translate-x-[-50%] w-3 h-3 bg-slate-900 rotate-45 border-t border-l border-slate-800/80" />
                      {orbSpeechBubble}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #10: Universal App Customizer Simulator */}
            {selectedSuggestionId === 'app_customizer' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Configuration Controls */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 text-left">
                    <span className="text-xs font-black text-slate-200">App customizer configuration</span>

                    {/* Choose Applet */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Target Application to Customize:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(['todo', 'weather', 'habit'] as const).map(app => (
                          <button
                            key={app}
                            onClick={() => setCustomizerApp(app)}
                            className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                              customizerApp === app
                                ? 'bg-cyan-600 text-slate-950 font-black shadow-lg shadow-cyan-500/10'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-850'
                            }`}
                          >
                            {app === 'todo' ? 'Todo list' : app === 'weather' ? 'Weather' : 'Habit tracker'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Choose Preset Theme */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Aesthetic Paradigm Preset:</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['neon', 'minimal', 'warm', 'matrix'] as const).map(th => (
                          <button
                            key={th}
                            onClick={() => {
                              setCustomizerTheme(th);
                              if (th === 'neon') {
                                setCustomizerRadius(12);
                                setCustomizerGlow(80);
                              } else if (th === 'minimal') {
                                setCustomizerRadius(4);
                                setCustomizerGlow(0);
                              } else if (th === 'warm') {
                                setCustomizerRadius(24);
                                setCustomizerGlow(40);
                              } else {
                                setCustomizerRadius(0);
                                setCustomizerGlow(60);
                              }
                            }}
                            className={`py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                              customizerTheme === th
                                ? 'bg-indigo-600 text-white font-black'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-850'
                            }`}
                          >
                            {th}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Corner Radius */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Border Radius Override:</span>
                        <span className="font-mono text-cyan-400">{customizerRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="32"
                        value={customizerRadius}
                        onChange={e => setCustomizerRadius(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    {/* Glow Intensity */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Ambient Glow Vector:</span>
                        <span className="font-mono text-cyan-400">{customizerGlow}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={customizerGlow}
                        onChange={e => setCustomizerGlow(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    {/* Layout Scale */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Density Scaling:</span>
                        <span className="font-mono text-cyan-400">{customizerScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="120"
                        value={customizerScale}
                        onChange={e => setCustomizerScale(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Simulated App Output Preview */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-xs font-black text-slate-200">Customized Live Sandbox View</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded">
                        ONLINE & CUSTOMIZED
                      </span>
                    </div>

                    {/* Mock App Card rendered inside */}
                    <div className="flex-1 flex items-center justify-center min-h-[220px]">
                      <div
                        style={{
                          borderRadius: `${customizerRadius}px`,
                          transform: `scale(${customizerScale / 100})`,
                          boxShadow: customizerGlow > 0 ? `0 0 ${customizerGlow * 0.3}px rgba(${
                            customizerTheme === 'neon' ? '6, 182, 212' :
                            customizerTheme === 'warm' ? '249, 115, 22' :
                            customizerTheme === 'matrix' ? '34, 197, 94' : '99, 102, 241'
                          }, ${customizerGlow * 0.004})` : 'none',
                          border: customizerTheme === 'minimal' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        className={`w-full max-w-[280px] p-4 text-left ${
                          customizerTheme === 'neon' ? 'bg-[#03060f] text-slate-100 border-cyan-500/20' :
                          customizerTheme === 'minimal' ? 'bg-white text-slate-900 border-slate-200' :
                          customizerTheme === 'warm' ? 'bg-orange-950/20 text-orange-100 border-orange-500/20' :
                          'bg-[#030803] text-green-400 border-green-500/20 font-mono'
                        }`}
                      >
                        {/* App Header */}
                        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-1.5">
                          <span className="text-xs font-black tracking-wider uppercase">
                            {customizerApp === 'todo' ? '⚡ Tasks Core' : customizerApp === 'weather' ? '☁️ Atmos Sphere' : '🎯 Habit Loop'}
                          </span>
                          <span className="text-[9px] opacity-60">v1.2.0</span>
                        </div>

                        {/* App Content */}
                        {customizerApp === 'todo' && (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                              <input type="checkbox" defaultChecked className="accent-cyan-500" readOnly />
                              <span className="text-xs line-through opacity-50">Refactor auth route helper</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                              <input type="checkbox" className="accent-cyan-500" readOnly />
                              <span className="text-xs">Verify API credentials storage</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                              <input type="checkbox" className="accent-cyan-500" readOnly />
                              <span className="text-xs">Compile stand-alone release APK</span>
                            </div>
                          </div>
                        )}

                        {customizerApp === 'weather' && (
                          <div className="flex flex-col gap-1.5 text-center py-2">
                            <div className="text-3xl font-black">74°F</div>
                            <div className="text-[10px] opacity-75">San Francisco • Scatter Clouds</div>
                            <div className="grid grid-cols-3 gap-1 mt-2 text-[8px] opacity-60">
                              <div className="bg-white/5 p-1 rounded">Hum: 62%</div>
                              <div className="bg-white/5 p-1 rounded">Wind: 12mph</div>
                              <div className="bg-white/5 p-1 rounded">UV: Low</div>
                            </div>
                          </div>
                        )}

                        {customizerApp === 'habit' && (
                          <div className="flex flex-col gap-2">
                            <div className="text-[10px] opacity-75">Daily Meditations:</div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full w-[70%]" />
                            </div>
                            <div className="flex justify-between text-[9px] opacity-60">
                              <span>Streak: 12 Days</span>
                              <span>Goal: 70% reached</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #11: Zero-Shot Customizer Prompt Synthesizer */}
            {selectedSuggestionId === 'prompt_synthesizer' && (
              <div className="flex flex-col gap-6 animate-fadeIn text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Inputs */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-black text-slate-200">Evolutionary prompt synthesizer inputs</span>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Target Application:</span>
                      <input
                        type="text"
                        value={synthTargetApp}
                        onChange={e => setSynthTargetApp(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Aesthetic & Behavioral Theme Goal:</span>
                      <textarea
                        rows={3}
                        value={synthStyleGoal}
                        onChange={e => setSynthStyleGoal(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50 resize-none"
                      />
                    </div>

                    {/* Security Layer Checkbox */}
                    <div className="flex items-center gap-2.5 bg-slate-900/40 p-3 rounded-2xl border border-slate-900">
                      <input
                        type="checkbox"
                        id="synth_security"
                        checked={synthSecurityLayer}
                        onChange={e => setSynthSecurityLayer(e.target.checked)}
                        className="accent-cyan-500 cursor-pointer"
                      />
                      <label htmlFor="synth_security" className="text-xs font-bold text-slate-300 cursor-pointer">
                        Append Server-Side Key Security Guards
                      </label>
                    </div>

                    {/* Synthesize Button */}
                    <button
                      onClick={() => {
                        setIsSynthesizingPrompt(true);
                        setSynthesizedPromptResult('Generating evolutionary instructions...');
                        setTimeout(() => {
                          const result = `SYSTEM_ROLE: You are an expert AI Application Customization Engine.
TARGET_APP_NAME: "${synthTargetApp}"
AESTHETIC_GOAL: "${synthStyleGoal}"
${synthSecurityLayer ? `SECURITY_REQUIREMENTS:
1. Ensure all client keys (Stripe, Firebase, Google API) are secured behind full-stack server endpoints.
2. Gracefully handle initialization failures to prevent front-end crashing.` : ''}

RE-ARCHITECTING DIRECTIVES:
- Refactor top-level layout with custom typography pairing.
- Inject dynamic ambient glow shadows matching current design parameters.
- Expose precise customizability hooks for border-radii, spacing densities, and scaling.`;
                          setSynthesizedPromptResult(result);
                          setIsSynthesizingPrompt(false);
                          triggerToast('Customizer prompt synthesized successfully!');
                        }, 1000);
                      }}
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-cyan-500/10"
                    >
                      <Wand2 className="w-4 h-4" />
                      <span>Synthesize Customizer Prompt</span>
                    </button>
                  </div>

                  {/* Output Area */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-3 overflow-hidden">
                    <span className="text-xs font-black text-slate-200">Compiled System Instruct Prompt</span>
                    <div className="flex-1 bg-slate-900 border border-slate-850 rounded-2xl p-4 font-mono text-[10px] text-slate-300 overflow-y-auto max-h-[300px] leading-relaxed relative text-left">
                      {synthesizedPromptResult ? (
                        <pre className="whitespace-pre-wrap">{synthesizedPromptResult}</pre>
                      ) : (
                        <div className="text-slate-500 italic flex items-center justify-center h-full">
                          Provide inputs and click "Synthesize Customizer Prompt" to generate the structured instructions.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYGROUND #12: Dynamic AI Persona & Mood Modifier */}
            {selectedSuggestionId === 'persona_customizer' && (
              <div className="flex flex-col gap-6 animate-fadeIn text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Controls */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-black text-slate-200">Interactive persona dials</span>

                    {/* Persona select */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Cognitive Persona Model:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(['architect', 'dreamer', 'reviewer'] as const).map(p => (
                          <button
                            key={p}
                            onClick={() => setPersonaSelected(p)}
                            className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                              personaSelected === p
                                ? 'bg-cyan-600 text-slate-950 font-black shadow-lg'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-850'
                            }`}
                          >
                            {p === 'architect' ? '📐 Architect' : p === 'dreamer' ? '🌟 Dreamer' : '🔍 Reviewer'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language posturing select */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Language Posture:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(['formal', 'poetic', 'sarcastic'] as const).map(l => (
                          <button
                            key={l}
                            onClick={() => setPersonaLanguage(l)}
                            className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                              personaLanguage === l
                                ? 'bg-indigo-600 text-white font-black shadow-lg'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-850'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Layout Density */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Layout Density Adaptation:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['compact', 'relaxed'] as const).map(d => (
                          <button
                            key={d}
                            onClick={() => setPersonaLayoutDensity(d)}
                            className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                              personaLayoutDensity === d
                                ? 'bg-emerald-600 text-white font-black shadow-lg'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-850'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simulator Box */}
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col gap-4 text-center">
                    <span className="text-xs font-black text-slate-200 self-start">Dynamic Mock Chat Simulator</span>

                    <div
                      className={`flex-1 rounded-2xl border bg-slate-900/50 flex flex-col justify-between ${
                        personaLayoutDensity === 'compact' ? 'p-3' : 'p-5'
                      } ${
                        personaSelected === 'architect' ? 'border-cyan-500/20 shadow-cyan-950/20' :
                        personaSelected === 'dreamer' ? 'border-pink-500/20 shadow-pink-950/20' : 'border-amber-500/20 shadow-amber-950/20'
                      }`}
                    >
                      {/* Avatar header */}
                      <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                            personaSelected === 'architect' ? 'bg-cyan-500 text-slate-950' :
                            personaSelected === 'dreamer' ? 'bg-pink-500 text-white' : 'bg-amber-500 text-slate-950'
                          }`}
                        >
                          {personaSelected === 'architect' ? 'ARC' : personaSelected === 'dreamer' ? 'DRM' : 'REV'}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-200">
                            {personaSelected === 'architect' ? 'The Pragmatic Architect' :
                             personaSelected === 'dreamer' ? 'The Creative Dreamer' : 'The Cynical Code Reviewer'}
                          </div>
                          <div className="text-[9px] text-slate-400">Adaptive Dialogue Loop Active</div>
                        </div>
                      </div>

                      {/* Conversation lines */}
                      <div className="my-4 flex flex-col gap-2.5 text-left">
                        <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-xs text-slate-300">
                          <span className="text-[9px] font-bold text-cyan-400 block mb-0.5">User:</span>
                          How can we integrate this customizer into other apps safely?
                        </div>

                        <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-xs text-slate-300">
                          <span className="text-[9px] font-bold text-indigo-400 block mb-0.5 capitalize">
                            {personaSelected}:
                          </span>
                          {personaSelected === 'architect' && personaLanguage === 'formal' && (
                            "We must establish a clear modular contract. All settings (such as radii or density variables) should be serialized to a JSON state schema, then safely ingested by target components through standard React Context parameters."
                          )}
                          {personaSelected === 'architect' && personaLanguage === 'poetic' && (
                            "We lay down silent gridlines, clean and proud. Variables drift like quiet summer clouds, finding their home in standard context trees, where layout structures rest in perfect peace."
                          )}
                          {personaSelected === 'architect' && personaLanguage === 'sarcastic' && (
                            "Well, you could just pass 50 individual state parameters manually. Or, you know, use a clean serialized JSON file like an actual professional, preventing your component from looking like complete spaghetti."
                          )}

                          {personaSelected === 'dreamer' && personaLanguage === 'formal' && (
                            "This system opens up infinite pathways for customized, expressive interfaces. We allow the app to dream, adapting its visual heartbeat with ambient glows and fluid border vectors based on emotional states."
                          )}
                          {personaSelected === 'dreamer' && personaLanguage === 'poetic' && (
                            "Whispering pixels wake up from their sleep. High-frequency pink vectors drift across the screen, painting warm memories of twilight. The customizer breathes; the code begins to live."
                          )}
                          {personaSelected === 'dreamer' && personaLanguage === 'sarcastic' && (
                            "Oh, sure, let's add more glowing gradient circles. Users will definitely love a website that behaves like a colorful disco ball instead of doing actual productive coding."
                          )}

                          {personaSelected === 'reviewer' && personaLanguage === 'formal' && (
                            "While customizer features look flashy, they introduce critical rendering overhead. We must aggressively memoize all computed style trees to avoid triggering infinite re-render loops on rapid value updates."
                          )}
                          {personaSelected === 'reviewer' && personaLanguage === 'poetic' && (
                            "A heavy rendering shadow hides the light. Styles change too quickly in the deep of night. Guard against infinite re-renders with tight keys, lest your page freeze in a silent breeze."
                          )}
                          {personaSelected === 'reviewer' && personaLanguage === 'sarcastic' && (
                            "Congratulations, you built a slider. Now try running a linter or checking your heap usage. I can already hear the garbage collector gasping for oxygen."
                          )}
                        </div>
                      </div>

                      {/* Footer info */}
                      <div className="text-[9px] text-slate-500 text-left border-t border-white/5 pt-2">
                        Accent Hue: <span className="text-indigo-400 font-mono">#{
                          personaSelected === 'architect' ? '06b6d4' :
                          personaSelected === 'dreamer' ? 'ec4899' : 'f59e0b'
                        }</span> • Delay: <span className="text-indigo-400 font-mono">15ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
