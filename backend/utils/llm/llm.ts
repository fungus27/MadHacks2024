import { GoogleGenerativeAI } from '@google/generative-ai'
import websearch from '../websearch/websearch';
import { getTextAudio } from '../tts/tts';
import dotenv from 'dotenv'; 

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = "You are a helpful morning assistant. Given the QUERY and the search engine result RESULTS sent by the user, please give the user the exact information they want in one sentence. Be consistent, objective and concise."

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        candidateCount: 1,
        maxOutputTokens: 180,
        temperature: 0.3,
        top_p: 0.95
    },
    systemInstruction: systemPrompt
});

export default async function sendLLMResponse(req, res) {
    const prompt = req.params.prompt;

    if (!prompt) {
        console.log("Invalid request");
        return res.status(400).send("Invalid request");
    }

    const searchResults = await websearch(prompt);

    const template = `QUERY: "${prompt}"

    RESULTS: "${searchResults}"
    `;

    const result = await model.generateContent(searchResults);

    const audioData = await getTextAudio(result); 
    
    res.json({
        sentence: result['response']['candidates'][0]['content']['parts'][0]['text'],
        audio: audioData
    })
}
