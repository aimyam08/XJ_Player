// types/index.ts (Complet)

/**
 * Représente une chaîne (Live TV)
 */
export interface Channel {
  id: string;
  name: string;
  url: string;
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
  episodeNumber: number;
}

/**
 * Représente une seule saison
 */
export interface Season {
  id: string;
  name: string;
  seasonNumber: number;
  episodes: Episode[];
}

/**
 * Représente une série complète
 */
export interface Series {
  id: string;
  name: string;
  cover?: string;
  group: string;
  seasons: Season[];
}

// --- GESTION DES PROFILS (Identique) ---
export interface M3UProfile { id: string; name: string; type: 'm3u'; url: string; epgUrl?: string; }
export interface XtreamProfile { id: string; name: string; type: 'xtream'; serverUrl: string; username: string; password?: string; }
export interface StalkerProfile { id: string; name: string; type: 'stalker'; portalUrl: string; macAddress: string; }
export type IPTVProfile = M3UProfile | XtreamProfile | StalkerProfile;


// --- CONTEXTE (Mis à jour) ---
export type IPTVContextType = {
  profiles: IPTVProfile[];
  currentProfile: IPTVProfile | null;
  
  channels: Channel[];
  movies: Movie[];
  series: Series[];
  
  currentStream: { url: string; id: string; } | null;
  
  isLoading: boolean;
  error: string | null;

  addProfile: (profile: IPTVProfile) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
  editProfile: (updatedProfile: IPTVProfile) => Promise<void>; // <-- NOUVELLE LIGNE
  loadProfile: (profile: IPTVProfile) => Promise<void>;
  unloadProfile: () => void;
  setCurrentProfile: (profile: IPTVProfile | null) => void; // (Maintenant inclus)
  
  playStream: (stream: { url: string; id: string; }) => void;
};