import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import type { UIProduct } from "@/types/Product";
import { cn } from "@/lib/utils";

interface ProductDetailModalProps {
    product: UIProduct;
    isOpen: boolean;
    onClose: () => void;
}

const faqs = [
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return window for all products. Items must be unused and in original packaging. Return shipping is free for defective items."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout. Free shipping on orders over Rs. 2,000."
    },
    {
        question: "Are your products organic certified?",
        answer: "Yes, all our organic products are certified by recognized organic certification bodies. Certificates are available upon request."
    },
    {
        question: "Do you offer bulk discounts?",
        answer: "Yes! Orders of 10kg or more receive a 15% discount. Contact our customer service for custom bulk pricing on larger orders."
    },
    {
        question: "How should I store the products?",
        answer: "Store in a cool, dry place away from direct sunlight. Refrigerate after opening if indicated on the packaging. Check product labels for specific storage instructions."
    }
];

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("1 KG");
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const images = product.productImages || [product.productImage];
    const price = product.productPrice || parseFloat(product.price || "0");

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1);
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center",
                "bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            )}
            onClick={onClose}
        >
            <div
                className={cn(
                    "relative bg-white max-w-6xl w-full mx-4 rounded-lg p-5 lg:p-10",
                    "flex lg:flex-row flex-col overflow-y-hidden max-h-screen gap-10",
                    "transform transition-all duration-300 ease-out",
                    isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    size="icon"
                    className="absolute top-0 right-0 z-50 bg-[#FAA016] hover:bg-black text-white rounded-none rounded-bl-lg"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <div className="w-full lg:w-1/2 h-full">
                    <div
                        className="overflow-hidden border border-gray-200 rounded-lg relative"
                        onMouseEnter={() => setIsZooming(true)}
                        onMouseLeave={() => setIsZooming(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <img
                            alt={product.productName}
                            className={cn(
                                "w-full h-112.5 lg:h-112.5 object-cover transition-transform duration-200",
                                isZooming && "scale-150 cursor-zoom-in"
                            )}
                            src={images[selectedImage]}
                            style={
                                isZooming
                                    ? {
                                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                    }
                                    : undefined
                            }
                        />
                    </div>

                    {images.length > 1 && (
                        <div className="flex justify-between items-center overflow-x-auto gap-2 mt-4">
                            {images.map((image, idx) => (
                                <img
                                    key={idx}
                                    alt={`${product.productName} view ${idx + 1}`}
                                    className={cn(
                                        "border-2 rounded-lg cursor-pointer object-cover h-24 w-full transition-all",
                                        selectedImage === idx
                                            ? "border-[#FAA016]"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                    src={image}
                                    onClick={() => setSelectedImage(idx)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-1/2 h-full lg:overflow-y-auto lg:max-h-150 overflow-clip">
                    <h3 className="text-3xl font-bold mb-2">{product.productName}</h3>
                    <p className="mb-3 text-gray-600">
                        Tax included. Shipping calculated at checkout.
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl font-bold text-[#FAA016]">
                            Rs. {price.toLocaleString()}
                        </div>
                        {product.originalPrice && (
                            <div className="text-xl text-gray-400 line-through">
                                Rs. {product.originalPrice.toLocaleString()}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 border-b border-gray-200 pb-5 pt-2 mb-4">
                        <div className="relative w-4 h-4">
                            <div className="absolute inset-0 rounded-full bg-green-400/30" />
                            <div className="absolute inset-1 rounded-full bg-green-500" />
                        </div>
                        <span className="text-gray-700">
                            {product.quantity
                                ? `${product.quantity} in stock`
                                : "In stock"}
                        </span>
                    </div>

                    <p className="mb-4 text-gray-600 leading-relaxed">
                        {product.description ||
                            "Lorem Ipsum is simply dummy text of the printing and typesetting industry dummy text and typesetting industry"}
                    </p>

                    <div className="mb-4">
                        <div className="flex items-center mb-3">
                            <strong className="text-base">Size:</strong>
                            <span className="ml-2 text-sm font-medium text-gray-500">
                                {selectedSize}
                            </span>
                        </div>
                        <ul className="flex gap-2">
                            {["1 KG", "2 KG", "3 KG", "5 KG"].map((size) => (
                                <li
                                    key={size}
                                    className={cn(
                                        "border-2 rounded-lg px-4 py-2 cursor-pointer transition-all font-medium",
                                        selectedSize === size
                                            ? "bg-black text-white border-black"
                                            : "border-gray-200 hover:border-[#FAA016] hover:text-[#FAA016]"
                                    )}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center border-2 border-gray-200 rounded-lg w-fit mb-5">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-12 w-12 rounded-none hover:bg-gray-100"
                            onClick={handleDecrement}
                        >
                            <Minus className="h-5 w-5" />
                        </Button>
                        <span className="px-6 text-lg font-semibold min-w-12 text-center">
                            {quantity}
                        </span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-12 w-12 rounded-none hover:bg-gray-100"
                            onClick={handleIncrement}
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="w-full flex flex-col sm:flex-row gap-3 mb-6">
                        <Button
                            className="bg-[#FAA016] hover:bg-black text-white px-6 py-6 rounded-lg transition-all duration-300 font-bold w-full text-base"
                            onClick={() => console.log("Add to cart", { product, quantity, selectedSize })}
                        >
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            ADD TO CART
                        </Button>
                        <Button
                            className="bg-black hover:bg-[#FAA016] text-white px-6 py-6 rounded-lg transition-all duration-300 w-full font-bold text-base"
                            onClick={() => console.log("Buy now", { product, quantity, selectedSize })}
                        >
                            BUY IT NOW
                        </Button>
                    </div>

                    <div className="py-5 border-t border-gray-200">
                        <span className="text-xl font-semibold mb-3 block">Payment & Security</span>
                        <div className="flex gap-2 items-center mb-4 flex-wrap">
                            <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs font-bold">
                                VISA
                            </div>
                            <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs font-bold">
                                MC
                            </div>
                            <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs font-bold">
                                AMEX
                            </div>
                            <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs font-bold">
                                PP
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            Your payment information is processed securely. We do not store credit
                            card details nor have access to your credit card information.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border border-gray-200 p-5 rounded-lg mb-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-[#FAA016]/10 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-[#FAA016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h6 className="font-semibold text-sm">Store pickup</h6>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-[#FAA016]/10 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-[#FAA016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h6 className="font-semibold text-sm">Return policy</h6>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-full bg-[#FAA016]/10 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-[#FAA016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h6 className="font-semibold text-sm">Money back</h6>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-xl font-semibold mb-4">Frequently Asked Questions</h4>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-medium text-gray-900">{faq.question}</span>
                                        <ChevronDown
                                            className={cn(
                                                "h-5 w-5 text-gray-500 transition-transform duration-200",
                                                openFaqIndex === index && "transform rotate-180"
                                            )}
                                        />
                                    </button>
                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            openFaqIndex === index
                                                ? "max-h-96 opacity-100"
                                                : "max-h-0 opacity-0"
                                        )}
                                    >
                                        <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;