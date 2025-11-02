// components/SeriesList.tsx (Complet)

import React from 'react';
import { 
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator
} from 'react-native';
import { useIPTV } from '../context/IPTVContext';
// --- CORRECTION ICI ---
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Series } from '../types';

const defaultLogo = require('../assets/icon.png'); 

type SeriesListNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const SeriesList = () => {
  const { series, isLoading } = useIPTV();
  const navigation = useNavigation<SeriesListNavigationProp>();

  const handleSeriesPress = (series: Series) => {
    navigation.navigate('Season', { series: series });
  };

  const groupedData = React.useMemo(() => {
    if (series.length === 0) return [];
    
    const groups = series.reduce((acc, series) => {
      const groupTitle = series.group || 'Inconnu';
      if (!acc[groupTitle]) {
        acc[groupTitle] = [];
      }
      acc[groupTitle].push(series);
      return acc;
    }, {} as Record<string, Series[]>);

    return Object.keys(groups).sort().map(title => ({
      title: title,
      data: groups[title]
    }));
  }, [series]);

  const renderItem = ({ item }: { item: Series }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => handleSeriesPress(item)}
    >
      <Image 
        style={styles.logo}
        source={item.cover ? { uri: item.cover } : defaultLogo}
        defaultSource={defaultLogo}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.count}>{item.seasons.length} Saison(s)</Text>
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
  if (series.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Aucune série trouvée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
};
// ... (les styles sont identiques)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { fontSize: 16, fontWeight: 'bold', color: '#FFF', backgroundColor: '#222', padding: 10 },
  centered: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  emptyText: { color: '#888', textAlign: 'center' },
  item: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  logo: { width: 50, height: 75, marginRight: 15, backgroundColor: '#333', borderRadius: 4 },
  info: { flex: 1 },
  name: { color: '#FFF', fontSize: 16 },
  count: { color: '#AAA', fontSize: 12, marginTop: 4 },
  separator: { height: 1, backgroundColor: '#333', marginLeft: 75 },
});

export default SeriesList;