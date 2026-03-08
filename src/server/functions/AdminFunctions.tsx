import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import type { Product } from "@/types/Product";
import type { Prisma } from "@/generated/prisma/client";
import { requireAdminAccess } from "@/middleware/auth";
import { prisma } from "@/db";
import { mapProduct } from "@/utils/mapProducts";

export const getAdminPanelStatsData = createServerFn({ method: "GET" }).handler(async () => {
    await requireAdminAccess()

    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    try {
        return await prisma.$transaction(async (transaction) => {
            const [
                currentRevenue,
                previousRevenue,
                activeOrdersCount,
                pendingOrdersCount,
                products,
                activeUsersCount,
                suspendedUsersCount,
            ] = await Promise.all([
                transaction.order.aggregate({
                    _sum: { total: true },
                    where: { paymentStatus: "PAID", createdAt: { gte: startOfThisMonth } },
                }),
                transaction.order.aggregate({
                    _sum: { total: true },
                    where: { paymentStatus: "PAID", createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
                }),
                transaction.order.count({
                    where: { status: { in: ["PENDING", "PROCESSING"] } },
                }),
                transaction.order.count({
                    where: { status: "PENDING" },
                }),
                transaction.product.findMany({
                    select: { inStock: true, quantity: true, lowStockThreshold: true },
                }),
                transaction.user.count({ where: { emailVerified: true } }),
                transaction.user.count({ where: { emailVerified: false } }),
            ])

            const lowStockProductsCount = products.filter(
                p => p.inStock && p.quantity != null && p.lowStockThreshold != null && p.quantity <= p.lowStockThreshold
            ).length

            return {
                totalRevenue: currentRevenue._sum.total ?? 0,
                previousRevenue: previousRevenue._sum.total ?? 0,
                activeOrders: activeOrdersCount,
                pendingOrders: pendingOrdersCount,
                totalProducts: products.length,
                lowStockProducts: lowStockProductsCount,
                activeUsers: activeUsersCount,
                suspendedUsers: suspendedUsersCount,
            }
        })
    } catch (error) {
        console.error("Error fetching admin data:", error)
        throw error
    }
})

export type AdminPanelProduct = Product

export const getAdminPanelProductsData = createServerFn({ method: "GET" }).handler(async () => {
    await requireAdminAccess()

    try {
        const products = await prisma.product.findMany({
            include: {
                productImages: true,
                category: true,
                tags: true,
                ratings: true
            }
        })

        return products.map(mapProduct)
    } catch (error) {
        console.error("Error fetching admin products data:", error)
        throw error
    }
})

export type AdminPanelOrder = Prisma.OrderGetPayload<{
    include: {
        items: true
        user: true
    }
}>

export const getAdminPanelOrdersData = createServerFn({ method: "GET" }).handler(async () => {
    await requireAdminAccess()

    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return orders
    } catch (error) {
        console.error("Error fetching admin orders data:", error)
        throw error
    }
})

export type AdminPanelUser = Prisma.UserGetPayload<{
    include: {
        orders: {
            include: { _count: true }
        }
    }
}>

export const getAdminPanelUsersData = createServerFn({ method: "GET" }).handler(async () => {
    await requireAdminAccess()

    try {
        const users = await prisma.user.findMany({
            include: {
                orders: {
                    include: { _count: true }
                }
            }
        })

        return users
    } catch (error) {
        console.error("Error fetching admin users data:", error)
        throw error
    }
})

export const deleteProducts = createServerFn({ method: "POST" }).inputValidator(z.array(z.uuid())).handler(async ({ data: productIds }) => {
    await requireAdminAccess()

    try {
        await prisma.product.deleteMany({
            where: {
                productId: {
                    in: productIds
                }
            }
        })
    } catch (error) {
        console.error("Error deleting products:", error)
        throw error
    }
})
export const deleteUsers = createServerFn({ method: "POST" }).inputValidator(z.array(z.uuid())).handler(async ({ data: userIds }) => {
    await requireAdminAccess()

    try {
        await prisma.user.deleteMany({
            where: {
                id: {
                    in: userIds
                }
            }
        })
    } catch (error) {
        console.error("Error deleting users:", error)
        throw error
    }
})
export const deleteOrders = createServerFn({ method: "POST" }).inputValidator(z.array(z.uuid())).handler(async ({ data: orderIds }) => {
    await requireAdminAccess()

    try {
        await prisma.order.deleteMany({
            where: {
                orderId: {
                    in: orderIds
                }
            }
        })
    } catch (error) {
        console.error("Error deleting orders:", error)
        throw error
    }
})

export const updateOrderStatus = createServerFn({ method: "POST" })
    .inputValidator(
        z.object({
            orderId: z.string().uuid(),
            paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
            status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
            sellerNotes: z.string().optional(),
        })
    )
    .handler(async ({ data }) => {
        await requireAdminAccess();

        try {
            const updated = await prisma.order.update({
                where: { orderId: data.orderId },
                data: {
                    ...(data.paymentStatus !== undefined && { paymentStatus: data.paymentStatus }),
                    ...(data.status !== undefined && { status: data.status }),
                    ...(data.sellerNotes !== undefined && { sellerNotes: data.sellerNotes }),
                },
                include: { items: true, user: true },
            });

            return updated;
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    });

export const updateUserVerification = createServerFn({ method: "POST" })
    .inputValidator(
        z.object({
            userId: z.string(),
            emailVerified: z.boolean(),
        })
    )
    .handler(async ({ data }) => {
        await requireAdminAccess();

        try {
            const updated = await prisma.user.update({
                where: { id: data.userId },
                data: { emailVerified: data.emailVerified },
            });

            return updated;
        } catch (error) {
            console.error("Error updating user verification:", error);
            throw error;
        }
    });

export const updateProductStock = createServerFn({ method: "POST" })
    .inputValidator(
        z.object({
            productId: z.uuid(),
            quantity: z.number().int().min(0).optional(),
            inStock: z.boolean().optional(),
            isFeatured: z.boolean().optional(),
            isActive: z.boolean().optional(),
        })
    )
    .handler(async ({ data }) => {
        await requireAdminAccess();

        try {
            const updated = await prisma.product.update({
                where: { productId: data.productId },
                data: {
                    ...(data.quantity !== undefined && { quantity: data.quantity }),
                    ...(data.inStock !== undefined && { inStock: data.inStock }),
                    ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
                    ...(data.isActive !== undefined && { isActive: data.isActive }),
                },
                include: {
                    productImages: true,
                    category: true,
                    tags: true,
                    ratings: true,
                },
            });

            return mapProduct(updated);
        } catch (error) {
            console.error("Error updating product stock:", error);
            throw error;
        }
    });