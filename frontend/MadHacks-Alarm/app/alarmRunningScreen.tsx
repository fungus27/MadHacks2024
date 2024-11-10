import { Link, router, Stack } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { Button, Text, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext, useEffect } from 'react';
import { AlarmContext } from '@/context/alarmContext';
import * as Notifications from 'expo-notifications';

export default function AlarmRunningScreen() {
  const [currentAlarmSound, setCurrentAlarmSound, currentAlarm, setCurrentAlarm] = useContext(AlarmContext)
  const date:Date = new Date()

  useEffect(() => {
    try{
      Notifications.cancelScheduledNotificationAsync(currentAlarm.notificationId)
      console.log("Notification cancelled")
      Notifications.dismissAllNotificationsAsync()
      console.log("All notifications dismissed")
    }
    catch(e){
      console.log("Notification wasn't cancelled successfully: " + e)
    }
  },[currentAlarmSound])

  console.log(currentAlarm)
  return (
    <>
      <Stack.Screen options={{ title: 'Alarm!' }} />
      <View style={styles.container}>

      <Text style={styles.itemText}>{currentAlarm?.name}</Text>
        <Text style={styles.itemText}> {date.toTimeString().substring(0, 5)}</Text>
        <Text style={styles.noteText}>{currentAlarm?.note}</Text>
        <Pressable style={styles.button}  onPress={()=>{
          currentAlarmSound.stopAsync()
          setCurrentAlarm(null)
          setCurrentAlarmSound(null)
          router.back()
          }
          }>
        <Text style={styles.itemText}>STOP</Text>
        </Pressable>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2f4f4f'
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  itemText: {
    fontSize: 30,
    color: '#fffaf0',
    fontWeight: '600',
    margin:5
  },
  noteText: {
    fontSize: 20,
    color: '#fffaf0',
    fontWeight: '300',
    margin:5
  },
  button: {
    backgroundColor: '#ffab00',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  }

});
