import { Audio } from 'expo-av';
import { getAllAlarms, storeAlarm } from '../asyncStorage/useAsyncStorage';
import { SoundObject } from 'expo-av/build/Audio';
import Alarm from '../asyncStorage/interfaces/Alarm'
import { Sound } from 'expo-av/build/Audio';

export async function playAudioUrl(url: string, setCurrentAlarm:React.Dispatch<React.SetStateAction<Sound|undefined>>) {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    const playbackObject  = await Audio.Sound.createAsync(
      { uri: url },
    );
    playbackObject.sound.playAsync()
    setCurrentAlarm(playbackObject.sound)
}

export const playAlarm = async (setCurrentAlarm:React.Dispatch<React.SetStateAction<Sound|undefined>>) => {  
  playAudioUrl("https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg", setCurrentAlarm)
}

export const setAlarmTimeout = async (alarm: Alarm, setCurrentAlarm:React.Dispatch<React.SetStateAction<Sound|undefined>>) => {
  const alarmTime = alarm.time.getTime()
  const currentTime = new Date().getTime()
  const timeout = alarmTime - currentTime
  console.log(timeout, alarmTime, currentTime)
  setTimeout(() => {playAlarm(setCurrentAlarm)}, timeout);
}


export const setAllAlarmTimeout = async (setCurrentAlarm:React.Dispatch<React.SetStateAction<Sound|undefined>>) =>{
  const alarms = await getAllAlarms()
  alarms.forEach((e)=>{
    setAlarmTimeout(e, setCurrentAlarm)
  })
}

export const setAlarm = async (id:string, time:Date, enable:boolean, name:string, setCurrentAlarm: React.Dispatch<React.SetStateAction<Sound|undefined>>
) => {
  const alarm = {id:id, time:time, enabled:enable, name:name}
  await storeAlarm(alarm)
  setAlarmTimeout(alarm, setCurrentAlarm)
}