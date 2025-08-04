import { useEffect, useState } from "react";
import { useAtomValue } from 'jotai';
import { currentTrackAtom } from "../../../atoms/playerAtoms";
import useSpotify from "./useSpotify"; // Assuming this hook provides a configured spotifyApi object

function useSongInfo() {
    const spotifyApi = useSpotify();
    const currentTrack = useAtomValue(currentTrackAtom);
    const currentTrackId = currentTrack?.id;

    const [songInfo, setSongInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId && spotifyApi.getAccessToken()) {
                setLoading(true);
                setError(null);

                try {
                    const trackDetails = await spotifyApi.getTrack(currentTrackId);

                    // --- CORRECTED CONSOLE LOG POSITION ---
                    console.log("useSongInfo: Raw Spotify track data.body:", trackDetails.body);

                    // --- CRITICAL CORRECTION: Map the raw data to the expected format ---
                    setSongInfo({
                        id: trackDetails.body.id,
                        title: trackDetails.body.name, // Spotify uses 'name' for song title
                        artist: trackDetails.body.artists[0]?.name || 'Unknown Artist', // Spotify uses 'artists' array
                        albumArt: trackDetails.body.album?.images?.[0]?.url || 'https://placehold.co/64x64/222222/cccccc?text=No+Art',
                        audioUrl: trackDetails.body.preview_url, // Or full track URL if you have it
                        // Add any other properties you need from the raw body for consistency
                        album: trackDetails.body.album // Keep the album object if Player needs it for images
                    });
                    console.log("useSongInfo: Fetched & Mapped song info:", trackDetails.body.name);

                } catch (err) {
                    console.error("Error fetching song info:", err);
                    setSongInfo(null);
                    setError(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setSongInfo(null); // Reset songInfo when no track or token
                setLoading(false);
                setError(null);
            }
        };

        fetchSongInfo();
    }, [currentTrackId, spotifyApi]);

    return { songInfo, loading, error };
}

export default useSongInfo;











