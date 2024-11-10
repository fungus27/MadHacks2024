import React, { useContext, useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, StyleSheet, TextInput, View, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { storeObject, getObject } from '../../hooks/asyncStorage/useAsyncStorage';
import { setAlarm } from '@/hooks/playAlarm/playAlarm';
import { Sound } from 'expo-av/build/Audio';
import AlarmRunningScreen from '../alarmRunningScreen';
import Alarm from '@/hooks/asyncStorage/interfaces/Alarm';

import { Link, router } from 'expo-router';
import { AlarmContext } from '@/context/alarmContext';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import * as TaskManager from 'expo-task-manager';



export default function TestAlarmScreen() {
  // const [currentAlarmSound, setCurrentAlarmSound] = React.useState<Sound>()
  // const [currentAlarm, setCurrentAlarm] = React.useState<Alarm>()
  const [currentAlarmSound, setCurrentAlarmSound, currentAlarm, setCurrentAlarm] = useContext(AlarmContext)

  

  



  

  
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Test Alarm Running Screen</ThemedText>
      </ThemedView>
      
      <ThemedView>
        <Button title='set alarm for 5 seconds later' onPress={() => {
          const currentTime = new Date()
          const time = new Date(currentTime.getTime() + 5 * 1000)
          setAlarm("randomid", time, true, "helloalarm", "hellonote", false, setCurrentAlarmSound, openAlarmRunningScreen)
        }}/>
      </ThemedView>
    </ParallaxScrollView>
    
  );
}


async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}


const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
