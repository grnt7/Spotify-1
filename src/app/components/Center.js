'use client';
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState} from "react";
import { useAtomValue, useSetAtom} from 'jotai';

import { 
  currentTrackAtom, 
  isPlayingAtom, 
  deviceIdAtom // Get the active player device
} from '../../../atoms/playerAtoms';

import {
  playlistIdState,
  spotifyApiState
} from '../../../atoms/playlistAtom';
import { shuffle } from "lodash";
import useSpotify from '../hooks/useSpotify';
import { millisToMinutesAndSeconds } from "./time";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500"
];

function Center() {
  const spotifyApi = useSpotify();
  const setSpotifyApiAtom = useSetAtom(spotifyApiState);

  const setCurrentTrack = useSetAtom(currentTrackAtom);
  const setIsPlaying = useSetAtom(isPlayingAtom);
  const currentTrack = useAtomValue(currentTrackAtom);
  const deviceId = useAtomValue(deviceIdAtom); // Get the current active device ID

  const [localPlaylist, setLocalPlaylist] = useState(null);
  const [color, setColor] = useState('');
  
  const {data: session} = useSession();
  const playlistId = useAtomValue(playlistIdState);

  // Set the spotifyApi instance in the Jotai atom.
  useEffect(() => {
    if (spotifyApi) {
      setSpotifyApiAtom(spotifyApi);
      console.log("Center: Spotify API instance set in Jotai atom.");
    }
  }, [spotifyApi, setSpotifyApiAtom]);

  // This effect will now only run when the API instance, playlistId, AND the session object are ready.
  // Using 'session' as the dependency ensures the array size is constant.
  useEffect(() => {
    console.log("Center - Fetching Effect triggered. spotifyApi:", !!spotifyApi, "playlistId:", playlistId, "session:", !!session);

    // Added a check to ensure playlistId is a non-empty string.
    if (spotifyApi && playlistId && session) {
      console.log(`Center: Attempting to fetch playlist with ID: ${playlistId}`);
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setLocalPlaylist(data.body);
          console.log("Center: Successfully fetched playlist:", data.body.name);
        })
        .catch((error) => {
          console.error("Center.js: Error fetching playlist:", error);
          setLocalPlaylist(null);
        });
    } else {
      setLocalPlaylist(null);
      console.log("Center: Waiting for a playlist to be selected or session to load.");
    }
  }, [spotifyApi, playlistId, session]);

  useEffect(()  => {
    console.log('useEffect for color ran. Playlist ID:', playlistId);
    if (playlistId) {
      setColor(shuffle(colors).pop());
    }
  }, [playlistId]);

  const playTrack = async (track) => {
    setCurrentTrack({
      id: track.id,
      title: track.name,
      artist: track.artists?.[0]?.name,
      albumArt: track.album.images?.[0]?.url,
      album: track.album,
      uri: track.uri,
    });
    setIsPlaying(true);
    
    if (spotifyApi && deviceId && track.uri) {
      try {
        await spotifyApi.play({
          uris: [track.uri],
          device_id: deviceId,
        });
        console.log(`Center: Playback started for ${track.name} on device ${deviceId}`);
      } catch (error) {
        console.error("Center.js: Error playing track:", error);
      }
    } else {
      console.warn("Center.js: Cannot play track. Missing spotifyApi, deviceId, or track URI.");
    }
  };

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide text-white">
      <header className="absolute top-5 right-8">
        <div 
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-75 cursor-pointer rounded-full p-1 pr-2 w-35 text-white"
          onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
        >
          <img 
            className="rounded-full w-10 h-10" 
            src={session?.user.image} 
            alt="" 
          />
          <h2>{session?.user.name}</h2>
          <span className="text-xl">▼</span>
        </div>
      </header>
      
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
        {localPlaylist ? (
          <>
            {localPlaylist.images?.[0]?.url && (
              <img
                className="h-44 w-44 shadow-2xl"
                src={localPlaylist.images[0].url}
                alt={localPlaylist.name || "Playlist image"}
              />
            )}
            <div>
              <p className="text-sm font-bold">PLAYLIST</p>
              <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                {localPlaylist.name}
              </h1>
            </div>
          </>
        ) : (
          <div className="text-xl">
            {playlistId ? "Loading Playlist Details..." : "Please select a playlist from the sidebar."}
          </div>
        )}
      </section>

      <div className="px-8 flex flex-col space-y-1 text-white overflow-y-scroll scrollbar-hide h-screen pb-24">
        {localPlaylist?.tracks?.items?.length > 0 ? (
          localPlaylist.tracks.items.map((trackItem, i) => {
            if (!trackItem?.track) {
              console.warn(`Center.js: Skipping track item at index ${i} because track data is missing.`);
              return <div key={`empty-${i}`}></div>; 
            }

            const track = trackItem.track;
            
            return (
              <div
                key={track.id || `track-${i}`}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-center py-4 px-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <div className="flex items-center space-x-4">
                  <p className="text-right text-gray-400 w-8">{i + 1}</p>
                  {track.album?.images?.[0]?.url && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name || 'Album art'}
                      className="h-10 w-10 rounded-sm"
                    />
                  )}
                  <div className="flex-grow">
                    <p className="font-semibold">{track.name}</p>
                    <p className="text-sm text-gray-400 truncate w-40">{track.artists?.[0]?.name || 'Unknown Artist'}</p>
                  </div>
                </div>
                
                <div className="hidden sm:block text-sm text-gray-400">
                  <p className="truncate">{track.album?.name || 'Unknown Album'}</p>
                </div>

                <div className="flex items-center justify-end">
                  <p className="text-sm text-gray-400">{millisToMinutesAndSeconds(track.duration_ms)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 mt-10">
            {playlistId ? "This playlist has no tracks or is currently loading." : "Please select a playlist from the sidebar."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Center;
