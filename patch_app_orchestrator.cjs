const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import the dialog
if (!code.includes('import ApkBuildOrchestratorDialog')) {
  code = code.replace(
    "import IntegritySweepDialog from './components/IntegritySweepDialog';",
    "import IntegritySweepDialog from './components/IntegritySweepDialog';\nimport ApkBuildOrchestratorDialog from './components/ApkBuildOrchestratorDialog';"
  );
}

// 2. We need to open the dialog when Compile Release APK is clicked.
// Instead of handleBuildApk doing the work, it just opens the dialog.
if (code.includes('const handleBuildApk = async () => {')) {
  code = code.replace(
    /const handleBuildApk = async \(\) => \{[\s\S]*? setIsCompiling\(false\);\n    }\n  };/,
    "const handleBuildApk = () => {\n    setActiveDialog('apkOrchestrator');\n  };"
  );
}

// 3. Add the dialog rendering
if (!code.includes("activeDialog === 'apkOrchestrator'")) {
  code = code.replace(
    "{activeDialog === 'integritySweep' && <IntegritySweepDialog",
    "{activeDialog === 'apkOrchestrator' && (\n        <ApkBuildOrchestratorDialog \n          isDark={isDark} \n          onClose={() => setActiveDialog(null)} \n          files={files}\n          onApkReady={(url) => setApkDownloadUrl(url)}\n        />\n      )}\n\n      {activeDialog === 'integritySweep' && <IntegritySweepDialog"
  );
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx with ApkBuildOrchestratorDialog");
