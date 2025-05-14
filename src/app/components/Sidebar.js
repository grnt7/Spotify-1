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

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (spotifyApi) { // Check if spotifyApi is not null
      if (spotifyApi.getAccessToken()) {
        spotifyApi.getUserPlaylists() // Use the spotifyApi instance directly
          .then((data) => {
            setPlaylists(data.body.items);
          })
          .catch((error) => {
            console.error("Error fetching playlists:", error);
          });
      }
    }
  }, [session, spotifyApi]); // Keep spotifyApi in the dependency array

  console.log(playlists);

  return (
    <div className="text-gray-500 p-5 border-r
     border-gray-900
       overflow-y-scroll scrollbar-hide
        h-screen "
    >
        <div className="space-y-4">
             <button  className="flex items-center space-x-2 hover:text-white" onClick={() => signOut()} >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5"/>
            <p>Logout</p>
        </button>
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
            <p key={playlist.id} className="cursor-pointer  hover:text-white">

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











/*
Papa React original code

import {
    HomeIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
    ArrowRightStartOnRectangleIcon
   

} from '@heroicons/react/24/outline'
import { VscLibrary } from "react-icons/vsc";
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSpotify from '../hooks/useSpotify';





function Sidebar() {

    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [playlists, setPlaylists] = useState([]);


    useEffect(() => {
    if (spotifyApi.getAccessToken()) {
        spotify.getUserPlayLists().then((data) => {
            setPlaylists(data.body.items);
        });
    }

}, [session, spotifyApi])

    console.log(playlists);

  return (
    <div className="text-gray-500 p-5 border-r
     border-gray-900
       overflow-y-scroll scrollbar-hide
        h-screen "
    >
        <div className="space-y-4">
             <button  className="flex items-center space-x-2 hover:text-white" onClick={() => signOut()} >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5"/>
            <p>Logout</p>
        </button>
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
       
       {/*Playlists}
        {playlists.map((playlist) =>(
            <p key={playlist.id} className="cursor-pointer  hover:text-white">

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
       <p className="cursor-pointer hover:text-white">Playlist name..</p>}
       </div>
    </div>
  )
}

export default Sidebar;*/