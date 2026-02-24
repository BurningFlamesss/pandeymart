import { createServerFn } from "@tanstack/react-start";
import { requireAdminAccess } from "@/middleware/auth";
import { prisma } from "@/db";

export const getAdminData = createServerFn({ method: "GET" }).handler(async () => {
    await requireAdminAccess()

    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    try {
        const [currentRevenue, previousRevenue, activeOrdersCount, pendingOrdersCount, totalProductsCount, lowStockProductsCount, activeUsersCount, suspendedUsersCount] = await prisma.$transaction([
            prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    paymentStatus: "PAID",
                    createdAt: {
                        gte: startOfThisMonth
                    }
                }
            }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    paymentStatus: "PAID",
                    createdAt: {
                        gte: startOfLastMonth,
                        lt: startOfThisMonth
                    }
                }
            }),
            prisma.order.count({
                where: {
                    status: {
                        in: ["PENDING", "PROCESSING"]
                    }
                }
            }),
            prisma.order.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma.product.count(),
            prisma.product.count({
                where: {
                    inStock: true,
                    quantity: {
                        lte: 2
                    }
                }
            }),
            prisma.user.count({
                where: {
                    emailVerified: true
                }
            }),
            prisma.user.count({
                where: {
                    emailVerified: false
                }
            }),
        ])

        const data = {
            totalRevenue: currentRevenue._sum.total ?? 0,
            previousRevenue: previousRevenue._sum.total ?? 0,
            activeOrders: activeOrdersCount,
            pendingOrders: pendingOrdersCount,
            totalProducts: totalProductsCount,
            lowStockProducts: lowStockProductsCount,
            activeUsers: activeUsersCount,
            suspendedUsers: suspendedUsersCount,
        }

        console.log("Fetched admin data:", data)

        return data
    } catch (error) {
        console.error("Error fetching admin data:", error)
        throw error
    }
})