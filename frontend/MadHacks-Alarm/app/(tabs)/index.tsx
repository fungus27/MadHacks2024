import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';

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

  const handleDelete = (id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
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
});

export default SwipeableList;