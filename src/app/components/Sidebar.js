import {
    HomeIcon,
    BuildingLibraryIcon,
    MagnifyingGlassIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon
   

} from '@heroicons/react/24/outline'
import { VscLibrary } from "react-icons/vsc";

function Sidebar() {
  return (
    <div className="text-gray-500 p-5 border-r border-gray-900
       overflow-y-scroll scrollbar-hide
        h-screen "
    >
        <div className="space-y-5">
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
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       <p className="cursor-pointer hover:text-white">Playlist name..</p>
       </div>
    </div>
  )
}

export default Sidebar;