import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { prisma } from "@/db"
import { mapProduct } from "@/utils/mapProducts"

const paramSchema = z.array(z.string())

export const getProduct = createServerFn({ method: "GET" }).inputValidator(z.string()).handler(async ({ data }) => {

    const product = await prisma.product.findFirst({
        where: {
            productId: data,
            isActive: true
        },
        include: {
            productImages: true,
            category: true,
            tags: true
        }
    })

    if (!product) return null
    return mapProduct(product)
})

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