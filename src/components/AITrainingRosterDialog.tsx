import React, { useState, useEffect } from 'react';
import {
  X, Cpu, Brain, Flame, Sparkles, RefreshCw, Play, Pause, AlertTriangle,
  Award, Shield, Network, Zap, Sliders, ChevronRight, Binary, Server
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

interface AgentModel {
  id: string;
  name: string;
  codeName: string;
  role: string;
  status: 'idle' | 'training' | 'completed' | 'corrupt';
  progress: number;
  accuracy: number;
  loss: number;
  params: string;
  vibe: string;
  color: string;
}

export default function AITrainingRosterDialog({ isDark, onClose }: Props) {
  const [agents, setAgents] = useState<AgentModel[]>([
    {
      id: 'devator-01',
      name: 'Devator Mutation Agent',
      codeName: 'DEVATOR-M1',
      role: 'Code Synthesis & Schema Mutation',
      status: 'training',
      progress: 68,
      accuracy: 94.2,
      loss: 0.084,
      params: '12.4B (QLoRA FT)',
      vibe: 'Hyper-Adaptive Neon',
      color: '#ff0055'
    },
    {
      id: 'matrixcore-02',
      name: 'MatrixCore Consensus',
      codeName: 'MATRIX-C9',
      role: 'Logic Validation & Block Integrity',
      status: 'idle',
      progress: 100,
      accuracy: 99.9,
      loss: 0.001,
      params: '34.8B (DPO)',
      vibe: 'Monochrome Strictness',
      color: '#00ffcc'
    },
    {
      id: 'mandelacore-03',
      name: 'MandelaCore Reality Engine',
      codeName: 'MANDELA-R4',
      role: 'UI Shift & Glitch State Synchronization',
      status: 'training',
      progress: 42,
      accuracy: 88.5,
      loss: 0.142,
      params: '8.2B (RLHF)',
      vibe: 'Dynamic Glitch',
      color: '#ffdd00'
    },
    {
      id: 'auditor-04',
      name: 'Auditor Security Guild',
      codeName: 'AUDIT-S3',
      role: 'Zero-Trust Attack Surface Verification',
      status: 'completed',
      progress: 100,
      accuracy: 99.4,
      loss: 0.005,
      params: '14.5B (Constitutional)',
      vibe: 'Cyber-Fortress',
      color: '#a855f7'
    }
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState<string>('devator-01');
  const [learningRate, setLearningRate] = useState<number>(0.0003);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [epochs, setEpochs] = useState<number>(10);
  const [isSystemActive, setIsSystemActive] = useState<boolean>(true);

  // Training Simulation Tick
  useEffect(() => {
    if (!isSystemActive) return;

    const interval = setInterval(() => {
      setAgents(prev =>
        prev.map(agent => {
          if (agent.status === 'training') {
            const nextProgress = agent.progress + Math.floor(Math.random() * 3) + 1;
            const nextAccuracy = Math.min(99.9, Number((agent.accuracy + (Math.random() * 0.1)).toFixed(2)));
            const nextLoss = Math.max(0.001, Number((agent.loss - (Math.random() * 0.001)).toFixed(4)));

            if (nextProgress >= 100) {
              return {
                ...agent,
                progress: 100,
                status: 'completed',
                accuracy: nextAccuracy,
                loss: nextLoss
              };
            }

            return {
              ...agent,
              progress: nextProgress,
              accuracy: nextAccuracy,
              loss: nextLoss
            };
          }
          return agent;
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isSystemActive]);

  const handleToggleAgentTraining = (id: string) => {
    setAgents(prev =>
      prev.map(agent => {
        if (agent.id === id) {
          if (agent.status === 'training') {
            return { ...agent, status: 'idle' };
          } else if (agent.status === 'idle') {
            return { ...agent, status: 'training', progress: agent.progress === 100 ? 0 : agent.progress };
          } else if (agent.status === 'completed') {
            return { ...agent, status: 'training', progress: 0 };
          }
        }
        return agent;
      })
    );
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`w-full max-w-5xl h-[85vh] flex flex-col border-4 ${isDark ? 'border-[#ffdd00] bg-black text-white' : 'border-black bg-white text-black'} shadow-[8px_8px_0px_#000000] font-mono overflow-hidden`}>
        
        {/* Top Header */}
        <div className={`flex items-center justify-between p-4 border-b-4 ${isDark ? 'border-[#ffdd00] bg-[#ffdd00]/10' : 'border-black bg-black/5'}`}>
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-[#ffdd00] animate-bounce" />
            <span className="text-md md:text-lg font-black tracking-wider uppercase">
              SWARM NEURAL ROSTER & CORE TRAINING
            </span>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 border-2 transition-all ${isDark ? 'border-[#ffdd00] hover:bg-[#ffdd00] hover:text-black' : 'border-black hover:bg-black hover:text-white'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Splitting Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y-4 lg:divide-y-0 lg:divide-x-4 border-b-4 border-zinc-700">
          
          {/* Left Column: Swarm Agents List (Span 7) */}
          <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b-2 border-dashed border-zinc-700 bg-zinc-950/20">
              <span className="text-xs font-black uppercase text-zinc-500">ACTIVE NEURAL CHIPS</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {agents.map(agent => {
                const isSelected = agent.id === selectedAgentId;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`p-4 border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? isDark 
                          ? 'border-[#ffdd00] bg-[#ffdd00]/5 shadow-[4px_4px_0px_#ffdd00]' 
                          : 'border-black bg-zinc-100 shadow-[4px_4px_0px_black]'
                        : isDark
                          ? 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                          : 'border-zinc-200 bg-white hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded bg-zinc-800 text-white font-mono">
                          {agent.codeName}
                        </span>
                        <h4 className="text-sm font-black uppercase">{agent.name}</h4>
                      </div>
                      <span className={`text-xs font-black uppercase ${
                        agent.status === 'training' ? 'text-[#ffdd00] animate-pulse' :
                        agent.status === 'completed' ? 'text-[#00ffcc]' : 'text-zinc-500'
                      }`}>
                        ● {agent.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mb-3 line-clamp-1">{agent.role}</p>

                    {/* Progress indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                        <span>SYNAPSE ALIGNMENT</span>
                        <span>{agent.progress}%</span>
                      </div>
                      <div className="h-3 w-full bg-zinc-800 border border-zinc-700 overflow-hidden relative">
                        <div 
                          className="h-full transition-all duration-500"
                          style={{ 
                            width: `${agent.progress}%`,
                            backgroundColor: agent.color 
                          }}
                        />
                        {agent.status === 'training' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-zinc-400">
                      <span>PARAMS: {agent.params}</span>
                      <div className="flex items-center space-x-3">
                        <span>ACC: {agent.accuracy}%</span>
                        <span>LOSS: {agent.loss}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Training Console & Hyperparameters (Span 5) */}
          <div className="lg:col-span-5 flex flex-col h-full bg-zinc-950/10 overflow-y-auto p-6">
            
            {/* Agent Detail Card */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase text-[#ffdd00] block mb-1">
                  SELECTED NODE ANALYSIS
                </span>
                <h3 className="text-lg font-black uppercase tracking-tight">{selectedAgent.name}</h3>
                <span className="text-xs text-zinc-400">Vibe Signature: <b style={{ color: selectedAgent.color }}>{selectedAgent.vibe}</b></span>
              </div>

              <div className="p-4 border-2 border-dashed border-zinc-700 bg-zinc-900/30 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 block uppercase font-bold text-[10px]">Neural Efficiency</span>
                    <span className="font-mono text-[#00ffcc] font-black">{(selectedAgent.accuracy * 1.01).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase font-bold text-[10px]">Quantum Weight Entropy</span>
                    <span className="font-mono text-[#ff0055] font-black">{(selectedAgent.loss * 0.95).toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase font-bold text-[10px]">Hardware Temp</span>
                    <span className="font-mono text-white font-black">42.4°C</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase font-bold text-[10px]">Synapse Latency</span>
                    <span className="font-mono text-white font-black">12ms</span>
                  </div>
                </div>
              </div>

              {/* Hyperparameter mutation parameters */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#ffdd00]" />
                  <span>HYPERPARAMETER MUTATION</span>
                </h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Learning Rate</span>
                      <span className="font-mono text-[#ffdd00]">{learningRate}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0001"
                      max="0.01"
                      step="0.0001"
                      value={learningRate}
                      onChange={(e) => setLearningRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ffdd00]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Batch Size</span>
                      <span className="font-mono text-[#ffdd00]">{batchSize}</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="128"
                      step="8"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ffdd00]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Epoch Bounds</span>
                      <span className="font-mono text-[#ffdd00]">{epochs}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={epochs}
                      onChange={(e) => setEpochs(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ffdd00]"
                    />
                  </div>
                </div>
              </div>

              {/* Action trigger button */}
              <button
                onClick={() => handleToggleAgentTraining(selectedAgent.id)}
                className={`w-full py-3 flex items-center justify-center space-x-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                  selectedAgent.status === 'training'
                    ? 'bg-[#ff0055] text-white border-white hover:bg-black hover:text-[#ff0055] hover:border-[#ff0055]'
                    : 'bg-black text-white border-[#ffdd00] hover:bg-[#ffdd00] hover:text-black shadow-[4px_4px_0px_#ffdd00]'
                }`}
              >
                {selectedAgent.status === 'training' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>HALT CORE SYNAPSE TRAINING</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 animate-ping" />
                    <span>MUTATE & TRAIN SELECTED NODE</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>

        {/* Global system toggle footer */}
        <div className={`p-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-black'}`}>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Server className="w-4 h-4 text-[#ffdd00]" />
            <span className="uppercase text-zinc-400">Quantum Neural Grid status:</span>
            <span className={isSystemActive ? 'text-[#00ffcc] animate-pulse font-black' : 'text-zinc-500 font-black'}>
              {isSystemActive ? '● STABLE CONSENSUS PIPELINE' : '● IDLE/SLEEPING'}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setIsSystemActive(!isSystemActive)}
              className={`flex-1 sm:flex-none px-4 py-1.5 border-2 text-xs font-bold uppercase transition-all ${
                isSystemActive 
                  ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' 
                  : 'border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-black'
              }`}
            >
              {isSystemActive ? 'Mute Swarm' : 'Wake Swarm'}
            </button>
            <button
              onClick={onClose}
              className={`flex-1 sm:flex-none px-6 py-1.5 border-2 text-xs font-black uppercase tracking-wider ${
                isDark ? 'bg-[#ffdd00] text-black border-white hover:bg-black hover:text-[#ffdd00]' : 'bg-black text-white border-black hover:bg-zinc-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
