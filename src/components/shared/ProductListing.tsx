import { useEffect, useState } from "react";
import { Heart, Eye, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import ImageSlider from "./ImageSlider";
import type { UIProduct } from "@/types/Product";
import { cn } from "@/lib/utils";

interface productListingProps {
    product: UIProduct | null;
    index: number;
}

const ProductListing = ({ product, index }: productListingProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedWeight, setSelectedWeight] = useState<string>("1kg");
    const [isHovered, setIsHovered] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 75);

        return () => clearTimeout(timer);
    }, [index]);

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        setQuantity((prev) => prev + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        if (quantity > 1) setQuantity((prev) => prev - 1);
    };

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFavorite((prev) => !prev);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("Added to cart:", { product, quantity, selectedWeight });
    };

    if (!product || !isVisible) return <ProductPlaceholder />;

    return (
        <a
            className={cn(
                "invisible h-full w-full cursor-pointer group/main overflow-hidden",
                {
                    "visible animate-in fade-in-5": isVisible,
                }
            )}
            href={`/product/${product.productId}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="border border-gray-200 rounded-lg bg-white relative hover:shadow-xl transition-all duration-500">
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-t-lg overflow-hidden">
                    <ImageSlider url={product.productImage} isHovered={isHovered} />
                    
                    {/* Action Buttons */}
                    <div
                        className={cn(
                            "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-500",
                            isHovered
                                ? "translate-x-0 opacity-100"
                                : "translate-x-12 opacity-0"
                        )}
                    >
                        <Button
                            size="icon"
                            variant="secondary"
                            className={cn(
                                "h-9 w-9 bg-white border border-gray-200 hover:bg-red-50 transition-colors",
                                isFavorite && "bg-red-50 text-red-500"
                            )}
                            onClick={toggleFavorite}
                        >
                            <Heart
                                className={cn(
                                    "h-4 w-4 transition-all",
                                    isFavorite && "fill-red-500"
                                )}
                            />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 bg-white border border-gray-200 hover:bg-gray-50"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Product Content */}
                <div className="p-5">
                    {/* Product Title */}
                    <h3 className="text-lg font-semibold mb-3 group-hover/main:text-green-600 transition-colors duration-500 line-clamp-2">
                        {product.productName || "True berries seeds"}
                    </h3>

                    {/* Weight Selector & Quantity */}
                    <div className="flex items-center justify-between mb-3 gap-3">
                        <Select
                            value={selectedWeight}
                            onValueChange={setSelectedWeight}
                        >
                            <SelectTrigger
                                className="w-24 h-10"
                                onClick={(e) => e.preventDefault()}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1kg">1 kg</SelectItem>
                                <SelectItem value="2kg">2 kg</SelectItem>
                                <SelectItem value="3kg">3 kg</SelectItem>
                                <SelectItem value="5kg">5 kg</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-md">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 rounded-none"
                                onClick={handleDecrement}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 text-base font-medium min-w-[2rem] text-center">
                                {quantity}
                            </span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 rounded-none"
                                onClick={handleIncrement}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Price & Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-black text-base">
                            Rs. {product.productPrice.toLocaleString() || "2,800.00"}
                        </span>
                        {product.originalPrice && (
                            <span className="line-through text-gray-400 text-sm">
                                Rs. {product.originalPrice.toLocaleString()}
                            </span>
                        )}
                        <Badge
                            variant="secondary"
                            className="ml-auto bg-green-100 text-green-700 hover:bg-green-100 font-bold"
                        >
                            <Star className="h-3 w-3 mr-1 fill-green-700" />
                            {product.rating || "0"}
                        </Badge>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                        className="w-full bg-gray-100 hover:bg-black text-black hover:text-white transition-all duration-300 font-semibold"
                        onClick={handleAddToCart}
                    >
                        ADD TO CART
                        <ShoppingBag className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </a>
    );
};

const ProductPlaceholder = () => {
    return (
        <div className="flex flex-col w-full border border-gray-200 rounded-lg bg-white">
            <div className="relative bg-zinc-100 aspect-[4/3] w-full overflow-hidden rounded-t-lg">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <div className="flex gap-3 mb-3">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 flex-1" />
                </div>
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
};

export default ProductListing;