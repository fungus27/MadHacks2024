import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { storeObject, getObject } from '../../hooks/asyncStorage/useAsyncStorage';
import { setAlarm } from '@/hooks/playAlarm/playAlarm';
import { Sound } from 'expo-av/build/Audio';

export default function TestAlarmScreen() {
  const [currentAlarm, setCurrentAlarm] = React.useState<Sound>()
  
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
          setAlarm("randomid", time, true, "helloalarm", setCurrentAlarm)
        }}/>
        {currentAlarm !== undefined? <Button title='stop' onPress={()=>{
          currentAlarm.stopAsync()
          setCurrentAlarm(undefined)
          
        }}/>:<></>}
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
