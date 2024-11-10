import { Link, router, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext } from 'react';
import { AlarmContext } from '@/context/alarmContext';

export default function AlarmRunningScreen() {
  const [currentAlarmSound, setCurrentAlarmSound, currentAlarm, setCurrentAlarm] = useContext(AlarmContext)
  const date:Date = new Date()
  return (
    <>
      <Stack.Screen options={{ title: 'Alarm!' }} />
      <ThemedView style={styles.container}>
        <ThemedText>
          {date.getHours()}:{date.getMinutes()}
        </ThemedText>
        <Button title='stop' onPress={()=>{
          currentAlarmSound.stopAsync()
          router.back()
        }

          
        }/>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
