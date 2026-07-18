import React from 'react';
import { FileCode, X, Download, Copy } from 'lucide-react';

interface TabsHeaderProps {
  openTabs: string[];
  activeFilePath: string;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
  onCopyAll: () => void;
  apkDownloadUrl: string | null;
  theme: 'dark' | 'light';
}

export default function TabsHeader({
  openTabs,
  activeFilePath,
  onSelectTab,
  onCloseTab,
  onCopyAll,
  apkDownloadUrl,
  theme
}: TabsHeaderProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`h-11 border-b flex items-center justify-between px-3 select-none shrink-0 ${
        isDark ? 'bg-[#0a0d15] border-slate-800/80' : 'bg-slate-100 border-slate-200'
      }`}
    >
      {/* Scrollable Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto h-full scrollbar-none pr-4">
        {openTabs.map(path => {
          const fileName = path.split('/').pop() || '';
          const isActive = path === activeFilePath;
          
          return (
            <div
              key={path}
              onClick={() => onSelectTab(path)}
              className={`h-full flex items-center gap-2 px-3.5 text-xs font-mono border-b-2 cursor-pointer transition-all ${
                isActive
                  ? isDark
                    ? 'bg-[#121929] text-cyan-400 border-b-cyan-500 font-bold border-x border-slate-800'
                    : 'bg-white text-indigo-600 border-b-indigo-600 font-bold border-x border-slate-200 shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 border-b-transparent hover:bg-[#101422]/40'
                  : 'text-slate-600 hover:text-slate-900 border-b-transparent hover:bg-slate-200/50'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="truncate max-w-[120px]">{fileName}</span>
              
              <button
                onClick={e => {
                  e.stopPropagation();
                  onCloseTab(path);
                }}
                className="p-0.5 rounded-full hover:bg-slate-800/20 text-slate-500 hover:text-red-400 transition-all ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        {openTabs.length === 0 && (
          <span className="text-xs text-slate-500 italic px-2">No files open</span>
        )}
      </div>

      {/* Side Utilities */}
      <div className="flex items-center gap-2">
        <button
          onClick={onCopyAll}
          className={`px-2.5 py-1 text-[10px] rounded-lg border flex items-center gap-1 transition-all ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
          }`}
          title="Copy full active file content"
        >
          <Copy className="w-3 h-3 text-slate-400" />
          Copy All
        </button>
        {apkDownloadUrl && (
          <a
            href={apkDownloadUrl}
            download="app-debug.apk"
            className="px-2.5 py-1 text-[10px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
          >
            <Download className="w-3.5 h-3.5" /> Download APK
          </a>
        )}
      </div>
    </div>
  );
}
