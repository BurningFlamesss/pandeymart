import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
    images: Array<string>;
    imgClasses?: string;
    isHovered?: boolean;
}

const ImageSlider = ({ images, imgClasses }: ImageSliderProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    const imageArray = images;
    const hasMultipleImages = imageArray.length > 1;

    const goToNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % imageArray.length);
    };

    const goToPrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    };

    return (
        <div 
            className="relative bg-white overflow-hidden h-full w-full group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                className={cn(
                    "h-full w-full object-cover transition-none",
                    imgClasses
                )}
                src={imageArray[currentImageIndex]}
                alt={`Product view ${currentImageIndex + 1}`}
            />

            {hasMultipleImages && (
                <>
                    <button
                        onClick={goToPrevious}
                        className={cn(
                            "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                            "bg-white/90 hover:bg-white border border-gray-200",
                            "rounded-full p-1.5 shadow-md",
                            "transition-all duration-300 cursor-pointer",
                            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                        )}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-4 w-4 text-gray-700" />
                    </button>

                    <button
                        onClick={goToNext}
                        className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                            "bg-white/90 hover:bg-white border border-gray-200",
                            "rounded-full p-1.5 shadow-md",
                            "transition-all duration-300 cursor-pointer",
                            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                        )}
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-4 w-4 text-gray-700" />
                    </button>

                    <div
                        className={cn(
                            "absolute bottom-3 left-1/2 -translate-x-1/2 z-10",
                            "flex gap-1.5 transition-opacity duration-300",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {imageArray.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentImageIndex(idx);
                                }}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    idx === currentImageIndex
                                        ? "bg-[#FAA016] w-6"
                                        : "bg-white/80 hover:bg-white"
                                )}
                                aria-label={`Go to image ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageSlider;