import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native';
import { useIPTV } from '../context/IPTVContext';
import { useNavigation } from '@react-navigation/native';
import { Channel } from '../types';

const defaultLogo = require('../assets/icon.png'); 

const ChannelList = () => {
  const { channels, setCurrentChannel, isLoading, error } = useIPTV();
  const navigation = useNavigation();

  const handleChannelPress = (channel: Channel) => {
    
    console.log('CLIC SUR CHAÎNE:', channel.name); 
    
    setCurrentChannel(channel);
    navigation.navigate('Player');
  };

  const renderItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity 
      style={styles.channelItem} 
      onPress={() => handleChannelPress(item)}
    >
      <Image 
        style={styles.logo}
        source={item.logo ? { uri: item.logo } : defaultLogo}
        defaultSource={defaultLogo}
        resizeMode="contain"
      />
      <View style={styles.channelInfo}>
        <Text style={styles.channelName}>{item.name}</Text>
        <Text style={styles.channelGroup}>{item.group}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  if (channels.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Aucune chaîne trouvée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={channels}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
  },
  channelItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    color: '#FFF',
    fontSize: 16,
  },
  channelGroup: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginLeft: 75,
  },
});

export default ChannelList;