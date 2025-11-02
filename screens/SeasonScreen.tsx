// screens/SeasonScreen.tsx (Complet)

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// --- CORRECTION ICI ---
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Season } from '../types';

type SeasonScreenRouteProp = RouteProp<RootStackParamList, 'Season'>;
type SeasonScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Season'>;

const SeasonScreen = () => {
  const route = useRoute<SeasonScreenRouteProp>();
  const navigation = useNavigation<SeasonScreenNavigationProp>();
  
  const { series } = route.params;

  const handleSeasonPress = (season: Season) => {
    navigation.navigate('Episode', { season: season });
  };

  const renderItem = ({ item }: { item: Season }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => handleSeasonPress(item)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.count}>{item.episodes.length} Épisode(s)</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={series.seasons}
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
  count: { color: '#AAA', fontSize: 12, marginTop: 4 },
  separator: { height: 1, backgroundColor: '#333' },
});

export default SeasonScreen;