import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.nextSecret,
  pages: {
    signIn: "/signup",
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.uid = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
