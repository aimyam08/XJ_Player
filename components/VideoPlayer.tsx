// components/VideoPlayer.tsx (Complet)

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av'; 
import { useIPTV } from '../context/IPTVContext';

const VideoPlayer = () => {
  const { currentStream } = useIPTV();
  const videoRef = React.useRef(null);

  return (
    <View style={styles.container}>
      {currentStream ? (
        <Video
          key={currentStream.id} 
          ref={videoRef}
          style={styles.video}
          source={{ uri: currentStream.url }} 
          
          useNativeControls 
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay // Démarre la lecture automatiquement

          // --- AJOUTS POUR FORCER LE SON ---
          isMuted={false}
          volume={1.0}
          // --- FIN DES AJOUTS ---
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Aucune chaîne sélectionnée</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFF',
  },
});

export default VideoPlayer;