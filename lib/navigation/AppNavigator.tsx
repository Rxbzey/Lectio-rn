import { NavigationContainer, useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

import { SplashScreen } from 'components/SplashScreen';
import { AppBar } from 'components/AppBar';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '../stores/useThemeStore';
import { useProgressStore } from '../stores/useProgressStore';
import { getRandomVerse } from '../../data/bibleVerses';

import { HomeScreen } from './screens/HomeScreen';
import { BooksScreen } from './screens/BooksScreen';
import { ChaptersScreen } from './screens/ChaptersScreen';
import { VersesScreen } from './screens/VersesScreen';
import { ReaderScreen } from './screens/ReaderScreen';
import { SearchNavScreen } from './screens/SearchNavScreen';
import { MarksNavScreen } from './screens/MarksNavScreen';

import type { RootStackParamList } from './types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppBarController({ currentRoute, isDark, toggleTheme, onHeightMeasured }: {
  currentRoute: keyof RootStackParamList;
  isDark: boolean;
  toggleTheme: () => void;
  onHeightMeasured: (h: number) => void;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isHome = currentRoute === 'Home';
  return (
    <AppBar
      screen={isHome ? 'home' : 'reader'}
      isDark={isDark}
      onBack={() => navigation.goBack()}
      onToggleTheme={toggleTheme}
      onHeightMeasured={onHeightMeasured}
    />
  );
}

export type Screen = keyof RootStackParamList;

export function AppNavigator() {
  const colorScheme = useColorScheme();
  const { isDark, toggleTheme, initializeTheme } = useThemeStore();
  const { initializeProgress } = useProgressStore();
  const [appBarHeight, setAppBarHeight] = useState(0);
  const [verseOfDay, setVerseOfDay] = useState<{ text: string; reference: string } | null>(null);
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState<keyof RootStackParamList>('Home');

  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Light': Inter_300Light,
    PlayfairDisplay: PlayfairDisplay_400Regular,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('light');
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  useEffect(() => {
    Promise.all([
      initializeTheme(colorScheme === 'dark'),
      initializeProgress(),
    ]).catch(console.error);
  }, [colorScheme, initializeTheme, initializeProgress]);

  useEffect(() => {
    let active = true;
    getRandomVerse()
      .then((verse) => { if (active) setVerseOfDay(verse); })
      .catch(() => { if (active) setVerseOfDay(null); });
    return () => { active = false; };
  }, []);

  const backgroundColor = isDark ? '#050505' : '#efe6d4';

  if (!fontsLoaded) return <SplashScreen isDark={isDark} />;

  return (
    <SafeAreaProvider style={{ backgroundColor }}>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={(state) => {
            if (state && state.routes && state.index != null) {
              setCurrentRoute(state.routes[state.index].name as keyof RootStackParamList);
            }
          }}
          onReady={() => {
            const state = navigationRef.getState();
            if (state && state.routes && state.index != null) {
              setCurrentRoute(state.routes[state.index].name as keyof RootStackParamList);
            }
          }}
        >
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor },
            }}
          >
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  {...props}
                  isDark={isDark}
                  verseOfDay={verseOfDay}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Books">
              {(props) => (
                <BooksScreen
                  {...props}
                  isDark={isDark}
                  appBarHeight={appBarHeight}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Chapters">
              {(props) => (
                <ChaptersScreen
                  {...props}
                  isDark={isDark}
                  appBarHeight={appBarHeight}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Verses">
              {(props) => (
                <VersesScreen
                  {...props}
                  isDark={isDark}
                  appBarHeight={appBarHeight}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Reader">
              {(props) => (
                <ReaderScreen
                  {...props}
                  isDark={isDark}
                  appBarHeight={appBarHeight}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Search">
              {(props) => (
                <SearchNavScreen
                  {...props}
                  isDark={isDark}
                  appBarHeight={appBarHeight}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Marks">
              {(props) => (
                <MarksNavScreen
                  {...props}
                  isDark={isDark}
                  appBarHeight={appBarHeight}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
          <AppBarController
            currentRoute={currentRoute}
            isDark={isDark}
            toggleTheme={toggleTheme}
            onHeightMeasured={setAppBarHeight}
          />
        </NavigationContainer>
        <StatusBar hidden />
      </SafeAreaProvider>
    );
}
