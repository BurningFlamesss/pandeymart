import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { prisma } from "@/db"
import { mapProduct } from "@/utils/mapProducts"

const customizationOptionSchema = z.object({
    label: z.string(),
    additionalPrice: z.number().min(0)
})

const customizationGroupSchema = z.object({
    title: z.string(),
    options: z.array(customizationOptionSchema).min(1)
})


const paramSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    productPrice: z.number().optional(),
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
    productImages: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    customizations: z.array(customizationGroupSchema).optional()
})


export const updateProduct = createServerFn({ method: "POST" }).inputValidator(paramSchema).handler(async ({ data }) => {
    try {
        const product = await prisma.product.update({
            where: {
                productId: data.productId
            },
            data: {
                productName: data.productName,
                slug: data.slug,
                description: data.description,
                productPrice: data.productPrice,
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
                productImages: {
                    deleteMany: {
                        productId: data.productId
                    },
                    create: data.productImages.map((url) => ({
                        url
                    }))
                },
                tags: {
                    deleteMany: {
                        productId: data.productId
                    },
                    create: data.tags?.map((tagName) => ({
                        tagName
                    })) ?? []
                }
            },
            include: {
                productImages: true,
                tags: true
            }
        })

        return mapProduct(product)
    } catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product. Please try again.");
    }
})