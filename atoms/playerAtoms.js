import { atom } from 'jotai';

// Define the default track structure.
export const defaultTrack = {
  id: null,
  title: 'No song playing',
  artist: 'N/A',
  albumArt: 'https://placehold.co/64x64/222222/cccccc?text=No+Art', // Placeholder image
  audioUrl: '',
  album: {
    images: [{ url: 'https://placehold.co/64x64/222222/cccccc?text=No+Art' }]
  }
};

// Jotai atoms, ensuring names match what Center.js imports:
export const currentTrackAtom = atom(defaultTrack); // Exports 'currentTrackAtom'
export const isPlayingAtom = atom(false); // Exports 'isPlayingAtom'
export const volumeAtom = atom(0.5); // Exports 'volumeAtom'
export const currentPlaybackPositionAtom = atom(0); // Exports 'currentPlaybackPositionAtom'

// Other player-related atoms you might need (ensure they are also exported if used elsewhere):
export const playlistAtom = atom([]); // Example: Atom to hold the current queue/playlist
