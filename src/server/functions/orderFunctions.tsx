import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { prisma } from "@/db"
import { Prisma } from "@/generated/prisma/client"
import { getSessionMiddleware } from "@/middleware/auth"

const CustomizationOptionSchema = z.object({
    label: z.string(),
    additionalPrice: z.number().min(0),
})

const CustomizationGroupSchema = z.object({
    title: z.string(),
    options: z.array(CustomizationOptionSchema),
})

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
            customizations: z.array(CustomizationGroupSchema).optional(),
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
                const uniqueProductIds = [...new Set(productIds)]

                const products = await transaction.product.findMany({
                    where: { productId: { in: uniqueProductIds } },
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

                    const basePrice = product.productPrice ?? 0

                    const customizationTotal = (item.customizations ?? []).reduce(
                        (groupSum, group) =>
                            groupSum + group.options.reduce(
                                (optionSum, option) => optionSum + option.additionalPrice,
                                0
                            ),
                        0
                    )

                    const unitPrice = basePrice + customizationTotal
                    const lineTotal = unitPrice * item.quantity
                    total += lineTotal

                    return {
                        productId: product.productId,
                        orderItem: {
                            product: { connect: { productId: product.productId } },
                            productName: product.productName,
                            productPrice: unitPrice,
                            quantity: item.quantity,
                            customizations: item.customizations?.length
                                ? item.customizations
                                : Prisma.JsonNull,
                        },
                    }
                })

                const shippingCost = total >= 2000 ? 0 : 100
                total += shippingCost

                const prismaPaymentMethod = data.paymentMethod === "Cash on Delivery" ? "COD" : "ESEWA"
                const paymentStatus = "PENDING"
                const orderStatus = prismaPaymentMethod === "COD" ? "PROCESSING" : "PENDING"

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
                            create: orderItemsData.map(item => item.orderItem),
                        },
                    },
                })

                await Promise.all(
                    orderItemsData.map(item =>
                        transaction.product.update({
                            where: { productId: item.productId },
                            data: { quantity: { decrement: item.orderItem.quantity } },
                        })
                    )
                )

                return { orderId: order.orderId, total: order.total }
            })
        } catch (error) {
            console.error("Error creating order:", error)
            throw error
        }
    })