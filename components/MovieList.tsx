// components/MovieList.tsx (Complet)

import React from 'react';
import { 
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator
} from 'react-native';
import { useIPTV } from '../context/IPTVContext';
import { useNavigation } from '@react-navigation/native';
import { Movie } from '../types';

const defaultLogo = require('../assets/icon.png'); 

const MovieList = () => {
  const { movies, playStream, isLoading } = useIPTV();
  const navigation = useNavigation();

  const handleMoviePress = (movie: Movie) => {
    console.log('CLIC SUR FILM:', movie.name); 
    playStream({ url: movie.streamUrl, id: movie.id });
    navigation.navigate('Player');
  };

  // --- TRANSFORMATION DES DONNÉES ---
  const groupedData = React.useMemo(() => {
    if (movies.length === 0) return [];
    
    const groups = movies.reduce((acc, movie) => {
      const groupTitle = movie.group || 'Inconnu';
      if (!acc[groupTitle]) {
        acc[groupTitle] = [];
      }
      acc[groupTitle].push(movie);
      return acc;
    }, {} as Record<string, Movie[]>);

    return Object.keys(groups).sort().map(title => ({
      title: title,
      data: groups[title]
    }));
  }, [movies]);
  // --- FIN DE LA TRANSFORMATION ---

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => handleMoviePress(item)}
    >
      <Image 
        style={styles.logo}
        source={item.cover ? { uri: item.cover } : defaultLogo}
        defaultSource={defaultLogo}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.header}>{title}</Text>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Aucun film trouvé dans ce profil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id + item.streamUrl}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
};

// --- STYLES MIS À JOUR ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: '#222',
    padding: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 75,
    marginRight: 15,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginLeft: 75,
  },
});

export default MovieList;