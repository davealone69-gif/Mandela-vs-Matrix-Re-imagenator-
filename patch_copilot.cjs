const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeader = `            {/* AI COPILOT CHAT AREA - Kept fully available in the bottom of files/general tree sidebar */}
            <div className={\`flex flex-col transition-all duration-300 border-t \${isChatExpanded ? 'flex-1 overflow-hidden' : 'h-auto'} \${
              isDark ? 'bg-slate-950/20 border-slate-800/40' : 'bg-slate-50 border-slate-200'
            }\`}>
              <div 
                className={\`p-3 border-b flex flex-wrap items-center justify-between gap-2 cursor-pointer \${
                  isDark ? 'bg-slate-900/20 hover:bg-slate-800/30 border-slate-800/40' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                }\`}
                onClick={() => setIsChatExpanded(!isChatExpanded)}
              >
                <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                  {isChatExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Copilot
                </span>
                {isChatExpanded && (
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>`;

const newHeader = `            {sidebarTab === 'ai' && (
            <div className={\`flex-1 flex flex-col transition-all duration-300 \${
              isDark ? 'bg-slate-950/20' : 'bg-slate-50'
            }\`}>
              <div 
                className={\`p-3 border-b flex flex-wrap items-center justify-between gap-2 \${
                  isDark ? 'bg-slate-900/20 border-slate-800/40' : 'bg-slate-100 border-slate-200'
                }\`}
              >
                <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" /> Copilot AI
                </span>
                <div className="flex items-center gap-2">`;

code = code.replace(oldHeader, newHeader);

// Now fix the end of it.
// The old code had:
//                 )}
//               </div>
// 
//               {isChatExpanded && (
//                 <>

const oldMid = `                )}
              </div>

              {isChatExpanded && (
                <>`;

const newMid = `              </div>`;

code = code.replace(oldMid, newMid);

// The old code ends with:
//               </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </aside>

const oldEnd = `              </div>
                </>
              )}
            </div>
          </div>
        </aside>`;

const newEnd = `              </div>
            </div>
            )}
          </div>
        </aside>`;

code = code.replace(oldEnd, newEnd);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched AI Copilot tab");
