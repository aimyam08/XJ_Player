import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaylistManager from '../components/PlaylistManager';
import ChannelList from '../components/ChannelList';
import { useIPTV } from '../context/IPTVContext';

const HomeScreen = () => {
  const { currentProfile, unloadProfile } = useIPTV();

  return (
    
    <SafeAreaView style={styles.container} edges={['top']}>
      {currentProfile ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.profileTitle}>
              Profil: {currentProfile.name}
            </Text>
            <Button 
              title="Changer" 
              onPress={unloadProfile}
              color="#007AFF"
            />
          </View>
          
          <ChannelList />
        </View>
      ) : (
        <PlaylistManager />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default HomeScreen;