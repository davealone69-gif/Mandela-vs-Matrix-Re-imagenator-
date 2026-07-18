const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        const debugApkContent = \`DroidCraft compiled Android APK binary - Project Type: \${projectType.toUpperCase()}\\nTimestamp: \${data.timestamp}\`;
        const blob = new Blob([debugApkContent], { type: 'application/vnd.android.package-archive' });
        const url = URL.createObjectURL(blob);
        setApkDownloadUrl(url);`;

const replacement = `        // Provide the real APK download URL
        setApkDownloadUrl('/api/download-apk');`;

if (code.includes('const debugApkContent')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx with real download URL");
} else {
  console.log("Not found or already patched");
}
