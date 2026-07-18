import React from 'react';
import {
  X,
  Home,
  FolderOpen,
  FolderPlus,
  Download,
  Layers,
  Settings,
  HelpCircle,
  Cpu,
  Wifi,
  Battery,
  ChevronRight
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'home' | 'openProject' | 'newProject' | 'clone' | 'templates' | 'help' | 'settings') => void;
  theme: 'dark' | 'light';
  projectType: 'compose' | 'xml';
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  onSelectAction,
  theme,
  projectType
}: NavigationDrawerProps) {
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: '🏠 Home / Dashboard', action: () => onSelectAction('home') },
    { id: 'openProject', label: '📂 Open Sample Project', action: () => onSelectAction('openProject') },
    { id: 'newProject', label: '➕ New Project Scaffold', action: () => onSelectAction('newProject') },
    { id: 'clone', label: '📥 Clone from GitHub', action: () => onSelectAction('clone') },
    { id: 'templates', label: '📦 Snippet Templates', action: () => onSelectAction('templates') },
    { id: 'settings', label: '⚙️ Settings Panel', action: () => onSelectAction('settings') },
    { id: 'help', label: '❓ Help & Shortcuts', action: () => onSelectAction('help') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div
        className={`relative flex w-80 max-w-sm flex-col border-r shadow-2xl transition-transform duration-300 ${
          isDark ? 'bg-[#0a0e1a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500/15 p-1.5 rounded-lg text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">MiniDroid Studio</h2>
              <span className="text-[10px] text-slate-500 font-mono">v2.0 Lightweight IDE</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-slate-500/10 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Navigation Actions
          </div>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                item.action();
                onClose();
              }}
              className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                isDark
                  ? 'hover:bg-slate-900/60 text-slate-300 hover:text-cyan-400 hover:translate-x-1'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-indigo-600 hover:translate-x-1'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          ))}
        </div>

        {/* Status bar details in Drawer Footer */}
        <div className={`p-4 border-t text-[10px] font-mono text-slate-500 flex flex-col gap-2 ${
          isDark ? 'bg-[#080b15] border-slate-850' : 'bg-slate-50 border-slate-150'
        }`}>
          <div className="flex items-center justify-between">
            <span>ADB status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              CONNECTED
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Project Target:</span>
            <span className="text-cyan-400 font-bold uppercase">{projectType} Sandbox</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Virtual Device:</span>
            <span className="text-slate-400">Pixel 8 Pro (API 34)</span>
          </div>
          <div className="h-px bg-slate-800/40 my-1" />
          <div className="flex items-center justify-between text-[9px] opacity-75">
            <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-cyan-500" /> Wi-Fi 5Ghz</span>
            <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-emerald-500" /> 85% charging</span>
          </div>
        </div>
      </div>
    </div>
  );
}