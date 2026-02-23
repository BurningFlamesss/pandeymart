export interface Product {
    productId: string;
    productName: string;
    slug: string;
    productImages: Array<string>;
    productPrice?: number;
    originalPrice?: number;
    discountPercentage?: number;
    unit?: "kg" | "g" | "ltr" | "pcs" | string;
    quantity?: number;
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    inStock?: boolean;
    lowStockThreshold?: number;
    category?: string;
    tags?: Array<string>;
    rating?: number;
    description?: string;
    customizations?: Array<CustomizationGroup>;
    label?: "Best Seller" | "Super Saver" | "New Arrival" | "Limited" | "Hot Deal" | string;
    labelColor?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IndividualProduct {
    cartItemId: string;
    productId: string;
    basePrice: number;
    quantity: number;
    customizations?: Array<CustomizationGroup>
}

interface Customizations {
    label: string;
    additionalPrice: number;
}

export interface CustomizationGroup {
    title: string;
    options: Array<Customizations>;
}
