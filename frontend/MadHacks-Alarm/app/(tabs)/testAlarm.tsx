import React, { useContext, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, StyleSheet, TextInput, View } from 'react-native';

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

export default function TestAlarmScreen() {
  // const [currentAlarmSound, setCurrentAlarmSound] = React.useState<Sound>()
  // const [currentAlarm, setCurrentAlarm] = React.useState<Alarm>()
  const [currentAlarmSound, setCurrentAlarmSound, currentAlarm, setCurrentAlarm] = useContext(AlarmContext)

  const openAlarmRunningScreen = () => {
    router.navigate('/alarmRunningScreen')
  }
  
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
          setAlarm("randomid", time, true, "helloalarm", setCurrentAlarmSound, openAlarmRunningScreen)
        }}/>
      </ThemedView>

    </ParallaxScrollView>
  );
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
