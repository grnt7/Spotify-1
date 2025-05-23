'use client';
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {  useSession, } from "next-auth/react";
import { useEffect, useState} from "react";
import { useAtomValue, useSetAtom} from 'jotai'; // <--- IMPORT useAtomValue
//import { playlistIdState } from '../../../atoms/playlistAtom'; // <--- IMPORT your atom (adjust path if necessary)
import {
  playlistIdState,
  playlistAtom,       // <--- IMPORT THE DERIVED playlistAtom
  spotifyApiState     // <--- IMPORT spotifyApiState
} from '../../../atoms/playlistAtom';
import { shuffle } from "lodash";
import useSpotify from '../hooks/useSpotify';

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


  return (
    <div className="flex-grow
    text-white" >
      
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-red-300 space-x-3 
        opacity-90 hover:opacity-80 cursor-pointer rounded-full 
        p-1 pr-2 w-35  text-black">
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
            <div className="px-8 flex flex-col space-y-1 pb-40 text-white  overflow-y-scroll scrollbar-hide
        h-screen">
                {playlist?.tracks?.items.map((trackItem) => ( // <-- Use optional chaining here too
                    // Ensure trackItem.track and its properties exist before accessing
                    <p key={trackItem.track.id} className="py-2">
                        {trackItem.track.name} - {trackItem.track.artists?.[0]?.name || 'Unknown Artist'}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Center;