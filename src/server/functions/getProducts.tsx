import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { products } from "@/config/mockProducts"

const paramSchema = z.array(z.string())

export const getProducts = createServerFn({ method: "GET" }).inputValidator(paramSchema).handler(({ data }) => {
    // TODO: Backend
    return products.filter(product => data.includes(product.productId))
})