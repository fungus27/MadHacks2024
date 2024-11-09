import express from 'express';
import dotenv from 'dotenv'; 

import sendResponse from './utils/tts/tts';

dotenv.config()

const app = express()
const PORT = 8888;

app.use(express.json())

app.post('/echo', sendResponse);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
