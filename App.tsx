// App.tsx (Complet - Audio.setAudioModeAsync SUPPRIMÉ)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { IPTVProvider } from './context/IPTVContext';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importez tous les écrans
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import SeasonScreen from './screens/SeasonScreen';
import EpisodeScreen from './screens/EpisodeScreen';
import { Series, Season } from './types'; 

export type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Season: { series: Series };
  Episode: { season: Season };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  // Le bloc useEffect pour Audio.setAudioModeAsync a été supprimé

  return (
    <SafeAreaProvider>
      <IPTVProvider>
        <StatusBar barStyle="light-content" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#1A1A1A' },
              headerTintColor: '#FFF',
              headerBackTitleVisible: false,
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Mes Profils IPTV' }}
            />
            <Stack.Screen 
              name="Player" 
              component={PlayerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Season" 
              component={SeasonScreen}
              options={({ route }) => ({ title: route.params.series.name })}
            />
            <Stack.Screen 
              name="Episode" 
              component={EpisodeScreen}
              options={({ route }) => ({ title: route.params.season.name })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </IPTVProvider>
    </SafeAreaProvider>
  );
};

export default App;