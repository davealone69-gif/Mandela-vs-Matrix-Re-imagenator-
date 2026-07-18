import React from 'react';
import {
  Sparkles,
  Send,
  Paperclip,
  Mic,
  MicOff,
  Smartphone,
  Terminal,
  Activity,
  AlertTriangle,
  Loader2,
  Download,
  Trash2,
  Copy,
  Info,
  Layers,
  Code2,
  Wifi
} from 'lucide-react';
import { LogItem } from '../types';

/* ==========================================
   AI COPILOT FULL PAGE
   ========================================== */
interface CopilotPageProps {
  isDark: boolean;
  aiMessages: any[];
  aiInput: string;
  setAiInput: (val: string) => void;
  handleSendAiMessage: () => void;
  isAiLoading: boolean;
  aiModel: string;
  setAiModel: (val: string) => void;
  aiPersona: string;
  setAiPersona: (val: any) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isTranscribing: boolean;
  toggleTranscription: () => void;
  isVoiceActive: boolean;
  toggleVoiceRecording: () => void;
}

export const CopilotPage: React.FC<CopilotPageProps> = ({
  isDark,
  aiMessages,
  aiInput,
  setAiInput,
  handleSendAiMessage,
  isAiLoading,
  aiModel,
  setAiModel,
  aiPersona,
  setAiPersona,
  handleFileUpload,
  fileInputRef,
  isTranscribing,
  toggleTranscription,
  isVoiceActive,
  toggleVoiceRecording
}) => {
  return (
    <div className={`flex-1 flex flex-col h-full w-full overflow-hidden ${
      isDark ? 'bg-[#080a13]' : 'bg-slate-100'
    }`}>
      
      {/* HEADER BAR FOR COPILOT */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 ${
        isDark ? 'bg-[#0d101a] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-200">AI Copilot Companion</h2>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2.5">
          <select
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className={`text-xs p-1.5 rounded-lg border font-bold ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Preview)</option>
            <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
          </select>

          <select
            value={aiPersona}
            onChange={(e) => setAiPersona(e.target.value)}
            className={`text-xs p-1.5 rounded-lg border font-bold ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="architect">Kotlin Architect</option>
            <option value="designer">Compose UI/UX Designer</option>
            <option value="general">Standard Assistant</option>
            <option value="debugger">Log & Compile Debugger</option>
          </select>
        </div>
      </div>

      {/* CHAT MESSAGES PANEL */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {aiMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <Sparkles className="w-12 h-12 text-purple-500 animate-pulse mb-4" />
            <h3 className="font-bold text-slate-200">Ask Death</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generate full Jetpack Compose visual interfaces, validate Android layouts, review Kotlin state handlers, or refactor standard Java nodes instantly.
            </p>
          </div>
        ) : (
          aiMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed text-left ${
                msg.sender === 'user'
                  ? 'self-end bg-purple-600 text-white rounded-br-none shadow-md'
                  : isDark
                    ? 'self-start bg-slate-900/60 border border-slate-800 text-slate-100 rounded-bl-none shadow'
                    : 'self-start bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="font-bold uppercase text-[9px] tracking-wider mb-1.5 opacity-60">
                {msg.sender === 'user' ? 'YOU' : `${aiPersona.toUpperCase()} ASSISTANT`}
              </div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          ))
        )}
        {isAiLoading && (
          <div className="self-start flex items-center gap-2 bg-purple-500/10 text-purple-400 p-3.5 rounded-xl text-xs border border-purple-500/20">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI partner is thinking...</span>
          </div>
        )}
      </div>

      {/* INPUT ATTACHMENT BOX */}
      <div className={`p-4 border-t ${
        isDark ? 'bg-[#0b0e17] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Attach Source Code File"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="*/*" onChange={handleFileUpload} />

          <input
            type="text"
            placeholder={`Ask our ${aiPersona} persona ...`}
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
            className={`flex-1 rounded-xl px-4 py-2.5 text-xs focus:outline-none border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-purple-500'
                : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 shadow-sm'
            }`}
          />

          <button
            onClick={toggleTranscription}
            className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              isTranscribing
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Record Audio"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={toggleVoiceRecording}
            className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              isVoiceActive
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Voice Assistant"
          >
            {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSendAiMessage}
            disabled={isAiLoading || !aiInput.trim()}
            className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
};


/* ==========================================
   PIXEL 8 PRO EMULATOR FULL PAGE
   ========================================== */
interface EmulatorPageProps {
  isDark: boolean;
  previewUi: any;
  projectType: 'compose' | 'xml';
  simCounter: number;
  simUsername: string;
  setSimUsername: (val: string) => void;
  simEmail: string;
  setSimEmail: (val: string) => void;
  simKey: string;
  setSimKey: (val: string) => void;
  triggerLogcat: (tag: string, msg: string) => void;
  editorContent: string;
  onRefresh: () => void;
  isCompiling: boolean;
}

export const EmulatorPage: React.FC<EmulatorPageProps> = ({
  isDark,
  previewUi,
  projectType,
  simCounter,
  simUsername,
  setSimUsername,
  simEmail,
  setSimEmail,
  simKey,
  setSimKey,
  triggerLogcat,
  editorContent,
  onRefresh,
  isCompiling
}) => {
  return (
    <div className={`flex-1 flex flex-col h-full w-full overflow-y-auto px-4 py-8 items-center ${
      isDark ? 'bg-[#080b13]' : 'bg-slate-100'
    }`}>
      
      {/* EMULATOR VIEWPORT */}
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* EMULATOR CHASSIS FRAME */}
        <div className={`w-full aspect-[9/19] rounded-[48px] border-[10px] p-3 flex flex-col relative shadow-2xl overflow-hidden shrink-0 transition-colors ${
          isDark ? 'bg-black border-slate-900 shadow-black/80' : 'bg-[#e5e9f0] border-slate-300 shadow-indigo-500/5'
        }`}>
          
          {/* CAMERA CUTOUT */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>

          {/* SIMULATOR SCREEN CONTENT */}
          <div className={`flex-1 rounded-[38px] overflow-hidden flex flex-col relative transition-colors ${
            isDark ? 'bg-[#0f111a] text-slate-100' : 'bg-slate-50 text-slate-800'
          }`}>
            
            {/* ANDROID SYSTEM TOP BAR */}
            <div className="h-10 px-6 pt-3 flex items-center justify-between text-[10px] font-bold tracking-wider select-none shrink-0 z-30 opacity-70">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-black">5G</span>
              </div>
            </div>

            {/* DYNAMIC APP VIEWPORT (PREVIEW PORT) */}
            <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col text-left">
              
              {/* RENDERING ENGINE CHIP */}
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black tracking-widest ${
                  projectType === 'compose' ? 'bg-emerald-500/25 text-emerald-400' : 'bg-indigo-500/25 text-indigo-400'
                }`}>
                  {projectType === 'compose' ? 'COMPOSE VIEW' : 'XML LAYOUT'}
                </span>
                
                <span className="text-[9px] text-slate-500 font-mono">Build #{simCounter}</span>
              </div>

              {/* RENDER DYNAMIC COMPONENT TREE */}
              {previewUi ? (
                <div className="flex-1 flex flex-col gap-3">
                  <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 leading-tight">
                    {previewUi.title || 'Mandela vs Matrix Re-Imaginator App'}
                  </h1>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {previewUi.description || 'Welcome back! Dynamic layout compiled successfully.'}
                  </p>

                  {/* FORM RENDER (COMPACT MOCKUP STATES) */}
                  <div className="mt-4 space-y-3">
                    <label className="text-[10px] font-bold text-slate-500">USER PROFILE INTEGRATION</label>
                    <input
                      type="text"
                      placeholder="Username"
                      value={simUsername}
                      onChange={(e) => {
                        setSimUsername(e.target.value);
                        triggerLogcat('UI_EVENT', `Username updated: ${e.target.value}`);
                      }}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={simEmail}
                      onChange={(e) => {
                        setSimEmail(e.target.value);
                        triggerLogcat('UI_EVENT', `Email changed: ${e.target.value}`);
                      }}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* ACTION TRIGGER BUTTONS */}
                  <div className="flex flex-col gap-2 mt-5">
                    {(previewUi.buttons || [{ id: 'btnPrimary', text: 'Simulate Action' }]).map((btn: any) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          triggerLogcat('USER_ACTION', `Button Clicked: ${btn.text}`);
                          onRefresh();
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs hover:from-indigo-600 cursor-pointer shadow-md"
                      >
                        {btn.text}
                      </button>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
                  <Activity className="w-10 h-10 text-rose-500 animate-spin" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-300">Compilation Sync ...</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                      No viewport metrics available yet. Edit your Compose or XML nodes in the editor to sync visual rendering!
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* VIRTUAL HOME BUTTON BAR */}
            <div className="h-14 flex items-center justify-center shrink-0">
              <div className="w-28 h-1 bg-slate-800 rounded-full" />
            </div>

          </div>

        </div>

        {/* QUICK MANUAL COMPILE TRIGGERS */}
        <div className="w-full mt-4 flex gap-2">
          <button
            onClick={onRefresh}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isDark ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
            }`}
          >
            Force Sync UI
          </button>
        </div>

      </div>

    </div>
  );
};


/* ==========================================
   CONSOLE TERMINAL FULL PAGE
   ========================================== */
interface ConsolePageProps {
  isDark: boolean;
  buildLogs: string[];
  logcatLogs: LogItem[];
  isLogcatScrolling: boolean;
  setIsLogcatScrolling: (val: boolean) => void;
  terminalBottomRef: React.RefObject<HTMLDivElement | null>;
  logcatBottomRef: React.RefObject<HTMLDivElement | null>;
  clearLogs: () => void;
  onCopyLogs: () => void;
}

export const ConsolePage: React.FC<ConsolePageProps> = ({
  isDark,
  buildLogs,
  logcatLogs,
  isLogcatScrolling,
  setIsLogcatScrolling,
  terminalBottomRef,
  logcatBottomRef,
  clearLogs,
  onCopyLogs
}) => {
  return (
    <div className={`flex-1 flex flex-col h-full w-full overflow-hidden ${
      isDark ? 'bg-[#07090f]' : 'bg-slate-100'
    }`}>
      
      {/* CONSOLE HEADER BAR */}
      <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
        isDark ? 'bg-[#0d101a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-200">System Trace Console</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCopyLogs}
            className={`p-1.5 rounded-lg border transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Copy Logs"
          >
            <Copy className="w-3.5 h-3.5" /> Copy logs
          </button>

          <button
            onClick={clearLogs}
            className={`p-1.5 rounded-lg border border-red-500/25 text-red-400 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-red-500/10`}
            title="Clear Logs Console"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear logs
          </button>
        </div>
      </div>

      {/* DUAL PANE TERMINAL SYSTEM */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* GRADLE BUILD PROCESS LOGGER */}
        <div className="flex-1 flex flex-col border-r border-slate-800/80">
          <div className="bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-900 flex items-center justify-between">
            <span>Gradle Daemon Process Logs</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-[#05060a] font-mono text-left text-[11px] leading-relaxed text-cyan-300/90 whitespace-pre-wrap select-text">
            {buildLogs.map((log, i) => (
              <div key={i} className="mb-1">
                <span className="text-slate-600 mr-2">[{100 + i}]</span>
                <span>{log}</span>
              </div>
            ))}
            <div ref={terminalBottomRef} />
          </div>
        </div>

        {/* LOGCAT ADB SOCKET STREAMER */}
        <div className="flex-1 flex flex-col">
          <div className="bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-900 flex items-center justify-between">
            <span>ADB Logcat Thread Stream</span>
            <button
              onClick={() => setIsLogcatScrolling(!isLogcatScrolling)}
              className={`text-[9px] px-2 py-0.5 rounded font-extrabold ${
                isLogcatScrolling ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isLogcatScrolling ? 'AUTO SCROLL' : 'FREE PAUSE'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-[#05060a] font-mono text-left text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap select-text">
            {logcatLogs.length === 0 ? (
              <div className="text-slate-500 italic">Listening for ADB system socket broadcasts... Run elements to pipe threads here.</div>
            ) : (
              logcatLogs.map((log, i) => {
                let colorClass = 'text-slate-300';
                if (log.level === 'E') colorClass = 'text-red-400 font-bold';
                else if (log.level === 'W') colorClass = 'text-yellow-400 font-bold';
                else if (log.level === 'I') colorClass = 'text-emerald-400';
                else if (log.level === 'D') colorClass = 'text-blue-400';
                else if (log.level === 'V') colorClass = 'text-slate-500';

                return (
                  <div key={log.id || i} className={`mb-1 ${colorClass}`}>
                    <span className="text-slate-600 mr-2">[{log.time}]</span>
                    <span className="font-extrabold mr-1">{log.level}/{log.tag}:</span>
                    <span>{log.message}</span>
                  </div>
                );
              })
            )}
            <div ref={logcatBottomRef} />
          </div>
        </div>

      </div>

    </div>
  );
};
