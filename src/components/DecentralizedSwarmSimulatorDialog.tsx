import React, { useState, useEffect, useRef } from 'react';
import {
  X, Cpu, Network, Zap, Play, Pause, RefreshCw, Send, ShieldCheck,
  AlertTriangle, Check, Layers, Database, Compass, Radio, Users
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

interface PeerNode {
  id: string;
  ip: string;
  status: 'active' | 'syncing' | 'offline';
  role: 'Leader' | 'Validator' | 'Sentry';
  energy: number;
  packetsSent: number;
  lastPing: string;
  coords: { x: number; y: number };
}

export default function DecentralizedSwarmSimulatorDialog({ isDark, onClose }: Props) {
  const [peers, setPeers] = useState<PeerNode[]>([
    { id: 'Node-Omega', ip: '192.168.42.10', status: 'active', role: 'Leader', energy: 98, packetsSent: 2042, lastPing: '2ms', coords: { x: 150, y: 100 } },
    { id: 'Node-Zion', ip: '192.168.42.22', status: 'active', role: 'Validator', energy: 84, packetsSent: 1590, lastPing: '8ms', coords: { x: 300, y: 160 } },
    { id: 'Node-Mandela', ip: '192.168.42.33', status: 'syncing', role: 'Validator', energy: 76, packetsSent: 820, lastPing: '15ms', coords: { x: 100, y: 220 } },
    { id: 'Node-Matrix', ip: '192.168.42.44', status: 'active', role: 'Validator', energy: 91, packetsSent: 1234, lastPing: '4ms', coords: { x: 240, y: 240 } },
    { id: 'Node-Nebula', ip: '192.168.42.55', status: 'active', role: 'Sentry', energy: 62, packetsSent: 432, lastPing: '11ms', coords: { x: 80, y: 80 } },
    { id: 'Node-Nebuchad', ip: '192.168.42.77', status: 'offline', role: 'Sentry', energy: 0, packetsSent: 29, lastPing: 'N/A', coords: { x: 340, y: 60 } }
  ]);

  const [activeTab, setActiveTab] = useState<'map' | 'peers' | 'consensus' | 'terminal'>('map');
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYSTEM] Swarm Node Protocol initialized on network interface sw0...',
    '[MATRIX] Sub-Quantum handshake accomplished. 5 peer nodes verified.',
    '[MANDELA] Reality state distortion registered at -0.042Hz.'
  ]);
  const [inputCommand, setInputCommand] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation loop
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // Update peers data randomly
      setPeers(prev =>
        prev.map(p => {
          if (p.status === 'offline') return p;
          
          const energyDrift = Math.floor(Math.random() * 3) - 1; // drift energy
          const newEnergy = Math.max(10, Math.min(100, p.energy + (Math.random() > 0.7 ? energyDrift : 0)));
          const extraPackets = Math.floor(Math.random() * 5);
          
          return {
            ...p,
            energy: newEnergy,
            packetsSent: p.packetsSent + extraPackets,
            lastPing: `${Math.floor(Math.random() * 12) + 2}ms`
          };
        })
      );

      // Random logs
      if (Math.random() > 0.6) {
        const triggers = [
          '[CONSENSUS] Validator Zion has approved Devator code mutation block #88432.',
          '[SYNC] Sentry Nebula resolved memory gap validation checks.',
          '[NET] Propagating State-Flow updates to 192.168.42.33...',
          '[MATRIXCORE] Integrity sweeps show 100% logic alignment.',
          '[MANDELACORE] UI Reality glitch offset calibrated successfully.'
        ];
        const log = triggers[Math.floor(Math.random() * triggers.length)];
        setTerminalLogs(prev => [...prev.slice(-30), log]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [simulationActive]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mesh background lines
    ctx.strokeStyle = isDark ? '#1e1e24' : '#f4f4f5';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Connect nodes with lines (Active nodes only)
    ctx.lineWidth = 2;
    peers.forEach((peer, i) => {
      if (peer.status === 'offline') return;
      peers.forEach((otherPeer, j) => {
        if (i >= j || otherPeer.status === 'offline') return;
        
        // Compute distance
        const dx = peer.coords.x - otherPeer.coords.x;
        const dy = peer.coords.y - otherPeer.coords.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          ctx.beginPath();
          ctx.strokeStyle = peer.status === 'syncing' || otherPeer.status === 'syncing'
            ? '#ffdd0022'
            : isDark ? '#00ffcc22' : '#00000022';
          ctx.moveTo(peer.coords.x, peer.coords.y);
          ctx.lineTo(otherPeer.coords.x, otherPeer.coords.y);
          ctx.stroke();
        }
      });
    });

    // Draw peer circles
    peers.forEach(peer => {
      ctx.beginPath();
      ctx.arc(peer.coords.x, peer.coords.y, 8, 0, Math.PI * 2);
      
      let nodeColor = '#00ffcc'; // active
      if (peer.status === 'offline') nodeColor = '#71717a';
      else if (peer.status === 'syncing') nodeColor = '#ffdd00';

      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Draw active pulsing aura
      if (peer.status === 'active' && simulationActive) {
        ctx.beginPath();
        ctx.arc(peer.coords.x, peer.coords.y, 14 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `${nodeColor}44`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Node label
      ctx.font = '9px monospace';
      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(peer.id, peer.coords.x, peer.coords.y - 14);
    });

  }, [peers, isDark, simulationActive]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;

    const cmd = inputCommand.trim().toLowerCase();
    let reply = `[SYSTEM] Command unknown: "${cmd}". Type "help" for protocols.`;

    if (cmd === 'help') {
      reply = '[SYSTEM] Protocols: help | ping | sync-swarm | reset-energy | mutate';
    } else if (cmd === 'ping') {
      reply = `[SYSTEM] Swarm network latency check: Average response time: 6.4ms across ${peers.filter(p => p.status !== 'offline').length} active peers.`;
    } else if (cmd === 'sync-swarm') {
      reply = '[SYSTEM] Re-establishing strict MatrixCore state synchronization... Sync locks set.';
      setPeers(prev => prev.map(p => p.status === 'syncing' ? { ...p, status: 'active' } : p));
    } else if (cmd === 'reset-energy') {
      reply = '[SYSTEM] Transmitting power packets to all sentries. Backup battery banks full.';
      setPeers(prev => prev.map(p => p.status !== 'offline' ? { ...p, energy: 100 } : p));
    } else if (cmd === 'mutate') {
      reply = '[DEVATOR] Forcing global reality shift across MandelaCore pipelines. Warning: UI distortion expected!';
    }

    setTerminalLogs(prev => [...prev, `> ${inputCommand}`, reply]);
    setInputCommand('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`w-full max-w-5xl h-[85vh] flex flex-col border-4 ${isDark ? 'border-[#00ffcc] bg-black text-white' : 'border-black bg-white text-black'} shadow-[8px_8px_0px_#000000] font-mono overflow-hidden`}>
        
        {/* Header bar */}
        <div className={`flex items-center justify-between p-4 border-b-4 ${isDark ? 'border-[#00ffcc] bg-[#00ffcc]/10' : 'border-black bg-black/5'}`}>
          <div className="flex items-center space-x-3">
            <Network className="w-6 h-6 text-[#00ffcc] animate-pulse" />
            <span className="text-md md:text-lg font-black tracking-widest uppercase">
              DECENTRALIZED SWARM SIMULATOR & P2P CONCORD
            </span>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 border-2 transition-all ${isDark ? 'border-[#00ffcc] hover:bg-[#00ffcc] hover:text-black' : 'border-black hover:bg-black hover:text-white'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b-2 border-dashed border-zinc-700 p-2 overflow-x-auto gap-2 bg-zinc-900/10">
          {[
            { id: 'map', label: 'Quantum Node Mesh Map', icon: Compass },
            { id: 'peers', label: 'Peer Directory', icon: Users },
            { id: 'consensus', label: 'Matrix consensus state', icon: ShieldCheck },
            { id: 'terminal', label: 'Swarm Console Terminal', icon: Radio }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-1.5 border-2 text-xs font-bold transition-all ${
                  active
                    ? isDark 
                      ? 'bg-[#00ffcc] text-black border-white shadow-[2px_2px_0px_white]' 
                      : 'bg-black text-white border-black shadow-[2px_2px_0px_#00ffcc]'
                    : isDark
                      ? 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Core panel area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'map' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y-2 md:divide-y-0 md:divide-x-2 divide-dashed divide-zinc-700">
              
              {/* Canvas visualizer */}
              <div className="flex-1 relative flex items-center justify-center p-4 bg-zinc-950/20">
                <canvas 
                  ref={canvasRef} 
                  width={420} 
                  height={320} 
                  className="border-2 border-dashed border-zinc-800 max-w-full bg-black/30"
                />
                <div className="absolute top-4 left-4 p-2 bg-black/60 border border-zinc-700 text-[10px] space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00ffcc]" />
                    <span>ACTIVE VALIDATOR</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffdd00]" />
                    <span>SYNCING NODE</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#71717a]" />
                    <span>OFFLINE CELL</span>
                  </div>
                </div>
              </div>

              {/* Node statistics sidepanel */}
              <div className="w-full md:w-80 p-4 overflow-y-auto space-y-4">
                <span className="text-xs font-black uppercase text-zinc-500">Node telemetry feed</span>
                
                <div className="space-y-3">
                  {peers.map(peer => (
                    <div key={peer.id} className="p-2 border border-zinc-800 bg-zinc-950/30 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{peer.id}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          peer.status === 'active' ? 'bg-[#00ffcc]/10 text-[#00ffcc]' :
                          peer.status === 'syncing' ? 'bg-[#ffdd00]/10 text-[#ffdd00]' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {peer.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>IP: {peer.ip}</span>
                        <span>BATTERY: {peer.energy}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'peers' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="overflow-x-auto">
                <table className={`w-full text-left border-collapse text-xs`}>
                  <thead>
                    <tr className={`border-b-2 ${isDark ? 'border-zinc-700 text-zinc-400' : 'border-zinc-300 text-zinc-600'}`}>
                      <th className="p-3 font-black uppercase">NODE IDENTIFICATION</th>
                      <th className="p-3 font-black uppercase">SUBNET ADDR</th>
                      <th className="p-3 font-black uppercase">SYSTEM ROLE</th>
                      <th className="p-3 font-black uppercase">ENERGY DENSITY</th>
                      <th className="p-3 font-black uppercase">PACKET CODES</th>
                      <th className="p-3 font-black uppercase">HANDSHAKE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {peers.map(peer => (
                      <tr key={peer.id} className={peer.status === 'offline' ? 'opacity-40' : ''}>
                        <td className="p-3 font-bold">{peer.id}</td>
                        <td className="p-3 font-mono">{peer.ip}</td>
                        <td className="p-3 font-bold text-[#00ffcc]">{peer.role}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{peer.energy}%</span>
                            <div className="w-16 h-2 bg-zinc-800 border border-zinc-700 rounded overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-red-500 to-green-500" style={{ width: `${peer.energy}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono">{peer.packetsSent}</td>
                        <td className="p-3 font-mono text-zinc-400">{peer.lastPing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'consensus' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="p-4 border-2 border-dashed border-zinc-700 bg-zinc-900/30">
                <h4 className="text-sm font-black text-[#00ffcc] uppercase mb-2">MATRIX-SWARM VOTING INTEGRITY</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Decentralized Devator mutations are validated by peer validators before being applied to the MandelaCore UI state flow. This keeps the mobile workspace stable, secure, and impervious to external matrix distortions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border-2 border-zinc-800 bg-zinc-950/20 text-center">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Voter Quorum</span>
                  <span className="text-xl font-black font-mono text-[#00ffcc]">83.3%</span>
                  <span className="text-[9px] text-zinc-400 block mt-1">5 of 6 validated consensus</span>
                </div>
                <div className="p-4 border-2 border-zinc-800 bg-zinc-950/20 text-center">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Block Validation</span>
                  <span className="text-xl font-black font-mono text-white">#9402</span>
                  <span className="text-[9px] text-zinc-400 block mt-1">Difficulty standard: Q-90</span>
                </div>
                <div className="p-4 border-2 border-zinc-800 bg-zinc-950/20 text-center">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Reality Shift Offset</span>
                  <span className="text-xl font-black font-mono text-[#ff0055]">-0.042Hz</span>
                  <span className="text-[9px] text-zinc-400 block mt-1">Mandela distortion threshold</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-black text-[#00ffcc] p-4 font-mono text-xs">
              <div className="flex-1 overflow-y-auto space-y-1 mb-3 bg-zinc-950 p-3 rounded border border-zinc-800 select-all">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed break-all">
                    {log}
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendCommand} className="flex items-center space-x-2">
                <span>&gt;</span>
                <input
                  type="text"
                  value={inputCommand}
                  onChange={(e) => setInputCommand(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none font-mono text-[#00ffcc]"
                  placeholder="Enter protocol action (help, ping, sync-swarm, reset-energy, mutate)..."
                />
                <button 
                  type="submit"
                  className="px-3 py-1 bg-[#00ffcc] text-black font-black hover:bg-white transition-all text-[10px] uppercase"
                >
                  RUN
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer buttons bar */}
        <div className={`p-4 border-t-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-black'}`}>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Radio className="w-4 h-4 text-[#00ffcc] animate-pulse" />
            <span className="uppercase text-zinc-400">Consensus Engine:</span>
            <span className={simulationActive ? 'text-[#00ffcc] animate-pulse font-black' : 'text-zinc-500 font-black'}>
              {simulationActive ? '● SWARM HEARTBEAT PULSING' : '● SIMULATOR PAUSED'}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setSimulationActive(!simulationActive)}
              className={`flex-1 sm:flex-none px-4 py-1.5 border-2 text-xs font-bold uppercase transition-all ${
                simulationActive 
                  ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' 
                  : 'border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-black shadow-[2px_2px_0px_#00ffcc]'
              }`}
            >
              {simulationActive ? 'Pause Sim' : 'Resume Sim'}
            </button>
            <button
              onClick={onClose}
              className={`flex-1 sm:flex-none px-6 py-1.5 border-2 text-xs font-black uppercase tracking-wider ${
                isDark ? 'bg-[#00ffcc] text-black border-white hover:bg-black hover:text-[#00ffcc]' : 'bg-black text-white border-black hover:bg-zinc-800'
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
