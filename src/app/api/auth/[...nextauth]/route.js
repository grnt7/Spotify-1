import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../../../lib/spotify";

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

console.log("JWT Secret in route.js:", process.env.JWT_SECRET);

export const authOptions = { // Changed to export const authOptions
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, // Changed to NEXT_PUBLIC_SPOTIFY_CLIENT_ID
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Changed to SPOTIFY_CLIENT_SECRET
      authorization: LOGIN_URL,
    }),
  ],
  secret: JWT_SECRET,
  pages: {
    signIn: "/login", 
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return { ...token, ...account, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, user: token };
    },
  },
};


//import { authOptions } from "./route"; // Import authOptions from the same file

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };



