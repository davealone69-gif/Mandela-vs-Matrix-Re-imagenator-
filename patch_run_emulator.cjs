const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldRun = `  const handleRunEmulator = async () => {
    setIsCompiling(true);
    setConsoleTab('build');
    setBuildLogs(prev => [...prev, \`[\${new Date().toLocaleTimeString()}] Syncing code changes to emulator...\`]);

    await new Promise(r => setTimeout(r, 1000));

    try {
      const response = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files })
      });
      const data = await response.json();

      if (data.success) {
        setBuildLogs(prev => [
          ...prev,
          \`Success. Started: com.example.droidcraft/.MainActivity\`,
          \`BUILD SUCCESSFUL\`
        ]);
        setBuildErrorLines([]);
        triggerToast('Hot-loaded onto Connected Emulator!');
        triggerLogcat('ActivityManager', 'Restarting activity com.example.droidcraft/.MainActivity');
      } else {
        setBuildLogs(prev => [...prev, \`Build failed. Sync cancelled.\`]);
        setBuildErrorLines(data.diagnostics);
        triggerToast('Run failed. Check compiler tab!');
      }
    } catch (err: any) {
      setBuildLogs(prev => [...prev, \`Emulator Sync Error: \${err.message}\`]);
    } finally {
      setIsCompiling(false);
    }
  };`;

const newRun = `  const handleRunEmulator = async () => {
    setIsCompiling(true);
    setConsoleTab('build');
    setBuildLogs(prev => [...prev, \`[\${new Date().toLocaleTimeString()}] Syncing code changes to emulator...\`]);

    if (editorSettings.evolutionMode) {
      setBuildLogs(prev => [...prev, \`[Evolution Mode] Extracting structural patterns locally...\`]);
      try {
        await fetch('/api/evolution/learn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             dependencyGraph: files.map(f => f.name),
             layoutPatterns: ['MainActivity', 'ComposeRoot'],
             componentTree: ['App']
          })
        });
        setBuildLogs(prev => [...prev, \`[Evolution Mode] Anonymized patterns shared to improve templates.\`]);
      } catch (e) {
        // ignore
      }
    }

    await new Promise(r => setTimeout(r, 1000));

    try {
      const response = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files })
      });
      const data = await response.json();

      if (data.success) {
        setBuildLogs(prev => [
          ...prev,
          \`Success. Started: com.example.droidcraft/.MainActivity\`,
          \`BUILD SUCCESSFUL\`
        ]);
        setBuildErrorLines([]);
        triggerToast('Hot-loaded onto Connected Emulator!');
        triggerLogcat('ActivityManager', 'Restarting activity com.example.droidcraft/.MainActivity');
      } else {
        setBuildLogs(prev => [...prev, \`Build failed. Sync cancelled.\`]);
        setBuildErrorLines(data.diagnostics);
        triggerToast('Run failed. Check compiler tab!');
      }
    } catch (err: any) {
      setBuildLogs(prev => [...prev, \`Emulator Sync Error: \${err.message}\`]);
    } finally {
      setIsCompiling(false);
    }
  };`;

if (code.includes('const handleRunEmulator = async () => {')) {
  code = code.replace(oldRun, newRun);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched handleRunEmulator");
} else {
  console.log("Not found.");
}
