import ProductListing from "./ProductListing";
import type { Product } from "@/types/Product";

const Products = ({ products, children }: { products?: Array<Product>, children?: React.ReactNode }) => {
    return (
        <div className="flex justify-center items-center w-full px-4 py-8 lg:py-16">
            <div className="w-full max-w-300">
                {children}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3">
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