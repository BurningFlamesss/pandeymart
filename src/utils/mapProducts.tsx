import type { Product as TSProduct } from '@/types/Product'

export function mapProduct(product: any): TSProduct {
    return {
        productId: product.productId,
        productName: product.productName,
        slug: product.slug,
        description: product.description,
        productPrice: product.productPrice ?? undefined,
        originalPrice: product.originalPrice ?? undefined,
        discountPercentage: product.discountPercentage ?? undefined,
        unit: product.unit ?? undefined,
        quantity: product.quantity ?? undefined,
        minOrderQuantity: product.minOrderQuantity ?? undefined,
        maxOrderQuantity: product.maxOrderQuantity ?? undefined,
        inStock: product.inStock,
        lowStockThreshold: product.lowStockThreshold ?? undefined,
        label: product.label ?? undefined,
        labelColor: product.labelColor ?? undefined,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        customizations: product.customizations ?? [],
        category: product.category?.categoryName ?? undefined,
        productImages: product.productImages.map((img: any) => img.url),
        tags: product.tags.map((tag: any) => tag.tagName),
        rating: product.ratings?.length ? product.ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / product.ratings.length : undefined,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }
}
