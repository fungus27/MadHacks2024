import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Pressable, Platform} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {router, useRouter} from 'expo-router';
import { deleteAlarm, getAllAlarms, updateAlarm } from '@/hooks/asyncStorage/useAsyncStorage';
import Alarm from '@/hooks/asyncStorage/interfaces/Alarm';
import { Switch } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { playAlarm } from '@/hooks/playAlarm/playAlarm';
import { AlarmContext } from '@/context/alarmContext';

// notification and task set up

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const openAlarmRunningScreen = () => {
  router.navigate('/alarmRunningScreen')
}

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  // playAlarm(data.alarm.note, data.alarm.shouldQuery, setCurrentAlarmSound, openAlarmRunningScreen)
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

// right actions
const ListItem = ({item, onDelete }:{item:any; onDelete: (id: string) => void}) => {
  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={[styles.button, styles.delete]} onPress={() => onDelete(item.id)}>
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const [isEnabled, setIsEnabled] = useState(item.enabled)
  const [showNote, setShowNote] = useState(false)

  const alarmChangeEnable = () => {
    setIsEnabled(o => {
      item.enabled = !o
      console.log(item.enabled)
      updateAlarm(item.id, item)
      return !o})
  }

  const expandNote = () => {
    setShowNote(o => !o)
  }

  return (
    <Pressable onPress={expandNote}>
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.item}>
          <View style={styles.itemText}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{new Date(item.time).toLocaleDateString()}</Text>
          </View>
          <Text style={{color:'white', marginTop:'auto', fontSize:32}}>{new Date(item.time).toTimeString().split(' ')[0].split(":").slice(0,2).join(":")}</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={alarmChangeEnable}
            value={isEnabled}
          />
        </View>

        {showNote? <View style={styles.noteItem}>
          <Text style={styles.itemText}>{item.shouldQuery? "Query:":"Note:"}</Text>
          <Text style={styles.noteText}>{item.note}</Text> 
        </View>
        :<></>}
      </Swipeable>
    </Pressable>
  );
};

// List view
const SwipeableList = () => {

const notificationListener = useRef<Notifications.Subscription>();
const responseListener = useRef<Notifications.Subscription>();
const [expoPushToken, setExpoPushToken] = useState('');
const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
const [notification, setNotification] = useState<Notifications.Notification | undefined>(
  undefined
);
const [currentAlarmSound, setCurrentAlarmSound, currentAlarm, setCurrentAlarm] = useContext(AlarmContext)

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound:'default'
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

  useEffect(() => {
  registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

  if (Platform.OS === 'android') {
    Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
  }
  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    const alarm = response.notification.request.content.data
    clearTimeout(alarm.timeoutId)
    playAlarm(alarm.note, alarm.shouldQuery, setCurrentAlarmSound, openAlarmRunningScreen, setCurrentAlarm, alarm)
  });

  return () => {
    notificationListener.current &&
      Notifications.removeNotificationSubscription(notificationListener.current);
    responseListener.current &&
      Notifications.removeNotificationSubscription(responseListener.current);
  };
  }, []);

  const [data, setData] = useState<Alarm[]>([]);
  const router = useRouter();
  
  const handleDelete = (id: string) => {
    deleteAlarm(id);
  };

  useEffect(() => {
    // Fetch data from AsyncStorage
    getAllAlarms().then((alarms) => {
      if (alarms !== null) {
        setData(alarms);
      } else {
        setData([])
      }
    });
  }, [data]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Remind Me That...</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ListItem item={item} onDelete={handleDelete} />}
      />
      
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/add-alarm')} // Navigate to Add Alarm screens
        // onPress={() => setIsInputVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2f4f4f',
    padding: 20,
    paddingTop:50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fffaf0',
  },
  title: {
    fontSize: 24,
    color: '#fffaf0',
    fontWeight: 'bold',
  },
  item: {
    padding: 20,
    marginBottom: 2,
    backgroundColor: '#2f4f4f',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 15,
    color: '#fffaf0',
    fontWeight: '600',
  },
  noteText: {
    fontSize: 15,
    color: '#fffaf0',
    fontWeight: '300',
  },
  noteItem: {
    padding: 20,
    marginTop:-2,
    marginBottom: 2,
    backgroundColor: '#2f4f4f',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  button: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  delete: {
    backgroundColor: '#ff1744',
    fontSize: 20,
  },
  actionText: {
    color: '#fffaf0',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffab00',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  floatingButtonText: {
    fontSize: 36,
    color: '#fffaf0',
    fontWeight: 'bold',
  },
  addItemContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#fffaf0',
  },
  textInput: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 5,
    borderWidth: 1,
  },
  addButton: {
    paddingVertical: 10,
    backgroundColor: '#ffab00',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fffaf0',
    fontWeight: 'bold',
  },
});

export default SwipeableList;