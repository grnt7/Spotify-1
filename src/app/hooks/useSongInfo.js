import { useEffect, useState } from "react"
import { useAtomValue } from 'jotai'; // Import useAtomValue to read atom values //alt to recoil
import { currentTrackIdState } from "../../../atoms/playerAtoms";
import useSpotify from "./useSpotify";

function useSongInfo() {
    const spotifyApi = useSpotify();
    const currentTrackId = useAtomValue(currentTrackIdState); // Get current track ID from Jotai atom
    const [songInfo, setSongInfo] = useState(null);
    

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId) {
               
                    const track = await fetch (
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`, 
                        {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        }
                    }
                ).then (res => res.json());
                setSongInfo(track);
                console.log("Fetched song info:", track);
            }
        };

        fetchSongInfo();
    }, [currentTrackId, spotifyApi]);
 
 
    return (
    <div>

    </div>
  )
}

export default useSongInfo