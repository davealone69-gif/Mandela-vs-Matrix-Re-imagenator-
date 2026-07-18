const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
// Real APK Download Endpoint
app.get('/api/download-apk', (req, res) => {
  const apkPath = path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  if (fs.existsSync(apkPath)) {
    res.download(apkPath, 'AutoDroid-debug.apk');
  } else {
    res.status(404).send("APK is still building or not found. Please try again in a few minutes.");
  }
});
`;

if (!code.includes('/api/download-apk')) {
  code = code.replace(
    "app.listen(PORT",
    newEndpoint + "\n  app.listen(PORT"
  );
  fs.writeFileSync('server.ts', code);
  console.log("Patched server.ts with /api/download-apk");
} else {
  console.log("Already patched.");
}
