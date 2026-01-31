export interface UIProduct {
    productId: string; //
    productName: string; //
    productImages: Array<string>; //
    productPrice?: number; // 
    originalPrice?: number; // 
    quantity?: string; //
    inStock?: boolean;
    description?: string; //
    category?: string;
    rating?: number; //
    customizations?: Array<Customizations>;
    createdAt?: string;
    label?: "Best Seller" | "Super Saver" | "New Arrival" | "Limited" | "Hot Deal"; //
    labelColor?: string; // 
}

interface Customizations {
    label: string;
    additionalPrice: number;
}