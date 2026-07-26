#!/usr/bin/env node
/**
 * Deep-repair helper: patch factory generation strings inside server.ts
 * WITHOUT changing host Capacitor identity (com.mandelamatrix.reimaginator).
 *
 * Generated apps → com.example.aiapp
 * Compose BOM → 2024.06.00
 * compileSdk / targetSdk → 36
 * kotlinCompilerExtensionVersion → 1.5.14
 *
 * Usage: node scripts/repair_factory_server_bom.cjs
 */
const fs = require('fs');
const path = require('path');

const target = path.join(process.cwd(), 'server.ts');
if (!fs.existsSync(target)) {
  console.error('server.ts not found at', target);
  process.exit(1);
}

let src = fs.readFileSync(target, 'utf8');
const before = src.length;

const replacements = [
  [/com\.drivelog/g, 'com.example.aiapp'],
  [/compose-bom:2023\.08\.00/g, 'compose-bom:2024.06.00'],
  [/kotlinCompilerExtensionVersion\s*=\s*"1\.5\.8"/g, 'kotlinCompilerExtensionVersion = "1.5.14"'],
  [/compileSdk\s*=\s*34/g, 'compileSdk = 36'],
  [/targetSdk\s*=\s*34/g, 'targetSdk = 36'],
  [/compileSdkVersion\s+34/g, 'compileSdkVersion 36'],
  [/targetSdkVersion\s+34/g, 'targetSdkVersion 36'],
];

for (const [re, to] of replacements) {
  src = src.replace(re, to);
}

fs.writeFileSync(target, src);
console.log('Patched server.ts factory templates.');
console.log('Size before/after:', before, src.length);
console.log('Host Capacitor package is NOT modified by this script.');
