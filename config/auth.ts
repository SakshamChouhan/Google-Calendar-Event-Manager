import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.expires_at = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken as string,
        expires: new Date((token.expires_at as number) * 1000).toISOString(),
      };
    },
  },
  debug: process.env.NODE_ENV === "development",
};