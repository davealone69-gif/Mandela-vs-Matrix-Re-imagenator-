#!/usr/bin/env node
/**
 * Deep repair ALL remaining DriveLog / old-BOM strings.
 * Identities are NOT mixed:
 *   HOST shell  → com.mandelamatrix.reimaginator (already applied in Capacitor/Android)
 *   FACTORY / workspace templates → com.example.aiapp
 *
 * Usage from repo root:
 *   node scripts/repair_all.cjs
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function patchFile(rel, replacements) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) {
    console.warn('SKIP (missing):', rel);
    return;
  }
  let src = fs.readFileSync(fp, 'utf8');
  const before = src;
  for (const [from, to] of replacements) {
    if (from instanceof RegExp) src = src.replace(from, to);
    else src = src.split(from).join(to);
  }
  if (src === before) {
    console.log('OK (no changes):', rel);
    return;
  }
  fs.writeFileSync(fp, src);
  console.log('PATCHED:', rel, '(', before.length, '→', src.length, ')');
}

// --- server.ts: factory generation only ---
patchFile('server.ts', [
  [/com\.drivelog/g, 'com.example.aiapp'],
  [/compose-bom:2023\.08\.00/g, 'compose-bom:2024.06.00'],
  [/kotlinCompilerExtensionVersion\s*=\s*"1\.5\.8"/g, 'kotlinCompilerExtensionVersion = "1.5.14"'],
  [/compileSdk\s*=\s*34/g, 'compileSdk = 36'],
  [/targetSdk\s*=\s*34/g, 'targetSdk = 36'],
  [/compileSdkVersion\s+34/g, 'compileSdkVersion 36'],
  [/targetSdkVersion\s+34/g, 'targetSdkVersion 36'],
]);

// --- App.tsx: workspace / simulator strings (factory package, not host) ---
patchFile('src/App.tsx', [
  ['App/src/main/java/com/drivelog/MainActivity.kt', 'App/src/main/java/com/example/aiapp/MainActivity.kt'],
  ['package com.drivelog', 'package com.example.aiapp'],
  ['com.drivelog.ACTION_OPEN_AI', 'com.example.aiapp.ACTION_OPEN_AI'],
  ['Aligned to com.drivelog.', 'Aligned to com.example.aiapp (factory workspace).'],
  ['Process: com.drivelog,', 'Process: com.example.aiapp,'],
  ['Started: com.drivelog/.MainActivity', 'Started: com.example.aiapp/.MainActivity'],
  ['Restarting activity com.drivelog/.MainActivity', 'Restarting activity com.example.aiapp/.MainActivity'],
  ['content://com.drivelog.provider/trips/active', 'content://com.example.aiapp.provider/trips/active'],
  ['DriveLog_Core_SDK_v3.zip', 'ReImaginator_Core_SDK_v3.zip'],
  ['DriveLog Core SDK', 'Re-Imaginator Core SDK'],
  ['DriveLogResolver', 'AiAppResolver'],
  ['com.drivelog', 'com.example.aiapp'],
]);

// --- Cyber dashboard: HOST package label ---
patchFile('src/components/CyberCrossTechDashboard.tsx', [
  ['com.drivelog.ai', 'com.mandelamatrix.reimaginator'],
]);

// --- leftover UI / scripts ---
patchFile('src/components/IntegritySweepDialog.tsx', [
  ["'com.drivelog'", "'com.mandelamatrix.reimaginator'"],
]);

console.log('\nDone. Host = com.mandelamatrix.reimaginator | Factory = com.example.aiapp');
console.log('Commit the patched files, then restart the server.');
