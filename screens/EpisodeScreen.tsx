// screens/EpisodeScreen.tsx (Complet)

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// --- CORRECTION ICI ---
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Episode } from '../types';
import { useIPTV } from '../context/IPTVContext';

type EpisodeScreenRouteProp = RouteProp<RootStackParamList, 'Episode'>;
type EpisodeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Episode'>;

const EpisodeScreen = () => {
  const route = useRoute<EpisodeScreenRouteProp>();
  const navigation = useNavigation<EpisodeScreenNavigationProp>();
  const { playStream } = useIPTV();
  
  const { season } = route.params;

  const handleEpisodePress = (episode: Episode) => {
    console.log('CLIC SUR ÉPISODE:', episode.name); 
    playStream({ url: episode.streamUrl, id: episode.id });
    navigation.navigate('Player');
  };

  const renderItem = ({ item }: { item: Episode }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => handleEpisodePress(item)}
    >
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={season.episodes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  item: { padding: 15 },
  name: { color: '#FFF', fontSize: 16 },
  separator: { height: 1, backgroundColor: '#333' },
});

export default EpisodeScreen;