import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import ImageSlider from "./ImageSlider";
import type { UIProduct } from "@/types/Product";
import { cn } from "@/lib/utils";
import { formatSmartValue } from "@/config/formatSmartValue";

interface productListingProps {
    product: UIProduct | null;
    index: number;
    mode?: "horizontal" | "vertical";
}

const ProductListing = ({
    product,
    index,
    mode = "vertical",
}: productListingProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, index * 75);

        return () => clearTimeout(timer);
    }, [index]);

    if (!product || !isVisible) return <ProductPlaceholder mode={mode} />;

    if (isVisible && product) {
        return (
            <a
                className={cn("invisible h-full w-full cursor-pointer group/main overflow-hidden", {
                    "visible animate-in fade-in-5": isVisible,
                })}
                href={`/product/${product.productId}`}
            >
                {mode === "horizontal" ? (
                    <div className="flex flex-row w-full gap-3 bg-primary/5 rounded-xl overflow-hidden min-h-[120px] sm:min-h-[140px]">
                        <div className=" h-auto w-48 sm:w-64 aspect-video">
                            <ImageSlider
                                url={product.productImage}
                                mode="horizontal"
                                imgClasses="absolute inset-0 h-full w-full object-contain"
                            />
                        </div>

                        <div className="flex flex-col justify-center py-3 pr-3 flex-1 min-w-0 gap-1.5">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-700 line-clamp-1">
                                {product.productName}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-tight">
                                {product.description}
                            </p>

                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap mt-1">
                                <span className="text-sm font-semibold text-gray-900">
                                    {formatSmartValue(product.price).includes("रू")
                                        ? formatSmartValue(product.price)
                                        : "रू. " + formatSmartValue(product.price)}
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                    उपलब्ध : {formatSmartValue(product.quantity)}
                                </span>
                                <span className="text-[10px] font-light text-gray-500">
                                    {formatDistanceToNow(product.createdAt ?? new Date(), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col w-full">
                        <ImageSlider url={product.productImage} mode="vertical" />

                        <div className="flex flex-col w-full px-2 pb-4 rounded-b-xl bg-primary/5">
                            <h3 className="mt-4 font-semibold text-base text-gray-700 line-clamp-2 flex flex-row items-center justify-between">
                                {product.productName}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                                {product.description}
                            </p>
                            <p className="mt-1 text-sm text-gray-900 flex flex-col md:flex-row items-start md:items-center justify-between">
                                <span className="font-semibold">
                                    {formatSmartValue(product.price).includes("रू")
                                        ? formatSmartValue(product.price)
                                        : "रू. " + formatSmartValue(product.price)}
                                </span>
                                <span className="font-medium">
                                    उपलब्ध : {formatSmartValue(product.quantity)}
                                </span>
                                <span className="text-[10px] font-light mt-1">
                                    {formatDistanceToNow(product.createdAt ?? new Date(), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </a>
        );
    }
};

const ProductPlaceholder = ({
    mode = "vertical",
}: {
    mode?: "horizontal" | "vertical";
}) => {
    if (mode === "horizontal") {
        return (
            <div className="flex flex-row w-full gap-3 bg-zinc-100 rounded-xl overflow-hidden min-h-[120px] sm:min-h-[140px]">
                <Skeleton className="shrink-0 w-32 sm:w-40 h-full rounded-none" />
                <div className="flex flex-col justify-center py-3 pr-3 flex-1 gap-1.5">
                    <Skeleton className="w-3/4 h-4 rounded-lg" />
                    <Skeleton className="w-full h-3 rounded-lg" />
                    <Skeleton className="w-full h-3 rounded-lg" />
                    <div className="flex items-center gap-2 mt-1">
                        <Skeleton className="w-16 h-3 rounded-lg" />
                        <Skeleton className="w-20 h-3 rounded-lg" />
                        <Skeleton className="w-16 h-3 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div className="relative bg-zinc-100 aspect-video w-full overflow-hidden rounded-xl">
                <Skeleton className="h-full w-full" />
            </div>
            <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
            <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
            <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
        </div>
    );
};

export default ProductListing;