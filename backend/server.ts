import * as textToSpeech from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import { promisify } from 'util';
import express, { Request, Response } from 'express';
import { Buffer } from "buffer";
import dotenv from 'dotenv'; 

dotenv.config()

const client = new textToSpeech.TextToSpeechClient(); // uses ADC

async function getTextAudio(text: string,
                            languageCode : string = 'en-US',
                            audioEncoding : string = 'MP3',
                            gender : string = 'NEUTRAL') {
  const request = {
    input: { text: text },
    voice: { languageCode: languageCode, ssmlGender: gender },
    audioConfig: { audioEncoding: audioEncoding },
  };

  //@ts-ignore
  const [response] = await client.synthesizeSpeech(request);
  //const writeFile = promisify(fs.writeFile);
  //await writeFile('output.mp3', response.audioContent, 'binary');
  //console.log('Audio content written to file: output.mp3');
  return response.audioContent;
}

async function sendResponse(req : Request, res : Response) {
    if (!req.body.hasOwnProperty('text'))
        throw new Error("Invalid request");

    const text = req.body['text']; 

    const audioData: Buffer = await getTextAudio(text);

    res.json({
        data: audioData.toString('base64')
    }); 
}

console.log();

const app = express()
const PORT = 8888;

app.use(express.json())

app.post('/echo', sendResponse);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
