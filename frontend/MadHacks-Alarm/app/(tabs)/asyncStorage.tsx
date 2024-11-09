import React, { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { storeObject, getObject } from '../../hooks/asyncStorage/useAsyncStorage';

export default function TabTwoScreen() {
  const [value, onChangeText] = React.useState('Useless Multiline Placeholder');
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    const load = async () => {
      const val = await getObject('key');
      if (val !== null) {
        onChangeText(val.value);
      }
    };
    load();
  }, [loaded]);
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Local Storage</ThemedText>
      </ThemedView>
      
      <ThemedView>
        <TextInput
            editable
            multiline
            numberOfLines={4}
            maxLength={40}
            onChangeText={text => onChangeText(text)}
            value={value}
            style={{backgroundColor: 'white'}}
          />
          <View style={{flex:1}}>
          <Button
            title="Save"
            onPress={() => storeObject('key', {value})}
          />
          <Button
            title="Load"
            onPress={() => setLoaded(!loaded)}
          />
          </View>

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
