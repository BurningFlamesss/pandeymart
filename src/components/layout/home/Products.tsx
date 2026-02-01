import ProductListing from "./ProductListing";
import type { UIProduct } from "@/types/Product";
import SectionStarter from "@/components/shared/SectionStarter";

const Products = ({ products }: { products?: Array<UIProduct> }) => {
    return (
        <div className="mt-6 flex justify-center items-center w-full px-4">
            <div className="w-full max-w-300">
                <SectionStarter title="Top Selling Products" src="/sectionstarter/skincare.png" description="Fresh and Fabulous From Herbs to Face" ></SectionStarter>
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