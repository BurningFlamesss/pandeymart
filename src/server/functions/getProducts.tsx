import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { prisma } from "@/db"

const paramSchema = z.array(z.string())

export const getProducts = createServerFn({ method: "GET" }).inputValidator(paramSchema).handler(async ({ data }) => {

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: data
            },
            isActive: true
        },
        include: {
            images: true,
            category: true,
            tags: true
        }
    })

    return products
})