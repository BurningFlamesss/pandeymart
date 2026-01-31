import ProductListing from "./ProductListing";
import type { UIProduct } from "@/types/Product";

const Products = ({
    products,
    mode = "vertical",
}: {
    products?: Array<UIProduct>;
    mode: "horizontal" | "vertical";
}) => {
    return (
        <div className="relative">
            <div className="mt-6 flex items-center w-full">
                {mode === "horizontal" ? (
                    <div className="w-full flex flex-col gap-4">
                        {products?.map((product, i) => (
                            <ProductListing
                                key={`product-${i}`}
                                product={product}
                                index={i}
                                mode="horizontal"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-2 xl:grid-cols-3 md:gap-y-10 lg:gap-x-8">
                        {products?.map((product, i) => (
                            <ProductListing
                                key={`product-${i}`}
                                product={product}
                                index={i}
                                mode="vertical"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;