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
    async sendResetPassword({ user, url, token }, request) {
      console.table({
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`
      })
    },
    resetPasswordTokenExpiresIn: 1000 * 60 * 60,
  },
  emailVerification: {
    async sendVerificationEmail({ user, url, token }, request) {
      console.table({
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${url}`
      })
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },
  plugins: [tanstackStartCookies(), passkey()]
})
