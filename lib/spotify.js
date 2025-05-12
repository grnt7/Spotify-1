import SpotifyWebApi from "spotify-web-api-node";

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

const LOGIN_URL = 
"https://accounts.spotify.com/authorize?" + queryParamString.toString();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_PUBLIC_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_PUBLIC_CLIENT_SECRET,
    // redirectUri:
});

export default spotifyApi;

export { LOGIN_URL };



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