import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.googleClientId as string,
      clientSecret: process.env.googleClientSecret as string,
    }),
    // ...add more providers here
  ],
  secret: process.env.nextSecret,
  // pages: {
  //   signIn: '/auth/signup',
  // },
  // callbacks: {
  //   async session({ session, token, user }) {
  //     session.user.uid = token.sub;
  //     return session;
  //   },
  // },
  // callbacks: {
  //   async signIn({ account, profile }) {
  //     if (account?.provider === 'google') {
  //       return profile.email_verified && profile.email.endsWith('@example.com');
  //     }
  //     return true; // Do different verification for other providers that don't have `email_verified`
  //   },
  // },
});

export { handler as GET, handler as POST };
