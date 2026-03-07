import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { prisma } from "@/db"
import { getSessionMiddleware } from "@/middleware/auth"

export const CreateOrderInput = z.object({
    paymentMethod: z.enum(["Online", "Cash on Delivery"]),
    customerName: z.string().min(1),
    customerEmail: z.email(),
    customerPhone: z.string().min(7),

    shippingAddress1: z.string().min(1),
    shippingAddress2: z.string().optional(),
    shippingCity: z.string().min(1),
    shippingState: z.string().min(1),
    shippingPostalCode: z.string().min(1),

    orderNotes: z.string().optional(),

    items: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number().int().positive(),
            customizations: z.any().optional(),
        })
    ).min(1),
})

export const createOrder = createServerFn({ method: "POST" })
    .middleware([getSessionMiddleware])
    .inputValidator(CreateOrderInput)
    .handler(async ({ data, context }) => {

        try {
            const user = context.session?.user
            if (!user) {
                throw new Error("Unauthorized")
            }

            return await prisma.$transaction(async (transaction) => {
                const productIds = data.items.map(item => item.productId)

                // ✅ The same product can appear multiple times in the cart with different
                // customizations. findMany returns each product once, so comparing
                // products.length to productIds.length (with duplicates) always fails.
                const uniqueProductIds = [...new Set(productIds)]

                const products = await transaction.product.findMany({
                    where: { productId: { in: uniqueProductIds } }
                })

                if (products.length !== uniqueProductIds.length) {
                    throw new Error("Some products no longer exist")
                }

                let total = 0

                const orderItemsData = data.items.map(item => {
                    const product = products.find(productEntity => productEntity.productId === item.productId)!

                    if (!product.inStock) {
                        throw new Error(`${product.productName} is out of stock`)
                    }

                    if ((product.quantity ?? 0) < item.quantity) {
                        throw new Error(`Not enough stock for ${product.productName}`)
                    }

                    const price = product.productPrice ?? 0
                    const lineTotal = price * item.quantity

                    total += lineTotal

                    return {
                        productId: product.productId,
                        productName: product.productName,
                        productPrice: price,
                        quantity: item.quantity,
                        customizations: item.customizations ?? null,
                    }
                })

                const prismaPaymentMethod =
                    data.paymentMethod === "Cash on Delivery"
                        ? "COD"
                        : "ESEWA"

                const paymentStatus = "PENDING"

                const orderStatus =
                    prismaPaymentMethod === "COD"
                        ? "PROCESSING"
                        : "PENDING"

                const order = await transaction.order.create({
                    data: {
                        userId: user.id,
                        total,
                        paymentMethod: prismaPaymentMethod,
                        paymentStatus,
                        status: orderStatus,

                        customerName: data.customerName,
                        customerEmail: data.customerEmail,
                        customerPhone: data.customerPhone,

                        shippingAddress1: data.shippingAddress1,
                        shippingAddress2: data.shippingAddress2,
                        shippingCity: data.shippingCity,
                        shippingState: data.shippingState,
                        shippingPostalCode: data.shippingPostalCode,

                        orderNotes: data.orderNotes,

                        items: {
                            create: orderItemsData
                        }
                    }
                })

                for (const item of orderItemsData) {
                    await transaction.product.update({
                        where: { productId: item.productId },
                        data: {
                            quantity: {
                                decrement: item.quantity
                            }
                        }
                    })
                }

                return {
                    orderId: order.orderId,
                }
            })
        } catch (error) {
            console.error("Error creating order:", error)
            throw error
        }
    })