import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";

function useSpotify() {
  const { data: session, status } = useSession();
  const [spotifyApi, setSpotifyApi] = useState(null);

  useEffect(() => {
    if (session) {
      const newSpotifyApi = new SpotifyWebApi({
        clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, // Use NEXT_PUBLIC_
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      });

      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }

      if (session?.user?.accessToken) {
        newSpotifyApi.setAccessToken(session.user.accessToken);
      }

      setSpotifyApi(newSpotifyApi);
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify;