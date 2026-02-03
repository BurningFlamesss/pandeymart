import { useEffect, useMemo, useState } from "react";
import { Heart, Eye, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import ProductDetailModal from "./ProductDetailModal";
import type { Product } from "@/types/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import ImageSlider from "@/components/shared/ImageSlider";

interface productListingProps {
    product: Product | null;
    index: number;
}

const ProductListing = ({ product, index }: productListingProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedCustomizations, setSelectedCustomizations] =
        useState<Record<string, string>>({});
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const maxQty = product?.maxOrderQuantity ?? product?.quantity ?? 1;
    const minQty = product?.minOrderQuantity ?? 1;


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 75);

        return () => clearTimeout(timer);
    }, [index]);

    useEffect(() => {
        if (!product?.customizations?.length) return;

        const defaults: Record<string, string> = {};

        product.customizations.forEach(group => {
            if (group.options.length) {
                defaults[group.title] = group.options[0].label;
            }
        });

        setSelectedCustomizations(defaults);
    }, [product]);

    const customizationDelta = useMemo(() => {
        if (!product?.customizations) return 0;

        return product.customizations.reduce((total, group) => {
            const selectedLabel = selectedCustomizations[group.title];
            if (!selectedLabel) return total;

            const option = group.options.find(
                opt => opt.label === selectedLabel
            );

            return total + (option?.additionalPrice ?? 0);
        }, 0);
    }, [product, selectedCustomizations]);

    const originalUnitPrice =
    (product?.originalPrice ?? product?.productPrice ?? 0) + customizationDelta;
    const finalUnitPrice =
    (product?.productPrice ?? 0) + customizationDelta;
    const finalTotalPrice = finalUnitPrice * quantity;
    const originalTotalPrice = originalUnitPrice * quantity;


    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        setQuantity(prev => Math.min(prev + 1, maxQty));
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        setQuantity(prev => Math.max(prev - 1, minQty));
    };

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFavorite((prev) => !prev);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        console.log("Added to cart:", {
            productId: product?.productId,
            quantity,
            customizations: selectedCustomizations,
        });
    };


    const openModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    if (!product || !isVisible) return <ProductPlaceholder />;

    const getLabelColor = (label?: string) => {
        switch (label) {
            case "Best Seller":
                return product.labelColor || "bg-blue-500";
            case "Super Saver":
                return product.labelColor || "bg-green-500";
            case "New Arrival":
                return product.labelColor || "bg-purple-500";
            case "Limited":
                return product.labelColor || "bg-red-500";
            case "Hot Deal":
                return product.labelColor || "bg-[#FAA016]";
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
                                        (product.quantity) > 50
                                            ? "border-green-300 text-green-700 bg-green-50"
                                            : (product.quantity) > 0
                                                ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                                                : "border-red-300 text-red-700 bg-red-50"
                                    )}
                                >
                                    {(product.quantity) > 0
                                        ? `${product.quantity} units available`
                                        : product.inStock ? "Available" : "Out of stock"}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center justify-between mb-3 gap-3 h-10 overflow-x-auto overflow-y-hidden">
                            {product.customizations?.length ? (
                                product.customizations.map((group) => (
                                    <Select
                                        key={group.title}
                                        value={selectedCustomizations[group.title]}
                                        onValueChange={(value) =>
                                            setSelectedCustomizations(prev => ({
                                                ...prev,
                                                [group.title]: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="w-28 h-10">
                                            <SelectValue placeholder={group.title} />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{group.title}</SelectLabel>
                                                {group.options.map(option => (
                                                    <SelectItem
                                                        key={option.label}
                                                        value={option.label}
                                                        className="cursor-pointer"
                                                    >
                                                        {option.label}
                                                        {option.additionalPrice !== 0 && (
                                                        <span className="ml-2 text-xs text-gray-500">
                                                            ({option.additionalPrice > 0 ? "+" : ""}
                                                            Rs. {option.additionalPrice})/ 1unit
                                                        </span>
                                                    )}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                ))
                            ) : (
                                !product.customizations?.length && (
                                    <Select
                                        value={quantity.toString()}
                                        onValueChange={(v) => setQuantity(Number(v))}
                                    >
                                        <SelectTrigger className="w-24 h-10">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {Array.from(new Set([minQty, maxQty])).map(qty => (
                                                <SelectItem key={qty} value={qty.toString()}>
                                                    {qty} units
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )

                            )}


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
                            {product.productPrice && (
                                <span className="font-semibold text-black text-base">
                                    Rs. {(finalTotalPrice).toLocaleString()}
                                </span>
                            )}
                            {product.originalPrice && (
                                <span className="line-through text-gray-400 text-sm">
                                    Rs. {(originalTotalPrice).toLocaleString()}
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