import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { IndividualProduct, Product } from "@/types/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ImageSlider from "@/components/shared/ImageSlider";
import { useCart } from "@/hooks/use-cart";

interface productListingProps {
    product: Product | null;
    cartItem: IndividualProduct;
    index: number;
}

const CartProductLists = ({ product, cartItem, index }: productListingProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const { updateQuantity, removeFromCart } = useCart()
    const quantity = cartItem.quantity;
    const selectedCustomizations = useMemo(() => {
        if (!cartItem.customizations?.length) return {};

        const map: Record<string, string> = {};

        cartItem.customizations.forEach(group => {
            group.options.forEach(option => {
                map[group.title] = option.label;
            });
        });

        return map;
    }, [cartItem.customizations]);


    const maxQty = product?.maxOrderQuantity ?? product?.quantity ?? 1;
    const minQty = product?.minOrderQuantity ?? 1;


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 75);

        return () => clearTimeout(timer);
    }, [index]);

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
        updateQuantity(cartItem.cartItemId, Math.min(quantity + 1, maxQty));
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        updateQuantity(cartItem.cartItemId, Math.max(quantity - 1, minQty));
    };

    if (!product || !isVisible) return <CartProductPlaceholder />;

    return (
        <>
            <div
                className={cn(
                    "invisible w-full",
                    {
                        "visible animate-in fade-in-5": isVisible,
                    }
                )}
            >
                <div className="flex gap-4 p-4 bg-white border border-gray-200 transition-all duration-300">
                    <Link
                        to={`/product/$productId`}
                        params={{ productId: product.productId }}
                        className="shrink-0 flex flex-col items-center justify-center max-w-28 relative"
                    >
                        <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100">
                            <ImageSlider images={product.productImages} />
                        </div>

                            {cartItem.customizations?.length ? (
                                <div className="absolute top-1 mx-auto mt-1 flex flex-wrap gap-1 text-[10px] flex-row items-center justify-center">
                                    {cartItem.customizations.map(group =>
                                        group.options.map(option => (
                                            <span
                                                key={`${group.title}-${option.label}`}
                                                className="px-2 py-0.5 bg-black/50 rounded text-white"
                                            >
                                                {option.label}
                                            </span>
                                        ))
                                    )}
                                </div>
                            ) : null}
                    </Link>

                    <div className="flex flex-col flex-1 min-w-0">



                        <Link
                            to={`/product/$productId`}
                            params={{ productId: product.productId }}
                        >
                            <h3 className="text-sm font-semibold text-gray-800 hover:text-[#FAA016] transition-colors line-clamp-2">
                                {product.productName || "Product Name"}
                            </h3>
                        </Link>

                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center text-yellow-500 text-xs">
                                <Star className="h-3 w-3 fill-yellow-500 mr-1" />
                                <span className="font-medium">
                                    {product.rating?.toFixed(1) || "0"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <span className="font-semibold text-gray-900 text-sm">
                                Rs. {finalTotalPrice.toLocaleString()}
                            </span>

                            {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                    Rs. {originalTotalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-3">

                            <div className="flex items-center border border-gray-200 rounded-md h-9">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-none hover:bg-gray-100 cursor-pointer"
                                    onClick={handleDecrement}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>

                                <span className="px-3 text-sm font-medium w-10 text-center">
                                    {quantity}
                                </span>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-none hover:bg-gray-100 cursor-pointer"
                                    onClick={handleIncrement}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFromCart(cartItem.cartItemId)
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            </div >


        </>
    );
};

const CartProductPlaceholder = () => {
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

export default CartProductLists;