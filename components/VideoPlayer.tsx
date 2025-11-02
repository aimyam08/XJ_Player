import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Video } from 'expo-video'; 
import { useIPTV } from '../context/IPTVContext';

const VideoPlayer = () => {
  const { currentChannel } = useIPTV();
  const videoRef = React.useRef(null);

  return (
    <View style={styles.container}>
      {currentChannel ? (
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: currentChannel.url }}
          allowsFullscreen 
          allowsPictureInPicture 
          controls={true} 
          autoplay 
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