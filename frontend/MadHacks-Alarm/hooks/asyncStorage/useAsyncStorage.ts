import AsyncStorage from '@react-native-async-storage/async-storage';

import Alarm from './interfaces/Alarm'

const ALARM_LIST_KEY = 'alarms';

// Stores generic objects in AsyncStorage
export const storeObject = async (key: string, value: object): Promise<boolean> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  };

export const storeAlarm = async (alarm: Alarm) => {
    // Get alarms from storage
    const alarms = await getObject(ALARM_LIST_KEY);

    // If alarms is null, create a new array
    if (alarms === null) {
      await storeObject(ALARM_LIST_KEY, [alarm]);
      return
    }

    // Add the new alarm to the array
    alarms.push(alarm);
    await storeObject(ALARM_LIST_KEY, alarms);
  }

// Performs reading operations on AsyncStorage
export const getObject = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e)
      return null
    }
  };

  export const getAllAlarms = async (): Promise<Alarm[]> => {
    return await getObject(ALARM_LIST_KEY);
  }

  export const getAlarm = async (alarmId: string): Promise<Alarm> => {
    const alarms = await getObject(ALARM_LIST_KEY);
    const defaultAlarm = {
      id: 'Error',
      time: new Date(2000, 1, 1, 0, 0),
      enabled: false,
      name: 'Sorry, this alarm was not found',
      note: 'Sorry, this alarm was not found',
      shouldQuery: false,
      timeoutId: setTimeout(()=>{},0)
    }
    if (alarms === null) {
      return defaultAlarm;
    }

    const alarm = alarms.find((alarm: Alarm) => alarm.id === alarmId);
    return alarm ?? defaultAlarm;
  }

  // Performs deletion operations on AsyncStorage
export const deleteObject = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  };

  export const deleteAlarm = async (alarmId: string) => {
    const alarms = await getObject(ALARM_LIST_KEY);
    if (alarms === null) {
      return
    }

    const updatedAlarms = alarms.filter((alarm: Alarm) => {
      if (alarm.id === alarmId) {
        // Cancel timeout with timeoutId
        clearTimeout(alarm.timeoutId)
        return false
      }
      return true
    });
    await storeObject(ALARM_LIST_KEY, updatedAlarms);
  }

  export const updateAlarm = async (alarmId: string, updatedAlarm: Alarm) => {
    // Get alarms from storage
    const alarms = await getObject(ALARM_LIST_KEY);
    console.log(alarmId)
 
    const updatedAlarms = alarms.reduce((prev:any, alarm: Alarm) => {
      if(alarm.id === alarmId) {
        if (updatedAlarm.enabled === false) {
          // Cancel timeout with timeoutId
          console.log('cancelling timeout')
          clearTimeout(alarm.timeoutId)
        }
        else {
          // Set new timeout
          const offset = new Date(updatedAlarm.time).getTime() - new Date().getTime();
          console.log('setting new timeout')
          console.log(offset)
          clearTimeout(alarm.timeoutId)
          if (offset > 0) {
            const timeoutId = setTimeout(() => {console.log('ring ring')}, offset); // TODO: play alarm
            updatedAlarm.timeoutId = timeoutId;
          }
        }
        return [...prev, updatedAlarm]
      }
      else {
        console.log(alarm.id)
        return [...prev, alarm]}
      }, []);
    await storeObject(ALARM_LIST_KEY, alarms);
  }
  