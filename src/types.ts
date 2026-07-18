export interface FileItem {
  name: string;
  path: string;
  content: string;
  language: 'kotlin' | 'java' | 'xml' | 'groovy' | 'json' | 'yaml' | 'markdown';
}

export interface LogItem {
  id: string;
  time: string;
  level: 'V' | 'D' | 'I' | 'W' | 'E';
  tag: string;
  message: string;
}

export interface HistoryState {
  past: string[];
  future: string[];
}

export interface SearchMatch {
  filePath: string;
  fileName: string;
  lineIndex: number;
  lineContent: string;
}

export interface EditorSettings {
  fontSize: number;
  fontFamily: 'JetBrains Mono' | 'Fira Code' | 'Source Code Pro' | 'monospace';
  wordWrap: boolean;
  tabSize: 2 | 4;
  showLineNumbers: boolean;
  evolutionMode?: boolean;
}

export interface SavedApp {
  id: string;
  name: string;
  timestamp: number;
  projectType: 'compose' | 'xml';
  files: FileItem[];
}
