// @/types/Product.ts

export interface UIProduct {
    productId: string;
    productName: string;
    productImage: string;
    productPrice: number;
    originalPrice?: number;
    rating?: number;
    category?: string;
    description?: string;
    inStock?: boolean;
    weight?: Array<string>;
}