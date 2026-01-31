import ProductListing from "./ProductListing";
import type { UIProduct } from "@/types/Product";

const Products = ({ products }: { products?: Array<UIProduct> }) => {
    return (
        <div className="mt-6 flex justify-center items-center w-full">
            <div className="max-w-300 relative px-4">
                <div className="w-full grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 md:gap-y-10 lg:gap-x-8">
                    {products?.map((product, i) => (
                        <ProductListing
                            key={`product-${product.productId || i}`}
                            product={product}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;