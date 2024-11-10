import { Audio } from 'expo-av';
import { getAllAlarms, storeAlarm } from '../asyncStorage/useAsyncStorage';
import { SoundObject } from 'expo-av/build/Audio';
import Alarm from '../asyncStorage/interfaces/Alarm'
import { Sound } from 'expo-av/build/Audio';

export async function playAudioUrl(url: string, setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    const playbackObject  = await Audio.Sound.createAsync(
      { uri: url },
    );
    playbackObject.sound.playAsync()
    setCurrentAlarmSound(playbackObject.sound)
    openAlarmRunningScreen()
}

export const playAlarm = async (setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) => {  
  playAudioUrl("https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg", setCurrentAlarmSound, openAlarmRunningScreen)
}

export const setAlarmTimeout = async (alarm: Alarm, setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) => {
  const alarmTime = alarm.time.getTime()
  const currentTime = new Date().getTime()
  const timeout = alarmTime - currentTime
  console.log(timeout, alarmTime, currentTime)
  setTimeout(() => {playAlarm(setCurrentAlarmSound, openAlarmRunningScreen)}, timeout);
}


export const setAllAlarmTimeout = async (setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) =>{
  const alarms = await getAllAlarms()
  alarms.forEach((e)=>{
    setAlarmTimeout(e, setCurrentAlarmSound, openAlarmRunningScreen)
  })
}

export const setAlarm = async (id:string, time:Date, enable:boolean, name:string, setCurrentAlarmSound: React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) => {
  const alarm = {id:id, time:time, enabled:enable, name:name}
  await storeAlarm(alarm)
  setAlarmTimeout(alarm, setCurrentAlarmSound, openAlarmRunningScreen)
}