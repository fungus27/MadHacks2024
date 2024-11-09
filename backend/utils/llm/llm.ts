import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function sendLLMResponse(req : Request, res : Response) {
    if (!req.body.hasOwnProperty('prompt'))
        throw new Error("Invalid request");

    const result = await model.generateContent(req.body['prompt']);
    
    res.json({
        data: result
    })
}
