// components/PlaylistManager.tsx (Complet)

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
    editProfile, // <-- Nouvelle fonction du contexte
    profiles, 
    loadProfile, 
    isLoading, 
    error,
    currentProfile 
  } = useIPTV();
  
  // États pour le formulaire
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // --- NOUVEL ÉTAT POUR L'ÉDITION ---
  const [editingProfile, setEditingProfile] = useState<IPTVProfile | null>(null);

  // Gère le bouton principal (Ajouter ou Sauvegarder)
  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) {
      Alert.alert("Erreur", "Veuillez remplir le nom et l'URL");
      return;
    }

    if (editingProfile) {
      // --- MODE ÉDITION ---
      // (Nous ne gérons que M3U pour l'instant)
      const updatedProfile: M3UProfile = {
        ...(editingProfile as M3UProfile),
        name: name,
        url: url,
      };
      editProfile(updatedProfile);
      Alert.alert("Succès", `Profil "${name}" mis à jour.`);
    } else {
      // --- MODE AJOUT ---
      const newM3UProfile: M3UProfile = {
        id: Date.now().toString(),
        name,
        type: 'm3u',
        url,
      };
      addProfile(newM3UProfile);
    }
    
    // Réinitialiser le formulaire
    cancelEdit();
  };
  
  // Fonction pour charger le formulaire d'édition
  const startEditing = (profile: IPTVProfile) => {
    // On ne peut éditer que des M3U pour l'instant
    if (profile.type === 'm3u') {
      setEditingProfile(profile);
      setName(profile.name);
      setUrl(profile.url);
    } else {
      Alert.alert("Non supporté", "L'édition des profils Xtream/Stalker n'est pas encore implémentée.");
    }
  };

  // Fonction pour annuler l'édition
  const cancelEdit = () => {
    setEditingProfile(null);
    setName('');
    setUrl('');
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

  // Rendu de chaque item de la liste
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
        
        {/* --- NOUVEAU BOUTON "ÉDITER" --- */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => startEditing(item)}
        >
          <Text style={styles.actionButtonText}>Éditer</Text>
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
      
      {/* --- FORMULAIRE DYNAMIQUE --- */}
      <Text style={styles.title}>
        {editingProfile ? "Modifier le Profil" : "Ajouter un Profil M3U"}
      </Text>
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
      <View style={styles.formButtons}>
        <Button 
          title={editingProfile ? "Sauvegarder" : "Ajouter"} 
          onPress={handleSubmit} 
        />
        {/* Si on est en mode édition, montrer un bouton "Annuler" */}
        {editingProfile && (
          <Button 
            title="Annuler" 
            onPress={cancelEdit} 
            color="#FF3B30"
          />
        )}
      </View>

      <View style={styles.divider} />
      <Text style={styles.title}>Profils Sauvegardés</Text>
      {/* ... (le reste du composant est identique) ... */}
      
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

// --- STYLES MIS À JOUR ---
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
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
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
    marginRight: 5,
  },
  profileName: {
    color: '#FFF',
    fontSize: 16,
    flexShrink: 1, // Permet au texte de se réduire
  },
  profileType: {
    color: '#AAA',
    fontSize: 12,
  },
  profileActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 10, // Réduit pour plus de place
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 5, // Réduit
    justifyContent: 'center',
  },
  loadButton: {
    backgroundColor: '#007AFF',
  },
  editButton: {
    backgroundColor: '#FF9500', // Orange
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12, // Réduit
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