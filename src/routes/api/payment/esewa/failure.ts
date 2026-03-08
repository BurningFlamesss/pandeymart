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

export const Route = createFileRoute("/api/payment/esewa/failure")({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url)
                const origin = url.origin

                const orderId = url.searchParams.get("order")
                const rawData = url.searchParams.get("data")

                if (!rawData) {
                    if (orderId) {
                        const order = await prisma.order.findUnique({
                            where: { orderId },
                            select: { paymentStatus: true },
                        })
                        if (order?.paymentStatus === "PENDING") {
                            await prisma.order.update({
                                where: { orderId },
                                data: {
                                    paymentStatus: "FAILED",
                                    status: "CANCELLED",
                                },
                            })
                        }
                    }
                    return Response.redirect(`${origin}/payment-failed`)
                }

                let decoded: unknown
                try {
                    decoded = JSON.parse(Buffer.from(rawData, "base64").toString("utf-8"))
                } catch {
                    return Response.redirect(`${origin}/payment-failed`)
                }

                const parsed = esewaCallbackSchema.safeParse(decoded)
                if (!parsed.success) return Response.redirect(`${origin}/payment-failed`)

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
                if (computedSignature !== signature) return Response.redirect(`${origin}/payment-failed`)

                const order = await prisma.order.findUnique({
                    where: { orderId: transaction_uuid },
                    select: { paymentStatus: true },
                })

                if (!order || order.paymentStatus !== "PENDING") {
                    return Response.redirect(`${origin}/payment-failed`)
                }

                await prisma.order.update({
                    where: { orderId: transaction_uuid },
                    data: {
                        paymentStatus: "FAILED",
                        status: "CANCELLED",
                        esewaTransactionId: transaction_code,
                    },
                })

                return Response.redirect(`${origin}/payment-failed`)
            },
        },
    },
})