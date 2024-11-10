import { Audio } from 'expo-av';
import { getAllAlarms, storeAlarm } from '../asyncStorage/useAsyncStorage';
import { SoundObject } from 'expo-av/build/Audio';
import Alarm from '../asyncStorage/interfaces/Alarm'
import { Sound } from 'expo-av/build/Audio';
import * as Notifications from 'expo-notifications';

export async function playAudioUrl(url: string, setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction, setCurrentAlarm:CallableFunction, alarm:Alarm) {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    openAlarmRunningScreen()
    setCurrentAlarm(alarm)

    const playbackObject  = await Audio.Sound.createAsync(
      { uri: url },
    );
    playbackObject.sound.playAsync()
    setCurrentAlarmSound(playbackObject.sound)
}

export const playAlarm = async (note: string, shouldQuery: boolean, setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction, setCurrentAlarm:CallableFunction, alarm:Alarm) => {  
  const url = `http://10.140.122.223:8888/${shouldQuery ? 'llm' : 'tts'}/${note}`
  console.log("playing alarm from "+url)
  playAudioUrl(url, setCurrentAlarmSound, openAlarmRunningScreen, setCurrentAlarm, alarm)
}

export const setAlarmTimeout = async (alarm: Alarm, setCurrentAlarmSound:React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction, setCurrentAlarm:CallableFunction) => {
  const alarmTime = alarm.time.getTime()
  const currentTime = new Date().getTime()
  const timeout = alarmTime - currentTime
  console.log(timeout, alarmTime, currentTime)
  const timeoutId = setTimeout(() => {console.log('ring ring');playAlarm(alarm.note, alarm.shouldQuery, setCurrentAlarmSound, openAlarmRunningScreen, setCurrentAlarm, alarm)}, timeout);
  return timeoutId
}

export const setAlarm = async (id:string, time:Date, enable:boolean, name:string, note:string, shouldQuery:boolean, setCurrentAlarmSound: React.Dispatch<React.SetStateAction<Sound|undefined>>, openAlarmRunningScreen: CallableFunction, setCurrentAlarm:CallableFunction) => {
  const alarm: Alarm = {id:id, time:time, enabled:enable, name:name, timeoutId: setTimeout(()=>{},1), note:note, shouldQuery:shouldQuery, notificationId: ""}
  const timeoutId = await setAlarmTimeout(alarm, setCurrentAlarmSound, openAlarmRunningScreen, setCurrentAlarm);
  alarm.timeoutId = timeoutId

  const notificationId = await setupNotification(alarm, Math.max((alarm.time.getTime() - new Date().getTime())/1000-15, 0))
  alarm.notificationId = notificationId
  return alarm;
}

export const setupNotification = async(alarm:Alarm, triggerSecond:number) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: alarm.name,
      body: alarm.note,
      data: alarm
    },
    trigger: {
      seconds: triggerSecond
    },
  });

}