import React, { useState } from 'react';
import { X, Play, Activity, CheckCircle2, ShieldCheck, Cpu, Smartphone, AlertTriangle } from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

export default function AutoUITestSystemDialog({ isDark, onClose }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [testSuite, setTestSuite] = useState<'sanity' | 'monkey' | 'regression'>('sanity');
  const [logs, setLogs] = useState<string[]>([
    'System ready. Select a test suite and click "Run UI Tests".'
  ]);
  const [progress, setProgress] = useState(0);

  const runUITests = () => {
    setIsRunning(true);
    setLogs([]);
    setProgress(0);

    const steps = [
      { prg: 10, msg: 'Initializing Espresso testing environment...' },
      { prg: 30, msg: 'Deploying instrumentation APK onto virtual emulator...' },
      { prg: 50, msg: 'Executing UI test cases: MainActivityLayoutTest...' },
      { prg: 75, msg: 'Verifying view interactions and accessibility nodes...' },
      { prg: 100, msg: '✓ All automated UI testing specs passed successfully!' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setProgress(step.prg);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.msg}`]);
        if (idx === steps.length - 1) {
          setIsRunning(false);
        }
      }, (idx + 1) * 800);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-2xl border flex flex-col overflow-hidden shadow-2xl ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800/20 flex justify-between items-center bg-slate-950/20">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-tight">Auto UI Test Suite & Espresso Simulator</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800/10 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {(['sanity', 'monkey', 'regression'] as const).map((type) => (
              <button
                key={type}
                onClick={() => !isRunning && setTestSuite(type)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  testSuite === type
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-slate-800/10 bg-slate-800/5 hover:bg-slate-800/10 text-slate-400'
                }`}
                disabled={isRunning}
              >
                <div className="text-xs font-bold capitalize">{type} Suite</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {type === 'sanity' && 'Basic layout & launch specs'}
                  {type === 'monkey' && 'Fuzz inputs & stress layouts'}
                  {type === 'regression' && 'Deep integrity UI assertions'}
                </div>
              </button>
            ))}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="h-1.5 w-full bg-slate-800/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button
              onClick={runUITests}
              disabled={isRunning}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              {isRunning ? 'Simulating UI Tests...' : 'Run UI Tests'}
            </button>
          </div>

          {/* Console Output */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Test Suite Output</div>
            <div className="bg-slate-950 rounded-xl p-3 h-48 overflow-y-auto font-mono text-[10px] flex flex-col gap-1.5 border border-slate-900">
              {logs.map((log, idx) => (
                <div key={idx} className={log.includes('✓') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
