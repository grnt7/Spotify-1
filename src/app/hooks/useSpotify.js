// src/hooks/useSpotify.js
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

// Create a singleton instance if possible to avoid re-instantiating,
// though in a hook, it's often created per render.
// A more advanced pattern would involve memoizing it or creating it outside the component if it's truly global.
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  // clientSecret is NOT needed on the client-side for these operations
});

function useSpotify() {
  const { data: session } = useSession(); // Status is not directly used here

  useEffect(() => {
    if (session) {
      // If refresh token fails, direct user to login
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }

      // Set both the access token AND refresh token on the spotifyApi instance
      // The refresh token is crucial for the spotify-web-api-node to know how to refresh
      if (session.user?.accessToken && session.user?.refreshToken) {
        spotifyApi.setAccessToken(session.user.accessToken);
        spotifyApi.setRefreshToken(session.user.refreshToken); // <-- ADD THIS LINE
      }
    }
  }, [session]); // Depend on session to re-run when session changes (e.g., after login or refresh)

  return spotifyApi;
}

export default useSpotify;