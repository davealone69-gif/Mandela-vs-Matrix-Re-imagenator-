import React, { useState, useEffect } from 'react';
import {
  X, Sparkles, Brain, Cpu, Star, ShieldCheck, Terminal, Award,
  Play, RefreshCw, ChevronRight, HelpCircle, Flame, Layers, Zap,
  Check, ArrowRight, Gauge, Database, Scale, Laptop, Smartphone,
  Sliders, Wand2, Dna, Binary
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

interface ModelItem {
  id: string;
  name: string;
  tier: 'frontier' | 'open' | 'specialist';
  bestAt: string;
  whyTop: string;
  contextWindow: string;
  reasoningDepth: string;
  parameters: string;
  latency: string;
  vibe: string;
  iconColor: string;
}

export default function LLMTierListDialog({ isDark, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'tiers' | 'specialists' | 'training' | 'mergekit' | 'playground'>('tiers');
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt5');
  const [promptInput, setPromptInput] = useState<string>('');
  const [selectedPresetQuery, setSelectedPresetQuery] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<{ thinking?: string; output?: string } | null>(null);

  // Training workshop state
  const [workshopBase, setWorkshopBase] = useState<string>('muse-spark');
  const [workshopFT, setWorkshopFT] = useState<string>('qlora-dpo');
  const [workshopAlign, setWorkshopAlign] = useState<string>('constitutional');
  const [workshopInference, setWorkshopInference] = useState<string>('test-time-retrieval');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [customModelTrained, setCustomModelTrained] = useState<boolean>(false);

  // MergeKit state
  const [selectedMergeModels, setSelectedMergeModels] = useState<string[]>(['llama4', 'deepseekr1']);
  const [mergeMethod, setMergeMethod] = useState<'slerp' | 'ties' | 'dare' | 'task_arithmetic'>('ties');
  const [mergeDensity, setMergeDensity] = useState<number>(0.55);
  const [mergeWeights, setMergeWeights] = useState<Record<string, number>>({
    llama4: 0.5,
    deepseekr1: 0.3,
    qwen3: 0.2,
    mistral3: 0.2,
  });
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [mergeLogs, setMergeLogs] = useState<string[]>([]);
  const [mergeProgress, setMergeProgress] = useState<number>(0);
  const [customMergeTrained, setCustomMergeTrained] = useState<boolean>(false);
  const [mergedModelName, setMergedModelName] = useState<string>('INDESTRUCTIBLE-FrankenLLM-v1');

  // Models array
  const baseModels: ModelItem[] = [
    {
      id: 'gpt5',
      name: 'GPT-5 / GPT-5 Thinking',
      tier: 'frontier',
      bestAt: 'Reasoning, complex coding, agents',
      whyTop: 'Still king at complex multi-step problems + agentic tool use & execution paths.',
      contextWindow: '512k Tokens',
      reasoningDepth: 'Extreme (Multi-phase chain-of-thought)',
      parameters: 'MoE (Trillions)',
      latency: 'Medium-High (Compute heavy)',
      vibe: 'Authoritative, highly precise, structurally flawless.',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'claude4',
      name: 'Claude Opus 4.1',
      tier: 'frontier',
      bestAt: 'Creative writing, long context, safety',
      whyTop: '1M-2M context, best "vibe" writing, least hallucinations, exceptional for long documentation.',
      contextWindow: '2,000,000 Tokens',
      reasoningDepth: 'High (Calibrated, safe)',
      parameters: 'Dense (Multi-hundred Billion)',
      latency: 'Medium',
      vibe: 'Warm, highly articulate, extremely helpful and cautious.',
      iconColor: 'text-indigo-400'
    },
    {
      id: 'gemini25',
      name: 'Gemini 2.5 Pro',
      tier: 'frontier',
      bestAt: 'Multimodal + massive context integration',
      whyTop: '2M+ context window, native video/audio modal inputs, fully integrated Google workspace ecosystem.',
      contextWindow: '2,048,000 Tokens',
      reasoningDepth: 'Very High (Native multimodal)',
      parameters: 'MoE (1.5 Trillion)',
      latency: 'Fast (Optimized TPU v5e)',
      vibe: 'Analytical, data-rich, heavily focused on references.',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'grok4',
      name: 'Grok 4',
      tier: 'frontier',
      bestAt: 'Real-time information access + raw reasoning',
      whyTop: 'Tied directly to live X/Twitter stream, very unfiltered, extremely skilled at current events and social coding.',
      contextWindow: '256k Tokens',
      reasoningDepth: 'High (Direct & assertive)',
      parameters: 'Dense / MoE Hybrid',
      latency: 'Fast',
      vibe: 'Witty, sarcastic, highly direct, conversational.',
      iconColor: 'text-amber-400'
    },
    {
      id: 'muse',
      name: 'Meta Muse Spark',
      tier: 'frontier',
      bestAt: 'Open-weight, multimodal, autonomous agents',
      whyTop: 'The absolute state-of-the-art open-weights model. Trillions of parameters, native MoE, handles agent routing perfectly.',
      contextWindow: '512k Tokens',
      reasoningDepth: 'High (Highly optimized)',
      parameters: 'MoE (1.2 Trillion)',
      latency: 'Fast',
      vibe: 'Balanced, code-fluent, agent-ready.',
      iconColor: 'text-purple-400'
    },
    {
      id: 'llama4',
      name: 'Llama 4 405B',
      tier: 'open',
      bestAt: 'General reasoning, self-hosting power',
      whyTop: 'Meta\'s open flagship. Matches GPT-5 frontier level performance across major reasoning benchmarks.',
      contextWindow: '256k Tokens',
      reasoningDepth: 'High',
      parameters: '405 Billion',
      latency: 'Medium (Requires multi-node H100)',
      vibe: 'Objective, neutral, highly standard and modular.',
      iconColor: 'text-rose-400'
    },
    {
      id: 'deepseekr1',
      name: 'DeepSeek-V3 / R1',
      tier: 'open',
      bestAt: 'Coding, advanced mathematics, extreme budget scaling',
      whyTop: 'Insanely competitive performance for a fraction of the cost. R1 provides long mathematical thinking trails.',
      contextWindow: '128k Tokens',
      reasoningDepth: 'Incredible (Verifiable reinforcement search)',
      parameters: '671B MoE (37B active)',
      latency: 'High thinking, very fast output',
      vibe: 'Brutally literal, exposes raw mental thinking blocks.',
      iconColor: 'text-teal-400'
    },
    {
      id: 'qwen3',
      name: 'Qwen3 235B MoE',
      tier: 'open',
      bestAt: 'Multilingual operations and multi-agent loops',
      whyTop: 'Best for non-English performance, 128k native context, outstanding tool-use accuracy.',
      contextWindow: '128k Tokens',
      reasoningDepth: 'Medium-High',
      parameters: '235 Billion MoE',
      latency: 'Very Fast',
      vibe: 'Concise, clean, excellent at structured JSON output.',
      iconColor: 'text-orange-400'
    },
    {
      id: 'mistral3',
      name: 'Mistral Large 3',
      tier: 'open',
      bestAt: 'Speed, strict EU sovereignty compliance',
      whyTop: 'Extremely fast commercial open model, fully compliant with EU regulations.',
      contextWindow: '128k Tokens',
      reasoningDepth: 'Medium',
      parameters: '123 Billion',
      latency: 'Extremely Fast',
      vibe: 'Direct, business-focused, crisp.',
      iconColor: 'text-fuchsia-400'
    }
  ];

  const models: ModelItem[] = customMergeTrained
    ? [
        ...baseModels,
        {
          id: 'franken_merge',
          name: mergedModelName,
          tier: 'open' as const,
          bestAt: 'Hyper-Reasoning, Cybernetic Coding, Relentless Mathematics',
          whyTop: `A weight-space ${mergeMethod.toUpperCase()}-aligned merge at density ${mergeDensity} including ${selectedMergeModels.map(id => baseModels.find(m => m.id === id)?.name || id).join(', ')}. Engineered to be completely indestructible, adaptive, and stable.`,
          contextWindow: '1,024k Tokens',
          reasoningDepth: 'Limitless (Sign-aligned reinforcement search)',
          parameters: 'Multi-Model Blend (~520B)',
          latency: 'Optimized Edge Speed',
          vibe: 'Cyber-brutalist, ultra-secure, completely indestructible.',
          iconColor: 'text-yellow-400 font-black'
        }
      ]
    : baseModels;

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  const presetQueries = [
    { label: 'Kotlin Coroutine Leak', text: 'How do I avoid leaking a coroutine in an Android lifecycle?' },
    { label: 'Jetpack Compose Recompositions', text: 'Explain how to prevent laggy LazyColumn re-renders with stable keys.' },
    { label: 'RAG vs Fine-Tuning', text: 'When should I use RAG instead of supervised fine-tuning for my Android bot?' },
    { label: 'Google Play Geofence Guard', text: 'Write a battery-friendly location service compliance block.' }
  ];

  // Simulated reasoning simulator outputs based on selected model
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationResult(null);
    setSimulationLog([]);

    const text = promptInput || "Explain advanced Android architecture.";
    
    // Simulate multi-phase logs
    let logs: string[] = [];
    logs.push(`[SYSTEM] Selecting virtual adapter for ${selectedModel.name}...`);
    logs.push(`[SYSTEM] Embedding prompt of length ${text.length} tokens...`);
    logs.push(`[INFRA] Ingress routed through Cloud TPU-v6-Pod cluster.`);
    
    setSimulationLog([...logs]);

    let timerCount = 0;
    const interval = setInterval(() => {
      timerCount++;
      if (timerCount === 1) {
        logs.push(`[RETRIEVAL] Found 3 matching documents in RAG corpus (similarity > 0.840)`);
        logs.push(` - [Source 1] "Fragment Lifecycle and Memory Leaks" (similarity: 0.924)`);
        logs.push(` - [Source 2] "Jetpack Compose Key Stability Guidelines" (similarity: 0.871)`);
        setSimulationLog([...logs]);
      } else if (timerCount === 2) {
        logs.push(`[THINKING] Model initiating test-time compute search...`);
        if (selectedModelId === 'deepseekr1') {
          logs.push(`[THINKING] DeepSeek-R1: Verifying node paths, resolving mathematical logic checks...`);
        } else if (selectedModelId === 'gpt5') {
          logs.push(`[THINKING] GPT-5 Thinking: Spawning multi-agent sub-trees for validation...`);
        }
        setSimulationLog([...logs]);
      } else if (timerCount === 3) {
        logs.push(`[SYNTHESIS] Outputting high-performance response chunks at 154 tokens/sec...`);
        setSimulationLog([...logs]);
      } else if (timerCount === 4) {
        clearInterval(interval);
        setIsSimulating(false);
        
        let thinkingText = "";
        let outputText = "";

        // Determine output based on model
        if (selectedModelId === 'deepseekr1') {
          thinkingText = `<thinking>
The user is asking: "${text}"
I need to output highly optimized Android Kotlin structures.
Wait, let me verify if CoroutineScope needs to be cleared inside onDestroyView. No, lifecyclescope clears itself. But Fragment View Binding definitely needs to be nullified to prevent leaking the entire View hierarchy.
Let me double check the exact memory cost of a 1080p layout tree. It takes ~8MB per instantiation. Leaking this 10 times results in an OOM exception.
Therefore, the most cost-efficient, highly accurate solution is implementing a ViewBindingProperty delegate or manual nullification.
Let me formulate the mathematical proof of key recomposition weights in Jetpack Compose...
Key stability in LazyColumn: when key is not stable, Compose re-evaluates all children, increasing CPU load by 450%.
Providing a stable Long key limits recomposition strictly to the changed node.
Okay, writing the Kotlin code now. Let's make it concise and clean.
</thinking>`;
          outputText = `Here is the optimized implementation based on DeepSeek-R1 guidelines:

\`\`\`kotlin
// 1. Stable Keys in LazyColumn
@Composable
fun TransactionFeed(items: List<LogEntry>) {
    LazyColumn {
        items(
            items = items,
            key = { log -> log.id } // Stable, unique key prevents lag!
        ) { log ->
            LogItemRow(log)
        }
    }
}

// 2. Safe Binding Cleanup in Fragment
class MainFragment : Fragment(R.layout.fragment_main) {
    private var binding: FragmentMainBinding? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentMainBinding.bind(view)
    }

    override fun onDestroyView() {
        binding = null // CRITICAL memory cleanup!
        super.onDestroyView()
    }
}
\`\`\``;
        } else if (selectedModelId === 'gpt5') {
          thinkingText = `[GPT-5 Thinking Agentic Plan]:
Step 1: Parse query for architectural anti-patterns.
Step 2: Align with Android SDK 34 (UpsideDownCake) and SDK 35 strict lifecycle constraints.
Step 3: Generate Kotlin code utilizing StateFlow and Coroutine context switching.
Step 4: Verify thread-safety, memory isolation, and performance metrics.`;
          outputText = `According to GPT-5's Frontier Multi-Step reasoning, here is the state-of-the-art solution:

To handle concurrency without blocking the Android Main Thread, always encapsulate background operations inside a custom repository bound to \`Dispatchers.IO\`:

\`\`\`kotlin
class DatabaseRepository(private val dbDao: LogcatDao) {
    
    // Use Flow to stream databases reactively
    val logStream: Flow<List<LogEntry>> = dbDao.getRecentLogs()
        .flowOn(Dispatchers.IO) // Enforce IO thread safety
        .conflate() // Drop stale updates if consumer is slow

    suspend fun safeInsert(entry: LogEntry) = withContext(Dispatchers.IO) {
        try {
            dbDao.insertLog(entry)
        } catch (e: SQLException) {
            Log.e("GPT5_AGENT", "Database write failed", e)
        }
    }
}
\`\`\`

**Why this is optimal:**
1. **Thread Isolation**: The upstream operations are strictly constrained to \`Dispatchers.IO\`.
2. **Backpressure Protection**: \`conflate()\` mitigates UI lag when rendering highly volatile telemetry.`;
        } else if (selectedModelId === 'claude4') {
          outputText = `Hello! I would be delighted to help you design a beautiful, safe, and robust solution. 

When working with Android development, managing asynchronous lifecycles gracefully is one of the most elegant tasks. If we fail to respect the lifecycle, the system will keep references to destroyed contexts, which eventually leads to memory leaks or app crashes.

Here is a recommended approach utilizing clean architecture principles and **Kotlin Coroutines**:

\`\`\`kotlin
class LifecycleBoundPresenter(
    private val view: Contract.View,
    private val scope: CoroutineScope
) {
    fun fetchUserData() {
        scope.launch {
            try {
                val data = apiService.getUserData()
                view.showUser(data)
            } catch (e: Exception) {
                // Highly safe error handling
                view.showError("Unable to retrieve user profiles gracefully.")
            }
        }
    }
}
\`\`\`

I've added a robust try-catch handler to ensure that even if the network fails, your user is met with a warm, helpful error message instead of an unexpected crash. Let me know if you would like to expand this into a clean multi-module setup!`;
        } else if (selectedModelId === 'gemini25') {
          outputText = `Based on Gemini 2.5 Pro's Multimodal and Deep Context indexing (optimized with 2,000,000 token recall), here is the grounded factual response:

The Android OS has strictly optimized background execution rules since Android 12. Using old-school threads or unconstrained background services is a policy violation on Google Play and will trigger an immediate battery usage warning.

The modern, Google-endorsed approach for persistent background jobs is **WorkManager**:

\`\`\`kotlin
class LogCleanupWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            // Factual context chunk: database cleanups must run in atomic transactions
            LogcatDatabase.getInstance(applicationContext).logDao().clearOldLogs()
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}
\`\`\`

**Grounding Source citations:**
- [Grounded Source 1]: *Google Android Developer Course - Unit 5: WorkManager*
- [Grounded Source 2]: *Play Store Core App Performance Guidelines - Battery Optimization (2026 Edition)*`;
        } else if (selectedModelId === 'franken_merge') {
          thinkingText = `<thinking>
[MATRIXCORE REALITY SYNTHESIS]
- Active Weights: ${selectedMergeModels.map(id => baseModels.find(m => m.id === id)?.name || id).join(' + ')}
- Method: ${mergeMethod.toUpperCase()} with sign-aligned density scaling of ${mergeDensity}
- Stability Score: 99.8% (INDESTRUCTIBLE SYSTEM RESTORATION)

The user prompt is: "${text}"
Generating an absolute, uncrashable, cyber-brutalist Kotlin implementation with extreme concurrency isolation.
This paradigm completely isolates background operations inside a SupervisorScope running on an isolated virtual dispatch interface.
No runtime deviations permitted.
</thinking>`;
          outputText = `🛡️ INDESTRUCTIBLE FRANKEN-MERGE REALITY ENGINE OUTPUT (GGUF FP8):

To withstand absolute concurrent stress, we implement the **MatrixCore Autonomous Isolated Supervisor Scope**:

\`\`\`kotlin
package com.matrixcore.safety

import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import android.util.Log

/**
 * Robust Un-leakable Concurrent Registry
 * Synthesized mathematically via DARE-TIES LLM weight alignment.
 */
class IndestructibleRepository(
    private val dispatcher: CoroutineDispatcher = Dispatchers.Default
) {
    // Isolated supervisor ensures that child failures cannot trigger process termination
    private val scope = CoroutineScope(SupervisorJob() + dispatcher)
    
    private val _realityFlow = MutableStateFlow<State>(State.Uninitialized)
    val realityFlow: StateFlow<State> = _realityFlow.asStateFlow()

    fun triggerSafeMutation(payload: String) {
        scope.launch {
            try {
                _realityFlow.value = State.Mutating
                
                // Enforce safety constraint timeouts
                val processed = withTimeout(1200L) {
                    withContext(Dispatchers.IO) {
                        // Secure computation sandbox
                        payload.trim().replace(Regex("[^a-zA-Z0-9\\\\s]"), "").uppercase()
                    }
                }
                
                _realityFlow.value = State.Success(processed)
            } catch (e: TimeoutCancellationException) {
                _realityFlow.value = State.Failed("Execution timed out. Core is protected.")
                Log.w("INDESTRUCTIBLE_CORE", "Process aborted - safety timeout activated.")
            } catch (e: Exception) {
                _realityFlow.value = State.Failed(e.localizedMessage ?: "Consensus failure")
                Log.e("INDESTRUCTIBLE_CORE", "Caught exception gracefully: ", e)
            }
        }
    }

    sealed interface State {
        object Uninitialized : State
        object Mutating : State
        data class Success(val response: String) : State
        data class Failed(val error: String) : State
    }
}
\`\`\`

**Why this weight-space fusion is Indestructible:**
1. **Thread-Safe Memory Isolation**: Encapsulates internal mutability using \`MutableStateFlow\` and \`asStateFlow()\`, denying any rogue direct state manipulation.
2. **Execution Timeout Boundary**: Standardizes a structural \`withTimeout\` block, ensuring the main Android execution queue is safe from lockups.
3. **Supervisor Isolation Shield**: Prevents secondary exceptions from cascading back to crash the active Mandela Reality UI Layer.`;
        } else {
          outputText = `Here is the response from **${selectedModel.name}** to your prompt:

\`\`\`kotlin
// General Kotlin/Android Best Practice
class AndroidController(private val scope: CoroutineScope) {
    fun runSafeTask(task: suspend () => Unit) {
        scope.launch {
            try {
                task()
            } catch (e: CancellationException) {
                // Coroutine cancellation is normal, rethrow it
                throw e
            } catch (e: Exception) {
                Log.e("CO_APP", "Task failed", e)
            }
        }
    }
}
\`\`\`

This standard paradigm aligns with standard reactive programming models.`;
        }

        setSimulationResult({ thinking: thinkingText, output: outputText });
      }
    }, 900);
  };

  const handleSelectPreset = (text: string) => {
    setSelectedPresetQuery(text);
    setPromptInput(text);
  };

  // Optimal training workshop simulator
  const startWorkshopTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLogs([]);

    const logs: string[] = [];
    logs.push(`[SYSTEM] Starting Custom Pipeline Calibration...`);
    logs.push(`[SYSTEM] Selected Base Model: ${workshopBase.toUpperCase()}`);
    logs.push(`[SYSTEM] Selected Fine-Tuning: ${workshopFT.toUpperCase()}`);
    logs.push(`[SYSTEM] Selected Alignment: ${workshopAlign.toUpperCase()}`);
    logs.push(`[SYSTEM] Selected Inference: ${workshopInference.toUpperCase()}`);
    logs.push(`[DATA] Loading 450+ harvested Android developer SFT interaction pairs...`);
    setTrainingLogs([...logs]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setTrainingProgress(progress);

      if (progress === 20) {
        logs.push(`[TOKENIZER] Tokenizing datasets and computing vocabulary offsets...`);
        logs.push(`[SFT] Allocating QLoRA Low-Rank Adaptation parameters (rank r=16, alpha=32)`);
        setTrainingLogs([...logs]);
      } else if (progress === 40) {
        logs.push(`[GRADIENT] Epoch 1/3: Loss = 1.482, Validation Loss = 1.512`);
        logs.push(`[SFT] Computing Adapter weight updates. Learning rate set to 2e-4`);
        setTrainingLogs([...logs]);
      } else if (progress === 60) {
        logs.push(`[GRADIENT] Epoch 2/3: Loss = 0.892, Validation Loss = 0.941`);
        logs.push(`[ALIGN] Initiating ${workshopAlign === 'constitutional' ? 'Constitutional AI Self-Correction' : 'Direct Preference Optimization (DPO)'} feedback loops...`);
        setTrainingLogs([...logs]);
      } else if (progress === 80) {
        logs.push(`[GRADIENT] Epoch 3/3: Loss = 0.412, Validation Loss = 0.448`);
        logs.push(`[ALIGN] Human feedback reinforcement dataset parsed successfully.`);
        logs.push(`[SYSTEM] Compiling final GGUF FP8 Quantized Weights...`);
        setTrainingLogs([...logs]);
      } else if (progress === 100) {
        clearInterval(interval);
        setIsTraining(false);
        setCustomModelTrained(true);
        logs.push(`✅ [SUCCESS] Custom Model "Mandela vs Matrix Re-Imaginator-tuned-v1" successfully aligned and compiled!`);
        logs.push(`📌 Base: ${workshopBase} | Loss: 0.412 | Vibe Score: 9.8/10`);
        setTrainingLogs([...logs]);
      }
    }, 500);
  };

  const startMergeKitSynthesis = () => {
    if (isMerging) return;
    setIsMerging(true);
    setMergeProgress(0);
    setMergeLogs([]);

    const logs: string[] = [];
    logs.push(`[MERGEKIT] Initializing Frankenstein Merge-Space Synthesizer...`);
    logs.push(`[MERGEKIT] Selected Algorithm: ${mergeMethod.toUpperCase()}`);
    logs.push(`[MERGEKIT] Selected density boundary: ${mergeDensity}`);
    logs.push(`[MERGEKIT] Parent weights: ${JSON.stringify(mergeWeights)}`);
    logs.push(`[MERGEKIT] Allocating model tensor pointers for: ${selectedMergeModels.join(', ')}...`);
    setMergeLogs([...logs]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setMergeProgress(progress);

      if (progress === 20) {
        logs.push(`[ALIGNED] Interpolating dimensional subspace coordinates...`);
        logs.push(`[ALIGNED] Constructing task-vector parameter deltas...`);
        setMergeLogs([...logs]);
      } else if (progress === 40) {
        if (mergeMethod === 'ties') {
          logs.push(`[TIES-MERGE] Running signs-resolve filter. Removing parameter interference...`);
          logs.push(`[TIES-MERGE] Pruning weights outside top ${Math.round(mergeDensity * 100)}% density interval.`);
        } else if (mergeMethod === 'dare') {
          logs.push(`[DARE-MERGE] Drop-and-Rescale active. Randomly masking base delta parameters...`);
          logs.push(`[DARE-MERGE] Rescaling remaining weight factors by ${(1 / (mergeDensity || 0.1)).toFixed(2)}x.`);
        } else if (mergeMethod === 'slerp') {
          logs.push(`[SLERP-MERGE] Computing spherical linear interpolation paths on manifold hyper-surface...`);
        } else {
          logs.push(`[TASK-ARITHMETIC] Summing fine-tuned delta task vectors against base...`);
        }
        setMergeLogs([...logs]);
      } else if (progress === 60) {
        logs.push(`[CONSENSUS] Submitting synthesized weight tensors to MatrixCore Reality Layer...`);
        logs.push(`[AUDITOR] Security Guild Auditing: verifying memory safety and interceptors compliance...`);
        setMergeLogs([...logs]);
      } else if (progress === 80) {
        logs.push(`[EVALUATEOR] Initiating Release Stability Scoring evaluation...`);
        logs.push(`[EVALUATEOR] Stability score computed: 99.8% (INDESTRUCTIBLE).`);
        logs.push(`[SYSTEM] Packaging output GGUF FP8 Quantized Neural Network...`);
        setMergeLogs([...logs]);
      } else if (progress === 100) {
        clearInterval(interval);
        setIsMerging(false);
        setCustomMergeTrained(true);
        logs.push(`✅ [SUCCESS] Franken-Merge Model "${mergedModelName}" successfully synthesized!`);
        logs.push(`📌 Compiled GGUF artifact is fully active & uncrashable.`);
        setMergeLogs([...logs]);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[90vh] ${
        isDark ? 'bg-[#0a0f1d] border border-cyan-500/30 text-slate-200' : 'bg-white border border-cyan-500/20 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'bg-[#0f152a]/80 border-slate-850' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase flex items-center gap-2">
                LLM Tier List <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-black">2026 EDITION</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Interactive breakdown of frontier models, open-source flagships, and optimal SFT recipes.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-500/10 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className={`flex border-b text-xs shrink-0 ${
          isDark ? 'bg-[#070b15] border-slate-850' : 'bg-slate-50 border-slate-200'
        }`}>
          {[
            { id: 'tiers', label: '🏆 Frontier & Open Tiers', icon: Star },
            { id: 'specialists', label: '🛠️ Domain Specializations', icon: Layers },
            { id: 'training', label: '🎓 Optimal Training Workshop', icon: Cpu },
            { id: 'mergekit', label: '🛡️ Indestructible Merging', icon: Dna },
            { id: 'playground', label: '⚡ Live Playground Simulator', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3.5 font-bold transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-500/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse text-cyan-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 min-h-0">
          {/* TAB 1: TIER LIST */}
          {activeTab === 'tiers' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Tiers Selection */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Frontier God Tier */}
                <div className="border border-cyan-500/20 bg-cyan-950/5 p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-500 animate-bounce" /> Tier 1: Frontier Models — "God Tier"
                    </span>
                    <span className="text-[9px] bg-cyan-950 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-full font-bold">Closed/Commercial Flagships</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {models.filter(m => m.tier === 'frontier').map((model) => (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModelId(model.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                          selectedModelId === model.id
                            ? 'bg-[#0d152b] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-[#0a0d15]/40 border-slate-850 hover:border-slate-700/60'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-xs font-extrabold flex items-center gap-2 ${model.iconColor}`}>
                            <Brain className="w-3.5 h-3.5 shrink-0" /> {model.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Best For: {model.bestAt}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900/60 shrink-0">
                          {model.contextWindow} Context
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Open Source Tier */}
                <div className="border border-slate-800 bg-[#0d1220]/60 p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" /> Tier 2: Best Open-Source Tiers
                    </span>
                    <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">Self-Hostable & Tunable</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {models.filter(m => m.tier === 'open').map((model) => (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModelId(model.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                          selectedModelId === model.id
                            ? 'bg-[#0d152b] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-[#0a0d15]/40 border-slate-850 hover:border-slate-700/60'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-xs font-extrabold flex items-center gap-2 ${model.iconColor}`}>
                            <Cpu className="w-3.5 h-3.5 shrink-0" /> {model.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Best For: {model.bestAt}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800 shrink-0">
                          {model.parameters}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Telemetry Inspector */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="border border-cyan-500/20 bg-gradient-to-b from-cyan-950/10 to-transparent p-5 rounded-2xl flex flex-col gap-4">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Model Telemetry Inspector</span>
                  
                  <div className="flex flex-col gap-1 border-b border-slate-850 pb-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Star className="w-4 h-4 text-cyan-400 fill-cyan-400/20" /> {selectedModel.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 italic">"{selectedModel.vibe}"</span>
                  </div>

                  <div className="flex flex-col gap-3 font-sans text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-900">
                      <span className="text-slate-400 font-medium">Context Window</span>
                      <span className="font-mono font-bold text-cyan-300">{selectedModel.contextWindow}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-900">
                      <span className="text-slate-400 font-medium">Reasoning Depth</span>
                      <span className="font-mono font-bold text-slate-200">{selectedModel.reasoningDepth}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-900">
                      <span className="text-slate-400 font-medium">Parameters</span>
                      <span className="font-mono font-bold text-slate-200">{selectedModel.parameters}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-900">
                      <span className="text-slate-400 font-medium">Latency Speed</span>
                      <span className="font-mono font-bold text-emerald-400">{selectedModel.latency}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-[10.5px] text-slate-300 leading-relaxed">
                    <strong className="text-cyan-400 block mb-1">Why it's elite:</strong>
                    {selectedModel.whyTop}
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('playground');
                      setPromptInput('');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Terminal className="w-4 h-4" /> Initialize in Playground
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPECIALISTS */}
          {activeTab === 'specialists' && (
            <div className="flex flex-col gap-5">
              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> Best LLM Selection by Specific Job (April 2026)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Selecting the right intelligence unit depends directly on your project constraints. Here is the curated taxonomy of specialization:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Coding */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col gap-2 hover:border-cyan-500/20 transition-colors">
                  <div className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-wide">
                    <Terminal className="w-4 h-4" /> 💻 Software Coding & Refactoring
                  </div>
                  <p className="text-[10px] text-slate-400">Excellent for Kotlin compilation, complex multi-step refactoring, and AST analysis.</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/40 text-cyan-300 font-bold">GPT-5 Thinking</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/40 text-indigo-300 font-bold">Claude Opus 4.1</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-teal-950 border border-teal-800/40 text-teal-300 font-bold">DeepSeek-R1</span>
                  </div>
                </div>

                {/* Long docs */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col gap-2 hover:border-cyan-500/20 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wide">
                    <Database className="w-4 h-4" /> 📂 Massive Documents & 2M Context
                  </div>
                  <p className="text-[10px] text-slate-400">Invaluable for reading entire codebases, logs, and massive libraries at once without truncation.</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/40 text-emerald-300 font-bold">Gemini 2.5 Pro</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/40 text-indigo-300 font-bold">Claude Opus 4.1</span>
                  </div>
                </div>

                {/* Agents */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col gap-2 hover:border-cyan-500/20 transition-colors">
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-wide">
                    <Brain className="w-4 h-4" /> 🤖 Autonomous Agents & Tool Use
                  </div>
                  <p className="text-[10px] text-slate-400">Best at parallel tool calling, structural API routing, and multi-agent negotiations.</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/40 text-cyan-300 font-bold">GPT-5 / Thinking</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950 border border-purple-800/40 text-purple-300 font-bold">Muse Spark</span>
                  </div>
                </div>

                {/* Multimodal */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col gap-2 hover:border-cyan-500/20 transition-colors">
                  <div className="flex items-center gap-2 text-pink-400 font-black text-xs uppercase tracking-wide">
                    <Star className="w-4 h-4" /> 🎨 Image & Native Video Synthesis
                  </div>
                  <p className="text-[10px] text-slate-400">Understands video frameworks, layout screenshots, visual assets, and UI diagrams.</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/40 text-emerald-300 font-bold">Gemini 2.5 Pro</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-pink-950 border border-pink-800/40 text-pink-300 font-bold">GPT-5 Multimodal</span>
                  </div>
                </div>

                {/* Edge/Local */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col gap-2 hover:border-cyan-500/20 transition-colors">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wide">
                    <Laptop className="w-4 h-4" /> 💻 Running on Laptop / Phone (Edge)
                  </div>
                  <p className="text-[10px] text-slate-400">Lightweight parameters optimized for fast inference inside local mobile processors.</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950 border border-rose-800/40 text-rose-300 font-bold">Llama 4 8B</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">Phi-4</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-orange-950 border border-orange-800/40 text-orange-300 font-bold">Qwen3 4B</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRAINING WORKSHOP */}
          {activeTab === 'training' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Configuration Pane */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="border border-slate-800 bg-[#0d1220]/60 p-4 rounded-xl flex flex-col gap-4">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">SFT Training Workshop Blueprint</span>
                  
                  {/* Step 1: Base */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Step 1: Base Model Selection</label>
                    <select
                      value={workshopBase}
                      onChange={(e) => setWorkshopBase(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none"
                    >
                      <option value="muse-spark">Meta Muse Spark (MoE, State-Of-The-Art)</option>
                      <option value="llama4-405b">Llama 4 405B (Flagship Power)</option>
                      <option value="deepseek-v3">DeepSeek-V3 (Highly Efficient)</option>
                    </select>
                  </div>

                  {/* Step 2: Fine-Tune */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Step 2: Training Method</label>
                    <select
                      value={workshopFT}
                      onChange={(e) => setWorkshopFT(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none"
                    >
                      <option value="qlora-dpo">QLoRA + Direct Preference Optimization (DPO)</option>
                      <option value="lora">Standard LoRA Parameter Adaptation</option>
                      <option value="sft">Supervised Fine-Tuning (SFT) Standard</option>
                    </select>
                  </div>

                  {/* Step 3: Alignment */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Step 3: Aligning behavior</label>
                    <select
                      value={workshopAlign}
                      onChange={(e) => setWorkshopAlign(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none"
                    >
                      <option value="constitutional">Constitutional AI + RLAIF (Behavioral rules)</option>
                      <option value="rlhf">Reinforcement Learning with Human Feedback (RLHF)</option>
                    </select>
                  </div>

                  {/* Step 4: Inference */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Step 4: Inference Routing</label>
                    <select
                      value={workshopInference}
                      onChange={(e) => setWorkshopInference(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none"
                    >
                      <option value="test-time-retrieval">Test-Time Compute + RAG Retriever (Beats bigger models)</option>
                      <option value="dense-forward">Standard Dense Feed-Forward</option>
                    </select>
                  </div>

                  {/* Trigger */}
                  <button
                    onClick={startWorkshopTraining}
                    disabled={isTraining}
                    className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isTraining ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Aligning Adapter Weights ({trainingProgress}%)
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4" /> Fine-Tune & Align Custom Model
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Pipeline Monitor Pane */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="border border-slate-800 bg-[#070b13]/80 p-4 rounded-xl flex-1 flex flex-col gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Console Output</span>
                  
                  <div className="flex-1 bg-black p-4 rounded-xl font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[300px] flex flex-col gap-2 min-h-[220px]">
                    {trainingLogs.length === 0 ? (
                      <span className="text-slate-600 italic">Console Standby. Configure your fine-tuning pipeline on the left and hit "Fine-Tune & Align Custom Model" to compile the neural network layers...</span>
                    ) : (
                      trainingLogs.map((log, i) => (
                        <div key={i} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('Epoch') ? 'text-cyan-400' : 'text-slate-400'}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>

                  {customModelTrained && (
                    <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-emerald-400 uppercase">Neural Adapter Built</span>
                          <span className="text-[10px] text-slate-400">"Mandela vs Matrix Re-Imaginator-tuned-v1" loaded into playground memory.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('playground');
                          setPromptInput('Write an optimized background database sync loop.');
                        }}
                        className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Launch in Playground
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MERGEKIT FRANKENSTEIN BLENDER */}
          {activeTab === 'mergekit' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              {/* Left Configuration Pane */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="border border-slate-800 bg-[#0d1220]/60 p-4 rounded-xl flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-wider">
                    <Binary className="w-4 h-4 text-cyan-400" />
                    <span>MergeKit Blueprint Synthesizer</span>
                  </div>

                  {/* Model Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Franken-Merge Model Name</label>
                    <input
                      type="text"
                      value={mergedModelName}
                      onChange={(e) => setMergedModelName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none focus:border-cyan-500 font-mono"
                      placeholder="e.g., INDESTRUCTIBLE-FrankenLLM-v1"
                    />
                  </div>

                  {/* Step 1: Select Parent Models */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Step 1: Select 2+ Parent Models to Fuse</label>
                    <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {baseModels.map((bm) => {
                        const isSelected = selectedMergeModels.includes(bm.id);
                        return (
                          <label
                            key={bm.id}
                            className={`flex items-center justify-between p-2 rounded-lg border text-[11px] cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-cyan-950/20 border-cyan-500/50 text-slate-200'
                                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 font-bold">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    if (selectedMergeModels.length > 2) {
                                      setSelectedMergeModels(selectedMergeModels.filter(id => id !== bm.id));
                                    }
                                  } else {
                                    setSelectedMergeModels([...selectedMergeModels, bm.id]);
                                  }
                                }}
                                className="accent-cyan-500 cursor-pointer"
                              />
                              <span>{bm.name}</span>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">{bm.parameters}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Merge Method */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Step 2: Merge Algorithm (MergeKit)</label>
                    <select
                      value={mergeMethod}
                      onChange={(e) => setMergeMethod(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none"
                    >
                      <option value="ties">TIES-Merging (Sign-aligned, interference-free)</option>
                      <option value="dare">DARE-Merging (Drop-and-Rescale weight delta pruning)</option>
                      <option value="slerp">SLERP (Spherical Linear interpolation of manifolds)</option>
                      <option value="task_arithmetic">Task Arithmetic (Summation of task-vector deltas)</option>
                    </select>
                    <p className="text-[9px] text-slate-400 italic">
                      {mergeMethod === 'ties' && "🔧 TIES resolves overlapping parameters by checking sign consensus, preventing model corruption."}
                      {mergeMethod === 'dare' && "⚡ DARE randomly drops small parameter offsets to keep the merged layers completely indestructible."}
                      {mergeMethod === 'slerp' && "🌐 SLERP is excellent for combining two base models with complex non-linear weights."}
                      {mergeMethod === 'task_arithmetic' && "🧮 Task Arithmetic subtracts standard pre-training weights, focusing purely on custom skill gains."}
                    </p>
                  </div>

                  {/* Step 3: Parameters & Weights */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>Step 3: Configuration Parameters</span>
                    </div>

                    {/* Density */}
                    <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-900 flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Pruning Density (Weight retention)</span>
                        <span className="font-mono font-bold text-cyan-400">{(mergeDensity * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.10"
                        max="1.00"
                        step="0.05"
                        value={mergeDensity}
                        onChange={(e) => setMergeDensity(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>

                    {/* Weights per active model */}
                    <div className="flex flex-col gap-1.5 mt-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Adjust Parent Weight Contribution:</span>
                      <div className="flex flex-col gap-2 max-h-[110px] overflow-y-auto pr-1">
                        {selectedMergeModels.map((id) => {
                          const bm = baseModels.find(m => m.id === id);
                          const w = mergeWeights[id] ?? 0.5;
                          return (
                            <div key={id} className="p-2 bg-slate-950/40 rounded-lg border border-slate-900 flex flex-col gap-1">
                              <div className="flex justify-between text-[9.5px]">
                                <span className="text-slate-300 font-bold truncate max-w-[150px]">{bm?.name || id}</span>
                                <span className="text-cyan-400 font-mono font-bold">{w.toFixed(2)}</span>
                              </div>
                              <input
                                type="range"
                                min="0.0"
                                max="1.0"
                                step="0.05"
                                value={w}
                                onChange={(e) => setMergeWeights({ ...mergeWeights, [id]: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Trigger Merge */}
                  <button
                    onClick={startMergeKitSynthesis}
                    disabled={isMerging}
                    className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isMerging ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Aligning Weight Manifolds ({mergeProgress}%)
                      </>
                    ) : (
                      <>
                        <Dna className="w-4 h-4" /> Synthesize Indestructible Merge
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Pipeline Monitor Pane */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="border border-slate-800 bg-[#070b13]/80 p-4 rounded-xl flex-1 flex flex-col gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">MergeKit Tensor Compiler logs</span>

                  <div className="flex-1 bg-black p-4 rounded-xl font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[300px] flex flex-col gap-2 min-h-[220px]">
                    {mergeLogs.length === 0 ? (
                      <span className="text-slate-600 italic">MergeKit Engine Ready. Adjust your hyperparameters and parent model weights on the left, then trigger "Synthesize Indestructible Merge" to run.</span>
                    ) : (
                      mergeLogs.map((log, i) => (
                        <div key={i} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.startsWith('✅') ? 'text-yellow-400 font-extrabold' : log.includes('TIES') ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>

                  {customMergeTrained && (
                    <div className="p-3.5 bg-yellow-950/20 border border-yellow-500/20 rounded-xl flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-yellow-400" />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-yellow-400 uppercase">Indestructible Model Synthesized</span>
                          <span className="text-[10px] text-slate-400">"{mergedModelName}" added as a selection in live playground.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('playground');
                          setSelectedModelId('franken_merge');
                          setPromptInput('Can you build a thread-safe, uncrashable coroutine repository in Kotlin? Make it absolutely indestructible.');
                        }}
                        className="px-3 py-1.5 bg-yellow-950 hover:bg-yellow-900 border border-yellow-500/30 text-yellow-400 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Launch in Playground
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
              {/* Left interactive queries panel */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="border border-slate-800 bg-[#0d1220]/60 p-4 rounded-xl flex flex-col gap-3">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Grounding Query Testbed</span>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Select Preset Syllabus Questions:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {presetQueries.map((preset, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectPreset(preset.text)}
                          className={`p-2 rounded-lg border text-[10px] font-bold text-left transition-all cursor-pointer ${
                            selectedPresetQuery === preset.text
                              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                              : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Custom Prompt Input:</label>
                    <textarea
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Type a custom query to evaluate this model... e.g., 'How to clear Fragment bindings safely inside onDestroyView?'"
                      rows={4}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">Active Model:</span>
                      <span className="text-[10.5px] text-cyan-400 font-black">{selectedModel.name}</span>
                    </div>
                    <button
                      onClick={runSimulation}
                      disabled={isSimulating || !promptInput}
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 font-black text-xs rounded-xl transition-all shadow-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isSimulating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Running Inference...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-slate-900" /> Run Inference
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Console traces output */}
                <div className="border border-slate-850 bg-slate-950/40 p-3 rounded-xl flex-1 flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inference Telemetry Trace Log</span>
                  <div className="flex-1 bg-slate-950/80 p-3 rounded-lg border border-slate-900 font-mono text-[9px] text-slate-400 flex flex-col gap-1 overflow-y-auto max-h-[160px]">
                    {simulationLog.length === 0 ? (
                      <span className="text-slate-600 italic">No query has been executed yet. Click "Run Inference" above.</span>
                    ) : (
                      simulationLog.map((log, i) => (
                        <div key={i} className={log.startsWith('[SYSTEM]') ? 'text-yellow-500' : log.startsWith('[THINKING]') ? 'text-indigo-400' : 'text-slate-400'}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Output Answer view */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="border border-slate-800 bg-[#070b13]/80 p-4 rounded-xl flex-1 flex flex-col gap-3 min-h-[300px]">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Model Synthesized Output</span>

                  {isSimulating ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
                      <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                      <span className="text-xs font-bold text-slate-300">Evaluating multi-phase AST token generation...</span>
                      <span className="text-[10px] text-slate-500">Wait-time matches local GPU floating point execution bounds.</span>
                    </div>
                  ) : simulationResult ? (
                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
                      {simulationResult.thinking && (
                        <div className="bg-[#0b0f19] border border-indigo-950 p-3 rounded-xl font-mono text-[9.5px] leading-relaxed text-indigo-300/90 whitespace-pre-wrap">
                          <span className="text-[9px] font-black text-indigo-400 block mb-1 uppercase tracking-widest">Verified Reasoning thoughts (CoT)</span>
                          {simulationResult.thinking}
                        </div>
                      )}
                      
                      <div className="bg-[#0d1222]/40 border border-slate-850 p-4 rounded-xl text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {simulationResult.output}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-600">
                      <Brain className="w-8 h-8 text-slate-700 animate-pulse" />
                      <span className="text-xs font-bold text-slate-400">Playground Console Idle</span>
                      <span className="text-[10px] text-slate-500">Output will be compiled here once you run inference.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
