import useSpotify from "../hooks/useSpotify"
function Song({order, track }) {
    const spotifyApi = useSpotify();



  return (
    <div>
        <div>
            <p>{order +1}</p>
        </div>
    </div>
  )
}

export default Song


/*import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { currentTrackAtom, isPlayingAtom, deviceIdAtom } from '../atoms/playerAtoms';
import useSpotify from '../hooks/useSpotify';

function Song({ order, track }) {
  // Use useAtom to get the current track and set a new one
  const [, setCurrentTrack] = useAtom(currentTrackAtom);
  const [, setIsPlaying] = useAtom(isPlayingAtom);
  const spotifyApi = useSpotify();
  
  // Use useAtomValue to get the device ID from the Jotai atom. This is crucial for playback.
  const deviceId = useAtomValue(deviceIdAtom);

  const playSong = async () => {
    // Before trying to play, check if the device ID is available.
    // If it's not, the Web Playback SDK is not yet ready.
    if (!deviceId) {
      console.error("Song.js: No active Spotify device found. Cannot play song.");
      // You could add a user-facing notification here as well
      return;
    }
    
    // Set the current track in your global Jotai state
    setCurrentTrack(track.track);

    // Tell the Spotify API to start playing the song
    try {
      await spotifyApi.play({
        uris: [track.track.uri],
        device_id: deviceId, // Pass the device ID to the API
      });
      // Update the playing status in Jotai
      setIsPlaying(true);
    } catch (error) {
      console.error("Song.js: Error playing track:", error);
    }
  };

  return (
    <div 
      className="grid grid-cols-2 text-gray-500 py-4 px-5 rounded-lg cursor-pointer hover:bg-gray-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-10 w-10" src={track.track.album.images[0].url} alt="" />
        <div>
          <p className="w-36 lg:w-64 truncate text-white">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden md:inline w-40">{track.track.album.name}</p>*/
       /* <p>{/* Add duration logic here }</p>
      </div>
    </div>
  );
}

export default Song;*/