// screens/PlayerScreen.tsx (Complet)

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useIsFocused } from '@react-navigation/native';

const PlayerScreen = () => {
  const isFocused = useIsFocused(); // Vérifie si l'écran est affiché

  useEffect(() => {
    // Fonction pour gérer l'orientation
    const setOrientation = async () => {
      if (isFocused) {
        // Si on est sur le lecteur, autoriser la rotation
        await ScreenOrientation.unlockAsync();
      } else {
        // Si on quitte le lecteur, verrouiller en portrait
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    };

    setOrientation();

    // Nettoyage : quand le composant est détruit, on verrouille en portrait
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [isFocused]); // Se déclenche à chaque fois qu'on entre/sort de l'écran

  return (
    <View style={styles.container}>
      <VideoPlayer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default PlayerScreen;