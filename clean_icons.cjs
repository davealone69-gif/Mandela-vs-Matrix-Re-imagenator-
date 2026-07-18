const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const validLucideIcons = [
  'Play', 'Folder', 'FileText', 'Terminal', 'Search', 'Cpu', 'Settings', 'Github', 
  'Globe', 'Smartphone', 'Monitor', 'ChevronRight', 'ChevronDown', 'X', 'Plus', 
  'MoreVertical', 'Copy', 'Check', 'Download', 'Upload', 'RefreshCw', 'Zap', 
  'Shield', 'AlertTriangle', 'Info', 'Eye', 'EyeOff', 'Lock', 'Unlock', 'User',
  'Wifi', 'WifiOff', 'Battery', 'BatteryCharging', 'Bluetooth', 'Camera', 'Video',
  'Mic', 'MicOff', 'Volume2', 'VolumeX', 'PlaySquare', 'Package', 'TestTube2', 
  'Gauge', 'Flame', 'ShieldAlert', 'Boxes', 'Dna', 'Target', 'Brain', 'ServerCog', 
  'Award', 'ShieldCheck', 'SmartphoneNfc', 'Gem', 'BrainCircuit', 'Share2', 'Lightbulb',
  'BookOpen', 'Menu', 'LayoutDashboard', 'Code', 'CheckCircle2', 'Box', 'Hexagon', 'Orbit',
  'Infinity', 'Rocket', 'Sparkles', 'Workflow', 'Cpu', 'Braces', 'Layers', 'Atom', 'MessageSquare',
  'CloudLightning', 'Command', 'ZapOff', 'CloudRain'
];

const usedIcons = new Set();
for (const icon of validLucideIcons) {
  if (appCode.includes('<' + icon) || appCode.includes(icon + ' ') || appCode.includes(icon + ',')) {
    usedIcons.add(icon);
  }
}

appCode = appCode.replace(/import\s+{([^}]+)}\s+from\s+'lucide-react';/g, '');

const correctImport = "import { " + Array.from(usedIcons).join(', ') + " } from 'lucide-react';\n";
appCode = appCode.replace(/(import React[^;]*;)/, "$1\n" + correctImport);

fs.writeFileSync('src/App.tsx', appCode);
console.log('Cleaned lucide imports');
