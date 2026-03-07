import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { prisma } from "@/db"
import { ESEWA_CONFIG } from "@/server/payment/paymentConfig"

const querySchema = z.object({
  transaction_uuid: z.string()
})

export const Route = createFileRoute("/api/payment/esewa/success")({
  server: {
    handlers: {
      GET: async ({ request }) => {

        const url = new URL(request.url)

        const parsed = querySchema.safeParse({
          transaction_uuid: url.searchParams.get("transaction_uuid")
        })

        if (!parsed.success) {
          return Response.redirect("/payment-failed")
        }

        const { transaction_uuid } = parsed.data

        const verifyUrl =
          `${ESEWA_CONFIG.VERIFY_URL}?product_code=${ESEWA_CONFIG.MERCHANT_ID}&transaction_uuid=${transaction_uuid}`

        const response = await fetch(verifyUrl)
        const result = await response.json()

        if (result.status === "COMPLETE") {
          await prisma.order.update({
            where: { orderId: transaction_uuid },
            data: {
              paymentStatus: "PAID",
              esewaTransactionId: result.transaction_code,
            }
          })

          return Response.redirect(`/payment-success?order=${transaction_uuid}`)
        }
        return Response.redirect("/payment-failed")
      }
    }
  }
})