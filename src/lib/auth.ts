import { betterAuth } from 'better-auth'
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { prisma } from '@/db';
import { sendEmails } from '@/helper/sendEmail';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url, token }, request) {
      await sendEmails({
        type: "reset",
        receiverEmail: user.email,
        receiverName: user.name,
        token: url,
        callToAction: "Reset Your Password"
      })
    },
    resetPasswordTokenExpiresIn: 1000 * 60 * 60,
  },
  emailVerification: {
    async sendVerificationEmail({ user, url, token }, request) {
      await sendEmails({
        type: "verify",
        receiverEmail: user.email,
        receiverName: user.name,
        token: url,
        callToAction: "Verify Your Email"
      })
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },
  plugins: [tanstackStartCookies()]
})
