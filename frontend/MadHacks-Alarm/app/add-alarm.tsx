import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router'; // This will help navigate back
import { storeAlarm } from '@/hooks/asyncStorage/useAsyncStorage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface Alarm {
    id: string;
    time: Date;
    enabled: boolean;
    name: string;
}
const AddItemScreen = () => {
  const [newItemText, setNewItemText] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDateModal, setOpenDateModal] = useState(false);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const router = useRouter();

  const handleAddItem = async () => {
    if (newItemText.trim() !== '') {
      
      const newAlarm: Alarm = {
        id: new Date().toISOString(), // acts as unique ID
        time: new Date(),   // sets the current date and time for now
        enabled: true, 
        name: newItemText, // sets text input as the name of the alarm
      };
      // store new alarm using storeAlarm
      await storeAlarm(newAlarm);
      // TODO: Set a notification for the alarm
      router.back();
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: {timestamp, utcOffset},
    } = event;
    if (type === 'set') {
      setDate(date);
      setOpenTimeModal(true);
    }
    if (type === 'set' && openTimeModal) {
      const newDate = new Date(date);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      setDate(newDate);
      setOpenTimeModal(false);
    }
    setOpenDateModal(false); // TODO: We need to dismiss twice to close the modal
  };

  console.log(date);
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter new item"
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
              onChange={handleDateChange}
              value={date}
              minimumDate={new Date()}
              mode="time"
            />
          )}
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
    backgroundColor: '#fffaf0',
    padding: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
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
