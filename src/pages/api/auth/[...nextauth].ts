import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { dbUser } from "@/database";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@google.com' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' }
      },
      async authorize(credentials): Promise<any> {
        return await dbUser.checkUserEmailPassword(credentials?.email || '', credentials?.password || '');
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    // ...add more providers here
  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks
  jwt: {

  },
  session: {
    maxAge: 2592000, // 30 Days
    strategy: "jwt",
    updateAge: 86400, // each day
  },

  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            token.user = await dbUser.oAuthToDbUser( user.email, user.name )
            break;
          case 'credentials':
            token.user = user;
            break;
        
          default:
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.access_token;
      session.user = token.user;

      return session;
    }
  }
}
export default NextAuth(authOptions)
