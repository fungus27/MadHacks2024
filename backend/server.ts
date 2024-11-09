import express from 'express';
import dotenv from 'dotenv'; 

dotenv.config()

import sendTTSResponse from './utils/tts/tts';
import sendLLMResponse from './utils/llm/llm';

const app = express()
const PORT = 8888;

app.use(express.json())

app.post('/tts', sendTTSResponse);
app.get('/llm/:prompt', sendLLMResponse);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
