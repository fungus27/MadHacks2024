import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router'; // This will help navigate back
import { storeAlarm } from '@/hooks/asyncStorage/useAsyncStorage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Alarm from '@/hooks/asyncStorage/interfaces/Alarm';
import { setAlarm } from '@/hooks/playAlarm/playAlarm';
import { AlarmContext } from '@/context/alarmContext';

const AddItemScreen = () => {
  const [newItemText, setNewItemText] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDateModal, setOpenDateModal] = useState(false);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [note, setNote] = useState('');
  const [query, setQuery] = useState(false);
  const [currentAlarmSound, setCurrentAlarmSound, currentAlarm, setCurrentAlarm] = useContext(AlarmContext)

  const openAlarmRunningScreen = () => {
    router.navigate('/alarmRunningScreen')
  }

  const router = useRouter();

  const handleAddItem = async () => {
    if (newItemText.trim() !== '') {
      const alarm = await setAlarm(newItemText+new Date(date).toLocaleDateString(), date, true, newItemText, note, query, setCurrentAlarmSound, openAlarmRunningScreen);
      await storeAlarm(alarm);
      router.back();
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: {timestamp, utcOffset},
    } = event;
    setOpenDateModal(false);
    if (type === 'set') {
      setDate(date);
      setOpenTimeModal(true);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: {timestamp, utcOffset},
    } = event;
    setOpenTimeModal(false);
    if (type === 'set' && openTimeModal) {
      setDate(date);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter new item"
        placeholderTextColor='#fffaf0'
        value={newItemText}
        onChangeText={setNewItemText}
      />
      <View style={{marginBottom:'5%', flexDirection: 'row'}}>
      <TouchableOpacity style={styles.button} onPress={() => setOpenDateModal(true)}>
        <Text style={styles.buttonText}>Select date and time</Text>
        </TouchableOpacity>
        { openDateModal && (
                <DateTimePicker
                style={styles.input}
                onChange={handleDateChange}
                value={date}
                minimumDate={new Date()}
              />
            )}
        { openTimeModal && (
                <DateTimePicker
                style={styles.input}
                onChange={handleTimeChange}
                value={date}
                minimumDate={new Date()}
                mode="time"
              />
            )}
            <Text style={{color: '#fffaf0', fontWeight: 'bold', margin:10}}>{date.toLocaleString()}</Text>
          </View>
      <View style={{marginBottom:'5%', flexDirection: 'row'}}>
      <TextInput
        style={{...styles.input, flex: 4}}
        placeholder="Enter note or query for alarm"
        placeholderTextColor='#fffaf0'
        value={note}
        onChangeText={setNote}
      />
      <View style={{justifyContent: 'center'}}>
        <Text style={{color: '#fffaf0', fontWeight: 'bold'}}>Use query?</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={query ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={setQuery}
        value={query}
        />
      </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D3D47',
    padding: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    color: '#fffaf0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffab00',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fffaf0',
    fontWeight: 'bold',
  },
});

export default AddItemScreen;
