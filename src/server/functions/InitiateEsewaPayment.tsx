import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { createEsewaPayment } from "@/server/payment/createPayment"

const initiateEsewaSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
})

export const initiateEsewaPayment = createServerFn({ method: "POST" })
  .inputValidator(initiateEsewaSchema)
  .handler(async ({ data }) => {
    const paymentUrl = createEsewaPayment({
      amount: data.amount,
      orderId: data.orderId,
    })

    return { paymentUrl }
  })