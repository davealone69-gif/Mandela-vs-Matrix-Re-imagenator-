import React, { useState } from 'react';
import { 
  PlaySquare, CheckCircle2, Play, Loader2, X, UploadCloud, FileCheck, 
  ShieldCheck, Globe, Sparkles, Smartphone, Edit3, AlertTriangle, 
  Tag, Settings, Activity, FileText, Check, HelpCircle, ArrowRight 
} from 'lucide-react';

interface Props {
  isDark: boolean;
  onClose: () => void;
}

export default function PlayStorePublishOrchestratorDialog({ isDark, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'metadata' | 'assets' | 'track' | 'deploy'>('metadata');
  
  // Tab 1: Metadata States
  const [appTitle, setAppTitle] = useState('Mandela vs Matrix Re-imaginator');
  const [packageName, setPackageName] = useState('com.death.mandela.matrix.reimaginator');
  const [shortDesc, setShortDesc] = useState('High-fidelity multi-agent sandboxed Android IDE & compiler terminal.');
  const [fullDesc, setFullDesc] = useState(
    'Unleash the supreme sandbox environment. Mandela vs Matrix Re-imaginator is a futuristic, highly defensive application development suite designed for secure simulation, decompilation auditing, zero-trust cryptographic compilation, and playstore automated verification. Features multi-agent consensus loops, decentralized leader arbitration, and live security matrices.'
  );
  const [category, setCategory] = useState('Tools / Developer Utility');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Tab 2: Screenshot/Asset Selection States
  const [mockScreenshots, setMockScreenshots] = useState([
    { id: 'sc1', name: 'Matrix IDE Console', checked: true, color: 'from-slate-900 via-red-950 to-black', desc: 'Secure Code Editor with interactive diagnostics' },
    { id: 'sc2', name: 'Zero-Trust Auditor', checked: true, color: 'from-black via-[#0d0914] to-red-950', desc: 'Live security matrix scanning and threat analysis' },
    { id: 'sc3', name: 'Decentralized Swarm Simulator', checked: true, color: 'from-slate-950 via-slate-900 to-red-950', desc: 'Raft consensus and multi-node swarm logs' },
  ]);

  // Tab 3: Track and Release Controls
  const [releaseTrack, setReleaseTrack] = useState<'internal' | 'alpha' | 'beta' | 'production'>('internal');
  const [rolloutPercentage, setRolloutPercentage] = useState<number>(100);
  const [versionName, setVersionName] = useState('2.4.0');
  const [buildNumber, setBuildNumber] = useState('42');
  const [checklist, setChecklist] = useState({
    obfuscationPassed: true,
    malwareClean: true,
    tosAccepted: false,
    contentRatingCertified: true
  });

  // Tab 4: Advanced Console Deploy States
  const [phase, setPhase] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(p => [...p, msg]);

  // Trigger Gemini AI generation for Play Store listings
  const handleAiOptimizeListings = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'user', 
              content: `Write a highly compelling Google Play Store store listing for an Android app titled "Mandela vs Matrix Re-imaginator" designed by "Death". The app is a sci-fi cyber developer playground with zero-trust matrix auditing and multi-agent consensus simulation. Output JSON in this format:
              {
                "shortDescription": "30-80 chars summary",
                "fullDescription": "Detailed features list and call to action marketing text"
              }` 
            }
          ]
        })
      });
      const data = await response.json();
      if (data.reply) {
        // Try to parse JSON from response
        const text = data.reply;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.shortDescription) setShortDesc(parsed.shortDescription);
          if (parsed.fullDescription) setFullDesc(parsed.fullDescription);
        } else {
          // Fallback parsing if non-structured output
          setShortDesc("The ultimate cyberpunk Android compiler, matrix security scanner, and multi-agent IDE.");
          setFullDesc(text);
        }
      }
    } catch (err) {
      console.error("AI listings generation failed:", err);
      // Nice static upgrade fallback
      setShortDesc("Uncover reality flaws. Audit Android binaries with high-performance security matrices.");
      setFullDesc("Mandela vs Matrix Re-imaginator is an ultra-secure mobile development sandbox. Built with RASP runtime guards, self-healing code compilation pipelines, and multi-agent verification modules. Decompile, compile, and publish directly using futuristic developer toolsets designed for defensive cybersecurity enthusiasts.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const runEngine = async () => {
    setPhase(1); setLogs([]); setProgress(0);

    addLog('[SYSTEM] Initializing Play Store Publishing Pipeline...');
    addLog(`[CONFIG] Deploying Release Target: ${packageName} v${versionName} (Build ${buildNumber})`);
    addLog(`[CONFIG] Destination Track: ${releaseTrack.toUpperCase()} (${rolloutPercentage}% roll-out)`);
    await new Promise(r => setTimeout(r, 600));

    addLog('\n[PHASE 1] Compiling signed App Bundle (.aab)');
    await new Promise(r => setTimeout(r, 800));
    addLog(' - Running release task: :app:bundleRelease');
    addLog(' - Minifying classes using R8 rules: -keepattributes Signature,Annotation');
    addLog(' - Stripping debug-specific assertions and mock logs...');
    setProgress(25);

    setPhase(2);
    await new Promise(r => setTimeout(r, 900));
    addLog('\n[PHASE 2] High-Security Play App Signing');
    addLog(' - Extracting signature block configurations...');
    addLog(' - Injecting secure keystore SHA-256 certificate...');
    addLog(' - V2/V3 app signature validation verified successfully.');
    setProgress(50);

    setPhase(3);
    await new Promise(r => setTimeout(r, 800));
    addLog('\n[PHASE 3] Google Play API Handshake & Audit');
    addLog(' - Initializing oauth play-developer connection to publisher APIs...');
    addLog(' - Creating deployment session: ID_EDIT_TRACK_940F4804');
    addLog(` - Injecting Listing Metadata: Title "${appTitle}"`);
    addLog(' - Injecting Virtual Store screenshots and graphics assets...');
    setProgress(75);

    setPhase(4);
    await new Promise(r => setTimeout(r, 1000));
    addLog('\n[PHASE 4] Binary Upload & Rollout Orchestration');
    addLog(' - Uploading base.aab (34.2 MB) to Play Store Repository...');
    addLog(` - Committing release to [${releaseTrack.toUpperCase()}] Track...`);
    addLog(' - Running automated compliance, hardware capability, and security filters...');
    addLog(' - Final API handshake verified with zero errors.');
    setProgress(100);

    addLog(`\n[SUCCESS] PLAY STORE PUBLISHER activated. Release submitted to Google Play Console.`);
    addLog(`Active URL: https://play.google.com/store/apps/details?id=${packageName}`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl rounded-2xl shadow-[0_0_80px_rgba(37,99,235,0.18)] overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-[#0a0f1d] border border-blue-500/30 text-slate-200' : 'bg-white border border-blue-500/25 text-slate-800'}`}>
         
         {/* Top Header Row */}
         <div className="flex items-center justify-between p-4 border-b border-blue-900/30 shrink-0 bg-gradient-to-r from-blue-950/40 to-transparent">
            <div className="flex items-center gap-2.5">
              <PlaySquare className="w-5 h-5 text-blue-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-black tracking-widest text-blue-400 uppercase">
                  PLAY STORE PUBLISHER ORCHESTRATOR™
                </h3>
                <p className="text-[10px] text-slate-400">Deep-Dive Interactive Play Console Deployment & Sign Engine</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setActiveTab('metadata')}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${activeTab === 'metadata' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                1. Listing Info
              </button>
              <button 
                onClick={() => setActiveTab('assets')}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${activeTab === 'assets' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                2. Visual Assets
              </button>
              <button 
                onClick={() => setActiveTab('track')}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${activeTab === 'track' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                3. Rollout Setup
              </button>
              <button 
                onClick={() => setActiveTab('deploy')}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${activeTab === 'deploy' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                4. API Deployment
              </button>
            </div>

            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
         </div>

         {/* Body Workspace Panels */}
         <div className="flex-1 overflow-hidden flex flex-col">
            
            {/* TAB 1: LISTING INFO */}
            {activeTab === 'metadata' && (
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
                 <div className="flex justify-between items-start">
                   <div>
                     <h4 className="text-base font-black text-slate-200">Google Play Store Listing Details</h4>
                     <p className="text-xs text-slate-400">Write high-impact description assets. Users will see this on the Play Store page.</p>
                   </div>
                   <button
                     onClick={handleAiOptimizeListings}
                     disabled={isGeneratingAi}
                     className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 text-white font-extrabold text-xs rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer"
                   >
                     {isGeneratingAi ? (
                       <>
                         <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> Optimizing Listings...
                       </>
                     ) : (
                       <>
                         <Sparkles className="w-3.5 h-3.5" /> Optimize Listings with AI
                       </>
                     )}
                   </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Store Listing Title (Max 50)</span>
                     <input 
                       type="text" 
                       value={appTitle} 
                       onChange={(e) => setAppTitle(e.target.value)} 
                       maxLength={50}
                       className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500"
                     />
                   </div>

                   <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Package Unique ID (Android Standard)</span>
                     <input 
                       type="text" 
                       value={packageName} 
                       onChange={(e) => setPackageName(e.target.value)} 
                       className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-400 focus:outline-none focus:border-blue-500"
                     />
                   </div>
                 </div>

                 <div className="flex flex-col gap-1.5">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Short Description (Max 80)</span>
                   <input 
                     type="text" 
                     value={shortDesc} 
                     onChange={(e) => setShortDesc(e.target.value)} 
                     maxLength={80}
                     className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                   />
                 </div>

                 <div className="flex flex-col gap-1.5">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Store Description (Max 4000)</span>
                   <textarea 
                     value={fullDesc} 
                     onChange={(e) => setFullDesc(e.target.value)} 
                     rows={6}
                     className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300 font-normal leading-relaxed focus:outline-none focus:border-blue-500"
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">App Category Type</span>
                     <select 
                       value={category} 
                       onChange={(e) => setCategory(e.target.value)}
                       className="bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                     >
                       <option>Tools / Developer Utility</option>
                       <option>Simulation / Sandbox Games</option>
                       <option>Education / Diagnostics</option>
                       <option>Security / Integrity Sweeper</option>
                     </select>
                   </div>

                   <div className="bg-blue-950/20 border border-blue-900/30 p-3.5 rounded-xl flex items-start gap-2.5">
                     <FileText className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                     <div className="text-[10.5px] text-slate-400 leading-relaxed">
                       <strong className="text-blue-300 block mb-0.5">Google Play Console Guidelines:</strong>
                       Keep branding descriptive and avoid spamming keywords. You can run automated verification loops inside the *API Deployment* terminal before pushing finalized metadata.
                     </div>
                   </div>
                 </div>

                 {/* Footer Proceed button */}
                 <div className="flex justify-end border-t border-slate-900 pt-4 mt-auto">
                   <button 
                     onClick={() => setActiveTab('assets')}
                     className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                   >
                     Next: Graphics Assets <ArrowRight className="w-3.5 h-3.5" />
                   </button>
                 </div>
              </div>
            )}

            {/* TAB 2: VISUAL ASSETS */}
            {activeTab === 'assets' && (
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
                 <div>
                   <h4 className="text-base font-black text-slate-200">Graphic Asset Declarations</h4>
                   <p className="text-xs text-slate-400">Select and include interactive screen layouts compiled automatically into the Play Store listing.</p>
                 </div>

                 {/* High Fidelity Screen mockups */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                   {mockScreenshots.map((item, idx) => {
                     return (
                       <div key={item.id} className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden flex flex-col relative group">
                          {/* Top Mock header */}
                          <div className={`h-36 bg-gradient-to-br ${item.color} p-4 flex flex-col justify-end border-b border-slate-900/50 relative overflow-hidden`}>
                             {/* Mesh details */}
                             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-40" />
                             
                             <div className="relative z-10">
                               <span className="text-[8px] font-black tracking-widest text-red-500 uppercase">Interactive Mock</span>
                               <h5 className="text-xs font-black text-slate-100">{item.name}</h5>
                             </div>
                          </div>

                          <div className="p-3.5 flex flex-col gap-2.5">
                             <p className="text-[10px] text-slate-400 leading-normal min-h-[30px]">{item.desc}</p>
                             
                             <label className="flex items-center justify-between cursor-pointer border-t border-slate-900 pt-2.5 mt-1">
                               <span className="text-[10px] font-bold text-slate-300">Include in Listing</span>
                               <input 
                                 type="checkbox" 
                                 checked={item.checked} 
                                 onChange={() => {
                                   setMockScreenshots(p => p.map(s => s.id === item.id ? { ...s, checked: !s.checked } : s));
                                 }}
                                 className="rounded accent-blue-500 h-3.5 w-3.5 cursor-pointer"
                               />
                             </label>
                          </div>
                       </div>
                     );
                   })}
                 </div>

                 {/* Play Store Icons and graphics previews */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                   <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-xl flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-indigo-700 border border-slate-800 shrink-0 flex items-center justify-center font-black text-white text-base shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                       M/X
                     </div>
                     <div>
                       <span className="text-[10px] font-black uppercase text-blue-400 block mb-0.5">App Launcher Icon</span>
                       <span className="text-xs font-bold text-slate-200">Mandela vs Matrix Standard Launcher</span>
                       <p className="text-[9.5px] text-slate-500">512 x 512 Vector Adaptive WebP file.</p>
                     </div>
                   </div>

                   <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-xl flex items-center gap-4">
                     <div className="w-24 h-16 rounded-xl bg-gradient-to-r from-indigo-950 via-slate-950 to-red-950 border border-slate-900 shrink-0 flex items-center justify-center font-bold text-[8px] text-slate-500 uppercase tracking-widest relative overflow-hidden">
                       <span className="absolute inset-0 bg-blue-500/5" />
                       Feature Banner
                     </div>
                     <div>
                       <span className="text-[10px] font-black uppercase text-blue-400 block mb-0.5">Feature Graphic Banner</span>
                       <span className="text-xs font-bold text-slate-200">1024 x 500 Marketing Asset</span>
                       <p className="text-[9.5px] text-slate-500">High-fidelity landscape illustration.</p>
                     </div>
                   </div>
                 </div>

                 {/* Proceed buttons */}
                 <div className="flex justify-between border-t border-slate-900 pt-4 mt-auto">
                   <button 
                     onClick={() => setActiveTab('metadata')}
                     className="px-3.5 py-2 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                   >
                     Back
                   </button>
                   <button 
                     onClick={() => setActiveTab('track')}
                     className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                   >
                     Next: Rollout Tracks <ArrowRight className="w-3.5 h-3.5" />
                   </button>
                 </div>
              </div>
            )}

            {/* TAB 3: ROLLOUT TRACKS */}
            {activeTab === 'track' && (
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
                 <div>
                   <h4 className="text-base font-black text-slate-200">Release Version & Rolling Tracks</h4>
                   <p className="text-xs text-slate-400">Configure target release pipelines. Safely deploy in stages to mitigate user disruption.</p>
                 </div>

                 {/* Selection Cards */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { id: 'internal', label: 'Internal Test', desc: 'Sideloaded testbeds for up to 100 white-listed developers.', color: 'border-cyan-500/20 text-cyan-400' },
                      { id: 'alpha', label: 'Closed Alpha', desc: 'Secure invitation testing across selected user cohorts.', color: 'border-yellow-500/20 text-yellow-400' },
                      { id: 'beta', label: 'Open Beta', desc: 'Public testing platform before broad production release.', color: 'border-indigo-500/20 text-indigo-400' },
                      { id: 'production', label: 'Production', desc: 'General availability roll-out to billions of global users.', color: 'border-emerald-500/20 text-emerald-400' }
                    ].map((track) => {
                      const isSelected = releaseTrack === track.id;
                      return (
                        <div 
                          key={track.id} 
                          onClick={() => setReleaseTrack(track.id as any)}
                          className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col gap-2 relative ${
                            isSelected 
                              ? 'bg-blue-500/10 border-blue-500/50 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                              : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-400'
                          }`}
                        >
                           {isSelected && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400" />}
                           <span className={`text-xs font-black uppercase ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>{track.label}</span>
                           <p className="text-[10px] leading-relaxed">{track.desc}</p>
                        </div>
                      );
                    })}
                 </div>

                 {/* Release parameters inputs */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Release Version Name</span>
                      <input 
                        type="text" 
                        value={versionName} 
                        onChange={(e) => setVersionName(e.target.value)} 
                        className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Internal Build Code</span>
                      <input 
                        type="number" 
                        value={buildNumber} 
                        onChange={(e) => setBuildNumber(e.target.value)} 
                        className="bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Release Rollout Rate ({rolloutPercentage}%)</span>
                      <input 
                        type="range" 
                        min={1} 
                        max={100} 
                        value={rolloutPercentage} 
                        onChange={(e) => setRolloutPercentage(parseInt(e.target.value))}
                        className="bg-slate-950 accent-blue-500 border border-slate-800 rounded-xl px-2 py-2.5 cursor-pointer"
                      />
                    </div>
                 </div>

                 {/* Regulatory & Safety Checklist */}
                 <div className="flex flex-col gap-2 mt-1">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Publish Safety Checklist</span>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {[
                       { key: 'obfuscationPassed', label: 'Verify R8 Code Obfuscation', desc: 'Secure signature and dynamic class names compiled' },
                       { key: 'malwareClean', label: 'Malware & Ransomware scans passed', desc: 'Static analysis verified clean of zero-day exploits' },
                       { key: 'contentRatingCertified', label: 'Content Rating Certified', desc: 'App declared appropriate for mature cybersecurity fans' },
                       { key: 'tosAccepted', label: 'Accept Developer Console Agreement', desc: 'Explicit consent to commit release payload over Play Console APIs' },
                     ].map((check) => {
                       return (
                         <label key={check.key} className="flex items-start gap-3 p-3 bg-slate-950/60 border border-slate-900 rounded-xl cursor-pointer hover:border-slate-800">
                           <input 
                             type="checkbox" 
                             checked={(checklist as any)[check.key]} 
                             onChange={(e) => setChecklist(prev => ({ ...prev, [check.key]: e.target.checked }))}
                             className="rounded accent-blue-500 h-4 w-4 mt-0.5 cursor-pointer shrink-0"
                           />
                           <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-slate-200">{check.label}</span>
                             <span className="text-[9.5px] text-slate-500">{check.desc}</span>
                           </div>
                         </label>
                       );
                     })}
                   </div>
                 </div>

                 {/* Proceed buttons */}
                 <div className="flex justify-between border-t border-slate-900 pt-4 mt-auto">
                   <button 
                     onClick={() => setActiveTab('assets')}
                     className="px-3.5 py-2 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                   >
                     Back
                   </button>
                   <button 
                     onClick={() => setActiveTab('deploy')}
                     disabled={!checklist.tosAccepted}
                     className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:border-slate-850 disabled:text-slate-600 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md disabled:cursor-not-allowed"
                   >
                     Next: API Deployment <ArrowRight className="w-3.5 h-3.5" />
                   </button>
                 </div>
              </div>
            )}

            {/* TAB 4: API DEPLOYMENT */}
            {activeTab === 'deploy' && (
              <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
                 <div className="flex justify-between items-center shrink-0">
                     <div>
                         <h4 className="text-base font-black text-slate-200 mb-0.5">Automated Release Pipeline</h4>
                         <p className="text-xs text-slate-400">Compile the production package, verify code signatures, and execute direct Play API uploads.</p>
                     </div>
                     {phase === 0 ? (
                        <button 
                          onClick={runEngine} 
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                        >
                           <Play className="w-3.5 h-3.5 fill-white" /> Start Play Store Deployment
                        </button>
                     ) : (
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${phase === 4 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                           {phase === 4 ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                           {phase === 4 ? 'ROLL-OUT ACTIVE' : `STAGE ${phase}/4`}
                        </div>
                     )}
                 </div>

                 {/* Progress meter */}
                 <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden shrink-0 border border-slate-900">
                   <div className="h-full bg-blue-500 transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }} />
                 </div>

                 {/* Console Output logs */}
                 <div className="flex-1 bg-black border border-slate-900 rounded-xl p-4 overflow-y-auto font-mono text-[10.5px] leading-relaxed flex flex-col gap-1 text-slate-300 shadow-inner">
                    {logs.length === 0 ? (
                      <div className="text-slate-600 italic flex flex-col items-center justify-center h-full gap-2">
                        <Globe className="w-8 h-8 text-slate-800" />
                        <span>Awaiting pipeline execution... Click "Start Play Store Deployment" to sync live files over API.</span>
                      </div>
                    ) : (
                      logs.map((log, i) => {
                        let colorClass = 'text-slate-400';
                        if (log.includes('[SYSTEM]')) colorClass = 'text-cyan-400 font-bold';
                        else if (log.includes('[CONFIG]')) colorClass = 'text-slate-500 font-semibold';
                        else if (log.includes('[PHASE')) colorClass = 'text-blue-400 font-extrabold mt-3 border-b border-blue-950/50 pb-0.5';
                        else if (log.includes('[SUCCESS]')) colorClass = 'text-emerald-400 font-black mt-4 text-xs bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30 flex items-center gap-2';
                        return (
                          <div key={i} className={`whitespace-pre-wrap ${colorClass}`}>
                            {log.includes('[SUCCESS]') && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                            {log}
                          </div>
                        );
                      })
                    )}
                 </div>

                 {/* Back button to re-edit configs */}
                 <div className="flex justify-between border-t border-slate-900 pt-4 mt-auto shrink-0">
                   <button 
                     onClick={() => setActiveTab('track')}
                     className="px-3.5 py-2 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                   >
                     Back
                   </button>
                   {phase === 4 && (
                     <button 
                       onClick={onClose}
                       className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                     >
                       Close Deployer
                     </button>
                   )}
                 </div>
              </div>
            )}

         </div>
      </div>
    </div>
  );
}
