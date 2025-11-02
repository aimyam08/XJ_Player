// context/IPTVContext.tsx (Complet)

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  IPTVContextType, 
  IPTVProfile, 
  Channel, 
  Movie, 
  Series,
  Season,
  Episode
} from '../types';

const seriesRegex = /(.*?) S(\d+) E(\d+)/i;
const PROFILES_STORAGE_KEY = 'IPTV_PROFILES';

const IPTVContext = createContext<IPTVContextType | undefined>(undefined);

export const IPTVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<IPTVProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<IPTVProfile | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [currentStream, setCurrentStream] = useState<{ url: string; id: string; } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ... (useEffect / loadProfilesFromStorage est identique)
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
  
  // --- NOUVELLE FONCTION "EDIT" ---
  const editProfile = async (updatedProfile: IPTVProfile) => {
    try {
      const newProfiles = profiles.map(profile => 
        profile.id === updatedProfile.id ? updatedProfile : profile
      );
      setProfiles(newProfiles);
      await AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newProfiles));

      // Si le profil modifié est celui en cours, on le met à jour
      if (currentProfile?.id === updatedProfile.id) {
        setCurrentProfile(updatedProfile);
      }
    } catch (e) {
      console.error("Failed to edit profile", e);
    }
  };
  // --- FIN DE LA NOUVELLE FONCTION ---

  const loadProfile = async (profile: IPTVProfile) => {
    setIsLoading(true);
    setError(null);
    setChannels([]);
    setMovies([]);
    setSeries([]);
    
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
      console.error("Échec du chargement du profil:", e);
      setError(e.message || "Erreur inconnue"); 
    } finally {
      setIsLoading(false);
    }
  };

  const unloadProfile = () => {
    setCurrentProfile(null);
    setChannels([]);
    setMovies([]);
    setSeries([]);
    setError(null);
    setCurrentStream(null);
  };

  const loadM3U = async (url: string) => {
    // ... (la fonction loadM3U est identique)
    let m3uContent = '';
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erreur réseau: ${response.status}`);
      m3uContent = await response.text();
    } catch (fetchError: any) {
      throw new Error(`Impossible de télécharger la liste : ${fetchError.message}`);
    }

    try {
      const { channels, movies, series } = parseM3U(m3uContent);
      setChannels(channels);
      setMovies(movies);
      setSeries(series);
      
      if (channels.length === 0 && movies.length === 0 && series.length === 0) {
        throw new Error("Le fichier M3U est valide mais ne contient aucun média.");
      }
    } catch (parseError: any) {
      console.error("Erreur de parsing M3U:", parseError);
      throw new Error(`Erreur de format M3U : ${parseError.message}`);
    }
  };

  const parseM3U = (m3uContent: string): { channels: Channel[], movies: Movie[], series: Series[] } => {
    // ... (la fonction parseM3U est identique)
    const lines = m3uContent.split('\n');
    const channels: Channel[] = [];
    const movies: Movie[] = [];
    const seriesMap = new Map<string, Series>();
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
          currentItemInfo = { name: name.trim(), tvgId: attributes.match(tvgIdRegex)?.[1], logo: attributes.match(tvgLogoRegex)?.[1], group: attributes.match(groupTitleRegex)?.[1] || 'Inconnu' };
        }
      } else if ((line.startsWith('http://') || line.startsWith('https://')) && currentItemInfo) {
        const url = line.trim();
        if (url.includes('/movie/')) {
          movies.push({ id: url, name: currentItemInfo.name, streamUrl: url, cover: currentItemInfo.logo, group: currentItemInfo.group });
        } 
        else if (url.includes('/series/')) {
          const match = currentItemInfo.name.match(seriesRegex);
          let seriesName: string, seasonNum: number, episodeNum: number, episodeName: string;
          
          if (match) {
            seriesName = match[1].trim();
            seasonNum = parseInt(match[2]);
            episodeNum = parseInt(match[3]);
            episodeName = `Épisode ${episodeNum}`;
          } else {
            seriesName = currentItemInfo.name.split(/ S\d+/i)[0].trim();
            if (seriesName === "") { seriesName = currentItemInfo.name; }
            seasonNum = 1;
            episodeNum = (seriesMap.get(seriesName)?.seasons[0]?.episodes.length || 0) + 1;
            episodeName = currentItemInfo.name;
          }

          if (!seriesMap.has(seriesName)) {
            seriesMap.set(seriesName, { id: seriesName, name: seriesName, cover: currentItemInfo.logo, group: currentItemInfo.group, seasons: [] });
          }
          const currentSeries = seriesMap.get(seriesName)!;

          let currentSeason = currentSeries.seasons.find(s => s.seasonNumber === seasonNum);
          if (!currentSeason) {
            currentSeason = { id: `${seriesName}-S${seasonNum}`, name: `Saison ${seasonNum}`, seasonNumber: seasonNum, episodes: [] };
            currentSeries.seasons.push(currentSeason);
            currentSeries.seasons.sort((a, b) => a.seasonNumber - b.seasonNumber);
          }
          
          currentSeason.episodes.push({ id: url, name: episodeName, streamUrl: url, episodeNumber: episodeNum });
          currentSeason.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);

        } else {
          channels.push({ id: currentItemInfo.tvgId || url, name: currentItemInfo.name, url: url, logo: currentItemInfo.logo, group: currentItemInfo.group, tvgId: currentItemInfo.tvgId });
        }
        currentItemInfo = null;
      }
    }
    const series = Array.from(seriesMap.values());
    return { channels, movies, series };
  };
  
  const playStream = (stream: { url: string; id: string; }) => {
    setCurrentStream(stream);
  };
  
  return (
    <IPTVContext.Provider
      value={{
        profiles,
        currentProfile,
        channels,
        movies,
        series,
        currentStream,
        isLoading,
        error,
        addProfile,
        removeProfile,
        editProfile, // <-- NOUVELLE FONCTION AJOUTÉE
        loadProfile,
        unloadProfile,
        setCurrentProfile, // <-- FONCTION AJOUTÉE
        playStream,
      }}
    >
      {children}
    </IPTVContext.Provider>
  );
};

export const useIPTV = () => {
  const context = useContext(IPTVContext);
  if (!context) {
    throw new Error('useIPTV() doit être utilisé à l\'intérieur d\'un IPTVProvider');
  }
  return context;
};