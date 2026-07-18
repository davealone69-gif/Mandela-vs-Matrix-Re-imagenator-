const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Adding attachment icon and thinking / grounding checkboxes to the chat input area
code = code.replace(
    /<input\s+type="text"\s+placeholder="Ask DroidCraft AI\.\.\."/,
    `{aiAttachments.length > 0 && (
      <div className="absolute bottom-full left-0 mb-2 p-2 bg-slate-800 rounded-lg text-xs text-emerald-400">
         {aiAttachments.length} file(s) attached
      </div>
    )}
    <button 
      onClick={() => fileInputRef.current?.click()}
      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer shrink-0"
      title="Attach Image or Audio"
    >
       <Plus className="w-3.5 h-3.5" />
    </button>
    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,audio/*" onChange={handleFileUpload} />
    <input
      type="text"
      placeholder="Ask DroidCraft AI..."`
);

code = code.replace(
    `<option value="gemini-3.1-flash-lite">Gemini 2.5 Pro</option>`,
    `<option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Thinking)</option>\n<option value="gemini-3.5-flash">Gemini 3.5 Flash</option>\n<option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>`
);

code = code.replace(
    /<option value="gemini-3\.1-flash-lite">Gemini 2\.5 Flash<\/option>\n\s*<option value="gemini-3\.1-flash-lite">Gemini 2\.0 Flash<\/option>/,
    ""
);

if (!code.includes("useGrounding")) {
    console.log("Grounding state was not found. Let's fix it.");
} else {
    // Add checkboxes near model select
    code = code.replace(
        `</select>\n                  <button\n                    onClick={() => setShowKeySettings(!showKeySettings)}`,
        `</select>
         <label className="text-[9px] flex items-center gap-1 cursor-pointer text-slate-400">
            <input type="checkbox" checked={useGrounding} onChange={e => setUseGrounding(e.target.checked)} />
            Grounding
         </label>
         <label className="text-[9px] flex items-center gap-1 cursor-pointer text-slate-400">
            <input type="checkbox" checked={thinkingMode} onChange={e => setThinkingMode(e.target.checked)} />
            Thinking
         </label>
         <button
           onClick={() => setShowKeySettings(!showKeySettings)}`
    );
}

fs.writeFileSync('src/App.tsx', code);
