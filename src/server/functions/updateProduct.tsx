import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { prisma } from "@/db"

const customizationOptionSchema = z.object({
    label: z.string(),
    additionalPrice: z.number().min(0)
})

const customizationGroupSchema = z.object({
    title: z.string(),
    options: z.array(customizationOptionSchema).min(1)
})


const paramSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    price: z.number().optional(),
    originalPrice: z.number().optional(),
    discountPercentage: z.number().optional(),
    unit: z.string().optional(),
    quantity: z.number().optional(),
    minOrderQuantity: z.number().optional(),
    maxOrderQuantity: z.number().optional(),
    inStock: z.boolean().optional(),
    lowStockThreshold: z.number().optional(),
    label: z.string().optional(),
    labelColor: z.string().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    categoryId: z.string().optional(),
    images: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    customizations: z.array(customizationGroupSchema).optional()
})


export const updateProduct = createServerFn({ method: "POST" }).inputValidator(paramSchema).handler(async ({ data }) => {

    const product = await prisma.product.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            price: data.price,
            originalPrice: data.originalPrice,
            discountPercentage: data.discountPercentage,
            unit: data.unit,
            quantity: data.quantity,
            minOrderQuantity: data.minOrderQuantity,
            maxOrderQuantity: data.maxOrderQuantity,
            inStock: data.inStock ?? true,
            lowStockThreshold: data.lowStockThreshold,
            label: data.label,
            labelColor: data.labelColor,
            isActive: data.isActive ?? true,
            isFeatured: data.isFeatured ?? false,
            categoryId: data.categoryId,
            customizations: data.customizations,
            images: {
                deleteMany: {
                    productId: data.id
                },  
                create: data.images.map((url) => ({
                    url
                }))
            },
            tags: {
                deleteMany: {
                    productId: data.id
                },
                create: data.tags?.map((name) => ({
                    name
                })) ?? []
            }
        },
        include: {
            images: true,
            tags: true
        }
    })

    return product
})