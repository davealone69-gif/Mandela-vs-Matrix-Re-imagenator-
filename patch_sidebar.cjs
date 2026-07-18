const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add 'ai' to sidebarTab type
code = code.replace(
  "const [sidebarTab, setSidebarTab] = useState<'files' | 'search' | 'settings' | 'git' | 'factory' | 'saved'>('files');",
  "const [sidebarTab, setSidebarTab] = useState<'files' | 'search' | 'settings' | 'git' | 'factory' | 'saved' | 'ai'>('files');"
);

// 2. Add AI Copilot Button in Sub Tab Switchers
const subTabSwitchersRegex = /<button\s+onClick=\{\(\) => setSidebarTab\('git'\)\}.*?<\/button>/s;
const gitButtonMatch = code.match(subTabSwitchersRegex);
if (gitButtonMatch) {
  const aiButton = `
            <button
              onClick={() => setSidebarTab('ai')}
              className={\`flex-1 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer transition-all \${
                sidebarTab === 'ai'
                  ? isDark
                    ? 'bg-slate-900 text-fuchsia-400 font-extrabold shadow'
                    : 'bg-white text-fuchsia-600 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
            >
              AI Copilot
            </button>`;
  code = code.replace(gitButtonMatch[0], gitButtonMatch[0] + aiButton);
} else {
  console.log("Could not find git button");
}

fs.writeFileSync('src/App.tsx', code);
