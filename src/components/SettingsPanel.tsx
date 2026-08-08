import React, { useState, useEffect } from 'react';
import { 
  Key, Shield, Zap, RefreshCw, Eye, EyeOff, CheckCircle2, XCircle, 
  ExternalLink, Search, Cpu, Brain, Type, AlignLeft, WrapText, 
  Indent, Sparkles, AlertTriangle, Layers, Server, Check, Copy
} from 'lucide-react';
import { EditorSettings } from '../types';

interface SettingsPanelProps {
  settings: EditorSettings;
  onChangeSettings: (settings: EditorSettings) => void;
  theme: 'dark' | 'light';
}

interface AIProviderInfo {
  id: string;
  name: string;
  badge: string;
  category: 'frontier' | 'lpu' | 'gateway' | 'search';
  models: string[];
  docUrl: string;
  placeholder: string;
  description: string;
}

const AI_PROVIDERS: AIProviderInfo[] = [
  {
    id: 'gemini',
    name: 'Google Gemini (AI Studio)',
    badge: 'Primary / Recommended',
    category: 'frontier',
    models: ['gemini-3.5-flash', 'gemini-3.1-pro', 'gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-embedding-2-preview'],
    docUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIzaSy...',
    description: 'Native multimodal models with up to 2M+ context window and fast inference on TPU clusters.'
  },
  {
    id: 'openai',
    name: 'OpenAI Platform',
    badge: 'Frontier LLMs',
    category: 'frontier',
    models: ['gpt-4o', 'gpt-4o-mini', 'o1', 'o3-mini', 'text-embedding-3-large'],
    docUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-proj-...',
    description: 'Industry standard reasoning, vision, and code generation models.'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    badge: 'Frontier LLMs',
    category: 'frontier',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    docUrl: 'https://console.anthropic.com/settings/keys',
    placeholder: 'sk-ant-...',
    description: 'High-precision coding, structured analysis, and long-form prose synthesis.'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    badge: 'Reasoning & Code',
    category: 'frontier',
    models: ['deepseek-chat (V3)', 'deepseek-reasoner (R1)'],
    docUrl: 'https://platform.deepseek.com/api_keys',
    placeholder: 'sk-...',
    description: 'State-of-the-art open reasoning and ultra-budget code synthesis.'
  },
  {
    id: 'grok',
    name: 'xAI / Grok',
    badge: 'Real-time & Reasoning',
    category: 'frontier',
    models: ['grok-2-1212', 'grok-2-vision', 'grok-beta'],
    docUrl: 'https://console.x.ai/',
    placeholder: 'xai-...',
    description: 'Direct conversational reasoning with live information awareness.'
  },
  {
    id: 'groq',
    name: 'Groq LPU Acceleration',
    badge: 'Sub-100ms Inference',
    category: 'lpu',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'deepseek-r1-distill-llama-70b'],
    docUrl: 'https://console.groq.com/keys',
    placeholder: 'gsk_...',
    description: 'Hardware LPU processing delivering instantaneous token output.'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter Gateway',
    badge: 'Universal Router',
    category: 'gateway',
    models: ['auto', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.3-70b-instruct', 'deepseek/deepseek-r1'],
    docUrl: 'https://openrouter.ai/keys',
    placeholder: 'sk-or-v1-...',
    description: 'Unified API routing across 200+ global models with automatic failover.'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    badge: 'EU High-Speed',
    category: 'frontier',
    models: ['mistral-large-latest', 'codestral-latest', 'pixtral-12b-2409'],
    docUrl: 'https://console.mistral.ai/api-keys/',
    placeholder: 'mistral-...',
    description: 'Compact, ultra-fast European models specialized for software engineering.'
  },
  {
    id: 'together',
    name: 'Together AI',
    badge: 'Open-Weight Cloud',
    category: 'lpu',
    models: ['meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', 'Qwen/Qwen2.5-72B-Instruct-Turbo'],
    docUrl: 'https://api.together.ai/settings/api-keys',
    placeholder: 'together-...',
    description: 'Scalable open-weights infrastructure for massive parameter models.'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Hub',
    badge: 'Open Source Tokens',
    category: 'gateway',
    models: ['inference-api', 'deepseek-ai/DeepSeek-R1', 'meta-llama/Llama-3.3-70B-Instruct'],
    docUrl: 'https://huggingface.co/settings/tokens',
    placeholder: 'hf_...',
    description: 'Direct token access for millions of community-hosted open models.'
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    badge: 'Search Grounding',
    category: 'search',
    models: ['sonar-reasoning-pro', 'sonar-pro', 'sonar'],
    docUrl: 'https://www.perplexity.ai/settings/api',
    placeholder: 'pplx-...',
    description: 'Real-time online web search integration with citation grounding.'
  }
];

export default function SettingsPanel({
  settings,
  onChangeSettings,
  theme
}: SettingsPanelProps) {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'keys' | 'quota' | 'editor'>('keys');

  // AI Key Management state
  const [keyInputState, setKeyInputState] = useState<Record<string, string>>({});
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});
  const [maskedKeysMap, setMaskedKeysMap] = useState<Record<string, { configured: boolean; masked: string }>>({});
  const [activeProvider, setActiveProvider] = useState<string>('gemini');
  const [defaultModel, setDefaultModel] = useState<string>('gemini-3.5-flash');
  const [autoFailover, setAutoFailover] = useState<boolean>(true);
  
  const [testingMap, setTestingMap] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<{ provider?: string; text: string; isError?: boolean } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'frontier' | 'lpu' | 'gateway' | 'search'>('all');

  // Credits state
  const [creditsState, setCreditsState] = useState({
    remainingCredits: 1000,
    totalCredits: 1000,
    autoSwitchActive: false,
    autoSwitchThreshold: 20
  });

  // Fetch API keys configuration
  const fetchKeysConfig = async () => {
    try {
      const res = await fetch('/api/keys');
      const data = await res.json();
      if (data.success) {
        if (data.keys) setMaskedKeysMap(data.keys);
        if (data.activeProvider) setActiveProvider(data.activeProvider);
        if (data.defaultModel) setDefaultModel(data.defaultModel);
        if (typeof data.autoFailover === 'boolean') setAutoFailover(data.autoFailover);
      }
    } catch (e) {
      console.error('Failed to fetch keys config:', e);
    }
  };

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/credits');
      const data = await res.json();
      if (data.success && data.credits) {
        setCreditsState(data.credits);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchKeysConfig();
    fetchCredits();
    const interval = setInterval(() => {
      fetchCredits();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Save specific API Key
  const handleSaveKey = async (providerId: string) => {
    const keyVal = keyInputState[providerId] || '';
    if (!keyVal.trim()) return;

    setStatusMessage({ text: `Saving ${providerId.toUpperCase()} API key...` });
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          key: keyVal.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.keys) setMaskedKeysMap(data.keys);
        setKeyInputState(prev => ({ ...prev, [providerId]: '' }));
        // Also save to localStorage for client resiliency
        try {
          localStorage.setItem(`ai_key_${providerId}`, keyVal.trim());
        } catch (e) {}
        setStatusMessage({ provider: providerId, text: `✓ ${providerId.toUpperCase()} API Key saved successfully!` });
      } else {
        setStatusMessage({ provider: providerId, text: `Error: ${data.error || 'Failed to save key'}`, isError: true });
      }
    } catch (e: any) {
      setStatusMessage({ provider: providerId, text: `Error: ${e.message || 'Network error'}`, isError: true });
    }
  };

  // Clear specific API Key
  const handleClearKey = async (providerId: string) => {
    if (!confirm(`Are you sure you want to remove the ${providerId.toUpperCase()} API Key?`)) return;

    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          clearKey: true
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.keys) setMaskedKeysMap(data.keys);
        setKeyInputState(prev => ({ ...prev, [providerId]: '' }));
        try {
          localStorage.removeItem(`ai_key_${providerId}`);
        } catch (e) {}
        setStatusMessage({ provider: providerId, text: `${providerId.toUpperCase()} Key cleared.` });
      }
    } catch (e: any) {
      setStatusMessage({ provider: providerId, text: `Error clearing key: ${e.message}`, isError: true });
    }
  };

  // Test API Key connection
  const handleTestKey = async (providerId: string) => {
    setTestingMap(prev => ({ ...prev, [providerId]: true }));
    setStatusMessage({ provider: providerId, text: `Testing connection to ${providerId.toUpperCase()} API...` });

    try {
      const inputKey = keyInputState[providerId] || '';
      const res = await fetch('/api/keys/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          key: inputKey
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ provider: providerId, text: `✓ ${data.message || 'Connection verified!'}` });
      } else {
        setStatusMessage({ provider: providerId, text: `✕ ${data.error || 'Validation failed'}`, isError: true });
      }
    } catch (e: any) {
      setStatusMessage({ provider: providerId, text: `✕ Error: ${e.message}`, isError: true });
    } finally {
      setTestingMap(prev => ({ ...prev, [providerId]: false }));
    }
  };

  // Global Settings update (Active Provider / Default Model / Auto-Failover)
  const handleGlobalConfigChange = async (updates: { activeProvider?: string; defaultModel?: string; autoFailover?: boolean }) => {
    if (updates.activeProvider) setActiveProvider(updates.activeProvider);
    if (updates.defaultModel) setDefaultModel(updates.defaultModel);
    if (typeof updates.autoFailover === 'boolean') setAutoFailover(updates.autoFailover);

    try {
      await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {}
  };

  const handleToggleAutoSwitch = async (active: boolean) => {
    try {
      const res = await fetch('/api/credits/toggle-auto-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoSwitchActive: active })
      });
      const data = await res.json();
      if (data.success && data.credits) setCreditsState(data.credits);
    } catch (e) {}
  };

  const handleUpdateThreshold = async (threshold: number) => {
    try {
      const res = await fetch('/api/credits/toggle-auto-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoSwitchThreshold: threshold })
      });
      const data = await res.json();
      if (data.success && data.credits) setCreditsState(data.credits);
    } catch (e) {}
  };

  const handleResetCredits = async () => {
    try {
      const res = await fetch('/api/credits/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.credits) setCreditsState(data.credits);
    } catch (e) {}
  };

  const updateSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    onChangeSettings({ ...settings, [key]: value });
  };

  // Calculate configured count
  const configuredCount = Object.values(maskedKeysMap).filter(k => k?.configured).length;

  // Filter providers
  const filteredProviders = AI_PROVIDERS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.models.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-4 text-xs select-none">
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => setActiveTab('keys')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'keys'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Key className="w-3 h-3 text-cyan-400" /> AI API Keys ({configuredCount})
        </button>
        <button
          onClick={() => setActiveTab('quota')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'quota'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-3 h-3 text-indigo-400" /> Pipeline Quota
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'editor'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Type className="w-3 h-3 text-purple-400" /> Visual Editor
        </button>
      </div>

      {/* Status banner message */}
      {statusMessage && (
        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] font-medium animate-fade-in ${
          statusMessage.isError 
            ? 'bg-red-950/40 border-red-500/30 text-red-300' 
            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.isError ? <XCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-200 text-xs px-1">✕</button>
        </div>
      )}

      {/* ================= TAB 1: AI API KEYS MANAGER ================= */}
      {activeTab === 'keys' && (
        <div className="flex flex-col gap-4">
          {/* Top Summary Card & Primary Provider Controls */}
          <div className={`p-3.5 rounded-2xl border flex flex-col gap-3 ${
            isDark ? 'bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 border-cyan-500/30 shadow-lg' : 'bg-cyan-50/50 border-cyan-200'
          }`}>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                  <Brain className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-black text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
                    Multi-Model AI Credentials
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[9px] px-2 py-0.5 rounded-full">
                      {configuredCount} / {AI_PROVIDERS.length} Configured
                    </span>
                  </h3>
                  <p className="text-[9px] text-slate-400">Configure secret keys for Gemini, OpenAI, Claude, DeepSeek, Groq & OpenRouter.</p>
                </div>
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Primary Active Provider */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Primary AI Engine
                </label>
                <select
                  value={activeProvider}
                  onChange={e => handleGlobalConfigChange({ activeProvider: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {AI_PROVIDERS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} {maskedKeysMap[p.id]?.configured ? '✓ (Key Ready)' : '(No Key)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Model */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-purple-400" /> Default Model Alias
                </label>
                <select
                  value={defaultModel}
                  onChange={e => handleGlobalConfigChange({ defaultModel: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {(AI_PROVIDERS.find(p => p.id === activeProvider)?.models || ['gemini-3.5-flash']).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Auto-Failover toggle */}
            <div className="flex items-center justify-between border-t border-cyan-500/15 pt-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-200 text-[10px] flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-emerald-400" /> Intelligent Auto-Failover
                </span>
                <span className="text-[9px] text-slate-400">Fallback to secondary API keys if rate limits (429) or outage occurs.</span>
              </div>
              <input
                type="checkbox"
                checked={autoFailover}
                onChange={e => handleGlobalConfigChange({ autoFailover: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Provider Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search AI providers (e.g., Gemini, OpenAI, DeepSeek, Groq)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto">
              {[
                { id: 'all', label: 'All (11)' },
                { id: 'frontier', label: 'Frontier' },
                { id: 'lpu', label: 'LPU / Speed' },
                { id: 'gateway', label: 'Router' },
                { id: 'search', label: 'Search' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all ${
                    categoryFilter === cat.id 
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Cards List */}
          <div className="flex flex-col gap-3">
            {filteredProviders.map(provider => {
              const statusInfo = maskedKeysMap[provider.id] || { configured: false, masked: '' };
              const isConfigured = statusInfo.configured;
              const maskedText = statusInfo.masked;
              const isTesting = Boolean(testingMap[provider.id]);
              const inputValue = keyInputState[provider.id] || '';
              const isShowingPassword = Boolean(showKeyMap[provider.id]);

              return (
                <div 
                  key={provider.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isConfigured 
                      ? 'bg-slate-900/50 border-emerald-500/30 hover:border-emerald-500/50' 
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-xl border ${
                        isConfigured 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                      }`}>
                        <Key className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-200 text-xs">{provider.name}</span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {provider.badge}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5">{provider.description}</span>
                      </div>
                    </div>

                    {/* Configured Status Badge */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {isConfigured ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Not Set
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Existing Masked Key Indicator */}
                  {isConfigured && (
                    <div className="mb-2 p-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span>Stored Key:</span>
                        <span className="text-cyan-400 font-bold">{maskedText}</span>
                      </div>
                      <button
                        onClick={() => handleClearKey(provider.id)}
                        className="text-[9px] text-red-400 hover:text-red-300 font-sans hover:underline cursor-pointer"
                      >
                        Remove Key
                      </button>
                    </div>
                  )}

                  {/* Input Form Row */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={isShowingPassword ? 'text' : 'password'}
                        placeholder={isConfigured ? 'Enter new API Key to replace...' : `Paste ${provider.name} Key (${provider.placeholder})`}
                        value={inputValue}
                        onChange={e => setKeyInputState(prev => ({ ...prev, [provider.id]: e.target.value }))}
                        className="w-full pl-3 pr-8 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeyMap(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                        className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 cursor-pointer"
                        title={isShowingPassword ? 'Hide Key' : 'Show Key'}
                      >
                        {isShowingPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => handleSaveKey(provider.id)}
                      disabled={!inputValue.trim()}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                        inputValue.trim()
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>

                    {/* Test Button */}
                    <button
                      onClick={() => handleTestKey(provider.id)}
                      disabled={isTesting || (!isConfigured && !inputValue.trim())}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1 border transition-all cursor-pointer ${
                        isTesting
                          ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title="Test connection to API endpoint"
                    >
                      <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-cyan-400' : ''}`} /> Test
                    </button>
                  </div>

                  {/* Card Footer: Models & Direct Link */}
                  <div className="flex items-center justify-between border-t border-slate-800/60 mt-2.5 pt-2 text-[9px]">
                    <div className="flex items-center gap-1 overflow-x-auto max-w-[70%]">
                      <span className="text-slate-500 font-semibold">Models:</span>
                      {provider.models.map(m => (
                        <span key={m} className="px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded border border-slate-800/80 font-mono text-[8px] whitespace-nowrap">
                          {m}
                        </span>
                      ))}
                    </div>

                    <a
                      href={provider.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[9px] hover:underline"
                    >
                      Get Key ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PIPELINE QUOTA & CREDITS ================= */}
      {activeTab === 'quota' && (
        <div className={`p-4 rounded-2xl border flex flex-col gap-4 ${
          isDark ? 'bg-slate-950/40 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'
        }`}>
          <div className="flex items-center justify-between border-b border-indigo-500/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
                <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-200 text-xs uppercase tracking-wider">AI Pipeline Quota Pool</span>
                <span className="text-[9px] text-slate-400">Conserves cloud quota proactively with auto-failover</span>
              </div>
            </div>
            <button 
              onClick={handleResetCredits}
              className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-xl cursor-pointer transition-all border border-indigo-500/30"
            >
              <RefreshCw className="w-3 h-3 text-indigo-400" /> Reset Pool
            </button>
          </div>

          {/* Credit Gauge progress bar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Credits Remaining:</span>
              <span className={`font-mono font-bold ${
                creditsState.remainingCredits <= creditsState.autoSwitchThreshold ? 'text-red-400' : creditsState.remainingCredits <= 50 ? 'text-yellow-400' : 'text-cyan-400'
              }`}>
                {creditsState.remainingCredits} / {creditsState.totalCredits}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-500 ${
                  creditsState.remainingCredits <= creditsState.autoSwitchThreshold ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : creditsState.remainingCredits <= 50 ? 'bg-yellow-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${(creditsState.remainingCredits / creditsState.totalCredits) * 100}%` }}
              />
            </div>
          </div>

          {/* Toggle Auto-Switch option */}
          <div className="flex items-center justify-between border-t border-indigo-500/10 pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-200 text-xs">Auto-Switch Local Engine</span>
              <span className="text-[9px] text-slate-400">Switch to offline compiler when quota runs low</span>
            </div>
            <input
              type="checkbox"
              checked={creditsState.autoSwitchActive}
              onChange={e => handleToggleAutoSwitch(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Threshold Slider */}
          {creditsState.autoSwitchActive && (
            <div className="flex flex-col gap-2 border-t border-indigo-500/10 pt-3">
              <div className="flex items-center justify-between text-[10px] text-slate-300">
                <span>Threshold Trigger:</span>
                <span className="font-mono font-bold text-indigo-400">{creditsState.autoSwitchThreshold} Credits</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={creditsState.autoSwitchThreshold}
                onChange={e => handleUpdateThreshold(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 cursor-pointer bg-slate-900 border border-slate-800 rounded-lg"
              />
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: VISUAL EDITOR SETTINGS ================= */}
      {activeTab === 'editor' && (
        <div className="flex flex-col gap-4">
          {/* Font Size Option */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
            <label className="text-slate-300 font-extrabold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-cyan-400" /> Editor Font Size ({settings.fontSize}px)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="22"
                value={settings.fontSize}
                onChange={e => updateSetting('fontSize', parseInt(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
            </div>
          </div>

          {/* Font Family Selection */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
            <label className="text-slate-300 font-extrabold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-pink-400" /> Font Family
            </label>
            <select
              value={settings.fontFamily}
              onChange={e => updateSetting('fontFamily', e.target.value as any)}
              className={`w-full text-xs rounded-xl px-3 py-2 border focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="JetBrains Mono">JetBrains Mono</option>
              <option value="Fira Code">Fira Code</option>
              <option value="Source Code Pro">Source Code Pro</option>
              <option value="monospace">Standard Monospace</option>
            </select>
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <WrapText className="w-3.5 h-3.5 text-emerald-400" /> Wrap Code Lines
              </span>
              <span className="text-[10px] text-slate-400">Wrap long lines to fit editor viewport</span>
            </div>
            <input
              type="checkbox"
              checked={settings.wordWrap}
              onChange={e => updateSetting('wordWrap', e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Line Numbers */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <Indent className="w-3.5 h-3.5 text-yellow-400" /> Line Numbers
              </span>
              <span className="text-[10px] text-slate-400">Display row indicators in left gutter</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showLineNumbers}
              onChange={e => updateSetting('showLineNumbers', e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Tab Size Indentation */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <Indent className="w-3.5 h-3.5 text-purple-400" /> Tab Spacing
              </span>
              <span className="text-[10px] text-slate-400">Choose indentation space width</span>
            </div>
            <div className="flex bg-slate-950 border border-slate-800 p-0.5 rounded-xl shrink-0">
              {[2, 4].map(size => (
                <button
                  key={size}
                  onClick={() => updateSetting('tabSize', size as any)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    settings.tabSize === size ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {size} Spaces
                </button>
              ))}
            </div>
          </div>

          {/* Evolution Mode */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <Brain className="w-3.5 h-3.5 text-fuchsia-400" /> Evolution Mode
                </span>
                <span className="text-[10px] text-slate-400 max-w-[220px]">Allow Mandela vs Matrix Re-Imaginator to learn from architecture patterns.</span>
              </div>
              <input
                type="checkbox"
                checked={!!settings.evolutionMode}
                onChange={e => updateSetting('evolutionMode', e.target.checked)}
                className="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-500 cursor-pointer accent-fuchsia-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
