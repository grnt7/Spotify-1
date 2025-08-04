import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import React, { useRef, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { BsFillVolumeDownFill } from "react-icons/bs";
import useSongInfo from '../hooks/useSongInfo';
import { TbSwitch2 } from "react-icons/tb";
import { SlLoop } from "react-icons/sl";
import { FaForwardStep } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { FaPauseCircle } from "react-icons/fa";
import { FaBackwardStep } from "react-icons/fa6";
// --- Jotai Atoms (src/atoms/playerAtoms.js) ---
// It's crucial that these are defined ONCE and imported everywhere.
// Keeping them here for demonstration, but they should be in a separate file.
export const defaultTrack = {
  id: null,
  title: 'No song playing',
  artist: 'N/A',
  albumArt: 'https://placehold.co/64x64/222222/cccccc?text=No+Art',
  audioUrl: '', // This should ideally be a valid audio stream URL
  album: {
  images: [{ url: 'https://placehold.co/64x64/222222/cccccc?text=No+Art' }]
  }
};

export const currentTrackAtom = atom(defaultTrack);
export const isPlayingAtom = atom(false);
export const volumeAtom = atom(0.5);
export const playlistAtom = atom([]);
export const currentPlaybackPositionAtom = atom(0);

// --- Player Component (src/components/Player.js) ---
function Player() {
  const spotifyApi = useSpotify();
  const {data: session} = useSession();
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom); // This atom holds the overall track data
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [volume, setVolume] = useAtom(volumeAtom);

  const audioRef = useRef(null);

  // 1. Destructure the result from useSongInfo
  //    The 'songData' variable will now hold the actual song object fetched by the hook.
  //    We also get loading and error states for better UI feedback.
  const { songInfo: fetchedSongData, loading, error } = useSongInfo();

  // Use the fetched song data if available, otherwise fall back to currentTrack or default.
  // This prioritizes the data fetched by useSongInfo for display.
  // For the actual audio source, we use currentTrack.audioUrl
  const displaySongInfo = fetchedSongData || currentTrack || defaultTrack;
  const audioSourceUrl = currentTrack.audioUrl; // This is the crucial part for actual playback

  // Effect to handle playing/pausing and changing the track source
  useEffect(() => {
    console.log("Player useEffect: Triggered.");
    console.log("Player useEffect: current audioRef.current:", audioRef.current);
    console.log("Player useEffect: audioSourceUrl:", audioSourceUrl);
    console.log("Player useEffect: isPlaying state:", isPlaying);

    if (audioRef.current) {
      const audio = audioRef.current;
      const currentAudioSrc = audio.src;

      // Handle audio errors for debugging
      audio.onerror = (e) => {
        console.error("Audio Element Error:", e);
        console.error("Audio error code:", e.target.error.code);
        alert(`Audio Error: Code ${e.target.error.code}. Check console.`);
        setIsPlaying(false); // Stop trying to play if error occurs
      };

      // Scenario 1: A new track URL is provided and it's different from the current one
      if (audioSourceUrl && audioSourceUrl !== currentAudioSrc) {
        console.log("Player useEffect: New audio URL detected. Loading new track.");
        audio.src = audioSourceUrl;
        audio.load(); // Request the browser to load the new audio source

        if (isPlaying) {
          console.log("Player useEffect: New track, attempting to play...");
          audio.play()
            .then(() => console.log("Player useEffect: Playback started successfully for new track."))
            .catch(e => {
              console.error("Player useEffect: Error playing new audio:", e);
              if (e.name === "NotAllowedError") {
                console.warn("Autoplay was prevented. User interaction (e.g., a click) is required to start playback.");
              }
            });
        } else {
            console.log("Player useEffect: New track loaded but not playing (isPlaying is false).");
        }
      }
      // Scenario 2: Same track, but isPlaying state has changed (e.g., user clicked play/pause)
      else if (audioSourceUrl === currentAudioSrc) {
        if (isPlaying) {
          console.log("Player useEffect: Same track, isPlaying is true. Attempting to play/resume.");
          audio.play()
            .then(() => console.log("Player useEffect: Playback resumed successfully."))
            .catch(e => {
              console.error("Player useEffect: Error resuming audio:", e);
              if (e.name === "NotAllowedError") {
                console.warn("Autoplay was prevented on resume. User interaction required.");
              }
            });
        } else {
          console.log("Player useEffect: Same track, isPlaying is false. Pausing audio.");
          audio.pause();
        }
      }
      // Scenario 3: No specific audio URL, but isPlaying state might have changed for default track
      else {
        if (isPlaying) {
            console.log("Player useEffect: No specific audio URL, but isPlaying is true. (Likely default state)");
        } else {
            console.log("Player useEffect: No specific audio URL, isPlaying is false. Audio paused.");
            audio.pause(); // Ensure paused if no song loaded
        }
      }
    } else {
      console.warn("Player useEffect: audioRef.current is null. Audio element not ready.");
    }
  }, [audioSourceUrl, isPlaying]); // Depend on audioSourceUrl and isPlaying to re-run

  // Effect to handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      console.log(`Player useEffect: Volume set to ${volume}`);
    }
  }, [volume]);

  // Function to handle play/pause
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause()
          setIsPlaying(false);
        } else {
          spotifyApi.play();
          setIsPlaying(true);
        }
      });
    // setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    // console.log(`Player: Playback toggled via UI. New isPlaying state will be: ${!isPlaying}`);
  };

  // Function to handle volume change
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  // Ensure album art URL is safely accessed
  const albumArtUrl = displaySongInfo.album?.images?.[0]?.url || defaultTrack.albumArt;

  // --- DEBUGGING: Log songInfo and albumArtUrl ---
  console.log("Player Component - Render: displaySongInfo:", displaySongInfo);
  console.log("Player Component - Render: albumArtUrl:", albumArtUrl);
  
  // --- END DEBUGGING ---

  // Handle loading and error states for the UI
  if (loading) {
    return <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 text-center">Loading song details...</div>;
  }

  if (error) {
    return <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-red-500 p-4 text-center">Error loading song: {error.message}</div>;
  }

  return (
    <div className="h-24 fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex items-center justify-between shadow-lg rounded-t-lg">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />

      {/* Left section: Album Art and Song Info*/ }
      <div className="flex items-center space-x-4">
        <img
          className="h-16 w-16 rounded-lg shadow-md"
          src={albumArtUrl} // Use the safely accessed URL
          alt={displaySongInfo.title || "Album Art"}
          onError={(e) => {
            console.error("Error loading album art:", e.target.src);
            e.target.src = defaultTrack.albumArt; // Fallback for broken images
          }}
          
        />
      
        <div>
          <h3 className=" flex font-bold text-sm text-white">{displaySongInfo.title}</h3>
          <p className="text-sm text-gray-400">{displaySongInfo.artist}</p>
        </div>
      </div>
 
      {/* Center section: Controls (Switch, Play/Pause, Next/Previous) */}
      <div className="flex items-center justify-evenly space-x-10">
        <div>
          < TbSwitch2 className="button  text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"/>
          </div>
        {/* Previous button*/ }
        <div className= "button  text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
            <FaBackwardStep  />
          </div>
        {/* <button className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-2"> }
          { <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> }
            {/* <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/> }
          {/* </svg> }
        {/* </button> }

        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          className=" shadow-md transform hover:scale-105 cursor-pointer"
        >
          {isPlaying ? (
            <FaPauseCircle  className="w-10 h-10 hover:text-xl" /> // Use FontAwesome for pause icon
             // Pause icon
          ) : (
            <FaPlayCircle className="w-10 h-10 cursor-pointer " /> // Use FontAwesome for play icon
            // <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
             // <path d="M8 5v14l11-7z"/>
           // </svg> // Play icon
          )}
        </button>
          
        {/* Next button */}
        <div>
          <FaForwardStep  className="button  text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"/>
        </div>
        
        {/* <button className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-2"> */}
          {/* <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> */}
            {/* <path d="M18 6l-8.5 6 8.5 6V6zM6 6v12h2V6H6z"/> */}
          {/* </svg> */} 
        {/* </button> */}
         <div>
        < SlLoop className="button rounded-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"/>
      </div>
      </div>
     

      {/* Right section: Volume Control (example using Tailwind for styling)*/ }
      <div className="flex items-center space-x-2 w-48 hidden md:flex">
        <span className="text-gray-400">
            <BsFillVolumeDownFill className="w-6 h-6"/>
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-green-500 rounded-lg appearance-none cursor-pointer range-lg"
                     
        />
      </div>
    </div>
  );
}

export default Player;

