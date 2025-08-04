// src/components/Player.js
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { atom, useAtom } from 'jotai';
import { BsFillVolumeDownFill, BsFillVolumeUpFill } from "react-icons/bs";
import useSongInfo from '../hooks/useSongInfo';
import { TbSwitch2 } from "react-icons/tb";
import { SlLoop } from "react-icons/sl";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";


// --- Jotai Atoms (src/atoms/playerAtoms.js) ---
// It's a good practice to define these in a separate file and import them.
export const defaultTrack = {
  id: null,
  title: 'No song playing',
  artist: 'N/A',
  albumArt: 'https://placehold.co/64x64/222222/cccccc?text=No+Art',
  audioUrl: '',
  album: {
    images: [{ url: 'https://placehold.co/64x64/222222/cccccc?text=No+Art' }]
  }
};

export const currentTrackAtom = atom(defaultTrack);
export const isPlayingAtom = atom(false);
export const volumeAtom = atom(50); // Initialize volume to a sensible default
export const playlistAtom = atom([]);
export const currentPlaybackPositionAtom = atom(0);


// --- Debounce Hook (src/hooks/useDebounce.js) ---
// This hook prevents too many API calls while dragging the volume slider.
// It should be placed in its own file.
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clears the timeout if value changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run if value or delay changes

  return debouncedValue;
}


// --- Player Component ---
function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [volume, setVolume] = useAtom(volumeAtom);
  
  const { songInfo: fetchedSongData, loading, error } = useSongInfo();
  const displaySongInfo = fetchedSongData || currentTrack || defaultTrack;
  const albumArtUrl = displaySongInfo.album?.images?.[0]?.url || defaultTrack.albumArt;

  // Use the debounce hook on the volume state
  const debouncedVolume = useDebounce(volume, 500); // 500ms delay

  // useEffect to handle volume changes and call the Spotify API
  useEffect(() => {
    // Only proceed if we have a valid access token and a valid debounced volume
    if (session && spotifyApi.getAccessToken()) {
      // The Spotify API expects a volume value between 0 and 100
      spotifyApi.setVolume(debouncedVolume).catch(err => {
        console.error("Error setting volume via Spotify API:", err);
      });
    }
  }, [debouncedVolume, session, spotifyApi]); // Dependencies ensure this runs when volume changes

  // NEW: Effect to periodically sync playback state with the Spotify API
  // This is a more robust way to handle play/pause state.
  useEffect(() => {
    let intervalId;
    const fetchPlaybackState = () => {
      if (spotifyApi.getAccessToken()) {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
          if (data.body && data.body.is_playing !== isPlaying) {
            setIsPlaying(data.body.is_playing);
          }
        }).catch(err => {
          console.error("Error fetching playback state:", err);
        });
      }
    };
    
    // Fetch state initially and then every 3 seconds
    fetchPlaybackState();
    intervalId = setInterval(fetchPlaybackState, 3000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [session, spotifyApi, isPlaying, setIsPlaying]);

  // Function to handle play/pause
  const handlePlayPause = () => {
    // Simply toggle playback based on the current state
    if (isPlaying) {
      spotifyApi.pause()
        .catch(err => console.error("Error pausing track:", err));
    } else {
      spotifyApi.play()
        .catch(err => console.error("Error playing track:", err));
    }
    // The useEffect above will handle the state update after the API confirms
  };



  // Function to handle volume changes from the input slider
  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };
  
  return (
    <div className="h-24 fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex items-center justify-between shadow-lg rounded-t-lg">
      {/* Left section: Album Art and Song Info*/ }
      <div className="flex items-center space-x-4">
        <img
          className="h-10 w-10 rounded-lg shadow-md"
          src={albumArtUrl}
          alt={displaySongInfo.title || "Album Art"}
          onError={(e) => {
            console.error("Error loading album art:", e.target.src);
            e.target.src = defaultTrack.albumArt;
          }}
        />
        <div>
          <h3 className="flex font-bold text-sm text-white">{displaySongInfo.title}</h3>
          <p className="text-sm text-gray-400">{displaySongInfo.artist}</p>
        </div>
      </div>
 
      {/* Center section: Controls */}
      <div className="flex items-center justify-evenly space-x-10">
        <div>
          <TbSwitch2 className="button text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"/>
        </div>
        {/* Previous button */}
        <div className="button text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
          <FaBackwardStep />
        </div>
        {/* Play/Pause button */}
        <button
          // onClick={handlePlayPause}
          className="shadow-md transform hover:scale-105 cursor-pointer"
        >
          {isPlaying ? (
            <FaCirclePause onClick={handlePlayPause} className="w-10 h-10 hover:text-xl" />
          ) : (
            <FaCirclePlay onClick={handlePlayPause} className="w-10 h-10 cursor-pointer" />
          )}
        </button>
        {/* Next button */}
        <div>
          <FaForwardStep className="button text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"/>
        </div>
        <div>
          <SlLoop className="button rounded-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"/>
        </div>
      </div>

      {/* Right section: Volume Control */}
      <div className="hidden md:flex items-center space-x-3 md:space-x-4 justify-end pr-5 ">
        <BsFillVolumeDownFill 
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button w-6 h-6"
        />
        <input 
          className="w-14 md:w-28 accent-green-500 "
         
          type="range" 
          value={volume}
          onChange={handleVolumeChange} // Use the dedicated handler
          min={0} 
          max={100}
        />
        <BsFillVolumeUpFill 
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button w-6 h-6" 
        />
      </div>
    </div>
  );
}

export default Player;

  