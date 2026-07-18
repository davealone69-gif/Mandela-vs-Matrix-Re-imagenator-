const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add states for transcription
if (!code.includes("const [isTranscribing, setIsTranscribing]")) {
  code = code.replace(
    "const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);",
    "const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);\n  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);\n  const mediaRecorderRef = useRef<MediaRecorder | null>(null);\n  const audioChunksRef = useRef<Blob[]>([]);"
  );
}

// Add toggleTranscription method
const transcriptionCode = `
  const toggleTranscription = async () => {
    if (isTranscribing) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsTranscribing(false);
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
         const reader = new FileReader();
         reader.readAsDataURL(audioBlob);
         reader.onloadend = async () => {
             const base64Data = (reader.result as string).split(',')[1];
             try {
                const res = await fetch('/api/copilot/chat', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({
                      messages: [{ role: 'user', content: 'Please transcribe this audio.' }],
                      attachments: [{ mimeType: 'audio/webm', data: base64Data }],
                      model: 'gemini-3.5-flash'
                   })
                });
                const data = await res.json();
                if (data.reply) {
                   setAiInput(prev => prev + (prev ? ' ' : '') + data.reply);
                   triggerToast('Transcription completed.');
                }
             } catch(e) {
                triggerToast('Transcription failed.');
             }
         };
      };
      
      mediaRecorder.start();
      setIsTranscribing(true);
      triggerToast('Recording started. Click again to transcribe.');
    } catch (e) {
      triggerToast('Failed to access microphone.');
    }
  };
`;

if (!code.includes("toggleTranscription")) {
  code = code.replace(
    "const handleSendAiMessage = async () => {",
    transcriptionCode + "\n  const handleSendAiMessage = async () => {"
  );
}

// Add button to UI
code = code.replace(
    `<button\n                  onClick={toggleVoiceRecording}`,
    `<button
                  onClick={toggleTranscription}
                  className={\`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 \${
                    isTranscribing
                      ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }\`}
                  title={isTranscribing ? 'Stop Recording & Transcribe' : 'Record Audio for Transcription'}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={toggleVoiceRecording}`
);

fs.writeFileSync('src/App.tsx', code);
