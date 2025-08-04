import { atom } from 'jotai';

// Define the default track structure.
export const defaultTrack = {
  id: null,
  title: 'No song playing',
  artist: 'N/A',
  albumArt: 'https://placehold.co/64x64/222222/cccccc?text=No+Art',
  album: {
    images: [{ url: 'https://placehold.co/64x64/222222/cccccc?text=No+Art' }]
  },
  uri: null,
};

// Jotai atoms for the player state.
export const currentTrackAtom = atom(defaultTrack);
export const isPlayingAtom = atom(false);
export const volumeAtom = atom(0.5);
export const currentPlaybackPositionAtom = atom(0);
export const playlistAtom = atom([]);
export const deviceIdAtom = atom(null);

// NEW: Atom to track if the Spotify player is initialized and ready.
export const isPlayerInitializedAtom = atom(false);

