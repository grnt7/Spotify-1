import { atom } from 'jotai';

// 1. Base atom for the selected playlist ID (Jotai syntax)
// This atom holds the ID string of the currently selected playlist.
export const playlistIdState = atom('37i9dQZF1EId8j8c7q6Z0c'); // Direct default value

// 2. Base atom for the Spotify API instance (Already correct Jotai syntax)
// This atom will hold the authenticated spotify-web-api-node client.
export const spotifyApiState = atom(null);

// 3. Derived atom for the full playlist object (Jotai syntax for async derivation)
// This atom depends on playlistIdState and spotifyApiState to fetch the playlist data.
export const playlistAtom = atom(async (get) => {
  const id = get(playlistIdState);        // Get the current playlist ID from the base atom
  const spotifyApi = get(spotifyApiState); // Get the spotifyApi instance from its atom

  // If no ID is selected or spotifyApi is not yet available, return null
  if (!id || !spotifyApi) {
    return null;
  }

  try {
    // Make the API call to fetch the playlist details
    const data = await spotifyApi.getPlaylist(id);
    return data.body; // Return the fetched playlist data (the full object)
  } catch (error) {
    console.error("Error fetching playlist data in derived atom:", error);
    // Important: Decide how to handle errors. Returning null is common.
    return null;
  }
});



















/*import { atom } from 'jotai';

// Create an atom to hold the playlist ID
export const playlistAtomState = atom({
key: 'playlistAtomState',
default: null,
});

// This will be set by a component (e.g., Center or a parent) that uses useSpotify()
export const spotifyApiState = atom(null); // <--- THIS LINE MUST BE PRESENT AND CORRECTLY SPELLED



 export const playlistIdState = atom({
    key: 'playlistIdState',
    default: '37i9dQZF1EId8j8c7q6Z0c',
    });

   */