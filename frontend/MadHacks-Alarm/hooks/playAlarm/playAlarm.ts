import { Audio } from 'expo-av';
import { getAllAlarms, storeAlarm } from '../asyncStorage/useAsyncStorage';
import { SoundObject } from 'expo-av/build/Audio';
import Alarm from '../asyncStorage/interfaces/Alarm'
import { Sound } from 'expo-av/build/Audio';
import * as Notifications from 'expo-notifications';

export async function playAudioUrl(url: string, setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    const playbackObject  = await Audio.Sound.createAsync(
      { uri: url },
    );
    playbackObject.sound.playAsync()
    setCurrentAlarmSound(playbackObject.sound)
    openAlarmRunningScreen()
}

export const playAlarm = async (note: string, shouldQuery: boolean, setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) => {  
  const url = `http://10.140.122.223:8888/${shouldQuery ? 'llm' : 'tts'}/${note}`
  console.log("playing alarm from "+url)
  playAudioUrl(url, setCurrentAlarmSound, openAlarmRunningScreen)
}

export const setAlarmTimeout = async (alarm: Alarm, setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) => {
  const alarmTime = alarm.time.getTime()
  const currentTime = new Date().getTime()
  const timeout = alarmTime - currentTime
  console.log(timeout, alarmTime, currentTime)
  setupNotification(alarm, timeout/1000)
  return setTimeout(() => {console.log('ring ring');playAlarm(setCurrentAlarmSound, openAlarmRunningScreen)}, timeout);
}

export const setAlarm = async (id:string, time:Date, enable:boolean, name:string, note:string, shouldQuery:boolean, setCurrentAlarmSound: React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction) => {
  const alarm: Alarm = {id:id, time:time, enabled:enable, name:name, timeoutId: setTimeout(()=>{},1), note:note, shouldQuery:shouldQuery}
  const timeoutId = await setAlarmTimeout(alarm, setCurrentAlarmSound, openAlarmRunningScreen);
  alarm.timeoutId = timeoutId;
  return alarm;
}

const setupNotification = (alarm:Alarm, triggerSecond:number) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: alarm.name,
      body: alarm.note,
      data: {alarm: alarm}
    },
    trigger: {
      seconds: triggerSecond
    },
  });
}