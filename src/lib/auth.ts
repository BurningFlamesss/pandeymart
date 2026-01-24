import { betterAuth } from 'better-auth'
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { passkey } from "@better-auth/passkey"
import { prisma } from '@/db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword(data, request) {
            // Send an email to the user with a link to reset their password
    },
    resetPasswordTokenExpiresIn: 1000 * 60 * 60,
  },
  emailVerification: {
    sendVerificationEmail(data, request) {
      console.log(`Send verification email to ${data.user.email} with link: ${data.token}`)
      return Promise.resolve()
    },
    sendOnSignUp: true
  },
  plugins: [tanstackStartCookies(), passkey()]
})
