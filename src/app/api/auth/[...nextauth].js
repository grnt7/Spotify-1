import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken); // Corrected this line

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Use ?? to handle null/undefined
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError", // Changed error property name to be more specific
    };
  }
}

export const authOptions = { // Changed to export const authOptions
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID, // Changed to SPOTIFY_CLIENT_ID
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Changed to SPOTIFY_CLIENT_SECRET
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login", // Corrected typo
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // Corrected: multiplied by 1000
        };
      }

      // Return previous token if the token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }

      // If the access token expires, we need to refresh it...
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
};

const handler = NextAuth(authOptions); // Made handler to use authOptions
export { handler as GET, handler as POST };




/*
//papareact original version
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../../lib/spotify"
 
async function refreshAccessToken(token) {
  try {

    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshTokenToken(token.refreshToken);

    const { body: refreshToken } = await spotifyApi.refreshAccessToken();

  } catch (error) {
    console.error(error)

    return {
      ...token,
      error: "refreshAccessTokenError"
    }
  }
}


export default NextAuth = ({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_PUBLIC_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_PUBLIC_CLIENT_SECRET,
      authorization:LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    sigIn "/login"
  },
  callbacks: {
    async jwt({ token, account, user }) {
     
      //initial sign in
      if (account && user) {
          return {
            ...token,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            username: account.providerAccountId,
            accessTokenExpires: account.expires_at * 1000, // we are handling in milliseconds hence 1000
          }
      }
     //return previous token if the access token has not expired yet
     if (Date.now() < token.accessTokenExpires) {
      return token;
     }
     //access token has expired, so we need to refresh it...
     console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token)
  }
  }
});
*/

