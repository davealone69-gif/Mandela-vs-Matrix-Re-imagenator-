import React from 'react';
import { Settings, RefreshCw, Smartphone, Monitor, ChevronRight, CheckCircle2, Shield, Brain, Type, AlignLeft, WrapText, Indent, Zap } from 'lucide-react';
import { EditorSettings } from '../types';

interface SettingsPanelProps {
  settings: EditorSettings;
  onChangeSettings: (settings: EditorSettings) => void;
  theme: 'dark' | 'light';
}

export default function SettingsPanel({
  settings,
  onChangeSettings,
  theme
}: SettingsPanelProps) {
  const isDark = theme === 'dark';

  const [creditsState, setCreditsState] = React.useState({
    remainingCredits: 100,
    totalCredits: 100,
    autoSwitchActive: true,
    autoSwitchThreshold: 20
  });

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/credits');
      const data = await res.json();
      if (data.success && data.credits) {
        setCreditsState(data.credits);
      }
    } catch (e) {
      console.error('Failed to fetch credits:', e);
    }
  };

  React.useEffect(() => {
    fetchCredits();
    // Poll every 5 seconds to keep credits in sync with backend job runs
    const interval = setInterval(fetchCredits, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAutoSwitch = async (active: boolean) => {
    try {
      const res = await fetch('/api/credits/toggle-auto-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoSwitchActive: active })
      });
      const data = await res.json();
      if (data.success && data.credits) {
        setCreditsState(data.credits);
      }
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
      if (data.success && data.credits) {
        setCreditsState(data.credits);
      }
    } catch (e) {}
  };

  const handleResetCredits = async () => {
    try {
      const res = await fetch('/api/credits/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.credits) {
        setCreditsState(data.credits);
      }
    } catch (e) {}
  };

  const updateSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    onChangeSettings({ ...settings, [key]: value });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 text-xs select-none">
      {/* AI Credit Management Dashboard */}
      <div className={`p-3 rounded-2xl border flex flex-col gap-3 ${
        isDark ? 'bg-slate-950/40 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'
      }`}>
        <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-indigo-500/20">
              <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-200 text-[10px] uppercase tracking-wider">AI Pipeline Quota</span>
              <span className="text-[9px] text-slate-500">Auto-switch to LLMs on low balance</span>
            </div>
          </div>
          <button 
            onClick={handleResetCredits}
            className="flex items-center gap-1 px-2 py-1 text-[9px] font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg cursor-pointer transition-all"
          >
            <RefreshCw className="w-2.5 h-2.5 animate-spin-hover" /> Reset Pool
          </button>
        </div>

        {/* Credit Gauge progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Credits Remaining:</span>
            <span className={`font-mono font-bold ${
              creditsState.remainingCredits <= creditsState.autoSwitchThreshold ? 'text-red-400' : creditsState.remainingCredits <= 50 ? 'text-yellow-400' : 'text-cyan-400'
            }`}>
              {creditsState.remainingCredits} / {creditsState.totalCredits}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                creditsState.remainingCredits <= creditsState.autoSwitchThreshold ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : creditsState.remainingCredits <= 50 ? 'bg-yellow-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${(creditsState.remainingCredits / creditsState.totalCredits) * 100}%` }}
            />
          </div>
        </div>

        {/* Low balance warning */}
        {creditsState.remainingCredits <= creditsState.autoSwitchThreshold && (
          <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20 text-[9px] text-red-300 leading-normal">
            <span className="shrink-0 text-red-400 animate-pulse font-bold text-xs">⚠️</span>
            <span>
              <strong>Quota Limit Warning:</strong> Balance reached low threshold ({creditsState.remainingCredits} credits). Auto-switch is active; new cloud runs will automatically compile via local offline engines.
            </span>
          </div>
        )}

        {/* Toggle Auto-Switch option */}
        <div className="flex items-center justify-between border-t border-indigo-500/10 pt-2 text-[10px]">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-slate-300">Auto-Switch Engine</span>
            <span className="text-[8px] text-slate-500">Conserves cloud quota proactively</span>
          </div>
          <input
            type="checkbox"
            checked={creditsState.autoSwitchActive}
            onChange={e => handleToggleAutoSwitch(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 animate-fade-in"
          />
        </div>

        {/* Auto-Switch threshold slider */}
        {creditsState.autoSwitchActive && (
          <div className="flex flex-col gap-1.5 border-t border-indigo-500/5 pt-2">
            <div className="flex items-center justify-between text-[9px] text-slate-400">
              <span>Threshold Trigger:</span>
              <span className="font-mono font-bold text-slate-300">{creditsState.autoSwitchThreshold} Credits</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={creditsState.autoSwitchThreshold}
              onChange={e => handleUpdateThreshold(parseInt(e.target.value))}
              className="w-full accent-indigo-500 h-1 cursor-pointer bg-slate-900 border border-slate-800 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Font Size Option */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-400 font-extrabold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-cyan-400" /> Editor Font Size ({settings.fontSize}px)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="10"
            max="20"
            value={settings.fontSize}
            onChange={e => updateSetting('fontSize', parseInt(e.target.value))}
            className="flex-1 accent-indigo-600"
          />
        </div>
      </div>

      {/* Font Family Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-400 font-extrabold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
          <AlignLeft className="w-3.5 h-3.5 text-pink-400" /> Font Family
        </label>
        <select
          value={settings.fontFamily}
          onChange={e => updateSetting('fontFamily', e.target.value as any)}
          className={`w-full text-xs rounded-xl px-3 py-2 border focus:outline-none focus:ring-1 focus:ring-indigo-600 ${
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
      <div className="flex items-center justify-between py-1.5 border-b border-slate-800/20">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <WrapText className="w-3.5 h-3.5 text-emerald-400" /> Wrap Code Lines
          </span>
          <span className="text-[10px] text-slate-500">Wrap long lines to fit the view</span>
        </div>
        <input
          type="checkbox"
          checked={settings.wordWrap}
          onChange={e => updateSetting('wordWrap', e.target.checked)}
          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
        />
      </div>

      
      {/* Evolution Mode */}
      <div className="flex flex-col gap-2 py-2 border-b border-slate-800/20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-fuchsia-400" /> Evolution Mode
            </span>
            <span className="text-[10px] text-slate-500 max-w-[200px]">Allow Mandela vs Matrix Re-Imaginator to learn from this project to improve future generations. (Opt-in)</span>
          </div>
          <input
            type="checkbox"
            checked={!!settings.evolutionMode}
            onChange={e => updateSetting('evolutionMode', e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
          />
        </div>
        {settings.evolutionMode && (
          <div className="mt-1 p-2 rounded bg-fuchsia-500/10 border border-fuchsia-500/20">
             <p className="text-[9px] text-fuchsia-300/80 leading-relaxed">
               <strong>Active:</strong> Anonymized structure (architecture, layout patterns, dependency graphs) will be shared. No raw files or secrets are exfiltrated.
             </p>
          </div>
        )}
      </div>
  
      {/* Show Line Numbers */}
      <div className="flex items-center justify-between py-1.5 border-b border-slate-800/20">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Indent className="w-3.5 h-3.5 text-yellow-400" /> Line Numbers
          </span>
          <span className="text-[10px] text-slate-500">Display row indicators on left gutter</span>
        </div>
        <input
          type="checkbox"
          checked={settings.showLineNumbers}
          onChange={e => updateSetting('showLineNumbers', e.target.checked)}
          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
        />
      </div>

      {/* Tab Size Indentation */}
      <div className="flex items-center justify-between py-1.5 border-b border-slate-800/20">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Indent className="w-3.5 h-3.5 text-purple-400" /> Tab Spacing
          </span>
          <span className="text-[10px] text-slate-500">Choose indentation space width</span>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg shrink-0">
          {[2, 4].map(size => (
            <button
              key={size}
              onClick={() => updateSetting('tabSize', size as any)}
              className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer transition-all ${
                settings.tabSize === size ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {size} Spaces
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
