const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');

if (!code.includes('Share Anonymized Project Data')) {
  // Add Brain icon
  if (!code.includes('Brain')) {
    code = code.replace("import { Type, WrapText, Indent, AlignLeft } from 'lucide-react';", "import { Type, WrapText, Indent, AlignLeft, Brain } from 'lucide-react';");
  }

  const newToggle = `
      {/* Evolution Mode */}
      <div className="flex flex-col gap-2 py-2 border-b border-slate-800/20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-fuchsia-400" /> Evolution Mode
            </span>
            <span className="text-[10px] text-slate-500 max-w-[200px]">Allow AutoDroid to learn from this project to improve future generations. (Opt-in)</span>
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
  `;

  code = code.replace('{/* Show Line Numbers */}', newToggle + '\n      {/* Show Line Numbers */}');
  fs.writeFileSync('src/components/SettingsPanel.tsx', code);
  console.log("Patched SettingsPanel");
}
