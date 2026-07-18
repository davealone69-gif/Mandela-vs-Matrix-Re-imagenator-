import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
async function main() {
  const pager = await ai.models.list();
  for await (const m of pager) { console.log(m.name); }
}
main().catch(console.error);
