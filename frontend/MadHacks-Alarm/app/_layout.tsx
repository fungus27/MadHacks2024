import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Alarm from '@/hooks/asyncStorage/interfaces/Alarm';
import { Sound } from 'expo-av/build/Audio';
import { AlarmContext } from '@/context/alarmContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [currentAlarmSound, setCurrentAlarmSound] = useState<Sound>()
  const [currentAlarm, setCurrentAlarm] = useState<Alarm>()

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AlarmContext.Provider value={[currentAlarm, setCurrentAlarm, currentAlarmSound, setCurrentAlarmSound]}>
        <Stack>
          <Stack.Screen name="alarmRunningScreen" options={{presentation: 'modal'}}/>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AlarmContext.Provider>
      
    </ThemeProvider>
  );
}
