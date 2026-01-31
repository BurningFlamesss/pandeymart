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
import ProductDetailModal from "./ProductDetailModal";
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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

    const openModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    if (!product || !isVisible) return <ProductPlaceholder />;

    const getLabelColor = (label?: string) => {
        switch (label) {
            case "Best Seller":
                return "bg-blue-500";
            case "Super Saver":
                return "bg-green-500";
            case "New Arrival":
                return "bg-purple-500";
            case "Limited":
                return "bg-red-500";
            case "Hot Deal":
                return "bg-[#FAA016]";
            default:
                return product.labelColor || "bg-[#FAA016]";
        }
    };

    return (
        <>
            <a
                className={cn(
                    "invisible h-full w-full cursor-pointer group/main overflow-hidden block",
                    {
                        "visible animate-in fade-in-5": isVisible,
                    }
                )}
                href={`/product/${product.productId}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="border border-gray-200 rounded-lg bg-white relative hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                    {product.label && (
                        <span
                            className={cn(
                                "absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-md z-10",
                                getLabelColor(product.label)
                            )}
                        >
                            {product.label}
                        </span>
                    )}

                    <div className="relative w-full h-64 rounded-t-lg overflow-hidden shrink-0">
                        <ImageSlider
                            url={product.productImage}
                            images={product.productImages}
                        />

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
                                    "h-9 w-9 bg-white border border-gray-200 hover:bg-red-50 transition-colors cursor-pointer",
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
                                className="h-9 w-9 bg-white border border-gray-200 hover:bg-white hover:border-[#FAA016] hover:text-[#FAA016] cursor-pointer"
                                onClick={openModal}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-5 flex flex-col grow">
                        <h3 className="text-lg font-semibold mb-2 group-hover/main:text-[#FAA016] transition-colors duration-500 line-clamp-2 min-h-8">
                            {product.productName || "Product Name"}
                        </h3>

                        <div className="mb-3 h-5">
                            {product.quantity && (
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-xs",
                                        parseInt(product.quantity) > 50
                                            ? "border-green-300 text-green-700 bg-green-50"
                                            : parseInt(product.quantity) > 0
                                            ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                                            : "border-red-300 text-red-700 bg-red-50"
                                    )}
                                >
                                    {parseInt(product.quantity) > 0
                                        ? `${product.quantity} units available`
                                        : "Out of stock"}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center justify-between mb-3 gap-3 h-10">
                            <Select
                                value={selectedWeight}
                                onValueChange={setSelectedWeight}
                            >
                                <SelectTrigger
                                    className="w-24 h-10 cursor-pointer"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className="cursor-pointer" value="1kg">1 kg</SelectItem>
                                    <SelectItem className="cursor-pointer" value="2kg">2 kg</SelectItem>
                                    <SelectItem className="cursor-pointer" value="3kg">3 kg</SelectItem>
                                    <SelectItem className="cursor-pointer" value="5kg">5 kg</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center border border-gray-200 rounded-md h-10">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 rounded-none hover:bg-gray-100 cursor-pointer"
                                    onClick={handleDecrement}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-3 text-base font-medium w-12 text-center">
                                    {quantity}
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 rounded-none hover:bg-gray-100 cursor-pointer"
                                    onClick={handleIncrement}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3 h-8">
                            <span className="font-semibold text-black text-base">
                                Rs.{" "}
                                {(
                                    product.productPrice || parseFloat(product.price || "0")
                                ).toLocaleString()}
                            </span>
                            {product.originalPrice && (
                                <span className="line-through text-gray-400 text-sm">
                                    Rs. {product.originalPrice.toLocaleString()}
                                </span>
                            )}
                            <Badge
                                variant="secondary"
                                className="ml-auto bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-bold h-7"
                            >
                                <Star className="h-3 w-3 mr-1 fill-yellow-700" />
                                {product.rating?.toFixed(1) || "0"}
                            </Badge>
                        </div>

                        <Button
                            className="w-full bg-gray-100 hover:bg-black text-black hover:text-white transition-all duration-300 font-semibold mt-auto cursor-pointer"
                            onClick={handleAddToCart}
                        >
                            ADD TO CART
                            <ShoppingBag className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </a>

            {product && (
                <ProductDetailModal
                    product={product}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

const ProductPlaceholder = () => {
    return (
        <div className="flex flex-col w-full border border-gray-200 rounded-lg bg-white h-full">
            <div className="relative bg-zinc-100 h-64 w-full overflow-hidden rounded-t-lg shrink-0">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="p-5 flex flex-col grow">
                <Skeleton className="h-14 w-3/4 mb-3" />
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="flex gap-3 mb-3">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 flex-1" />
                </div>
                <Skeleton className="h-8 w-full mb-3" />
                <Skeleton className="h-10 w-full mt-auto" />
            </div>
        </div>
    );
};

export default ProductListing;