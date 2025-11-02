import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  IPTVContextType, 
  IPTVProfile, 
  Channel, 
  Movie, 
  Episode
} from '../types';

const PROFILES_STORAGE_KEY = 'IPTV_PROFILES';

const IPTVContext = createContext<IPTVContextType | undefined>(undefined);

export const IPTVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<IPTVProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<IPTVProfile | null>(null);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfilesFromStorage = async () => {
      try {
        const profilesJson = await AsyncStorage.getItem(PROFILES_STORAGE_KEY);
        if (profilesJson) {
          try {
            const storedProfiles = JSON.parse(profilesJson);
            setProfiles(storedProfiles);
          } catch (parseError) {
            console.error("Données de profil corrompues, nettoyage...", parseError);
            await AsyncStorage.removeItem(PROFILES_STORAGE_KEY);
            setProfiles([]);
          }
        }
      } catch (e) {
        console.error("Échec du chargement des profils depuis le stockage", e);
      }
    };
    loadProfilesFromStorage();
  }, []);

  const addProfile = async (profile: IPTVProfile) => {
    try {
      const newProfiles = [...profiles, profile];
      setProfiles(newProfiles);
      await AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newProfiles));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  const removeProfile = async (id: string) => {
    try {
      const newProfiles = profiles.filter(profile => profile.id !== id);
      setProfiles(newProfiles);
      await AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newProfiles));
      if (currentProfile?.id === id) {
        unloadProfile();
      }
    } catch (e) {
      console.error("Failed to remove profile", e);
    }
  };

  const loadProfile = async (profile: IPTVProfile) => {
    setIsLoading(true);
    setError(null);
    setChannels([]);
    setMovies([]);
    setEpisodes([]);
    
    try {
      if (profile.type === 'm3u') {
        await loadM3U(profile.url);
      } 
      else if (profile.type === 'xtream') {
        console.warn("Chargement Xtream non implémenté");
      }
      else if (profile.type === 'stalker') {
        console.warn("Chargement Stalker non implémenté");
      }
      setCurrentProfile(profile);
    } catch (e: any) {
      console.error("Failed to load profile:", e);
      setError(e.message || "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const unloadProfile = () => {
    setCurrentProfile(null);
    setChannels([]);
    setMovies([]);
    setEpisodes([]);
    setError(null);
  };

  const loadM3U = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur réseau: ${response.status}`);
    }
    const m3uContent = await response.text();
    const { channels, movies, episodes } = parseM3U(m3uContent);
    setChannels(channels);
    setMovies(movies);
    setEpisodes(episodes);
    
    if (channels.length > 0) {
      setCurrentChannel(channels[0]);
    }
  };

  const parseM3U = (m3uContent: string): { channels: Channel[], movies: Movie[], episodes: Episode[] } => {
    const lines = m3uContent.split('\n');
    const channels: Channel[] = [];
    const movies: Movie[] = [];
    const episodes: Episode[] = [];
    let currentItemInfo: { name: string, logo?: string, group: string, tvgId?: string } | null = null;
    
    const infoRegex = /#EXTINF:[-0-9]+(.*),(.*)/; 

    const tvgIdRegex = /tvg-id="([^"]*)"/;
    const tvgLogoRegex = /tvg-logo="([^"]*)"/;
    const groupTitleRegex = /group-title="([^"]*)"/;

    for (const line of lines) {
      if (line.startsWith('#EXTINF:')) {
        const infoMatch = line.match(infoRegex);
        if (infoMatch) {
          const attributes = infoMatch[1] || '';
          const name = infoMatch[2] || 'Unknown';
          currentItemInfo = { name: name.trim(), tvgId: attributes.match(tvgIdRegex)?.[1], logo: attributes.match(tvgLogoRegex)?.[1], group: attributes.match(groupTitleRegex)?.[1] || 'General' };
        }
      } else if ((line.startsWith('http://') || line.startsWith('https://')) && currentItemInfo) {
        const url = line.trim();
        if (url.includes('/movie/')) {
          movies.push({ id: url, name: currentItemInfo.name, streamUrl: url, cover: currentItemInfo.logo, group: currentItemInfo.group });
        } else if (url.includes('/series/')) {
          episodes.push({ id: url, name: currentItemInfo.name, streamUrl: url, cover: currentItemInfo.logo, group: currentItemInfo.group });
        } else {
          channels.push({ id: currentItemInfo.tvgId || url, name: currentItemInfo.name, url: url, logo: currentItemInfo.logo, group: currentItemInfo.group, tvgId: currentItemInfo.tvgId });
        }
        currentItemInfo = null;
      }
    }
    return { channels, movies, episodes };
  };
  
  return (
    <IPTVContext.Provider
      value={{
        profiles,
        currentProfile,
        channels,
        movies,
        episodes,
        currentChannel,
        isLoading,
        error,
        addProfile,
        removeProfile,
        loadProfile,
        unloadProfile,
        setCurrentProfile,
        setCurrentChannel,
      }}
    >
      {children}
    </IPTVContext.Provider>
  );
};

export const useIPTV = () => {
  const context = useContext(IPTVContext);
  if (!context) {
    throw new Error('useIPTV must be used within an IPTVProvider');
  }
  return context;
};