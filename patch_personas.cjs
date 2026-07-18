const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `const [aiPersona, setAiPersona] = useState<'General' | 'UI_UX' | 'Architect' | 'Reviewer'>('General');`,
  `const [aiPersona, setAiPersona] = useState<'General' | 'UI_UX' | 'Architect' | 'Reviewer' | 'Refactor' | 'TestGen' | 'Profiler'>('General');`
);

code = code.replace(
  `<option value="Reviewer">Code Reviewer</option>`,
  `<option value="Reviewer">Code Reviewer</option>
   <option value="Refactor">Refactoring Engine</option>
   <option value="TestGen">Espresso Test Generator</option>
   <option value="Profiler">Performance Profiler</option>`
);

// We need to add UI Preview and Plugin Marketplace
code = code.replace(
  `| 'newFolder' | 'newClass' | 'newActivity' | 'imageGen' | null>(null);`,
  `| 'newFolder' | 'newClass' | 'newActivity' | 'imageGen' | 'marketplace' | 'uiPreview' | null>(null);`
);

// Add buttons for Marketplace and UI Preview in Header or somewhere visible.
// Maybe in the top header where Image Gen is.
code = code.replace(
  `<button 
                onClick={() => setActiveDialog('imageGen')}`,
  `<button onClick={() => setActiveDialog('marketplace')} className="ml-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-bold text-white uppercase transition-colors flex items-center gap-1">
     <Box className="w-3 h-3" /> Plugins
   </button>
   <button onClick={() => setActiveDialog('uiPreview')} className="ml-2 px-3 py-1 bg-orange-600 hover:bg-orange-500 rounded-lg text-[10px] font-bold text-white uppercase transition-colors flex items-center gap-1">
     <Monitor className="w-3 h-3" /> AI Preview
   </button>
   <button 
                onClick={() => setActiveDialog('imageGen')}`
);

// Imports for icons
if(!code.includes("Box,")) {
  code = code.replace("Sparkles,", "Sparkles, Box, Monitor,");
}

fs.writeFileSync('src/App.tsx', code);
