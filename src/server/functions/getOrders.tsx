import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/db";
import { getSessionMiddleware } from "@/middleware/auth";

export const getOrders = createServerFn({method: "GET"}).middleware([getSessionMiddleware]).handler(async ({context}) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: context.session?.user.id
            },
            include: {
                items: true
            }
        })

        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error
    }
})