const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Find all used lucide-react components
const lucideImports = new Set();
const matches = appCode.matchAll(/<([A-Z][a-zA-Z0-9]*)\s/g);
for (const match of matches) {
  lucideImports.add(match[1]);
}
const toIgnore = new Set(['FileExplorer', 'Editor', 'Terminal', 'TerminalPanel', 'SettingsPanel', 'PreviewWindow', 'PlayStorePublishOrchestratorDialog', 'PerformanceTortureTestDialog', 'UXStabilityGauntletDialog', 'StandaloneApkGeneratorDialog', 'UniversalNativeBridgeDialog', 'CapacitorShellWrapperDialog', 'OmniSystemSingularityCoreDialog', 'ApkBuildOrchestratorDialog', 'IntegritySweepDialog', 'AutoUITestSystemDialog', 'PerformanceOptimizationEngineDialog', 'HardwareCapabilityModuleGeneratorDialog', 'ArchitectureShiftingEngineDialog', 'EvolutionaryCodeGeneratorDialog', 'IntentDrivenFeatureBuilderDialog', 'CognitiveUXAnalyzerDialog', 'ContinuousAppEvolutionModeDialog', 'ZeroTrustSecurityMatrixDialog', 'SelfArchitectingNetworkDialog', 'GenerativeGenomeConstructorDialog', 'RecursiveEvolutionEngineDialog', 'CrossAppSymbiosisDialog', 'AutonomousProductionReleaseDialog', 'EcosystemSimulationEngineDialog', 'MythicCodexArchitectDialog', 'PrimeDirectiveOverrideDialog']);

const validIcons = Array.from(lucideImports).filter(i => !toIgnore.has(i));

// Add the ones mentioned in errors just to be safe
const fromErrors = ['PlaySquare', 'Package', 'TestTube2', 'Gauge', 'Flame', 'ShieldAlert', 'Boxes', 'Dna', 'Target', 'Brain', 'ServerCog', 'Award', 'ShieldCheck', 'Globe', 'SmartphoneNfc', 'Gem', 'BrainCircuit', 'Share2', 'Lightbulb', 'Eye', 'BookOpen', 'Shield'];
for (const icon of fromErrors) validIcons.push(icon);

const finalIcons = Array.from(new Set(validIcons)).filter(i => i !== 'div' && i !== 'span' && i !== 'button' && i !== 'input' && i !== 'img' && i !== 'iframe' && i !== 'a' && i !== 'select' && i !== 'option' && i !== 'p' && i !== 'h1' && i !== 'h2' && i !== 'h3' && i !== 'h4' && i !== 'ul' && i !== 'li');

appCode = appCode.replace(/import\s+{([^}]+)}\s+from\s+'lucide-react';/g, `import { ${finalIcons.join(', ')} } from 'lucide-react';`);

// Remove any stray Duplicate imports of lucide-react or individual lines
appCode = appCode.replace(/import\s+{\s*CheckCircle\s*}\s*from\s*'lucide-react';/g, '');
appCode = appCode.replace(/import\s+{\s*AlertTriangle\s*}\s*from\s*'lucide-react';/g, '');

fs.writeFileSync('src/App.tsx', appCode);

let settingsCode = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf8');
const settingsIcons = ['Settings', 'RefreshCw', 'Smartphone', 'Monitor', 'ChevronRight', 'CheckCircle2', 'Shield', 'Brain', 'Type', 'AlignLeft', 'WrapText', 'Indent'];
settingsCode = settingsCode.replace(/import\s+{([^}]+)}\s+from\s+'lucide-react';/g, `import { ${settingsIcons.join(', ')} } from 'lucide-react';`);
fs.writeFileSync('src/components/SettingsPanel.tsx', settingsCode);

console.log('Fixed icons in App.tsx and SettingsPanel.tsx');
