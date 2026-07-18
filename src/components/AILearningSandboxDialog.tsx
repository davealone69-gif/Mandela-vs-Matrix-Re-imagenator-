import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Brain, Cpu, Play, Layers, Sparkles, RefreshCw, 
  ArrowRight, Activity, Grid, Sliders, PlayCircle, BookOpen, 
  Settings, CheckCircle2, ChevronRight, Zap, Target, Trophy, Gauge, TrendingUp, Terminal
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

export default function AILearningSandboxDialog({ isDark, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // --- Academy Gamification & Speed State ---
  const [learningXP, setLearningXP] = useState<number>(() => {
    const saved = localStorage.getItem('Mandela vs Matrix Re-Imaginator_academy_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 1, 2, 5, 10
  const [completedActivities, setCompletedActivities] = useState<string[]>(() => {
    const saved = localStorage.getItem('Mandela vs Matrix Re-Imaginator_completed_activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [xpNotification, setXpNotification] = useState<{ amount: number; label: string } | null>(null);

  const awardXP = (activityId: string, amount: number, label: string) => {
    const isFirstTime = !completedActivities.includes(activityId);
    const xpGained = isFirstTime ? amount : Math.round(amount * 0.3); // diminishing returns
    
    setLearningXP(prev => {
      const next = prev + xpGained;
      localStorage.setItem('Mandela vs Matrix Re-Imaginator_academy_xp', next.toString());
      return next;
    });

    if (isFirstTime) {
      setCompletedActivities(prev => {
        const next = [...prev, activityId];
        localStorage.setItem('Mandela vs Matrix Re-Imaginator_completed_activities', JSON.stringify(next));
        return next;
      });
    }

    setXpNotification({ amount: xpGained, label });
    setTimeout(() => {
      setXpNotification(null);
    }, 2500);
  };

  // --- Step 1: NumPy State ---
  const [numpyResult, setNumpyResult] = useState<string>('Click "Run NumPy Script" to evaluate');
  const [numpySlicingHighlight, setNumpySlicingHighlight] = useState<string>('none'); // 'none', 'row1', 'col1'
  
  // --- Step 2 & 3: Neural Network & TensorFlow State ---
  const [epochs, setEpochs] = useState<number>(0);
  const [loss, setLoss] = useState<number>(0.693);
  const [accuracy, setAccuracy] = useState<number>(0.50);
  const [nnInputs, setNnInputs] = useState<[number, number]>([0.2, 0.4]);
  const [predictionResult, setPredictionResult] = useState<string>('Awaiting classification');
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [neuronActivations, setNeuronActivations] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);

  // --- Step 4: Q-Learning State ---
  const [alpha, setAlpha] = useState<number>(0.1);
  const [gamma, setGamma] = useState<number>(0.9);
  const [epsilon, setEpsilon] = useState<number>(0.2);
  const [qTable, setQTable] = useState<number[][]>([
    [0.0, 0.0],
    [0.0, 0.0],
    [0.0, 0.0],
    [0.0, 0.0],
    [0.0, 0.0]
  ]);
  const [qEpisodes, setQEpisodes] = useState<number>(0);
  const [qLogs, setQLogs] = useState<string[]>([]);

  // --- Step 5: Small Projects State ---
  const [projectPrompt, setProjectPrompt] = useState<string>('The weather is absolutely perfect and sunlit!');
  const [projectSentiment, setProjectSentiment] = useState<{ label: string; score: number } | null>(null);

  // --- Step 6: CNN & RNN State ---
  const [cnnStep, setCnnStep] = useState<number>(0); // 0 to 4 sequence step
  const [lstmCellState, setLstmCellState] = useState<string>('Initial state: h_0 = 0, c_0 = 0');

  // --- Step 8: Android Bot Trainer & RAG State ---
  const [specTab, setSpecTab] = useState<string>('roadmap');
  const [botTrainingStatus, setBotTrainingStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [botTrainingLogs, setBotTrainingLogs] = useState<string[]>([]);
  const [botTrainingProgress, setBotTrainingProgress] = useState<number>(0);
  const [botTrainingLoss, setBotTrainingLoss] = useState<number>(1.25);
  const [botTrainingAccuracy, setBotTrainingAccuracy] = useState<number>(0.15);
  const [botActiveQuery, setBotActiveQuery] = useState<string | null>(null);
  const [botQueryResponse, setBotQueryResponse] = useState<any | null>(null);
  const botLogsRef = useRef<HTMLDivElement>(null);

  // --- Real RAG Pipeline Integration States ---
  const [ragStats, setRagStats] = useState<any>({
    totalChunks: 6,
    sftDatasetSize: 2,
    ragVersion: '1.0.0',
    activeAdapterVersion: 'Mandela vs Matrix Re-Imaginator-adapter-v1.0.0',
    embeddingModel: 'gemini-embedding-2-preview',
    averageFaithfulness: 0.94,
    lastTrainedTimestamp: new Date().toISOString(),
    retrievalK: 3,
    minSimilarity: 0.35
  });
  const [ragDocuments, setRagDocuments] = useState<any[]>([]);
  const [manualQueryText, setManualQueryText] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [showAddSnippet, setShowAddSnippet] = useState<boolean>(false);
  const [newSnippet, setNewSnippet] = useState<any>({
    title: '',
    content: '',
    code: '',
    category: 'core_android',
    level: 'intermediate',
    source: 'user_upload'
  });
  const [feedbackRatingStatus, setFeedbackRatingStatus] = useState<string | null>(null);

  // Fetch real RAG statistics & knowledge corpus
  const fetchRagStatsAndDocs = async () => {
    try {
      const statsRes = await fetch('/api/rag/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setRagStats(statsData.stats);
      }

      const docsRes = await fetch('/api/rag/documents');
      const docsData = await docsRes.json();
      if (docsData.success) {
        setRagDocuments(docsData.documents);
      }
    } catch (err) {
      console.error("Failed to sync RAG states:", err);
    }
  };

  useEffect(() => {
    if (currentStep === 8) {
      fetchRagStatsAndDocs();
    }
  }, [currentStep]);

  // --- Step 8: Multi-Agent System State ---
  const [multiAgentStep, setMultiAgentStep] = useState<string>('idle');
  const [multiAgentLogs, setMultiAgentLogs] = useState<string[]>([]);

  // --- Step 9: Autonomous Android Refactorer State ---
  const [autonomousStep, setAutonomousStep] = useState<string>('idle');
  const [autonomousLogs, setAutonomousLogs] = useState<string[]>([]);
  const [refactorScenario, setRefactorScenario] = useState<string>('coroutines_leak');
  const [knowledgeDomain, setKnowledgeDomain] = useState<string>('coroutines');
  const [agentXP, setAgentXP] = useState<any>({
    policeAI: 240,
    internetCheckAI: 310,
    selfImprovement: 180,
    refactorerAI: 120
  });
  const [activeTabStage9, setActiveTabStage9] = useState<string>('refactorer');
  const [proposals, setProposals] = useState<any[]>([
    {
      id: 'prop_01',
      title: 'Optimize EncryptedSharedPreferences key size policy',
      status: 'pending',
      suggestedBy: 'Autonomous Refactorer',
      rationale: 'RAG security updates show 256-bit AES GCM keys are optimal for API Level 23+.'
    },
    {
      id: 'prop_02',
      title: 'Auto-inject derivedStateOf for lists in nested LazyColumns',
      status: 'approved',
      suggestedBy: 'Self-Improvement Agent',
      rationale: 'Recomposition rates dropped by 42% in local rendering simulations.'
    }
  ]);

  // --- Step 10: Autonomous Feature Architect State ---
  const [architectStep, setArchitectStep] = useState<string>('idle');
  const [architectLogs, setArchitectLogs] = useState<string[]>([]);
  const [featureScenario, setFeatureScenario] = useState<string>('biometric_login');
  const [activeTabStage10, setActiveTabStage10] = useState<string>('proposer');
  const [featureSpecs, setFeatureSpecs] = useState<string>('');
  const [architectProposals, setArchitectProposals] = useState<any[]>([
    {
      id: 'arch_prop_01',
      title: 'Biometric FaceID/Fingerprint Lock screen',
      status: 'pending',
      module: ':feature:security',
      impact: 'Enforces industry-grade session locking on application minimize'
    },
    {
      id: 'arch_prop_02',
      title: 'Real-time Financial Charts dashboard',
      status: 'approved',
      module: ':feature:finance',
      impact: 'Visualizes transaction flow rates using Canvas drawing algorithms'
    }
  ]);

  // Auto-scroll refs
  const kerasLogsRef = useRef<HTMLDivElement>(null);
  const qLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (kerasLogsRef.current) {
      kerasLogsRef.current.scrollTop = kerasLogsRef.current.scrollHeight;
    }
  }, [trainingLogs]);

  useEffect(() => {
    if (qLogsRef.current) {
      qLogsRef.current.scrollTop = qLogsRef.current.scrollHeight;
    }
  }, [qLogs]);

  useEffect(() => {
    if (botLogsRef.current) {
      botLogsRef.current.scrollTop = botLogsRef.current.scrollHeight;
    }
  }, [botTrainingLogs]);

  // NumPy Code Execution Simulation
  const runNumpyDemo = () => {
    setIsRunning(true);
    setNumpyResult('Computing vector addition...\nComputing matrix element-wise multiplication...');
    setTimeout(() => {
      const x = [1, 2, 3];
      const y = [4, 5, 6];
      const sum = x.map((val, i) => val + y[i]);
      const prod = x.map((val, i) => val * y[i]);
      const sines = x.map(val => Math.sin(val).toFixed(4));
      const sqrts = y.map(val => Math.sqrt(val).toFixed(4));
      
      setNumpyResult(
        `>>> x = np.array([1, 2, 3])\n` +
        `>>> y = np.array([4, 5, 6])\n\n` +
        `Vector addition (x + y):\n[${sum.join(', ')}]\n\n` +
        `Vector multiplication (x * y):\n[${prod.join(', ')}]\n\n` +
        `Element-wise Sine (np.sin(x)):\n[${sines.join(', ')}]\n\n` +
        `Element-wise Sqrt (np.sqrt(y)):\n[${sqrts.join(', ')}]\n\n` +
        `Matrix basic definitions:\n` +
        `a3 = np.zeros((3, 3)) -> \n[[0, 0, 0], [0, 0, 0], [0, 0, 0]]\n` +
        `a5 = np.arange(0, 10, 2) -> [0, 2, 4, 6, 8]`
      );
      setIsRunning(false);
      awardXP('numpy_basics', 50, 'NumPy Array Basics & Vectors');
    }, Math.max(50, 800 / speedMultiplier));
  };

  // TensorFlow / Neural Network Training Simulation
  const runNnTraining = () => {
    setIsRunning(true);
    setTrainingLogs(['[SYSTEM] TensorFlow Keras Model compiled.', 'Initializing Dense weights...']);
    setEpochs(0);
    setLoss(0.693);
    setAccuracy(0.50);
    
    let currentEpoch = 0;
    const interval = setInterval(() => {
      currentEpoch += 5;
      const progressRatio = currentEpoch / 50;
      const currentLoss = Math.max(0.042, 0.693 - (0.65 * progressRatio) + Math.random() * 0.03);
      const currentAcc = Math.min(1.0, 0.50 + (0.50 * progressRatio));
      
      setEpochs(currentEpoch);
      setLoss(currentLoss);
      setAccuracy(currentAcc);
      
      // Simulate random neuron activations changing
      setNeuronActivations(Array.from({ length: 8 }, () => Math.random() * 1.0));
      setTrainingLogs(prev => [
        ...prev, 
        `Epoch ${currentEpoch}/50 - loss: ${currentLoss.toFixed(4)} - accuracy: ${currentAcc.toFixed(4)}`
      ]);

      if (currentEpoch >= 50) {
        clearInterval(interval);
        setIsRunning(false);
        setTrainingLogs(prev => [...prev, '[SUCCESS] Model fit complete! Binary classifier trained successfully.']);
        // Auto run prediction
        runPrediction();
        awardXP('nn_keras_train', 120, 'Keras Network Training Complete');
      }
    }, Math.max(10, 150 / speedMultiplier));
  };

  const runPrediction = () => {
    // Basic classification rule matching the user's logic:
    // X = np.array([[0.1, 0.5], [0.2, 0.4], [0.3, 0.3], [0.4, 0.2], [0.5, 0.1]])
    // y = np.array([0, 0, 1, 1, 1])
    // The sum of X[0] and X[1] is ~0.6. When X[0] >= 0.3, y = 1.
    const [f1, f2] = nnInputs;
    const rawSigmoid = 1 / (1 + Math.exp(-(f1 * 12 + f2 * 4 - 5)));
    const predClass = rawSigmoid > 0.5 ? 1 : 0;
    
    setNeuronActivations(Array.from({ length: 8 }, (_, i) => {
      if (i % 2 === 0) return Math.min(1.0, f1 * 1.5 + Math.random() * 0.2);
      return Math.min(1.0, f2 * 1.5 + Math.random() * 0.2);
    }));

    setPredictionResult(
      `Features: [${f1.toFixed(1)}, ${f2.toFixed(1)}]\n` +
      `Sigmoid Output: ${rawSigmoid.toFixed(4)}\n` +
      `Predicted Class: ${predClass} (${predClass === 1 ? 'Positive Segment' : 'Negative Segment'})`
    );
    awardXP('sigmoid_prediction', 30, 'Sigmoid Network Forward Pass');
  };

  // Reinforcement Learning: Q-Learning Simulator
  const runQLearning = () => {
    setIsRunning(true);
    setQLogs(['[SYSTEM] Starting reinforcement learning episodic updates...']);
    
    let currentEpisodes = 0;
    // Create local copy of Q-table
    let currentQ = qTable.map(row => [...row]);

    const interval = setInterval(() => {
      // Run 10 episodes per interval tick
      for (let e = 0; e < 10; e++) {
        currentEpisodes++;
        let state = Math.floor(Math.random() * 5);
        
        // Pick action: epsilon greedy
        let action = 0;
        if (Math.random() < epsilon) {
          action = Math.floor(Math.random() * 2);
        } else {
          action = currentQ[state][0] >= currentQ[state][1] ? 0 : 1;
        }

        // Reward logic from user: reward = 1 if action == 1 else 0
        const reward = action === 1 ? 1.0 : 0.0;
        const nextState = Math.floor(Math.random() * 5);
        
        // Q-learning update formula:
        // Q[state, action] = Q[state, action] + alpha * (reward + gamma * np.max(Q[nextState]) - Q[state, action])
        const maxNextQ = Math.max(currentQ[nextState][0], currentQ[nextState][1]);
        const temporalDifference = reward + gamma * maxNextQ - currentQ[state][action];
        currentQ[state][action] = currentQ[state][action] + alpha * temporalDifference;
      }

      setQEpisodes(currentEpisodes);
      // Set values with float limit
      setQTable(currentQ.map(row => row.map(v => Number(v.toFixed(4)))));
      setQLogs(prev => [
        ...prev,
        `Episode ${currentEpisodes}/100: Explored states, updated actions. Q[S=0, A=1]=${currentQ[0][1].toFixed(4)}`
      ]);

      if (currentEpisodes >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setQLogs(prev => [...prev, '[SUCCESS] Q-Table optimized! Agent prefers Action 1 due to high reward structure.']);
        awardXP('q_learning', 150, 'Q-Table Optimization 100 Episodes');
      }
    }, Math.max(8, 120 / speedMultiplier));
  };

  // Small Projects: Sentiment Analysis Simulator
  const runProjectInference = () => {
    const text = projectPrompt.toLowerCase();
    let score = 0.5;
    
    // Simple heuristic
    const positiveWords = ['perfect', 'sunlit', 'awesome', 'great', 'love', 'easy', 'smart', 'learn', 'good'];
    const negativeWords = ['bad', 'error', 'failed', 'issue', 'hard', 'stuck', 'exhausted', 'difficult', 'slow'];

    positiveWords.forEach(w => { if (text.includes(w)) score += 0.15; });
    negativeWords.forEach(w => { if (text.includes(w)) score -= 0.15; });

    const finalScore = Math.min(1.0, Math.max(0.0, score));
    const label = finalScore > 0.6 ? 'Positive 😊' : finalScore < 0.4 ? 'Negative 😢' : 'Neutral 😐';

    setProjectSentiment({ label, score: finalScore });
    awardXP('sentiment_inference', 40, 'Heuristic Sentiment Classifier Inference');
  };

  // CNN filter movement simulator
  useEffect(() => {
    if (currentStep === 6) {
      const interval = setInterval(() => {
        setCnnStep(prev => (prev + 1) % 5);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // --- Step 8: Android Bot Training & RAG Real Integration ---
  const runBotTraining = async () => {
    setIsTraining(true);
    setBotTrainingStatus('running');
    setBotTrainingProgress(0);
    setBotTrainingLoss(1.10);
    setBotTrainingAccuracy(0.35);
    setBotTrainingLogs([
      '[SYSTEM] Initializing SFT (Supervised Fine-Tuning) Optimization Loop...',
      '[INFO] Harvesting positive interaction signals from SFT pool...',
      '[INFO] Compiling Instruction-Response datasets for gradient descent...'
    ]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 90) {
        clearInterval(interval);
        return;
      }
      setBotTrainingProgress(progress);
      const currentLoss = Math.max(0.0125, 1.10 - (1.08 * (progress / 100)) + Math.sin(progress) * 0.02);
      const currentAcc = Math.min(0.995, 0.35 + (0.64 * (progress / 100)) + Math.cos(progress) * 0.01);
      setBotTrainingLoss(currentLoss);
      setBotTrainingAccuracy(currentAcc);
      setBotTrainingLogs(prev => [...prev, `[SFT] Fine-tuning model weights... Optimization Progress ${progress}% - Loss: ${currentLoss.toFixed(4)}`]);
    }, 200 / speedMultiplier);

    try {
      const response = await fetch('/api/rag/train', { method: 'POST' });
      const data = await response.json();
      
      clearInterval(interval);
      setBotTrainingProgress(100);
      setBotTrainingLoss(0.0125);
      setBotTrainingAccuracy(0.992);
      setBotTrainingStatus('completed');
      
      if (data.success) {
        setBotTrainingLogs(prev => [
          ...prev,
          `[FT] Supervised Fine-Tuning completed successfully!`,
          `[AUDIT] Registered adapter version: ${data.activeAdapterVersion}`,
          `[AUDIT] SFT Dataset Harvested: ${data.harvestedDatasetSize} interactions`,
          `[AUDIT] Vector Space hash: ${data.auditHash.slice(0, 16)}`,
          `[SYSTEM_RULES] Newly optimized guidelines consolidated:`,
          ...data.updatedRules.map((rule: string, idx: number) => `   ⚡ Rule ${idx + 1}: ${rule}`),
          `✅ [SUCCESS] AI Agent successfully compiled and version-registered.`
        ]);
        awardXP('android_bot_train_full', 200, `Model Fine-tuned to ${data.activeAdapterVersion}!`);
        fetchRagStatsAndDocs(); // Refresh stats
      } else {
        setBotTrainingLogs(prev => [
          ...prev,
          `⚠️ [SFT Cancelled] ${data.message || 'No high-value interaction signals found.'}`,
          `💡 Hint: Ask some queries below and give them Helpful ratings (👍) to harvest SFT data!`
        ]);
      }
    } catch (err: any) {
      clearInterval(interval);
      setBotTrainingStatus('idle');
      setBotTrainingLogs(prev => [...prev, `❌ [SFT Error] Failed to execute SFT pipeline: ${err.message}`]);
    } finally {
      setIsTraining(false);
    }
  };

  const runBotQuery = async (queryType: string, customQueryText?: string) => {
    setIsQuerying(true);
    setBotActiveQuery(queryType);
    setFeedbackRatingStatus(null); // Reset rating feedback

    let queryText = customQueryText || "";
    if (!queryText) {
      if (queryType === 'fragment') queryText = "how to safely use fragments inside views and clean bindings?";
      else if (queryType === 'room') queryText = "how to design a Room database schema and DAO repository?";
      else if (queryType === 'location') queryText = "how to use fused location provider safely without battery drain?";
      else if (queryType === 'custom_view') queryText = "how to draw on a custom view canvas in onDraw?";
      else if (queryType === 'widgets') queryText = "how to implement home app widgets remoteviews?";
      else if (queryType === 'meta_rag') queryText = "Why is RAG needed for LLM learning and persistent context?";
      else if (queryType === 'meta_identity') queryText = "How to define bot identity and system prompt constraints?";
      else if (queryType === 'meta_override') queryText = "How to override previous rules in a RAG system?";
      else if (queryType === 'free_ai_resources') queryText = "What are free AI learning resources from DataCamp?";
      else queryText = queryType;
    }

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      const data = await response.json();
      if (data.success) {
        setBotQueryResponse({
          title: data.retrievedChunks?.[0]?.title || "Grounded Synthesis",
          category: data.retrievedChunks?.[0]?.category || "general",
          level: data.retrievedChunks?.[0]?.level || "intermediate",
          source: data.retrievedChunks?.[0]?.source || "synthesis",
          content: data.answer,
          code: data.code,
          evaluation: data.evaluation,
          latencyMs: data.latencyMs,
          transactionId: data.transactionId,
          query: queryText,
          retrievedChunks: data.retrievedChunks,
          ragVersion: data.ragVersion,
          activeAdapterVersion: data.activeAdapterVersion
        });
        awardXP('rag_query_' + queryType, 35, `RAG Query Evaluated: ${queryText.slice(0, 20)}...`);
      } else {
        throw new Error(data.error || "RAG API Error");
      }
    } catch (err) {
      console.error("RAG Query Failed:", err);
      let title = 'Offline Grounded Response';
      let category = 'system_fallback';
      let level = 'intermediate';
      let source = 'offline_database';
      let content = `The RAG-first query server returned an error, falling back to local cached schema. Search query: "${queryText}"`;
      let code = `// Fallback code block:\nLog.d("RAG", "Query: ${queryText}")`;
      setBotQueryResponse({ title, category, level, source, content, code });
    } finally {
      setIsQuerying(false);
    }
  };

  const submitFeedback = async (rating: 'positive' | 'negative', correction?: string) => {
    if (!botQueryResponse) return;
    try {
      const response = await fetch('/api/rag/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: botQueryResponse.transactionId,
          query: botQueryResponse.query,
          answer: botQueryResponse.content,
          feedback: rating,
          correction: correction || ""
        })
      });
      const data = await response.json();
      if (data.success) {
        setFeedbackRatingStatus(rating === 'positive' ? 'positive' : 'negative');
        awardXP('feedback_sft', 20, `Harvested SFT feedback: ${rating}`);
        fetchRagStatsAndDocs(); // Refresh stats
      }
    } catch (err) {
      console.error("Feedback submit failed:", err);
    }
  };

  const addCustomSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnippet.content) return;

    try {
      const response = await fetch('/api/rag/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSnippet)
      });
      const data = await response.json();
      if (data.success) {
        setNewSnippet({
          title: '',
          content: '',
          code: '',
          category: 'core_android',
          level: 'intermediate',
          source: 'user_upload'
        });
        setShowAddSnippet(false);
        awardXP('rag_ingest_custom', 50, 'Snippet Ingested & Embedded!');
        fetchRagStatsAndDocs(); // Refresh stats & docs
      }
    } catch (err) {
      console.error("Snippet ingestion failed:", err);
    }
  };

  const runMultiAgentSimulation = () => {
    setMultiAgentStep('domain_draft');
    setMultiAgentLogs([
      '🚀 [Pipeline Start] Initializing Multi-Agent RAG execution pipeline...',
      '🤖 [DomainAgent] Generating initial draft for advanced Android query: "How to safely handle Fragment transactions inside an asynchronous callback?"'
    ]);

    setTimeout(() => {
      setMultiAgentStep('police_check');
      setMultiAgentLogs(prev => [
        ...prev,
        '🛡️ [PoliceAI] Reviewing draft output for safety, developer guidelines, and domain validation...',
        '🛡️ [PoliceAI] PASS: No security, copyright, or off-domain violations detected. Output complies with Google Play development policies.'
      ]);
    }, 1500 / speedMultiplier);

    setTimeout(() => {
      setMultiAgentStep('internet_verify');
      setMultiAgentLogs(prev => [
        ...prev,
        '🌐 [InternetCheckAI] Querying official docs to verify API signatures & deprecation state of "commitAllowingStateLoss()"...',
        '🌐 [InternetCheckAI] VERDICT: Confidence 0.98. Confirmed "commitAllowingStateLoss()" is required if callback executes after onSaveInstanceState().'
      ]);
    }, 3000 / speedMultiplier);

    setTimeout(() => {
      setMultiAgentStep('domain_revise');
      setMultiAgentLogs(prev => [
        ...prev,
        '🔄 [DomainAgent] Revising initial draft to embed verification insights...',
        '🔄 [DomainAgent] Draft optimized: added thread safety warnings and explicit transaction state-loss safety checks.'
      ]);
    }, 4500 / speedMultiplier);

    setTimeout(() => {
      setMultiAgentStep('self_improve');
      setMultiAgentLogs(prev => [
        ...prev,
        '🧠 [Self-Improvement Agent] Reviewing pipeline latency, token consumption, and precision gaps...',
        '🧠 [Self-Improvement Agent] Synthesizing improvement chunk under "android_asynchronous_transactions" namespace.'
      ]);
    }, 6000 / speedMultiplier);

    setTimeout(() => {
      setMultiAgentStep('done');
      setMultiAgentLogs(prev => [
        ...prev,
        '💾 [Vector DB] New chunk indexed successfully. System state updated!',
        '✅ [Pipeline Success] Balanced multi-agent pipeline execution completed successfully.'
      ]);
      awardXP('multi_agent_pipeline_run', 150, 'Executed Multi-Agent Pipeline!');
    }, 7500 / speedMultiplier);
  };

  const runAutonomousRefactorSimulation = () => {
    setAutonomousStep('analyzing');
    setAutonomousLogs([
      '🔍 [Step 1/5] [AutonomousRefactorer] Parsing current Android project files...',
      refactorScenario === 'coroutines_leak' 
        ? '⚠️ [Anomaly Detected] Unstructured coroutine leak: GlobalScope.launch called outside managed Lifecycle scope with potential main-thread networking.'
        : refactorScenario === 'compose_performance'
        ? '⚠️ [Anomaly Detected] Compose performance issue: LazyColumn item rendering lacks stable keys. Multi-recomposition loop suspected.'
        : '⚠️ [Anomaly Detected] Security Vulnerability: Hardcoded plain-text SharedSharedPreferences and raw API credentials found in repository.'
    ]);

    setTimeout(() => {
      setAutonomousStep('verifying');
      setAutonomousLogs(prev => [
        ...prev,
        '🛡️ [Step 2/5] [PoliceAI & InternetCheckAI] Performing policy checks & API verification...',
        refactorScenario === 'coroutines_leak'
          ? '🛡️ [PoliceAI] Strict thread boundaries validated. [InternetCheckAI] Confirmed Dispatchers.IO is necessary for network stream reading.'
          : refactorScenario === 'compose_performance'
          ? '🛡️ [PoliceAI] Recomposition count policy is within limits. [InternetCheckAI] Confirmed key parameter is optimal for LazyList index tracking.'
          : '🛡️ [PoliceAI] Security standards match. [InternetCheckAI] Verified EncryptedSharedPreferences requires AES-256 SIV/GCM encryption scheme.'
      ]);
      setAgentXP(prev => ({
        ...prev,
        policeAI: prev.policeAI + 15,
        internetCheckAI: prev.internetCheckAI + 20
      }));
    }, 2000 / speedMultiplier);

    setTimeout(() => {
      setAutonomousStep('refactoring');
      setAutonomousLogs(prev => [
        ...prev,
        '⚙️ [Step 3/5] [AutonomousRefactorer] Re-synthesizing Android code with reactive optimization boundaries...',
        '⚙️ [AutonomousRefactorer] Safe injection completed. Transpiling intermediate Kotlin representation.'
      ]);
      setAgentXP(prev => ({
        ...prev,
        refactorerAI: prev.refactorerAI + 30
      }));
    }, 4000 / speedMultiplier);

    setTimeout(() => {
      setAutonomousStep('improving');
      setAutonomousLogs(prev => [
        ...prev,
        '🧠 [Step 4/5] [Self-Improvement Agent] Running low-confidence reflection cycle on refactored outputs...',
        '🧠 [Self-Improvement Agent] Generated feedback: "Code is verified. Codebase compiles under standard Android build system successfully."'
      ]);
      setAgentXP(prev => ({
        ...prev,
        selfImprovement: prev.selfImprovement + 25
      }));
    }, 6000 / speedMultiplier);

    setTimeout(() => {
      setAutonomousStep('completed');
      setAutonomousLogs(prev => [
        ...prev,
        '💾 [Step 5/5] [System Memory] Refactoring pattern committed to permanent RAG storage.',
        '🚀 [Autonomous Refactor Success] Evolution cycle completed! High-performance, highly secure Android code successfully integrated.',
        '🏆 Multi-agent XP allocated. Current neural system capabilities upgraded!'
      ]);
      awardXP('stage9_refactor_simulation', 200, 'Completed Stage 9 Autonomous Refactor!');
    }, 8000 / speedMultiplier);
  };

  const runAutonomousFeatureSimulation = () => {
    setArchitectStep('designing');
    setArchitectLogs([
      '🧠 [Step 1/5] [FeatureArchitectAI] Initiating autonomous design for new Android module...',
      featureScenario === 'biometric_login'
        ? '💡 [Proposing Module] :feature:security (Biometric authentication screen & local token-pinning vault)'
        : featureScenario === 'finance_dashboard'
        ? '💡 [Proposing Module] :feature:finance (High-performance transactional canvas charts & real-time balance ledger)'
        : '💡 [Proposing Module] :feature:chat (End-to-end encrypted WebSocket chat client with SQLite local storage cache)'
    ]);

    setTimeout(() => {
      setArchitectStep('reviewing');
      setArchitectLogs(prev => [
        ...prev,
        '🛡️ [Step 2/5] [PoliceAI & InternetCheckAI] Auditing proposal and validating SDK compatibility...',
        featureScenario === 'biometric_login'
          ? '🛡️ [PoliceAI] Bio-bypass policy confirmed secure. [InternetCheckAI] Verified androidx.biometric:biometric:1.2.0-alpha05 matches Gradle catalog.'
          : featureScenario === 'finance_dashboard'
          ? '🛡️ [PoliceAI] Numeric precision standards validated. [InternetCheckAI] Confirmed canvas hardware acceleration flags are optimal.'
          : '🛡️ [PoliceAI] TLS 1.3 socket boundary rules enforced. [InternetCheckAI] Confirmed local SQLite triggers compile flawlessly.'
      ]);
      setAgentXP(prev => ({
        ...prev,
        policeAI: prev.policeAI + 25,
        internetCheckAI: prev.internetCheckAI + 20
      }));
    }, 2000 / speedMultiplier);

    setTimeout(() => {
      setArchitectStep('coding');
      setArchitectLogs(prev => [
        ...prev,
        '⚙️ [Step 3/5] [AutonomousRefactorer] Scaffolding Kotlin components and Jetpack Compose screens...',
        '⚙️ [AutonomousRefactorer] Generated UI layout code and integrated dependency injection bindings.'
      ]);
      setAgentXP(prev => ({
        ...prev,
        refactorerAI: prev.refactorerAI + 35
      }));
    }, 4000 / speedMultiplier);

    setTimeout(() => {
      setArchitectStep('improving');
      setArchitectLogs(prev => [
        ...prev,
        '🧠 [Step 4/5] [Self-Improvement Agent] Running architecture alignment & reflection loop...',
        '🧠 [Self-Improvement Agent] Passed compilation and visual verification tests with 0 warning flags!'
      ]);
      setAgentXP(prev => ({
        ...prev,
        selfImprovement: prev.selfImprovement + 30
      }));
    }, 6000 / speedMultiplier);

    setTimeout(() => {
      setArchitectStep('completed');
      setArchitectLogs(prev => [
        ...prev,
        '💾 [Step 5/5] [RAG Storage] New Feature Blueprint successfully written and indexed to the permanent design library.',
        '🚀 [System Creation Success] High-performance feature module compiled and registered autonomously!',
        '🏆 XP progression updated. System capability expanded!'
      ]);
      awardXP('stage10_feature_simulation', 250, 'Completed Stage 10 Feature Creation!');
    }, 8000 / speedMultiplier);
  };

  const steps = [
    { id: 1, title: 'NumPy Basics', desc: 'Vectors, Slicing & Arrays' },
    { id: 2, title: 'TensorFlow Setup', desc: 'Sequential Models & Compiles' },
    { id: 3, title: 'Simple Neural Nets', desc: 'Activations & Feed-Forward' },
    { id: 4, title: 'Reinforcement Learning', desc: 'Bellman updates & Q-tables' },
    { id: 5, title: 'Small AI Projects', desc: 'Sentiment Inference API' },
    { id: 6, title: 'CNN & RNN Blocks', desc: 'Kernel filters & Gate States' },
    { id: 7, title: 'Full AI Systems', desc: 'Production Deployment' },
    { id: 8, title: 'Android Bot Trainer & RAG', desc: 'Curriculum & RAG Knowledge Base' },
    { id: 9, title: 'Autonomous Refactorer', desc: 'Stage 9 Production-Grade Evolution' },
    { id: 10, title: 'Autonomous Feature Architect', desc: 'Stage 10 Autonomous Feature Creation' }
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl rounded-2xl shadow-[0_0_85px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[92vh] ${
        isDark ? 'bg-[#0b0f19] border border-cyan-500/35 text-slate-100' : 'bg-white border border-cyan-500/30 text-slate-800'
      }`}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-900/30 bg-gradient-to-r from-cyan-950/40 via-blue-950/15 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                AI / ML Academy & Live Simulator
              </h3>
              <p className="text-[11px] text-slate-400">Step-by-step model playground & algorithm visualization engine</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-800/60 rounded-lg transition-colors text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTAINER */}
        <div className="flex flex-1 overflow-hidden relative">
          <style>{`
            .cyber-scrollbar::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .cyber-scrollbar::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.4);
              border-radius: 999px;
            }
            .cyber-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(6, 182, 212, 0.3);
              border-radius: 999px;
              border: 1px solid rgba(6, 182, 212, 0.15);
            }
            .cyber-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(6, 182, 212, 0.6);
            }
          `}</style>

          {/* FLOATING XP NOTIFICATION */}
          {xpNotification && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#070b13] border border-cyan-500/50 px-4 py-2 rounded-full flex items-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] animate-bounce text-xs">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-xs">
                ✨
              </div>
              <span className="font-black text-white">+{xpNotification.amount} XP</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-300 font-medium">{xpNotification.label}</span>
            </div>
          )}
          
          {/* SIDEBAR NAVIGATION (7 STEPS) */}
          <div className={`w-72 border-r shrink-0 overflow-y-auto cyber-scrollbar p-4 flex flex-col gap-3 ${
            isDark ? 'border-slate-800/60 bg-[#070b13]/60' : 'border-slate-200 bg-slate-50'
          }`}>
            
            {/* GAMIFIED XP & RANK */}
            <div className="bg-slate-950/80 border border-cyan-500/20 p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-wider text-cyan-400 uppercase flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-yellow-500 fill-yellow-500/20" /> Academy Score
                </span>
                <span className="text-[9px] text-cyan-300 font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  Rank {learningXP < 150 ? 'I' : learningXP < 400 ? 'II' : learningXP < 800 ? 'III' : learningXP < 1500 ? 'IV' : 'V'}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-white">{learningXP}</span>
                <span className="text-[10px] text-slate-400">XP Total</span>
              </div>
              <div className="flex flex-col gap-1 mt-0.5">
                <div className="flex justify-between text-[9px] text-slate-400 leading-none">
                  <span className="font-semibold text-slate-300">
                    {learningXP < 150 ? 'AI Novice Explorer' : 
                     learningXP < 400 ? 'Neural Apprentice' : 
                     learningXP < 800 ? 'Q-Learning Specialist' : 
                     learningXP < 1500 ? 'Sentiment Architect' : 'AGI Overlord'}
                  </span>
                  <span>{learningXP % 200}/200 XP</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden mt-0.5">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300" 
                    style={{ width: `${(learningXP % 200) / 2}%` }}
                  />
                </div>
              </div>
            </div>

            {/* SPEED CONTROLLER */}
            <div className="bg-slate-950/50 border border-slate-800 p-2.5 rounded-xl flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-cyan-500" /> Training Speed
                </span>
                <span className="text-[9px] text-emerald-400 font-extrabold bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-800/30">
                  {speedMultiplier}x Boost
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 mt-0.5">
                {[1, 2, 5, 10].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => {
                      setSpeedMultiplier(mult);
                      awardXP('speed_boost_' + mult, 10, `Speed set to ${mult}x`);
                    }}
                    className={`py-1 text-[9px] font-bold rounded transition-all border cursor-pointer ${
                      speedMultiplier === mult 
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-extrabold' 
                        : 'border-slate-800 text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-slate-800/50 my-1" />

            <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase mb-1 px-1">Curriculum Steps</span>
            
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isPassed = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStep(step.id);
                    setIsRunning(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                      : isPassed 
                        ? 'border-slate-800/40 text-slate-400 bg-slate-900/20' 
                        : 'border-transparent text-slate-500 hover:bg-slate-800/20'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                    isActive 
                      ? 'bg-cyan-500 text-slate-900' 
                      : isPassed 
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' 
                        : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.id}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight flex items-center gap-1">
                      {step.title}
                      {isPassed && <CheckCircle2 className="w-3 h-3 text-cyan-500" />}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5 leading-none">{step.desc}</div>
                  </div>
                </button>
              );
            })}

            {/* QUICK INFO */}
            <div className="mt-auto p-2.5 bg-slate-900/40 border border-slate-800/50 rounded-xl text-[9px] text-slate-400">
              <span className="font-semibold text-slate-300 block mb-0.5">💡 Interactive Sandbox</span>
              Slide parameters, toggle boost, click slice functions or type input features to dynamically execute.
            </div>
          </div>

          {/* ACTIVE CONTENT WORKSPACE */}
          <div className="flex-1 p-6 overflow-y-auto cyber-scrollbar flex flex-col gap-6">

            {/* STEP 1: NUMPY BASICS */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div>
                  <h4 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-cyan-400" /> Stage 1: NumPy Basics
                  </h4>
                  <p className="text-xs text-slate-400">
                    Master fast vector math, 2D matrix manipulation, slicing rules, and initialization functions like `np.zeros` and `np.arange`.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Code Panel */}
                  <div className="flex flex-col border border-slate-800/70 bg-slate-950 rounded-xl overflow-hidden font-mono text-xs">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
                      <span>NUMPY_VECTORS.PY</span>
                      <span className="text-cyan-400 font-semibold">Active Code Snippet</span>
                    </div>
                    <div className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
{`import numpy as np

# Vector Addition & Sines
x = np.array([1, 2, 3])
y = np.array([4, 5, 6])
print(x + y)  # Element-wise addition
print(x * y)  # Element-wise product

# 2D Slicing Demo
b = np.array([[1, 2, 3],
              [4, 5, 6]])
print(b[1:2]) # Row slicing
print(b[:, 1]) # Column slicing`}
                    </div>
                    <div className="p-3 bg-slate-900/40 border-t border-slate-800 flex justify-end">
                      <button 
                        onClick={runNumpyDemo}
                        disabled={isRunning}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> {isRunning ? 'Running...' : 'Run NumPy Script'}
                      </button>
                    </div>
                  </div>

                  {/* Slicing Visualizer */}
                  <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Interactive Slicing Sandbox</span>
                      <span className="text-[10px] text-slate-400">Click a slice function to see which items in matrix `b` are fetched.</span>
                    </div>

                    {/* Matrix Grid */}
                    <div className="flex flex-col gap-2 bg-black/40 border border-slate-800/40 p-4 rounded-xl items-center justify-center min-h-[120px]">
                      <div className="text-[10px] text-slate-500 mb-2 font-mono">Matrix b (2x3)</div>
                      <div className="flex flex-col gap-2 font-mono text-sm">
                        {/* Row 0 */}
                        <div className="flex gap-2">
                          <div className={`w-12 h-12 border flex items-center justify-center rounded-lg transition-all ${
                            numpySlicingHighlight === 'col1' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold scale-105' : 'border-slate-800 text-slate-400'
                          }`}>1</div>
                          <div className={`w-12 h-12 border flex items-center justify-center rounded-lg transition-all ${
                            numpySlicingHighlight === 'col1' ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 font-bold scale-105' : 'border-slate-800 text-slate-400'
                          }`}>2</div>
                          <div className={`w-12 h-12 border flex items-center justify-center rounded-lg transition-all ${
                            numpySlicingHighlight === 'col1' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold scale-105' : 'border-slate-800 text-slate-400'
                          }`}>3</div>
                        </div>
                        {/* Row 1 */}
                        <div className="flex gap-2">
                          <div className={`w-12 h-12 border flex items-center justify-center rounded-lg transition-all ${
                            numpySlicingHighlight === 'row1' || numpySlicingHighlight === 'col1' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold scale-105' : 'border-slate-800 text-slate-400'
                          }`}>4</div>
                          <div className={`w-12 h-12 border flex items-center justify-center rounded-lg transition-all ${
                            numpySlicingHighlight === 'row1' ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300' : numpySlicingHighlight === 'col1' ? 'bg-cyan-500/40 border-cyan-400 text-cyan-300 font-bold scale-105' : 'border-slate-800 text-slate-400'
                          }`}>5</div>
                          <div className={`w-12 h-12 border flex items-center justify-center rounded-lg transition-all ${
                            numpySlicingHighlight === 'row1' || numpySlicingHighlight === 'col1' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold scale-105' : 'border-slate-800 text-slate-400'
                          }`}>6</div>
                        </div>
                      </div>
                    </div>

                    {/* Slicing Controls */}
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => {
                          setNumpySlicingHighlight('row1');
                          awardXP('numpy_slice_row', 15, 'Slicing Rows in 2D Array');
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          numpySlicingHighlight === 'row1' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-slate-800 text-slate-400 hover:bg-slate-800/30'
                        }`}
                      >
                        b[1:2] (Row 1)
                      </button>
                      <button 
                        onClick={() => {
                          setNumpySlicingHighlight('col1');
                          awardXP('numpy_slice_col', 15, 'Slicing Columns in 2D Array');
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          numpySlicingHighlight === 'col1' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-slate-800 text-slate-400 hover:bg-slate-800/30'
                        }`}
                      >
                        b[:, 1] (Col 1)
                      </button>
                      <button 
                        onClick={() => setNumpySlicingHighlight('none')}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold text-rose-400 border-rose-950/40 hover:bg-rose-950/25`}
                      >
                        Clear Slice
                      </button>
                    </div>
                  </div>
                </div>

                {/* Console Log output */}
                <div className="flex flex-col border border-slate-800/60 bg-black rounded-xl p-4 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Interactive Terminal Output</span>
                  <div className="text-cyan-400 whitespace-pre bg-slate-900/50 p-3 rounded-lg border border-slate-950">
                    {numpyResult}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TENSORFLOW / PYTORCH */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div>
                  <h4 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" /> Stage 2: TensorFlow Setup
                  </h4>
                  <p className="text-xs text-slate-400">
                    Define structural networks using Keras Sequential models, mount hidden Dense layers, compile with binary crossentropy loss, and setup Adam optimizers.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Code Panel */}
                  <div className="flex flex-col border border-slate-800/70 bg-slate-950 rounded-xl overflow-hidden font-mono text-xs">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
                      <span>KERAS_MODEL_BUILD.PY</span>
                      <span className="text-cyan-400 font-semibold">TensorFlow Keras</span>
                    </div>
                    <div className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
{`from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Instantiate Sequential Model
model = Sequential()

# Hidden Dense Layer: 8 nodes, relu activation
model.add(Dense(8, input_dim=2, activation='relu'))

# Output Layer: 1 node, sigmoid activation
model.add(Dense(1, activation='sigmoid'))

# Compile Optimizer, Loss & metrics
model.compile(loss='binary_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])`}
                    </div>
                    <div className="p-3 bg-slate-900/40 border-t border-slate-800 flex justify-end">
                      <button 
                        onClick={runNnTraining}
                        disabled={isRunning}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} /> 
                        {isRunning ? 'Fitting epochs...' : 'Compile & Train Model'}
                      </button>
                    </div>
                  </div>

                  {/* Neural Net Graph Node Visualization */}
                  <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Active Model Layers</span>
                      <span className="text-[10px] text-slate-400">Visual mapping of inputs to Dense layers & predictions.</span>
                    </div>

                    <div className="flex items-center justify-between bg-black/40 border border-slate-800/40 p-4 rounded-xl min-h-[180px]">
                      
                      {/* Input (2 dims) */}
                      <div className="flex flex-col gap-6 items-center">
                        <span className="text-[10px] font-bold text-slate-400">Input (dim=2)</span>
                        <div className="w-8 h-8 rounded-full border border-cyan-500/50 bg-cyan-950/40 flex items-center justify-center text-[10px] text-cyan-300">X₁</div>
                        <div className="w-8 h-8 rounded-full border border-cyan-500/50 bg-cyan-950/40 flex items-center justify-center text-[10px] text-cyan-300">X₂</div>
                      </div>

                      {/* Dense Hidden (8 dims) */}
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] font-bold text-slate-400">Dense_1 (8 nodes)</span>
                        <div className="grid grid-cols-2 gap-1">
                          {neuronActivations.map((act, i) => (
                            <div 
                              key={i} 
                              className="w-5 h-5 rounded-full border border-blue-500/40 transition-all duration-300"
                              style={{ backgroundColor: `rgba(59, 130, 246, ${Math.max(0.1, act)})` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Sigmoid output (1 dim) */}
                      <div className="flex flex-col gap-2 items-center">
                        <span className="text-[10px] font-bold text-slate-400">Output (sigmoid)</span>
                        <div className="w-10 h-10 rounded-full border border-cyan-400 bg-cyan-500/10 flex items-center justify-center text-[11px] font-bold text-cyan-300">
                          {accuracy > 0.8 ? 'y ≈ 1' : 'y ≈ 0'}
                        </div>
                      </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-lg text-center">
                        <span className="text-[9px] text-slate-400 uppercase block">Epochs</span>
                        <span className="text-sm font-black text-cyan-400">{epochs}/50</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-lg text-center">
                        <span className="text-[9px] text-slate-400 uppercase block">Binary Loss</span>
                        <span className="text-sm font-black text-rose-400">{loss.toFixed(4)}</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-lg text-center">
                        <span className="text-[9px] text-slate-400 uppercase block">Accuracy</span>
                        <span className="text-sm font-black text-emerald-400">{(accuracy * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Console output log */}
                <div className="flex flex-col border border-slate-800/60 bg-black rounded-xl p-4 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Keras Train Logs</span>
                  <div ref={kerasLogsRef} className="bg-slate-900/50 p-3 rounded-lg border border-slate-950 max-h-[140px] overflow-y-auto cyber-scrollbar flex flex-col gap-1 text-slate-400">
                    {trainingLogs.length === 0 ? (
                      <div className="text-slate-600 italic">No model fit history yet. Click "Compile & Train Model" above.</div>
                    ) : (
                      trainingLogs.map((log, idx) => (
                        <div key={idx} className={log.includes('SUCCESS') ? 'text-cyan-400 font-bold' : ''}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BUILD SIMPLE NEURAL NETWORKS */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div>
                  <h4 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" /> Stage 3: Build Simple Neural Networks
                  </h4>
                  <p className="text-xs text-slate-400">
                    Build multi-layer perceptions. Predict outcomes from test feature vectors and evaluate intermediate nodes.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Parameter Controller */}
                  <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Interactive Feature Settings</span>
                      <span className="text-[10px] text-slate-400">Slide inputs to feed custom features into the trained model.</span>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Feature 1 */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">Feature 1 (X₁ value):</span>
                          <span className="text-cyan-400 font-mono">{nnInputs[0].toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.05"
                          value={nnInputs[0]}
                          onChange={(e) => setNnInputs([parseFloat(e.target.value), nnInputs[1]])}
                          className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Feature 2 */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">Feature 2 (X₂ value):</span>
                          <span className="text-cyan-400 font-mono">{nnInputs[1].toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.05"
                          value={nnInputs[1]}
                          onChange={(e) => setNnInputs([nnInputs[0], parseFloat(e.target.value)])}
                          className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={runPrediction}
                      className="mt-2 w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/45"
                    >
                      <Target className="w-4 h-4 text-white" /> Compute Sigmoid Prediction
                    </button>
                  </div>

                  {/* Prediction Results Panel */}
                  <div className="flex flex-col border border-slate-800/70 bg-slate-950 rounded-xl overflow-hidden font-mono text-xs">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
                      <span>PREDICTION_INTELLIGENCE.TXT</span>
                      <span className="text-emerald-400 font-semibold">Live Model Forward Pass</span>
                    </div>
                    <div className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
{`# Binary Sigmoid Logic Evaluator
# Formulation: Sigmoid( X1 * w1 + X2 * w2 + b )

[NETWORK VALUES]
Input Feature Vector: [${nnInputs[0].toFixed(2)}, ${nnInputs[1].toFixed(2)}]
Classification Prediction:
${predictionResult}`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REINFORCEMENT LEARNING */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div>
                  <h4 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" /> Stage 4: Reinforcement Learning (Q-learning & DQN)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Simulate MDP environments. Optimize a Q-table containing 5 States and 2 Actions using the temporal difference Q-learning algorithm.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Parameter sliders */}
                  <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Hyperparameters & Actions</span>
                      <span className="text-[10px] text-slate-400">Configure parameters for the active Temporal Difference formula.</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* Alpha */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Alpha (Learning rate):</span>
                          <span className="text-cyan-400 font-mono">{alpha.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" min="0.01" max="0.5" step="0.05" value={alpha}
                          onChange={(e) => setAlpha(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                        />
                      </div>

                      {/* Gamma */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Gamma (Discount factor):</span>
                          <span className="text-cyan-400 font-mono">{gamma.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" min="0.1" max="0.99" step="0.05" value={gamma}
                          onChange={(e) => setGamma(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                        />
                      </div>

                      {/* Epsilon */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Epsilon (Exploration rate):</span>
                          <span className="text-cyan-400 font-mono">{epsilon.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" min="0.01" max="0.5" step="0.05" value={epsilon}
                          onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={runQLearning}
                        disabled={isRunning}
                        className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-white" /> Run 100 Episodes
                      </button>
                      <button 
                        onClick={() => {
                          setQTable([
                            [0.0, 0.0],
                            [0.0, 0.0],
                            [0.0, 0.0],
                            [0.0, 0.0],
                            [0.0, 0.0]
                          ]);
                          setQEpisodes(0);
                          setQLogs(['[SYSTEM] Q-Table reset to zeros.']);
                        }}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-lg text-xs font-bold transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Q-Table visualization */}
                  <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-4 gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Current Q-Table Values</span>
                      <span className="text-[10px] text-slate-400">Reward favors Action 1 (Right). Check how values peak on right column.</span>
                    </div>

                    <div className="bg-black/40 border border-slate-800/40 p-3 rounded-lg overflow-x-auto">
                      <table className="w-full text-left font-mono text-[10px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500">
                            <th className="py-1">State</th>
                            <th className="py-1 text-right">Action 0 (Left)</th>
                            <th className="py-1 text-right text-cyan-400">Action 1 (Right)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {qTable.map((row, stateIdx) => (
                            <tr key={stateIdx} className="border-b border-slate-900 hover:bg-slate-900/40 text-slate-300">
                              <td className="py-1 font-semibold text-slate-400">S = {stateIdx}</td>
                              <td className="py-1 text-right">{row[0].toFixed(4)}</td>
                              <td className="py-1 text-right text-cyan-300 font-bold">{row[1].toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-[10px] text-slate-500 text-right">Total Episodes Simmed: <span className="text-cyan-400 font-bold">{qEpisodes}</span></div>
                  </div>
                </div>

                {/* Console logs */}
                <div className="flex flex-col border border-slate-800/60 bg-black rounded-xl p-4 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Q-Learning Logs</span>
                  <div ref={qLogsRef} className="bg-slate-900/50 p-3 rounded-lg border border-slate-950 max-h-[140px] overflow-y-auto cyber-scrollbar flex flex-col gap-1 text-slate-400">
                    {qLogs.map((log, idx) => (
                      <div key={idx} className={log.includes('SUCCESS') ? 'text-cyan-400 font-bold' : ''}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: SMALL AI PROJECTS */}
            {currentStep === 5 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div>
                  <h4 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" /> Stage 5: Build Small AI Projects
                  </h4>
                  <p className="text-xs text-slate-400">
                    Combine your knowledge. Build complete sandboxed mini-projects like active NLP Sentiment Classifiers.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Interactive Sandbox Input */}
                  <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Mini Project: Sentiment Classifier</span>
                      <span className="text-[10px] text-slate-400">Type a test review below to run on-the-fly heuristic classifier inference.</span>
                    </div>

                    <textarea
                      rows={3}
                      value={projectPrompt}
                      onChange={(e) => setProjectPrompt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-200 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    />

                    <button
                      onClick={runProjectInference}
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-4 h-4 text-white" /> Analyze Sentiment Score
                    </button>
                  </div>

                  {/* Classifier Metrics Panel */}
                  <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-4 gap-4">
                    <span className="text-xs font-bold text-slate-200">Inference Response metrics</span>

                    {projectSentiment ? (
                      <div className="flex flex-col gap-4 bg-black/40 border border-slate-800/40 p-4 rounded-xl flex-1 justify-center">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Calculated Sentiment:</span>
                          <span className="text-sm font-black text-cyan-300">{projectSentiment.label}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Positivity Probability:</span>
                            <span>{(projectSentiment.score * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-cyan-400 h-full transition-all duration-300" 
                              style={{ width: `${projectSentiment.score * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 italic text-xs min-h-[120px]">
                        Click "Analyze Sentiment Score" to see values.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: EXPAND INTO CNN, RNN, LSTM */}
            {currentStep === 6 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div>
                  <h4 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-cyan-400" /> Stage 6: Expand into CNN, RNN, LSTM
                  </h4>
                  <p className="text-xs text-slate-400">
                    Learn spatial operations with 2D Convolution kernels, temporal sequences using Recurrent layers, and gate arrays in LSTMs.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* CNN Kernel Visualizer */}
                  <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">CNN 3x3 Kernel Filtering (Live Simulation)</span>
                      <span className="text-[10px] text-slate-400">Shows filter sliding across a 2D grid to compose downsampled feature maps.</span>
                    </div>

                    <div className="flex items-center justify-center bg-black/40 border border-slate-800/40 p-4 rounded-xl min-h-[140px] gap-6">
                      {/* Grid representation */}
                      <div className="grid grid-cols-4 gap-1 font-mono text-[9px]">
                        {Array.from({ length: 16 }).map((_, idx) => {
                          const isKernelActive = 
                            cnnStep === 0 && [0,1,4,5].includes(idx) ||
                            cnnStep === 1 && [1,2,5,6].includes(idx) ||
                            cnnStep === 2 && [4,5,8,9].includes(idx) ||
                            cnnStep === 3 && [5,6,9,10].includes(idx) ||
                            cnnStep === 4 && [8,9,12,13].includes(idx);
                          return (
                            <div 
                              key={idx} 
                              className={`w-7 h-7 border flex items-center justify-center transition-all duration-300 rounded ${
                                isKernelActive ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 scale-105' : 'border-slate-800 text-slate-500'
                              }`}
                            >
                              {(Math.random() * 9).toFixed(0)}
                            </div>
                          );
                        })}
                      </div>

                      <ArrowRight className="w-5 h-5 text-slate-600" />

                      {/* Feature map composed */}
                      <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                        <div className={`w-10 h-10 border rounded flex items-center justify-center ${cnnStep >= 1 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-slate-900 text-slate-700'}`}>0.84</div>
                        <div className={`w-10 h-10 border rounded flex items-center justify-center ${cnnStep >= 2 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-slate-900 text-slate-700'}`}>0.92</div>
                        <div className={`w-10 h-10 border rounded flex items-center justify-center ${cnnStep >= 3 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-slate-900 text-slate-700'}`}>0.31</div>
                        <div className={`w-10 h-10 border rounded flex items-center justify-center ${cnnStep >= 4 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-slate-900 text-slate-700'}`}>0.47</div>
                      </div>
                    </div>
                  </div>

                  {/* LSTM memory gate desc */}
                  <div className="flex flex-col border border-slate-800/70 bg-slate-950 rounded-xl overflow-hidden font-mono text-xs">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
                      <span>LSTM_CELL_GATE.TXT</span>
                      <span className="text-cyan-400 font-semibold">Sequence Memory Gate</span>
                    </div>
                    <div className="p-4 overflow-x-auto text-slate-300 whitespace-pre">
{`# Memory gate equations simulated:
Forget Gate: f_t = Sigmoid( W_f * [h_{t-1}, x_t] + b_f )
Input Gate:  i_t = Sigmoid( W_i * [h_{t-1}, x_t] + b_i )
Output Gate: o_t = Sigmoid( W_o * [h_{t-1}, x_t] + b_o )

[LATEST SEQUENCE ITERATION]
${lstmCellState}
- Cell State Updated: c_t = f_t * c_{t-1} + i_t * tanh(...)
- Hidden output: h_t = o_t * tanh(c_t)

* Sequential gates maintain context without gradients exploding!`}
                    </div>
                    <div className="p-3 bg-slate-900/40 border-t border-slate-800 flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setLstmCellState(`Forget Gate Activation: 0.12 (discard past context)\nInput Gate Activation: 0.89 (learn current token)`);
                          awardXP('lstm_word1', 20, 'LSTM Cell Gate Word 1 Simulation');
                        }}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Sim Step (Word 1)
                      </button>
                      <button 
                        onClick={() => {
                          setLstmCellState(`Forget Gate Activation: 0.94 (retain context)\nInput Gate Activation: 0.43 (partial learn)`);
                          awardXP('lstm_word2', 20, 'LSTM Cell Gate Word 2 Simulation');
                        }}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Sim Step (Word 2)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: BUILD FULL AI SYSTEMS */}
            {currentStep === 7 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div>
                  <h4 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" /> Stage 7: Build Full AI Systems
                  </h4>
                  <p className="text-xs text-slate-400">
                    Design and integrate end-to-end pipelines including production serving API endpoints, feature stores, and automated feedback telemetry.
                  </p>
                </div>

                {/* Flow Diagram */}
                <div className="flex flex-col border border-slate-800/60 bg-[#0d1220]/60 rounded-xl p-6 gap-6">
                  <span className="text-xs font-bold text-slate-200">System Serving Architecture</span>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Block 1 */}
                    <div className="w-full md:w-1/4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col gap-1 items-center text-center">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs mb-1">01</div>
                      <span className="text-xs font-bold text-slate-200">Data Store</span>
                      <span className="text-[10px] text-slate-400 leading-tight">GCP Spanner, BigQuery & dynamic Firestore rules.</span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-600 hidden md:block" />

                    {/* Block 2 */}
                    <div className="w-full md:w-1/4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col gap-1 items-center text-center">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-xs mb-1">02</div>
                      <span className="text-xs font-bold text-slate-200">Model Registry</span>
                      <span className="text-[10px] text-slate-400 leading-tight">Serving compiled models & weights in cloud pipelines.</span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-600 hidden md:block" />

                    {/* Block 3 */}
                    <div className="w-full md:w-1/4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col gap-1 items-center text-center">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs mb-1">03</div>
                      <span className="text-xs font-bold text-slate-200">REST API Gateway</span>
                      <span className="text-[10px] text-slate-400 leading-tight">Secure Express endpoints processing client inferences.</span>
                    </div>
                  </div>

                  <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex items-center gap-3 text-cyan-300 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>
                      <strong>Course Certification</strong>: You've walked through the essential learning roadmap of AI engineering from linear arrays up to multi-agent deployment strategies. Tap into the Death copilot helper whenever you require deep context help formatting code.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: ANDROID BOT TRAINER & RAG CONSOLE */}
            {currentStep === 8 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" /> Stage 8: Production-Grade RAG & SFT Pipeline
                    </h4>
                    <p className="text-xs text-slate-400">
                      Live semantic RAG knowledge base using Gemini Embeddings connected to a Supervised Fine-Tuning (SFT) reinforcement feedback loop.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Pipeline Views:</span>
                    <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                      <button
                        onClick={() => { setSpecTab('roadmap'); setShowAddSnippet(false); }}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                          specTab === 'roadmap' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Knowledge Corpus ({ragStats.totalChunks})
                      </button>
                      <button
                        onClick={() => { setSpecTab('curriculum'); setShowAddSnippet(false); }}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                          specTab === 'curriculum' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        SFT Pool ({ragStats.sftDatasetSize})
                      </button>
                      <button
                        onClick={() => { setSpecTab('multi_agent'); setShowAddSnippet(false); }}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                          specTab === 'multi_agent' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🛡️ Multi-Agent
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* LEFT COLUMN: BOT TRAINER ENGINE */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="border border-slate-800 bg-[#0d1220]/60 p-4 rounded-xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">SFT Calibration Loop</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          botTrainingStatus === 'completed' 
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                            : botTrainingStatus === 'running'
                              ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 animate-pulse'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                        }`}>
                          {botTrainingStatus === 'completed' ? '● Aligned' : botTrainingStatus === 'running' ? '● Training...' : '● Standby'}
                        </span>
                      </div>

                      {/* Engine Stats */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-lg text-center font-mono">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Adapter ID</span>
                          <span className="text-[10px] font-black text-rose-400 truncate max-w-[120px]">{ragStats.activeAdapterVersion}</span>
                        </div>
                        <div className="flex flex-col border-l border-slate-850">
                          <span className="text-[9px] text-slate-400 uppercase font-bold">RAG Accuracy (Judge)</span>
                          <span className="text-xs font-black text-emerald-400">{(ragStats.averageFaithfulness * 100).toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] text-slate-400 leading-none">
                          <span className="font-semibold">SFT Loss Optimization</span>
                          <span className="font-mono font-bold text-slate-200">{botTrainingProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mt-1 border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full transition-all duration-300" 
                            style={{ width: `${botTrainingProgress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={runBotTraining}
                        disabled={isTraining}
                        className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isTraining
                            ? 'bg-slate-800 text-slate-500 border border-slate-700/40'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] font-extrabold'
                        }`}
                      >
                        {isTraining ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                            Optimizing SFT Weights...
                          </>
                        ) : botTrainingStatus === 'completed' ? (
                          <>
                            <RefreshCw className="w-4 h-4 text-slate-900" />
                            Re-calibrated (Run Again)
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 text-slate-900" />
                            Consolidate SFT Rules
                          </>
                        )}
                      </button>
                    </div>

                    {/* Live Training Log Outputs */}
                    <div className="flex-1 min-h-[180px] flex flex-col border border-slate-800 bg-slate-950/60 p-3 rounded-xl gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">SFT Console Output</span>
                      <div 
                        ref={botLogsRef}
                        className="flex-1 overflow-y-auto max-h-[220px] font-mono text-[9px] text-slate-300 flex flex-col gap-1.5 pr-1 cyber-scrollbar"
                      >
                        {botTrainingLogs.length === 0 ? (
                          <span className="text-slate-600 italic">Console standby. Give Helpful (👍) ratings below to harvest SFT signals, then hit "Consolidate SFT Rules" to fine-tune active policies dynamically.</span>
                        ) : (
                          botTrainingLogs.map((log, index) => (
                            <div key={index} className="leading-normal break-all">
                              {log.startsWith('✅') || log.includes('SUCCESS') ? (
                                <span className="text-emerald-400 font-bold">{log}</span>
                              ) : log.startsWith('[RAG]') ? (
                                <span className="text-cyan-400 font-semibold">{log}</span>
                              ) : log.startsWith('[FT]') || log.startsWith('[SFT]') ? (
                                <span className="text-indigo-400 font-semibold">{log}</span>
                              ) : log.startsWith('[SYSTEM]') ? (
                                <span className="text-yellow-400 font-semibold">{log}</span>
                              ) : (
                                <span className="text-slate-400">{log}</span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: RAG INTERACTIVE RETRIEVER & SPECTABS */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* DOCUMENT SPECS PANEL */}
                    {specTab === 'roadmap' && !showAddSnippet && (
                      <div className="border border-slate-800/60 bg-[#0d1220]/60 p-4 rounded-xl flex flex-col gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                              <Target className="w-4 h-4" />
                            </span>
                            <span className="text-xs font-bold text-slate-200">Active RAG Knowledge Corpus</span>
                          </div>
                          <button
                            onClick={() => setShowAddSnippet(true)}
                            className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 font-bold text-[10px] rounded-md transition-colors cursor-pointer"
                          >
                            + Ingest Snippet
                          </button>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          These represent high-fidelity semantic blocks of the <strong>Google Android Advanced Developer Course</strong> indexed into the active Vector library for grounded generation.
                        </p>
                        <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 pr-1 cyber-scrollbar">
                          {ragDocuments.map((doc, idx) => (
                            <div key={idx} className="p-2 bg-slate-900/50 border border-slate-850 rounded-lg flex justify-between items-center text-[10px]">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-indigo-300 font-bold leading-none">{doc.title}</span>
                                <span className="text-[9px] text-slate-500 truncate max-w-[280px]">{doc.content}</span>
                              </div>
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono">
                                {doc.category}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {showAddSnippet && (
                      <form onSubmit={addCustomSnippet} className="border border-cyan-800/60 bg-cyan-950/10 p-4 rounded-xl flex flex-col gap-3 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">Ingest New Custom Chunk</span>
                          <button
                            type="button"
                            onClick={() => setShowAddSnippet(false)}
                            className="text-slate-400 hover:text-slate-200 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Title (e.g. 'Advanced Compose SideEffects')"
                            value={newSnippet.title}
                            onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                            required
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-[10.5px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                          />
                          <select
                            value={newSnippet.category}
                            onChange={(e) => setNewSnippet({ ...newSnippet, category: e.target.value })}
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-[10.5px] text-slate-200 focus:outline-none focus:border-cyan-500"
                          >
                            <option value="core_android">Core Android</option>
                            <option value="ui_ux">UI & UX</option>
                            <option value="data_storage">Data Storage</option>
                            <option value="advanced_features">Advanced Features</option>
                            <option value="meta">Meta Principles</option>
                          </select>
                        </div>

                        <textarea
                          placeholder="Semantic documentation text chunk (Gemini will compute vector embeddings)..."
                          value={newSnippet.content}
                          onChange={(e) => setNewSnippet({ ...newSnippet, content: e.target.value })}
                          required
                          rows={2}
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-[10.5px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                        />

                        <textarea
                          placeholder="Optional Kotlin Code Payload..."
                          value={newSnippet.code}
                          onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                          rows={2}
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                        />

                        <button
                          type="submit"
                          className="w-full py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 font-extrabold text-[11px] rounded-lg cursor-pointer hover:opacity-90"
                        >
                          Embed & Ingest to RAG
                        </button>
                      </form>
                    )}

                    {specTab === 'curriculum' && (
                      <div className="border border-slate-800/60 bg-[#0d1220]/60 p-4 rounded-xl flex flex-col gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                            <BookOpen className="w-4 h-4" />
                          </span>
                          <span className="text-xs font-bold text-slate-200">SFT (Supervised Fine-Tuning) Labeled Pool</span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          The active list of user-harvested interactions in <strong>sft_training_pool.json</strong> used to refine and calibrate bot responses.
                        </p>
                        <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 pr-1 cyber-scrollbar">
                          {ragStats.sftDatasetSize === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-[10px] italic">
                              SFT training pool is currently empty. Ask questions in the query panel below and click Helpful (👍) to harvest interactions!
                            </div>
                          ) : (
                            <div className="text-[9px] font-mono text-indigo-300 whitespace-pre bg-slate-950 p-2.5 rounded-lg border border-slate-900 overflow-x-auto max-h-[120px] cyber-scrollbar">
                              {JSON.stringify(ragStats, null, 2)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {specTab === 'multi_agent' && (
                      <div className="border border-slate-800/60 bg-[#0d1220]/60 p-4 rounded-xl flex flex-col gap-4 animate-in fade-in duration-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 animate-pulse">
                              <Layers className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-200 block">X-Style Multi-Agent RAG System (Balanced Mode)</span>
                              <span className="text-[9px] text-slate-500">The ultimate synergy of safety, accuracy, speed, and creative learning</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={runMultiAgentSimulation}
                            disabled={multiAgentStep !== 'idle' && multiAgentStep !== 'done'}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              multiAgentStep !== 'idle' && multiAgentStep !== 'done'
                                ? 'bg-indigo-950/20 border border-indigo-800/40 text-indigo-400/50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/15'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {multiAgentStep === 'idle' ? 'Run Pipeline Simulation' : multiAgentStep === 'done' ? 'Restart Simulation' : 'Pipeline Running...'}
                          </button>
                        </div>

                        {/* Visual Node Sequence Tracker */}
                        <div className="flex flex-col bg-slate-950/40 border border-slate-900 rounded-lg p-3 gap-2">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">PIPELINE SEQUENCE STATUS:</span>
                          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 text-[9px]">
                            {/* Node 1: Domain Agent */}
                            <div className={`px-2 py-1 rounded border transition-all ${
                              multiAgentStep === 'domain_draft' 
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 scale-105 font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                              🤖 Domain Draft
                            </div>

                            <ChevronRight className="w-3 h-3 text-slate-600" />

                            {/* Node 2: PoliceAI */}
                            <div className={`px-2 py-1 rounded border transition-all ${
                              multiAgentStep === 'police_check' 
                                ? 'bg-indigo-500/25 border-indigo-500 text-indigo-300 scale-105 font-bold shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                              🛡️ PoliceAI Review
                            </div>

                            <ChevronRight className="w-3 h-3 text-slate-600" />

                            {/* Node 3: InternetCheckAI */}
                            <div className={`px-2 py-1 rounded border transition-all ${
                              multiAgentStep === 'internet_verify' 
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 scale-105 font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                              🌐 InternetCheckAI
                            </div>

                            <ChevronRight className="w-3 h-3 text-slate-600" />

                            {/* Node 4: Domain Revise */}
                            <div className={`px-2 py-1 rounded border transition-all ${
                              multiAgentStep === 'domain_revise' 
                                ? 'bg-teal-500/20 border-teal-500 text-teal-300 scale-105 font-bold shadow-[0_0_12px_rgba(20,184,166,0.15)]' 
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                              🔄 Revision Draft
                            </div>

                            <ChevronRight className="w-3 h-3 text-slate-600" />

                            {/* Node 5: Self-Improvement Agent */}
                            <div className={`px-2 py-1 rounded border transition-all ${
                              multiAgentStep === 'self_improve' 
                                ? 'bg-rose-500/20 border-rose-500 text-rose-300 scale-105 font-bold shadow-[0_0_12px_rgba(244,63,94,0.15)]' 
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}>
                              🧠 Self-Improvement
                            </div>
                          </div>
                        </div>

                        {/* Pipeline Console Outputs */}
                        {multiAgentLogs.length > 0 && (
                          <div className="flex flex-col border border-slate-900 bg-slate-950 p-2.5 rounded-lg gap-1.5 font-mono text-[9px] text-slate-300 max-h-[140px] overflow-y-auto">
                            {multiAgentLogs.map((log, index) => (
                              <div key={index} className="leading-normal">
                                {log.startsWith('🛡️') ? (
                                  <span className="text-indigo-400 font-semibold">{log}</span>
                                ) : log.startsWith('🌐') ? (
                                  <span className="text-amber-400 font-semibold">{log}</span>
                                ) : log.startsWith('🧠') ? (
                                  <span className="text-rose-400 font-semibold">{log}</span>
                                ) : log.startsWith('✅') ? (
                                  <span className="text-emerald-400 font-bold">{log}</span>
                                ) : (
                                  <span className="text-slate-400">{log}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Balanced Mode Agents Roles Specifications */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40 flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🛡️</span>
                              <span className="text-[10px] font-bold text-indigo-300">PoliceAI Agent</span>
                            </div>
                            <span className="text-[9px] text-slate-400 leading-normal">
                              Enforces design standards, safety protocols, legality, and domain guidelines. Moderates and revises outputs from other agents.
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40 flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🌐</span>
                              <span className="text-[10px] font-bold text-amber-300">InternetCheckAI</span>
                            </div>
                            <span className="text-[9px] text-slate-400 leading-normal">
                              Verifies claims dynamically, calculates confidence ratings (0–1), fetches external references, and suggests targeted corrections.
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg border border-slate-800 bg-[#0d1220]/60 flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🧠</span>
                              <span className="text-[10px] font-bold text-rose-300">Self-Improvement</span>
                            </div>
                            <span className="text-[9px] text-slate-400 leading-normal">
                              Reflects when precision falls or errors arise. Synthesizes structured improvement chunks under separate, non-overlapping namespaces.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LIVE QUERY INVOCATION */}
                    <div className="border border-slate-850 bg-slate-950/40 p-3 rounded-xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">Semantic Search & Grounding Engine</span>
                        <span className="text-[9px] text-slate-500">Live Gemini-Powered RAG Testbed</span>
                      </div>

                      {/* Manual query text box */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type any custom question... e.g., 'How to use Coroutines safely in custom view?'"
                          value={manualQueryText}
                          onChange={(e) => setManualQueryText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && manualQueryText && !isQuerying) {
                              runBotQuery(manualQueryText, manualQueryText);
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-[#0d1220]/60 border border-slate-800 rounded-lg text-[10.5px] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={() => runBotQuery(manualQueryText || 'custom', manualQueryText)}
                          disabled={isQuerying || !manualQueryText}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 text-slate-900 font-extrabold rounded-lg text-[10.5px] cursor-pointer transition-all shadow-md active:scale-95 animate-pulse"
                        >
                          {isQuerying ? 'Querying...' : 'Search RAG'}
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-cyan-500/80 uppercase tracking-wider">Or Use Preset Syllabus Queries:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'fragment', label: 'Fragment Lifecycle' },
                            { id: 'room', label: 'Room Database DAO' },
                            { id: 'location', label: 'Fused Location API' },
                            { id: 'custom_view', label: 'Custom Canvas View' },
                            { id: 'widgets', label: 'Home App Widgets' },
                            { id: 'meta_rag', label: 'Why RAG is Needed' },
                            { id: 'meta_identity', label: 'Bot Identity & Prompts' },
                            { id: 'meta_override', label: 'Override Rules' },
                            { id: 'free_ai_resources', label: 'Free AI Resources' }
                          ].map((preset) => (
                            <button
                              key={preset.id}
                              disabled={isQuerying}
                              onClick={() => runBotQuery(preset.id)}
                              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                botActiveQuery === preset.id 
                                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-black' 
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* RAG RESPONSE PREVIEW */}
                      {isQuerying ? (
                        <div className="p-8 border border-slate-800 text-center rounded-lg flex flex-col items-center justify-center gap-3 bg-slate-950/40">
                          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                          <span className="text-xs font-bold text-slate-400">Performing Vector Similarity Search & LLM Grounding...</span>
                          <span className="text-[10px] text-slate-500">Retrieving Top-3 Chunks from Firestore, parsing relevance, and synthesizing answer.</span>
                        </div>
                      ) : botQueryResponse ? (
                        <div className="flex flex-col border border-slate-800 bg-[#070b13]/80 p-3.5 rounded-lg gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-cyan-400 tracking-tight leading-none">{botQueryResponse.title}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/40 text-cyan-300 uppercase leading-none font-bold font-mono">
                                latency: {botQueryResponse.latencyMs ? `${botQueryResponse.latencyMs}ms` : 'fast'}
                              </span>
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800/40 text-indigo-300 uppercase leading-none font-bold font-mono">
                                source: {botQueryResponse.source}
                              </span>
                            </div>
                          </div>

                          <div className="text-[10.5px] text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded border border-slate-900 whitespace-pre-wrap">
                            <strong>Synthesized Grounded Answer:</strong>
                            <div className="mt-1 text-slate-200">{botQueryResponse.content}</div>
                          </div>

                          {/* LLM-as-a-Judge Evaluation Metrices */}
                          {botQueryResponse.evaluation && (
                            <div className="flex flex-col bg-slate-950/60 p-2.5 rounded-lg border border-slate-900/80 gap-2">
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider">LLM-as-a-Judge Pipeline Evaluation Metrics</span>
                              <div className="grid grid-cols-3 gap-3">
                                {/* Faithfulness */}
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase leading-none">
                                    <span>Faithfulness</span>
                                    <span className="font-mono text-emerald-400">{(botQueryResponse.evaluation.faithfulness * 100).toFixed(0)}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden border border-slate-800">
                                    <div className="bg-emerald-500 h-full" style={{ width: `${botQueryResponse.evaluation.faithfulness * 100}%` }} />
                                  </div>
                                </div>
                                {/* Answer Relevance */}
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase leading-none">
                                    <span>Relevance</span>
                                    <span className="font-mono text-cyan-400">{(botQueryResponse.evaluation.answerRelevance * 100).toFixed(0)}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden border border-slate-800">
                                    <div className="bg-cyan-500 h-full" style={{ width: `${botQueryResponse.evaluation.answerRelevance * 100}%` }} />
                                  </div>
                                </div>
                                {/* Context Recall */}
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase leading-none">
                                    <span>Context Recall</span>
                                    <span className="font-mono text-rose-400">{(botQueryResponse.evaluation.contextRecall * 100).toFixed(0)}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden border border-slate-800">
                                    <div className="bg-rose-500 h-full" style={{ width: `${botQueryResponse.evaluation.contextRecall * 100}%` }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {botQueryResponse.code && (
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase leading-none">
                                <span>Synthesized Code Payload</span>
                                <span>Kotlin Code Output</span>
                              </div>
                              <pre className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-[9px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[160px] cyber-scrollbar">
                                <code>{botQueryResponse.code}</code>
                              </pre>
                            </div>
                          )}

                          {/* REINFORCEMENT FEEDBACK / SFT HARVESTER LOOP */}
                          <div className="pt-2 border-t border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-400 font-medium">Was this synthesis grounded and accurate?</span>
                            <div className="flex items-center gap-1.5">
                              {feedbackRatingStatus === null ? (
                                <>
                                  <button
                                    onClick={() => submitFeedback('positive')}
                                    className="px-2.5 py-1 bg-emerald-950/50 hover:bg-emerald-950 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    👍 Grounded (Harvest SFT)
                                  </button>
                                  <button
                                    onClick={() => submitFeedback('negative')}
                                    className="px-2.5 py-1 bg-rose-950/50 hover:bg-rose-950 border border-rose-500/30 hover:border-rose-500 text-rose-400 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    👎 Needs Fine-Tuning
                                  </button>
                                </>
                              ) : feedbackRatingStatus === 'positive' ? (
                                <span className="text-[10px] font-bold text-emerald-400 animate-pulse flex items-center gap-1">
                                  🎉 Verified Helpful! Interaction harvested into SFT Dataset pool.
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-400 animate-pulse flex items-center gap-1">
                                  ⚠️ Noted. SFT flag registered. This query will be weighted for SFT calibration.
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Source Matches (Retrieved Chunks) */}
                          {botQueryResponse.retrievedChunks && botQueryResponse.retrievedChunks.length > 0 && (
                            <div className="flex flex-col bg-[#0d1220]/60 p-2 rounded border border-slate-900/60 gap-1.5">
                              <span className="text-[8.5px] text-slate-500 font-bold uppercase leading-none">Top Retrieved Sources Matched by Cosine Similarity</span>
                              <div className="flex flex-col gap-1">
                                {botQueryResponse.retrievedChunks.slice(0, 2).map((chunk: any, i: number) => (
                                  <div key={i} className="text-[9px] text-slate-400 flex items-center justify-between">
                                    <span className="truncate max-w-[280px]">📌 {chunk.title}: "{chunk.content.slice(0, 70)}..."</span>
                                    <span className="text-cyan-500 font-mono font-bold shrink-0">Similarity: {chunk.similarity ? chunk.similarity.toFixed(4) : '0.8500'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-8 border border-dashed border-slate-800 text-center rounded-lg flex flex-col items-center justify-center gap-2 text-slate-500 bg-[#0d1220]/60">
                          <Zap className="w-5 h-5 text-cyan-500 animate-bounce" />
                          <span className="text-xs font-bold text-slate-300">RAG Semantic Search Testbed Idle</span>
                          <span className="text-[10px] text-slate-400">Type a custom question or select one of the core Android syllabus preset topics above!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: AUTONOMOUS ANDROID REFACTORER & EVOLUTION */}
            {currentStep === 9 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                  <div>
                    <h4 className="text-lg font-black text-indigo-400 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> Stage 9: Autonomous Android Refactorer
                    </h4>
                    <p className="text-xs text-slate-400">
                      An intelligent multi-agent pipeline that autonomously optimizes legacy Android codebases and expands its vector memory.
                    </p>
                  </div>
                  
                  {/* Stage 9 Navigation Tab Bar */}
                  <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg shrink-0">
                    <button
                      onClick={() => setActiveTabStage9('refactorer')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTabStage9 === 'refactorer' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ⚙️ Refactorer
                    </button>
                    <button
                      onClick={() => setActiveTabStage9('xp_hub')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTabStage9 === 'xp_hub' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🏆 XP Progression
                    </button>
                    <button
                      onClick={() => setActiveTabStage9('autonomy_upgrade')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTabStage9 === 'autonomy_upgrade' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🧠 Autonomy Upgrade
                    </button>
                    <button
                      onClick={() => setActiveTabStage9('knowledge')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTabStage9 === 'knowledge' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📚 Knowledge Expansion
                    </button>
                  </div>
                </div>

                {/* TAB 1: AUTONOMOUS REFACTORER */}
                {activeTabStage9 === 'refactorer' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in duration-200">
                    {/* LEFT CONTROLS & LOGS */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      {/* Scenario Selector */}
                      <div className="border border-slate-800 bg-slate-950/40 p-3 rounded-xl flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Optimizing Scenario:</span>
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              setRefactorScenario('coroutines_leak');
                              setAutonomousStep('idle');
                              setAutonomousLogs([]);
                            }}
                            className={`px-3 py-2 rounded-lg border text-left text-[10.5px] transition-all flex items-center justify-between cursor-pointer ${
                              refactorScenario === 'coroutines_leak'
                                ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="font-bold">⚡ Unstructured Coroutines Leak</span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Thread Safety</span>
                          </button>

                          <button
                            onClick={() => {
                              setRefactorScenario('compose_performance');
                              setAutonomousStep('idle');
                              setAutonomousLogs([]);
                            }}
                            className={`px-3 py-2 rounded-lg border text-left text-[10.5px] transition-all flex items-center justify-between cursor-pointer ${
                              refactorScenario === 'compose_performance'
                                ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="font-bold">🎨 Compose Laggy Recomposition</span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Layout Rendering</span>
                          </button>

                          <button
                            onClick={() => {
                              setRefactorScenario('security_storage');
                              setAutonomousStep('idle');
                              setAutonomousLogs([]);
                            }}
                            className={`px-3 py-2 rounded-lg border text-left text-[10.5px] transition-all flex items-center justify-between cursor-pointer ${
                              refactorScenario === 'security_storage'
                                ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="font-bold">🔐 Hardcoded Plaintext Credentials</span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Security</span>
                          </button>
                        </div>
                      </div>

                      {/* Action trigger */}
                      <button
                        onClick={runAutonomousRefactorSimulation}
                        disabled={autonomousStep !== 'idle' && autonomousStep !== 'completed'}
                        className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          autonomousStep !== 'idle' && autonomousStep !== 'completed'
                            ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-indigo-500/20'
                        }`}
                      >
                        <RefreshCw className={`w-4 h-4 ${autonomousStep !== 'idle' && autonomousStep !== 'completed' ? 'animate-spin' : ''}`} />
                        {autonomousStep === 'idle' ? 'Trigger Autonomous Refactor' : autonomousStep === 'completed' ? 'Restart Refactor Process' : 'Running Agent Pipeline...'}
                      </button>

                      {/* Console logs */}
                      <div className="flex flex-col bg-slate-950 border border-slate-900 rounded-xl p-3 gap-2 flex-1 min-h-[160px] max-h-[220px] overflow-y-auto cyber-scrollbar">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">PIPELINE EXECUTION FEED:</span>
                        {autonomousLogs.length > 0 ? (
                          <div className="flex flex-col gap-1.5 font-mono text-[9px] text-slate-300">
                            {autonomousLogs.map((log, i) => (
                              <div key={i} className="leading-relaxed">
                                {log.startsWith('⚠️') ? (
                                  <span className="text-rose-400 font-semibold">{log}</span>
                                ) : log.startsWith('🛡️') ? (
                                  <span className="text-indigo-400 font-semibold">{log}</span>
                                ) : log.startsWith('⚙️') ? (
                                  <span className="text-cyan-400 font-semibold">{log}</span>
                                ) : log.startsWith('🧠') ? (
                                  <span className="text-pink-400 font-semibold">{log}</span>
                                ) : log.startsWith('🚀') || log.startsWith('🏆') ? (
                                  <span className="text-emerald-400 font-bold">{log}</span>
                                ) : (
                                  <span className="text-slate-400">{log}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600 text-[10px] py-8">
                            <Zap className="w-5 h-5 text-slate-800 animate-pulse mb-1" />
                            <span>Pipeline Ready to Initialize.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT BEFORE/AFTER CODE VIEWER */}
                    <div className="lg:col-span-7 flex flex-col gap-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                        {/* Before (Legacy) */}
                        <div className="flex flex-col border border-slate-900 bg-[#060a12]/70 rounded-xl p-3 gap-2">
                          <div className="flex items-center justify-between border-b border-slate-900/60 pb-1.5">
                            <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                              ❌ Legacy Code (Vulnerable)
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">Unoptimized</span>
                          </div>
                          <pre className="p-2.5 bg-slate-950/60 border border-slate-900/80 rounded-lg text-[8.5px] font-mono text-slate-400 overflow-x-auto leading-relaxed max-h-[310px] overflow-y-auto cyber-scrollbar flex-1">
                            <code>
                              {refactorScenario === 'coroutines_leak' && (
                                `// Legacy Android Threading Code
class UserRepository {
    fun fetchUserData(userId: String) {
        // Blocks main thread for networking
        val url = URL("https://api.example.com/user/$userId")
        val connection = url.openConnection() as HttpURLConnection
        val data = connection.inputStream.bufferedReader().readText()
        
        // Memory leak: Launching un-scoped coroutine
        GlobalScope.launch {
            saveToDatabase(data)
        }
    }
}`
                              )}
                              {refactorScenario === 'compose_performance' && (
                                `// Laggy, Unoptimized Jetpack Compose Layout
@Composable
fun UserList(users: List<User>) {
    LazyColumn {
        // Missing keys causes complete list recomposition on single item update
        items(users) { user ->
            // Inefficient state calculation inside recomposition scope
            val filteredName = user.name.filter { it.isLetter() }
            Text(text = "Active user: $filteredName")
        }
    }
}`
                              )}
                              {refactorScenario === 'security_storage' && (
                                `// Dangerous Security Flaw (Vulnerable Storage)
class SecurityManager(val context: Context) {
    fun saveCredentials(token: String) {
        // Plain text local storage is easily inspectable on rooted devices
        val prefs = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE)
        prefs.edit().putString("auth_token", token).apply()
        
        // Security issue: Hardcoded API key
        val apiKey = "AIzaSyD_8283_DRAFT_KEY"
    }
}`
                              )}
                            </code>
                          </pre>
                        </div>

                        {/* After (Refactored) */}
                        <div className="flex flex-col border border-indigo-950/50 bg-[#090e1b]/70 rounded-xl p-3 gap-2">
                          <div className="flex items-center justify-between border-b border-indigo-950/60 pb-1.5">
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              ✨ Optimized Code (Stage 9)
                            </span>
                            <span className="text-[8px] text-indigo-400 font-mono">Autonomous Output</span>
                          </div>
                          
                          {autonomousStep === 'refactoring' || autonomousStep === 'improving' || autonomousStep === 'completed' ? (
                            <pre className="p-2.5 bg-slate-950/60 border border-indigo-950/80 rounded-lg text-[8.5px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[310px] overflow-y-auto cyber-scrollbar flex-1 animate-in fade-in slide-in-from-right-3 duration-300">
                              <code>
                                {refactorScenario === 'coroutines_leak' && (
                                  `// Optimized via Stage 9 Autonomous Refactorer
class UserRepository @Inject constructor(
    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO,
    private val externalScope: CoroutineScope // Inject custom application scope
) {
    suspend fun fetchUserData(userId: String): UserData = withContext(ioDispatcher) {
        val url = URL("https://api.example.com/user/$userId")
        val connection = url.openConnection() as HttpURLConnection
        val data = connection.inputStream.bufferedReader().readText()
        
        // Structured concurrency: run in safe background thread scope
        externalScope.launch(ioDispatcher) {
            saveToDatabase(data)
        }
        parseUserData(data)
    }
}`
                                )}
                                {refactorScenario === 'compose_performance' && (
                                  `// Optimized via Stage 9 Autonomous Refactorer
@Composable
fun UserList(
    users: List<User>,
    modifier: Modifier = Modifier
) {
    // Memoize pure calculations to prevent recomposition overhead
    val letterOnlyUsers = remember(users) {
        users.map { it.id to it.name.filter { it.isLetter() } }
    }
    
    LazyColumn(modifier = modifier) {
        // Providing keys lets Compose reposition instead of redrawing whole list
        items(
            items = letterOnlyUsers,
            key = { (id, _) -> id }
        ) { (_, filteredName) ->
            Text(
                text = "Active user: $filteredName",
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}`
                                )}
                                {refactorScenario === 'security_storage' && (
                                  `// Secure & Encrypted Implementation (Stage 9 Autonomous Agent)
class SecurityManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    // Enforce AES-256 encrypted storage
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val encryptedPrefs = EncryptedSharedPreferences.create(
        context,
        "secure_user_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveCredentials(token: String) {
        encryptedPrefs.edit().putString("auth_token", token).apply()
        // API key is securely compiled or retrieved via SecretManager API / BuildConfig
    }
}`
                                )}
                              </code>
                            </pre>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-20 bg-slate-950/30 border border-slate-900 rounded-lg">
                              <Cpu className="w-6 h-6 text-slate-700 animate-pulse mb-1.5" />
                              <span className="text-[10px] font-bold text-slate-400">Refactoring Idle</span>
                              <span className="text-[9px] text-slate-500">Press "Trigger Autonomous Refactor" to view output</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: MULTI-AGENT XP PROGRESSION HUB */}
                {activeTabStage9 === 'xp_hub' && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                    <div className="border border-slate-800 bg-[#0d1222]/80 p-4 rounded-xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-indigo-300 block">🎮 Multi-Agent XP Progression System</span>
                          <span className="text-[10px] text-slate-400">Each agent earns operational experience for accurate, secure execution, unlocking new autonomous competencies.</span>
                        </div>
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 text-right">
                          <span className="text-[10px] block font-bold leading-none">TOTAL ECOSYSTEM XP</span>
                          <span className="text-xs font-black text-indigo-300">{(agentXP.policeAI + agentXP.internetCheckAI + agentXP.selfImprovement + agentXP.refactorerAI)} XP</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Agent 1: PoliceAI */}
                        <div className="p-3 rounded-lg border border-slate-850 bg-slate-900/30 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">🛡️</span>
                              <span className="text-[10.5px] font-bold text-indigo-300">PoliceAI Agent</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Lv. {Math.floor(agentXP.policeAI / 100)}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[8.5px] text-slate-400">
                              <span>Operational Compliance</span>
                              <span>{agentXP.policeAI % 100}/100 XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                                style={{ width: `${agentXP.policeAI % 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold">✓ UNLOCKED: Encrypted Data Boundary Audits (API Level 31+)</span>
                        </div>

                        {/* Agent 2: InternetCheckAI */}
                        <div className="p-3 rounded-lg border border-slate-850 bg-slate-900/30 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">🌐</span>
                              <span className="text-[10.5px] font-bold text-amber-300">InternetCheckAI</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Lv. {Math.floor(agentXP.internetCheckAI / 100)}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[8.5px] text-slate-400">
                              <span>Factual Credibility score</span>
                              <span>{agentXP.internetCheckAI % 100}/100 XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                                style={{ width: `${agentXP.internetCheckAI % 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold">✓ UNLOCKED: Real-time Maven Dependency API verification</span>
                        </div>

                        {/* Agent 3: Self-Improvement Agent */}
                        <div className="p-3 rounded-lg border border-slate-850 bg-slate-900/30 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">🧠</span>
                              <span className="text-[10.5px] font-bold text-pink-300">Self-Improvement Agent</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Lv. {Math.floor(agentXP.selfImprovement / 100)}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[8.5px] text-slate-400">
                              <span>Structured Memory Consolidation</span>
                              <span>{agentXP.selfImprovement % 100}/100 XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-pink-500 rounded-full transition-all duration-500" 
                                style={{ width: `${agentXP.selfImprovement % 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold">✓ UNLOCKED: Autonomous RAG upgrade vector indexing</span>
                        </div>

                        {/* Agent 4: Autonomous Refactorer */}
                        <div className="p-3 rounded-lg border border-slate-850 bg-slate-900/30 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">⚙️</span>
                              <span className="text-[10.5px] font-bold text-cyan-300">Autonomous Refactorer</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Lv. {Math.floor(agentXP.refactorerAI / 100)}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[8.5px] text-slate-400">
                              <span>Synthesizer precision rate</span>
                              <span>{agentXP.refactorerAI % 100}/100 XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                                style={{ width: `${agentXP.refactorerAI % 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[9px] text-indigo-400 font-semibold">🔒 Lock: Compose optimization multiplier (Requires Lv. 2)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: AGENT AUTONOMY PROPOSALS */}
                {activeTabStage9 === 'autonomy_upgrade' && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                    <div className="border border-slate-800 bg-slate-950/40 p-4 rounded-xl flex flex-col gap-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">🧠 Agent Autonomy Upgrade Interface</span>
                          <span className="text-[10px] text-slate-400">Agents collaboratively propose, review, and persist RAG improvements dynamically to adapt to changing guidelines.</span>
                        </div>

                        <button
                          onClick={() => {
                            const newProp = {
                              id: 'prop_' + (proposals.length + 1),
                              title: 'Migrate legacy LiveData patterns to Kotlin Flow StateFlow',
                              status: 'pending',
                              suggestedBy: 'Autonomous Refactorer',
                              rationale: 'RAG updates indicate StateFlow simplifies coroutine integration inside Jetpack Compose.'
                            };
                            setProposals(prev => [newProp, ...prev]);
                            awardXP('propose_autonomous_upgrade', 50, 'Proposed Autonomous Upgrade!');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9.5px] font-bold flex items-center gap-1.5 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer transition-all"
                        >
                          <Sparkles className="w-3 h-3" /> Propose New Upgrade Pattern
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        {proposals.map((prop) => (
                          <div key={prop.id} className="p-3 bg-slate-900/40 border border-slate-850 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <div className="flex flex-col gap-1 max-w-[80%]">
                              <div className="flex items-center gap-2">
                                <span className="text-[10.5px] font-bold text-slate-200">{prop.title}</span>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded leading-none font-bold uppercase ${
                                  prop.status === 'approved' 
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                    : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                }`}>
                                  {prop.status}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400 leading-relaxed">
                                <strong>Rationale:</strong> "{prop.rationale}"
                              </span>
                              <span className="text-[8px] text-slate-500">
                                Suggested by: <strong className="text-indigo-400">{prop.suggestedBy}</strong>
                              </span>
                            </div>

                            {prop.status === 'pending' && (
                              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                <button
                                  onClick={() => {
                                    setProposals(prev => prev.map(p => p.id === prop.id ? { ...p, status: 'approved' } : p));
                                    awardXP('approve_autonomy_rule', 40, 'Approved Autonomous Chunk!');
                                  }}
                                  className="px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/45 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold cursor-pointer transition-all"
                                >
                                  🛡️ Approve Rule
                                </button>
                                <button
                                  onClick={() => {
                                    setProposals(prev => prev.filter(p => p.id !== prop.id));
                                  }}
                                  className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 text-[9px] font-bold cursor-pointer transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: KNOWLEDGE EXPANSION */}
                {activeTabStage9 === 'knowledge' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
                    <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                        <span className="p-1 bg-indigo-500/10 rounded border border-indigo-500/20 text-indigo-400 text-xs">🎨</span>
                        <span className="text-[10.5px] font-bold text-indigo-300 font-sans">Jetpack Compose Rules</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 leading-relaxed font-sans">
                        • Use stable keys on LazyColumn items to prevent redundant layout recompositions.<br/>
                        • Memoize computed list modifications inside <code className="text-indigo-300 font-mono text-[8.5px]">remember(list)</code> blocks.<br/>
                        • Handle highly transient state via <code className="text-indigo-300 font-mono text-[8.5px]">derivedStateOf</code> to optimize rendering frequencies.
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                        <span className="p-1 bg-amber-500/10 rounded border border-amber-500/20 text-amber-400 text-xs">⚡</span>
                        <span className="text-[10.5px] font-bold text-amber-300 font-sans">Kotlin Coroutine Guidelines</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 leading-relaxed font-sans">
                        • Avoid using unstructured GlobalScope to launch long-running coroutines.<br/>
                        • Offload blocking I/O and serialization calls onto <code className="text-amber-300 font-mono text-[8.5px]">Dispatchers.IO</code> explicitly.<br/>
                        • Always bind coroutine jobs onto proper Android components’ lifecycles to prevent background leaks.
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                        <span className="p-1 bg-rose-500/10 rounded border border-rose-500/20 text-rose-400 text-xs">🔐</span>
                        <span className="text-[10.5px] font-bold text-rose-300 font-sans">Android Security Standards</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 leading-relaxed font-sans">
                        • Encrypt critical device keys with <code className="text-rose-300 font-mono text-[8.5px]">EncryptedSharedPreferences</code> using AES-256 GCM.<br/>
                        • Restrict background service network calls to encrypted TLS 1.3 socket structures.<br/>
                        • Utilize secure keystore policies for hardware-backed token security operations.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* STEP 10: AUTONOMOUS FEATURE ARCHITECT */}
            {currentStep === 10 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                  <div>
                    <h4 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" /> Stage 10: Autonomous Feature Architect
                    </h4>
                    <p className="text-xs text-slate-400">
                      Proposes, specifies, verifies, and scaffolds high-performance Android features automatically using PoliceAI and InternetCheckAI.
                    </p>
                  </div>
                  
                  {/* Stage 10 Navigation Tab Bar */}
                  <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg shrink-0">
                    <button
                      onClick={() => setActiveTabStage10('proposer')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTabStage10 === 'proposer' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💡 Proposer
                    </button>
                    <button
                      onClick={() => setActiveTabStage10('specification')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTabStage10 === 'specification' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📝 Feature Specs
                    </button>
                    <button
                      onClick={() => setActiveTabStage10('blueprint')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTabStage10 === 'blueprint' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📐 Blueprint & Wireframe
                    </button>
                    <button
                      onClick={() => setActiveTabStage10('agent_collaboration')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTabStage10 === 'agent_collaboration' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🤖 Agent Debate
                    </button>
                  </div>
                </div>

                {/* TAB 1: PROPOSER & ENGINE */}
                {activeTabStage10 === 'proposer' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
                    {/* Control Panel (left) */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      <div className="border border-slate-800 bg-[#070b13]/80 p-4 rounded-xl flex flex-col gap-3">
                        <span className="text-xs font-bold text-emerald-400 block">⚡ Autonomous Feature Creation</span>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Select Target Scenario</label>
                          <select
                            value={featureScenario}
                            onChange={(e) => {
                              setFeatureScenario(e.target.value);
                              setArchitectStep('idle');
                              setArchitectLogs([]);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 p-2 text-xs rounded-lg text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
                          >
                            <option value="biometric_login">🔒 Biometric Authentication Lock Screen</option>
                            <option value="finance_dashboard">📊 Real-time Financial Ledger Canvas Charts</option>
                            <option value="chat_channel">💬 End-to-End Encrypted Live Chat</option>
                          </select>
                        </div>

                        <p className="text-[10px] text-slate-500 leading-normal">
                          The system will dynamically spin up the <strong>FeatureArchitectAI</strong> to design the interface, crosscheck rules using <strong>PoliceAI</strong>, audit gradle dependencies with <strong>InternetCheckAI</strong>, and scaffold the code with <strong>RefactorerAI</strong>.
                        </p>

                        <button
                          onClick={runAutonomousFeatureSimulation}
                          disabled={architectStep !== 'idle' && architectStep !== 'completed'}
                          className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            architectStep === 'designing' || architectStep === 'reviewing' || architectStep === 'coding' || architectStep === 'improving'
                              ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400 animate-pulse cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500'
                          }`}
                        >
                          <Play className="w-4 h-4" />
                          {architectStep === 'idle' ? 'Trigger Feature Architect' :
                           architectStep === 'completed' ? 'Restart Evolution Loop' : 'Architecting...'}
                        </button>
                      </div>

                      {/* Active Node Map */}
                      <div className="border border-slate-800 bg-[#0d1222]/80 p-4 rounded-xl flex flex-col gap-3">
                        <span className="text-xs font-bold text-slate-200 block">📍 Active Architectural Node Map</span>
                        <div className="flex flex-col gap-2">
                          <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                            architectStep === 'designing' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-900/30 border-slate-800/60 text-slate-400'
                          }`}>
                            <span className="text-[10.5px] font-bold">1. FeatureArchitectAI Proposal</span>
                            <span className="text-[9px] font-semibold">{architectStep === 'designing' ? '● ACTIVE' : '✓ READY'}</span>
                          </div>
                          <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                            architectStep === 'reviewing' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-900/30 border-slate-800/60 text-slate-400'
                          }`}>
                            <span className="text-[10.5px] font-bold">2. PoliceAI Security Boundary Check</span>
                            <span className="text-[9px] font-semibold">{architectStep === 'reviewing' ? '● ACTIVE' : architectStep === 'coding' || architectStep === 'improving' || architectStep === 'completed' ? '✓ APPROVED' : '⚡ PENDING'}</span>
                          </div>
                          <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                            architectStep === 'coding' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-900/30 border-slate-800/60 text-slate-400'
                          }`}>
                            <span className="text-[10.5px] font-bold">3. Boilerplate Refactorer Scaffold</span>
                            <span className="text-[9px] font-semibold">{architectStep === 'coding' ? '● RUNNING' : architectStep === 'improving' || architectStep === 'completed' ? '✓ GENERATED' : '⚡ PENDING'}</span>
                          </div>
                          <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                            architectStep === 'improving' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' : 'bg-slate-900/30 border-slate-800/60 text-slate-400'
                          }`}>
                            <span className="text-[10.5px] font-bold">4. RAG Rule Memory Persistence</span>
                            <span className="text-[9px] font-semibold">{architectStep === 'improving' ? '● INDEXING' : architectStep === 'completed' ? '✓ COMMITTED' : '⚡ PENDING'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simulation logs (right) */}
                    <div className="lg:col-span-7 flex flex-col border border-slate-800 bg-[#070b13]/80 rounded-xl overflow-hidden min-h-[350px]">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/40">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5 text-emerald-500" /> Evolution Engine Log
                        </span>
                        <div className="flex gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/40" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/40" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500" />
                        </div>
                      </div>

                      <div className="p-4 flex-1 font-mono text-[10px] text-slate-300 flex flex-col gap-2 overflow-y-auto max-h-[360px] cyber-scrollbar bg-slate-950/20">
                        {architectLogs.length > 0 ? (
                          architectLogs.map((log, idx) => (
                            <div key={idx} className="animate-in fade-in duration-300 leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                              {log}
                            </div>
                          ))
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-20">
                            <Cpu className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
                            <span className="text-xs font-bold text-slate-400">System Idle</span>
                            <span className="text-[10px] text-slate-500">Press "Trigger Feature Architect" above to run live simulation.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: FEATURE SPECIFICATION */}
                {activeTabStage10 === 'specification' && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                    <div className="border border-slate-800 bg-[#0d1222]/90 p-5 rounded-xl flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div>
                          <span className="text-sm font-bold text-emerald-400 block">📄 Feature Specifications Report</span>
                          <span className="text-[10px] text-slate-400">Auto-generated system specification including architecture design constraints and security standards.</span>
                        </div>
                        <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                          STATUS: VERIFIED
                        </span>
                      </div>

                      <div className="text-xs leading-relaxed text-slate-300 space-y-3 font-sans">
                        {featureScenario === 'biometric_login' && (
                          <>
                            <p className="font-bold text-slate-100 text-sm">🎯 Module: :feature:security</p>
                            <p>Proposes a secure authentication layer using the official Android Biometric library with fallback PIN integration.</p>
                            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg space-y-2">
                              <span className="text-[10px] font-black text-amber-400 block uppercase">🔒 Security Guard Policies enforced by PoliceAI:</span>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• Enforce biometric strong authentication (Class 3 / BiometricStrong).</p>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• KeyGenParameterSpec configured with <code className="text-cyan-300 font-mono">setUserAuthenticationRequired(true)</code>.</p>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• Cryptographic token stored exclusively within hardware-backed KeyStore container.</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">🔌 Dependencies checked by InternetCheckAI:</span>
                              <p className="font-mono text-[10px] pl-2">• androidx.biometric:biometric:1.2.0-alpha05 (LATEST stable matching Gradle library catalog)</p>
                            </div>
                          </>
                        )}

                        {featureScenario === 'finance_dashboard' && (
                          <>
                            <p className="font-bold text-slate-100 text-sm">🎯 Module: :feature:finance</p>
                            <p>Proposes a transactional visualization dashboard displaying ledger entries using hardware-accelerated drawing structures.</p>
                            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg space-y-2">
                              <span className="text-[10px] font-black text-amber-400 block uppercase">📈 Canvas Drawing Constraints:</span>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• Custom Canvas Path computation memoized via Compose state triggers.</p>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• Zero floating-point drift: Strict double-precision storage mapped dynamically to standard view bounds.</p>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• Thread-isolated calculation model preventing layout rendering bottlenecks.</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">🔌 Dependencies checked by InternetCheckAI:</span>
                              <p className="font-mono text-[10px] pl-2">• androidx.compose.ui:ui-graphics:1.6.0 (Optimized graphic render pipeline)</p>
                            </div>
                          </>
                        )}

                        {featureScenario === 'chat_channel' && (
                          <>
                            <p className="font-bold text-slate-100 text-sm">🎯 Module: :feature:chat</p>
                            <p>Proposes a persistent encrypted real-time communications channel utilizing WebSockets with offline cache fallback.</p>
                            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg space-y-2">
                              <span className="text-[10px] font-black text-amber-400 block uppercase">💬 Socket Security Constraints:</span>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• Message payloads encrypted locally using AES-256 SIV before socket pipeline transmit.</p>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• Dynamic room database schema isolating concurrent channels.</p>
                              <p className="pl-2 border-l-2 border-amber-500/40 text-[11px]">• Auto-reconnection policy limited via exponential backoff limits.</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">🔌 Dependencies checked by InternetCheckAI:</span>
                              <p className="font-mono text-[10px] pl-2">• com.squareup.okhttp3:okhttp:4.12.0 (High-performance socket client)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: BLUEPRINT & WIREFRAME */}
                {activeTabStage10 === 'blueprint' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    {/* Node Architecture diagram */}
                    <div className="border border-slate-800 bg-[#070b13]/90 p-4 rounded-xl flex flex-col gap-3">
                      <span className="text-xs font-bold text-emerald-400 block">📐 Architectural Node Connections</span>
                      <div className="p-3 bg-slate-950 rounded-lg font-mono text-[9px] text-emerald-300 leading-relaxed overflow-x-auto min-h-[220px] border border-slate-850">
                        {featureScenario === 'biometric_login' ? (
                          <pre>{`[ MainActivity ] 
       │
       ▼ (Binds Secure Lifecycle Scope)
[ BiometricPromptManager ] 
       │
       ├─► [ KeyStore Cryptographic Engine ] ──► (Hardware AES-GCM)
       │
       ▼ (Renders Compose UI State)
[ BiometricLockOverlayScreen ] ──► (Pin / Biometric Dual-Auth)`}</pre>
                        ) : featureScenario === 'finance_dashboard' ? (
                          <pre>{`[ MainActivity ]
       │
       ▼ (Observes Dynamic Ledger State)
[ LedgerViewModel ] ──► [ LocalDatabaseRepository ]
       │
       ▼ (Transfers Scaled Coordinate Vectors)
[ TransactionLedgerCanvas ]
       │
       └─► [ PathRendererEngine ] ──► (Hardware Accelerated Drawing)`}</pre>
                        ) : (
                          <pre>{`[ MainActivity ]
       │
       ▼ (Asynchronous WebSocket Flow)
[ ChatSocketManager ] ◄──► [ AES256EncryptionPipeline ]
       │
       ├─► [ SQLiteOfflineCacheRepository ]
       │
       ▼ (Subscribed StateFlow)
[ ChatConversationScreen ] ──► (LazyColumn with stable keys)`}</pre>
                        )}
                      </div>
                    </div>

                    {/* Text-Based UI wireframe */}
                    <div className="border border-slate-800 bg-[#070b13]/90 p-4 rounded-xl flex flex-col gap-3">
                      <span className="text-xs font-bold text-emerald-400 block">📱 Jetpack Compose UI Wireframe</span>
                      <div className="p-3 bg-slate-950 rounded-lg font-mono text-[9px] text-cyan-300 leading-relaxed overflow-x-auto min-h-[220px] border border-slate-850">
                        {featureScenario === 'biometric_login' ? (
                          <pre>{`+---------------------------------------+
|  🛡️  SECURE AUTHENTICATION REQD.      |
|                                       |
|    Please verify fingerprint to       |
|    decrypt sensitive app credentials  |
|                                       |
|                ( @ )                  |
|          Place thumb here             |
|                                       |
|      [ Enter Fallback System PIN ]    |
|                                       |
+---------------------------------------+`}</pre>
                        ) : featureScenario === 'finance_dashboard' ? (
                          <pre>{`+---------------------------------------+
|  📈 FINANCIAL LEDGER OVERVIEW          |
|  Balance: $124,530.00   ▲ +4.2%       |
|                                       |
|  /\\   _      /\\                       |
| /  \\ / \\    /  \\   (Ledger Graph)     |
|/    V   \\__/    \\                     |
|                                       |
|  [ ✓ Cash Flow ]    [ ✓ Expenditures ] |
|                                       |
+---------------------------------------+`}</pre>
                        ) : (
                          <pre>{`+---------------------------------------+
|  💬 SECURE ENCRYPTED ROOM #42          |
|  Recipient: DevAgent  ● Online        |
|                                       |
|  [DevAgent]: Hello! Payload is secure |
|  [You]: Verified TLS 1.3 encryption.  |
|                                       |
|  +---------------------------------+  |
|  | Enter encrypted message...    |  |  |
|  +---------------------------------+  |
+---------------------------------------+`}</pre>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: AGENT DEBATE */}
                {activeTabStage10 === 'agent_collaboration' && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                    <div className="border border-slate-800 bg-slate-950/40 p-4 rounded-xl flex flex-col gap-3">
                      <span className="text-xs font-bold text-slate-200 block">🤖 Multi-Agent Safety Debate Transcript</span>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        See the automated validation debate where security policies (PoliceAI) and correctness checks (InternetCheckAI) audit the FeatureArchitectAI.
                      </p>

                      <div className="flex flex-col gap-3.5 pt-2 font-mono text-[10px]">
                        <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg">
                          <span className="text-indigo-300 font-bold block mb-1">🧠 FeatureArchitectAI:</span>
                          <span className="text-slate-300">
                            "I have compiled the architectural nodes and mapped out standard Compose screen structures. Proposing immediate code generation."
                          </span>
                        </div>

                        <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg">
                          <span className="text-amber-300 font-bold block mb-1">🛡️ PoliceAI Counter:</span>
                          <span className="text-slate-300">
                            "Reviewing security metrics: Ensure that on biometric-prompt cancel, no sensitive transient memory variables are left un-scrubbed. Fallback authentication MUST require Android Keystore user-auth verification."
                          </span>
                        </div>

                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                          <span className="text-emerald-300 font-bold block mb-1">🌐 InternetCheckAI Counter:</span>
                          <span className="text-slate-305">
                            "Reviewing Gradle specs: Tested the biometric library version artifact androidx.biometric:biometric:1.2.0-alpha05. It compiles flawlessly and possesses zero CVE flags in Maven Central database."
                          </span>
                        </div>

                        <div className="p-3 bg-pink-950/20 border border-pink-500/20 rounded-lg">
                          <span className="text-pink-300 font-bold block mb-1">🧠 Self-Improvement Agent Summary:</span>
                          <span className="text-slate-300">
                            "All constraints satisfied. Generating RAG entry for architectural patterns inside secure Android sandboxes. We are fully cleared for deployment."
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


          </div>

        </div>

      </div>
    </div>
  );
}
