import AsyncStorage from '@react-native-async-storage/async-storage';

import Alarm from './interfaces/Alarm'
import Note from './interfaces/Note'
import GoogleQuery from './interfaces/GoogleQuery';

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

export const storeNote = async (alarmId: string, note: Note) => {
    return await storeObject(alarmId, note)
  };


export const storeQuery = async (queryId: string, query: GoogleQuery) => {
    return await storeObject(queryId, query)
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

  export const getNote = async (alarmId: string): Promise<Note> => {
    const note : Note = await getObject(alarmId);
    if (note === null) {
      return {
        title: 'Error',
        content: 'Sorry, this note was not found', 
        alarmId: alarmId
      }
    }
    return note;
  }

  export const getQuery = async (queryId: string): Promise<GoogleQuery> => {
    const query : GoogleQuery = await getObject(queryId);
    if (query === null) {
      return {
        title: 'Error',
        content: 'Sorry, this query was not found',
        alarmId: queryId
      }
    }
    return query;
  }

  export const getAllAlarms = async (): Promise<[Alarm]> => {
    return await getObject(ALARM_LIST_KEY);
  }

  export const getAlarm = async (alarmId: string): Promise<Alarm> => {
    const alarms = await getObject(ALARM_LIST_KEY);
    const defaultAlarm = {
      id: 'Error',
      time: new Date(2000, 1, 1, 0, 0),
      enabled: false,
      name: 'Sorry, this alarm was not found'
    }
    if (alarms === null) {
      return defaultAlarm;
    }

    const alarm = alarms.find((alarm: Alarm) => alarm.id === alarmId);
    return alarm ?? defaultAlarm;
  }