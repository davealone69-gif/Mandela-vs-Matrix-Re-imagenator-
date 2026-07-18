const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Header
code = code.replace(
  "isDark ? 'bg-[#0d111b] border-slate-800/85' : 'bg-slate-100 border-slate-200 shadow-sm'",
  "isDark ? 'bg-[#0d111b]/80 backdrop-blur-xl border-slate-800/85' : 'bg-white/80 backdrop-blur-xl border-slate-200 shadow-sm'"
);

// Modals
code = code.replace(
  /className=\{\`w-full max-w-(.*?) rounded-2xl shadow-2xl overflow-hidden \$\{isDark \? 'bg-\[\#0f1423\] border border-slate-700\/50 text-slate-300' \: 'bg-white text-slate-800'\}\`/g,
  "className={`w-full max-w-$1 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ${isDark ? 'bg-[#0f1423]/95 backdrop-blur-2xl border border-slate-700/50 text-slate-200' : 'bg-white/95 backdrop-blur-2xl text-slate-800'}`"
);

// Dialog backdrop
code = code.replace(
  /className="fixed inset-0 bg-black\/60 z-50 flex items-center justify-center p-4"/g,
  'className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-200"'
);

// Left Panel
code = code.replace(
  "isDark ? 'bg-[#0a0d15] border-slate-800/80' : 'bg-slate-100 border-slate-200'",
  "isDark ? 'bg-[#0a0d15]/95 border-slate-800/80' : 'bg-slate-50 border-slate-200'"
);

// Right Panel
code = code.replace(
  "isDark ? 'bg-[#0a0d15] border-slate-800/80' : 'bg-slate-100 border-slate-200'",
  "isDark ? 'bg-[#0a0d15]/95 border-slate-800/80' : 'bg-slate-50 border-slate-200'"
);

// Center Editor Background
code = code.replace(
  "isDark ? 'bg-[#070a13]' : 'bg-white'",
  "isDark ? 'bg-[#050810]' : 'bg-white'"
);

// AI Chat messages
code = code.replace(
  "isDark ? 'bg-[#1a2133] border border-slate-700 text-slate-200 self-end rounded-br-none' : 'bg-indigo-600 text-white self-end rounded-br-none shadow-sm'",
  "isDark ? 'bg-gradient-to-tr from-indigo-900 to-[#1a2133] border border-indigo-700/30 text-indigo-50 self-end rounded-br-none shadow-lg shadow-indigo-900/20' : 'bg-indigo-600 text-white self-end rounded-br-none shadow-sm'"
);

code = code.replace(
  "bg-[#141021] border border-purple-500/10 text-purple-100 self-start rounded-bl-none",
  "bg-gradient-to-br from-[#120f1e] to-[#0a0812] border border-purple-500/20 text-purple-100 self-start rounded-bl-none shadow-lg shadow-purple-900/10"
);

// AI input box
code = code.replace(
  "bg-[#0f1423] border-slate-800 text-slate-200 focus:border-cyan-500/50",
  "bg-[#0b0e18] border-slate-700/50 text-slate-200 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
);

fs.writeFileSync('src/App.tsx', code);
