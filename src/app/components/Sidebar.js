'use client'; // This is a client component

import {
  HomeIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  ArrowDownRightIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { VscLibrary } from "react-icons/vsc";
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSpotify from '../hooks/useSpotify';
import SpotifyWebApi from 'spotify-web-api-node'; // Import if you haven't in this file
import { useAtom } from 'jotai'; // <--- IMPORT useAtom from jotai
//import { useAtomValue } from 'jotai'; // <--- IMPORT useAtomValue from jotai
import { playlistIdState } from '../../../atoms/playlistAtom';
//import { playlistAtom} from '../../../atoms/playlistAtom';

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useAtom(playlistIdState);

  const handlePlaylistClick = (id) => {
        setPlaylistId(id);
        console.log("Sidebar - Playlist clicked. New playlistId:", id); // Add this log
    };

  // Log session status
  console.log("Sidebar - Session:", session);
  console.log("Sidebar - Session Status:", status);


  useEffect(() => {
    if (spotifyApi) {
      console.log("useEffect: spotifyApi instance exists.");

      const accessToken = spotifyApi.getAccessToken(); // Get the current token
      console.log("useEffect: Spotify Access Token:", accessToken); // LOG THIS!

      if (accessToken) { // Ensure there's a token
        spotifyApi.getUserPlaylists()
          .then((data) => {
            console.log("useEffect: Successfully fetched playlists data:", data); // Log raw successful data
            setPlaylists(data.body.items);
          })
          .catch((error) => {
            console.error("useEffect: Error fetching playlists:", error); // LOOK FOR THIS IN YOUR BROWSER CONSOLE!
            // Also log the error details, especially HTTP status codes
            if (error.statusCode) {
                console.error("Error status code:", error.statusCode);
            }
            if (error.body) {
                console.error("Error response body:", error.body);
            }
          });
      } else {
        console.warn("useEffect: spotifyApi has no access token or it's expired.");
        // If the token is null here but the session is authenticated,
        // the problem is in your useSpotify hook's token management.
      }
    } else {
      console.warn("useEffect: spotifyApi instance is null or undefined.");
      // This should ideally not happen if useSpotify is set up correctly and session is authenticated.
    }
  }, [session, spotifyApi]); // Dependencies: session (for initial load) and spotifyApi (if it changes)

  console.log("Current playlists state:", playlists); // This will initially be 

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r
     border-gray-900
       overflow-y-scroll scrollbar-hide
        h-screen sm:max-w-[12rem] lg:max-w[15rem] hidden md:inline-flex
        w-72"
    >
        <div className="space-y-4">
            {/* <button  className="flex items-center space-x-2 hover:text-white" onClick={() => signOut()} >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5"/>
            <p>Logout</p>
        </button>*/}
        <button  className="flex items-center space-x-2 hover:text-white"  >
            <HomeIcon className="h-5 w-5"/>
            <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white"  >
            <MagnifyingGlassIcon className="h-5 w-5"/>
            <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white" >
            < VscLibrary className="h-5 w-5"/>
            <p>Your Library</p>
        </button>
       <hr className="border-t-[0.1px] border-gray-900"></hr>
       <button  className="flex items-center space-x-2 hover:text-white"  >
            <PlusCircleIcon className="h-5 w-5"/>
            <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white"  >
            <HeartIcon className="h-5 w-5"/>
            <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white" >
            <  RssIcon className="h-5 w-5"/>
            <p>Your Episodes</p>
        </button>
       <hr className="border-t-[0.1px] border-gray-900"></hr>
       
       {/*Playlists*/}
        {playlists.map((playlist) =>(
            <p key={playlist.id} className="cursor-pointer  hover:text-white"
            onClick={() => handlePlaylistClick(playlist.id)} // Use the click handler
            >
           {playlist.name} </p>
        ))}

       {/*<p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>*/}
       </div>
    </div>
  )
}


export default Sidebar;











