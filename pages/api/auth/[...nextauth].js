import {PrismaClient} from '@prisma/client'
import NextAuth from "next-auth";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import GitLabProvider from "next-auth/providers/gitlab"

console.log("GitLab env check", {
    id: process.env.GITLAB_CLIENT_ID,
    secretPrefix: process.env.GITLAB_CLIENT_SECRET?.slice(0, 10)
});

const prisma = new PrismaClient

export default NextAuth({

    adapter: PrismaAdapter(prisma),

    providers: [
        GitLabProvider({
            clientId: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_CLIENT_SECRET
        }),
        //Other providers to be added later.
    ],

    callbacks: {
      async session({session, user}){
          session.user.id = user.id;
          session.user.role = user.role || 'author'

          return this.session;
      }
    },

    secret: process.env.NEXTAUTH_SECRET,

});