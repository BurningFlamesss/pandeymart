import { z } from "zod"

export const initiateEsewaSchema = z.object({
    amount: z.number().positive(),
    orderData: z.object({
        customerName: z.string().min(1),
        customerEmail: z.email(),
        customerPhone: z.string().min(7),
    })
})

export type InitiateEsewaInput = z.infer<typeof initiateEsewaSchema>