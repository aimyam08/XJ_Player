/**
 * Représente une chaîne (Live TV)
 */
export interface Channel {
  id: string;
  name: string;
  url: string;      // URL du flux
  logo?: string;
  group: string;
  tvgId?: string;
}

/**
 * Représente un Film (VOD)
 */
export interface Movie {
  id: string;
  name: string;
  streamUrl: string;
  cover?: string;
  group: string;
}

/**
 * Représente un épisode de Série
 */
export interface Episode {
  id: string;
  name: string;
  streamUrl: string;
  cover?: string;
  group: string;
}

// --- GESTION DES PROFILS ---

export interface M3UProfile {
  id: string;
  name: string;
  type: 'm3u';
  url: string;
  epgUrl?: string;
}

export interface XtreamProfile {
  id: string;
  name: string;
  type: 'xtream';
  serverUrl: string;
  username: string;
  password?: string;
}

export interface StalkerProfile {
  id: string;
  name: string;
  type: 'stalker';
  portalUrl: string;
  macAddress: string;
}

export type IPTVProfile = M3UProfile | XtreamProfile | StalkerProfile;


// --- CONTEXTE ---
export type IPTVContextType = {
  profiles: IPTVProfile[];
  currentProfile: IPTVProfile | null;
  
  channels: Channel[];
  movies: Movie[];
  episodes: Episode[]; 
  
  currentChannel: Channel | null;
  
  isLoading: boolean;
  error: string | null;

  addProfile: (profile: IPTVProfile) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
  loadProfile: (profile: IPTVProfile) => Promise<void>;
  setCurrentProfile: (profile: IPTVProfile | null) => void;
  
  setCurrentChannel: (channel: Channel) => void;
};