const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dialogCode = `
      {/* IMAGE GENERATOR DIALOG */}
      {activeDialog === 'imageGen' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className={\`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden \${isDark ? 'bg-[#0f1423] border border-slate-700/50 text-slate-300' : 'bg-white text-slate-800'}\`}>
             <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 className="text-sm font-bold flex items-center gap-2 text-fuchsia-400">
                  <Sparkles className="w-4 h-4" /> AI Image Generator
                </h3>
                <button onClick={() => setActiveDialog(null)} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
                  <X className="w-4 h-4" />
                </button>
             </div>
             <div className="p-4 flex flex-col gap-3">
               <textarea
                 placeholder="Describe the image you want to generate..."
                 value={imagePrompt}
                 onChange={e => setImagePrompt(e.target.value)}
                 className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-fuchsia-500 resize-none text-slate-200"
               />
               <div className="flex flex-wrap gap-2">
                 <select value={imageGenModel} onChange={e => setImageGenModel(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-300">
                   <option value="gemini-3.1-flash-image-preview">Flash Image (Fast)</option>
                   <option value="gemini-3-pro-image-preview">Pro Image (High Quality)</option>
                 </select>
                 <select value={imageAspectRatio} onChange={e => setImageAspectRatio(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-300">
                   <option value="1:1">1:1 Square</option>
                   <option value="4:3">4:3 Landscape</option>
                   <option value="3:4">3:4 Portrait</option>
                   <option value="16:9">16:9 Widescreen</option>
                   <option value="9:16">9:16 Vertical</option>
                   <option value="2:3">2:3</option>
                   <option value="3:2">3:2</option>
                   <option value="21:9">21:9</option>
                 </select>
                 {imageGenModel.includes('pro') && (
                   <select value={imageSize} onChange={e => setImageSize(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-300">
                     <option value="1K">1K</option>
                     <option value="2K">2K</option>
                     <option value="4K">4K</option>
                   </select>
                 )}
               </div>
               
               <button 
                 onClick={async () => {
                   if(!imagePrompt) return;
                   setIsGeneratingImage(true);
                   try {
                     const res = await fetch('/api/generate-image', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({ prompt: imagePrompt, model: imageGenModel, aspectRatio: imageAspectRatio, imageSize: imageGenModel.includes('pro') ? imageSize : undefined })
                     });
                     const data = await res.json();
                     if(data.success) {
                       setImageGenResult(data.imageUrl);
                     } else {
                       triggerToast('Generation failed: ' + data.error);
                     }
                   } catch(e) { triggerToast('Network error'); }
                   setIsGeneratingImage(false);
                 }}
                 disabled={isGeneratingImage || !imagePrompt}
                 className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-slate-800 text-white font-bold py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2"
               >
                 {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                 {isGeneratingImage ? 'Generating...' : 'Generate Image'}
               </button>
               
               {imageGenResult && (
                 <div className="mt-4 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900 flex flex-col items-center p-2">
                    <img src={imageGenResult} alt="Generated" className="max-w-full max-h-64 object-contain" />
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  `{/* MAIN CONTAINER */}`,
  `{/* MAIN CONTAINER */}\n` + dialogCode
);

fs.writeFileSync('src/App.tsx', code);
