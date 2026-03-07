import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { prisma } from "@/db"
import { ESEWA_CONFIG } from "@/server/payment/paymentConfig"
import { hmacSha256Base64 } from "@/server/payment/paymentFunctions"

const esewaCallbackSchema = z.object({
  transaction_code: z.string(),
  status: z.string(),
  total_amount: z.string(),
  transaction_uuid: z.string(),
  product_code: z.string(),
  signed_field_names: z.string(),
  signature: z.string(),
})

export const Route = createFileRoute("/api/payment/esewa/success")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const origin = url.origin

        const rawData = url.searchParams.get("data")
        if (!rawData) {
          console.error("eSewa callback: missing data param")
          return Response.redirect(`${origin}/payment-failed`)
        }

        let decoded: unknown
        try {
          decoded = JSON.parse(Buffer.from(rawData, "base64").toString("utf-8"))
        } catch {
          console.error("eSewa callback: failed to decode data param")
          return Response.redirect(`${origin}/payment-failed`)
        }

        const parsed = esewaCallbackSchema.safeParse(decoded)
        if (!parsed.success) {
          console.error("eSewa callback: invalid payload shape", parsed.error)
          return Response.redirect(`${origin}/payment-failed`)
        }

        const {
          transaction_code,
          status,
          total_amount,
          transaction_uuid,
          product_code,
          signed_field_names,
          signature,
        } = parsed.data

        const fieldValues: Record<string, string> = {
          transaction_code,
          status,
          total_amount,
          transaction_uuid,
          product_code,
          signed_field_names,
        }

        const message = signed_field_names
          .split(",")
          .map((field) => `${field}=${fieldValues[field] ?? ""}`)
          .join(",")

        const computedSignature = hmacSha256Base64(message, ESEWA_CONFIG.SECRET_KEY)

        if (computedSignature !== signature) {
          console.error("eSewa callback: signature mismatch — possible forgery")
          return Response.redirect(`${origin}/payment-failed`)
        }

        if (status !== "COMPLETE") {
          console.error("eSewa callback: payment not complete, status =", status)
          return Response.redirect(`${origin}/payment-failed`)
        }

        try {
          await prisma.order.update({
            where: { orderId: transaction_uuid },
            data: {
              paymentStatus: "PAID",
              status: "PROCESSING",
              esewaTransactionId: transaction_code,
            },
          })
        } catch (error) {
          console.error("eSewa callback: failed to update order", error)
          return Response.redirect(`${origin}/payment-failed`)
        }

        return Response.redirect(`${origin}/payment-success?order=${transaction_uuid}`)
      },
    },
  },
})