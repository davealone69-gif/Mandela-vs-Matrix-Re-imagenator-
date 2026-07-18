import React, { useState, useEffect } from 'react';
import { Search, ArrowRightLeft, FileCode, CheckCircle, AlertCircle } from 'lucide-react';
import { FileItem, SearchMatch } from '../types';

interface SearchPanelProps {
  files: FileItem[];
  onSelectResult: (path: string, lineIndex: number) => void;
  onReplaceAll: (search: string, replace: string) => void;
  theme: 'dark' | 'light';
}

export default function SearchPanel({
  files,
  onSelectResult,
  onReplaceAll,
  theme
}: SearchPanelProps) {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [replacedStatus, setReplacedStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const matches: SearchMatch[] = [];
    const query = searchQuery.toLowerCase();

    files.forEach(file => {
      const lines = file.content.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query)) {
          matches.push({
            filePath: file.path,
            fileName: file.name,
            lineIndex: index,
            lineContent: line
          });
        }
      });
    });

    setResults(matches);
  }, [searchQuery, files]);

  const handleReplaceAllClick = () => {
    if (!searchQuery.trim()) return;
    onReplaceAll(searchQuery, replaceQuery);
    setReplacedStatus(`Replaced all occurrences of "${searchQuery}" with "${replaceQuery}"`);
    setTimeout(() => setReplacedStatus(null), 3000);
    setSearchQuery('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3">
      {/* Search Inputs */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search across files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full text-xs rounded-xl pl-9 pr-3 py-2 border transition-all focus:outline-none ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500'
                : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-600 shadow-sm'
            }`}
          />
        </div>

        <div className="relative">
          <ArrowRightLeft className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceQuery}
            onChange={e => setReplaceQuery(e.target.value)}
            className={`w-full text-xs rounded-xl pl-9 pr-3 py-2 border transition-all focus:outline-none ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500'
                : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-600 shadow-sm'
            }`}
          />
        </div>

        <button
          onClick={handleReplaceAllClick}
          disabled={!searchQuery.trim()}
          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          Replace All Matches
        </button>
      </div>

      {replacedStatus && (
        <div className="flex items-center gap-1.5 p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px]">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{replacedStatus}</span>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-extrabold uppercase tracking-wider px-1">
        <span>Results</span>
        <span>{results.length} matches found</span>
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5">
        {results.map((match, idx) => {
          // Highlight match inline
          const matchIndex = match.lineContent.toLowerCase().indexOf(searchQuery.toLowerCase());
          const before = match.lineContent.slice(0, matchIndex);
          const matchedText = match.lineContent.slice(matchIndex, matchIndex + searchQuery.length);
          const after = match.lineContent.slice(matchIndex + searchQuery.length);

          return (
            <div
              key={idx}
              onClick={() => onSelectResult(match.filePath, match.lineIndex)}
              className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                isDark
                  ? 'bg-slate-900/40 hover:bg-slate-900 border-slate-850 hover:border-slate-800'
                  : 'bg-white hover:bg-slate-100 border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-mono font-bold text-slate-400">{match.fileName}</span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded font-mono">L{match.lineIndex + 1}</span>
              </div>
              <pre className="text-[11px] font-mono whitespace-pre-wrap break-all text-slate-300 pl-2 border-l border-slate-700/50">
                <span>{before}</span>
                <mark className="bg-yellow-500/40 text-yellow-200 px-0.5 rounded">{matchedText}</mark>
                <span>{after}</span>
              </pre>
            </div>
          );
        })}
        {searchQuery && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-slate-500 gap-1">
            <AlertCircle className="w-6 h-6 text-slate-600" />
            <span className="text-xs">No matching files found</span>
          </div>
        )}
      </div>
    </div>
  );
}
