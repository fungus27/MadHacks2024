import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Animated} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// list items
const DATA = [
  {id: '1', text: 'WAKE UP'},
  {id: '2', text: 'When Life Gives You Lemons'},
  {id: '3', text: 'Teeheehooha'},
  {id: '4', text: 'This is an app'},
  {id: '5', text: 'Im breaking up with u'},
  {id: '6', text: 'HELLOOOOOOOOOOOOO'},
  {id: '7', text: 'Banana smoothie'},
  {id: '8', text: 'Getting inebriated'},
  {id: '9', text: '1000 BEERS'},
  {id: '10', text: 'ON WISCONSIN'},
  {id: '11', text: 'Lalalalalala'},
  {id: '12', text: 'HELLOOOOOOOOOOOOO'},
  {id: '13', text: 'Big Chungus'},
  {id: '14', text: 'Can I have a mbnnfdmfmmdfduhhhhhhhhhhh'},
  {id: '15', text: 'Burger'},
];
// bottom tabs
const Tab = createBottomTabNavigator();

// right actions
const ListItem = ({item} : {item:any}) => {
  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={[styles.button, styles.edit]}>
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.delete]}>
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
const DataList = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ListItem item={item} />}
      />
    </GestureHandlerRootView>
  );
};

export default DataList;

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008b8b',
  },
  item: {
    padding: 20,
    marginBottom: 2,
    backgroundColor: '#e6e6fa',
  },
  itemText: {
    fontSize: 15,
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
  edit: {
    backgroundColor: '#ffab00',
  },
  delete: {
    backgroundColor: '#ff1744',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});