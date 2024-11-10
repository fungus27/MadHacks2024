import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {useRouter} from 'expo-router';

// list items
const initialData = [
  {id: '1', text: 'WAKE UP'},
  {id: '2', text: 'When Life Gives You Lemons'},
  {id: '3', text: 'Tweaking alarm'},
  {id: '4', text: '1000 beers'},
  {id: '5', text: 'dooby'},
];

// right actions
const ListItem = ({item, onDelete }:{item:any; onDelete: (id: string) => void}) => {
  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={[styles.button, styles.delete]} onPress={() => onDelete(item.id)}>
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
    </Swipeable>
  );
};

// List view
const SwipeableList = () => {
  const [data, setData] = useState(initialData);
  const router = useRouter();
  
  const handleDelete = (id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleAddItem = (newItemText: string) => {
    const newItem = {
      id: (data.length + 1).toString(),
      text: newItemText,
    };
    setData((prevData) => [...prevData, newItem]);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
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
  },
  itemText: {
    fontSize: 15,
    color: '#fffaf0',
    fontWeight: '600',
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