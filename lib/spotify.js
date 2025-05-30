import SpotifyWebApi from "spotify-web-api-node";

// Define scopes (can be defined here or in NextAuth config, consistency is key)
const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "streaming",
    "user-library-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-top-read",
    "user-read-recently-played",
    "user-follow-read"
].join(",");

// Define the correct Spotify authorization URL
const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    scope: scopes,
    response_type: "code",
    redirect_uri: "http://127.0.0.1:3000/api/auth/callback/spotify",
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  }).toString();

// Initialize SpotifyWebApi for client-side use
// IMPORTANT: No clientSecret here, as this runs on the client.
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    // redirectUri is not strictly needed for client-side API calls once token is set,
    // but it's often included for completeness if you use this instance for authorization too.
    redirectUri: "http://127.0.0.1:3000/api/auth/callback/spotify",
});

// Export the initialized instance and LOGIN_URL
export default spotifyApi;
export { LOGIN_URL, scopes }; // Export scopes as well, useful for consistency

/*import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read"
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

// The base URL for Spotify's authorization should be correct.
// We'll construct the full LOGIN_URL in route.js using the client ID.
const LOGIN_URL_BASE = "https://accounts.spotify.com/authorize?";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID, // Use the non-public variable
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Use the non-public variable
  // redirectUri:
});

export default spotifyApi;

export { LOGIN_URL_BASE, scopes }; // Export the base URL and scopes

*/