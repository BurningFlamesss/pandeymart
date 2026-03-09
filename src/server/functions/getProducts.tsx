import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/db"
import { mapProduct } from "@/utils/mapProducts"

const paramSchema = z.array(z.string())

export type reviewType = Prisma.ProductRatingGetPayload<{
    include: {
        user: {
            select: {
                name: true,
                image: true
            }
        }
    }
}>

export const getProduct = createServerFn({ method: "GET" }).inputValidator(z.string()).handler(async ({ data }) => {
    try {
        const product = await prisma.product.findFirst({
            where: {
                productId: data,
                isActive: true
            },
            include: {
                productImages: true,
                category: true,
                tags: true,
                ratings: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        })

        if (!product) return null

        return {
            product: mapProduct(product),
            reviews: product.ratings
        }
    } catch (error) {
        console.error("Error fetching product data:", error)
        throw error
    }
})

export const getProducts = createServerFn({ method: "GET" }).inputValidator(paramSchema).handler(async ({ data }) => {
    try {
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
                tags: true,
                ratings: true
            }
        })

        return products.map(mapProduct)
    } catch (error) {
        console.error("Error fetching products data:", error)
        throw error
    }
})

// export const getAllProducts = createServerFn({ method: "GET" }).handler(async () => {
//     try {
//         const products = await prisma.product.findMany({
//             where: {
//                 isActive: true
//             },
//             include: {
//                 productImages: true,
//                 category: true,
//                 tags: true,
//                 orderItems: true
//             },
//             orderBy: {
//                 createdAt: "desc"
//             }
//         }) 

//         return products.map(mapProduct)
//     } catch (error) {
//         console.error("Error fetching all products data:", error)
//         throw error
//     }
// })

export const getAllProducts = createServerFn({ method: "GET" }).handler(async () => {
    try {
        return await prisma.$transaction(async (transaction) => {
            const mostOrderedRaw = await transaction.orderItem.groupBy({
                by: ["productId"],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: "desc" } },
                take: 10,
            });

            const mostOrderedProductIds = mostOrderedRaw.map(item => item.productId);

            const [allProducts, mostOrderedProducts, featuredProducts] = await Promise.all([
                transaction.product.findMany({
                    where: { isActive: true },
                    include: {
                        productImages: true,
                        category: true,
                        tags: true,
                        orderItems: true,
                        ratings: true
                    },
                    orderBy: { createdAt: "desc" },
                }),

                transaction.product.findMany({
                    where: {
                        OR: [
                            { productId: { in: mostOrderedProductIds } },
                            { label: "Best Seller" }
                        ],
                        isActive: true
                    },
                    include: {
                        productImages: true,
                        category: true,
                        tags: true,
                        orderItems: true,
                        ratings: true,
                    },
                }),

                transaction.product.findMany({
                    where: { isActive: true, OR: [{ isFeatured: true }, { label: "Hot Deal" }] },
                    include: {
                        productImages: true,
                        category: true,
                        tags: true,
                        orderItems: true,
                        ratings: true
                    },
                    orderBy: { createdAt: "desc" },
                }),
            ]);

            const mostOrderedSorted = [
                ...mostOrderedProductIds
                    .map(id => mostOrderedProducts.find(product => product.productId === id))
                    .filter((product): product is typeof mostOrderedProducts[number] => product !== undefined),
                ...mostOrderedProducts.filter(
                    product => !mostOrderedProductIds.includes(product.productId)
                ),
            ];

            return {
                all: allProducts.map(mapProduct),
                mostOrdered: mostOrderedSorted.map(mapProduct),
                featured: featuredProducts.map(mapProduct),
            };
        });
    } catch (error) {
        console.error("Error fetching all products data:", error);
        throw error;
    }
});