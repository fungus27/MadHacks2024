import * as textToSpeech from '@google-cloud/text-to-speech';
import { Request, Response } from 'express';
import { Buffer } from "buffer";
import dotenv from 'dotenv'; 
import * as tmp from 'tmp';
import * as util from 'util';
import * as fs from 'fs';

dotenv.config()

tmp.setGracefulCleanup();

const client = new textToSpeech.TextToSpeechClient(); // uses ADC


export async function getTextAudio(text: string,
                            languageCode : string = 'en-US',
                            audioEncoding : string = 'MP3',
                            gender : string = 'NEUTRAL') {
  const request = {
    input: { text: text },
    voice: { languageCode: languageCode, ssmlGender: gender },
    audioConfig: { audioEncoding: audioEncoding },
  };

  var files = fs.readdirSync('.').filter(fn => fn.endsWith('.mp3'));
  for (let i = 0; i < files.length; ++i) {
      const { mtimeMs } = fs.statSync(files[i]);
      if (Date.now() - mtimeMs >= 2 * 60 * 1000) {
          fs.unlinkSync(files[i]);
      }
  }

  //@ts-ignore
  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  const tmpFile = tmp.fileSync({tmpdir: ".", postfix: ".mp3"});
  console.log(tmpFile.name);

  await writeFile(tmpFile.name, response.audioContent, 'binary');

  return tmpFile.name;
}

export default async function sendTTSResponse(req : Request, res : Response) {
    const text = req.params.text;

    const audioFileName = await getTextAudio(text);

    /*     res.json({
        audioFile: audioFileName
    });  */

   res.sendFile(audioFileName);
}
