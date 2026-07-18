const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add a function to sync chat to firestore
if (!code.includes('loadChatHistory')) {
  code = code.replace(
    'const handleGoogleLogin = async () => {',
    `const loadChatHistory = async (userId: string) => {
    try {
      const q = collection(db, \`users/\${userId}/chatHistory\`);
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        // Just load the first document for simplicity
        const data = snapshot.docs[0].data();
        if (data.messages && data.messages.length > 0) {
          setAiMessages(data.messages);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  };

  const saveChatHistory = async (userId: string, msgs: any[]) => {
    try {
      // For simplicity, always write to the same doc "default"
      const docRef = collection(db, \`users/\${userId}/chatHistory\`);
      const snapshot = await getDocs(docRef);
      if (snapshot.empty) {
         await addDoc(docRef, { messages: msgs, updatedAt: new Date().toISOString() });
      } else {
         const firstDoc = snapshot.docs[0];
         // updateDoc could be used, but since we didn't import updateDoc, we can just add a new one and the loader will pick the first. Actually better to just use setDoc.
         // Let's just do addDoc for each message if we want, or import doc, setDoc.
      }
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  };

  const handleGoogleLogin = async () => {`
  );
}

// We need to import doc and setDoc
if (!code.includes('setDoc')) {
   code = code.replace(
      'import { collection, addDoc, getDocs } from \'firebase/firestore\';',
      'import { collection, addDoc, getDocs, doc, setDoc } from \'firebase/firestore\';'
   );
   code = code.replace(
     `const saveChatHistory = async (userId: string, msgs: any[]) => {
    try {
      // For simplicity, always write to the same doc "default"
      const docRef = collection(db, \`users/\${userId}/chatHistory\`);
      const snapshot = await getDocs(docRef);
      if (snapshot.empty) {
         await addDoc(docRef, { messages: msgs, updatedAt: new Date().toISOString() });
      } else {
         const firstDoc = snapshot.docs[0];
         // updateDoc could be used, but since we didn't import updateDoc, we can just add a new one and the loader will pick the first. Actually better to just use setDoc.
         // Let's just do addDoc for each message if we want, or import doc, setDoc.
      }
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  };`,
     `const saveChatHistory = async (userId: string, msgs: any[]) => {
    try {
      const docRef = doc(db, 'users', userId, 'chat', 'history');
      await setDoc(docRef, { messages: msgs, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  };`
   );
   
   code = code.replace(
     `const loadChatHistory = async (userId: string) => {
    try {
      const q = collection(db, \\\`users/\\\${userId}/chatHistory\\\`);
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        // Just load the first document for simplicity
        const data = snapshot.docs[0].data();
        if (data.messages && data.messages.length > 0) {
          setAiMessages(data.messages);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  };`,
    `const loadChatHistory = async (userId: string) => {
    try {
      const q = collection(db, 'users', userId, 'chat');
      const snapshot = await getDocs(q);
      snapshot.forEach(d => {
        if (d.id === 'history') {
           const data = d.data();
           if (data.messages && data.messages.length > 0) {
              setAiMessages(data.messages);
           }
        }
      });
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  };`
   );
}

fs.writeFileSync('src/App.tsx', code);
