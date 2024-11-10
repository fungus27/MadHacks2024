import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // This will help navigate back
import { storeAlarm } from '@/hooks/asyncStorage/useAsyncStorage';

interface Alarm {
    id: string;
    time: Date;
    enabled: boolean;
    name: string;
}
const AddItemScreen = () => {
  const [newItemText, setNewItemText] = useState('');
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
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter new item"
        value={newItemText}
        onChangeText={setNewItemText}
      />
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
