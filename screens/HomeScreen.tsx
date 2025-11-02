// screens/HomeScreen.tsx (Complet et Corrigé)

import React from 'react';
import { View, StyleSheet, Text, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIPTV } from '../context/IPTVContext';
import { Picker } from '@react-native-picker/picker';
import { IPTVProfile } from '../types';

import PlaylistManager from '../components/PlaylistManager';
import ChannelList from '../components/ChannelList';
import MovieList from '../components/MovieList';
import SeriesList from '../components/SeriesList';

const Tab = createMaterialTopTabNavigator();

// --- CORRECTION DU CRASH ICI ---
const MediaTabs = () => {
  const { channels, movies, series, isLoading } = useIPTV();

  // Si le profil est en cours de chargement, on affiche un spinner
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const totalCount = channels.length + movies.length + series.length;
  
  // Si le profil est chargé mais vide, on affiche un message
  if (totalCount === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyText}>Ce profil est vide ou n'a pas pu être analysé.</Text>
      </View>
    );
  }

  // Sinon, on affiche les onglets
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#888',
        tabBarIndicatorStyle: { backgroundColor: '#FFF' },
        tabBarStyle: { backgroundColor: '#1A1A1A' },
        tabBarScrollEnabled: true,
      }}
    >
      {channels.length > 0 && (
        <Tab.Screen 
          name="Chaînes" 
          component={ChannelList} 
          options={{ title: `Chaînes (${channels.length})` }}
        />
      )}
      {movies.length > 0 && (
        <Tab.Screen 
          name="Films" 
          component={MovieList} 
          options={{ title: `Films (${movies.length})` }}
        />
      )}
      {series.length > 0 && (
        <Tab.Screen 
          name="Séries" 
          component={SeriesList} 
          options={{ title: `Séries (${series.length})` }}
        />
      )}
    </Tab.Navigator>
  );
};
// --- FIN DE LA CORRECTION DU CRASH ---


const HomeScreen = () => {
  const { currentProfile, unloadProfile, profiles, loadProfile } = useIPTV();

  const onProfileChange = (profileId: string | null) => {
    if (!profileId) {
      unloadProfile();
      return;
    }
    const selectedProfile = profiles.find(p => p.id === profileId);
    if (selectedProfile && selectedProfile.id !== currentProfile?.id) {
      console.log("Changement de profil via le menu...", selectedProfile.name);
      loadProfile(selectedProfile);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {currentProfile ? (
        // --- Vue "Profil Chargé" ---
        <View style={styles.container}>
          <View style={styles.header}>
            <Picker
              selectedValue={currentProfile.id}
              onValueChange={(itemValue) => onProfileChange(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFF"
            >
              {profiles.map((profile: IPTVProfile) => (
                <Picker.Item 
                  key={profile.id} 
                  label={profile.name}
                  value={profile.id}
                  // --- CORRECTION DU STYLE ANDROID (Texte blanc sur blanc) ---
                  color={Platform.OS === 'android' ? '#000' : '#FFF'}
                />
              ))}
              <Picker.Item 
                key="logout" 
                label="Gérer les profils (Déconnexion)" 
                value={null}
                color={Platform.OS === 'android' ? '#555' : '#AAA'}
              />
            </Picker>
          </View>
          <MediaTabs />
        </View>
      ) : (
        // --- Vue "Aucun Profil" ---
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
    backgroundColor: '#1A1A1A',
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#FFF', // Couleur du texte SÉLECTIONNÉ
    backgroundColor: '#1A1A1A',
  },
  // Style pour les messages "Chargement" ou "Profil Vide"
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  }
});

export default HomeScreen;