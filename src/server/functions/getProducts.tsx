import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { prisma } from "@/db"
import { mapProduct } from "@/utils/mapProducts"

const paramSchema = z.array(z.string())

export const getProducts = createServerFn({ method: "GET" }).inputValidator(paramSchema).handler(async ({ data }) => {

    const products = await prisma.product.findMany({
        where: {
            productId: {
                in: data
            },
            isActive: true
        },
        include: {
            productImages: true,
            category: true,
            tags: true
        }
    })

    return products.map(mapProduct)
})

export const getAllProducts = createServerFn({ method: "GET" }).handler(async () => {

    const products = await prisma.product.findMany({
        where: {
            isActive: true
        },
        include: {
            productImages: true,
            category: true,
            tags: true
        }
    })

    return products.map(mapProduct)
})