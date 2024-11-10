import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, StyleSheet, TextInput, View, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { playAudioUrl } from '@/hooks/playAlarm/playAlarm';
import { Sound } from 'expo-av/build/Audio';

export default function TimerScreen() {

  const [timerLastTime, setTimerLastTime] = React.useState('10')
  const [timerStartTime, setTimerStartTime] = React.useState(0)
  const [timerRunning, setTimerRunning] = React.useState(false)
  const [timerDisplayTime, setTimerDisplayTime] = React.useState(0)
  const [timerEndShowing, setTimerEndShowing] = React.useState(false)
  const [note, setNote] = React.useState("Time's Up!")
  const [title, setTitle] = React. useState("Timer Title")
  const [alarmSound ,setCurrentAlarmSound] = React.useState<Sound|undefined>()


  useEffect(() => {
    const updateEventTimeLasting = () => {
      if(timerRunning){
        const timeRemaining = Math.ceil(parseInt(timerLastTime) - (Date.now() - timerStartTime)/1000)
        setTimerDisplayTime(timeRemaining)
        if(timeRemaining === 0){
          setTimerRunning(false)
          setTimerEndShowing(true)
          playAudioUrl(encodeURI(`http://10.140.27.228:8888/tts/${note}`), setCurrentAlarmSound, ()=>{})
        }
      }
    }
    let eventTimeUpdateInterval = setInterval(updateEventTimeLasting, 1000)
    return () => clearInterval(eventTimeUpdateInterval);
  }, [timerDisplayTime, timerRunning])
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView>
        
          {timerEndShowing? <>
            <ThemedView>
              <ThemedText>
                Time's up!
              </ThemedText>
              <Button title='Confirm' onPress={()=>{
                setTimerEndShowing(false)
              }}/>
            </ThemedView>
          </>:<>
          {timerRunning? <>
            <ThemedText>Timer: {title}</ThemedText>
            <ThemedText>Time Remaining: {timerDisplayTime}</ThemedText>
          </>:<>
            <TextInput
              editable
              numberOfLines={1}
              maxLength={40}
              onChangeText={text => setTimerLastTime(text)}
              value={timerLastTime}
              style={{backgroundColor: 'white'}}
            />
            <TextInput
              editable
              numberOfLines={1}
              maxLength={40}
              onChangeText={text => setTitle(text)}
              value={title}
              style={{backgroundColor: 'white'}}
            />
            <TextInput
              editable
              numberOfLines={4}
              maxLength={40}
              onChangeText={text => setNote(text)}
              value={note}
              style={{backgroundColor: 'white'}}
            />
            <Button title='Start Timer' onPress={() => {
              setTimerStartTime(Date.now())
              setTimerRunning(true)
              setTimerDisplayTime(parseInt(timerLastTime))
              }}/>
          </>}
          </>}
          
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
