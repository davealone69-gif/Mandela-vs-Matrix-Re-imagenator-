const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `{/* Main Action - Always visible */}`,
  `{user ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg mr-2">
              <span className="text-[10px] text-slate-300 font-bold hidden xl:block">{user.displayName}</span>
              <button onClick={handleLogout} className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase transition-colors">Out</button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-[10px] font-bold text-white uppercase transition-colors mr-2">
              Login
            </button>
          )}
          <button 
            onClick={() => setActiveDialog('imageGen')}
            className="px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl text-xs font-black text-white uppercase transition-colors flex items-center gap-1 mr-2"
          >
            <Sparkles className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Image Gen</span>
          </button>
          {/* Main Action - Always visible */}`
);

fs.writeFileSync('src/App.tsx', code);
