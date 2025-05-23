// src/app/api/auth/[...nextauth]/route.js (or wherever your NextAuth config is)
import SpotifyWebApi from 'spotify-web-api-node'; // ADD THIS LINE
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scopes = [
  'user-read-email',
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-playback-state', // Added for common Spotify apps
  'user-modify-playback-state', // Added for common Spotify apps
  'user-read-currently-playing',// Added for common Spotify apps
  'user-top-read',              // Added for common Spotify apps
  'user-read-recently-played',  // Added for common Spotify apps
  'user-follow-read',           // Added for common Spotify apps
].join(',');

async function refreshAccessToken(token) {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,        // Server-side, so ok to use here
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Server-side, so ok to use here
      refreshToken: token.refreshToken,
    });

    const refreshedToken = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS", refreshedToken); // Log for debugging

    return {
      ...token,
      accessToken: refreshedToken.body.access_token,
      accessTokenExpires: Date.now() + refreshedToken.body.expires_in * 1000, // In milliseconds
      refreshToken: refreshedToken.body.refresh_token ?? token.refreshToken, // Fallback to old refresh token if new one isn't provided
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}


const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}` // Use the authorization URL with scopes
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId, // Spotify user ID
          accessTokenExpires: account.expires_at * 1000, // Convert to milliseconds
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS VALID"); // Debugging
        return token;
      }

      // Access token has expired, so we need to refresh it
      console.log("ACCESS TOKEN EXPIRED, REFRESHING..."); // Debugging
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username; // Or whatever Spotify ID you set
      session.user.accessTokenExpires = token.accessTokenExpires; // Add expiration for client-side checks
      session.error = token.error; // Pass refresh error to client

      return session;
    },
  },
});

export { handler as GET, handler as POST };