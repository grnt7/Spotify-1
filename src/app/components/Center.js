'use client';
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {  useSession, signOut } from "next-auth/react";
import { useEffect, useState} from "react";
import { useAtomValue, useSetAtom} from 'jotai'; // <--- IMPORT useAtomValue
//import { playlistIdState } from '../../../atoms/playlistAtom'; // <--- IMPORT your atom (adjust path if necessary)

import { currentTrackAtom, isPlayingAtom } from '../../../atoms/playerAtoms'; // Adjust path if needed


import {
  playlistIdState,
  playlistAtom,       // <--- IMPORT THE DERIVED playlistAtom
  spotifyApiState     // <--- IMPORT spotifyApiState
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



]

function Center() {
    
   const spotifyApi = useSpotify();
    const setSpotifyApiAtom = useSetAtom(spotifyApiState); // Setter for spotifyApiState atom

    // Get the setters for the player atoms
  const setCurrentTrack = useSetAtom(currentTrackAtom);
  const setIsPlaying = useSetAtom(isPlayingAtom);
  const currentTrack = useAtomValue(currentTrackAtom); // Also get the current track to highlight

    // Set the spotifyApi instance in the atom
    useEffect(() => {
        if (spotifyApi) {
            setSpotifyApiAtom(spotifyApi);
            console.log("Center: Spotify API instance set in Jotai atom.");
        }
    }, [spotifyApi, setSpotifyApiAtom]);
  
  
  
    const {data: session} = useSession();
    //const [color,setColor] = useState(null);
   // const [color, setColor] = useState(shuffle(colors).pop()); // Set initial color
    const [color, setColor] = useState('');//fix hydration error
  
  
  
    const playlistId = useAtomValue(playlistIdState); // <--- GET playlistId from Jotai
  //const [playlist, setPlaylist] = useAtom(playlistIdState); // Initialize playlist state
  
    const playlist = useAtomValue(playlistAtom);
 
    console.log("Center - Current playlistId:", playlistId); // Log to verify
    // --- Logging playlistId and playlist object ---
    console.log("Center - Component Render: Current playlistId (from atom):", playlistId);
    console.log("Center - Component Render: Fetched playlist object (from derived atom):", playlist);


useEffect(()  => {
 console.log('useEffect for color ran. Playlist ID:', playlistId);
        if (playlistId) { // Only shuffle and set color if playlistId exists
            setColor(shuffle(colors).pop());
        }
    }, [playlistId]); // This dependency array is correct: re-run when playlistId changes

  //Function to handle clicking on a track
    const playTrack = (track) => {
    // 1. Update the currentTrackAtom with the clicked track's details
    setCurrentTrack({
      id: track.id,
      title: track.name,
      artist: track.artists?.[0]?.name || 'Unknown Artist',
      albumArt: track.album?.images?.[0]?.url || '',
      audioUrl: track.preview_url, // Spotify provides a 30-second preview URL
      album: {
        name: track.album?.name || 'Unknown Album',
        images: track.album?.images || []
      }
    });

    // 2. Set isPlaying to true to start playback
    setIsPlaying(true);
    console.log(`Now playing: ${track.name} by ${track.artists?.[0]?.name}`);
  };




  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide
    text-white" >
      
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 
        opacity-90 hover:opacity-75 cursor-pointer rounded-full 
        p-1 pr-2 w-35  text-white"
         onClick={() => signOut({ callbackUrl: '/api/auth/signin' })} > {/* Added callbackUrl to signOut */}
            <img className="rounded-full w-10 h-10" 
            src={session?.user.image} alt="" 
            />
            <h2>{session?.user.name}</h2>
            <ChevronDownIcon className="h-5 w-5 "/>
            
        </div>
      </header>
      <section
                // Corrected Tailwind classes: `padding-8` to `p-8`, `w-44shadow-2xl` separated
                className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
            >
                {/* THIS IS THE CRUCIAL CONDITIONAL RENDERING BLOCK FOR PLAYLIST DETAILS */}
                {/* Only render this block if 'playlist' object has data (is not null) */}
                {playlist ? (
                    <>
                        {/* Ensure image URL exists before rendering the <img> tag */}
                        {playlist.images?.[0]?.url && ( // Use optional chaining for images array and url
                            <img
                                className="h-44 w-44 shadow-2xl" // Corrected spacing for classes
                                src={playlist.images[0].url} // This line is now safe because 'playlist' is guaranteed not null
                                alt={playlist.name || "Playlist image"} // Add meaningful alt text
                            />
                        )}
                        <div>
                            <p className="text-sm font-bold">PLAYLIST</p>
                            <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                                {playlist.name} {/* This is also safe now */}
                            </h1>
                        </div>
                    </>
                ) : (
                    // Display a loading message or spinner while playlist is null
                    // This will be shown initially and while data is fetching
                    <div className="text-xl">Loading Playlist Details...</div>
                )}
            </section>

            {/* Render tracks from the playlist */}
            {/* This also needs to be conditional on 'playlist' existing */}
            <div className="px-8 flex flex-col space-y-1  text-white  overflow-y-scroll scrollbar-hide
        h-screen">
                {playlist?.tracks?.items.map((trackItem, i) => ( // <-- Use optional chaining here too
                    // Ensure trackItem.track and its properties exist before accessing
                    <div
            key={trackItem.track.id}
            className="flex items-center py-2 hover:bg-gray-800 rounded-lg cursor-pointer" // 'flex items-center' 
             onClick={() => playTrack(trackItem.track)} //this is the key line to play the track: added 26/5/25
        >
                      <p className="text-right text-gray-400 w-8 flex-shrink-0 mr-6">{i + 1}</p> {/* Added w-8 flex-shrink-0 */}
                      {/* 2. Track Image (Album Art) */}
                {/* Only render the image if a URL exists */}
                {trackItem.track.album?.images?.[0]?.url && (
                    <img
                        src={trackItem.track.album.images[0].url}
                        alt={trackItem.track.name || 'Album art'}
                        className="h-10 w-10 mr-4 rounded-sm" // Adjust size (h-10 w-10) and right margin (mr-4) as needed
                    />
                )}
            {/* The space is now created by the fixed width of the number's container.*/}
                        <div  className="grid grid-cols-3  gap-x-4 w-40  flex-grow l-auto md:ml-0">
                        {trackItem.track.name} - {trackItem.track.artists?.[0]?.name || 'Unknown Artist'}
                         <p className="truncate text-gray-400 hidden md:inline w-40 ">
                {trackItem.track.album?.name || 'Unknown Album'} {/* Access album.name */}
            </p>
            <p className="text-right text-gray-400 w-12 flex-shrink-0 ml-4">
                    {millisToMinutesAndSeconds(trackItem.track.duration_ms)} {/* <-- YOU MUST CALL THE FUNCTION HERE! */}
                </p>
                    </div>
                    
                  
                    </div>
                   
                ))}
            </div>
        </div>
    );
}

export default Center;