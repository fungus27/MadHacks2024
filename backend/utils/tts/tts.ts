import * as textToSpeech from '@google-cloud/text-to-speech';
import { Request, Response } from 'express';
import { Buffer } from "buffer";

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
  return response.audioContent;
}

export default async function sendResponse(req : Request, res : Response) {
    if (!req.body.hasOwnProperty('text'))
        throw new Error("Invalid request");

    const text = req.body['text']; 

    const audioData: Buffer = await getTextAudio(text);

    res.json({
        data: audioData.toString('base64')
    }); 
}