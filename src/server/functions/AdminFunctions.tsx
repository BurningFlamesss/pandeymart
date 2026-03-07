import { createServerFn } from "@tanstack/react-start";
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
            select: { _count: true, total: true }
        }
    }
}>

export const getAdminPanelUsersData = createServerFn({ method: "GET" }).handler(async () => {
    await requireAdminAccess()

    try {
        const users = await prisma.user.findMany({
            include: {
                orders: {
                    select: { _count: true, total: true }
                }
            }
        })

        return users
    } catch (error) {
        console.error("Error fetching admin users data:", error)
        throw error
    }
})