const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `            // Apply patches locally to files list
            files = files.map(originalFile => {
              const patch = patchesToApply.find((p: any) => p.path === originalFile.path);
              if (patch) {
                job.logs.push(\`   └─ Applied fix patch: \${patch.path}\`);
                return { ...originalFile, content: patch.content };
              }
              return originalFile;
            });`;

const target_alt = `            // Apply patches locally to files list
            files = files.map(originalFile => {
              const patch = patches.find((p: any) => p.path === originalFile.path);
              if (patch) {
                job.logs.push(\`   └─ Applied fix patch: \${patch.path}\`);
                return { ...originalFile, content: patch.content };
              }
              return originalFile;
            });`;

const replacement = `            // Apply patches locally to files list
            const existingPaths = new Set(files.map(f => f.path));
            files = files.map(originalFile => {
              const patch = patches.find((p: any) => p.path === originalFile.path);
              if (patch) {
                job.logs.push(\`   └─ Applied fix patch: \${patch.path}\`);
                return { ...originalFile, content: patch.content };
              }
              return originalFile;
            });
            // Add any NEW files that the AI generated
            for (const patch of patches) {
              if (!existingPaths.has(patch.path)) {
                job.logs.push(\`   └─ Created new file from patch: \${patch.path}\`);
                const name = patch.path.split('/').pop() || 'Unknown';
                const ext = name.split('.').pop() || '';
                let language = 'text';
                if (ext === 'kt') language = 'kotlin';
                else if (ext === 'java') language = 'java';
                else if (ext === 'xml') language = 'xml';
                else if (ext === 'gradle' || ext === 'kts') language = 'groovy';
                else if (ext === 'properties') language = 'properties';
                
                files.push({
                  name,
                  path: patch.path,
                  content: patch.content,
                  language
                });
              }
            }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.ts', code);
  console.log('patched target');
} else if (code.includes(target_alt)) {
  code = code.replace(target_alt, replacement);
  fs.writeFileSync('server.ts', code);
  console.log('patched target alt');
} else {
  console.log('target not found');
}
