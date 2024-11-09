import { GoogleGenerativeAI } from '@google/generative-ai'
import websearch from '../websearch/websearch';
import dotenv from 'dotenv'; 

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function sendLLMResponse(req, res) {
    const prompt = req.params.prompt;

    if (!prompt) {
        console.log("Invalid request");
        return res.status(400).send("Invalid request");
    }

    const searchResults = await websearch(prompt);

    const template = `
    You are a search result summarizer, given the QUERY below and the output of a search result, please give the user the information they want in at most three sentences. Your only job is to summarize as if you were reporting the news. Be objective, consistent, and include details.

    QUERY: "${prompt}"
    
    RESULTS: "${searchResults}"
    `;

    const result = await model.generateContent(searchResults);
    
    res.json({
        data: result
    })
}
