const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!code.includes('import ApkBuildOrchestratorDialog')) {
  code = code.replace(
    "import IntegritySweepDialog from './components/IntegritySweepDialog';",
    "import IntegritySweepDialog from './components/IntegritySweepDialog';\nimport ApkBuildOrchestratorDialog from './components/ApkBuildOrchestratorDialog';"
  );
}

// Modify activeDialog type
code = code.replace(
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | null>(null);",
  "const [activeDialog, setActiveDialog] = useState<'appAutopsy' | 'integritySweep' | 'apkOrchestrator' | null>(null);"
);

// We need to modify handleBuildApk to just open the dialog, and move the actual build logic to a new function handleActualBuildApk
const handleBuildApkTarget = `  const handleBuildApk = async () => {`;
const handleBuildApkReplacement = `  const handleActualBuildApk = async () => {`;

if (code.includes(handleBuildApkTarget)) {
  code = code.replace(handleBuildApkTarget, handleBuildApkReplacement);
  
  // Now add the new handleBuildApk that opens the dialog
  const newHandleBuildApk = `
  const handleBuildApk = () => {
    setActiveDialog('apkOrchestrator');
  };

  const handleActualBuildApk = async () => {`;
  code = code.replace(handleBuildApkReplacement, newHandleBuildApk);
}

// Add the dialog to the render method
const dialogTarget = `{activeDialog === 'integritySweep' && <IntegritySweepDialog isDark={isDark} onClose={() => setActiveDialog(null)} files={files} />}`;
const dialogReplacement = `{activeDialog === 'integritySweep' && <IntegritySweepDialog isDark={isDark} onClose={() => setActiveDialog(null)} files={files} />}

      {activeDialog === 'apkOrchestrator' && (
        <ApkBuildOrchestratorDialog 
          isDark={isDark} 
          onClose={() => setActiveDialog(null)} 
          onComplete={() => {
             // Close after a short delay or let user close
             // Trigger actual build
             handleActualBuildApk();
          }} 
        />
      )}`;

if (code.includes(dialogTarget) && !code.includes('apkOrchestratorDialog')) {
  code = code.replace(dialogTarget, dialogReplacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for ApkBuildOrchestratorDialog");
