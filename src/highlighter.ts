export function highlightCode(code: string, lang: string, isDark: boolean): string {
  if (!code) return '';
  
  // Escaping HTML characters
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  const tokens: { [key: string]: string } = {};
  let tokenCounter = 0;
  
  const addToken = (value: string, className: string) => {
    const id = `__TOKEN_${tokenCounter++}__`;
    tokens[id] = `<span class="${className}">${value}</span>`;
    return id;
  };

  // 1. Comments
  if (lang === 'xml') {
    escaped = escaped.replace(/&lt;!--[\s\S]*?--&gt;/g, (match) => 
      addToken(match, isDark ? 'text-slate-500 italic' : 'text-slate-400 italic')
    );
  } else {
    // Multi-line
    escaped = escaped.replace(/\/\*[\s\S]*?\*\//g, (match) => 
      addToken(match, isDark ? 'text-slate-500 italic' : 'text-slate-400 italic')
    );
    // Single line
    escaped = escaped.replace(/\/\/[^\n]*/g, (match) => 
      addToken(match, isDark ? 'text-slate-500 italic' : 'text-slate-400 italic')
    );
  }

  // 2. Strings
  if (lang === 'xml') {
    escaped = escaped.replace(/"[^"]*"/g, (match) => 
      addToken(match, isDark ? 'text-emerald-400' : 'text-emerald-600')
    );
    escaped = escaped.replace(/'[^']*'/g, (match) => 
      addToken(match, isDark ? 'text-emerald-400' : 'text-emerald-600')
    );
  } else {
    escaped = escaped.replace(/"(\\.|[^"\\])*"/g, (match) => 
      addToken(match, isDark ? 'text-emerald-400' : 'text-emerald-600')
    );
    escaped = escaped.replace(/'(\\.|[^'\\])*'/g, (match) => 
      addToken(match, isDark ? 'text-emerald-400' : 'text-emerald-600')
    );
  }

  // 3. Annotations (Kotlin/Java)
  if (lang === 'kotlin' || lang === 'java') {
    escaped = escaped.replace(/@[a-zA-Z0-9_]+/g, (match) => 
      addToken(match, isDark ? 'text-amber-400 font-semibold' : 'text-amber-600 font-semibold')
    );
  }

  // 4. Language-specific Keywords
  let keywords: string[] = [];
  if (lang === 'kotlin') {
    keywords = ['package', 'import', 'class', 'interface', 'fun', 'val', 'var', 'return', 'if', 'else', 'for', 'while', 'when', 'override', 'private', 'public', 'internal', 'protected', 'null', 'true', 'false', 'as', 'by', 'this', 'super', 'try', 'catch', 'finally', 'throw'];
  } else if (lang === 'java') {
    keywords = ['package', 'import', 'class', 'interface', 'void', 'int', 'double', 'float', 'boolean', 'char', 'long', 'short', 'byte', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'override', 'private', 'public', 'protected', 'null', 'true', 'false', 'new', 'this', 'super', 'try', 'catch', 'finally', 'throw', 'extends', 'implements', 'static', 'final'];
  } else if (lang === 'groovy') {
    keywords = ['plugins', 'android', 'compileSdk', 'defaultConfig', 'applicationId', 'minSdk', 'targetSdk', 'versionCode', 'versionName', 'buildTypes', 'release', 'dependencies', 'implementation', 'apply', 'plugin', 'repositories', 'google', 'mavenCentral', 'gradlePluginPortal', 'dependencyResolutionManagement', 'repositoriesMode', 'include', 'rootProject', 'name', 'isMinifyEnabled', 'proguardFiles', 'getDefaultProguardFile', 'alias', 'libs'];
  } else if (lang === 'json' || lang === 'yaml') {
    keywords = ['true', 'false', 'null'];
  }

  if (keywords.length > 0) {
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, (match) => 
      addToken(match, isDark ? 'text-pink-400 font-bold' : 'text-indigo-600 font-bold')
    );
  }

  // 5. Types
  if (lang === 'kotlin' || lang === 'java') {
    escaped = escaped.replace(/\b([A-Z][a-zA-Z0-9_]+)\b/g, (match) => 
      addToken(match, isDark ? 'text-cyan-400 font-semibold' : 'text-cyan-600 font-semibold')
    );
  }

  // 6. XML elements/attributes
  if (lang === 'xml') {
    escaped = escaped.replace(/&lt;\/?[a-zA-Z0-9_\.:-]+/g, (match) => 
      addToken(match, isDark ? 'text-purple-400 font-bold' : 'text-purple-700 font-bold')
    );
    escaped = escaped.replace(/\/?&gt;/g, (match) => 
      addToken(match, isDark ? 'text-purple-400 font-bold' : 'text-purple-700 font-bold')
    );
    escaped = escaped.replace(/\b([a-zA-Z0-9_-]+:?[a-zA-Z0-9_-]*)\s*=/g, (match, p1) => {
      return addToken(p1, isDark ? 'text-indigo-400 font-semibold' : 'text-blue-600 font-semibold') + '=';
    });
  }

  // 7. Markdown
  if (lang === 'markdown') {
    // Headers
    escaped = escaped.replace(/^(#{1,6}\s+.*)$/gm, (match) => 
      addToken(match, isDark ? 'text-cyan-400 font-bold' : 'text-cyan-700 font-bold')
    );
    // Bold
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, (match, p1) => 
      addToken('**' + p1 + '**', 'font-extrabold text-slate-100')
    );
    // Italics
    escaped = escaped.replace(/\*([^*]+)\*/g, (match, p1) => 
      addToken('*' + p1 + '*', 'italic text-slate-400')
    );
    // Lists
    escaped = escaped.replace(/^(\s*[-*+]\s+.*)$/gm, (match) => 
      addToken(match, isDark ? 'text-pink-400' : 'text-pink-600')
    );
    // Code ticks
    escaped = escaped.replace(/`([^`]+)`/g, (match, p1) => 
      addToken('`' + p1 + '`', isDark ? 'bg-slate-900 px-1 rounded text-amber-300 font-mono' : 'bg-slate-200 px-1 rounded text-amber-800 font-mono')
    );
  }

  // 8. Restore tokens
  let previous;
  do {
    previous = escaped;
    for (const [id, html] of Object.entries(tokens)) {
      escaped = escaped.replace(id, html);
    }
  } while (escaped !== previous);

  return escaped;
}
