const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace all <User /> with <UserIcon />
code = code.replace(/<User /g, '<UserIcon ');
code = code.replace(/<User\/>/g, '<UserIcon/>');
code = code.replace(/<User className/g, '<UserIcon className');

// Replace Clipboard with ClipboardIcon
code = code.replace(/<Clipboard /g, '<ClipboardIcon ');
code = code.replace(/<Clipboard className/g, '<ClipboardIcon className');
code = code.replace(/<Clipboard\/>/g, '<ClipboardIcon/>');

const missingIcons = ['Loader2', 'Sun', 'Moon', 'FolderPlus', 'Activity', 'Grid', 'CheckCircle', 'Trash2', 'FolderOpen', 'GitBranch', 'Wrench', 'Send', 'Undo2', 'Redo2', 'Scissors', 'Code2'];

// Append the missing ones plus the aliases to the end of the lucide-react import list
const replaceString = `, ${missingIcons.join(', ')}, User as UserIcon, Clipboard as ClipboardIcon } from 'lucide-react';`;
code = code.replace(/} from 'lucide-react';/, replaceString);

// Remove the bare User and Clipboard from lucide-react import
code = code.replace(/,\s*User\s*,/g, ',');
code = code.replace(/,\s*User\s*}/g, '}');
code = code.replace(/{\s*User\s*,/g, '{');

code = code.replace(/,\s*Clipboard\s*,/g, ',');
code = code.replace(/,\s*Clipboard\s*}/g, '}');
code = code.replace(/{\s*Clipboard\s*,/g, '{');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed more icons');
