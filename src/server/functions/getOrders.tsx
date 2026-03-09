import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { prisma } from "@/db";
import { getSessionMiddleware } from "@/middleware/auth";

export const getMyOrders = createServerFn({ method: "GET" })
    .middleware([getSessionMiddleware])
    .handler(async ({ context }) => {
        const user = context.session?.user
        if (!user) throw new Error("Unauthorized")

        return prisma.order.findMany({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                productId: true,
                                productImages: { select: { url: true }, take: 1 },
                                ratings: {
                                    where: { userId: user.id },
                                    select: { rating: true, review: true },
                                },
                                unit: true
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
    })

export const cancelOrder = createServerFn({ method: "POST" })
    .middleware([getSessionMiddleware])
    .inputValidator(z.object({ orderId: z.string() }))
    .handler(async ({ data, context }) => {
        const user = context.session?.user
        if (!user) throw new Error("Unauthorized")

        const order = await prisma.order.findUnique({
            where: { orderId: data.orderId },
            select: { userId: true, status: true },
        })

        if (!order || order.userId !== user.id) throw new Error("Order not found")
        if (order.status !== "PENDING") throw new Error("Order cannot be cancelled")

        return prisma.order.update({
            where: { orderId: data.orderId },
            data: { status: "CANCELLED", paymentStatus: "REFUNDED" },
        })
    })

export const requestRefund = createServerFn({ method: "POST" })
    .middleware([getSessionMiddleware])
    .inputValidator(z.object({ orderId: z.string(), reason: z.string().min(10) }))
    .handler(async ({ data, context }) => {
        const user = context.session?.user
        if (!user) throw new Error("Unauthorized")

        const order = await prisma.order.findUnique({
            where: { orderId: data.orderId },
            select: { userId: true, status: true, paymentStatus: true },
        })

        if (!order || order.userId !== user.id) throw new Error("Order not found")

        return prisma.order.update({
            where: { orderId: data.orderId },
            data: { orderNotes: `REFUND REQUEST: ${data.reason}` },
        })
    })

export const submitReview = createServerFn({ method: "POST" })
    .middleware([getSessionMiddleware])
    .inputValidator(
        z.object({
            productId: z.string(),
            rating: z.number().int().min(1).max(5),
            review: z.string().optional(),
        })
    )
    .handler(async ({ data, context }) => {
        const user = context.session?.user
        if (!user) throw new Error("Unauthorized")

        return prisma.productRating.upsert({
            where: { userId_productId: { userId: user.id, productId: data.productId } },
            update: { rating: data.rating, review: data.review },
            create: {
                userId: user.id,
                productId: data.productId,
                rating: data.rating,
                review: data.review,
            },
        })
    })
