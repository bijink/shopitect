import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
   // Configure one or more authentication providers
   providers: [
      GoogleProvider({
         clientId: process.env.googleClientId,
         clientSecret: process.env.googleClientSecret,
      }),
      // ...add more providers here
   ],
   secret: process.env.nextSecret,
   pages: {
      signIn: "/auth/signup",
   },
   callbacks: {
      async session({ session, token, user }) {
         session.user.uid = token.sub;
         return session;
      }
   }
});
