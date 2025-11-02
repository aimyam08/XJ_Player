import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useIPTV } from '../context/IPTVContext';
import { IPTVProfile, M3UProfile } from '../types';

const PlaylistManager = () => {
  
  const { 
    addProfile, 
    removeProfile, 
    profiles, 
    loadProfile, 
    isLoading, 
    error,
    currentProfile 
  } = useIPTV();
  
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleAddPlaylist = () => {
    if (name.trim() && url.trim()) {
      const newM3UProfile: M3UProfile = {
        id: Date.now().toString(),
        name,
        type: 'm3u',
        url,
      };
      addProfile(newM3UProfile);
      setName('');
      setUrl('');
    } else {
      Alert.alert("Erreur", "Veuillez remplir le nom et l'URL");
    }
  };

  const handleLoadProfile = (profile: IPTVProfile) => {
    if (isLoading) return; 
    console.log("Chargement du profil:", profile.name);
    loadProfile(profile);
  };

  const handleDeleteProfile = (profile: IPTVProfile) => {
    Alert.alert(
      "Supprimer le profil",
      `Êtes-vous sûr de vouloir supprimer "${profile.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: () => removeProfile(profile.id) 
        }
      ]
    );
  };

  const renderProfileItem = ({ item }: { item: IPTVProfile }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.profileType}>{item.type.toUpperCase()}</Text>
      </View>
      <View style={styles.profileActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.loadButton]} 
          onPress={() => handleLoadProfile(item)}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>Charger</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeleteProfile(item)}
        >
          <Text style={styles.actionButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un Profil M3U</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du profil (ex: Mon FAI)"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="URL du fichier M3U"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        keyboardType="url"
        placeholderTextColor="#888"
      />
      <Button title="Ajouter et Sauvegarder" onPress={handleAddPlaylist} />

      <View style={styles.divider} />

      <Text style={styles.title}>Profils Sauvegardés</Text>

      {isLoading && !currentProfile && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement en cours...</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>Erreur: {error}</Text>}

      <FlatList
        data={profiles}
        renderItem={renderProfileItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.emptyText}>Aucun profil sauvegardé.</Text> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF',
  },
  input: {
    height: 44,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#222',
    color: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 20,
  },
  profileItem: {
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFF',
    fontSize: 16,
  },
  profileType: {
    color: '#AAA',
    fontSize: 12,
  },
  profileActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
  },
  loadButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#007AFF',
    marginTop: 10,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PlaylistManager;