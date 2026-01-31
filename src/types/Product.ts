// @/types/Product.ts

export interface UIProduct {
    productId: string;
    productName: string;
    productImage: string;
    productImages?: Array<string>; // Multiple images for gallery
    
    // Price fields (supports both formats)
    productPrice?: number;
    price?: string;
    originalPrice?: number;
    
    // Stock and quantity
    quantity?: string;
    inStock?: boolean;
    
    // Product details
    description?: string;
    category?: string;
    rating?: number;
    weight?: Array<string>;
    
    // Lifecycle information
    createdAt?: string;
    expectedLifeSpan?: string; // in days
    
    // Labels and badges
    label?: "Best Seller" | "Super Saver" | "New Arrival" | "Limited" | "Hot Deal";
    labelColor?: string;
}