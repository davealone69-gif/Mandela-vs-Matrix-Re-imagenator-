const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const zip = new JSZip();

function addDirectoryToZip(zipFolder, dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
        
        // Exclusions
        if (
            file === 'node_modules' || 
            file === 'dist' || 
            file === '.git' || 
            file === '.gradle' ||
            file === 'build' ||
            file === 'project.zip' ||
            relativePath.startsWith('android/.gradle') ||
            relativePath.startsWith('android/app/build') ||
            relativePath.startsWith('android/build') ||
            relativePath.includes('node_modules') ||
            relativePath.includes('dist/') ||
            file.startsWith('patch') || // skip the messy patches in the root
            (file.startsWith('fix_') && file.endsWith('.cjs')) // skip messy fix scripts
        ) {
            continue;
        }

        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            const newZipFolder = zipFolder.folder(file);
            addDirectoryToZip(newZipFolder, fullPath);
        } else {
            const content = fs.readFileSync(fullPath);
            zipFolder.file(file, content);
        }
    }
}

async function run() {
    console.log("Starting ZIP generation...");
    
    // Include individual root files
    const rootFiles = [
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'capacitor.config.ts',
        'server.ts',
        'index.html',
        'metadata.json',
        '.gitignore',
        'README.md'
    ];

    for (const file of rootFiles) {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            zip.file(file, fs.readFileSync(fullPath));
        }
    }

    // Include folders
    const rootFolders = ['src', 'android', 'web', 'public', 'api', '.github'];
    for (const folder of rootFolders) {
        const fullPath = path.join(process.cwd(), folder);
        if (fs.existsSync(fullPath)) {
            const zipFolder = zip.folder(folder);
            addDirectoryToZip(zipFolder, fullPath);
        }
    }

    console.log("Compressing files with high-level compression...");
    const content = await zip.generateAsync({ 
        type: 'nodebuffer', 
        compression: 'DEFLATE', 
        compressionOptions: { level: 9 } 
    });
    
    // Ensure public folder exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicDir, 'project.zip'), content);
    console.log("Successfully created project.zip in public/ directory!");
}

run().catch(err => {
    console.error("ZIP Generation failed:", err);
});
