import { betterAuth } from 'better-auth'
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { prisma } from '@/db';



export const auth = betterAuth({
  database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
  emailVerification: {
    sendVerificationEmail(data, request) {
      console.log(`Send verification email to ${data.user.email} with link: ${data.token}`)
      return Promise.resolve()
    },
    sendOnSignUp: true
  },
  plugins: [tanstackStartCookies()]
})
