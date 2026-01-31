export interface UIProduct {
    productId: string;
    productName: string;
    slug?: string;
    productImages: Array<string>;
    productPrice?: number;
    originalPrice?: number;
    discountPercentage?: number;
    unit?: "kg" | "g" | "ltr" | "pcs";
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


interface Customizations {
    label: string;
    additionalPrice: number;
}

interface CustomizationGroup {
    title: string;
    options: Array<Customizations>;
}
